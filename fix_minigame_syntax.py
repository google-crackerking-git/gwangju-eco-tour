import io
import re

with io.open('public/minigame.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix the broken backticks and template literals
bad_line = "document.getElementById('end-title').innerText = 🚍  완주 성공!;"
good_line = "document.getElementById('end-title').innerText = `🚍 ${activeRoute.num} 완주 성공!`;"
text = text.replace(bad_line, good_line)

# Fix the missing template literals in the rest of the block
bad_desc1 = """                    document.getElementById('end-desc').innerHTML = `
                        오매나와 함께 <b>[ - ]</b> 노선의<br>
                        관광지를 성공적으로 수집했습니다!<br><br>
                        🎉 <b>획득 점수:</b> <span class="text-amber-300 font-extrabold text-lg">+ PT</span><br>
                        <span class="text-red-400 text-xs mt-1 block font-bold">⚠️ 카카오 로그인을 하셔야 점수가 누적됩니다!</span>
                    `;"""

good_desc1 = """                    document.getElementById('end-desc').innerHTML = `
                        오매나와 함께 <b>[${activeRoute.num} - ${activeRoute.theme}]</b> 노선의<br>
                        관광지를 성공적으로 수집했습니다!<br><br>
                        🎉 <b>획득 점수:</b> <span class="text-amber-300 font-extrabold text-lg">+${score} PT</span><br>
                        <span class="text-red-400 text-xs mt-1 block font-bold">⚠️ 카카오 로그인을 하셔야 점수가 누적됩니다!</span>
                    `;"""

text = text.replace(bad_desc1, good_desc1)

bad_msg = """                            let msg = `
                                오매나와 함께 <b>[ - ]</b> 노선의<br>
                                관광지를 성공적으로 수집했습니다!<br><br>
                                🎉 <b>신규 획득 점수:</b> <span class="text-amber-300 font-extrabold text-lg">+ PT</span><br>
                            `;"""

good_msg = """                            let msg = `
                                오매나와 함께 <b>[${activeRoute.num} - ${activeRoute.theme}]</b> 노선의<br>
                                관광지를 성공적으로 수집했습니다!<br><br>
                                🎉 <b>신규 획득 점수:</b> <span class="text-amber-300 font-extrabold text-lg">+${data.addedScore} PT</span><br>
                            `;"""

text = text.replace(bad_msg, good_msg)

bad_total = """                            msg += `<span class="text-emerald-300 text-xs mt-1 block">(총 누적:  PT)</span>`;"""
good_total = """                            msg += `<span class="text-emerald-300 text-xs mt-1 block">(총 누적: ${serverTotalScore} PT)</span>`;"""

text = text.replace(bad_total, good_total)

with io.open('public/minigame.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("done")
