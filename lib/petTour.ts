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

  const petIdSet = new Set<string>();
  const petTitleSet = new Set<string>();

  petItems.forEach((p) => {
    if (p.contentid) petIdSet.add(String(p.contentid));
    if (p.title) {
      const cleanTitle = p.title.replace(/\s+/g, '').toLowerCase();
      petTitleSet.add(cleanTitle);
    }
  });

  // 기존 관광지/문화시설/음식점/숙박/쇼핑 목록은 그대로 유지하며,
  // 반려동물 API에 등록된 장소와 일치하는 경우에만 isPetFriendly: true 플래그 부여 (임의의 상점 추가 방지)
  return allPlaces.map((place) => {
    const id = String(place.contentId);
    const cleanTitle = (place.title || '').replace(/\s+/g, '').toLowerCase();

    if (petIdSet.has(id) || (cleanTitle && petTitleSet.has(cleanTitle))) {
      return {
        ...place,
        isPetFriendly: true,
      };
    }
    return place;
  });
}
