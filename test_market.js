const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/TOUR_API_SERVICE_KEY=(.*)/);
const key = match[1].trim().replace(/\"/g, '');
const start = Date.now();
fetch('https://api.odcloud.kr/api/15095853/v1/uddi:bc80387d-e19f-4659-b53b-cd0245ef61a0?page=1&perPage=3000&serviceKey=' + key)
.then(res => res.json())
.then(j => console.log('Count:', j.currentCount, 'Time:', Date.now() - start, 'ms'))
.catch(console.error);
