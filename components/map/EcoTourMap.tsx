'use client';

import { useMemo, useEffect, useState } from 'react';
import { useKakaoLoader, Map, CustomOverlayMap } from 'react-kakao-maps-sdk';
import { useEcoTourStore } from '@/store/ecoTourStore';
import { GWANGJU_CENTER } from '@/data/subway-stations';
import BusStopMarker from './BusStopMarker';
import SubwayStationMarker from './SubwayStationMarker';
import TourismMarker from './TourismMarker';
import CharacterLoader from '@/components/character/CharacterLoader';
import type { SelectedStop } from '@/types';

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

interface EcoTourMapProps {
  onStopSelect: (stop: SelectedStop) => void;
}

export default function EcoTourMap({ onStopSelect }: EcoTourMapProps) {
  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_MAP_KEY!,
    libraries: ['clusterer'],
  });

  const {
    transportMode,
    busStops,
    subwayStations,
    nearbyTourism,
    selectedStop,
    selectedTourism,
    setSelectedTourism,
    setSelectedStop,
    setNearbyTourism,
    activeCategories,
    allTourism,
  } = useEcoTourStore();

  const [map, setMap] = useState<kakao.maps.Map | null>(null);

  // 선택된 정류장이나 관광지가 변경될 때 중심 이동
  useEffect(() => {
    if (!map) return;
    if (selectedTourism) {
      map.panTo(new kakao.maps.LatLng(selectedTourism.mapy, selectedTourism.mapx));
    } else if (selectedStop) {
      map.panTo(new kakao.maps.LatLng(selectedStop.lat, selectedStop.lng));
    }
  }, [map, selectedStop, selectedTourism]);

  // 버스 노선 선택 시 전체 정류장이 보이도록 bounds 설정
  useEffect(() => {
    if (!map || transportMode !== 'bus' || busStops.length === 0) return;
    const bounds = new kakao.maps.LatLngBounds();
    busStops.forEach(stop => bounds.extend(new kakao.maps.LatLng(stop.lat, stop.lng)));
    map.setBounds(bounds);
  }, [map, transportMode, busStops]);

  const filteredTourism = nearbyTourism.filter((p) =>
    activeCategories.includes(p.contentTypeId)
  );

  const stopsWithTourism = useMemo(() => {
    const set = new Set<string>();
    busStops.forEach(stop => {
      for (const place of allTourism) {
        if (activeCategories.includes(place.contentTypeId)) {
          if (getDistance(stop.lat, stop.lng, place.mapy, place.mapx) <= 500) {
            set.add(stop.nodeId);
            break;
          }
        }
      }
    });
    subwayStations.forEach(station => {
      for (const place of allTourism) {
        if (activeCategories.includes(place.contentTypeId)) {
          if (getDistance(station.lat, station.lng, place.mapy, place.mapx) <= 500) {
            set.add(String(station.stationId));
            break;
          }
        }
      }
    });
    return set;
  }, [busStops, subwayStations, allTourism, activeCategories]);

  if (loading) return <CharacterLoader />;
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">지도를 불러오는데 실패했습니다. 카카오 지도 API 키를 확인해주세요.</p>
      </div>
    );
  }

  return (
    <Map
      center={{ lat: GWANGJU_CENTER.lat, lng: GWANGJU_CENTER.lng }}
      style={{ width: '100%', height: '100%' }}
      level={7}
      onCreate={setMap}
      onClick={() => {
        setSelectedTourism(null);
        setSelectedStop(null);
        setNearbyTourism([]);
      }}
    >
      {/* 버스 정류장 마커 */}
      {transportMode === 'bus' && busStops.map((stop) => (
        <BusStopMarker
          key={stop.nodeId}
          stop={stop}
          isSelected={selectedStop?.id === stop.nodeId}
          hasTourism={stopsWithTourism.has(stop.nodeId)}
          onSelect={() => onStopSelect({
            type: 'bus',
            id: stop.nodeId,
            name: stop.nodeName,
            lat: stop.lat,
            lng: stop.lng,
          })}
        />
      ))}

      {/* 지하철역 마커 */}
      {transportMode === 'subway' && subwayStations.map((station) => (
        <SubwayStationMarker
          key={station.stationId}
          station={station}
          isSelected={selectedStop?.id === String(station.stationId)}
          hasTourism={stopsWithTourism.has(String(station.stationId))}
          onSelect={() => onStopSelect({
            type: 'subway',
            id: String(station.stationId),
            name: station.stationName,
            lat: station.lat,
            lng: station.lng,
          })}
        />
      ))}

      {/* 관광지 마커 */}
      {filteredTourism.map((place) => (
        <TourismMarker
          key={place.contentId}
          place={place}
          isSelected={selectedTourism?.contentId === place.contentId}
          onSelect={() => setSelectedTourism(place)}
        />
      ))}

      {/* 선택된 정류장 강조 오버레이 */}
      {selectedStop && (
        <CustomOverlayMap
          position={{ lat: selectedStop.lat, lng: selectedStop.lng }}
          zIndex={10}
        >
          <div className="relative flex items-center justify-center">
            <div
              className="absolute rounded-full animate-ping opacity-60"
              style={{
                width: 30,
                height: 30,
                backgroundColor: selectedStop.type === 'bus' ? '#1E3A8A' : '#7C3AED',
              }}
            />
            <div
              className="relative rounded-full border-2 border-white"
              style={{
                width: 16,
                height: 16,
                backgroundColor: selectedStop.type === 'bus' ? '#1E3A8A' : '#7C3AED',
              }}
            />
          </div>
        </CustomOverlayMap>
      )}
    </Map>
  );
}
