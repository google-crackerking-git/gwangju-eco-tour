import io

with io.open('components/map/EcoTourMap.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_block = '''    // 약간 지연 후 부드럽게 오프셋 이동 (마커가 가려지지 않게)
    setTimeout(() => {
      if (window.innerWidth < 768) {
        map.panBy(0, 150); // 아래로 150px 이동 (마커는 위로)
      } else {
        map.panBy(-150, 0); // 왼쪽으로 150px 이동 (마커는 오른쪽으로)
      }
    }, 50);'''

new_block = '''    // 약간 지연 후 부드럽게 오프셋 이동
    setTimeout(() => {
      if (window.innerWidth < 768) {
        // 모바일: 팝업이 마커 '위'에 뜨기 때문에, 마커를 화면 '아래쪽'으로 내려야 팝업 전체가 보입니다.
        // 지도를 위로(-200px) 이동시켜서, 마커가 화면 아래쪽으로 내려오게 합니다.
        map.panBy(0, -200); 
      } else {
        // 데스크탑: 사이드바가 왼쪽을 가리므로 마커를 우측으로 옮김 (화면을 왼쪽으로 이동)
        map.panBy(-250, 0);
      }
    }, 50);'''

content = content.replace(old_block, new_block)

with io.open('components/map/EcoTourMap.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
