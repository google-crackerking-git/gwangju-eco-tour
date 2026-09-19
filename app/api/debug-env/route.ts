import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json({
    kakaoId: !!process.env.KAKAO_CLIENT_ID,
    kakaoSecret: !!process.env.KAKAO_CLIENT_SECRET,
    authSecret: !!process.env.AUTH_SECRET,
    nextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    secretLength: (process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || '').length
  });
}
