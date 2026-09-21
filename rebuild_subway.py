import io

code = ''''use client';

import { useEffect, useState } from 'react';
import { useEcoTourStore } from '@/store/ecoTourStore';
import type { SelectedStop } from '@/types';

interface SubwayStationListProps {
  onStopSelect: (stop: SelectedStop) => void;
}

export default function SubwayStationList({ onStopSelect }: SubwayStationListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { subwayStations, setSubwayStations } = useEcoTourStore();

  useEffect(() => {
    if (subwayStations.length > 0) return;
    fetch('/api/subway/stations')
      .then((res) => res.json())
      .then((json) => { if (json.success) setSubwayStations(json.data); })
      .catch(console.error);
  }, [subwayStations.length, setSubwayStations]);

  return (
    <div className="divide-y divide-gray-100 flex flex-col">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-purple-50 shrink-0"
      >
        <div className="shrink-0 rounded-full w-10 h-10 bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg">
          🚇
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold text-gray-900">광주 도시철도 1호선</p>
          <p className="truncate text-xs text-gray-500 mt-1">녹동 ~ 평동 (총 20역)</p>
        </div>
        <span className="shrink-0 rounded px-2 py-1 text-xs font-bold bg-purple-600 text-white">
          운행중
        </span>
        <span className="text-gray-400">{isOpen ? '▲' : '▼'}</span>
      </button>
      
      <div className="flex-1 overflow-y-auto bg-gray-50 flex flex-col">
        {/* 지하철 역 목록 */}
        {isOpen && (
          <div className="bg-white border-b border-gray-100 divide-y divide-gray-50">
            {subwayStations.map((station) => (
              <button
                key={station.stationId}
                onClick={() => onStopSelect({
                  type: 'subway',
                  id: String(station.stationId),
                  name: station.stationName.replace(/역$/, ''),
                  lat: station.lat,
                  lng: station.lng,
                })}
                className="w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  <span className="font-medium text-gray-800">{station.stationName.replace(/역$/, '')}</span>
                </div>
                <span className="text-xs text-gray-400">자세히 보기</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
'''

with io.open('components/sidebar/SubwayStationList.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Done")
