export async function fetchJnTourInfo() {
  const serviceKey = process.env.TOUR_API_SERVICE_KEY;
  if (!serviceKey) return [];

  const url = 'https://apis.data.go.kr/6460000/jnTourInfo/getTourInfoList?serviceKey=' + serviceKey + '&pageNo=1&numOfRows=1000';

  try {
    const response = await fetch(url, { next: { revalidate: 86400 } });
    if (!response.ok) return [];

    const xmlText = await response.text();
    if (xmlText.includes('java.sql.SQLException')) {
      console.warn('[JnTour API Warning] 서버 내부 SQL 에러 발생');
      return [];
    }

    const items: Array<{ title: string; image: string; addr1: string; mapx: number; mapy: number }> = [];
    
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(xmlText)) !== null) {
      const itemXml = match[1];
      
      let title = '';
      const titleMatch = /<(?:tourDestNm|tourNm|tourInfoNm|name)>([\s\S]*?)<\/(?:tourDestNm|tourNm|tourInfoNm|name)>/i.exec(itemXml);
      if (titleMatch) title = titleMatch[1].trim();

      let image = '';
      const imgMatch = /<(?:imgUrl|tourImg|image|img|tourDestImg)>([\s\S]*?)<\/(?:imgUrl|tourImg|image|img|tourDestImg)>/i.exec(itemXml);
      if (imgMatch) image = imgMatch[1].trim();

      let addr1 = '';
      const addrMatch = /<(?:addr|mngAddr|address)>([\s\S]*?)<\/(?:addr|mngAddr|address)>/i.exec(itemXml);
      if (addrMatch) addr1 = addrMatch[1].trim();

      let mapx = 0;
      let mapy = 0;
      const lonMatch = /<(?:lon|lng|mapX|mapx)>([\s\S]*?)<\/(?:lon|lng|mapX|mapx)>/i.exec(itemXml);
      const latMatch = /<(?:lat|mapY|mapy)>([\s\S]*?)<\/(?:lat|mapY|mapy)>/i.exec(itemXml);
      if (lonMatch) mapx = parseFloat(lonMatch[1].trim());
      if (latMatch) mapy = parseFloat(latMatch[1].trim());
      
      if (title) {
        items.push({ title, image, addr1, mapx, mapy });
      }
    }
    return items;
  } catch (error) {
    console.error('[JnTour API Error]', error);
    return [];
  }
}

export function mergeJnTourData(tourApiItems: any[], jnTourItems: any[]) {
  const matchedJnIndices = new Set<number>();

  const mergedList = tourApiItems.map((item) => {
    const titleObj = String(item.title).replace(/\s+/g, '');
    const matchedIndex = jnTourItems.findIndex((jnItem) => {
      const jnTitle = String(jnItem.title).replace(/\s+/g, '');
      return titleObj.includes(jnTitle) || jnTitle.includes(titleObj);
    });
    
    const enhancedItem = { ...item };
    if (matchedIndex !== -1) {
      const matchedJn = jnTourItems[matchedIndex];
      matchedJnIndices.add(matchedIndex);
      enhancedItem.isNamdoTour = true;
      if (!enhancedItem.firstimage && matchedJn.image) {
        enhancedItem.firstimage = matchedJn.image;
      }
      if (enhancedItem.firstimage && !enhancedItem.firstimage2 && matchedJn.image && enhancedItem.firstimage !== matchedJn.image) {
        enhancedItem.firstimage2 = matchedJn.image;
      }
    }
    return enhancedItem;
  });

  // TourAPI에 없는 jnTour 독자 데이터 추가 (단, 좌표가 있는 경우에만)
  jnTourItems.forEach((jnItem, index) => {
    if (!matchedJnIndices.has(index) && jnItem.mapx > 0 && jnItem.mapy > 0) {
      mergedList.push({
        contentId: `jntour-${index}`,
        contentTypeId: 12, // 기본 관광지로 취급
        title: jnItem.title,
        addr1: jnItem.addr1 || '',
        firstimage: jnItem.image,
        mapx: jnItem.mapx,
        mapy: jnItem.mapy,
        dist: 0,
        isNamdoTour: true,
      });
    }
  });

  return mergedList;
}

