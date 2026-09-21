import io
import re

with io.open('public/minigame.html', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = re.compile(r'if \(player\.x >= goal\.x\) \{.*?function showEndScreen\(\) \{', re.DOTALL)

correct_block = '''if (player.x >= goal.x) {
                gameState = 'CLEAR';
                playSound('clear');
                createBurstParticles(goal.x + 35, goal.y + 30, '#38bdf8');

                document.getElementById('end-title').innerText = `🚍 ${activeRoute.num} 완주 성공!`;
                
                if (!isUserLoggedIn) {
                    document.getElementById('end-desc').innerHTML = `
                        오매나와 함께 <b>[${activeRoute.num} - ${activeRoute.theme}]</b> 노선의<br>
                        관광지를 성공적으로 수집했습니다!<br><br>
                        🎉 <b>획득 점수:</b> <span class="text-amber-300 font-extrabold text-lg">+${score} PT</span><br>
                        <span class="text-red-400 text-xs mt-1 block font-bold">⚠️ 카카오 로그인을 하셔야 점수가 누적됩니다!</span>
                    `;
                    showEndScreen();
                } else {
                    document.getElementById('end-desc').innerHTML = `<span class="text-slate-300 text-sm">점수 저장 중...</span>`;
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
                            let msg = `
                                오매나와 함께 <b>[${activeRoute.num} - ${activeRoute.theme}]</b> 노선의<br>
                                관광지를 성공적으로 수집했습니다!<br><br>
                                🎉 <b>신규 획득 점수:</b> <span class="text-amber-300 font-extrabold text-lg">+${data.addedScore} PT</span><br>
                            `;
                            if (data.addedScore < score) {
                                msg += `<span class="text-slate-400 text-xs block mt-1">(이미 방문하여 획득한 관광지 점수는 제외됨)</span>`;
                            }
                            msg += `<span class="text-emerald-300 text-xs mt-1 block">(총 누적: ${serverTotalScore} PT)</span>`;
                            document.getElementById('end-desc').innerHTML = msg;
                        } else {
                            document.getElementById('end-desc').innerHTML = `<span class="text-red-400">점수 저장 실패 (로그인 만료)</span>`;
                        }
                    }).catch(e => {
                        document.getElementById('end-desc').innerHTML = `<span class="text-red-400">점수 저장 중 오류 발생</span>`;
                    });
                }
                
                function showEndScreen() {'''

if pattern.search(text):
    text = pattern.sub(correct_block, text)
    with io.open('public/minigame.html', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Replaced with regex!")
else:
    print("Regex failed to match :(")
