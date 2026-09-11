# 관광공사 API 4종 추가 연동 및 팝업/사이드바 UI 개선

## 1. Goal Description
사용자의 요청에 따라 한국관광공사의 4가지 추가 API를 연동하여, 관광지 마커를 클릭하거나 사이드바에서 확인할 때 훨씬 더 풍부한 정보를 제공하도록 개선합니다.

추가되는 API 목록:
1. **반려동물 동반여행 서비스 API** (`KorPetTourService2/detailPetTour2`): 선택한 관광지의 반려동물 동반 가능 여부 및 관련 규정 표시
2. **관광사진 정보_GW API** (`PhotoGalleryService1/gallerySearchList1`): 선택한 관광지의 고화질 갤러리 사진 여러 장을 캐러셀 형태로 표시
3. **관광지별 연관 관광지 정보 API** (`TarRlteTarService1`): 현재 관광지와 연관된 추천 관광지 정보 제공
4. **기초지자체 중심 관광지 정보 API** (`LocgoHubTarService1`): 해당 지자체(예: 동구, 서구 등)의 주요 관광 정보 제공

## 2. User Review Required
- **[IMPORTANT]** `TarRlteTarService1` (연관 관광지) 및 `LocgoHubTarService1` (기초지자체 중심) API는 `baseYm`(기준연월) 및 `signguCd`(시군구코드) 파라미터를 필수로 요구합니다. 현재 관광지의 기초지자체 코드(sigungucode)를 기반으로 해당 지역의 인기/연관 관광지를 3~5개 정도 추천하는 형태로 팝업이나 사이드바 하단에 추가할 예정입니다. 화면 공간이 협소하므로, 가장 연관성 높은 3개의 장소만 요약해서 보여주도록 디자인하겠습니다. 괜찮으신가요?

## 3. Proposed Changes

### 백엔드 (API Routes)
#### [MODIFY] `app/api/tourism/detail/route.ts`
- 기존 `detailCommon2` 호출 로직에 병렬 처리(Promise.all)를 추가하여 다음 API들을 함께 호출합니다.
  - `KorPetTourService2/detailPetTour2` (반려동물 동반 여부 체크)
  - `PhotoGalleryService1/gallerySearchList1` (제목으로 사진 갤러리 검색)
  - `TarRlteTarService1` 또는 `LocgoHubTarService1` (해당 지역 연관 관광지 검색)
- 모든 정보를 조합하여 하나의 풍부한 JSON 응답(`overview`, `petInfo`, `photos`, `relatedPlaces`)으로 클라이언트에 반환합니다.

### 프론트엔드 (UI Components)
#### [MODIFY] `components/map/TourismMarker.tsx`
- 마커 클릭 시 나타나는 팝업(CustomOverlayMap) 디자인을 수정합니다.
- 갤러리 사진이 있을 경우 가로 스크롤 혹은 작게 여러 장의 사진을 보여주는 UI를 추가합니다.
- 반려동물 동반 가능(🐾) 뱃지를 추가합니다.
- "주변/연관 추천 장소" 목록을 텍스트 형태로 간략히 추가합니다.

#### [MODIFY] `components/sidebar/TourismInfoCard.tsx`
- 사이드바의 관광지 카드에도 동일하게 상세 정보(사진 갤러리, 반려동물 동반 정보, 연관 관광지)를 확장하여 보여줄 수 있도록 컴포넌트를 개선합니다.
- 사진 갤러리는 `Image` 컴포넌트를 활용해 그리드 형태로 배치합니다.

## 4. Verification Plan
- 새로운 4종 API가 기존 투어 API 키로 정상적으로 호출되고 데이터를 반환하는지 네트워크 탭을 통해 검증합니다.
- 반려동물 동반 가능한 관광지(예: 일부 공원)를 클릭했을 때 올바르게 뱃지가 나타나는지 테스트합니다.
- 마커 팝업창 및 사이드바 레이아웃이 추가된 정보(사진, 연관 관광지 등)로 인해 깨지지 않고 예쁘게 스크롤/출력되는지 검증합니다.
