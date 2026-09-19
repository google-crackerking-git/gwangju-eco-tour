// 광주에코투어 공통 타입 정의

// ─── 버스 관련 타입 ───────────────────────────────────────────
export interface BusRoute {
  routeId: string;
  routeNo: string;      // 노선 번호 (예: "518", "금호21")
  routeType: string;    // 노선 유형
  startNodeName: string;
  endNodeName: string;
}

export interface BusStop {
  nodeId: string;
  nodeName: string;
  arsId?: string;
  lat: number;
  lng: number;
  nodeOrder: number;    // 노선 내 정류장 순서
  dir?: 'up' | 'down';  // 상하행 구분
}

// ─── 지하철 관련 타입 ─────────────────────────────────────────
export interface SubwayStation {
  stationId: number;
  stationName: string;
  lineNumber: number;
  lat: number;
  lng: number;
  address: string;
}

// ─── 관광지 관련 타입 ─────────────────────────────────────────
export type TourismContentType = 12 | 14 | 39 | 32;

export const CONTENT_TYPE_LABELS: Record<TourismContentType, string> = {
  12: '관광지',
  14: '문화시설',
  39: '음식점',
  32: '숙박',
};

export const CONTENT_TYPE_COLORS: Record<TourismContentType, string> = {
  12: '#1E3A8A', // 네이비블루 - 관광지
  14: '#7C3AED', // 보라 - 문화시설
  39: '#EA580C', // 주황 - 음식점
  32: '#2D7A3A', // 에코그린 - 숙박
};

export const CONTENT_TYPE_ICONS: Record<TourismContentType, string> = {
  12: '🏛️',
  14: '🎭',
  39: '🍽️',
  32: '🏨',
};

export interface TourismPlace {
  contentId: string;
  contentTypeId: TourismContentType;
  title: string;
  addr1: string;
  addr2?: string;
  firstimage?: string;
  firstimage2?: string;
  mapx: number;           // 경도
  mapy: number;           // 위도
  dist: number;           // 정류장으로부터 거리 (미터)
  tel?: string;
  homepage?: string;
  overview?: string;
  isOfficial?: boolean;
  isNamdoTour?: boolean;
  isHeritage?: boolean;
}

// ─── 즐겨찾기 / 방문기록 타입 ────────────────────────────────
export interface FavoritePlace {
  placeId: string;
  title: string;
  contentTypeId: TourismContentType;
  mapX: number;
  mapY: number;
  firstimage?: string;
  nearestStop: string;    // 가장 가까운 정류장/역명
  savedAt: string;        // ISO 날짜 문자열
}

export interface VisitRecord {
  visitId: string;
  placeId: string;
  title: string;
  contentTypeId: TourismContentType;
  mapX: number;
  mapY: number;
  firstimage?: string;
  nearestStop: string;
  visitedAt: string;      // ISO 날짜 문자열
  memo?: string;
}

// ─── UI 상태 타입 ─────────────────────────────────────────────
export type TransportMode = 'bus' | 'subway';

export interface SelectedStop {
  type: TransportMode;
  id: string;
  name: string;
  lat: number;
  lng: number;
}

// ─── API 응답 공통 타입 ───────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
