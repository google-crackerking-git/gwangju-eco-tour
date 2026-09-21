
        // Web Audio API Retro Sound Effects
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        let audioCtx = null;
        let soundMuted = false;

        function playSound(type) {
            if (soundMuted) return;
            try {
                if (!audioCtx) audioCtx = new AudioCtx();
                if (audioCtx.state === 'suspended') audioCtx.resume();

                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);

                const now = audioCtx.currentTime;

                if (type === 'jump') {
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(150, now);
                    osc.frequency.exponentialRampToValueAtTime(480, now + 0.12);
                    gain.gain.setValueAtTime(0.1, now);
                    gain.gain.linearRampToValueAtTime(0, now + 0.12);
                    osc.start(now);
                    osc.stop(now + 0.12);
                } else if (type === 'collect') {
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(523.25, now);
                    osc.frequency.setValueAtTime(659.25, now + 0.08);
                    osc.frequency.setValueAtTime(783.99, now + 0.16);
                    osc.frequency.setValueAtTime(1046.50, now + 0.24);
                    gain.gain.setValueAtTime(0.18, now);
                    gain.gain.linearRampToValueAtTime(0, now + 0.35);
                    osc.start(now);
                    osc.stop(now + 0.35);
                } else if (type === 'clear') {
                    osc.type = 'triangle';
                    const freqs = [523.25, 659.25, 783.99, 987.77, 1046.50];
                    freqs.forEach((f, idx) => {
                        osc.frequency.setValueAtTime(f, now + idx * 0.1);
                    });
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.linearRampToValueAtTime(0, now + 0.65);
                    osc.start(now);
                    osc.stop(now + 0.65);
                }
            } catch (e) {}
        }

        const busRoutesData = [
            {
                id: "route_09", num: "🚌 첨단09", stops: ["첨단종점", "쌍암공원", "첨단사거리", "보훈병원", "비아농협", "수완지구", "광천터미널", "아시아문화전당", "조선대", "무등산국립공원"], type: "급행", typeBg: "bg-red-500", category: "CULTURE",
                theme: "문화예술 & 무등산", bgColor: "gradient-sky",
                touristSpots: [
                    { name: "국립아시아문화전당", x: 320, y: 280, desc: "아시아 최대 규모 복합 문화 예술 기관", distance: "300m" },
                    { name: "동명동 카페거리", x: 650, y: 210, desc: "트렌디한 감성의 핫플레이스 카페 골목", distance: "300m" },
                    { name: "광주 예술의거리", x: 980, y: 270, desc: "전통 문화 및 갤러리가 모인 문화거리", distance: "500m" },
                    { name: "조선대학교 장미원", x: 1350, y: 190, desc: "수만 송이 장미가 피는 산책로", distance: "300m" },
                    { name: "지산유원지 모노레일", x: 1720, y: 270, desc: "무등산 능선을 조망하는 감성 리프트", distance: "500m" },
                    { name: "무등산국립공원", x: 2050, y: 210, desc: "세계지질공원 입석대 & 서석대 절경", distance: "300m" }
                ]
            },
            {
                id: "route_01", num: "🚌 순환01", stops: ["상무시민공원", "시청", "운천저수지", "상무역", "김대중컨벤션센터역", "서구청", "풍암지구", "백운광장", "남광주역", "조선대", "광주역"], type: "순환", typeBg: "bg-blue-600", category: "NATURE",
                theme: "도심 속 자연 코스", bgColor: "gradient-nature",
                touristSpots: [
                    { name: "상무시민공원", x: 330, y: 270, desc: "도심 속 거대한 호수와 산책로", distance: "200m" },
                    { name: "5·18자유공원", x: 670, y: 200, desc: "민주화 운동의 역사적 상징", distance: "400m" },
                    { name: "김대중컨벤션센터", x: 1000, y: 260, desc: "국제 규모의 대형 전시관", distance: "100m" },
                    { name: "광주월드컵경기장", x: 1380, y: 200, desc: "2002년 4강 신화의 성지", distance: "300m" },
                    { name: "풍암호수공원", x: 1740, y: 270, desc: "수변 데크길이 아름다운 공원", distance: "200m" },
                    { name: "광주학생독립운동기념탑", x: 2060, y: 220, desc: "학생들의 항일 운동을 기리는 탑", distance: "300m" }
                ]
            },
            {
                id: "route_151", num: "🚌 지원151", stops: ["증심사입구", "학동·증심사입구역", "전남대병원", "문화전당역", "금남로4가역", "금남로5가역", "광주역", "전남대후문", "양산동", "국립518민주묘지"], type: "지선", typeBg: "bg-emerald-500", category: "HISTORY",
                theme: "민주·평화 유적 코스", bgColor: "gradient-green",
                touristSpots: [
                    { name: "5·18 민주광장", x: 310, y: 280, desc: "민주화 운동의 상징적인 중심 장소", distance: "300m" },
                    { name: "국립5·18민주묘지", x: 660, y: 210, desc: "5·18 영령을 기리는 민주 성지", distance: "500m" },
                    { name: "광주학생독립운동기념관", x: 990, y: 270, desc: "1929년 학생 항일 운동 기억 공간", distance: "300m" },
                    { name: "전남대학교 민주길", x: 1360, y: 190, desc: "자연 경관이 어우러진 둘레길", distance: "500m" },
                    { name: "5·18 민주화운동기록관", x: 1710, y: 260, desc: "유네스코 세계기록유산 보유 전시관", distance: "300m" },
                    { name: "민주종각 평화광장", x: 2040, y: 210, desc: "평화와 화합을 기원하는 종각", distance: "300m" }
                ]
            },
            {
                id: "route_29", num: "🚌 송정29", stops: ["도산동", "광주송정역", "송정공원역", "공항역", "호남대", "극락강역", "광천터미널", "서구청", "대인시장", "문화전당역"], type: "간선", typeBg: "bg-amber-500", category: "FOOD",
                theme: "교통 & 전통 시장", bgColor: "gradient-purple",
                touristSpots: [
                    { name: "광주송정역", x: 310, y: 280, desc: "호남선의 관문이자 KTX 거점역", distance: "100m" },
                    { name: "1913송정역시장", x: 660, y: 210, desc: "100년 전통 레트로 야시장 명소", distance: "200m" },
                    { name: "송정공원", x: 990, y: 270, desc: "벚꽃이 만개하는 도심 속 휴식처", distance: "400m" },
                    { name: "송정 떡갈비거리", x: 1360, y: 190, desc: "육즙 가득한 떡갈비 특화 거리", distance: "200m" },
                    { name: "영산강 자전거길", x: 1710, y: 260, desc: "시원한 강바람을 맞는 에코 코스", distance: "300m" },
                    { name: "극락강역", x: 2040, y: 210, desc: "가장 작은 꼬마역의 아날로그 감성", distance: "300m" }
                ]
            },
            {
                id: "route_12", num: "🚌 수완12", stops: ["수완지구", "하남공단", "신가동", "광천터미널", "챔피언스필드", "중외공원", "광주비엔날레", "전남대", "일곡지구"], type: "간선", typeBg: "bg-amber-500", category: "FOOD",
                theme: "중외공원 & 비엔날레", bgColor: "gradient-sky",
                touristSpots: [
                    { name: "광주비엔날레 전시관", x: 320, y: 270, desc: "세계적인 현대 미술 축제의 장", distance: "500m" },
                    { name: "중외공원 명품길", x: 650, y: 200, desc: "시립미술관과 박물관이 모인 공원", distance: "500m" },
                    { name: "국립광주박물관", x: 980, y: 260, desc: "남도 문화유산을 보존하는 박물관", distance: "300m" },
                    { name: "광주 시립미술관", x: 1350, y: 190, desc: "현대 미술품과 넓은 조각공원", distance: "300m" },
                    { name: "광주역사민속박물관", x: 1700, y: 270, desc: "전통 민속 농경 문화를 체험하는 곳", distance: "400m" },
                    { name: "어린이대공원", x: 2030, y: 220, desc: "가족 나들이하기 좋은 놀이공원", distance: "200m" }
                ]
            },
            {
                id: "route_35", num: "🚌 운림35", stops: ["증심사", "의재미술관", "전통문화관", "남광주역", "문화전당역", "대인시장", "광주역", "충장사", "충효동", "무등산생태탐방원"], type: "지선", typeBg: "bg-emerald-500", category: "NATURE",
                theme: "무등산 생태 & 한옥", bgColor: "gradient-nature",
                touristSpots: [
                    { name: "증심사 사찰", x: 330, y: 280, desc: "무등산 자락의 천년 고찰", distance: "300m" },
                    { name: "의재미술관", x: 660, y: 210, desc: "허백련 화백의 한국화 미술관", distance: "500m" },
                    { name: "광주 전통문화관", x: 990, y: 270, desc: "한옥 체험 및 전통 국악 공연 중심지", distance: "300m" },
                    { name: "포충사", x: 1370, y: 200, desc: "임진왜란 의병장을 모신 사당", distance: "500m" },
                    { name: "충장사", x: 1730, y: 280, desc: "김덕령 장군의 얼이 깃든 곳", distance: "300m" },
                    { name: "원효사 계곡", x: 2050, y: 210, desc: "무등산의 시원하고 맑은 자연 계곡", distance: "300m" }
                ]
            },
            {
                id: "route_06", num: "🚌 풍암06", type: "지선", typeBg: "bg-emerald-500", category: "NATURE",
                theme: "호수 & 향교 탐방", bgColor: "gradient-green",
                touristSpots: [
                    { name: "광주향교", x: 310, y: 280, desc: "조선시대 유학 교육의 산실", distance: "200m" },
                    { name: "사직공원", x: 660, y: 210, desc: "가을 단풍이 아름다운 시민의 숲", distance: "300m" },
                    { name: "광주공원 포장마차", x: 990, y: 270, desc: "야간 불빛 아래 열리는 낭만 포차거리", distance: "400m" },
                    { name: "남광주시장", x: 1360, y: 190, desc: "활기찬 수산물 및 먹거리 새벽시장", distance: "200m" },
                    { name: "풍암호수 장미원", x: 1710, y: 260, desc: "수만 송이 장미가 만개하는 테마파크", distance: "300m" },
                    { name: "월드컵경기장 마실길", x: 2040, y: 210, desc: "여유로운 저녁 산책을 위한 공원길", distance: "300m" }
                ]
            }
        ];

        
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
const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');

        const CANVAS_WIDTH = 920;
        const CANVAS_HEIGHT = 560;
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        let selectedRouteIdx = 0;
        let activeRoute = busRoutesData[0];
        let gameState = 'START';
        let score = 0;
        let collectedCount = 0;
        let collectedList = [];
        let isUserLoggedIn = false;
        let serverTotalScore = 0;
        let cameraX = 0;
        let toastTimeout = null;

        let particles = [];

        const player = {
            x: 80,
            y: 300,
            width: 58,
            height: 75,
            vx: 0,
            vy: 0,
            speed: 6.5,
            jumpStrength: -16.5,
            gravity: 0.8,
            grounded: false,
            facingLeft: false,
            squash: 1.0,
            doubleJumped: false
        };

        const keys = { left: false, right: false, jump: false };

        let platforms = [
            { x: 0, y: 470, w: 580, h: 90, type: 'ground' },
            { x: 650, y: 470, w: 680, h: 90, type: 'ground' },
            { x: 1380, y: 470, w: 920, h: 90, type: 'ground' },

            { x: 250, y: 360, w: 140, h: 22, type: 'bus', label: '🌱 친환경 정류장' },
            { x: 460, y: 270, w: 140, h: 22, type: 'subway', label: '♻️ 탄소 제로 코스' },
            
            { x: 770, y: 350, w: 130, h: 22, type: 'bus', label: '👟 도보 300m 투어' },
            { x: 970, y: 260, w: 150, h: 22, type: 'subway', label: '🚲 자전거 환승' },
            { x: 1180, y: 330, w: 130, h: 22, type: 'cloud', label: '🌳 무등산 둘레길' },

            { x: 1520, y: 350, w: 140, h: 22, type: 'bus', label: '🚌 에코 환승센터' },
            { x: 1720, y: 270, w: 140, h: 22, type: 'subway', label: '🏛️ 광주 공공데이터' },
            { x: 1920, y: 360, w: 130, h: 22, type: 'cloud', label: '🏁 에코투어 완주' }
        ];

        let activeItems = [];
        const goal = { x: 2200, y: 370, w: 70, h: 100 };

        function renderRouteCards(categoryFilter = 'ALL') {
            const grid = document.getElementById('route-selector-grid');
            grid.innerHTML = '';

            busRoutesData.forEach((route, idx) => {
                if (categoryFilter !== 'ALL' && route.category !== categoryFilter) return;

                const card = document.createElement('div');
                card.className = `glass-card p-3.5 rounded-2xl cursor-pointer relative ${idx === selectedRouteIdx ? 'selected' : ''}`;
                card.innerHTML = `
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2">
                            <span class="${route.typeBg} text-white text-[10px] font-black px-2 py-0.5 rounded-full">${route.type}</span>
                            <span class="font-extrabold text-sm text-sky-300">${route.num}</span>
                        </div>
                        <span class="text-[11px] font-semibold text-amber-300/90 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">${route.theme}</span>
                    </div>
                    <div class="text-xs text-slate-300 leading-snug line-clamp-2">
                        📍 ${route.touristSpots.map(s => s.name).slice(0, 3).join(', ')} 등 주요 명소
                    </div>
                `;

                card.onclick = () => {
                    document.querySelectorAll('.glass-card').forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                    selectedRouteIdx = idx;
                };

                grid.appendChild(card);
            });
        }

        document.querySelectorAll('.cat-tab').forEach(tab => {
            tab.onclick = () => {
                document.querySelectorAll('.cat-tab').forEach(t => {
                    t.classList.remove('bg-blue-600', 'text-white', 'shadow-md');
                    t.classList.add('bg-slate-800', 'text-slate-300');
                });
                tab.classList.remove('bg-slate-800', 'text-slate-300');
                tab.classList.add('bg-blue-600', 'text-white', 'shadow-md');

                renderRouteCards(tab.getAttribute('data-cat'));
            };
        });

        function showSpotToast(spot) {
            const toast = document.getElementById('spot-toast');
            document.getElementById('toast-title').innerText = spot.name;
            document.getElementById('toast-desc').innerText = spot.desc;
            document.getElementById('toast-badge').innerText = `반경 ${spot.distance}`;

            toast.classList.remove('hidden');

            if (toastTimeout) clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => {
                toast.classList.add('hidden');
            }, 2800);
        }

        document.getElementById('sound-toggle-btn').onclick = () => {
            soundMuted = !soundMuted;
            document.getElementById('sound-toggle-btn').innerText = soundMuted ? '🔇' : '🔊';
        };

        function handleJump() {
            if (gameState !== 'PLAYING') return;
            if (player.grounded) {
                player.vy = player.jumpStrength;
                player.grounded = false;
                player.doubleJumped = false;
                player.squash = 1.3;
                createDustParticles(player.x + player.width / 2, player.y + player.height);
                playSound('jump');
            } else if (!player.doubleJumped) {
                player.vy = player.jumpStrength * 0.85;
                player.doubleJumped = true;
                player.squash = 1.3;
                createBurstParticles(player.x + 18, player.y + 40, '#ffffff');
                playSound('jump');
            }
        }

        function initControls() {
            renderRouteCards('ALL');

            window.addEventListener('keydown', (e) => {
                if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = true;
                if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = true;
                if ((e.code === 'ArrowUp' || e.code === 'Space' || e.code === 'KeyW')) {
                    handleJump();
                }
            });

            window.addEventListener('keyup', (e) => {
                if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
                if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
            });

            const bindTouch = (id, keyName) => {
                const el = document.getElementById(id);
                el.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    if (keyName === 'jump') {
                        handleJump();
                    } else {
                        keys[keyName] = true;
                    }
                });
                el.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    if (keyName !== 'jump') keys[keyName] = false;
                });
            };

            bindTouch('btn-left', 'left');
            bindTouch('btn-right', 'right');
            bindTouch('btn-jump', 'jump');

            document.getElementById('start-btn').onclick = () => {
                activeRoute = busRoutesData[selectedRouteIdx];
                document.getElementById('hud-bus-type').innerText = activeRoute.type;
                document.getElementById('hud-bus-type').className = `${activeRoute.typeBg} px-2.5 py-1 rounded-full text-xs font-black text-white shadow-md`;
                document.getElementById('hud-route-name').innerText = activeRoute.num;
                document.getElementById('start-screen').classList.add('hidden');
                resetGame();
                gameState = 'PLAYING';
                playSound('collect');
            };

            document.getElementById('restart-btn').onclick = () => {
                document.getElementById('end-screen').classList.add('hidden');
                document.getElementById('start-screen').classList.remove('hidden');
                gameState = 'START';
            };
        }

        function resetGame() {
            player.x = 80;
            player.y = 300;
            player.vx = 0;
            player.vy = 0;
            score = 0;
            collectedCount = 0;
            collectedList = [];
            cameraX = 0;
            particles = [];

            // Procedural Level Generation per Route
            platforms = [];
            activeItems = [];
            
            let seed = 0;
            for (let i = 0; i < activeRoute.id.length; i++) seed += activeRoute.id.charCodeAt(i);
            const random = () => {
                let x = Math.sin(seed++) * 10000;
                return x - Math.floor(x);
            };

            const levelLength = 3500 + random() * 1500;
            
            // Ground
            let cx = 0;
            while(cx < levelLength + 500) {
                let w = 400 + random() * 600;
                let gap = 150 + random() * 150;
                platforms.push({ x: cx, y: 470, w: w, h: 90, type: 'ground' });
                cx += w + gap;
            }

            // Floating
            cx = 300;
            let stopIdx = 0;
            while(cx < levelLength - 200) {
                let y = 250 + random() * 130;
                let w = 180 + random() * 120;
                let stopName = activeRoute.stops[stopIdx % activeRoute.stops.length];
                stopIdx++;
                
                let type = stopName.endsWith('역') ? 'subway' : 'bus';
                let label = (type === 'subway' ? '🚇 ' : '🚌 ') + stopName;
                
                platforms.push({ x: cx, y: y, w: w, h: 36, type: type, label: label, stopName: stopName });
                cx += 250 + random() * 250;
            }

            goal.x = levelLength;

            // Items
            let floatPlats = platforms.filter(p => p.type !== 'ground');
            
            floatPlats.forEach(plat => {
                if (plat.stopName && ktoSpotMap[plat.stopName]) {
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
                            collected: false
                        });
                    }
                }
            });
            
            if (activeItems.length === 0 && floatPlats.length > 0) {
                let plat = floatPlats[0];
                let spotData = ktoSpotMap[plat.stopName] || { name: "광주의 숨은 명소", desc: "아름다운 힐링 공간", distance: "100m" };
                activeItems.push({
                    name: spotData.name, desc: spotData.desc, distance: spotData.distance,
                    x: plat.x + plat.w/2 - 20, y: plat.y - 80, w: 48, h: 48, collected: false
                });
            }
            });

            updateHUD();
        }

        function updateHUD() {
            document.getElementById('score-val').innerText = score;
            document.getElementById('spot-count-val').innerText = `${collectedCount} / ${activeItems.length}`;

            const progress = Math.min(100, Math.max(0, Math.floor((player.x / goal.x) * 100)));
            document.getElementById('progress-percent-text').innerText = `${progress}%`;
            document.getElementById('progress-bar').style.width = `${progress}%`;
        }

        function createBurstParticles(x, y, color) {
            for (let i = 0; i < 18; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 5 + 2;
                particles.push({
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: Math.random() * 5 + 3,
                    color: color,
                    alpha: 1.0,
                    life: 0.03 + Math.random() * 0.02
                });
            }
        }

        function createDustParticles(x, y) {
            for (let i = 0; i < 6; i++) {
                particles.push({
                    x: x + (Math.random() - 0.5) * 16,
                    y: y,
                    vx: (Math.random() - 0.5) * 2,
                    vy: -Math.random() * 1.5,
                    size: Math.random() * 4 + 2,
                    color: '#e2e8f0',
                    alpha: 0.6,
                    life: 0.05
                });
            }
        }

        function updateParticles() {
            particles.forEach((p, idx) => {
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= p.life;
                if (p.alpha <= 0) particles.splice(idx, 1);
            });
        }

        function drawParticles() {
            particles.forEach(p => {
                ctx.save();
                ctx.globalAlpha = Math.max(0, p.alpha);
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });
        }

        // Preload Omena Images
        const imgOmenaRun = new Image(); imgOmenaRun.src = '/characters/5. 응용형(자전거).png';
        const imgOmenaJump = new Image(); imgOmenaJump.src = '/characters/15. 응용형(최고).png';
        const imgOmenaIdle = new Image(); imgOmenaIdle.src = '/characters/31. 응용형(길찾기).png';

        function drawOmena(x, y, facingLeft, squash) {
            ctx.save();
            ctx.translate(x + player.width / 2, y + player.height / 2);
            if (facingLeft) ctx.scale(-1, 1);
            ctx.scale(1 / squash, squash);

            let currentImg = imgOmenaIdle;
            if (!player.grounded) {
                currentImg = imgOmenaJump;
            } else if (Math.abs(player.vx) > 0.5) {
                currentImg = imgOmenaRun;
            }

            if (currentImg.complete) {
                // Adjust drawing offset and size (player rect is 38x48)
                ctx.drawImage(currentImg, -28, -32, 56, 56);
            }
            ctx.restore();
        }

        function update() {
            if (gameState !== 'PLAYING') return;

            if (keys.left) {
                player.vx = -player.speed;
                player.facingLeft = true;
            } else if (keys.right) {
                player.vx = player.speed;
                player.facingLeft = false;
            } else {
                player.vx *= 0.8;
            }

            player.vy += player.gravity;

            player.x += player.vx;
            player.y += player.vy;

            player.squash += (1.0 - player.squash) * 0.12;

            player.grounded = false;
            platforms.forEach(plat => {
                if (
                    player.x < plat.x + plat.w &&
                    player.x + player.width > plat.x &&
                    player.y + player.height >= plat.y &&
                    player.y + player.height <= plat.y + plat.h + player.vy
                ) {
                    if (player.vy > 0) {
                        player.y = plat.y - player.height;
                        player.vy = 0;
                        if (!player.grounded) {
                            player.squash = 0.82; 
                        }
                        player.grounded = true;
                    }
                }
            });

            activeItems.forEach(item => {
                if (!item.collected &&
                    player.x < item.x + item.w &&
                    player.x + player.width > item.x &&
                    player.y < item.y + item.h &&
                    player.y + player.height > item.y
                ) {
                    item.collected = true;
                    playSound('collect');
                    score += 100;
                    collectedCount++;
                    collectedList.push(item);

                    createBurstParticles(item.x + 18, item.y + 18, '#facc15');
                    showSpotToast(item);

                    updateHUD();
                }
            });

            if (player.y > CANVAS_HEIGHT + 80) {
                player.x = Math.max(80, player.x - 240);
                player.y = 200;
                player.vy = 0;
            }

            const targetCamX = player.x - CANVAS_WIDTH / 3;
            cameraX += (targetCamX - cameraX) * 0.1;
            if (cameraX < 0) cameraX = 0;

            updateParticles();

            if (player.x >= goal.x) {
                gameState = 'CLEAR';
                playSound('clear');
                createBurstParticles(goal.x + 35, goal.y + 30, '#38bdf8');

                document.getElementById('end-title').innerText = `🚍 ${activeRoute.num} 완주 성공!`;
                
                if (!isUserLoggedIn) {
                    document.getElementById('end-desc').innerHTML = `
                        오매나와 함께 <b>[${activeRoute.num} - ${activeRoute.theme}]</b> 노선의<br>
                        관광지를 성공적으로 수집했습니다!<br><br>
                        🎉 <b>획득 점수:</b> <span class="text-amber-300 font-extrabold text-lg">+${score} PT</span><br>
                        <span class="text-red-400 text-xs mt-1 block font-bold">⚠️ 카카오 로그인을 하셔야 점수가 누적됩니다!</span>
                    `;
                    showEndScreen();
                } else {
                    document.getElementById('end-desc').innerHTML = `<span class="text-slate-300 text-sm">점수 저장 중...</span>`;
                    showEndScreen();
                    
                    fetch('/api/game/score', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            routeId: activeRoute.id,
                            spots: collectedList.map(s => s.name)
                        })
                    }).then(r => r.json()).then(data => {
                        if (data.success) {
                            serverTotalScore = data.totalScore;
                            let msg = `
                                오매나와 함께 <b>[${activeRoute.num} - ${activeRoute.theme}]</b> 노선의<br>
                                관광지를 성공적으로 수집했습니다!<br><br>
                                🎉 <b>신규 획득 점수:</b> <span class="text-amber-300 font-extrabold text-lg">+${data.addedScore} PT</span><br>
                            `;
                            if (data.addedScore < score) {
                                msg += `<span class="text-slate-400 text-xs block mt-1">(이미 방문하여 획득한 관광지 점수는 제외됨)</span>`;
                            }
                            msg += `<span class="text-emerald-300 text-xs mt-1 block">(총 누적: ${serverTotalScore} PT)</span>`;
                            document.getElementById('end-desc').innerHTML = msg;
                        } else {
                            document.getElementById('end-desc').innerHTML = `<span class="text-red-400">점수 저장 실패 (로그인 만료)</span>`;
                        }
                    }).catch(e => {
                        document.getElementById('end-desc').innerHTML = `<span class="text-red-400">점수 저장 중 오류 발생</span>`;
                    });
                }
                
                function showEndScreen() {
                    const spotContainer = document.getElementById('collected-spots-list');
                    document.getElementById('end-collection-count').innerText = `${collectedList.length} / ${activeItems.length} 수집 완료`;
                    spotContainer.innerHTML = '';
                    if (collectedList.length === 0) {
                        spotContainer.innerHTML = '<span class="text-slate-500 text-xs col-span-3">수집한 관광지가 없습니다.</span>';
                    } else {
                        collectedList.forEach(spot => {
                            const tag = document.createElement('div');
                            tag.className = 'bg-slate-800/90 border border-slate-700/80 rounded-xl p-2 flex flex-col justify-center text-left';
                            tag.innerHTML = `
                                <span class="text-[11px] font-bold text-amber-300 line-clamp-1">📍 ${spot.name}</span>
                                <span class="text-[9px] text-slate-400 mt-0.5">반경 ${spot.distance}</span>
                            `;
                            spotContainer.appendChild(tag);
                        });
                    }
                    document.getElementById('end-screen').classList.remove('hidden');
                }
            }
        }

        function render() {
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            const bgGradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
            if (activeRoute.category === 'CULTURE') {
                bgGradient.addColorStop(0, '#0f172a');
                bgGradient.addColorStop(1, '#1e3a8a');
            } else if (activeRoute.category === 'NATURE') {
                bgGradient.addColorStop(0, '#064e3b');
                bgGradient.addColorStop(1, '#022c22');
            } else if (activeRoute.category === 'HISTORY') {
                bgGradient.addColorStop(0, '#312e81');
                bgGradient.addColorStop(1, '#1e1b4b');
            } else {
                bgGradient.addColorStop(0, '#111827');
                bgGradient.addColorStop(1, '#1f2937');
            }
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            ctx.save();
            ctx.translate(-cameraX, 0);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
            ctx.beginPath();
            ctx.moveTo(100, 470);
            ctx.lineTo(450, 180);
            ctx.lineTo(800, 470);
            ctx.fill();

            ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
            ctx.beginPath();
            ctx.moveTo(1000, 470);
            ctx.lineTo(1380, 150);
            ctx.lineTo(1750, 470);
            ctx.fill();

            platforms.forEach(plat => {
                if (plat.type === 'ground') {
                    ctx.fillStyle = '#10b981';
                    ctx.fillRect(plat.x, plat.y, plat.w, 20);
                    ctx.fillStyle = '#1e293b';
                    ctx.fillRect(plat.x, plat.y + 20, plat.w, plat.h - 20);
                } else if (plat.type === 'bus') {
                    ctx.fillStyle = '#2563eb';
                    ctx.beginPath();
                    ctx.roundRect(plat.x, plat.y, plat.w, plat.h, 12);
                    ctx.fill();
                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 16px sans-serif';
                    ctx.fillText(plat.label, plat.x + 15, plat.y + 24);
                } else if (plat.type === 'subway') {
                    ctx.fillStyle = '#6366f1';
                    ctx.beginPath();
                    ctx.roundRect(plat.x, plat.y, plat.w, plat.h, 12);
                    ctx.fill();
                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 16px sans-serif';
                    ctx.fillText(plat.label, plat.x + 15, plat.y + 24);
                } else {
                    ctx.fillStyle = '#e2e8f0';
                    ctx.beginPath();
                    ctx.roundRect(plat.x, plat.y, plat.w, plat.h, 12);
                    ctx.fill();
                    ctx.fillStyle = '#0f172a';
                    ctx.font = 'bold 16px sans-serif';
                    ctx.fillText(plat.label, plat.x + 15, plat.y + 24);
                }
            });

            activeItems.forEach(item => {
                if (!item.collected) {
                    const bobbingY = item.y + Math.sin(Date.now() * 0.006 + item.x) * 5;

                    ctx.fillStyle = 'rgba(0,0,0,0.3)';
                    ctx.beginPath();
                    ctx.ellipse(item.x + 24, item.y + 48, 20, 6, 0, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.fillStyle = '#f59e0b';
                    ctx.beginPath();
                    ctx.arc(item.x + 24, bobbingY + 20, 24, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 2.5;
                    ctx.stroke();

                    ctx.fillStyle = '#ffffff';
                    ctx.font = '22px sans-serif';
                    ctx.fillText('🏛️', item.x + 10, bobbingY + 17);

                    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
                    ctx.beginPath();
                    ctx.roundRect(item.x - 60, bobbingY - 40, 168, 36, 12);
                    ctx.fill();
                    ctx.strokeStyle = '#facc15';
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    ctx.fillStyle = '#f8fafc';
                    ctx.font = 'bold 16px sans-serif';
                    ctx.fillText(item.name, item.x - 50, bobbingY - 16);
                }
            });

            drawParticles();

            ctx.fillStyle = '#3b82f6';
            ctx.roundRect(goal.x, goal.y, goal.w, goal.h, 12);
            ctx.fill();
            ctx.strokeStyle = '#60a5fa';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 14px sans-serif';
            ctx.fillText('ARRIVE', goal.x + 9, goal.y + 32);
            ctx.font = 'bold 16px sans-serif';
            ctx.fillText('종점 승강장', goal.x + 6, goal.y + 58);

            drawOmena(player.x, player.y, player.facingLeft, player.squash);

            ctx.restore();
        }

        function gameLoop() {
            update();
            render();
            requestAnimationFrame(gameLoop);
        }

        // Initialize session score
        fetch('/api/game/score')
            .then(res => res.json())
            .then(data => {
                if(data.success) {
                    isUserLoggedIn = true;
                    serverTotalScore = data.totalScore;
                }
            }).catch(e => console.log('Not logged in'));

        initControls();
        requestAnimationFrame(gameLoop);
    