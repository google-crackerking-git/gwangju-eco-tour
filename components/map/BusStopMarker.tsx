'use client';

import { MapMarker, CustomOverlayMap } from 'react-kakao-maps-sdk';
import type { BusStop } from '@/types';
import { useEcoTourStore } from '@/store/ecoTourStore';

interface BusStopMarkerProps {
  stop: BusStop;
  isSelected: boolean;
  hasTourism?: boolean;
  onSelect: () => void;
}

export default function BusStopMarker({ stop, isSelected, hasTourism, onSelect }: BusStopMarkerProps) {
  const { setSelectedStop, setNearbyTourism } = useEcoTourStore();
  const busSvg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
      <circle cx="14" cy="14" r="14" fill="#1E3A8A" stroke="white" stroke-width="2"/>
      <text x="14" y="19" fill="white" font-size="14" text-anchor="middle">🚏</text>
    </svg>
  `);
  
  const emptyBusSvg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="7" fill="#9CA3AF" stroke="white" stroke-width="1.5"/>
    </svg>
  `);
  
  const selectedBusSvg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="16" fill="#1E3A8A" stroke="#FBBF24" stroke-width="4"/>
      <text x="18" y="24" fill="white" font-size="18" text-anchor="middle">🚏</text>
    </svg>
  `);

  const isGray = hasTourism === false;
  const currentSvg = isSelected ? selectedBusSvg : (isGray ? emptyBusSvg : busSvg);
  const currentSize = isSelected ? { width: 36, height: 36 } : (isGray ? { width: 16, height: 16 } : { width: 28, height: 28 });

  return (
    <>
      <MapMarker
        position={{ lat: stop.lat, lng: stop.lng }}
        title={stop.nodeName}
        onClick={onSelect}
        image={{
          src: `data:image/svg+xml;utf8,${currentSvg}`,
          size: currentSize,
        }}
      />
      {isSelected && (
        <CustomOverlayMap
          position={{ lat: stop.lat, lng: stop.lng }}
          yAnchor={1.8}
        >
          <div className="custom-marker-label bg-white border-2 border-blue-800 text-blue-900 pl-3 pr-2 py-1.5 rounded-lg text-sm font-bold shadow-lg whitespace-nowrap flex items-center gap-3">
            <div className="flex flex-col items-center">
              <span>{stop.nodeName}</span>
              {stop.arsId && <span className="text-[10px] text-gray-500 font-medium">{stop.arsId}</span>}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedStop(null);
                setNearbyTourism([]);
              }}
              className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors shrink-0"
            >
              ✕
            </button>
          </div>
        </CustomOverlayMap>
      )}
    </>
  );
}
