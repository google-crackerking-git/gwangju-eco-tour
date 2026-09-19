import { TourismPlace } from '@/types';

export async function fetchHistorical518(): Promise<TourismPlace[]> {
  const rawKey = process.env.TOUR_API_SERVICE_KEY || '';
  const serviceKey = rawKey.includes('%') ? rawKey : encodeURIComponent(rawKey);
  const kakaoKey = process.env.KAKAO_CLIENT_ID || '';

  if (!serviceKey || !kakaoKey) return [];

  try {
    const url = \https://api.odcloud.kr/api/15139075/v1/uddi:e27620e6-dff2-4ead-8c0c-f9819b77de99?page=1&perPage=50&serviceKey=\\;
    
    const response = await fetch(url, { next: { revalidate: 86400 } });
    if (!response.ok) return [];

    const json = await response.json();
    if (!json.data || !Array.isArray(json.data)) return [];

    const places = await Promise.all(json.data.map(async (item: any, idx: number) => {
      const name = item['사 적 지 명'] || '';
      let address = item['사적지 세부 위치'] || '';
      
      let lat = 0;
      let lng = 0;

      // 주소가 있는 경우 카카오 로컬 API로 좌표 변환
      if (address) {
        try {
          const geoRes = await fetch(\https://dapi.kakao.com/v2/local/search/address.json?query=\\, {
            headers: { Authorization: \KakaoAK \\ },
            next: { revalidate: 86400 }
          });
          if (geoRes.ok) {
            const geoJson = await geoRes.json();
            if (geoJson.documents && geoJson.documents.length > 0) {
              lat = parseFloat(geoJson.documents[0].y);
              lng = parseFloat(geoJson.documents[0].x);
            }
          }
        } catch (e) {
          console.error('[518 Geocode Error]', e);
        }
      }

      return {
        contentId: \518_historical_\\,
        contentTypeId: 12, // 관광지 분류
        title: \[518사적지] \\,
        address: address,
        lat,
        lng,
        imageUrl: '',
        tel: ''
      } as TourismPlace;
    }));

    // 좌표가 찾아진 것만 반환
    return places.filter(p => p.lat !== 0 && p.lng !== 0);
  } catch (error) {
    console.error('[518 API Error]', error);
    return [];
  }
}

export function mergeHistorical518(existing: any[], newItems: TourismPlace[]) {
  // 간단히 뒤에 추가
  return [...existing, ...newItems];
}
