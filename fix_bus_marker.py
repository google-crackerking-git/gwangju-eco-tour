import io

with io.open('components/map/BusStopMarker.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add import for store
if 'useEcoTourStore' not in content:
    content = content.replace(
        "import type { BusStop } from '@/types';",
        "import type { BusStop } from '@/types';\nimport { useEcoTourStore } from '@/store/ecoTourStore';"
    )

# 2. Add store hook
content = content.replace(
    "export default function BusStopMarker({ stop, isSelected, hasTourism, onSelect }: BusStopMarkerProps) {",
    "export default function BusStopMarker({ stop, isSelected, hasTourism, onSelect }: BusStopMarkerProps) {\n  const { setSelectedStop, setNearbyTourism } = useEcoTourStore();"
)

# 3. Add close button to label
old_label = '''          <div className="custom-marker-label bg-white border-2 border-blue-800 text-blue-900 px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg whitespace-nowrap flex flex-col items-center">
            <span>{stop.nodeName}</span>
            {stop.arsId && <span className="text-[10px] text-gray-500 font-medium">{stop.arsId}</span>}
          </div>'''

new_label = '''          <div className="custom-marker-label bg-white border-2 border-blue-800 text-blue-900 pl-3 pr-2 py-1.5 rounded-lg text-sm font-bold shadow-lg whitespace-nowrap flex items-center gap-3">
            <div className="flex flex-col items-center">
              <span>{stop.nodeName}</span>
              {stop.arsId && <span className="text-[10px] text-gray-500 font-medium">{stop.arsId}</span>}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedStop(null);
                setNearbyTourism([]);
              }}
              className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors shrink-0"
            >
              ✕
            </button>
          </div>'''

content = content.replace(old_label, new_label)

with io.open('components/map/BusStopMarker.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
