// 즐겨찾기 토글 버튼 컴포넌트
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import type { FavoritePlace } from '@/types';

interface FavoriteButtonProps {
  placeId: string;
  placeData: Omit<FavoritePlace, 'savedAt'>;
}

export default function FavoriteButton({ placeId, placeData }: FavoriteButtonProps) {
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!session) return;
    // 즐겨찾기 상태 확인
    const checkFavorite = async () => {
      try {
        const res = await fetch('/api/user/favorites?t=' + Date.now(), { cache: 'no-store' });
        const data = await res.json();
        if (data.success) {
          const found = data.data.some((f: FavoritePlace) => f.placeId === placeId);
          setIsFavorite(found);
        }
      } catch {
        // 오류 무시
      }
    };
    checkFavorite();
  }, [placeId, session]);

  const handleToggle = async () => {
    if (!session) {
      alert('로그인 후 이용할 수 있어요.');
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorite) {
        const res = await fetch('/api/user/favorites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ placeId }),
        });
        const data = await res.json();
        if (data.success) setIsFavorite(false);
      } else {
        const res = await fetch('/api/user/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(placeData),
        });
        const data = await res.json();
        if (data.success) setIsFavorite(true);
      }
    } catch {
      alert('처리 중 오류가 발생했어요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition-all ${
        isFavorite
          ? 'bg-amber-50 text-amber-600 border border-amber-200'
          : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-amber-50 hover:text-amber-600'
      } disabled:opacity-50`}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <span>{isFavorite ? '⭐' : '☆'}</span>
      )}
      {isFavorite ? '저장됨' : '저장하기'}
    </button>
  );
}
