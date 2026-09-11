import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // 한국관광공사 이미지 서버
      { protocol: 'https', hostname: 'tong.visitkorea.or.kr' },
      { protocol: 'http', hostname: 'tong.visitkorea.or.kr' },
      { protocol: 'https', hostname: 'cdn.visitkorea.or.kr' },
      // 카카오 프로필 이미지
      { protocol: 'https', hostname: 'k.kakaocdn.net' },
      { protocol: 'http', hostname: 'k.kakaocdn.net' },
    ],
  },
  // Firebase Admin SDK 서버사이드 전용 패키지 설정
  serverExternalPackages: ['firebase-admin'],
};

export default nextConfig;
