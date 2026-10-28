// 한국관광공사 반려동물 동반 여행 API(KorPetTourService2) 호출 데이터 매핑
import type { TourismPlace } from '@/types';

export interface PetPolicyResult {
  badgeText: string;
  badgeClass: string;
  badgeBorder: string;
  badgeBg: string;
  statusTitle: string;
  rules: string[];
  transitTip?: string;
}

export function getPetPolicy(place: TourismPlace, petInfo?: any): PetPolicyResult | null {
  // 반려동물 API에서 제공하는 정보가 실제로 존재하는지 확인
  const hasApiData = petInfo && (
    (petInfo.acmpyPsblCpam && petInfo.acmpyPsblCpam !== '없음') ||
    (petInfo.acmpyNeedMtr && petInfo.acmpyNeedMtr !== '없음') ||
    (petInfo.etcAcmpyInfo && petInfo.etcAcmpyInfo !== '없음')
  );

  // API 데이터가 있거나, 반려동물 API 등록 시설인 경우에만 표시
  if (place.isPetFriendly || hasApiData) {
    const rules: string[] = [];
    if (petInfo?.acmpyPsblCpam && petInfo.acmpyPsblCpam !== '없음') {
      rules.push(`동반 구분: ${petInfo.acmpyPsblCpam}`);
    }
    if (petInfo?.acmpyNeedMtr && petInfo.acmpyNeedMtr !== '없음') {
      rules.push(`필수 사항: ${petInfo.acmpyNeedMtr}`);
    }
    if (petInfo?.etcAcmpyInfo && petInfo.etcAcmpyInfo !== '없음') {
      rules.push(`이용 규정: ${petInfo.etcAcmpyInfo}`);
    }
    if (rules.length === 0) {
      rules.push('한국관광공사 반려동물 API 등록 동반 가능 시설입니다.');
      rules.push('안전한 이용을 위해 목줄(2m 이내) 착용 및 배변봉투를 지참해주세요.');
    }

    return {
      badgeText: '🐾 반려동물 동반가능',
      badgeClass: 'text-emerald-800 bg-emerald-100',
      badgeBorder: 'border-emerald-300',
      badgeBg: 'bg-emerald-50/90 border-emerald-200',
      statusTitle: '반려동물 동반 안내',
      rules,
      transitTip: '광주 시내버스·지하철 탑승 시 전용 켄넬/케이지 지참 필수',
    };
  }

  // 반려동물 API에 정보가 없는 경우 표시하지 않음
  return null;
}
