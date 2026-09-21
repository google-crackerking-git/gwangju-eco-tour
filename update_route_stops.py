import io
import re

with io.open('public/minigame.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Add stops array to each route
replacements = {
    '"route_09", num: "🚌 첨단09",': '"route_09", num: "🚌 첨단09", stops: ["첨단종점", "쌍암공원", "첨단사거리", "보훈병원", "비아농협", "수완지구", "광천터미널", "아시아문화전당", "조선대", "무등산국립공원"],',
    '"route_01", num: "🚌 순환01",': '"route_01", num: "🚌 순환01", stops: ["상무시민공원", "시청", "운천저수지", "상무역", "김대중컨벤션센터역", "서구청", "풍암지구", "백운광장", "남광주역", "조선대", "광주역"],',
    '"route_151", num: "🚌 지원151",': '"route_151", num: "🚌 지원151", stops: ["증심사입구", "학동·증심사입구역", "전남대병원", "문화전당역", "금남로4가역", "금남로5가역", "광주역", "전남대후문", "양산동", "국립518민주묘지"],',
    '"route_29", num: "🚌 송정29",': '"route_29", num: "🚌 송정29", stops: ["도산동", "광주송정역", "송정공원역", "공항역", "호남대", "극락강역", "광천터미널", "서구청", "대인시장", "문화전당역"],',
    '"route_12", num: "🚌 수완12",': '"route_12", num: "🚌 수완12", stops: ["수완지구", "하남공단", "신가동", "광천터미널", "챔피언스필드", "중외공원", "광주비엔날레", "전남대", "일곡지구"],',
    '"route_35", num: "🚌 운림35",': '"route_35", num: "🚌 운림35", stops: ["증심사", "의재미술관", "전통문화관", "남광주역", "문화전당역", "대인시장", "광주역", "충장사", "충효동", "무등산생태탐방원"],',
    '"route_06", num: "🚌 봉암06",': '"route_06", num: "🚌 봉암06", stops: ["첨단종점", "광주과학기술원", "신창지구", "수완지구", "월드컵경기장", "광주향교", "사직공원", "풍암저수지"],'
}

for old, new in replacements.items():
    text = text.replace(old, new)

# Update resetGame() generator
old_gen = """                let types = ['bus', 'subway', 'cloud'];
                let type = types[Math.floor(random() * types.length)];
                
                const busStopNames = ["광천터미널", "전남대후문", "조선대", "광주시청", "광주역", "수완지구", "상무지구", "첨단지구", "풍암지구", "충장로", "대인시장", "백운광장", "일곡지구", "양동시장"];
                const subwayNames = ["평동역", "광주송정역", "송정공원역", "공항역", "김대중컨벤션센터역", "상무역", "운천역", "쌍촌역", "화정역", "농성역", "돌고개역", "금남로4가역", "문화전당역", "남광주역", "학동·증심사입구역", "소태역"];
                
                let label = '';
                if (type === 'bus') {
                    label = '🚌 ' + busStopNames[Math.floor(random() * busStopNames.length)];
                } else if (type === 'subway') {
                    label = '🚇 ' + subwayNames[Math.floor(random() * subwayNames.length)];
                } else {
                    label = '☁️ 무등산 구름길';
                }
                
                platforms.push({ x: cx, y: y, w: w, h: 36, type: type, label: label });"""

new_gen = """                let stopName = activeRoute.stops[stopIdx % activeRoute.stops.length];
                stopIdx++;
                
                let type = stopName.endsWith('역') ? 'subway' : 'bus';
                let label = (type === 'subway' ? '🚇 ' : '🚌 ') + stopName;
                
                platforms.push({ x: cx, y: y, w: w, h: 36, type: type, label: label });"""

text = text.replace(old_gen, new_gen)

# Need to inject `let stopIdx = 0;` before the loop
text = text.replace("cx = 300;\n            while(cx < levelLength - 200) {", "cx = 300;\n            let stopIdx = 0;\n            while(cx < levelLength - 200) {")


with io.open('public/minigame.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("done")
