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
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    if (isSelected && !info) {
      fetch(`/api/subway/stationInfo?stationId=${station.stationId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setInfo(data.data);
          }
        })
        .catch(console.error);
    }
  }, [isSelected, info, station.stationId]);

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
          src: \`data:image/svg+xml;utf8,\${isSelected ? selectedSubwaySvg : subwaySvg}\`,
          size: isSelected ? { width: 36, height: 36 } : { width: 28, height: 28 },
        }}
      />
      {isSelected && info && (
        <CustomOverlayMap position={{ lat: station.lat, lng: station.lng }} yAnchor={1.2} zIndex={30} clickable={true}>
          <div 
            className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col border border-purple-200" 
            style={{ width: '250px' }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <div className="bg-purple-600 px-3 py-2 text-white font-bold flex justify-between items-center">
              <span>🚇 {info.station_name}역</span>
              <span className="text-xs opacity-80">1호선</span>
            </div>
            <div className="p-3 text-sm text-gray-700 space-y-1">
              <p>📍 {info.station_place}</p>
              <p>📐 역사 면적: {info.station_area} ㎡</p>
              <p>🪑 대합실 면적: {info.waiting_room_area} ㎡</p>
            </div>
          </div>
        </CustomOverlayMap>
      )}
    </>
  );
}
