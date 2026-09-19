'use client';

import { useState, useEffect } from 'react';
import { MapMarker, CustomOverlayMap } from 'react-kakao-maps-sdk';
import type { SubwayStation } from '@/types';

interface SubwayStationMarkerProps {
  station: SubwayStation;
  isSelected: boolean;
  hasTourism?: boolean;
  onSelect: () => void;
}

export default function SubwayStationMarker({ station, isSelected, hasTourism, onSelect }: SubwayStationMarkerProps) {

  const subwaySvg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
      <rect x="2" y="2" width="24" height="24" rx="6" fill="#7C3AED" stroke="white" stroke-width="2"/>
      <text x="14" y="19" fill="white" font-size="14" text-anchor="middle">🚇</text>
    </svg>
  `);
  
  const selectedSubwaySvg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
      <rect x="2" y="2" width="32" height="32" rx="8" fill="#7C3AED" stroke="#FBBF24" stroke-width="4"/>
      <text x="18" y="24" fill="white" font-size="18" text-anchor="middle">🚇</text>
    </svg>
  `);

  return (
    <>
      <MapMarker
        position={{ lat: station.lat, lng: station.lng }}
        title={station.stationName}
        onClick={onSelect}
        image={{
          src: `data:image/svg+xml;utf8,${isSelected ? selectedSubwaySvg : subwaySvg}`,
          size: isSelected ? { width: 36, height: 36 } : { width: 28, height: 28 },
        }}
      />
      {isSelected && (
        <CustomOverlayMap position={{ lat: station.lat, lng: station.lng }} yAnchor={1.2} zIndex={30} clickable={true}>
          <div 
            className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col border border-purple-200" 
            style={{ width: '250px' }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <div className="bg-purple-600 px-3 py-2 text-white font-bold flex justify-between items-center">
              <span>🚇 {station.stationName}역</span>
              <span className="text-xs opacity-80">1호선</span>
            </div>
            <div className="p-3 text-sm text-gray-700 text-center">
              <p className="font-medium text-gray-800 mb-1">지하철역 주변 관광지</p>
              <p className="text-xs text-gray-500">목록에서 관광지를 선택해주세요</p>
            </div>
          </div>
        </CustomOverlayMap>
      )}
    </>
  );
}
