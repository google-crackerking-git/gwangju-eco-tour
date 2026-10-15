// 루트 레이아웃
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/lib/auth';

const SITE_URL = 'https://ecotour.gwangju.kr';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: '광주에코투어 | 오매나와 함께하는 친환경 대중교통 광주 관광',
    template: '%s | 광주에코투어',
  },
  description:
    '광주광역시 친환경 대중교통 관광 가이드! 버스·지하철 연계 도보 길찾기, 주요 관광 명소, 문화시설, 맛집, 숙박 정보 및 오매나 캐릭터와 함께하는 스마트 에코 투어.',
  keywords: [
    '광주에코투어',
    '광주 에코투어',
    '광주 관광',
    '광주 여행',
    '광주 대중교통 여행',
    '광주 버스 관광',
    '광주 지하철 관광',
    '오매나',
    '광주 친환경 관광',
    '광주 가볼만한곳',
    '탄소중립 여행',
  ],
  authors: [{ name: '광주에코투어' }],
  creator: '광주에코투어',
  publisher: '광주에코투어',
  applicationName: '광주에코투어',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: '광주에코투어 | 친환경 대중교통 광주 관광 가이드',
    description:
      '오매나와 함께 광주 대중교통(지하철·버스)으로 떠나는 탄소중립 친환경 여행! 카카오맵 연동 도보 길찾기 및 주변 관광 명소 안내',
    url: SITE_URL,
    siteName: '광주에코투어',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: '광주에코투어 - 오매나 캐릭터',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: '광주에코투어 | 대중교통 친환경 광주 관광',
    description: '오매나와 함께하는 광주 대중교통 친환경 관광 가이드',
    images: ['/icon-512.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1E3A8A',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '광주에코투어',
    url: SITE_URL,
    description:
      '광주광역시 친환경 대중교통(버스, 지하철) 연계 관광 안내 및 카카오맵 도보 길찾기 웹 애플리케이션',
    applicationCategory: 'TravelApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
    },
  };

  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}

