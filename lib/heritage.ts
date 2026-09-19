export async function fetchHeritagePlaces() {
  // 사용자가 제공한 WFS 엔드포인트를 내부 프록시를 통해 호출합니다.
  // 향후 정확한 검색 파라미터(TypeName 등)가 확보되면 query string에 추가합니다.
  const url = '/api/heritage?type=WFS&searchKeyword=광주';
  
  try {
    // 서버 환경(API 라우트 내부)에서는 절대 경로가 필요하므로 프록시 대신 직접 호출하거나,
    // 현재는 구조만 잡아두고 빈 배열을 반환합니다.
    return [];
  } catch (error) {
    console.error('[Heritage API Error]', error);
    return [];
  }
}

export function mergeHeritageData(tourApiItems: any[], heritageItems: any[]) {
  return tourApiItems.map((item) => {
    const titleObj = String(item.title).replace(/\s+/g, '');
    const matchedHeritage = heritageItems.find((hItem) => {
      const hTitle = String(hItem.title).replace(/\s+/g, '');
      return titleObj.includes(hTitle) || hTitle.includes(titleObj);
    });
    
    return {
      ...item,
      isHeritage: !!matchedHeritage,
    };
  });
}

