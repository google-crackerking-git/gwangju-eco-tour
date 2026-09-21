import io

with io.open('components/map/TourismMarker.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_div = '''          <div 
            className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col" 
            style={{ width: '340px', maxHeight: '500px' }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {/* Header Image or Gallery */}'''

new_div = '''          <div 
            className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col relative" 
            style={{ width: '340px', maxHeight: '500px' }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTourism(null);
              }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors z-20 shadow-sm"
            >
              ✕
            </button>

            {/* Header Image or Gallery */}'''

content = content.replace(old_div, new_div)

with io.open('components/map/TourismMarker.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
