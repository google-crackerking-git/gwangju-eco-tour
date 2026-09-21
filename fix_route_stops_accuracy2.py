import io
import re

with io.open('public/minigame.html', 'r', encoding='utf-8') as f:
    text = f.read()

# I will use Regex to precisely replace the stops array for each route id
replacements = {
    'route_09': 'stops: ["첨단종점", "쌍암공원", "첨단사거리", "광주과학기술원", "양산동", "전남대", "금남로5가역", "금남로4가역", "문화전당역", "전남대병원", "남광주역", "학동·증심사입구역", "증심사입구", "증심사"]',
    'route_01': 'stops: ["상무역", "운천역", "시청", "광천터미널", "광주역", "대인시장", "조선대", "남광주역", "백운광장", "풍암지구", "풍암저수지", "월드컵경기장", "김대중컨벤션센터역"]',
    'route_151': 'stops: ["소태역", "학동·증심사입구역", "남광주역", "전남대병원", "문화전당역", "금남로4가역", "금남로5가역", "광주역", "전남대후문", "양산동", "일곡지구", "국립518민주묘지"]',
    'route_29': 'stops: ["도산동", "광주송정역", "송정공원역", "신가동", "신창지구", "광주비엔날레", "중외공원", "일곡지구"]',
    'route_12': 'stops: ["하남공단", "수완지구", "신가동", "광천터미널", "농성역", "돌고개역", "양동시장", "백운광장", "남광주역", "학동·증심사입구역", "증심사입구", "증심사"]',
    'route_35': 'stops: ["조선대", "학동·증심사입구역", "증심사입구", "증심사", "전통문화관", "의재미술관"]',
    'route_06': 'stops: ["첨단종점", "보훈병원", "비아농협", "광주과학기술원", "신창지구", "수완지구"]'
}

for route_id, new_stops in replacements.items():
    # regex to find: id: "route_id", num: "...", stops: [...], type: "..."
    # we replace stops: [...] with the new_stops
    pattern = re.compile(rf'id: "{route_id}", num: "[^"]+", stops: \[[^\]]*\]')
    
    def repl(m):
        full_match = m.group(0)
        # replace stops: [...] inside full_match
        new_match = re.sub(r'stops: \[[^\]]*\]', new_stops, full_match)
        return new_match

    text = pattern.sub(repl, text)

with io.open('public/minigame.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("done")
