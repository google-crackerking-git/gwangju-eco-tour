const fs = require('fs');
const envStr = fs.readFileSync('.env.local', 'utf8');
const match = envStr.match(/KAKAO_CLIENT_ID=(.*)/);
const kakaoKey = match[1].trim().replace(/\"/g, '');

fetch('https://dapi.kakao.com/v2/local/search/keyword.json?query=' + encodeURIComponent('광주 대인시장'), {
  headers: { Authorization: 'KakaoAK ' + kakaoKey }
})
.then(res => res.json())
.then(j => console.log(j))
.catch(console.error);
