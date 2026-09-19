import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasTourKey: !!process.env.TOUR_API_SERVICE_KEY,
    hasBusKey: !!process.env.BUS_API_SERVICE_KEY,
    hasKakaoMap: !!process.env.NEXT_PUBLIC_KAKAO_MAP_KEY,
    hasKakaoClient: !!process.env.KAKAO_CLIENT_ID,
    hasAuthSecret: !!process.env.AUTH_SECRET || !!process.env.NEXTAUTH_SECRET,
    tourKeyLength: process.env.TOUR_API_SERVICE_KEY?.length || 0,
    busKeyLength: process.env.BUS_API_SERVICE_KEY?.length || 0
  });
}
