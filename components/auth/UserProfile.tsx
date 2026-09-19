'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import type { Session } from 'next-auth';

interface UserProfileProps {
  session: Session;
}

export default function UserProfile({ session }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const user = session.user;
  const avatarSrc = user?.image ?? null;
  const nickname = user?.name ?? '사용자';

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex cursor-pointer items-center gap-1.5 md:gap-2 rounded-full px-2 py-1 md:px-3 md:py-1.5 transition-colors hover:bg-white/20"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {avatarSrc ? (
          <Image
            src={avatarSrc}
            alt={`${nickname} 프로필`}
            width={28}
            height={28}
            className="md:w-8 md:h-8 rounded-full object-cover bg-white"
          />
        ) : (
          /* Fallback avatar */
          <span
            className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full text-xs md:text-sm font-bold text-brand-navy bg-white"
          >
            {nickname.charAt(0)}
          </span>
        )}
        <span className="text-xs md:text-sm font-bold text-white hidden sm:block">{nickname}</span>
        {/* Chevron */}
        <svg
          className={`h-3 w-3 md:h-4 md:w-4 text-white/80 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="animate-fade-in-up absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
          <Link
            href="/my"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50"
          >
            <span>👤</span>
            마이페이지
          </Link>
          <hr className="border-gray-100" />
          <button
            type="button"
            onClick={() => signOut()}
            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50"
          >
            <span>🚪</span>
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}
