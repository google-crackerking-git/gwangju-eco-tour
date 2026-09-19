export async function fetchOdcloudAttractions() {
  const serviceKey = process.env.TOUR_API_SERVICE_KEY;
  if (!serviceKey) return [];

  const url = 'https://api.odcloud.kr/api/15133527/v1/uddi:f2427b4c-386e-42bd-ab03-a067cbde14c9?serviceKey=' + serviceKey + '&page=1&perPage=1000';

  try {
    const response = await fetch(url, {
      next: { revalidate: 86400 },
    });

    if (!response.ok) return [];

    const data = await response.json();
    return data?.data || [];
  } catch (error) {
    console.error('[ODCloud API Error]', error);
    return [];
  }
}

export function mergeOdcloudData(tourApiItems: any[], odcloudItems: any[]) {
  return tourApiItems.map((item) => {
    const titleObj = String(item.title).replace(/\s+/g, '');
    const isOfficial = odcloudItems.some(
      (odItem) => {
        const odTitle = String(odItem['시설명']).replace(/\s+/g, '');
        return titleObj.includes(odTitle) || odTitle.includes(titleObj);
      }
    );
    return {
      ...item,
      isOfficial,
    };
  });
}

