import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sLat = searchParams.get('sLat');
  const sLng = searchParams.get('sLng');
  const sName = searchParams.get('sName');
  const eLat = searchParams.get('eLat');
  const eLng = searchParams.get('eLng');
  const eName = searchParams.get('eName');

  if (!sLat || !sLng || !eLat || !eLng) {
    return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 });
  }

  const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
  if (!KAKAO_CLIENT_ID) {
    return NextResponse.json({ error: 'Missing API Key' }, { status: 500 });
  }

  try {
    // 출발지 WGS84 -> WCONGNAMUL 변환
    const startRes = await fetch(`https://dapi.kakao.com/v2/local/geo/transcoord.json?x=${sLng}&y=${sLat}&input_coord=WGS84&output_coord=WCONGNAMUL`, {
      headers: { Authorization: `KakaoAK ${KAKAO_CLIENT_ID}` }
    });
    const startData = await startRes.json();
    const sX = startData.documents[0].x;
    const sY = startData.documents[0].y;

    // 도착지 WGS84 -> WCONGNAMUL 변환
    const endRes = await fetch(`https://dapi.kakao.com/v2/local/geo/transcoord.json?x=${eLng}&y=${eLat}&input_coord=WGS84&output_coord=WCONGNAMUL`, {
      headers: { Authorization: `KakaoAK ${KAKAO_CLIENT_ID}` }
    });
    const endData = await endRes.json();
    const eX = endData.documents[0].x;
    const eY = endData.documents[0].y;

    const url = `https://map.kakao.com/?sX=${sX}&sY=${sY}&sName=${encodeURIComponent(sName || '출발지')}&eX=${eX}&eY=${eY}&eName=${encodeURIComponent(eName || '도착지')}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Kakao transcoord error:', error);
    return NextResponse.json({ error: 'Failed to convert coordinates' }, { status: 500 });
  }
}
