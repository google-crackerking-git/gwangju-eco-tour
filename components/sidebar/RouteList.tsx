'use client';

import { useEffect, useState } from 'react';
import { useEcoTourStore } from '@/store/ecoTourStore';
import CharacterEmptyState from '@/components/character/CharacterEmptyState';
import type { BusRoute, BusStop, SelectedStop } from '@/types';

interface RouteListProps {
  onStopSelect: (stop: SelectedStop) => void;
}

export default function RouteList({ onStopSelect }: RouteListProps) {
  const {
    busRoutes,
    setBusRoutes,
    selectedBusRoute,
    setSelectedBusRoute,
    busStops,
    setBusStops,
    selectedRouteDir,
    setSelectedRouteDir,
  } = useEcoTourStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false);
  const [isLoadingStops, setIsLoadingStops] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  // Fetch all routes on mount
  useEffect(() => {
    if (busRoutes.length > 0) return; // already cached in store
    setIsLoadingRoutes(true);
    setRouteError(null);

    fetch('/api/bus/routes')
      .then((res) => {
        if (!res.ok) throw new Error('노선 정보를 불러오지 못했습니다.');
        return res.json();
      })
      .then((json) => {
        setBusRoutes(json.data ?? []);
      })
      .catch((err: Error) => setRouteError(err.message))
      .finally(() => setIsLoadingRoutes(false));
  }, [busRoutes.length, setBusRoutes]);

  // Handle route selection → fetch stops
  async function handleRouteClick(route: BusRoute) {
    setSelectedBusRoute(route); // also clears stops/stop selection in store
    setIsLoadingStops(true);

    try {
      const res = await fetch(`/api/bus/stops?routeId=${route.routeId}`);
      if (!res.ok) throw new Error('정류장 정보를 불러오지 못했습니다.');
      const json = await res.json();
      const stops = (json.data as BusStop[]) ?? [];
      setBusStops(stops);
    } catch {
      setBusStops([]);
    } finally {
      setIsLoadingStops(false);
    }
  }

  const filtered = busRoutes.filter((r) =>
    r.routeNo.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // ── Loading state (initial fetch) ──
  if (isLoadingRoutes) {
    return (
      <div className="flex items-center justify-center py-16">
        <span
          className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
          style={{ borderColor: 'var(--color-brand-navy)', borderTopColor: 'transparent' }}
          role="status"
          aria-label="로딩 중"
        />
      </div>
    );
  }

  // ── Error state ──
  if (routeError) {
    return (
      <div className="flex flex-col items-center gap-2 py-10 text-center text-sm text-gray-500">
        <span>⚠️</span>
        <p>{routeError}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Search */}
      <div className="sticky top-0 bg-white z-10 px-3 pb-2 pt-3 shadow-sm border-b border-gray-100">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="노선 번호 검색..."
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-400 focus:bg-white"
          aria-label="버스 노선 검색"
        />
      </div>

      {/* Route list */}
      {filtered.length === 0 ? (
        <CharacterEmptyState type="no-route" />
      ) : (
        <ul className="divide-y divide-gray-100">
          {filtered.map((route) => {
            const isSelected = selectedBusRoute?.routeId === route.routeId;
            const isLoadingThis = isSelected && isLoadingStops;

            return (
              <li key={route.routeId} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => handleRouteClick(route)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-blue-50"
                  style={
                    isSelected
                      ? { backgroundColor: 'var(--color-brand-navy)', color: '#fff' }
                      : undefined
                  }
                >
                  {/* Route number badge */}
                  <span
                    className="shrink-0 rounded px-2 py-0.5 text-xs font-bold"
                    style={
                      isSelected
                        ? { backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff' }
                        : {
                            backgroundColor: 'var(--color-brand-navy-pale)',
                            color: 'var(--color-brand-navy)',
                          }
                    }
                  >
                    {route.routeNo}
                  </span>

                  {/* Start → End */}
                  <span className="min-w-0 flex-1 truncate text-sm">
                    {route.startNodeName}
                    <span className="mx-1 opacity-60">↔</span>
                    {route.endNodeName}
                  </span>

                  {/* Spinner for stop fetch */}
                  {isLoadingThis && (
                    <span
                      className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-t-transparent border-white"
                      role="status"
                    />
                  )}
                </button>

                {isSelected && !isLoadingStops && busStops && busStops.length > 0 && (
                  <div className="bg-gray-50 p-3 border-t border-gray-100 flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => setSelectedRouteDir('up')}
                      className={`flex-1 py-2 px-2 text-xs font-bold rounded-lg border transition-all ${
                        selectedRouteDir === 'up'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      종점행<br/>
                      <span className="text-[10px] font-normal opacity-90 block mt-1 truncate">[{route.endNodeName}] 방면</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRouteDir('down')}
                      className={`flex-1 py-2 px-2 text-xs font-bold rounded-lg border transition-all ${
                        selectedRouteDir === 'down'
                          ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      기점행<br/>
                      <span className="text-[10px] font-normal opacity-90 block mt-1 truncate">[{route.startNodeName}] 방면</span>
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
