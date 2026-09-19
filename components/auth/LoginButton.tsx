'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import UserProfile from './UserProfile';

export default function LoginButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="h-12 w-36 animate-pulse rounded-full bg-gray-200" />
    );
  }

  if (session) {
    return <UserProfile session={session} />;
  }

  return (
    <button
      onClick={() => signIn('kakao')}
      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-bold text-black transition-opacity hover:opacity-90 active:opacity-80"
      style={{ backgroundColor: '#FEE500' }}
      type="button"
    >
      {/* Kakao chat-bubble SVG icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        aria-hidden="true"
        className="md:w-[20px] md:h-[20px]"
      >
        <path
          d="M12 3C6.477 3 2 6.582 2 11c0 2.823 1.706 5.307 4.285 6.84L5.2 21.3a.5.5 0 0 0 .72.545l4.37-2.62A12.5 12.5 0 0 0 12 19c5.523 0 10-3.582 10-8s-4.477-8-10-8z"
          fill="currentColor"
        />
      </svg>
      <span className="hidden sm:inline">카카오 로그인</span>
    </button>
  );
}
