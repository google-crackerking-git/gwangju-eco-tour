const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const matchKey = env.match(/TOUR_API_SERVICE_KEY=(.*)/);
const key = matchKey[1].trim().replace(/\"/g, '');
const matchKakao = env.match(/KAKAO_CLIENT_ID=(.*)/);
const kakao = matchKakao[1].trim().replace(/\"/g, '');

process.env.TOUR_API_SERVICE_KEY = key;
process.env.KAKAO_CLIENT_ID = kakao;

// Need to mock Next.js fetch cache behavior or just run it via ts-node, but we don't have ts-node.
// Let's just build it directly and see if any errors happen.
