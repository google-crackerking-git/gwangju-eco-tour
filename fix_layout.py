# -*- coding: utf-8 -*-
import io

with io.open('public/minigame.html', 'r', encoding='utf-8') as f:
    html = f.read()

old_end = '''        <!-- Stage Clear / Completion Modal -->
        <div id="end-screen" class="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-start p-6 py-10 sm:justify-center z-40 hidden text-center overflow-y-auto">
            <div class="my-auto w-full flex flex-col items-center">'''
new_end = '''        <!-- Stage Clear / Completion Modal -->
        <div id="end-screen" class="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-40 hidden overflow-y-auto">
            <div class="min-h-full w-full flex flex-col items-center justify-center p-6 py-10 text-center">'''

old_start = '''        <!-- Start Screen / Route Selection Modal -->
        <div id="start-screen" class="absolute inset-0 bg-slate-950/92 backdrop-blur-md flex flex-col items-center justify-between p-5 z-40 overflow-y-auto">'''
new_start = '''        <!-- Start Screen / Route Selection Modal -->
        <div id="start-screen" class="absolute inset-0 bg-slate-950/92 backdrop-blur-md z-40 overflow-y-auto">
            <div class="min-h-full w-full flex flex-col items-center justify-center p-5 py-8">'''

old_start_btn = '''                <button id="start-btn" class="pulse-btn w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 text-white font-extrabold text-base shadow-lg hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2">
                    <span>에코투어 출발하기</span>
                    <span class="text-xl">🚀</span>
                </button>
            </div>
        </div>'''
new_start_btn = '''                <button id="start-btn" class="pulse-btn w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 text-white font-extrabold text-base shadow-lg hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2">
                    <span>에코투어 출발하기</span>
                    <span class="text-xl">🚀</span>
                </button>
            </div>
            </div>
        </div>'''

html = html.replace(old_end, new_end)
html = html.replace(old_start, new_start)
html = html.replace(old_start_btn, new_start_btn)

with io.open('public/minigame.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Done")
