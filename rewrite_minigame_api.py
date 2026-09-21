import io
import re

with io.open('public/minigame.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Add global vars
if 'let collectedList = [];' in text and 'let isUserLoggedIn = false;' not in text:
    text = text.replace('let collectedList = [];\n', "let collectedList = [];\n        let isUserLoggedIn = false;\n        let serverTotalScore = 0;\n")

# Replace game clear logic
old_block = r'''// Data Integration: Save points to localStorage for main app.*?document\.getElementById\('end-screen'\)\.classList\.remove\('hidden'\);'''

new_block = '''document.getElementById('end-title').innerText = 🚍  완주 성공!;
                
                if (!isUserLoggedIn) {
                    document.getElementById('end-desc').innerHTML = 
                        오매나와 함께 <b>[ - ]</b> 노선의<br>
                        관광지를 성공적으로 수집했습니다!<br><br>
                        🎉 <b>획득 점수:</b> <span class="text-amber-300 font-extrabold text-lg">+ PT</span><br>
                        <span class="text-red-400 text-xs mt-1 block font-bold">⚠️ 카카오 로그인을 하셔야 점수가 누적됩니다!</span>
                    ;
                    showEndScreen();
                } else {
                    document.getElementById('end-desc').innerHTML = <span class="text-slate-300 text-sm">점수 저장 중...</span>;
                    showEndScreen();
                    
                    fetch('/api/game/score', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            routeId: activeRoute.id,
                            spots: collectedList.map(s => s.name)
                        })
                    }).then(r => r.json()).then(data => {
                        if (data.success) {
                            serverTotalScore = data.totalScore;
                            let msg = 
                                오매나와 함께 <b>[ - ]</b> 노선의<br>
                                관광지를 성공적으로 수집했습니다!<br><br>
                                🎉 <b>신규 획득 점수:</b> <span class="text-amber-300 font-extrabold text-lg">+ PT</span><br>
                            ;
                            if (data.addedScore < score) {
                                msg += <span class="text-slate-400 text-xs block mt-1">(이미 방문하여 획득한 관광지 점수는 제외됨)</span>;
                            }
                            msg += <span class="text-emerald-300 text-xs mt-1 block">(총 누적:  PT)</span>;
                            document.getElementById('end-desc').innerHTML = msg;
                        } else {
                            document.getElementById('end-desc').innerHTML = <span class="text-red-400">점수 저장 실패 (로그인 만료)</span>;
                        }
                    }).catch(e => {
                        document.getElementById('end-desc').innerHTML = <span class="text-red-400">점수 저장 중 오류 발생</span>;
                    });
                }
                
                function showEndScreen() {
                    const spotContainer = document.getElementById('collected-spots-list');
                    document.getElementById('end-collection-count').innerText = ${collectedList.length} /  수집 완료;
                    spotContainer.innerHTML = '';
                    if (collectedList.length === 0) {
                        spotContainer.innerHTML = '<span class="text-slate-500 text-xs col-span-3">수집한 관광지가 없습니다.</span>';
                    } else {
                        collectedList.forEach(spot => {
                            const tag = document.createElement('div');
                            tag.className = 'bg-slate-800/90 border border-slate-700/80 rounded-xl p-2 flex flex-col justify-center text-left';
                            tag.innerHTML = 
                                <span class="text-[11px] font-bold text-amber-300 line-clamp-1">📍 </span>
                                <span class="text-[9px] text-slate-400 mt-0.5">반경 </span>
                            ;
                            spotContainer.appendChild(tag);
                        });
                    }
                    document.getElementById('end-screen').classList.remove('hidden');
                }'''

pattern = re.compile(old_block, re.DOTALL)
if pattern.search(text):
    text = pattern.sub(new_block, text)
    print("Replaced end logic")
else:
    print("Failed to replace end logic")

# Add fetch call at the bottom before script end
init_logic = '''        initControls();
        requestAnimationFrame(gameLoop);'''
fetch_logic = '''        // Initialize session score
        fetch('/api/game/score')
            .then(res => res.json())
            .then(data => {
                if(data.success) {
                    isUserLoggedIn = true;
                    serverTotalScore = data.totalScore;
                }
            }).catch(e => console.log('Not logged in'));

        initControls();
        requestAnimationFrame(gameLoop);'''

text = text.replace(init_logic, fetch_logic)

with io.open('public/minigame.html', 'w', encoding='utf-8') as f:
    f.write(text)
