import io

with io.open('components/map/EcoTourMap.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_block = '''    // 약간 지연 후 부드럽게 오프셋 이동
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

new_block = '''    // 약간 지연 후 부드럽게 오프셋 이동
    setTimeout(() => {
      if (window.innerWidth < 768) {
        // 모바일: 마커를 화면 '아래쪽'으로 내려서 팝업이 온전히 보이도록 함
        map.panBy(0, -200); 
      } else {
        // 데스크탑: 사이드바가 왼쪽을 가리므로 마커를 우측으로 옮기고(-250px),
        // 동시에 팝업이 위에 뜰 수 있도록 마커를 아래로(-250px) 내림.
        map.panBy(-250, -250);
      }
    }, 50);'''

content = content.replace(old_block, new_block)

with io.open('components/map/EcoTourMap.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
