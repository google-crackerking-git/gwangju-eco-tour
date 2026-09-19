// NextAuth.js 설정 — 카카오 로그인 전용
// 서버사이드 전용 모듈

import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import Kakao from 'next-auth/providers/kakao';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authConfig: NextAuthConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  providers: [
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID!,
      ...(process.env.KAKAO_CLIENT_SECRET ? { clientSecret: process.env.KAKAO_CLIENT_SECRET } : {}),
      client: {
        token_endpoint_auth_method: process.env.KAKAO_CLIENT_SECRET ? 'client_secret_post' : 'none'
      }
    })
  ],
  callbacks: {
    jwt({ token, user, account }) {
      // 카카오 고유 ID를 명시적으로 세션(토큰)에 고정
      if (account?.providerAccountId) {
        token.sub = account.providerAccountId;
      } else if (user?.id) {
        token.sub = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
  pages: {
    signIn: '/',   // 로그인 페이지를 메인으로 설정
  },
  session: { strategy: 'jwt' },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
