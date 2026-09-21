import io
import re

with io.open('public/minigame.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update player scale
text = re.sub(r'width: 38,\s*height: 48,', 'width: 58,\n            height: 75,', text)
text = re.sub(r'speed: 5\.2,', 'speed: 6.5,', text)
text = re.sub(r'jumpStrength: -13\.6,', 'jumpStrength: -16.5,', text)
text = re.sub(r'gravity: 0\.68,', 'gravity: 0.8,', text)

# 2. Make platforms and items dynamic
old_platforms = '''        const platforms = [
            { x: 0, y: 470, w: 580, h: 90, type: 'ground' },
            { x: 650, y: 470, w: 680, h: 90, type: 'ground' },
            { x: 1380, y: 470, w: 920, h: 90, type: 'ground' },

            { x: 250, y: 360, w: 140, h: 22, type: 'bus', label: '🚌 친환경 정류장' },
            { x: 460, y: 270, w: 140, h: 22, type: 'subway', label: '🚇 탄소 제로 코스' },
            
            { x: 770, y: 350, w: 130, h: 22, type: 'bus', label: '🚌 도보 300m 투어' },
            { x: 970, y: 260, w: 150, h: 22, type: 'subway', label: '🚇 자전거 환승' },
            { x: 1180, y: 330, w: 130, h: 22, type: 'cloud', label: '☁️ 무등산 둘레길' },

            { x: 1520, y: 350, w: 140, h: 22, type: 'bus', label: '🚌 에코 환승센터' },
            { x: 1720, y: 270, w: 140, h: 22, type: 'subway', label: '🚇 타랑께 공공자전거' },
            { x: 1920, y: 360, w: 130, h: 22, type: 'cloud', label: '☁️ 에코투어 완주' }
        ];'''

text = text.replace(old_platforms, '        let platforms = [];')

# 3. Dynamic initialization in startGame
start_game_pattern = r'''(function startGame\(routeId\) \{[^}]*activeRoute = busRoutesData\.find\(r => r\.id === routeId\);)[^}]*?activeItems = activeRoute\.touristSpots\.map[^\}]+?\}\)\);'''

new_init = '''function startGame(routeId) {
            score = 0;
            collectedList = [];
            player.x = 80;
            player.y = 300;
            player.vy = 0;
            cameraX = 0;
            gameState = 'PLAYING';
            
            activeRoute = busRoutesData.find(r => r.id === routeId);

            // Procedural Level Generation
            platforms = [];
            activeItems = [];
            
            let seed = 0;
            for (let i = 0; i < routeId.length; i++) seed += routeId.charCodeAt(i);
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
            });'''

text = re.sub(r'function startGame\(routeId\)\s*\{(.*?)\}\)\);', new_init, text, flags=re.DOTALL)

# 4. Fix rendering sizes in render()
text = re.sub(r'ctx.fillRect\(plat\.x, plat\.y, plat\.w, 14\);', 'ctx.fillRect(plat.x, plat.y, plat.w, 20);', text)
text = re.sub(r'ctx.fillRect\(plat\.x, plat\.y \+ 14, plat\.w, plat\.h - 14\);', 'ctx.fillRect(plat.x, plat.y + 20, plat.w, plat.h - 20);', text)
text = re.sub(r'ctx.roundRect\(plat\.x, plat\.y, plat\.w, plat\.h, 8\);', 'ctx.roundRect(plat.x, plat.y, plat.w, plat.h, 12);', text)
text = re.sub(r"ctx.font = 'bold 11px sans-serif';", "ctx.font = 'bold 16px sans-serif';", text)
text = re.sub(r'ctx.fillText\(plat\.label, plat\.x \+ 10, plat\.y \+ 15\);', 'ctx.fillText(plat.label, plat.x + 15, plat.y + 24);', text)

text = re.sub(r'ctx.ellipse\(item\.x \+ 18, item\.y \+ 36, 12, 4, 0, 0, Math\.PI \* 2\);', 'ctx.ellipse(item.x + 24, item.y + 48, 20, 6, 0, 0, Math.PI * 2);', text)
text = re.sub(r'ctx.arc\(item\.x \+ 18, bobbingY \+ 12, 15, 0, Math\.PI \* 2\);', 'ctx.arc(item.x + 24, bobbingY + 20, 24, 0, Math.PI * 2);', text)
text = re.sub(r"ctx.font = '13px sans-serif';", "ctx.font = '22px sans-serif';", text)
text = re.sub(r"ctx.fillText\('✨', item\.x \+ 10, bobbingY \+ 17\);", "ctx.fillText('✨', item.x + 12, bobbingY + 28);", text)

text = re.sub(r"ctx.roundRect\(item\.x - 42, bobbingY - 24, 120, 24, 8\);", "ctx.roundRect(item.x - 60, bobbingY - 40, 168, 36, 12);", text)
text = re.sub(r"ctx.font = 'bold 10px sans-serif';", "ctx.font = 'bold 16px sans-serif';", text)
text = re.sub(r"ctx.fillText\(item\.name, item\.x - 36, bobbingY - 8\);", "ctx.fillText(item.name, item.x - 50, bobbingY - 16);", text)

# Fix drawOmena size
text = re.sub(r'const sX = isWalking \? \(Date\.now\(\) % 300 < 150 \? 1 : 2\) : 0;', 'const sX = isWalking ? (Math.floor(Date.now() / 150) % 2 === 0 ? 1 : 2) : 0;', text)


with io.open('public/minigame.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("done")
