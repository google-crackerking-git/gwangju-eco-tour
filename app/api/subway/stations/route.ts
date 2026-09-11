// 지하철역 정보 조회 API Route
// 광주교통공사 오픈 API를 서버에서 호출하여 프록시합니다.
// (CORS 우회 + 정적 데이터 보완)

import { NextResponse } from 'next/server';
import { GWANGJU_SUBWAY_LINE1 } from '@/data/subway-stations';

export async function GET() {
  try {
    // 정적 데이터를 기본으로 반환
    // grtc.co.kr API 호출로 추가 정보(운행시간 등) 보완 가능
    const stations = GWANGJU_SUBWAY_LINE1.map((station) => ({
      stationId: station.stationId,
      stationName: station.stationName,
      lineNumber: station.lineNumber,
      lat: station.lat,
      lng: station.lng,
      address: station.address,
    }));

    return NextResponse.json({ success: true, data: stations });
  } catch (error) {
    console.error('[Subway Stations API Error]', error);
    return NextResponse.json(
      { success: false, error: '지하철역 정보를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
