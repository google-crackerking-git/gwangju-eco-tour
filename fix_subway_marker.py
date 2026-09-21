import io

with io.open('components/map/SubwayStationMarker.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add import for store
if 'useEcoTourStore' not in content:
    content = content.replace(
        "import type { SubwayStation } from '@/types';",
        "import type { SubwayStation } from '@/types';\nimport { useEcoTourStore } from '@/store/ecoTourStore';"
    )

# 2. Add store hook
content = content.replace(
    "export default function SubwayStationMarker({ station, isSelected, hasTourism, onSelect }: SubwayStationMarkerProps) {",
    "export default function SubwayStationMarker({ station, isSelected, hasTourism, onSelect }: SubwayStationMarkerProps) {\n  const { setSelectedStop, setNearbyTourism } = useEcoTourStore();"
)

# 3. Add close button to header
old_header = '''            <div className="bg-purple-600 px-3 py-2 text-white font-bold flex justify-between items-center">
              <span>🚇 {station.stationName}역</span>
              <span className="text-xs opacity-80">1호선</span>
            </div>'''
new_header = '''            <div className="bg-purple-600 px-3 py-2 text-white font-bold flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span>🚇 {station.stationName}역</span>
                <span className="text-xs opacity-80">1호선</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedStop(null);
                  setNearbyTourism([]);
                }}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
              >
                ✕
              </button>
            </div>'''
content = content.replace(old_header, new_header)

with io.open('components/map/SubwayStationMarker.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
