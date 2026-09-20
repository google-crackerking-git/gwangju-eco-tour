// 메인 지도 페이지
'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useEcoTourStore } from '@/store/ecoTourStore';
import TransportPanel from '@/components/sidebar/TransportPanel';
import TourismInfoCard from '@/components/sidebar/TourismInfoCard';
import LoginButton from '@/components/auth/LoginButton';
import CharacterLoader from '@/components/character/CharacterLoader';
import CharacterEmptyState from '@/components/character/CharacterEmptyState';
import OnboardingModal from '@/components/guide/OnboardingModal';
import type { SelectedStop } from '@/types';

// 카카오 지도는 SSR 불가 → 클라이언트에서만 로드
const EcoTourMap = dynamic(() => import('@/components/map/EcoTourMap'), {
  ssr: false,
  loading: () => <CharacterLoader />,
});

// 거리 계산 함수 (Haversine)
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
  const p1 = lat1 * Math.PI / 180;
  const p2 = lat2 * Math.PI / 180;
  const dp = (lat2 - lat1) * Math.PI / 180;
  const dl = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dp / 2) * Math.sin(dp / 2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function HomePage() {
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const { data: session } = useSession();
  const {
    selectedStop,
    nearbyTourism,
    selectedTourism,
    setSelectedTourism,
    setNearbyTourism,
    setSelectedStop,
    setIsTourismLoading,
    isTourismLoading,
    isMobileSheetOpen,
    setMobileSheetOpen,
    activeCategories,
    setAllTourism,
    allTourism,
  } = useEcoTourStore();

  // 초기 로딩 시 모든 관광지 데이터 미리 가져오기
  useEffect(() => {
    fetch('/api/tourism/all')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAllTourism(data.data);
        }
      })
      .catch(err => console.error('Failed to fetch all tourism data:', err));
  }, [setAllTourism]);

  // 정류장/역 클릭 시 관광지 조회 (클라이언트 사이드에서 즉시 필터링)
  const handleStopSelect = useCallback(async (stop: SelectedStop) => {
    setSelectedStop(stop);
    setNearbyTourism([]);
    setSelectedTourism(null);
    setIsTourismLoading(true);
    setMobileSheetOpen(true);

    try {
      const radius = stop.type === 'subway' ? 500 : 300;
      
      const nearby = allTourism
        .map(p => {
          const dist = getDistance(stop.lat, stop.lng, p.mapy, p.mapx);
          return { ...p, dist };
        })
        .filter(p => p.dist <= radius)
        .sort((a, b) => a.dist - b.dist);
        
      setNearbyTourism(nearby);
    } catch {
      console.error('관광지 조회 실패');
    } finally {
      setIsTourismLoading(false);
    }
  }, [setSelectedStop, setNearbyTourism, setSelectedTourism, setIsTourismLoading, setMobileSheetOpen, allTourism]);

  const filteredTourism = nearbyTourism.filter((p) =>
    activeCategories.includes(p.contentTypeId)
  );

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      <OnboardingModal />
      {/* ─── 헤더 ──────────────────────────────────────────────── */}
      <header
        className="flex items-center justify-between px-4 py-2 shadow-md z-50 shrink-0"
        style={{ backgroundColor: '#1E3A8A' }}
      >
        <div className="flex items-center gap-2">
          <Image
            src="/characters/1.기본형(정면).png"
            alt="오매나"
            width={36}
            height={36}
            className="rounded-full bg-white/20"
          />
          <div>
            <h1 className="text-white font-black text-base leading-tight">광주에코투어</h1>
            <p className="text-blue-200 text-xs">친환경 광주 관광</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2">
          <button
            onClick={() => window.location.reload()}
            className="text-white bg-white/20 hover:bg-white/30 px-2 py-1.5 md:px-3 md:py-1.5 rounded-full text-[11px] md:text-xs font-bold transition-colors flex items-center gap-1"
          >
            <span>🏠</span> <span className="hidden sm:inline">홈</span>
          </button>
          <button 
            onClick={() => window.dispatchEvent(new Event('openTutorial'))}
            className="text-white bg-white/20 hover:bg-white/30 px-2 py-1.5 md:px-3 md:py-1.5 rounded-full text-[11px] md:text-xs font-bold transition-colors flex items-center gap-1"
          >
            <span>💡</span> <span className="hidden sm:inline">사용법</span>
          </button>
          <a
            href="/minigame.html"
            className="text-white bg-amber-500/80 hover:bg-amber-500 px-2 py-1.5 md:px-3 md:py-1.5 rounded-full text-[11px] md:text-xs font-bold transition-colors flex items-center gap-1 shadow-md border border-amber-400"
          >
            <span>🎮</span> <span className="hidden sm:inline">미니게임</span>
          </a>
          <LoginButton />
        </div>
      </header>

      {/* ─── 메인 컨텐츠 ────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* 사이드바 (데스크탑/태블릿) */}
        <aside className={`hidden md:flex flex-col border-r border-gray-200 bg-white overflow-hidden shrink-0 transition-all duration-300 ease-in-out ${isDesktopSidebarOpen ? 'w-80 lg:w-96' : 'w-0 border-r-0 opacity-0'}`}>
          {/* 교통 선택 패널 */}
          <div className="flex-1 overflow-y-auto">
            <TransportPanel onStopSelect={handleStopSelect} />
          </div>

          {/* 관광지 정보 패널 */}
          {selectedStop && (
            <div className="border-t border-gray-100 overflow-y-auto max-h-[55dvh]">
              <div className="p-3">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-500">선택된 정류장/역</p>
                    <p className="font-bold text-sm" style={{ color: '#1E3A8A' }}>
                      🚏 {selectedStop.name}
                    </p>
                  </div>
                  <button
                    onClick={() => { setSelectedStop(null); setNearbyTourism([]); }}
                    className="text-gray-400 hover:text-gray-600 text-sm"
                  >
                    ✕
                  </button>
                </div>

                {isTourismLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Image
                      src="/characters/5. 응용형(자전거).png"
                      alt="로딩중"
                      width={80}
                      height={80}
                      className="omona-bounce"
                    />
                  </div>
                ) : filteredTourism.length === 0 ? (
                  <CharacterEmptyState type="no-tourism" />
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-gray-400">
                      반경 250m 내 {filteredTourism.length}개 장소
                    </p>
                    {filteredTourism.map((place) => (
                      <TourismInfoCard
                        key={place.contentId}
                        place={place}
                        nearestStopName={selectedStop.name}
                        onClose={() => setSelectedTourism(null)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </aside>

        {/* 지도 영역 */}
        <main className="flex-1 relative">
          <EcoTourMap onStopSelect={handleStopSelect} />
          {/* 데스크탑 사이드바 토글 버튼 */}
          <button
            onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
            className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-0 z-40 w-5 h-12 bg-white border border-gray-200 border-l-0 rounded-r-md shadow-md items-center justify-center hover:bg-gray-50 text-gray-500 focus:outline-none transition-colors text-[10px]"
          >
            {isDesktopSidebarOpen ? '◀' : '▶'}
          </button>
        </main>
      </div>

      {/* ─── 모바일 하단 시트 ──────────────────────────────────── */}
      <div className="md:hidden">
        {/* 모바일 하단 시트 핸들 */}
        {selectedStop && (
          <div
            className={`fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl z-40 transition-transform duration-300 ${
              isMobileSheetOpen ? 'translate-y-0' : 'translate-y-[calc(100%-60px)]'
            }`}
            style={{ maxHeight: '55dvh', paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            {/* 핸들 바 */}
            <div
              className="flex flex-col items-center pt-3 pb-2 cursor-pointer"
              onClick={() => setMobileSheetOpen(!isMobileSheetOpen)}
            >
              <div className="w-10 h-1 bg-gray-300 rounded-full mb-2" />
              <div className="flex items-center justify-between w-full px-4">
                <p className="font-bold text-sm" style={{ color: '#1E3A8A' }}>
                  📍 {selectedStop.name} 주변 관광지
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-xs font-medium">
                    {isMobileSheetOpen ? '접기 ▼' : '펼치기 ▲'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStop(null);
                      setNearbyTourism([]);
                      setSelectedTourism(null);
                    }}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            {/* 관광지 목록 */}
            <div className="overflow-y-auto px-4 pb-12" style={{ maxHeight: 'calc(55dvh - 60px - env(safe-area-inset-bottom))' }}>
              {isTourismLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Image
                    src="/characters/5. 응용형(자전거).png"
                    alt="로딩중"
                    width={80}
                    height={80}
                    className="omona-bounce"
                  />
                </div>
              ) : filteredTourism.length === 0 ? (
                <CharacterEmptyState type="no-tourism" />
              ) : (
                <div className="space-y-3">
                  {filteredTourism.map((place) => (
                    <TourismInfoCard
                      key={place.contentId}
                      place={place}
                      nearestStopName={selectedStop.name}
                      onClose={() => setSelectedTourism(null)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 모바일 하단 교통 패널 */}
        {!selectedStop && (
          <div
            className="fixed inset-x-0 bottom-0 bg-white border-t border-gray-200 z-40 flex flex-col"
            style={{ 
              height: '45dvh', 
              paddingBottom: 'env(safe-area-inset-bottom)' 
            }}
          >
            <div className="flex-1 overflow-hidden">
              <TransportPanel onStopSelect={handleStopSelect} mobileCompact />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
