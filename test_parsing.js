
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
                id: "route_09", num: "🚌 첨단09", type: "급행", typeBg: "bg-red-500", category: "CULTURE",
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
                id: "route_01", num: "🚌 순환01", type: "순환", typeBg: "bg-blue-600", category: "NATURE",
                theme: "도심 속 자연 코스", bgColor: "gradient-nature",
                touristSpots: [
                    { name: "상무시민공원", x: 330, y: 270, desc: "도심 속 거대한 호수와 산책로", distance: "200m" },
                    { name: "5·18자유공원", x: 670, y: 200, desc: "민주화 운동의 역사적 상징", distance: "400m" },
                    { name: "김대중컨벤션센터", x: 1000, y: 260, desc: "국제 규모의 대형 전시관", distance: "100m" },
                    { name: "광주월드컵경기장", x: 1380, y: 200, desc: "2002년 4강 신화의 성지", distance: "300m" },
                    { name: "풍암호수공원", x: 1740, y: 270, desc: "수변 데크길이 아름다운 공원", distance: "200m" },
                    { name: "광주학생독립운동기념탑", x: 2060, y: 220, desc: "학생들의 항일 운동을 기리는 탑", distance: "300m" }
                ]
            },                    { name: "우일선 선교사 사택", x: 670, y: 200, desc: "가장 오래된 서양식 근대건축물", distance: "500m" },
                    { name: "사직공원 전망타워", x: 1000, y: 260, desc: "무등산과 도심 파노라마 조망", distance: "300m" },
                    { name: "이이남 스튜디오", x: 1380, y: 200, desc: "세계적 미디어아트 작품이 있는 카페", distance: "300m" },
                    { name: "양림 미술관", x: 1740, y: 270, desc: "지역 예술가들의 다양한 기획 전시", distance: "500m" },
                    { name: "최승효 가옥", x: 2060, y: 220, desc: "도심 속 고즈넉한 힐링 한옥", distance: "300m" }
                ]
            },
            {
                id: "route_151", num: "🚌 지원151", type: "지선", typeBg: "bg-emerald-500", category: "HISTORY",
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
                id: "route_29", num: "🚌 송정29", type: "간선", typeBg: "bg-amber-500", category: "FOOD",
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
                id: "route_12", num: "🚌 수완12", type: "간선", typeBg: "bg-amber-500", category: "FOOD",
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
                id: "route_35", num: "🚌 운림35", type: "지선", typeBg: "bg-emerald-500", category: "NATURE",
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

        const canvas = 
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
            const grid = 
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
            const toast = 
            
            
            

            toast.classList.remove('hidden');

            if (toastTimeout) clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => {
                toast.classList.add('hidden');
            }, 2800);
        }

        document.getElementById('sound-toggle-btn').onclick = () => {
            soundMuted = !soundMuted;
            
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
                const el = 
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
                
                
                
                
                resetGame();
                gameState = 'PLAYING';
                playSound('collect');
            };

            document.getElementById('restart-btn').onclick = () => {
                
                
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
            while(cx < levelLength - 200) {
                let y = 250 + random() * 130;
                let w = 180 + random() * 120;
                let types = ['bus', 'subway', 'cloud'];
                let type = types[Math.floor(random() * types.length)];
                let labels = { 'bus': '🚌 정류장', 'subway': '🚇 환승역', 'cloud': '☁️ 하늘길' };
                platforms.push({ x: cx, y: y, w: w, h: 36, type: type, label: labels[type] });
                cx += 250 + random() * 250;
            }

            goal.x = levelLength;

            // Items
            let floatPlats = platforms.filter(p => p.type !== 'ground');
            activeRoute.touristSpots.forEach(spot => {
                let plat = floatPlats[Math.floor(random() * floatPlats.length)];
                if(!plat) plat = platforms[0];
                activeItems.push({
                    name: spot.name,
                    x: plat.x + plat.w/2 - 20,
                    y: plat.y - 80,
                    w: 48,
                    h: 48,
                    desc: spot.desc,
                    distance: spot.distance,
                    collected: false
                });
            });

            
        }

        function updateHUD() {
            
            

            const progress = Math.min(100, Math.max(0, Math.floor((player.x / goal.x) * 100)));
            
            
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

                
                
                if (!isUserLoggedIn) {
                    document.getElementById('end-desc').innerHTML = `
                        오매나와 함께 <b>[${activeRoute.num} - ${activeRoute.theme}]</b> 노선의<br>
                        관광지를 성공적으로 수집했습니다!<br><br>
                        🎉 <b>획득 점수:</b> <span class="text-amber-300 font-extrabold text-lg">+${score} PT</span><br>
                        <span class="text-red-400 text-xs mt-1 block font-bold">⚠️ 카카오 로그인을 하셔야 점수가 누적됩니다!</span>
                    `;
                    showEndScreen();
                } else {
                    
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
                            
                        } else {
                            
                        }
                    }).catch(e => {
                        
                    });
                }
                
                function showEndScreen() {
                    const spotContainer = 
                    
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
    