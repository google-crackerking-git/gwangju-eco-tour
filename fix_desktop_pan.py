import io

with io.open('components/map/EcoTourMap.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_block = '''    // 약간 지연 후 부드럽게 오프셋 이동
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

new_block = '''    // 약간 지연 후 부드럽게 오프셋 이동
    setTimeout(() => {
      if (window.innerWidth < 768) {
        // 모바일: 마커를 화면 '아래쪽'으로 내려서 팝업이 온전히 보이도록 함
        map.panBy(0, -200); 
      } else {
        // 데스크탑: 지도가 이미 사이드바 우측의 남은 영역을 꽉 채우고 있으므로 
        // 수평 중앙은 이미 정확히 맞습니다. 수평 오프셋은 0으로 두고,
        // 위로 길게 뜨는 팝업을 위해 수직으로만 약간(150px) 내립니다.
        map.panBy(0, -150);
      }
    }, 50);'''

content = content.replace(old_block, new_block)

with io.open('components/map/EcoTourMap.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
