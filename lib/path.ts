import { TourismPlace } from '@/types';

export async function fetchPathPlaces(): Promise<TourismPlace[]> {
  const rawKey = process.env.TOUR_API_SERVICE_KEY || '';
  const serviceKey = rawKey.includes('%') ? rawKey : encodeURIComponent(rawKey);
  const kakaoKey = process.env.KAKAO_CLIENT_ID || '';

  if (!serviceKey || !kakaoKey) return [];

  try {
    let allItems: any[] = [];
    // 2페이지까지 모두 조회 (총 약 1400건)
    for (let i = 1; i <= 2; i++) {
      const url = `https://api.data.go.kr/openapi/tn_pubr_public_stret_tursm_info_api?serviceKey=${serviceKey}&pageNo=${i}&numOfRows=1000&type=json`;
      const response = await fetch(url, { next: { revalidate: 86400 } });
      if (!response.ok) continue;

      const json = await response.json();
      if (json.body && json.body.items && json.body.items.item) {
        allItems = allItems.concat(json.body.items.item);
      }
    }

    // 광주 관련 데이터만 필터링
    const gwangjuItems = allItems.filter(item => 
      (item.beginRdnmadr && item.beginRdnmadr.includes('광주광역시')) ||
      (item.beginLnmadr && item.beginLnmadr.includes('광주광역시')) ||
      (item.insttNm && item.insttNm.includes('전남광주통합특별시')) ||
      (item.insttNm && item.insttNm.includes('광주광역시')) ||
      (item.institutionNm && item.institutionNm.includes('광주광역시'))
    );

    // 좌표계산을 위한 병렬 처리 (Kakao Local API 활용)
    const chunkSize = 5;
    const places: TourismPlace[] = [];
    
    for (let i = 0; i < gwangjuItems.length; i += chunkSize) {
      const chunk = gwangjuItems.slice(i, i + chunkSize);
      const chunkResults = await Promise.all(chunk.map(async (item: any, idx: number) => {
        const name = item.stretNm || '';
        const address = item.beginRdnmadr || item.beginLnmadr || '';
        const intro = item.stretIntrcn || '';
        const length = item.stretLt || '';
        const time = item.reqreTime || '';
        const course = item.coursInfo || '';
        const tel = item.phoneNumber || '';
        
        let lat = 0;
        let lng = 0;

        if (address) {
          try {
            const geoRes = await fetch(`https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`, {
              headers: { Authorization: `KakaoAK ${kakaoKey}` },
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
            console.error('[Path Geocode Error]', e);
          }
        }

        const overviewLines = [];
        if (intro) overviewLines.push(intro);
        if (length) overviewLines.push(`총 길이: ${length}km`);
        if (time) overviewLines.push(`소요 시간: ${time}`);
        if (course) overviewLines.push(`코스 정보: ${course}`);

        return {
          contentId: `path_${i + idx}`,
          contentTypeId: 12, // 관광지 분류
          title: `[둘레길] ${name}`,
          addr1: address,
          mapx: lng,
          mapy: lat,
          dist: 0,
          firstimage: '',
          tel: tel,
          overview: overviewLines.join('\n\n'),
          isPath: true
        } as TourismPlace;
      }));
      places.push(...chunkResults);
    }

    // 좌표가 찾아진 것만 반환
    return places.filter(p => p.mapx !== 0 && p.mapy !== 0);
  } catch (error) {
    console.error('[Path API Error]', error);
    return [];
  }
}

export function mergePathData(existing: any[], newItems: TourismPlace[]) {
  // 별도의 매칭 로직 없이 뒤에 추가 (둘레길은 보통 TourAPI와 겹치는 경우가 적음)
  return [...existing, ...newItems];
}
