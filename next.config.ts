import type { NextConfig } from "next";

// Content Security Policy (OWASP ZAP 취약점 점검 최적화 및 카카오 지도, NextAuth 완벽 호환)
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://kakao.com https://*.kakao.com https://daum.net https://*.daum.net https://daumcdn.net https://*.daumcdn.net https://kakaocdn.net https://*.kakaocdn.net;
  style-src 'self' 'unsafe-inline' https://kakao.com https://*.kakao.com https://daum.net https://*.daum.net https://daumcdn.net https://*.daumcdn.net https://kakaocdn.net https://*.kakaocdn.net https://cdn.jsdelivr.net;
  img-src 'self' blob: data: https://*.visitkorea.or.kr http://*.visitkorea.or.kr https://*.kakaocdn.net http://*.kakaocdn.net https://*.daumcdn.net http://*.daumcdn.net https://kakao.com https://*.kakao.com https://daum.net https://*.daum.net http://*.khs.go.kr https://*.khs.go.kr http://*.cha.go.kr https://*.cha.go.kr;
  font-src 'self' data: https://*.daumcdn.net https://*.kakaocdn.net https://cdn.jsdelivr.net;
  connect-src 'self' https://kakao.com https://*.kakao.com https://daum.net https://*.daum.net https://daumcdn.net https://*.daumcdn.net https://kakaocdn.net https://*.kakaocdn.net;
  worker-src 'self' blob:;
  child-src 'self' blob: https://kakao.com https://*.kakao.com;
  frame-src 'self' https://kakao.com https://*.kakao.com https://daum.net https://*.daum.net;
  frame-ancestors 'self';
  form-action 'self' https://kakao.com https://*.kakao.com;
  base-uri 'self';
  object-src 'none';
`
  .replace(/\s{2,}/g, ' ')
  .trim();

const securityHeaders = [
  // 1. Content-Security-Policy (XSS 공격 방어)
  {
    key: 'Content-Security-Policy',
    value: cspHeader,
  },
  // 2. X-Frame-Options (Clickjacking 공격 방어)
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  // 3. X-Content-Type-Options (MIME 스니핑 방어)
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // 4. Referrer-Policy (리퍼러 정보 보호)
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // 5. Permissions-Policy (불필요한 브라우저 하드웨어/API 접근 차단)
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self), browsing-topics=()',
  },
  // 6. Strict-Transport-Security (HTTPS 강제 및 중간자 공격 방어)
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

const nextConfig: NextConfig = {
  // 프레임워크 정보 누출 방지 (ZAP Server Leaks Information via X-Powered-By 해결)
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      // 한국관광공사 이미지 서버
      { protocol: 'https', hostname: 'tong.visitkorea.or.kr' },
      { protocol: 'http', hostname: 'tong.visitkorea.or.kr' },
      { protocol: 'https', hostname: 'cdn.visitkorea.or.kr' },
      // 카카오 프로필 이미지
      { protocol: 'https', hostname: 'k.kakaocdn.net' },
      { protocol: 'http', hostname: 'k.kakaocdn.net' },
      // 국가유산청 이미지 서버
      { protocol: 'http', hostname: 'www.khs.go.kr' },
      { protocol: 'https', hostname: 'www.khs.go.kr' },
      { protocol: 'http', hostname: 'search.cha.go.kr' },
      { protocol: 'https', hostname: 'search.cha.go.kr' },
    ],
  },
  // Firebase Admin SDK 서버사이드 전용 패키지 설정
  serverExternalPackages: ['firebase-admin'],
};

export default nextConfig;
