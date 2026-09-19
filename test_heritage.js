const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/TOUR_API_SERVICE_KEY=(.*)/);
const key = match[1].trim().replace(/\"/g, '');
fetch('https://api.odcloud.kr/api/15016304/v1/uddi:b1721406-7b47-4f34-9775-fadb76d58caf?page=1&perPage=1&serviceKey=' + key)
.then(res => res.json())
.then(j => console.log('Count:', j.totalCount))
.catch(console.error);
