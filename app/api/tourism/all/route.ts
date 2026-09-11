import { NextResponse } from 'next/server';

const TOUR_API_BASE = 'https://apis.data.go.kr/B551011/KorService2/areaBasedList2';
const CONTENT_TYPES = [12, 14, 39, 32]; // 관광지, 문화시설, 음식점, 숙박
const AREA_CODE = 5; // 광주광역시

export async function GET() {
  const serviceKey = process.env.TOUR_API_SERVICE_KEY;

  if (!serviceKey) {
    return NextResponse.json({ success: false, error: 'TOUR_API_SERVICE_KEY 환경변수가 설정되지 않았습니다.' }, { status: 500 });
  }

  try {
    const fetchPromises = CONTENT_TYPES.map(async (contentTypeId) => {
      const url = new URL(TOUR_API_BASE);
      url.searchParams.set('serviceKey', serviceKey);
      url.searchParams.set('numOfRows', '500'); // 충분히 큰 수
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
    });

    const results = await Promise.all(fetchPromises);
    const allPlaces = results.flat();

    return NextResponse.json({ success: true, data: allPlaces });
  } catch (error) {
    console.error('[Tourism All API Error]', error);
    return NextResponse.json({ success: false, error: '관광지 전체 정보를 불러오는데 실패했습니다.' }, { status: 500 });
  }
}
