'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { NOTICES, type NoticeItem } from '@/data/notices';

export default function NoticeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem>(NOTICES[0]);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const handleOpenNotice = () => setIsOpen(true);
    window.addEventListener('openNotice', handleOpenNotice);
    return () => window.removeEventListener('openNotice', handleOpenNotice);
  }, []);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm transition-opacity"
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
            <div className="flex items-center gap-2">
              <span className="text-2xl">📢</span>
              <div>
                <h2 className="font-black text-lg leading-tight">광주에코투어 공지사항</h2>
                <p className="text-blue-200 text-xs">최신 안내 및 서비스 소식을 전해드립니다</p>
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
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 bg-gray-50/50">
            {/* 공지 헤더 정보 */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${selectedNotice.badgeColor}`}
                >
                  {selectedNotice.badge}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {selectedNotice.date}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-gray-900 leading-snug">
                {selectedNotice.title}
              </h3>
            </div>

            {/* 핵심 일정 하이라이트 박스 */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-start gap-2.5">
                <span className="text-xl">⚠️</span>
                <div className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                  <p className="font-bold mb-1 text-amber-950">
                    노선 개편 및 서비스 업데이트 작업 안내
                  </p>
                  <p>
                    <span className="font-semibold">작업 예정 기간:</span>{' '}
                    <span className="text-red-600 font-bold">
                      2026. 10. 31(토) ~ 2026. 11. 07(토)
                    </span>
                  </p>
                  <p className="mt-1 text-gray-600">
                    해당 기간 동안 노선 데이터 갱신 작업으로 인해 일부 버스 정보 조회 및 도보 길찾기 이용에 일시적인 불편이 있을 수 있습니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 포스터 이미지 (있을 경우) */}
            {selectedNotice.imageUrl && (
              <div className="space-y-1.5">
                <div
                  onClick={() => setIsZoomed(true)}
                  className="relative group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-black/5 hover:border-blue-400 transition-all shadow-sm"
                >
                  <Image
                    src={selectedNotice.imageUrl}
                    alt={selectedNotice.imageAlt || '공지사항 포스터'}
                    width={800}
                    height={1100}
                    className="w-full h-auto object-contain max-h-[380px] group-hover:scale-[1.02] transition-transform duration-300"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold">
                    <span>🔍</span> 클릭하여 원본 크게 보기
                  </div>
                </div>
                <p className="text-[11px] text-gray-500 text-center">
                  💡 이미지를 터치하시면 원본 크기로 크게 보실 수 있습니다.
                </p>
              </div>
            )}

            {/* 상세 공지 본문 내용 */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-xs space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
              {selectedNotice.content.map((paragraph, idx) => (
                <p
                  key={idx}
                  className={
                    paragraph.startsWith('■')
                      ? 'font-bold text-gray-900 pt-2 border-t border-gray-100 first:border-t-0'
                      : paragraph.startsWith('  -')
                      ? 'pl-3 text-gray-600'
                      : ''
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* 하단 캐릭터 메시지 */}
            <div className="flex items-center gap-3 bg-blue-50/80 border border-blue-100 rounded-2xl p-3.5">
              <Image
                src="/characters/1.기본형(정면).png"
                alt="오매나"
                width={40}
                height={40}
                className="shrink-0"
              />
              <p className="text-xs text-blue-900 leading-snug">
                광주에코투어는 전남광주통합특별시의 친환경 대중교통 여행을 위해 신속하고 정확한 업데이트를 준비하겠습니다!
              </p>
            </div>
          </div>

          {/* 모달 푸터 버튼 */}
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

      {/* 포스터 확대 보기 모달 */}
      {isZoomed && selectedNotice.imageUrl && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-2 sm:p-4 backdrop-blur-md"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative max-w-3xl max-h-[95vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute -top-10 right-0 text-white/90 hover:text-white text-3xl font-light p-1"
              aria-label="닫기"
            >
              &times;
            </button>
            <div className="overflow-auto max-h-[88vh] rounded-xl">
              <Image
                src={selectedNotice.imageUrl}
                alt={selectedNotice.imageAlt || '공지사항 포스터 확대'}
                width={1200}
                height={1600}
                className="w-auto h-auto max-w-full rounded-xl object-contain"
              />
            </div>
            <button
              onClick={() => setIsZoomed(false)}
              className="mt-3 px-6 py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-full transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
}
