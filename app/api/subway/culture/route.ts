import { NextResponse } from 'next/server';

export async function GET() {
  const serviceKey = process.env.TOUR_API_SERVICE_KEY;
  
  if (!serviceKey) {
    return NextResponse.json({ success: false, error: 'API Key missing' }, { status: 500 });
  }

  // 광주교통공사_역 인근 문화공간
  const cltplceUrl = 'https://apis.data.go.kr/B551232/OAMS_CLTPLCE_01?serviceKey=' + serviceKey + '&pageNo=1&numOfRows=100&_type=json';
  // 광주교통공사_문화노선도
  const statnUrl = 'https://apis.data.go.kr/B551232/OAMS_STATN_01?serviceKey=' + serviceKey + '&pageNo=1&numOfRows=100&_type=json';

  try {
    const [resCltplce, resStatn] = await Promise.all([
      fetch(cltplceUrl, { next: { revalidate: 86400 } }),
      fetch(statnUrl, { next: { revalidate: 86400 } })
    ]);

    let cltplceData = null;
    let statnData = null;

    if (resCltplce.ok) {
      try { cltplceData = await resCltplce.json(); } catch(e) {}
    }
    if (resStatn.ok) {
      try { statnData = await resStatn.json(); } catch(e) {}
    }

    return NextResponse.json({
      success: true,
      data: {
        cultureSpaces: cltplceData?.response?.body?.items?.item || [],
        cultureRoutes: statnData?.response?.body?.items?.item || []
      }
    });

  } catch (error) {
    console.error('[Subway Culture API Error]', error);
    return NextResponse.json({ success: true, data: { cultureSpaces: [], cultureRoutes: [] }, notice: 'API currently unavailable' });
  }
}

