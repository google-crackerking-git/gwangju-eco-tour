export async function fetchJnTourInfo() {
  const serviceKey = process.env.TOUR_API_SERVICE_KEY;
  if (!serviceKey) return [];

  // 기본 endpoint
  const url = 'https://apis.data.go.kr/6460000/jnTourInfo/getTourInfoList?serviceKey=' + serviceKey + '&pageNo=1&numOfRows=1000';

  try {
    const response = await fetch(url, {
      next: { revalidate: 86400 },
    });

    if (!response.ok) return [];

    const xmlText = await response.text();
    
    // SQL Exception 에러 응답 방어 로직
    if (xmlText.includes('java.sql.SQLException')) {
      console.warn('[JnTour API Warning] 서버 내부 SQL 에러 발생 - 백엔드 점검 중입니다.');
      return [];
    }

    const items: Array<{ title: string; image: string }> = [];
    
    // XML 파싱 (정규식 기반)
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(xmlText)) !== null) {
      const itemXml = match[1];
      
      // 장소명: tourDestNm 또는 tourNm
      let title = '';
      const titleMatch = /<(?:tourDestNm|tourNm|tourInfoNm|name)>([\s\S]*?)<\/(?:tourDestNm|tourNm|tourInfoNm|name)>/i.exec(itemXml);
      if (titleMatch) title = titleMatch[1].trim();

      // 이미지: imgUrl 또는 tourImg 또는 image
      let image = '';
      const imgMatch = /<(?:imgUrl|tourImg|image|img|tourDestImg)>([\s\S]*?)<\/(?:imgUrl|tourImg|image|img|tourDestImg)>/i.exec(itemXml);
      if (imgMatch) image = imgMatch[1].trim();
      
      if (title) {
        items.push({ title, image });
      }
    }

    return items;
  } catch (error) {
    console.error('[JnTour API Error]', error);
    return [];
  }
}

export function mergeJnTourData(tourApiItems: any[], jnTourItems: any[]) {
  return tourApiItems.map((item) => {
    const titleObj = String(item.title).replace(/\s+/g, '');
    const matchedJn = jnTourItems.find(
      (jnItem) => {
        const jnTitle = String(jnItem.title).replace(/\s+/g, '');
        return titleObj.includes(jnTitle) || jnTitle.includes(titleObj);
      }
    );
    
    // TourAPI에 이미지가 없고, jnTour에 이미지가 있다면 대체 (또는 갤러리에 추가 용도로 2번째 이미지로 지정)
    const enhancedItem = { ...item };
    if (matchedJn) {
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
}

