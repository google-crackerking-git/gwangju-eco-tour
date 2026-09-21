import io
import re

with io.open('public/minigame.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix the endsWith corruption
text = re.sub(r"stopName\.endsWith\('.*?'\)", "stopName.endsWith('역')", text)
text = text.replace("let label = (type === 'subway' ? '? ' : '? ') + stopName;", "let label = (type === 'subway' ? '🚇 ' : '🚌 ') + stopName;")

# Fix the Items generation logic
pattern = re.compile(r"// Items\s*let floatPlats = platforms\.filter\(p => p\.type !== 'ground'\);\s*activeRoute\.touristSpots\.forEach\(spot => \{.*?\}\);", re.DOTALL)

new_bean_logic = """// Items
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
            }"""

if pattern.search(text):
    text = pattern.sub(new_bean_logic, text)
    print("Replaced items logic successfully!")
else:
    print("Could not find items logic using regex!")

with io.open('public/minigame.html', 'w', encoding='utf-8') as f:
    f.write(text)

