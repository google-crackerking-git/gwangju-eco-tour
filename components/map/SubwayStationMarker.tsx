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

  return (
    <>
      <MapMarker
        position={{ lat: station.lat, lng: station.lng }}
        title={station.stationName}
        onClick={onSelect}
        image={{
          src: isSelected
            ? 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png'
            : `data:image/svg+xml;utf8,${encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" width="${hasTourism ? 18 : 14}" height="${hasTourism ? 18 : 14}">
                  <rect x="1" y="1" width="${hasTourism ? 16 : 12}" height="${hasTourism ? 16 : 12}" rx="3" fill="${hasTourism ? '#318440' : '#7C3AED'}" stroke="white" stroke-width="2"/>
                </svg>`
              )}`,
          size: isSelected ? { width: 24, height: 35 } : (hasTourism ? { width: 18, height: 18 } : { width: 14, height: 14 }),
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
