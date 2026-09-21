const fs = require('fs');
let text = fs.readFileSync('public/minigame.html', 'utf8');

text = text.replace(/<div class="text-xs text-slate-300 leading-snug line-clamp-2">[\s\S]*?<\/div>/, `<div class="text-xs text-slate-300 leading-snug line-clamp-2">📍 주요경유: \${route.stops.slice(0, 4).join(' ➔ ')} 등</div>`);

fs.writeFileSync('public/minigame.html', text, 'utf8');
console.log('Fixed encoding');
