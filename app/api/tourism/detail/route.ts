import { NextRequest, NextResponse } from 'next/server';

const rawKey = process.env.TOUR_API_SERVICE_KEY || '';
const API_KEY = rawKey.includes('%') ? rawKey : encodeURIComponent(rawKey);

async function fetchCommon(contentId: string) {
  const url = `http://apis.data.go.kr/B551011/KorService2/detailCommon2?serviceKey=${API_KEY}&MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=${contentId}`;
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    const data = await res.json();
    return data?.response?.body?.items?.item?.[0] || null;
  } catch (e) {
    return null;
  }
}

async function fetchPetInfo(contentId: string) {
  const url = `http://apis.data.go.kr/B551011/KorPetTourService2/detailPetTour2?serviceKey=${API_KEY}&MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=${contentId}&pageNo=1&numOfRows=10`;
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    const data = await res.json();
    return data?.response?.body?.items?.item?.[0] || null;
  } catch (e) {
    return null;
  }
}

async function fetchGalleryAndImages(contentId: string, title: string, addr1: string) {
  const keyword = encodeURIComponent(title); // Use exact full title
  const galleryUrl = `http://apis.data.go.kr/B551011/PhotoGalleryService1/gallerySearchList1?serviceKey=${API_KEY}&MobileOS=ETC&MobileApp=AppTest&_type=json&keyword=${keyword}&pageNo=1&numOfRows=10`;
  const detailImageUrl = `http://apis.data.go.kr/B551011/KorService2/detailImage2?serviceKey=${API_KEY}&MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=${contentId}&imageYN=Y&subImageYN=Y&pageNo=1&numOfRows=10`;

  let images: string[] = [];
  try {
    const [galleryRes, detailRes] = await Promise.all([
      fetch(galleryUrl, { next: { revalidate: 86400 } }).catch(() => null),
      fetch(detailImageUrl, { next: { revalidate: 86400 } }).catch(() => null)
    ]);
    
    if (galleryRes && galleryRes.ok) {
      const gData = await galleryRes.json();
      let items = gData?.response?.body?.items?.item;
      if (items) {
        if (!Array.isArray(items)) items = [items];
        const city = addr1 ? addr1.split(' ')[0].substring(0, 2) : ''; // e.g. "광주"
        const validItems = items.filter((img: any) => {
          if (!city) return true;
          const loc = img.galPhotographyLocation || '';
          return loc.includes(city) || loc === '';
        });
        images.push(...validItems.map((img: any) => img.galWebImageUrl).filter(Boolean));
      }
    }
    
    if (detailRes && detailRes.ok) {
      const dData = await detailRes.json();
      let items = dData?.response?.body?.items?.item;
      if (items) {
        if (!Array.isArray(items)) items = [items];
        images.push(...items.map((img: any) => img.originimgurl).filter(Boolean));
      }
    }
  } catch (e) {
    console.error('Image fetch error:', e);
  }
  
  // 중복 제거
  return Array.from(new Set(images));
}

async function fetchRelated(areaCd: string = '5', signguCd: string = '1') {
  // TarRlteTarService1 - Using hardcoded baseYm since it requires it.
  const url = `http://apis.data.go.kr/B551011/TarRlteTarService1/areaBasedList1?serviceKey=${API_KEY}&MobileOS=ETC&MobileApp=AppTest&_type=json&baseYm=202401&areaCd=${areaCd}&signguCd=${signguCd}&pageNo=1&numOfRows=5`;
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    const data = await res.json();
    return data?.response?.body?.items?.item || [];
  } catch (e) {
    return [];
  }
}

export async function GET(request: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json({ success: false, error: 'API KEY missing' }, { status: 500 });
  }

  const { searchParams } = request.nextUrl;
  const contentId = searchParams.get('contentId');
  const title = searchParams.get('title');
  const addr1 = searchParams.get('addr1') || '';

  if (!contentId || !title) {
    return NextResponse.json({ success: false, error: 'contentId and title required' }, { status: 400 });
  }

  // 커스텀 contentId (예: 518_..., heritage_...)인 경우 TourAPI 호출 생략
  const isCustomId = !/^\d+$/.test(contentId);

  const [common, pet, gallery, related] = isCustomId 
    ? [null, null, [], []]
    : await Promise.all([
        fetchCommon(contentId),
        fetchPetInfo(contentId),
        fetchGalleryAndImages(contentId, title, addr1),
        fetchRelated('5', '1') // default to gwangju dong-gu for the API call
      ]);

  return NextResponse.json({
    success: true,
    data: {
      overview: common?.overview ? String(common.overview).replace(/<[^>]*>?/gm, '') : '상세 정보가 없습니다.',
      homepage: common?.homepage ? String(common.homepage).replace(/<[^>]*>?/gm, '') : '',
      petInfo: pet ? {
        acmpyPsblCpam: pet.acmpyPsblCpam, // 동반가능여부
        relaRntlPrdlst: pet.relaRntlPrdlst, // 관련 비품
        acmpyNeedMtr: pet.acmpyNeedMtr, // 동반시 필요사항
        etcAcmpyInfo: pet.etcAcmpyInfo, // 기타 동반 정보
      } : null,
      gallery,
      apiRelated: related
    }
  });
}
