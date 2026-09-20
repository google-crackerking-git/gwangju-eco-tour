import { TourismPlace } from '@/types';
import { parseStringPromise } from 'xml2js';

export async function fetchHeritagePlaces(): Promise<TourismPlace[]> {
  try {
    const url = 'http://www.khs.go.kr/cha/SearchKindOpenapiList.do?pageUnit=2000&ccbaCncl=N&ccbaCtcd=24';
    const response = await fetch(url, { next: { revalidate: 86400 } });
    if (!response.ok) return [];

    const text = await response.text();
    const result = await parseStringPromise(text, { explicitArray: false });

    let items = result?.result?.item || [];
    if (!Array.isArray(items)) items = [items];

    // ccbaCtcd=24 (광주) 데이터만 필터링
    const gwangjuItems = items.filter((i: any) => i.ccbaCtcd === '24');

    const places: TourismPlace[] = gwangjuItems.map((item: any) => {
      const lat = parseFloat(item.latitude || '0');
      const lng = parseFloat(item.longitude || '0');

      return {
        contentId: `heritage_${item.ccbaKdcd}_${item.ccbaAsno}_${item.ccbaCtcd}`,
        contentTypeId: 14, // 문화시설 카테고리로 통합
        title: `[${item.ccmaName}] ${item.ccbaMnm1}`,
        addr1: `광주광역시 ${item.ccsiName}`,
        mapx: lng,
        mapy: lat,
        dist: 0,
        firstimage: '', // 상세 이미지는 추후 필요시 상세API 호출
        tel: '',
        overview: `관리자: ${item.ccbaAdmin || '정보 없음'}`,
        isHeritage: true
      } as TourismPlace;
    });

    // 좌표가 유효한 것만 반환
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
      // '[국보] ', '[보물] ' 등의 태그 제거 후 비교
      const hTitle = String(hItem.title).replace(/\[.*?\] /g, '').replace(/\s+/g, '');
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
