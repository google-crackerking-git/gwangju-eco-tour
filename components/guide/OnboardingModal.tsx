'use client';

import { useState, useEffect } from 'react';
import { NOTICES } from '@/data/notices';

export const ONBOARDING_STORAGE_KEY = 'ecotour_hide_onboarding';
const NOTICE_STORAGE_KEY = `ecotour_hide_notice_${NOTICES[0]?.id || 'v1'}`;

export default function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const checkAndOpen = () => {
      try {
        const isDismissed = localStorage.getItem(ONBOARDING_STORAGE_KEY);
        if (!isDismissed) {
          setIsOpen(true);
        }
      } catch {
        setIsOpen(true);
      }
    };

    // 만약 공지사항이 이미 '다시 보지 않기'로 처리되어 있다면 바로 온보딩 팝업 표시
    try {
      const isNoticeDismissed = localStorage.getItem(NOTICE_STORAGE_KEY);
      if (isNoticeDismissed) {
        checkAndOpen();
      }
    } catch {
      // ignore
    }

    // 공지사항 모달이 닫히거나 스킵되었을 때 온보딩 검사
    window.addEventListener('checkOnboarding', checkAndOpen);

    // 헤더 사용법 버튼 클릭 시 수동 열기 (무조건 오픈)
    const handleOpenTutorial = () => {
      setDontShowAgain(false);
      setIsOpen(true);
    };
    window.addEventListener('openTutorial', handleOpenTutorial);

    return () => {
      window.removeEventListener('checkOnboarding', checkAndOpen);
      window.removeEventListener('openTutorial', handleOpenTutorial);
    };
  }, []);

  const handleClose = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
      } catch {
        // localStorage 접근 예외 처리
      }
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white p-5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <h2 className="font-black text-lg">광주에코투어 가이드</h2>
          </div>
          <button 
            onClick={handleClose} 
            className="text-white/80 hover:text-white text-3xl leading-none font-light p-1"
            aria-label="닫기"
          >
            &times;
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 space-y-8 bg-gray-50/50">
          <div className="flex gap-4">
            <div className="text-4xl shrink-0 mt-1 drop-shadow-md">🚌</div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1.5 text-base">대중교통 노선 검색</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                좌측(모바일은 하단) 패널에서 원하는 버스 노선이나 지하철역을 검색하고 선택하세요.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="text-4xl shrink-0 mt-1 drop-shadow-md">📍</div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1.5 text-base">정류장 및 주변 관광지 탐색</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                지도에 표시된 정류장(버스 <span className="font-bold text-blue-600">300m</span>, 지하철 <span className="font-bold text-purple-600">500m</span>)을 클릭하면 
                반경 내의 관광명소, 식당, 문화공간이 나타납니다.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="text-4xl shrink-0 mt-1 drop-shadow-md">🚶‍♂️</div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1.5 text-base">상세 정보 및 스마트 길찾기</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                관광지 마커나 리스트 카드를 터치해 정보를 확인하세요. <span className="font-bold text-blue-600 bg-blue-50 px-1 rounded">길찾기</span> 버튼을 누르면 
                현재 <span className="underline decoration-blue-300 decoration-2 underline-offset-2">선택한 정류장에서 목적지까지의 경로</span>를 즉시 안내합니다.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="text-4xl shrink-0 mt-1 drop-shadow-md">⭐</div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1.5 text-base">나만의 친환경 코스</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                로그인 후 마음에 드는 장소를 <span className="text-red-500">❤️ 찜하기</span> 하거나 
                <span className="text-green-600"> ✔️ 방문 완료</span> 표시하여 여행 코스를 기록해 보세요.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="text-4xl shrink-0 mt-1 drop-shadow-md">📱</div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1.5 text-base">홈 화면에 바로가기 추가</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                <span className="font-bold text-gray-800">아이폰(Safari):</span> 하단 공유(📤) 버튼 누른 후 &apos;홈 화면에 추가&apos; 선택<br/>
                <span className="font-bold text-gray-800">안드로이드(Chrome):</span> 우측 상단 메뉴(⋮) 누른 후 &apos;홈 화면에 추가&apos; 선택
              </p>
            </div>
          </div>
        </div>
        
        {/* 모달 푸터: 다시 보지 않기 체크박스 및 시작 버튼 */}
        <div className="p-4 sm:p-5 bg-white border-t border-gray-100 shrink-0 flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-600 hover:text-gray-900 select-none">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-4 h-4 rounded text-blue-900 border-gray-300 focus:ring-blue-900 accent-blue-900 cursor-pointer"
              />
              <span>다시 보지 않기</span>
            </label>
            <span className="text-[11px] text-gray-400">
              상단 💡 사용법에서 다시 확인 가능
            </span>
          </div>
          <button 
            onClick={handleClose}
            className="w-full bg-blue-900 text-white font-bold text-base py-3.5 rounded-2xl hover:bg-blue-800 active:scale-[0.98] transition-all shadow-md hover:shadow-lg"
          >
            에코투어 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
