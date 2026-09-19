import { TourismPlace } from '@/types';

export async function fetchHeritagePlaces(): Promise<TourismPlace[]> {
  const rawKey = process.env.TOUR_API_SERVICE_KEY || '';
  const serviceKey = rawKey.includes('%') ? rawKey : encodeURIComponent(rawKey);
  const kakaoKey = process.env.KAKAO_CLIENT_ID || '';

  if (!serviceKey || !kakaoKey) return [];

  try {
    const url = `https://api.odcloud.kr/api/15016304/v1/uddi:b1721406-7b47-4f34-9775-fadb76d58caf?page=1&perPage=500&serviceKey=${serviceKey}`;
    
    const response = await fetch(url, { next: { revalidate: 86400 } });
    if (!response.ok) return [];

    const json = await response.json();
    if (!json.data || !Array.isArray(json.data)) return [];

    // 동시 요청 수를 제한하기 위한 청크 실행 (Kakao Local API Rate Limit 방지)
    const chunkSize = 10;
    const places: TourismPlace[] = [];
    
    for (let i = 0; i < json.data.length; i += chunkSize) {
      const chunk = json.data.slice(i, i + chunkSize);
      const chunkResults = await Promise.all(chunk.map(async (item: any, idx: number) => {
        const keys = Object.keys(item);
        const nameKey = keys.find(k => k.replace(/\s+/g, '') === '명칭') || '명칭';
        const addrKey = keys.find(k => k.replace(/\s+/g, '').includes('도로명주소')) || '소재지도로명주소';
        const typeKey = keys.find(k => k.replace(/\s+/g, '') === '종별') || '종별';
        const dateKey = keys.find(k => k.replace(/\s+/g, '') === '지정일자') || '지정일자';

        const name = item[nameKey] || '';
        let address = item[addrKey] || '';
        const category = item[typeKey] || '';
        const date = item[dateKey] || '';
        
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
            console.error('[Heritage Geocode Error]', e);
          }
        }

        return {
          contentId: `heritage_${i + idx}`,
          contentTypeId: 14, // 문화시설
          title: `[국가유산] ${name}`,
          addr1: address,
          mapx: lng,
          mapy: lat,
          dist: 0,
          firstimage: '',
          tel: '',
          overview: `종별: ${category}\n지정일자: ${date}`,
          isHeritage: true
        } as TourismPlace;
      }));
      places.push(...chunkResults);
    }

    return places.filter(p => p.mapx !== 0 && p.mapy !== 0);
  } catch (error) {
    console.error('[Heritage API Error]', error);
    return [];
  }
}

export function mergeHeritageData(existing: any[], newItems: TourismPlace[]) {
  const matchedHeritageIndices = new Set<number>();

  const mergedList = existing.map((item) => {
    const titleObj = String(item.title).replace(/\s+/g, '');
    const matchedIndex = newItems.findIndex((hItem) => {
      const hTitle = String(hItem.title).replace(/\[국가유산\] /g, '').replace(/\s+/g, '');
      return titleObj.includes(hTitle) || hTitle.includes(titleObj);
    });
    
    if (matchedIndex !== -1) {
      matchedHeritageIndices.add(matchedIndex);
    }

    return {
      ...item,
      isHeritage: matchedIndex !== -1 || item.isHeritage,
    };
  });

  // 매칭되지 않은 국가유산 데이터는 개별 마커로 추가
  newItems.forEach((hItem, index) => {
    if (!matchedHeritageIndices.has(index)) {
      mergedList.push(hItem);
    }
  });

  return mergedList;
}
