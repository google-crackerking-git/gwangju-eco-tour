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

  const [ecoPoints, setEcoPoints] = useState(0);

  // Load eco points from API
  useEffect(() => {
    const loadPoints = async () => {
      try {
        const res = await fetch('/api/game/score');
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setEcoPoints(data.totalScore);
          }
        }
      } catch (err) {
        console.error('Failed to load points');
      }
    };
    loadPoints();
    // Listen for visibility change to reload points when coming back from game tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadPoints();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

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
        <div className="hidden sm:flex items-center gap-1 bg-emerald-500/80 text-white px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-400 mr-1 shadow-inner">
          🌱 {ecoPoints} PT
        </div>
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

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-white p-2 shadow-lg ring-1 ring-black/5 z-50">
          <div className="px-3 py-2 border-b border-gray-100 mb-1">
            <p className="text-sm font-bold text-gray-900 truncate">{nickname}</p>
            <p className="text-xs text-emerald-600 font-bold mt-1">🌱 {ecoPoints} 에코포인트</p>
          </div>
          
          <Link
            href="/my"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
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
