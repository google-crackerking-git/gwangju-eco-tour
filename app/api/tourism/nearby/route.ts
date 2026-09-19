// 위치기반 관광지 조회 API Route
// 한국관광공사 TourAPI 4.0을 서버에서 호출하여 프록시합니다.
// API 키는 절대 클라이언트에 노출되지 않습니다.

import { NextRequest, NextResponse } from 'next/server';
import { fetchOdcloudAttractions, mergeOdcloudData } from '@/lib/odcloud';
import { fetchJnTourInfo, mergeJnTourData } from '@/lib/jntour';
import { fetchHeritagePlaces, mergeHeritageData } from '@/lib/heritage';
import { fetchHistorical518, mergeHistorical518 } from '@/lib/historical518';
import { fetchMarketShops, mergeMarketData } from '@/lib/market';

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

const TOUR_API_BASE = 'https://apis.data.go.kr/B551011/KorService2/locationBasedList2';
const RADIUS = 300; // 반경 300미터
const CONTENT_TYPES = [12, 14, 39, 32]; // 관광지, 문화시설, 음식점, 숙박

export async function GET(request: NextRequest) {
  const rawKey = process.env.TOUR_API_SERVICE_KEY || '';
  const serviceKey = rawKey.includes('%') ? rawKey : encodeURIComponent(rawKey);

  if (!serviceKey) {
    return NextResponse.json(
      { success: false, error: 'TOUR_API_SERVICE_KEY 환경변수가 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  const { searchParams } = request.nextUrl;
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const radiusParam = searchParams.get('radius') || '300'; // 기본 300, 지하철은 500

  if (!lat || !lng) {
    return NextResponse.json(
      { success: false, error: 'lat, lng 파라미터가 필요합니다.' },
      { status: 400 }
    );
  }

  try {
    // 4개 카테고리 동시 조회 + ODCloud, JnTour, Heritage, 518, Market
    const [odcloudItems, jnTourItems, heritageItems, historical518Items, marketItems, ...results] = await Promise.all([
      fetchOdcloudAttractions(),
      fetchJnTourInfo(),
      fetchHeritagePlaces(),
      fetchHistorical518(),
      fetchMarketShops(),
      ...CONTENT_TYPES.map(async (contentTypeId) => {
        const url = new URL(TOUR_API_BASE);
        url.searchParams.set('serviceKey', serviceKey);
        url.searchParams.set('numOfRows', '20'); // 더 넓은 반경을 위해 20개로 증가
        url.searchParams.set('pageNo', '1');
        url.searchParams.set('MobileOS', 'ETC');
        url.searchParams.set('MobileApp', 'GwangjuEcoTour');
        url.searchParams.set('_type', 'json');
        url.searchParams.set('mapX', lng);
        url.searchParams.set('mapY', lat);
        url.searchParams.set('radius', radiusParam);
        url.searchParams.set('contentTypeId', String(contentTypeId));

        const response = await fetch(url.toString(), {
          next: { revalidate: 1800 }, // 30분 캐시
        });

        if (!response.ok) return [];

        const data = await response.json();
        const items = data?.response?.body?.items?.item ?? [];
        const itemArray = Array.isArray(items) ? items : items ? [items] : [];

        return itemArray.map((item: Record<string, unknown>) => ({
          contentId: String(item.contentid ?? ''),
          contentTypeId,
          title: String(item.title ?? ''),
          addr1: String(item.addr1 ?? ''),
          addr2: String(item.addr2 ?? ''),
          firstimage: String(item.firstimage ?? ''),
          firstimage2: String(item.firstimage2 ?? ''),
          mapx: parseFloat(String(item.mapx ?? '0')),
          mapy: parseFloat(String(item.mapy ?? '0')),
          dist: parseFloat(String(item.dist ?? '0')),
          tel: String(item.tel ?? ''),
        }));
      }),
    ]);

    let allPlaces = results.flat();
    allPlaces = mergeOdcloudData(allPlaces, odcloudItems);
    allPlaces = mergeJnTourData(allPlaces, jnTourItems);
    allPlaces = mergeHeritageData(allPlaces, heritageItems);
    allPlaces = mergeHistorical518(allPlaces, historical518Items);
    allPlaces = mergeMarketData(allPlaces, marketItems);

    const centerLat = parseFloat(lat);
    const centerLng = parseFloat(lng);
    const maxRadius = parseFloat(radiusParam);

    // Calculate dist for merged items if missing and filter by maxRadius
    allPlaces = allPlaces.filter((place: any) => {
      if (place.mapy && place.mapx && (place.dist === undefined || place.dist === 0 || isNaN(place.dist))) {
        place.dist = getDistance(centerLat, centerLng, place.mapy, place.mapx);
      }
      return place.dist <= maxRadius;
    });

    // 거리순 정렬
    allPlaces.sort((a: any, b: any) => a.dist - b.dist);

    return NextResponse.json({ success: true, data: allPlaces });
  } catch (error) {
    console.error('[Tourism API Error]', error);
    return NextResponse.json(
      { success: false, error: '관광지 정보를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
