import { LOCAL_MARKETS } from '@/data/markets';
import { TourismPlace } from '@/types';

export async function fetchMarkets(): Promise<TourismPlace[]> {
  return LOCAL_MARKETS;
}

export function mergeMarkets(existing: any[], newItems: TourismPlace[]) {
  // 별도 중복 제거 없이 추가 (전통시장은 TourAPI 쇼핑 카테고리와 겹칠 수 있으나, 
  // 여기서는 사용자가 제공한 커스텀 데이터를 보여주는 것이 목적)
  return [...existing, ...newItems];
}
