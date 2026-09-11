// 위치기반 관광지 조회 API Route
// 한국관광공사 TourAPI 4.0을 서버에서 호출하여 프록시합니다.
// API 키는 절대 클라이언트에 노출되지 않습니다.

import { NextRequest, NextResponse } from 'next/server';

const TOUR_API_BASE = 'https://apis.data.go.kr/B551011/KorService2/locationBasedList2';
const RADIUS = 500; // 반경 500미터
const CONTENT_TYPES = [12, 14, 39, 32]; // 관광지, 문화시설, 음식점, 숙박

export async function GET(request: NextRequest) {
  const serviceKey = process.env.TOUR_API_SERVICE_KEY;

  if (!serviceKey) {
    return NextResponse.json(
      { success: false, error: 'TOUR_API_SERVICE_KEY 환경변수가 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  const { searchParams } = request.nextUrl;
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json(
      { success: false, error: 'lat, lng 파라미터가 필요합니다.' },
      { status: 400 }
    );
  }

  try {
    // 4개 카테고리 동시 조회
    const fetchPromises = CONTENT_TYPES.map(async (contentTypeId) => {
      const url = new URL(TOUR_API_BASE);
      url.searchParams.set('serviceKey', serviceKey);
      url.searchParams.set('numOfRows', '10');
      url.searchParams.set('pageNo', '1');
      url.searchParams.set('MobileOS', 'ETC');
      url.searchParams.set('MobileApp', 'GwangjuEcoTour');
      url.searchParams.set('_type', 'json');
      url.searchParams.set('mapX', lng);
      url.searchParams.set('mapY', lat);
      url.searchParams.set('radius', String(RADIUS));
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
    });

    const results = await Promise.all(fetchPromises);
    const allPlaces = results.flat();

    // 거리순 정렬
    allPlaces.sort((a, b) => a.dist - b.dist);

    return NextResponse.json({ success: true, data: allPlaces });
  } catch (error) {
    console.error('[Tourism API Error]', error);
    return NextResponse.json(
      { success: false, error: '관광지 정보를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
