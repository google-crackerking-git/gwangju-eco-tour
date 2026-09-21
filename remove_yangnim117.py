import io
import re

with io.open('public/minigame.html', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = re.compile(r'\s*\{\s*id:\s*"route_117".*?\},\n', re.DOTALL)

if pattern.search(text):
    text = pattern.sub('', text)
    with io.open('public/minigame.html', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Removed original route_117!")
else:
    print("Could not find route_117!")
