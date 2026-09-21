import io
import re

with io.open('public/minigame.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's find route_06 and just add the stops array properly.
# Currently it looks like: id: "route_06", num: "🚌 봉암06", type: "지선", typeBg: "bg-emerald-500", category: "NATURE",
pattern = re.compile(r'id: "route_06", num: "([^"]+)", type: "([^"]+)",')

def repl(m):
    return f'id: "route_06", num: "{m.group(1)}", stops: ["첨단종점", "보훈병원", "비아농협", "광주과학기술원", "신창지구", "수완지구"], type: "{m.group(2)}",'

if pattern.search(text):
    text = pattern.sub(repl, text)
    print("Found and replaced route_06!")
else:
    print("Could not find route_06 pattern.")

with io.open('public/minigame.html', 'w', encoding='utf-8') as f:
    f.write(text)

