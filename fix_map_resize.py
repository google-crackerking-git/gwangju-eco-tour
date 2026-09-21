import io

with io.open('components/map/EcoTourMap.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Inject ResizeObserver useEffect
resize_effect = '''  // 지도 컨테이너 크기 변경(사이드바 토글 등) 시 레이아웃 재계산
  useEffect(() => {
    if (!map) return;
    
    const container = document.getElementById('map-wrapper');
    if (!container) return;
    
    const resizeObserver = new ResizeObserver(() => {
      map.relayout();
    });
    
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [map]);

  // 선택된 정류장이나 관광지가 변경될 때 중심 이동 및 확대'''

content = content.replace("  // 선택된 정류장이나 관광지가 변경될 때 중심 이동 및 확대", resize_effect)

# 2. Add wrapper div
old_map = '''  return (
    <Map
      center={{ lat: GWANGJU_CENTER.lat, lng: GWANGJU_CENTER.lng }}'''
new_map = '''  return (
    <div id="map-wrapper" className="w-full h-full">
      <Map
        center={{ lat: GWANGJU_CENTER.lat, lng: GWANGJU_CENTER.lng }}'''
content = content.replace(old_map, new_map)

# 3. Close wrapper div
old_close = '''      )}
    </Map>
  );'''
new_close = '''      )}
      </Map>
    </div>
  );'''
content = content.replace(old_close, new_close)


with io.open('components/map/EcoTourMap.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
