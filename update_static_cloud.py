import io
import re

with io.open('public/minigame.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("{ x: 1180, y: 330, w: 130, h: 22, type: 'cloud', label: '☁️ 무등산 구름길' },", "{ x: 1180, y: 330, w: 130, h: 22, type: 'bus', label: '🚌 상무지구' },")

with io.open('public/minigame.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("done")
