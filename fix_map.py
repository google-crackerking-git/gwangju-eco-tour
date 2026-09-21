import io

with io.open('components/map/EcoTourMap.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_click = '''      onClick={() => {
        if (selectedTourism) {
          // 관광지가 선택되어 있다면 관광지 선택만 해제 (이전 단계)
          setSelectedTourism(null);
        } else {
          // 관광지 선택이 없는 상태라면 정류장 선택 해제 (완전 초기화)
          setSelectedStop(null);
          setNearbyTourism([]);
        }
      }}'''

new_click = '''      onClick={() => {
        // 사용자가 명시적으로 X버튼이나 닫기 버튼을 눌러야만 닫히도록 변경됨
        // (지도 바깥쪽 클릭 시 닫히지 않음)
      }}'''

content = content.replace(old_click, new_click)

with io.open('components/map/EcoTourMap.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
