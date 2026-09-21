import io

with io.open('components/map/EcoTourMap.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_block = '''    // 지도 레벨 확대 (레벨 3)
    map.setLevel(3, { animate: true });

    // 위치로 이동
    const targetPos = new kakao.maps.LatLng(targetLat, targetLng);
    map.panTo(targetPos);

    // 마커가 패널(사이드바/바텀시트)에 가려지지 않도록 약간 오프셋 적용
    setTimeout(() => {
      if (window.innerWidth < 768) {
        // 모바일: 바텀시트가 거의 화면을 덮으므로(85dvh), 마커를 화면 상단으로 올림 (화면 중심을 아래로 이동)
        map.panBy(0, window.innerHeight * 0.35);
      } else {
        // 데스크탑: 사이드바가 왼쪽을 가리므로 마커를 우측으로 옮김 (화면 중심을 왼쪽으로 이동)
        map.panBy(-150, 0);
      }
    }, 100); // panTo가 시작된 직후 panBy를 적용하여 자연스럽게 이동'''

new_block = '''    const targetPos = new kakao.maps.LatLng(targetLat, targetLng);
    
    // 즉시 이동 및 줌 (애니메이션 충돌 방지)
    map.setLevel(4);
    map.setCenter(targetPos);

    // 약간 지연 후 부드럽게 오프셋 이동 (마커가 가려지지 않게)
    setTimeout(() => {
      if (window.innerWidth < 768) {
        map.panBy(0, 150); // 아래로 150px 이동 (마커는 위로)
      } else {
        map.panBy(-150, 0); // 왼쪽으로 150px 이동 (마커는 오른쪽으로)
      }
    }, 50);'''

content = content.replace(old_block, new_block)

with io.open('components/map/EcoTourMap.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
