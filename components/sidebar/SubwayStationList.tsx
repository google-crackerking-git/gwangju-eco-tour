'use client';

import { useEffect, useState } from 'react';
import { useEcoTourStore } from '@/store/ecoTourStore';

export default function SubwayStationList() {
  const { subwayStations, setSubwayStations } = useEcoTourStore();
  const [cultureInfo, setCultureInfo] = useState<{spaces: any[], routes: any[]}>({ spaces: [], routes: [] });

  useEffect(() => {
    if (subwayStations.length > 0) return;
    fetch('/api/subway/stations')
      .then((res) => res.json())
      .then((json) => { if (json.success) setSubwayStations(json.data); })
      .catch(console.error);
  }, [subwayStations.length, setSubwayStations]);

  useEffect(() => {
    fetch('/api/subway/culture')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setCultureInfo({
            spaces: json.data.cultureSpaces || [],
            routes: json.data.cultureRoutes || []
          });
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="divide-y divide-gray-100 flex flex-col">
      <button
        type="button"
        className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-purple-50 shrink-0"
      >
        <div className="shrink-0 rounded-full w-10 h-10 bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg">
          지
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold text-gray-900">광주 도시철도 1호선</p>
          <p className="truncate text-xs text-gray-500 mt-1">녹동 ~ 평동 (총 20개역)</p>
        </div>
        <span className="shrink-0 rounded px-2 py-1 text-xs font-bold bg-purple-600 text-white">
          운행중
        </span>
      </button>
      
      <div className="p-4 bg-gray-50 flex-1 overflow-y-auto space-y-6">
        
        {/* PDF Guide Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3">
            <span>🗺️</span> 공식 관광 가이드 (PDF)
          </h3>
          <div className="flex flex-col gap-2">
            <a 
              href="/docs/오매광주+관광안내지도-국문.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
            >
              <span className="text-sm font-medium">오매광주 관광안내지도</span>
              <span className="text-xs bg-blue-200 px-2 py-1 rounded-full font-bold">열기</span>
            </a>
            <a 
              href="/docs/오매광주책자-국문.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors"
            >
              <span className="text-sm font-medium">오매광주 가이드 책자</span>
              <span className="text-xs bg-orange-200 px-2 py-1 rounded-full font-bold">열기</span>
            </a>
          </div>
        </div>

        {/* Culture Info Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3">
            <span>🎭</span> 지하철 역 인근 문화공간
          </h3>
          {cultureInfo.spaces.length > 0 || cultureInfo.routes.length > 0 ? (
            <div className="space-y-3">
              {/* Data rendering will go here when API works */}
              <p className="text-sm text-gray-600">데이터를 불러왔습니다.</p>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-xs text-gray-500">
                현재 광주교통공사 API 서버 상태가 불안정하여<br/>문화공간 데이터를 실시간으로 불러올 수 없습니다.
              </p>
              <p className="text-xs text-gray-400 mt-2">
                (API 점검 완료 후 자동 복구됩니다)
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

