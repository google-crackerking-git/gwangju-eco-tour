const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/KAKAO_CLIENT_ID=(.*)/);
const kakaoKey = match[1].trim().replace(/\"/g, '');

const markets = JSON.parse(fs.readFileSync('data/markets_raw.json', 'utf8'));

async function run() {
  for (let m of markets) {
    if (!m['주소']) continue;
    try {
      const geoRes = await fetch('https://dapi.kakao.com/v2/local/search/address.json?query=' + encodeURIComponent(m['주소']), {
        headers: { Authorization: 'KakaoAK ' + kakaoKey }
      });
      const geoJson = await geoRes.json();
      if (geoJson.documents && geoJson.documents.length > 0) {
        m.lat = parseFloat(geoJson.documents[0].y);
        m.lng = parseFloat(geoJson.documents[0].x);
      } else {
        m.lat = 0; m.lng = 0;
      }
    } catch(e) { console.error(e); m.lat = 0; m.lng = 0; }
  }
  
  const tsContent = 'import { TourismPlace } from \"@/types\";\n\n' +
    'export const LOCAL_MARKETS: TourismPlace[] = ' + JSON.stringify(markets.map((m, i) => {
      return {
        contentId: 'market_' + i,
        contentTypeId: 38,
        title: '[전통시장] ' + m['시장명'],
        addr1: m['주소'],
        mapx: m.lng,
        mapy: m.lat,
        dist: 0,
        firstimage: '',
        tel: m['전화'],
        overview: m['기본설명'],
        isShopping: true
      };
    }), null, 2) + ';\n';
    
  fs.writeFileSync('data/markets.ts', tsContent);
}
run();
