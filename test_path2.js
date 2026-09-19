const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/TOUR_API_SERVICE_KEY=(.*)/);
const key = match[1].trim().replace(/\"/g, '');

async function run() {
  let allItems = [];
  for(let i=1; i<=2; i++){
    const url = 'https://api.data.go.kr/openapi/tn_pubr_public_stret_tursm_info_api?serviceKey=' + key + '&pageNo=' + i + '&numOfRows=1000&type=json';
    const res = await fetch(url);
    const j = await res.json();
    if(j.body && j.body.items && j.body.items.item) {
      allItems = allItems.concat(j.body.items.item);
    }
  }
  
  const gwangjuItems = allItems.filter(item => 
    (item.beginRdnmadr && item.beginRdnmadr.includes('광주광역시')) ||
    (item.beginLnmadr && item.beginLnmadr.includes('광주광역시')) ||
    (item.insttNm && item.insttNm.includes('광주광역시')) ||
    (item.institutionNm && item.institutionNm.includes('광주광역시'))
  );
  console.log('Total Gwangju Metropolitan City Paths:', gwangjuItems.length);
  if (gwangjuItems.length > 0) {
    console.log(JSON.stringify(gwangjuItems.slice(0, 2), null, 2));
  }
}
run();
