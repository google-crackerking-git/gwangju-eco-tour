// 루트 레이아웃
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/lib/auth';

export const metadata: Metadata = {
  title: '광주에코투어 🌿',
  description: '오메나와 함께하는 광주광역시 친환경 대중교통 관광 가이드',
  keywords: ['광주', '에코투어', '관광', '버스', '지하철', '오메나'],
  openGraph: {
    title: '광주에코투어',
    description: '광주 대중교통으로 떠나는 친환경 관광',
    type: 'website',
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

  return (
    <html lang="ko">
      <body>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
