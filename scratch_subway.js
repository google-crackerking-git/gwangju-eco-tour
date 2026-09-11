const fs = require('fs');
const https = require('https');
const KAKAO_REST_KEY = '5d39d8e9200a2f7abd5d1933ed4255cc';
const stations = [
  '평동', '도산', '광주송정역', '송정공원', '공항', '김대중컨벤션센터', '상무', '운천', '쌍촌', '화정',
  '농성', '돌고개', '양동시장', '금남로5가', '금남로4가', '문화전당', '남광주', '학동·증심사입구', '소태', '녹동'
];

async function generate() {
  let result = [];
  for (let i=0; i<stations.length; i++) {
    const name = stations[i];
    const url = 'https://dapi.kakao.com/v2/local/search/keyword.json?category_group_code=SW8&query=' + encodeURIComponent('광주 ' + name + ' 지하철');
    const options = { headers: { 'Authorization': 'KakaoAK ' + KAKAO_REST_KEY } };
    await new Promise(resolve => {
        https.get(url, options, (res) => {
            let data = ''; res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const json = JSON.parse(data);
                if (json.documents && json.documents.length > 0) {
                    const doc = json.documents[0];
                    result.push({
                        stationId: i + 1,
                        stationName: name,
                        lineNumber: 1,
                        lat: parseFloat(doc.y),
                        lng: parseFloat(doc.x),
                        address: doc.address_name
                    });
                }
                resolve();
            });
        });
    });
  }
  const content = `export interface SubwayStation {
  stationId: number;
  stationName: string;
  lineNumber: number;
  lat: number;
  lng: number;
  address: string;
}

export const GWANGJU_SUBWAY_LINE1: SubwayStation[] = ${JSON.stringify(result, null, 2)};

export const GWANGJU_CENTER = { lat: 35.1595, lng: 126.8526 };
`;
  fs.writeFileSync('D:/gwnagju-eco-tour/data/subway-stations.ts', content, 'utf8');
}
generate();
