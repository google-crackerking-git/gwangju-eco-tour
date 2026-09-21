import io
import re

with io.open('public/minigame.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Update resetGame() generator
old_gen = """                let types = ['bus', 'subway', 'cloud'];
                let type = types[Math.floor(random() * types.length)];
                let labels = { 'bus': '🚌 정류장', 'subway': '🚇 환승역', 'cloud': '☁️ 하늘길' };
                platforms.push({ x: cx, y: y, w: w, h: 36, type: type, label: labels[type] });"""

new_gen = """                let types = ['bus', 'subway', 'cloud'];
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

text = text.replace(old_gen, new_gen)

# Update the static start screen array
old_static = """            { x: 250, y: 360, w: 140, h: 22, type: 'bus', label: '🚌 친환경 정류장' },
            { x: 460, y: 270, w: 140, h: 22, type: 'subway', label: '🚇 탄소 제로 코스' },
            
            { x: 770, y: 350, w: 130, h: 22, type: 'bus', label: '🚌 도보 300m 투어' },
            { x: 970, y: 260, w: 150, h: 22, type: 'subway', label: '🚇 자전거 환승' },
            { x: 1180, y: 330, w: 130, h: 22, type: 'cloud', label: '☁️ 무등산 둘레길' },

            { x: 1520, y: 350, w: 140, h: 22, type: 'bus', label: '🚌 에코 환승센터' },"""

new_static = """            { x: 250, y: 360, w: 140, h: 22, type: 'bus', label: '🚌 광천터미널' },
            { x: 460, y: 270, w: 140, h: 22, type: 'subway', label: '🚇 문화전당역' },
            
            { x: 770, y: 350, w: 130, h: 22, type: 'bus', label: '🚌 전남대후문' },
            { x: 970, y: 260, w: 150, h: 22, type: 'subway', label: '🚇 광주송정역' },
            { x: 1180, y: 330, w: 130, h: 22, type: 'cloud', label: '☁️ 무등산 구름길' },

            { x: 1520, y: 350, w: 140, h: 22, type: 'bus', label: '🚌 수완지구' },"""

text = text.replace(old_static, new_static)

with io.open('public/minigame.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("done")
