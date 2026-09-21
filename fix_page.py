import io

with io.open('app/page.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'isMobileSheetOpen ?' in line:
        # We found the line: {isMobileSheetOpen ? '접기 ▼' : '펼치기 ▲'}
        # It's inside a span. We want to replace the span with our new block.
        # Lines:
        # i-1: <span className="text-gray-400 text-xs">
        # i:   {isMobileSheetOpen ? '접기 ▼' : '펼치기 ▲'}
        # i+1: </span>
        
        new_block = '''                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-xs font-medium">
                    {isMobileSheetOpen ? '접기 ▼' : '펼치기 ▲'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStop(null);
                      setNearbyTourism([]);
                      setSelectedTourism(null);
                    }}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                  >
                    ✕
                  </button>
                </div>\n'''
        
        lines[i-1] = new_block
        lines[i] = ''
        lines[i+1] = ''
        break

with io.open('app/page.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Done")
