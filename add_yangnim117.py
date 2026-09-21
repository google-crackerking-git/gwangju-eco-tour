import io
import re

with io.open('public/minigame.html', 'r', encoding='utf-8') as f:
    text = f.read()

new_route = """{
                id: "route_117", num: "🚌 양림117", type: "지선", typeBg: "bg-emerald-500", category: "HISTORY",
                theme: "근대역사 & 펭귄마을", bgColor: "gradient-green",
                touristSpots: [
                    { name: "양림동 펭귄마을", x: 310, y: 280, desc: "정크아트와 벽화가 가득한 근대 문화 골목", distance: "100m" },
                    { name: "이장우 가옥", x: 660, y: 210, desc: "광주 전통 한옥의 고즈넉한 멋을 담은 고택", distance: "200m" },
                    { name: "우일선 선교사 사택", x: 990, y: 270, desc: "이국적인 서양식 건축물과 숲길", distance: "400m" },
                    { name: "오웬기념각", x: 1360, y: 190, desc: "광주 최초의 근대식 서양 건축물", distance: "300m" },
                    { name: "양림미술관", x: 1710, y: 260, desc: "동네 골목길에 숨겨진 작은 현대미술관", distance: "200m" },
                    { name: "사직공원 전망타워", x: 2040, y: 210, desc: "광주 시내를 한눈에 담는 일몰 명소", distance: "500m" }
                ]
            },
            {
                id: "route_06","""

text = text.replace('{\n                id: "route_06",', new_route)

with io.open('public/minigame.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("done")
