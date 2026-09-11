'use client';

import { MapMarker, CustomOverlayMap } from 'react-kakao-maps-sdk';
import type { BusStop } from '@/types';

interface BusStopMarkerProps {
  stop: BusStop;
  isSelected: boolean;
  hasTourism?: boolean;
  onSelect: () => void;
}

export default function BusStopMarker({ stop, isSelected, hasTourism, onSelect }: BusStopMarkerProps) {
  return (
    <>
      <MapMarker
        position={{ lat: stop.lat, lng: stop.lng }}
        title={stop.nodeName}
        onClick={onSelect}
        image={{
          src: isSelected
            ? 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png'
            : `data:image/svg+xml;utf8,${encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" width="${hasTourism ? 16 : 12}" height="${hasTourism ? 16 : 12}">
                  <circle cx="${hasTourism ? 8 : 6}" cy="${hasTourism ? 8 : 6}" r="${hasTourism ? 7 : 5}" fill="${hasTourism ? '#318440' : '#1E448A'}" stroke="white" stroke-width="2"/>
                </svg>`
              )}`,
          size: isSelected ? { width: 24, height: 35 } : (hasTourism ? { width: 16, height: 16 } : { width: 12, height: 12 }),
        }}
      />
      {isSelected && (
        <CustomOverlayMap
          position={{ lat: stop.lat, lng: stop.lng }}
          yAnchor={2.5}
        >
          <div className="custom-marker-label bg-white border border-blue-800 text-blue-800 px-2 py-1 rounded-lg text-xs font-bold shadow-md whitespace-nowrap">
            🚏 {stop.nodeName}
          </div>
        </CustomOverlayMap>
      )}
    </>
  );
}
