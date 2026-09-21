import io
import re

with io.open('public/minigame.html', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = re.compile(r'function resetGame\(\)\s*\{[^\}]*activeItems = activeRoute\.touristSpots\.map[^\}]*\}\)\);\s*gameState = \'PLAYING\';\s*\}', re.DOTALL)

new_reset = '''function resetGame() {
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

            gameState = 'PLAYING';
        }'''

if pattern.search(text):
    text = pattern.sub(new_reset, text)
    with io.open('public/minigame.html', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Replaced with regex!")
else:
    print("Regex failed to match :(")
