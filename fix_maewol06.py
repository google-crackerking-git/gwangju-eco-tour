import io

with io.open('public/minigame.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('id: "route_06", num: "🚌 봉암06", stops: ["첨단종점", "보훈병원", "비아농협", "광주과학기술원", "신창지구", "수완지구"]', 'id: "route_06", num: "🚌 매월06", stops: ["풍암저수지", "풍암지구", "월드컵경기장", "백운광장", "사직공원", "문화전당역", "충장로", "대인시장"]')
text = text.replace('id: "route_06", num: "🚌 봉암06", type: "지선"', 'id: "route_06", num: "🚌 매월06", stops: ["풍암저수지", "풍암지구", "월드컵경기장", "백운광장", "사직공원", "문화전당역", "충장로", "대인시장"], type: "급행"') # Maewol06 is rapid

with io.open('public/minigame.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("done")
