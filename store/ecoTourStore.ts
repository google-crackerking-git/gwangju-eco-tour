// Zustand 전역 상태 관리
// 지도 상태, 선택된 노선/정류장, 관광지 정보, 사이드바 상태 등 관리

import { create } from 'zustand';
import type { BusRoute, BusStop, SubwayStation, TourismPlace, SelectedStop, TransportMode } from '@/types';

interface EcoTourState {
  // ─── 교통 모드 ─────────────────────────────────
  transportMode: TransportMode;
  setTransportMode: (mode: TransportMode) => void;

  // ─── 버스 상태 ─────────────────────────────────
  busRoutes: BusRoute[];
  setBusRoutes: (routes: BusRoute[]) => void;
  selectedBusRoute: BusRoute | null;
  setSelectedBusRoute: (route: BusRoute | null) => void;
  busStops: BusStop[];
  setBusStops: (stops: BusStop[]) => void;
  selectedRouteDir: 'up' | 'down' | null;
  setSelectedRouteDir: (dir: 'up' | 'down' | null) => void;

  // ─── 지하철 상태 ───────────────────────────────
  subwayStations: SubwayStation[];
  setSubwayStations: (stations: SubwayStation[]) => void;

  // ─── 선택된 정류장/역 ──────────────────────────
  selectedStop: SelectedStop | null;
  setSelectedStop: (stop: SelectedStop | null) => void;

  // ─── 관광지 상태 ───────────────────────────────
  allTourism: TourismPlace[];
  setAllTourism: (places: TourismPlace[]) => void;
  nearbyTourism: TourismPlace[];
  setNearbyTourism: (places: TourismPlace[]) => void;
  selectedTourism: TourismPlace | null;
  setSelectedTourism: (place: TourismPlace | null) => void;
  isTourismLoading: boolean;
  setIsTourismLoading: (loading: boolean) => void;

  // ─── 카테고리 필터 ─────────────────────────────
  activeCategories: number[];
  toggleCategory: (categoryId: number) => void;

  // ─── UI 상태 ───────────────────────────────────
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isMobileSheetOpen: boolean;
  setMobileSheetOpen: (open: boolean) => void;

  // ─── 초기화 ────────────────────────────────────
  reset: () => void;
}

const DEFAULT_CATEGORIES = [12, 14, 39, 32, 38];

export const useEcoTourStore = create<EcoTourState>((set) => ({
  // 교통 모드
  transportMode: 'bus',
  setTransportMode: (mode) => set({
    transportMode: mode,
    selectedStop: null,
    nearbyTourism: [],
    selectedTourism: null,
    busStops: [],
    selectedBusRoute: null,
    selectedRouteDir: null,
  }),

  // 버스
  busRoutes: [],
  setBusRoutes: (routes) => set({ busRoutes: routes }),
  selectedBusRoute: null,
  setSelectedBusRoute: (route) => set({
    selectedBusRoute: route,
    busStops: [],
    selectedStop: null,
    nearbyTourism: [],
    selectedTourism: null,
    selectedRouteDir: 'up', // 기본값으로 정방향(상행) 선택
  }),
  busStops: [],
  setBusStops: (stops) => set({ busStops: stops }),
  selectedRouteDir: null,
  setSelectedRouteDir: (dir) => set({ selectedRouteDir: dir }),

  // 지하철
  subwayStations: [],
  setSubwayStations: (stations) => set({ subwayStations: stations }),

  // 선택된 정류장/역
  selectedStop: null,
  setSelectedStop: (stop) => set({
    selectedStop: stop,
    selectedTourism: null,
    nearbyTourism: [],
  }),

  // 관광지
  allTourism: [],
  setAllTourism: (places) => set({ allTourism: places }),
  nearbyTourism: [],
  setNearbyTourism: (places) => set({ nearbyTourism: places }),
  selectedTourism: null,
  setSelectedTourism: (place) => set({ selectedTourism: place }),
  isTourismLoading: false,
  setIsTourismLoading: (loading) => set({ isTourismLoading: loading }),

  // 카테고리 필터
  activeCategories: DEFAULT_CATEGORIES,
  toggleCategory: (categoryId) => set((state) => ({
    activeCategories: state.activeCategories.includes(categoryId)
      ? state.activeCategories.filter((c) => c !== categoryId)
      : [...state.activeCategories, categoryId],
  })),

  // UI
  isSidebarOpen: true,
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  isMobileSheetOpen: false,
  setMobileSheetOpen: (open) => set({ isMobileSheetOpen: open }),

  // 초기화
  reset: () => set({
    selectedBusRoute: null,
    selectedRouteDir: null,
    busStops: [],
    selectedStop: null,
    nearbyTourism: [],
    selectedTourism: null,
    isTourismLoading: false,
    isMobileSheetOpen: false,
  }),
}));
