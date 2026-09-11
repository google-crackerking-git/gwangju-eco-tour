// 버스 노선 목록 조회 API Route
// 광주광역시 BIS API를 서버에서 호출하여 프록시합니다.
// API 키는 절대 클라이언트에 노출되지 않습니다.

import { NextRequest, NextResponse } from 'next/server';

const BIS_BASE_URL = 'http://apis.data.go.kr/6290000/gj_bis';

export async function GET(request: NextRequest) {
  const serviceKey = process.env.BUS_API_SERVICE_KEY;

  if (!serviceKey) {
    return NextResponse.json(
      { success: false, error: 'BUS_API_SERVICE_KEY 환경변수가 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  const { searchParams } = request.nextUrl;
  const keyword = searchParams.get('keyword') ?? '';

  try {
    const url = new URL(`${BIS_BASE_URL}/lineInfo`);
    url.searchParams.set('serviceKey', serviceKey);
    url.searchParams.set('resultType', 'json');
    url.searchParams.set('numOfRows', '200');
    url.searchParams.set('pageNo', '1');

    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 }, // 1시간 캐시
    });

    if (!response.ok) {
      throw new Error(`BIS API 응답 오류: ${response.status}`);
    }

    const data = await response.json();
    let items = data?.RESPONSE?.LINE_LIST?.ITEM ?? [];
    if (!Array.isArray(items)) {
      items = items ? [items] : [];
    }

    let routeList = items.map((item: any) => ({
      routeId: String(item.LINE_ID ?? ''),
      routeNo: item.LINE_NAME ?? '',
      routeType: String(item.LINE_KIND ?? ''),
      startNodeName: item.DIR_UP_NAME ?? '',
      endNodeName: item.DIR_DOWN_NAME ?? '',
    }));

    // 키워드가 있으면 검색 (API 자체 필터링이 없으므로 서버에서 필터링)
    if (keyword) {
      routeList = routeList.filter((route: any) => route.routeNo.includes(keyword));
    }

    return NextResponse.json({ success: true, data: routeList });
  } catch (error) {
    console.error('[Bus Routes API Error]', error);
    return NextResponse.json(
      { success: false, error: '버스 노선 정보를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
