import { useState, useEffect } from 'react';
import { MapMarker, CustomOverlayMap } from 'react-kakao-maps-sdk';
import type { TourismPlace } from '@/types';
import { CONTENT_TYPE_COLORS, CONTENT_TYPE_ICONS } from '@/types';
import { useEcoTourStore } from '@/store/ecoTourStore';
import Image from 'next/image';

interface TourismMarkerProps {
  place: TourismPlace;
  isSelected?: boolean;
  onSelect: () => void;
}

const CATEGORY_COLORS: Record<number, string> = {
  12: '#1E3A8A',
  14: '#7C3AED',
  39: '#EA580C',
  32: '#2D7A3A',
};

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

export default function TourismMarker({ place, isSelected, onSelect }: TourismMarkerProps) {
  const [hovered, setHovered] = useState(false);
  const [detailInfo, setDetailInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { allTourism, setSelectedTourism, selectedStop } = useEcoTourStore();

  useEffect(() => {
    if (isSelected && !detailInfo && !loading) {
      setLoading(true);
      fetch(`/api/tourism/detail?contentId=${place.contentId}&title=${encodeURIComponent(place.title)}&addr1=${encodeURIComponent(place.addr1 || '')}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setDetailInfo(data.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isSelected, detailInfo, loading, place.contentId, place.title, place.addr1]);

  const color = CATEGORY_COLORS[place.contentTypeId] ?? '#666666';
  const icon = CONTENT_TYPE_ICONS[place.contentTypeId] ?? '📍';

  // 로컬 연관 관광지 계산 (반경 500m 이내)
  const relatedPlaces = allTourism.filter(p => 
    p.contentId !== place.contentId && 
    getDistance(place.mapy, place.mapx, p.mapy, p.mapx) <= 500
  ).slice(0, 3); // 최대 3개

  const markerSvg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
      <circle cx="14" cy="14" r="14" fill="${color}" stroke="white" stroke-width="2" opacity="0.95"/>
      <text x="14" y="18.5" fill="white" font-size="12" text-anchor="middle">${icon}</text>
    </svg>
  `);
  const selectedMarkerSvg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="16" fill="${color}" stroke="#FBBF24" stroke-width="4"/>
      <text x="18" y="23.5" fill="white" font-size="16" text-anchor="middle">${icon}</text>
    </svg>
  `);

  return (
    <>
      <MapMarker
        position={{ lat: place.mapy, lng: place.mapx }}
        title={place.title}
        onClick={onSelect}
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
        image={{
          src: `data:image/svg+xml;utf8,${isSelected ? selectedMarkerSvg : markerSvg}`,
          size: isSelected ? { width: 36, height: 36 } : { width: 28, height: 28 },
        }}
      />
      {hovered && !isSelected && (
        <CustomOverlayMap position={{ lat: place.mapy, lng: place.mapx }} yAnchor={2.2} zIndex={20}>
          <div className="px-2 py-1 rounded-lg text-white text-xs font-semibold shadow-lg whitespace-nowrap" style={{ backgroundColor: color }}>
            {icon} {place.title}
          </div>
        </CustomOverlayMap>
      )}
      {isSelected && (
        <CustomOverlayMap position={{ lat: place.mapy, lng: place.mapx }} yAnchor={1.2} zIndex={30} clickable={true}>
          <div 
            className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col" 
            style={{ width: '340px', maxHeight: '500px' }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {/* Header Image or Gallery */}
            {detailInfo?.gallery?.length > 0 ? (
              <div className="relative w-full h-36 bg-gray-100 shrink-0 flex overflow-x-auto snap-x">
                {detailInfo.gallery.map((img: string, i: number) => (
                  <a key={i} href={img} target="_blank" rel="noreferrer" className="relative w-full h-full shrink-0 snap-center block">
                    <Image src={img} alt={`${place.title} 사진 ${i+1}`} fill className="object-cover" />
                  </a>
                ))}
                <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-0.5 rounded text-xs pointer-events-none">
                  {detailInfo.gallery.length}장
                </div>
              </div>
            ) : place.firstimage ? (
              <a href={place.firstimage} target="_blank" rel="noreferrer" className="relative w-full h-36 bg-gray-100 shrink-0 block">
                <Image src={place.firstimage} alt={place.title} fill className="object-cover" />
              </a>
            ) : (
              <div className="w-full h-24 bg-gray-100 flex items-center justify-center text-3xl shrink-0">
                {icon}
              </div>
            )}
            
            <div className="p-4 overflow-y-auto">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-base text-gray-900 leading-tight">{place.title}</h3>
                <div className="flex flex-col items-end gap-1">
                  {detailInfo?.petInfo?.acmpyPsblCpam?.includes('가능') && (
                    <span className="shrink-0 bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded font-bold border border-green-200">
                      🐕 반려동물
                    </span>
                  )}
                  <a 
                    href={
                      selectedStop
                        ? `https://map.kakao.com/link/from/${selectedStop.name},${selectedStop.lat},${selectedStop.lng}/to/${place.title},${place.mapy},${place.mapx}`
                        : `https://map.kakao.com/link/to/${place.title},${place.mapy},${place.mapx}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 bg-blue-600 text-white text-[10px] px-2 py-1 rounded font-bold hover:bg-blue-700 transition-colors"
                  >
                    🚶 길찾기
                  </a>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-2 leading-snug">{place.addr1}</p>
              {place.tel && <p className="text-sm text-blue-600 mb-3">📞 {place.tel}</p>}
              
              {/* 추가 상세 정보 (overview) */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {detailInfo ? detailInfo.overview : '상세 정보를 불러오는 중입니다...'}
                </p>
              </div>

              {/* 연관 관광지 (500m 이내) */}
              {relatedPlaces.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-800 mb-2">🚶 주변 도보 500m 연관 관광지</h4>
                  <div className="space-y-1.5">
                    {relatedPlaces.map(rp => (
                      <button
                        key={rp.contentId}
                        onClick={() => setSelectedTourism(rp)}
                        className="w-full text-left text-xs p-2 rounded bg-gray-50 hover:bg-blue-50 text-gray-700 transition-colors flex items-center justify-between"
                      >
                        <span className="truncate flex-1">{CONTENT_TYPE_ICONS[rp.contentTypeId]} {rp.title}</span>
                        <span className="text-blue-500 font-medium ml-2">{Math.round(getDistance(place.mapy, place.mapx, rp.mapy, rp.mapx))}m</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CustomOverlayMap>
      )}
    </>
  );
}
