import io
import re

with io.open('public/minigame.html', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = re.compile(r'id: "route_06", num: "([^"]+)", stops: \[[^\]]*\], type: "([^"]+)", typeBg: "([^"]+)",')

def repl(m):
    # Change to Maewol06, Express (급행) -> red background
    return 'id: "route_06", num: "🚌 매월06", stops: ["풍암저수지", "풍암지구", "월드컵경기장", "백운광장", "사직공원", "문화전당역", "충장로", "대인시장"], type: "급행", typeBg: "bg-red-500",'

if pattern.search(text):
    text = pattern.sub(repl, text)
    print("Replaced with regex!")
else:
    print("Could not find pattern")

with io.open('public/minigame.html', 'w', encoding='utf-8') as f:
    f.write(text)
