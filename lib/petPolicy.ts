// 관광지, 문화시설, 음식점, 숙박, 쇼핑 등 기존 5대 카테고리에 대한 반려동물 동반 가이드 및 공공데이터 매핑
import type { TourismPlace } from '@/types';

export interface PetPolicyResult {
  badgeText: string;
  badgeClass: string;
  badgeBorder: string;
  badgeBg: string;
  statusTitle: string;
  rules: string[];
  transitTip: string;
  isCertified: boolean;
}

export function getPetPolicy(place: TourismPlace, petInfo?: any): PetPolicyResult {
  // 1. 한국관광공사 반려동물 동반 여행 API (KorPetTourService2) 인증 시설
  if (place.isPetFriendly || (petInfo && (petInfo.acmpyPsblCpam || petInfo.etcAcmpyInfo))) {
    const rules: string[] = [];
    if (petInfo?.acmpyPsblCpam) rules.push(`동반 구분: ${petInfo.acmpyPsblCpam}`);
    if (petInfo?.acmpyNeedMtr && petInfo.acmpyNeedMtr !== '없음') rules.push(`필수 사항: ${petInfo.acmpyNeedMtr}`);
    if (petInfo?.etcAcmpyInfo && petInfo.etcAcmpyInfo !== '없음') rules.push(`이용 규정: ${petInfo.etcAcmpyInfo}`);
    if (rules.length === 0) {
      rules.push('한국관광공사 인증 반려동물 동반 가능 시설입니다.');
      rules.push('안전한 관람을 위해 목줄(2m 이내) 착용 및 배변봉투를 반드시 지참해주세요.');
    }
    return {
      badgeText: '🐾 반려동물 동반 가능',
      badgeClass: 'text-emerald-800 bg-emerald-100',
      badgeBorder: 'border-emerald-300',
      badgeBg: 'bg-emerald-50/90 border-emerald-200',
      statusTitle: '한국관광공사 인증 반려동물 동반 시설',
      rules,
      transitTip: '광주 시내버스·지하철 탑승 시 전용 켄넬/케이지 지참 필수',
      isCertified: true,
    };
  }

  // 2. 관광지 (12)
  if (place.contentTypeId === 12) {
    const isOutdoor = /공원|산|수목원|숲|길|호수|유원지|마을|생태|천변|정원|봉|대|바위/i.test(place.title);
    if (isOutdoor) {
      return {
        badgeText: '🐾 야외 산책 동반 가능',
        badgeClass: 'text-emerald-800 bg-emerald-50',
        badgeBorder: 'border-emerald-200',
        badgeBg: 'bg-emerald-50/60 border-emerald-200',
        statusTitle: '야외 산책로 반려동물 동반 안내',
        rules: [
          '목줄(길이 2m 이내) 착용 및 배변봉투 지참 시 야외 산책 가능',
          '맹견의 경우 입마개 착용 의무 (동물보호법 준수)',
          '전시관·안내소 등 실내 시설은 출입이 제한됩니다 (안내견 제외)',
        ],
        transitTip: '광주 시내버스·지하철 탑승 시 전용 켄넬/케이지 지참 필수',
        isCertified: false,
      };
    }
    return {
      badgeText: '🐾 야외 위주 동반 가능',
      badgeClass: 'text-blue-800 bg-blue-50',
      badgeBorder: 'border-blue-200',
      badgeBg: 'bg-blue-50/50 border-blue-200',
      statusTitle: '관광지 내 반려동물 동반 규정',
      rules: [
        '야외 보행 공간은 목줄 착용 및 배변처리 시 동반 가능',
        '유적지 내부 및 실내 구역은 출입이 제한될 수 있습니다.',
        place.tel ? `방문 전 문의: 📞 ${place.tel}` : '상세 규정은 관리처에 사전 문의를 권장합니다.',
      ],
      transitTip: '광주 시내버스·지하철 탑승 시 전용 켄넬/케이지 지참 필수',
      isCertified: false,
    };
  }

  // 3. 문화시설 (14) - 박물관, 미술관, 문화전당 등
  if (place.contentTypeId === 14) {
    return {
      badgeText: '🐾 안내견 가능 (실내 제한)',
      badgeClass: 'text-purple-800 bg-purple-50',
      badgeBorder: 'border-purple-200',
      badgeBg: 'bg-purple-50/50 border-purple-200',
      statusTitle: '문화시설 반려동물 동반 규정',
      rules: [
        '장애인 보조견(안내견)은 법적으로 전 구역 동반 가능 (장애인복지법 제40조)',
        '실내 전시실 및 공연장은 일반 반려동물 출입이 제한됩니다.',
        '야외 광장 및 공원 구역은 목줄 착용 시 동반 산책이 가능합니다.',
      ],
      transitTip: '광주 시내버스·지하철 탑승 시 전용 켄넬/케이지 지참 필수',
      isCertified: false,
    };
  }

  // 4. 음식점 및 카페 (39)
  if (place.contentTypeId === 39) {
    return {
      badgeText: '🐾 동반 여부 매장 문의',
      badgeClass: 'text-amber-800 bg-amber-50',
      badgeBorder: 'border-amber-200',
      badgeBg: 'bg-amber-50/50 border-amber-200',
      statusTitle: '음식점·카페 반려동물 동반 안내',
      rules: [
        '식품위생법상 실내 식사 공간은 동반이 제한될 수 있습니다.',
        '야외 테라스석 또는 전용 케이지 지참 시 이용 가능한 경우가 많습니다.',
        place.tel ? `매장 유선 문의: 📞 ${place.tel}` : '방문 전 매장에 동반 좌석 여부를 확인하세요.',
      ],
      transitTip: '광주 시내버스·지하철 탑승 시 전용 켄넬/케이지 지참 필수',
      isCertified: false,
    };
  }

  // 5. 숙박 (32)
  if (place.contentTypeId === 32) {
    return {
      badgeText: '🐾 동반 객실 사전 문의',
      badgeClass: 'text-teal-800 bg-teal-50',
      badgeBorder: 'border-teal-200',
      badgeBg: 'bg-teal-50/50 border-teal-200',
      statusTitle: '숙박시설 반려동물 동반 안내',
      rules: [
        '반려동물 전용 객실 구비 여부 및 사전 예약이 필수입니다.',
        '체중 제한(소형견 등) 또는 추가 청소 요금이 발생할 수 있습니다.',
        place.tel ? `숙소 유선 문의: 📞 ${place.tel}` : '예약 전 숙소에 동반 가능 여부를 반드시 확인하세요.',
      ],
      transitTip: '광주 시내버스·지하철 탑승 시 전용 켄넬/케이지 지참 필수',
      isCertified: false,
    };
  }

  // 6. 쇼핑 (38)
  return {
    badgeText: '🐾 케이지/유모차 지참 권장',
    badgeClass: 'text-pink-800 bg-pink-50',
    badgeBorder: 'border-pink-200',
    badgeBg: 'bg-pink-50/50 border-pink-200',
    statusTitle: '쇼핑몰·상점 반려동물 동반 안내',
    rules: [
      '쇼핑 공간 방문 시 전용 이동장(케이지) 또는 개모차 지참을 권장합니다.',
      '식품관 및 일부 식음 매장은 출입이 제한될 수 있습니다.',
      place.tel ? `매장 문의: 📞 ${place.tel}` : '매장별 동반 규정이 상이하므로 사전 확인을 권장합니다.',
    ],
    transitTip: '광주 시내버스·지하철 탑승 시 전용 켄넬/케이지 지참 필수',
    isCertified: false,
  };
}
