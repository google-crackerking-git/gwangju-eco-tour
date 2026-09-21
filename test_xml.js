const xml2js = require('xml2js');
async function test() {
  const url = 'http://www.khs.go.kr/cha/SearchKindOpenapiList.do?pageUnit=2000&ccbaCncl=N&ccbaCtcd=24';
  const res = await fetch(url);
  const text = await res.text();
  const parser = new xml2js.Parser({ explicitArray: false });
  parser.parseString(text, (err, result) => {
    if (err) return console.error(err);
    const items = result.result.item || [];
    const gwangjuItems = items.filter(i => {
      // It turns out Gwangju might be ccbaCtcd=24. In the previous output we saw ccbaCtcd: 36 (which is Jeonnam).
      return i.ccbaCtcd === '24';
    });
    console.log('Total items:', items.length);
    console.log('Gwangju items (ccbaCtcd=24):', gwangjuItems.length);
    console.log('Sample Gwangju item:', gwangjuItems[0]);
  });
}
test();
