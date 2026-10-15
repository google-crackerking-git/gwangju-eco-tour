'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AboutModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpenAbout = () => setIsOpen(true);
    window.addEventListener('openAbout', handleOpenAbout);
    return () => window.removeEventListener('openAbout', handleOpenAbout);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm transition-opacity"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div
          className="text-white px-5 py-4 flex justify-between items-center shrink-0 shadow-sm"
          style={{ backgroundColor: '#1E3A8A' }}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">ℹ️</span>
            <div>
              <h2 className="font-black text-lg leading-tight">광주에코투어 서비스 소개</h2>
              <p className="text-blue-200 text-xs">서비스 기획 의도 및 공식 데이터 출처 안내</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white text-3xl leading-none font-light p-1"
            aria-label="닫기"
          >
            &times;
          </button>
        </div>

        {/* 본문 영역 */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 bg-gray-50/50 text-gray-800 text-xs sm:text-sm">
          {/* 1. 개발팀 및 기획 의도 */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-xs space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900">
                기획 및 개발
              </span>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-blue-950">
                  방송대 코드아이
                </span>
                <span className="text-xs text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-md font-medium">
                  대표자 : 박승재
                </span>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed pt-1">
              『광주에코투어』는 광주광역시의 대중교통(시내버스, 도시철도)과 도보 길찾기를 연계하여,
              관광객과 시민 누구나 자가용 없이도 쾌적하게 여행할 수 있는 탄소중립 친환경 스마트 관광 웹 서비스입니다.
            </p>
          </div>

          {/* 2. 공식 운영 주체 면책 조항 (중요 안내) */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center gap-1.5 text-amber-950 font-bold text-xs sm:text-sm">
              <span className="text-base">⚠️</span>
              <h4>서비스 운영 주체 및 API 활용 안내 (필독)</h4>
            </div>
            <div className="text-amber-900/90 leading-relaxed space-y-1.5 text-[11px] sm:text-xs">
              <p>
                • 본 서비스는 정부 및 공공기관의 <strong>공공데이터 오픈 API</strong>와 민간 지도 API를 활용하여 <strong>팀 &apos;방송대 코드아이&apos;가 독립적으로 개발한 비영리 민간 프로젝트</strong>입니다.
              </p>
              <p>
                • <strong>전남광주통합특별시나 (주)카카오 등 공공기관 및 특정 기업에서 직접 운영하거나 보증하는 공식 서비스가 아닙니다.</strong>
              </p>
              <p className="text-gray-500 text-[10px] pt-1">
                ※ 오픈 API 데이터의 갱신 주기나 실시간 도로 상황에 따라 실제 운행 정보와 차이가 발생할 수 있습니다.
              </p>
            </div>
          </div>

          {/* 3. API 및 데이터 출처 */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-xs space-y-3">
            <h4 className="font-bold text-gray-900 text-xs sm:text-sm flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <span>📊</span> 공공데이터 및 API 출처
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl">
                <span className="text-base">🏛️</span>
                <div>
                  <p className="font-bold text-gray-800">한국관광공사</p>
                  <p className="text-[10px] text-gray-500">TourAPI 관광·문화·음식·숙박</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl">
                <span className="text-base">🏢</span>
                <div>
                  <p className="font-bold text-gray-800">전남광주통합특별시</p>
                  <p className="text-[10px] text-gray-500">시내버스 노선 및 정류소 정보</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl">
                <span className="text-base">🌳</span>
                <div>
                  <p className="font-bold text-gray-800">전남광주통합특별시 동구</p>
                  <p className="text-[10px] text-gray-500">동구 문화관광 테마 데이터</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl">
                <span className="text-base">🎨</span>
                <div>
                  <p className="font-bold text-gray-800">전남광주통합특별시 남구</p>
                  <p className="text-[10px] text-gray-500">남구 골목상권 및 명소 데이터</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl">
                <span className="text-base">🚇</span>
                <div>
                  <p className="font-bold text-gray-800">광주교통공사</p>
                  <p className="text-[10px] text-gray-500">도시철도 1호선 역 정보</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl">
                <span className="text-base">🌐</span>
                <div>
                  <p className="font-bold text-gray-800">한국지능정보사회진흥원</p>
                  <p className="text-[10px] text-gray-500">공공데이터 개방 인프라(NIA)</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
              <span className="font-semibold flex items-center gap-1">
                <span>🗺️</span> 지도맵 서비스 출처:
              </span>
              <span className="font-bold text-gray-900 bg-yellow-100 px-2 py-0.5 rounded-md">
                카카오 (Kakao Maps API)
              </span>
            </div>
          </div>

          {/* 4. 오매나 캐릭터 공식 사용 승인 */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-emerald-950 font-bold text-xs sm:text-sm">
                <span className="text-base">🐥</span>
                <h4>오매나 캐릭터 공식 활용 승인 내역</h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                정식 승인 완료
              </span>
            </div>
            
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-emerald-100">
              <Image
                src="/characters/2. 응용형(여행2).png"
                alt="오매나"
                width={48}
                height={48}
                className="shrink-0"
              />
              <div className="space-y-0.5 text-xs text-gray-700">
                <p>
                  <span className="font-semibold text-gray-900">승인 기관:</span>{' '}
                  <span className="font-bold text-emerald-800">전남광주통합특별시 (관광도시과)</span>
                </p>
                <p>
                  <span className="font-semibold text-gray-900">승인 사용 기간:</span>{' '}
                  <span className="font-bold text-emerald-800">2026. 9. ~ 2027. 9. (1년간)</span>
                </p>
                <p className="text-[10px] text-gray-500 pt-0.5">
                  광주광역시 대표 관광 캐릭터 &apos;오매나&apos;의 저작권 규정을 준수하여 적법하게 활용하고 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 모달 푸터 */}
        <div className="p-4 bg-white border-t border-gray-100 shrink-0">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full text-white font-bold text-base py-3.5 rounded-2xl hover:opacity-95 active:scale-[0.99] transition-all shadow-md"
            style={{ backgroundColor: '#1E3A8A' }}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
