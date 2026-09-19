import urllib.request
import json
env = {}
with open('.env.local', 'r') as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#'):
            k, v = line.split('=', 1)
            env[k] = v.strip('\"')
key = env.get('BUS_API_SERVICE_KEY')
url = f'http://apis.data.go.kr/6290000/gj_bis/lineStationInfo?serviceKey={key}&resultType=json&LINE_ID=50'
req = urllib.request.Request(url)
res = urllib.request.urlopen(req)
data = json.loads(res.read().decode('utf-8'))
items = data.get('RESPONSE', {}).get('BUSSTOP_LIST', {}).get('ITEM', [])
if len(items) > 0:
    print(items[0])
    print(items[-1])
