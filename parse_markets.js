const fs = require('fs');
const content = fs.readFileSync('temp_markets.csv', 'utf8');

function parseCSV(str) {
  const arr = [];
  let quote = false;
  let col = 0;
  let row = 0;
  for (let c = 0; c < str.length; c++) {
    let cc = str[c], nc = str[c+1];
    arr[row] = arr[row] || [];
    arr[row][col] = arr[row][col] || '';
    if (cc === '"' && quote && nc === '"') {
      arr[row][col] += cc; ++c; continue;
    }
    if (cc === '"') {
      quote = !quote; continue;
    }
    if (cc === ',' && !quote) {
      ++col; continue;
    }
    if (cc === '\r' && nc === '\n' && !quote) {
      ++row; col = 0; ++c; continue;
    }
    if (cc === '\n' && !quote) {
      ++row; col = 0; continue;
    }
    if (cc === '\r' && !quote) {
      ++row; col = 0; continue;
    }
    arr[row][col] += cc;
  }
  return arr;
}

const rows = parseCSV(content);
const header = rows[0];
const data = rows.slice(1).map(r => {
  let obj = {};
  header.forEach((h, i) => {
    obj[h] = r[i];
  });
  return obj;
});

fs.writeFileSync('data/markets_raw.json', JSON.stringify(data, null, 2));
