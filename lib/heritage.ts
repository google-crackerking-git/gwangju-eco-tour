export async function fetchHeritagePlaces() {
  const url = '/api/heritage?type=WFS&searchKeyword=광주';
  try {
    return [];
  } catch (error) {
    console.error('[Heritage API Error]', error);
    return [];
  }
}

export function mergeHeritageData(tourApiItems: any[], heritageItems: any[]) {
  const matchedHeritageIndices = new Set<number>();

  const mergedList = tourApiItems.map((item) => {
    const titleObj = String(item.title).replace(/\s+/g, '');
    const matchedIndex = heritageItems.findIndex((hItem) => {
      const hTitle = String(hItem.title).replace(/\s+/g, '');
      return titleObj.includes(hTitle) || hTitle.includes(titleObj);
    });
    
    if (matchedIndex !== -1) {
      matchedHeritageIndices.add(matchedIndex);
    }

    return {
      ...item,
      isHeritage: matchedIndex !== -1,
    };
  });

  // TourAPI에 없는 국가지정유산 독자 데이터 추가 (좌표가 있는 경우에만)
  heritageItems.forEach((hItem, index) => {
    if (!matchedHeritageIndices.has(index) && hItem.mapx > 0 && hItem.mapy > 0) {
      mergedList.push({
        contentId: `heritage-${index}`,
        contentTypeId: 14, // 문화시설로 취급
        title: hItem.title,
        addr1: hItem.addr1 || '',
        firstimage: hItem.image || '',
        mapx: hItem.mapx,
        mapy: hItem.mapy,
        dist: 0,
        isHeritage: true,
      });
    }
  });

  return mergedList;
}

