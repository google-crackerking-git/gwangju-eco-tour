import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { TourismPlace, FavoritePlace, VisitRecord } from '@/types';
import { CONTENT_TYPE_LABELS, CONTENT_TYPE_ICONS, CONTENT_TYPE_COLORS } from '@/types';
import FavoriteButton from '@/components/my/FavoriteButton';
import VisitButton from '@/components/my/VisitButton';
import { useEcoTourStore } from '@/store/ecoTourStore';

interface TourismInfoCardProps {
  place: TourismPlace;
  nearestStopName: string;
  onClose: () => void;
}

// 거리 계산 함수
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

export default function TourismInfoCard({ place, nearestStopName, onClose }: TourismInfoCardProps) {
  const [imageError, setImageError] = useState(false);
  const [detailInfo, setDetailInfo] = useState<any>(null);
  const { allTourism, setSelectedTourism, selectedStop } = useEcoTourStore();

  useEffect(() => {
    if (!place) return;
    fetch(`/api/tourism/detail?contentId=${place.contentId}&title=${encodeURIComponent(place.title)}&addr1=${encodeURIComponent(place.addr1 || '')}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDetailInfo(data.data);
        }
      })
      .catch(console.error);
  }, [place.contentId, place.title]);

  const categoryColor = CONTENT_TYPE_COLORS[place.contentTypeId];
  const categoryIcon = CONTENT_TYPE_ICONS[place.contentTypeId];
  const categoryLabel = CONTENT_TYPE_LABELS[place.contentTypeId];

  // 주변 관광지 (500m 이내)
  const relatedPlaces = allTourism.filter(p => 
    p.contentId !== place.contentId && 
    getDistance(place.mapy, place.mapx, p.mapy, p.mapx) <= 500
  ).slice(0, 3);

  const favoriteData: Omit<FavoritePlace, 'savedAt'> = {
    placeId: place.contentId,
    title: place.title,
    contentTypeId: place.contentTypeId,
    mapX: place.mapx,
    mapY: place.mapy,
    firstimage: place.firstimage,
    nearestStop: nearestStopName,
  };

  const visitData: Omit<VisitRecord, 'visitId' | 'visitedAt'> = {
    placeId: place.contentId,
    title: place.title,
    contentTypeId: place.contentTypeId,
    mapX: place.mapx,
    mapY: place.mapy,
    firstimage: place.firstimage,
    nearestStop: nearestStopName,
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in-up border border-gray-100 flex flex-col max-h-[80vh]">
      {/* 이미지 영역 */}
      {detailInfo?.gallery?.length > 0 ? (
        <div className="relative w-full h-48 bg-gray-100 shrink-0 flex overflow-x-auto snap-x">
          {detailInfo.gallery.map((img: string, i: number) => (
            <a key={i} href={img} target="_blank" rel="noreferrer" className="relative w-full h-full shrink-0 snap-center block">
              <Image src={img} alt={`${place.title} 사진 ${i+1}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 380px" />
            </a>
          ))}
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-0.5 rounded text-xs z-10 pointer-events-none">
            {detailInfo.gallery.length}장
          </div>
          {/* 카테고리 뱃지 */}
          <div className="absolute top-2 left-2 px-2 py-1 rounded-full text-white text-xs font-bold z-10 pointer-events-none" style={{ backgroundColor: categoryColor }}>
            {categoryIcon} {categoryLabel}
          </div>
          <button onClick={onClose} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors z-10">✕</button>
        </div>
      ) : (
        <div className="relative w-full h-48 bg-gray-100 shrink-0">
          {place.firstimage && !imageError ? (
            <a href={place.firstimage} target="_blank" rel="noreferrer" className="relative w-full h-full block">
              <Image src={place.firstimage} alt={place.title} fill className="object-cover" onError={() => setImageError(true)} sizes="(max-width: 768px) 100vw, 380px" />
            </a>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">
              {categoryIcon}
            </div>
          )}
          <div className="absolute top-2 left-2 px-2 py-1 rounded-full text-white text-xs font-bold" style={{ backgroundColor: categoryColor }}>
            {categoryIcon} {categoryLabel}
          </div>
          <button onClick={onClose} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors">✕</button>
        </div>
      )}

      {/* 정보 영역 (스크롤 가능) */}
      <div className="p-4 space-y-3 overflow-y-auto">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg text-gray-900 leading-tight pr-2">{place.title}</h3>
            <div className="flex flex-col gap-1 items-end shrink-0">
              {place.isHeritage && (
                <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded font-bold border border-amber-300 whitespace-nowrap shadow-sm">
                  🏛️ 국가지정유산
                </span>
              )}
              {place.isOfficial && (
                <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded font-bold border border-purple-200 whitespace-nowrap">
                  🏅 광주 관광명소
                </span>
              )}
              {detailInfo?.petInfo?.acmpyPsblCpam?.includes('가능') && (
                <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded font-bold border border-green-200 whitespace-nowrap">
                  🐾 반려동물
                </span>
              )}
            </div>
          </div>
          {place.addr1 && <p className="text-sm text-gray-500 mt-1">📍 {place.addr1}</p>}
        </div>

        {/* 정류장 정보 */}
        <div className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full w-fit bg-blue-50 text-blue-900 border border-blue-100">
          🚏 {nearestStopName}에서 {Math.round(place.dist)}m
        </div>

        {/* 연락처/홈페이지 */}
        <div className="space-y-1">
          {place.tel && (
            <a href={`tel:${place.tel}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600">
              📞 {place.tel}
            </a>
          )}
        </div>

        {/* 상세 설명 */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="font-bold text-sm text-gray-800 mb-2">상세 정보</h4>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
            {detailInfo?.overview || place.overview || '상세 정보를 불러오는 중입니다...'}
          </p>
        </div>

        {/* 연관 관광지 (500m 이내) */}
        {relatedPlaces.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="font-bold text-sm text-gray-800 mb-2">🚶 주변 도보 500m 연관 관광지</h4>
            <div className="space-y-2">
              {relatedPlaces.map(rp => (
                <button
                  key={rp.contentId}
                  onClick={() => setSelectedTourism(rp)}
                  className="w-full text-left text-sm p-3 rounded-lg bg-gray-50 hover:bg-blue-50 text-gray-700 transition-colors flex items-center justify-between border border-gray-100 hover:border-blue-200"
                >
                  <span className="truncate flex-1 font-medium">{CONTENT_TYPE_ICONS[rp.contentTypeId]} {rp.title}</span>
                  <span className="text-blue-600 font-bold ml-2 text-xs">{Math.round(getDistance(place.mapy, place.mapx, rp.mapy, rp.mapx))}m</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 액션 버튼들 */}
        <div className="flex gap-2 pt-4 mt-4 border-t border-gray-100">
          <a
            href={
              selectedStop
                ? `https://map.kakao.com/link/from/${selectedStop.name},${selectedStop.lat},${selectedStop.lng}/to/${place.title},${place.mapy},${place.mapx}`
                : `https://map.kakao.com/link/to/${place.title},${place.mapy},${place.mapx}`
            }
            target="_blank"
            rel="noreferrer"
            className="flex-1 text-center py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
          >
            <span>🚶</span> 길찾기
          </a>
          <FavoriteButton placeId={place.contentId} placeData={favoriteData} />
          <VisitButton placeData={visitData} />
        </div>
      </div>
    </div>
  );
}
