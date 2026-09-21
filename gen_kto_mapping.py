import io
import re

with io.open('public/minigame.html', 'r', encoding='utf-8') as f:
    text = f.read()

mapping_dict = """
const ktoSpotMap = {
    "광천터미널": { name: "유스퀘어 문화관", desc: "광주 최고 규모의 복합 문화 예술 공간", distance: "50m" },
    "전남대후문": { name: "전남대학교 용지", desc: "대학 캠퍼스 내의 아름다운 호수 산책로", distance: "300m" },
    "조선대": { name: "조선대학교 장미원", desc: "수만 송이 장미가 피어나는 로맨틱 명소", distance: "200m" },
    "광주시청": { name: "시청 앞 평화공원", desc: "도심 속에서 즐기는 잔디밭 피크닉", distance: "150m" },
    "광주역": { name: "광주역사 갤러리", desc: "기차역에서 만나는 작은 지역 미술 전시", distance: "50m" },
    "수완지구": { name: "수완 호수공원", desc: "수완지구 중심에 위치한 탁 트인 수변공원", distance: "400m" },
    "상무지구": { name: "상무시민공원", desc: "도심 한가운데 위치한 여유로운 조각공원", distance: "300m" },
    "첨단지구": { name: "쌍암공원", desc: "첨단지구 주민들의 쉼터이자 아름다운 호수", distance: "200m" },
    "풍암지구": { name: "풍암저수지 장미원", desc: "호수 둘레길과 화려한 장미가 어우러진 곳", distance: "350m" },
    "충장로": { name: "광주 학생독립운동기념탑", desc: "광주 학생들의 독립 정신을 기리는 상징탑", distance: "250m" },
    "대인시장": { name: "대인 예술야시장", desc: "예술가와 상인들이 함께 만드는 낭만 야시장", distance: "100m" },
    "백운광장": { name: "푸른길공원", desc: "옛 철길을 따라 조성된 도심 속 산책로", distance: "150m" },
    "일곡지구": { name: "일곡 제1근린공원", desc: "자연과 함께 숨 쉬는 동네 숲속 산책로", distance: "200m" },
    "양동시장": { name: "양동시장 복개상가", desc: "광주 최대 규모를 자랑하는 역사 깊은 전통시장", distance: "50m" },
    "평동역": { name: "평동 애호박국밥 거리", desc: "현지인들이 극찬하는 평동역 명물 음식 거리", distance: "300m" },
    "광주송정역": { name: "1913송정역시장", desc: "100년 역사가 레트로 감성으로 다시 태어난 곳", distance: "150m" },
    "송정공원역": { name: "송정공원", desc: "벚꽃이 만개하는 광주송정 인근의 힐링 공원", distance: "200m" },
    "공항역": { name: "극락강변 자전거길", desc: "영산강을 따라 시원하게 달리는 자전거 코스", distance: "400m" },
    "김대중컨벤션센터역": { name: "김대중컨벤션센터", desc: "다양한 국제 전시와 행사가 열리는 복합 센터", distance: "100m" },
    "상무역": { name: "5.18 자유공원", desc: "광주 민주화 운동의 뼈아픈 역사를 보존한 공간", distance: "500m" },
    "운천역": { name: "운천저수지", desc: "봄날 벚꽃과 음악분수가 환상적인 도심 명소", distance: "300m" },
    "쌍촌역": { name: "5.18 기념공원", desc: "민주화의 얼을 기리며 넓은 잔디밭이 펼쳐진 공원", distance: "450m" },
    "화정역": { name: "광주 유니버시아드 체육관", desc: "다양한 스포츠 경기가 열리는 웅장한 체육관", distance: "400m" },
    "농성역": { name: "농성광장", desc: "시원한 분수와 함께 도심 속 휴식을 제공하는 광장", distance: "100m" },
    "돌고개역": { name: "월산동 달뫼마을", desc: "오래된 골목마다 벽화가 예쁜 달동네 예술마을", distance: "500m" },
    "금남로4가역": { name: "5.18 민주화운동기록관", desc: "유네스코 세계기록유산을 소장한 역사적 보존소", distance: "150m" },
    "문화전당역": { name: "국립아시아문화전당", desc: "아시아 문화를 한자리에서 만나는 거대한 예술 플랫폼", distance: "100m" },
    "남광주역": { name: "남광주 밤기차 야시장", desc: "추억의 밤기차 감성을 느낄 수 있는 먹거리 야시장", distance: "50m" },
    "학동·증심사입구역": { name: "증심사 계곡길", desc: "무등산으로 향하는 길목의 맑고 시원한 계곡", distance: "400m" },
    "소태역": { name: "광주천 생태탐방로", desc: "수달이 서식하는 광주천을 따라 걷는 힐링 산책길", distance: "300m" },
    "첨단종점": { name: "광주시민의 숲", desc: "피크닉과 캠핑을 즐길 수 있는 광활한 도심 숲", distance: "400m" },
    "쌍암공원": { name: "쌍암호수 둘레길", desc: "밤낮으로 산책하기 좋은 잔잔하고 넓은 호수", distance: "100m" },
    "첨단사거리": { name: "첨단 과학로", desc: "미래를 여는 광주 과학기술의 중심 거리", distance: "200m" },
    "보훈병원": { name: "광주보훈병원 힐링정원", desc: "환자와 시민들이 함께 쉬어가는 평화로운 정원", distance: "150m" },
    "비아농협": { name: "비아5일장", desc: "정겨운 시골 인심을 느낄 수 있는 전통 오일장", distance: "200m" },
    "아시아문화전당": { name: "하늘마당", desc: "아시아문화전당 위, 돗자리 깔고 즐기는 피크닉 명소", distance: "50m" },
    "무등산국립공원": { name: "무등산 서석대", desc: "세계가 인정한 주상절리대의 장엄한 비경", distance: "800m" },
    "시청": { name: "광주광역시청 야외음악당", desc: "여름밤 감성적인 버스킹과 공연이 펼쳐지는 곳", distance: "200m" },
    "서구청": { name: "서구청사 갤러리", desc: "구청 내에서 만나는 소소하고 따뜻한 예술 작품들", distance: "100m" },
    "증심사입구": { name: "무등산 국립공원 입구", desc: "광주의 어머니 산, 무등산 등반의 활기찬 시작점", distance: "300m" },
    "전남대병원": { name: "광주 구 읍성터", desc: "과거 광주읍성의 흔적을 엿볼 수 있는 역사 유적지", distance: "250m" },
    "금남로5가역": { name: "금남로 지하상가", desc: "광주 패션과 트렌드의 중심인 활기찬 지하 쇼핑몰", distance: "100m" },
    "양산동": { name: "양산 호수공원", desc: "북구 주민들의 사랑을 받는 아늑한 산책 명소", distance: "300m" },
    "국립518민주묘지": { name: "국립 5.18 민주묘지", desc: "5.18 민주화운동의 숭고한 희생을 기리는 성지", distance: "100m" },
    "도산동": { name: "도산역 먹자골목", desc: "소박하고 정감 넘치는 맛집들이 모여있는 동네", distance: "250m" },
    "호남대": { name: "어등산 둘레길", desc: "대학 캠퍼스 뒤로 이어지는 완만한 트레킹 코스", distance: "500m" },
    "극락강역": { name: "꼬마역 극락강", desc: "시간이 멈춘 듯한 옛 간이역의 레트로 감성", distance: "50m" },
    "하남공단": { name: "광주 하남공단 노동자쉼터", desc: "광주 산업을 이끄는 노동자들을 위한 아늑한 쉼터", distance: "300m" },
    "신가동": { name: "풍영정천 자전거길", desc: "물결을 따라 안전하게 자전거를 즐기는 하천길", distance: "200m" },
    "챔피언스필드": { name: "광주 기아 챔피언스 필드", desc: "뜨거운 야구 열기가 가득한 광주 스포츠의 심장", distance: "100m" },
    "중외공원": { name: "중외공원 시립미술관", desc: "아름다운 자연 속에서 현대 미술을 감상하는 곳", distance: "300m" },
    "광주비엔날레": { name: "비엔날레 전시관", desc: "세계적인 현대미술 축제가 열리는 광주 예술의 메카", distance: "150m" },
    "전남대": { name: "전남대학교 대강당", desc: "활기찬 대학로 문화와 청춘들의 에너지가 넘치는 곳", distance: "200m" },
    "증심사": { name: "증심사", desc: "천 년의 고즈넉함을 품은 무등산 기슭의 전통 사찰", distance: "500m" },
    "의재미술관": { name: "의재미술관", desc: "남종화의 대가 의재 허백련의 예술혼이 깃든 미술관", distance: "400m" },
    "전통문화관": { name: "광주 전통문화관", desc: "멋들러진 한옥에서 즐기는 전통 차와 국악 공연", distance: "200m" },
    "충장사": { name: "충장사", desc: "의병장 김덕령 장군의 충절을 기리는 성스러운 사당", distance: "600m" },
    "충효동": { name: "환벽당과 취가정", desc: "시가문학의 향기가 흐르는 무등산자락의 옛 정자들", distance: "400m" },
    "무등산생태탐방원": { name: "무등산 생태탐방원", desc: "자연을 배우고 체험하며 자연과 하나 되는 공간", distance: "200m" },
    "광주과학기술원": { name: "GIST 오룡제", desc: "최첨단 연구 단지 속에서 반짝이는 고요한 인공 호수", distance: "350m" },
    "신창지구": { name: "신창동 유적지", desc: "고대 농경 문화의 귀중한 발자취를 보여주는 사적지", distance: "300m" },
    "월드컵경기장": { name: "월드컵경기장 마실길", desc: "2002년의 감동이 살아있는 쾌적한 나들이 산책로", distance: "200m" },
    "광주향교": { name: "광주향교", desc: "조선시대 광주의 교육을 책임지던 전통 학문의 요람", distance: "300m" },
    "사직공원": { name: "사직공원 통기타거리", desc: "낭만적인 7080 라이브 음악이 흐르는 감성 거리", distance: "250m" },
    "풍암저수지": { name: "풍암저수지 생태공원", desc: "사계절 내내 아름다운 풍광을 자랑하는 도심 속 오아시스", distance: "150m" }
};
"""

# Inject ktoSpotMap near the top of the script
script_start = text.find("const canvas = document.getElementById('gameCanvas');")
text = text[:script_start] + mapping_dict + text[script_start:]


# Fix activeItems placement to use ktoSpotMap instead of activeRoute.touristSpots
old_bean_logic = """              // Items
              let floatPlats = platforms.filter(p => p.type !== 'ground');
              activeRoute.touristSpots.forEach(spot => {
                  let plat = floatPlats[Math.floor(random() * floatPlats.length)];
                  if(!plat) plat = platforms[0];
                  activeItems.push({
                      name: spot.name,
                      desc: spot.desc,
                      distance: spot.distance,
                      x: plat.x + plat.w/2 - 20,
                      y: plat.y - 80,
                      w: 48,
                      h: 48,
                      collected: false,
                      animOffset: random() * Math.PI * 2
                  });
              });"""

new_bean_logic = """              // Items
              let floatPlats = platforms.filter(p => p.type !== 'ground');
              
              // Place item exactly on the generated platform using its stopName
              floatPlats.forEach(plat => {
                  if (plat.stopName && ktoSpotMap[plat.stopName]) {
                      // 70% chance to have an item on this platform
                      if (random() < 0.70) {
                          let spotData = ktoSpotMap[plat.stopName];
                          activeItems.push({
                              name: spotData.name,
                              desc: spotData.desc,
                              distance: spotData.distance,
                              x: plat.x + plat.w/2 - 20,
                              y: plat.y - 80,
                              w: 48,
                              h: 48,
                              collected: false,
                              animOffset: random() * Math.PI * 2
                          });
                      }
                  }
              });
              
              // If somehow no items spawned, force spawn one on the first platform
              if (activeItems.length === 0 && floatPlats.length > 0) {
                  let plat = floatPlats[0];
                  let spotData = ktoSpotMap[plat.stopName] || { name: "광주의 숨은 명소", desc: "아름다운 힐링 공간", distance: "100m" };
                  activeItems.push({
                      name: spotData.name, desc: spotData.desc, distance: spotData.distance,
                      x: plat.x + plat.w/2 - 20, y: plat.y - 80, w: 48, h: 48, collected: false, animOffset: 0
                  });
              }
"""

text = text.replace(old_bean_logic, new_bean_logic)

# In resetGame's generation, we need to save `stopName` onto the platform
old_gen = """                platforms.push({ x: cx, y: y, w: w, h: 36, type: type, label: label });"""
new_gen = """                platforms.push({ x: cx, y: y, w: w, h: 36, type: type, label: label, stopName: stopName });"""

text = text.replace(old_gen, new_gen)

with io.open('public/minigame.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("done")
