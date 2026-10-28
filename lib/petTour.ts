// 한국관광공사 반려동물 동반 여행 정보 API (KorPetTourService2) 연동
export interface PetTourItem {
  contentid: string;
  contenttypeid: string;
  title: string;
  addr1: string;
  addr2?: string;
  firstimage?: string;
  firstimage2?: string;
  mapx: string;
  mapy: string;
  tel?: string;
  lDongSignguCd?: string;
}

export async function fetchPetTourPlaces(): Promise<PetTourItem[]> {
  const rawKey = process.env.TOUR_API_SERVICE_KEY || '';
  const serviceKey = rawKey.includes('%') ? rawKey : encodeURIComponent(rawKey);
  if (!serviceKey) return [];

  // lDongRegnCd: 12 (전남광주통합특별시)
  const url = `http://apis.data.go.kr/B551011/KorPetTourService2/areaBasedList2?serviceKey=${serviceKey}&MobileOS=ETC&MobileApp=GwangjuEcoTour&_type=json&numOfRows=500&lDongRegnCd=12`;

  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return [];
    const data = await res.json();
    const items = data?.response?.body?.items?.item || [];
    const itemArray: any[] = Array.isArray(items) ? items : items ? [items] : [];

    // 광주 5개 자치구(동구 210, 서구 240, 남구 270, 북구 300, 광산구 330)
    const gwangjuSigngu = ['210', '240', '270', '300', '330'];
    const gwangjuDistricts = ['동구', '서구', '남구', '북구', '광산구'];

    return itemArray.filter(
      (item) =>
        gwangjuSigngu.includes(String(item.lDongSignguCd)) ||
        gwangjuDistricts.some((dist) => item.addr1?.includes(dist))
    );
  } catch (error) {
    console.error('[PetTour Fetch Error]', error);
    return [];
  }
}

export function mergePetTourData(allPlaces: any[], petItems: PetTourItem[]): any[] {
  if (!petItems || petItems.length === 0) return allPlaces;

  const petMap = new Map<string, PetTourItem>();
  petItems.forEach((p) => {
    petMap.set(String(p.contentid), p);
  });

  // 1. 기존 관광지에 반려동물 가능 플래그(isPetFriendly: true) 표시
  const updatedPlaces = allPlaces.map((place) => {
    const id = String(place.contentId);
    if (petMap.has(id)) {
      petMap.delete(id);
      return {
        ...place,
        isPetFriendly: true,
      };
    }
    return place;
  });

  // 2. 일반 목록에 없던 신규 반려동물 동반 장소 추가
  const newPlaces: any[] = [];
  for (const [, item] of petMap.entries()) {
    const rawType = parseInt(item.contenttypeid, 10);
    const contentTypeId = [12, 14, 39, 32, 38].includes(rawType) ? rawType : 12;

    newPlaces.push({
      contentId: String(item.contentid),
      contentTypeId,
      title: item.title,
      addr1: item.addr1 || '',
      addr2: item.addr2 || '',
      firstimage: item.firstimage || '',
      firstimage2: item.firstimage2 || '',
      mapx: parseFloat(item.mapx || '0'),
      mapy: parseFloat(item.mapy || '0'),
      tel: item.tel || '',
      isPetFriendly: true,
    });
  }

  return [...updatedPlaces, ...newPlaces];
}
