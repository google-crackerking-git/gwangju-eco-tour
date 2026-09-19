import { TourismPlace, TourismContentType } from '@/types';

export async function fetchMarketShops(): Promise<TourismPlace[]> {
  const rawKey = process.env.TOUR_API_SERVICE_KEY || '';
  const serviceKey = rawKey.includes('%') ? rawKey : encodeURIComponent(rawKey);
  
  if (!serviceKey) return [];

  try {
    const url = `https://api.odcloud.kr/api/15095853/v1/uddi:bc80387d-e19f-4659-b53b-cd0245ef61a0?page=1&perPage=3000&serviceKey=${serviceKey}`;
    const response = await fetch(url, { next: { revalidate: 86400 } });
    if (!response.ok) return [];

    const json = await response.json();
    if (!json.data || !Array.isArray(json.data)) return [];

    const places = json.data.map((item: any) => {
      // Find keys robustly
      const keys = Object.keys(item);
      const marketNameKey = keys.find(k => k.replace(/\s+/g, '') === '시장명') || '시장명';
      const shopNameKey = keys.find(k => k.replace(/\s+/g, '') === '점포명') || '점포명';
      const latKey = keys.find(k => k.replace(/\s+/g, '') === '위도') || '위도';
      const lngKey = keys.find(k => k.replace(/\s+/g, '') === '경도') || '경도';
      const addrKey = keys.find(k => k.replace(/\s+/g, '').includes('도로명주소')) || '소재지도로명주소';
      const categoryKey = keys.find(k => k.replace(/\s+/g, '') === '분류') || '분류';
      const itemsKey = keys.find(k => k.replace(/\s+/g, '') === '취급품목') || '취급품목';
      const telKey = keys.find(k => k.replace(/\s+/g, '') === '전화번호') || '전화번호';
      const idKey = keys.find(k => k.replace(/\s+/g, '').includes('ID')) || '점포(ID)';

      const marketName = item[marketNameKey] || '';
      const shopName = item[shopNameKey] || '';
      const lat = parseFloat(item[latKey] || '0');
      const lng = parseFloat(item[lngKey] || '0');
      const address = item[addrKey] || '';
      const category = item[categoryKey] || '';
      const handlingItems = item[itemsKey] || '';
      const tel = item[telKey] || '';
      const id = item[idKey] || Math.random().toString();

      let contentTypeId: TourismContentType = 38; // Default to Shopping
      if (category.includes('음식') || category.includes('식당') || category.includes('음료')) {
        contentTypeId = 39; // Restaurant
      }

      return {
        contentId: `market_${id}`,
        contentTypeId,
        title: `[${marketName}] ${shopName}`,
        addr1: address,
        mapx: lng,
        mapy: lat,
        dist: 0,
        firstimage: '',
        tel: tel,
        overview: `시장명: ${marketName}\n점포명: ${shopName}\n분류: ${category}\n취급품목: ${handlingItems}`
      } as TourismPlace;
    });

    // Filter out invalid coords
    return places.filter((p: TourismPlace) => !isNaN(p.mapx) && !isNaN(p.mapy) && p.mapx > 0 && p.mapy > 0);
  } catch (error) {
    console.error('[Market API Error]', error);
    return [];
  }
}

export function mergeMarketData(existing: any[], newItems: TourismPlace[]) {
  return [...existing, ...newItems];
}
