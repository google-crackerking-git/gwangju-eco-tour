import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const stationId = searchParams.get('stationId');

  if (!stationId) {
    return NextResponse.json({ success: false, error: 'stationId is required' }, { status: 400 });
  }

  try {
    const url = `https://www.grtc.co.kr/subway/openapi/json/stationInformation?station_id=${stationId}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      next: { revalidate: 86400 }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from GRTC');
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[Subway Info API Error]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch subway info' }, { status: 500 });
  }
}
