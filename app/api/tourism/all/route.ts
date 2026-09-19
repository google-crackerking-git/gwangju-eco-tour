import { NextRequest, NextResponse } from 'next/server';
import { fetchOdcloudAttractions, mergeOdcloudData } from '@/lib/odcloud';
import { fetchJnTourInfo, mergeJnTourData } from '@/lib/jntour';
import { fetchHeritagePlaces, mergeHeritageData } from '@/lib/heritage';
import { fetchHistorical518, mergeHistorical518 } from '@/lib/historical518';
import { fetchPathPlaces, mergePathData } from '@/lib/path';
import { fetchMarkets, mergeMarkets } from '@/lib/market';

const TOUR_API_BASE = 'https://apis.data.go.kr/B551011/KorService2/areaBasedList2';
const CONTENT_TYPES = [12, 14, 39, 32, 38]; // 관광지, 문화시설, 음식점, 숙박, 쇼핑
const AREA_CODE = 5; // 광주광역시

export async function GET(request: NextRequest) {
  const rawKey = process.env.TOUR_API_SERVICE_KEY || '';
  const serviceKey = rawKey.includes('%') ? rawKey : encodeURIComponent(rawKey);

  if (!serviceKey) {
    return NextResponse.json({ success: false, error: 'API KEY missing' }, { status: 500 });
  }

  try {
    const [odcloudItems, jnTourItems, heritageItems, historical518Items, pathItems, marketItems, ...results] = await Promise.all([
      fetchOdcloudAttractions(),
      fetchJnTourInfo(),
      fetchHeritagePlaces(),
      fetchHistorical518(),
      fetchPathPlaces(),
      fetchMarkets(),
      ...CONTENT_TYPES.map(async (contentTypeId) => {
        const url = new URL(TOUR_API_BASE);
        url.searchParams.set('serviceKey', serviceKey);
        url.searchParams.set('numOfRows', '500'); // 충분히 크게
        url.searchParams.set('pageNo', '1');
        url.searchParams.set('MobileOS', 'ETC');
        url.searchParams.set('MobileApp', 'GwangjuEcoTour');
        url.searchParams.set('_type', 'json');
        url.searchParams.set('areaCode', String(AREA_CODE));
        url.searchParams.set('contentTypeId', String(contentTypeId));

        const response = await fetch(url.toString(), {
          next: { revalidate: 86400 }, // 24시간 캐시
        });

        if (!response.ok) return [];

        const data = await response.json();
        const items = data?.response?.body?.items?.item ?? [];
        const itemArray = Array.isArray(items) ? items : items ? [items] : [];

        return itemArray.map((item: any) => ({
          contentId: String(item.contentid ?? ''),
          contentTypeId,
          title: String(item.title ?? ''),
          addr1: String(item.addr1 ?? ''),
          addr2: String(item.addr2 ?? ''),
          firstimage: String(item.firstimage ?? ''),
          firstimage2: String(item.firstimage2 ?? ''),
          mapx: parseFloat(String(item.mapx ?? '0')),
          mapy: parseFloat(String(item.mapy ?? '0')),
          tel: String(item.tel ?? ''),
        }));
      }),
    ]);

    let allPlaces = results.flat();
    allPlaces = mergeOdcloudData(allPlaces, odcloudItems);
    allPlaces = mergeJnTourData(allPlaces, jnTourItems);
    allPlaces = mergeHeritageData(allPlaces, heritageItems);
    allPlaces = mergeHistorical518(allPlaces, historical518Items);
    allPlaces = mergePathData(allPlaces, pathItems);
    allPlaces = mergeMarkets(allPlaces, marketItems);

    return NextResponse.json({ success: true, data: allPlaces });
  } catch (error) {
    console.error('[Tourism All API Error]', error);
    return NextResponse.json({ success: false, error: '관광지 전체 정보를 불러오는데 실패했습니다.' }, { status: 500 });
  }
}
