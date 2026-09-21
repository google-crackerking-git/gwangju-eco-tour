import io

with io.open('public/minigame.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add stops to route_06
if 'id: "route_06", num: "🚌 봉암06", type:' in text:
    text = text.replace('id: "route_06", num: "🚌 봉암06", type:', 'id: "route_06", num: "🚌 봉암06", stops: ["첨단종점", "보훈병원", "비아농협", "광주과학기술원", "신창지구", "수완지구"], type:')

# 2. Update renderRouteCards to use route.stops instead of route.touristSpots
old_card_desc = """<div class="text-xs text-slate-300 leading-snug line-clamp-2">
                        📍 ${route.touristSpots.map(s => s.name).slice(0, 3).join(', ')} 등 주요 명소
                    </div>"""
new_card_desc = """<div class="text-xs text-slate-300 leading-snug line-clamp-2">
                        📍 주요 경유: ${route.stops.slice(0, 4).join(' ➔ ')} 등
                    </div>"""

text = text.replace(old_card_desc, new_card_desc)

# There is a risk that the previous replace failed due to encoding or exact spacing, let's use a safer regex replacement for the card desc
import re
text = re.sub(r'<div class="text-xs text-slate-300 leading-snug line-clamp-2">\s*📍 \$\{route\.touristSpots[^<]*</div>', new_card_desc, text)


with io.open('public/minigame.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("done")
