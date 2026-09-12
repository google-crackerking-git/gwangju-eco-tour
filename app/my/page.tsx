// 마이페이지 — 즐겨찾기 + 방문기록
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { FavoritePlace, VisitRecord } from '@/types';
import { CONTENT_TYPE_ICONS, CONTENT_TYPE_LABELS, CONTENT_TYPE_COLORS } from '@/types';
import CharacterEmptyState from '@/components/character/CharacterEmptyState';

type Tab = 'favorites' | 'visits';

export default function MyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('favorites');
  const [favorites, setFavorites] = useState<FavoritePlace[]>([]);
  const [visits, setVisits] = useState<VisitRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingMemo, setEditingMemo] = useState<string | null>(null);
  const [memoText, setMemoText] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (!session) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [favRes, visitRes] = await Promise.all([
          fetch('/api/user/favorites?t=' + Date.now(), { cache: 'no-store' }),
          fetch('/api/user/visits?t=' + Date.now(), { cache: 'no-store' }),
        ]);
        const [favData, visitData] = await Promise.all([favRes.json(), visitRes.json()]);
        if (favData.success) setFavorites(favData.data);
        if (visitData.success) setVisits(visitData.data);
      } catch {
        console.error('데이터 로드 실패');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [session]);

  const handleDeleteFavorite = async (placeId: string) => {
    const res = await fetch('/api/user/favorites', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ placeId }),
    });
    if ((await res.json()).success) {
      setFavorites((prev) => prev.filter((f) => f.placeId !== placeId));
    }
  };

  const handleDeleteVisit = async (visitId: string) => {
    const res = await fetch('/api/user/visits', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitId }),
    });
    if ((await res.json()).success) {
      setVisits((prev) => prev.filter((v) => v.visitId !== visitId));
    }
  };

  const handleSaveMemo = async (visitId: string) => {
    const res = await fetch('/api/user/visits', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitId, memo: memoText }),
    });
    if ((await res.json()).success) {
      setVisits((prev) =>
        prev.map((v) => (v.visitId === visitId ? { ...v, memo: memoText } : v))
      );
      setEditingMemo(null);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <Image src="/characters/5. 응용형(자전거).png" alt="로딩" width={100} height={100} className="omona-bounce" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFF' }}>
      {/* 헤더 */}
      <header className="px-4 py-4 shadow-sm" style={{ backgroundColor: '#1E3A8A' }}>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-white/80 hover:text-white text-sm">← 지도로</Link>
          <div className="flex items-center gap-2">
            {session.user?.image && (
              <Image
                src={session.user.image}
                alt="프로필"
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <div>
              <p className="text-white font-bold text-sm">{session.user?.name}님의 에코투어</p>
              <p className="text-blue-200 text-xs">🌿 나의 광주 여행 기록</p>
            </div>
          </div>
        </div>
      </header>

      {/* 오메나 배너 */}
      <div className="flex items-center justify-center gap-4 py-4 px-4"
        style={{ background: 'linear-gradient(135deg, #DBEAFE, #D1FAE5)' }}>
        <Image src="/characters/1.기본(정면).png" alt="오메나" width={60} height={60} />
        <div>
          <p className="font-bold text-sm" style={{ color: '#1E3A8A' }}>
            오메나와 함께하는 광주 탐험 중!
          </p>
          <p className="text-xs text-gray-500">
            즐겨찾기 {favorites.length}개 · 방문기록 {visits.length}개
          </p>
          <p className="text-[10px] text-gray-400 mt-1">
            디버그 ID: {session.user?.id}
          </p>
        </div>
      </div>

      {/* 탭 */}
      <div className="flex border-b border-gray-200 bg-white sticky top-0 z-10">
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex-1 py-3 text-sm font-bold transition-colors ${
            activeTab === 'favorites'
              ? 'border-b-2 text-amber-500'
              : 'text-gray-400'
          }`}
          style={{ borderColor: activeTab === 'favorites' ? '#F59E0B' : 'transparent' }}
        >
          ⭐ 즐겨찾기 ({favorites.length})
        </button>
        <button
          onClick={() => setActiveTab('visits')}
          className={`flex-1 py-3 text-sm font-bold transition-colors ${
            activeTab === 'visits' ? 'border-b-2' : 'text-gray-400'
          }`}
          style={{
            borderColor: activeTab === 'visits' ? '#2D7A3A' : 'transparent',
            color: activeTab === 'visits' ? '#2D7A3A' : undefined,
          }}
        >
          📍 방문기록 ({visits.length})
        </button>
      </div>

      {/* 컨텐츠 */}
      <div className="p-4 space-y-3 max-w-2xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Image src="/characters/5. 응용형(자전거).png" alt="로딩" width={80} height={80} className="omona-bounce" />
          </div>
        ) : activeTab === 'favorites' ? (
          favorites.length === 0 ? (
            <CharacterEmptyState type="no-favorites" />
          ) : (
            favorites.map((place) => (
              <div key={place.placeId} className="bg-white rounded-2xl shadow-sm p-4 flex gap-3 items-start animate-fade-in-up">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                  style={{ backgroundColor: CONTENT_TYPE_COLORS[place.contentTypeId] + '20' }}
                >
                  {CONTENT_TYPE_ICONS[place.contentTypeId]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-900 truncate">{place.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {CONTENT_TYPE_LABELS[place.contentTypeId]} · 🚏 {place.nearestStop}
                  </p>
                  {place.firstimage && (
                    <div className="relative w-full h-24 rounded-xl overflow-hidden mt-2">
                      <Image src={place.firstimage} alt={place.title} fill className="object-cover" />
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(place.savedAt).toLocaleDateString('ko-KR')} 저장
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteFavorite(place.placeId)}
                  className="text-gray-300 hover:text-red-400 transition-colors shrink-0"
                >
                  🗑️
                </button>
              </div>
            ))
          )
        ) : visits.length === 0 ? (
          <CharacterEmptyState type="no-visits" />
        ) : (
          visits.map((visit) => (
            <div key={visit.visitId} className="bg-white rounded-2xl shadow-sm p-4 animate-fade-in-up">
              <div className="flex gap-3 items-start">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                  style={{ backgroundColor: CONTENT_TYPE_COLORS[visit.contentTypeId] + '20' }}
                >
                  {CONTENT_TYPE_ICONS[visit.contentTypeId]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-900 truncate">{visit.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {CONTENT_TYPE_LABELS[visit.contentTypeId]} · 🚏 {visit.nearestStop}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    📅 {new Date(visit.visitedAt).toLocaleDateString('ko-KR')} 방문
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteVisit(visit.visitId)}
                  className="text-gray-300 hover:text-red-400 transition-colors shrink-0"
                >
                  🗑️
                </button>
              </div>

              {/* 메모 */}
              {editingMemo === visit.visitId ? (
                <div className="mt-3 space-y-2">
                  <textarea
                    value={memoText}
                    onChange={(e) => setMemoText(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-xl p-2 resize-none focus:outline-none focus:border-blue-400"
                    rows={2}
                    placeholder="방문 메모를 남겨보세요"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingMemo(null)}
                      className="flex-1 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-xl"
                    >
                      취소
                    </button>
                    <button
                      onClick={() => handleSaveMemo(visit.visitId)}
                      className="flex-1 py-1.5 text-xs text-white rounded-xl font-medium"
                      style={{ backgroundColor: '#2D7A3A' }}
                    >
                      저장
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="mt-2 text-xs text-gray-500 cursor-pointer hover:text-blue-500"
                  onClick={() => { setEditingMemo(visit.visitId); setMemoText(visit.memo ?? ''); }}
                >
                  {visit.memo ? `📝 ${visit.memo}` : '+ 메모 추가'}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
