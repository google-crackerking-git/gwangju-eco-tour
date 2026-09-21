import io

with io.open('components/sidebar/SubwayStationList.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "import { useEcoTourStore } from '@/store/ecoTourStore';",
    "import { useEcoTourStore } from '@/store/ecoTourStore';\nimport type { SelectedStop } from '@/types';"
)

content = content.replace(
    "export default function SubwayStationList() {",
    "interface SubwayStationListProps {\n  onStopSelect: (stop: SelectedStop) => void;\n}\n\nexport default function SubwayStationList({ onStopSelect }: SubwayStationListProps) {\n  const [isOpen, setIsOpen] = useState(false);"
)

# Button toggle logic
old_btn = '''      <button
        type="button"
        className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-purple-50 shrink-0"
      >'''
new_btn = '''      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-purple-50 shrink-0"
      >'''
content = content.replace(old_btn, new_btn)

# Add caret to the button
old_span = '''        <span className="shrink-0 rounded px-2 py-1 text-xs font-bold bg-purple-600 text-white">
          운행중
        </span>'''
new_span = '''        <span className="shrink-0 rounded px-2 py-1 text-xs font-bold bg-purple-600 text-white">
          운행중
        </span>
        <span className="text-gray-400">{isOpen ? '▲' : '▼'}</span>'''
content = content.replace(old_span, new_span)

# Add station list right after the button
old_panel_start = '''      </button>
      
      <div className="p-4 bg-gray-50 flex-1 overflow-y-auto space-y-6">'''
new_panel_start = '''      </button>
      
      <div className="flex-1 overflow-y-auto bg-gray-50 flex flex-col">
        {/* 지하철 역 목록 */}
        {isOpen && (
          <div className="bg-white border-b border-gray-100 divide-y divide-gray-50">
            {subwayStations.map((station) => (
              <button
                key={station.stationId}
                onClick={() => onStopSelect({
                  type: 'subway',
                  id: String(station.stationId),
                  name: station.stationName,
                  lat: station.lat,
                  lng: station.lng,
                })}
                className="w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  <span className="font-medium text-gray-800">{station.stationName}역</span>
                </div>
                <span className="text-xs text-gray-400">자세히 보기</span>
              </button>
            ))}
          </div>
        )}

        <div className="p-4 space-y-6">'''
content = content.replace(old_panel_start, new_panel_start)

content = content.replace(
    "      </div>\n    </div>",
    "        </div>\n      </div>\n    </div>"
)

with io.open('components/sidebar/SubwayStationList.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
