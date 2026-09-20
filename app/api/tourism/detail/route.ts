import { NextRequest, NextResponse } from 'next/server';
import { parseStringPromise } from 'xml2js';

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
  const keyword = encodeURIComponent(title);
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
        const city = addr1 ? addr1.split(' ')[0].substring(0, 2) : '';
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
  
  return Array.from(new Set(images));
}

async function fetchRelated(areaCd: string = '5', signguCd: string = '1') {
  const url = `http://apis.data.go.kr/B551011/TarRlteTarService1/areaBasedList1?serviceKey=${API_KEY}&MobileOS=ETC&MobileApp=AppTest&_type=json&baseYm=202401&areaCd=${areaCd}&signguCd=${signguCd}&pageNo=1&numOfRows=5`;
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    const data = await res.json();
    return data?.response?.body?.items?.item || [];
  } catch (e) {
    return [];
  }
}

// 국가유산청(KHS) 상세 정보 및 이미지 조회
async function fetchHeritageDetail(contentId: string) {
  // contentId: "heritage_{ccbaKdcd}_{ccbaAsno}_{ccbaCtcd}"
  const parts = contentId.split('_');
  if (parts.length !== 4) return { overview: '상세 정보가 없습니다.', gallery: [] };
  
  const ccbaKdcd = parts[1];
  const ccbaAsno = parts[2];
  const ccbaCtcd = parts[3];

  const dtUrl = `http://www.khs.go.kr/cha/SearchKindOpenapiDt.do?ccbaKdcd=${ccbaKdcd}&ccbaAsno=${ccbaAsno}&ccbaCtcd=${ccbaCtcd}`;
  const imgUrl = `http://www.khs.go.kr/cha/SearchImageOpenapi.do?ccbaKdcd=${ccbaKdcd}&ccbaAsno=${ccbaAsno}&ccbaCtcd=${ccbaCtcd}`;

  let overview = '상세 정보가 없습니다.';
  let images: string[] = [];

  try {
    const [dtRes, imgRes] = await Promise.all([
      fetch(dtUrl, { next: { revalidate: 86400 } }),
      fetch(imgUrl, { next: { revalidate: 86400 } })
    ]);

    if (dtRes.ok) {
      const dtText = await dtRes.text();
      const dtXml = await parseStringPromise(dtText, { explicitArray: false });
      if (dtXml?.result?.item?.content) {
        overview = String(dtXml.result.item.content).replace(/<[^>]*>?/gm, '');
      }
      if (dtXml?.result?.item?.imageUrl) {
        images.push(dtXml.result.item.imageUrl);
      }
    }

    if (imgRes.ok) {
      const imgText = await imgRes.text();
      const imgXml = await parseStringPromise(imgText, { explicitArray: false });
      let items = imgXml?.result?.item;
      if (items) {
        if (!Array.isArray(items)) items = [items];
        items.forEach((imgItem: any) => {
          if (imgItem.imageUrl) images.push(imgItem.imageUrl);
        });
      }
    }
  } catch (e) {
    console.error('Heritage detail fetch error:', e);
  }

  // 중복 이미지 URL 제거
  images = Array.from(new Set(images));

  return { overview, gallery: images };
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

  if (contentId.startsWith('heritage_')) {
    const heritageData = await fetchHeritageDetail(contentId);
    return NextResponse.json({
      success: true,
      data: {
        overview: heritageData.overview,
        homepage: '',
        petInfo: null,
        gallery: heritageData.gallery,
        apiRelated: []
      }
    });
  }

  const isCustomId = !/^\d+$/.test(contentId);

  const [common, pet, gallery, related] = isCustomId 
    ? [null, null, [], []]
    : await Promise.all([
        fetchCommon(contentId),
        fetchPetInfo(contentId),
        fetchGalleryAndImages(contentId, title, addr1),
        fetchRelated('5', '1') // default to gwangju dong-gu
      ]);

  return NextResponse.json({
    success: true,
    data: {
      overview: common?.overview ? String(common.overview).replace(/<[^>]*>?/gm, '') : '상세 정보가 없습니다.',
      homepage: common?.homepage ? String(common.homepage).replace(/<[^>]*>?/gm, '') : '',
      petInfo: pet ? {
        acmpyPsblCpam: pet.acmpyPsblCpam,
        relaRntlPrdlst: pet.relaRntlPrdlst,
        acmpyNeedMtr: pet.acmpyNeedMtr,
        etcAcmpyInfo: pet.etcAcmpyInfo,
      } : null,
      gallery,
      apiRelated: related
    }
  });
}
