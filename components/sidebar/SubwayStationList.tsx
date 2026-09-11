'use client';

import { useEffect } from 'react';
import { useEcoTourStore } from '@/store/ecoTourStore';

export default function SubwayStationList() {
  const { subwayStations, setSubwayStations } = useEcoTourStore();

  // 지하철 탭 진입 시 역 목록 자동 로드
  useEffect(() => {
    if (subwayStations.length > 0) return;
    fetch('/api/subway/stations')
      .then((res) => res.json())
      .then((json) => { if (json.success) setSubwayStations(json.data); })
      .catch(console.error);
  }, [subwayStations.length, setSubwayStations]);

  return (
    <div className="divide-y divide-gray-100">
      <button
        type="button"
        className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-purple-50"
      >
        <div className="shrink-0 rounded-full w-10 h-10 bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg">
          🚇
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold text-gray-900">광주 도시철도 1호선</p>
          <p className="truncate text-xs text-gray-500 mt-1">평동 ↔ 녹동 (총 20개역)</p>
        </div>
        <span className="shrink-0 rounded px-2 py-1 text-xs font-bold bg-purple-600 text-white">
          운행중
        </span>
      </button>
    </div>
  );
}
