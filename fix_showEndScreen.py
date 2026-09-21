import io
import re

with io.open('public/minigame.html', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = re.compile(r'function showEndScreen\(\) \{.*?document\.getElementById\(\'end-screen\'\)\.classList\.remove\(\'hidden\'\);\s*\}', re.DOTALL)

correct_block = '''function showEndScreen() {
                    const spotContainer = document.getElementById('collected-spots-list');
                    document.getElementById('end-collection-count').innerText = `${collectedList.length} / ${activeItems.length} 수집 완료`;
                    spotContainer.innerHTML = '';
                    if (collectedList.length === 0) {
                        spotContainer.innerHTML = '<span class="text-slate-500 text-xs col-span-3">수집한 관광지가 없습니다.</span>';
                    } else {
                        collectedList.forEach(spot => {
                            const tag = document.createElement('div');
                            tag.className = 'bg-slate-800/90 border border-slate-700/80 rounded-xl p-2 flex flex-col justify-center text-left';
                            tag.innerHTML = `
                                <span class="text-[11px] font-bold text-amber-300 line-clamp-1">📍 ${spot.name}</span>
                                <span class="text-[9px] text-slate-400 mt-0.5">반경 ${spot.distance}</span>
                            `;
                            spotContainer.appendChild(tag);
                        });
                    }
                    document.getElementById('end-screen').classList.remove('hidden');
                }'''

if pattern.search(text):
    text = pattern.sub(correct_block, text)
    with io.open('public/minigame.html', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Replaced showEndScreen!")
else:
    print("Failed to find showEndScreen!")
