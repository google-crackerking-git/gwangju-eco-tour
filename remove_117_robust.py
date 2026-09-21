import io
import re

with io.open('public/minigame.html', 'r', encoding='utf-8') as f:
    text = f.read()

# We know it starts with { id: "route_117",
# and ends with ] } before the next { id: "route_151",
pattern = re.compile(r'\s*\{\s*id:\s*"route_117"[\s\S]*?\]\s*\},', re.DOTALL)

if pattern.search(text):
    text = pattern.sub('', text)
    with io.open('public/minigame.html', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Removed robustly!")
else:
    print("Could not find route_117!")
