import io

with io.open('app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add useState import
content = content.replace(
    "import { useCallback, useEffect } from 'react';",
    "import { useCallback, useEffect, useState } from 'react';"
)

# 2. Add state
content = content.replace(
    "export default function HomePage() {",
    "export default function HomePage() {\n  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);"
)

# 3. Modify aside
old_aside = '''<aside className="hidden md:flex flex-col w-80 lg:w-96 border-r border-gray-200 bg-white overflow-hidden shrink-0">'''
new_aside = '''<aside className={hidden md:flex flex-col border-r border-gray-200 bg-white overflow-hidden shrink-0 transition-all duration-300 ease-in-out }>'''
content = content.replace(old_aside, new_aside)

# 4. Modify main
old_main = '''        <main className="flex-1 relative">
          <EcoTourMap onStopSelect={handleStopSelect} />
        </main>'''

new_main = '''        <main className="flex-1 relative">
          <EcoTourMap onStopSelect={handleStopSelect} />
          {/* 데스크탑 사이드바 토글 버튼 */}
          <button
            onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
            className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-0 z-40 w-5 h-12 bg-white border border-gray-200 border-l-0 rounded-r-md shadow-md items-center justify-center hover:bg-gray-50 text-gray-500 focus:outline-none transition-colors text-[10px]"
          >
            {isDesktopSidebarOpen ? '◀' : '▶'}
          </button>
        </main>'''

content = content.replace(old_main, new_main)

with io.open('app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
