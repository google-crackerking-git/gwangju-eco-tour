// 버스 노선별 정류장 목록 조회 API Route
// 광주광역시 BIS API를 서버에서 호출하여 프록시합니다.

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
  const routeId = searchParams.get('routeId');

  if (!routeId) {
    return NextResponse.json(
      { success: false, error: 'routeId 파라미터가 필요합니다.' },
      { status: 400 }
    );
  }

  try {
    const url = new URL(`${BIS_BASE_URL}/lineStationInfo`);
    url.searchParams.set('serviceKey', serviceKey);
    url.searchParams.set('resultType', 'json');
    url.searchParams.set('LINE_ID', routeId);

    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`BIS API 응답 오류: ${response.status}`);
    }

    const data = await response.json();
    let items = data?.RESPONSE?.BUSSTOP_LIST?.ITEM ?? [];
    if (!Array.isArray(items)) {
      items = items ? [items] : [];
    }

    let foundTurnaround = false;
    const stopList = items.map((item: any) => {
      if (item.RETURN_FLAG === 3 || item.RETURN_FLAG === '3') {
        foundTurnaround = true;
      }
      return {
        nodeId: String(item.BUSSTOP_ID ?? ''),
        nodeName: item.BUSSTOP_NAME ?? '',
        arsId: String(item.ARS_ID ?? ''),
        lat: parseFloat(item.LATITUDE ?? '0'),
        lng: parseFloat(item.LONGITUDE ?? '0'),
        nodeOrder: parseInt(item.SEQ ?? '0', 10),
        dir: foundTurnaround ? 'down' : 'up',
      };
    });

    // 순서대로 정렬
    stopList.sort((a: { nodeOrder: number }, b: { nodeOrder: number }) => a.nodeOrder - b.nodeOrder);

    return NextResponse.json({ success: true, data: stopList });
  } catch (error) {
    console.error('[Bus Stops API Error]', error);
    return NextResponse.json(
      { success: false, error: '버스 정류장 정보를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
