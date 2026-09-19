const http = require('http');
fetch('http://apis.data.go.kr/6290000/gj_bis/lineStationInfo?serviceKey=' + process.env.BUS_API_SERVICE_KEY + '&resultType=json&LINE_ID=50')
.then(r=>r.json())
.then(d=>console.log(d.RESPONSE.BUSSTOP_LIST.ITEM[0], d.RESPONSE.BUSSTOP_LIST.ITEM[d.RESPONSE.BUSSTOP_LIST.ITEM.length-1]))
.catch(console.error);
