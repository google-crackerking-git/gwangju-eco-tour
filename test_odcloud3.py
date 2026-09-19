import urllib.request
import json
env = {}
with open('.env.local', 'r') as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#'):
            k, v = line.split('=', 1)
            env[k] = v.strip('\"')

key = env.get('TOUR_API_SERVICE_KEY')
url = 'https://api.odcloud.kr/api/15133527/v1/uddi:f2427b4c-386e-42bd-ab03-a067cbde14c9?serviceKey=' + key + '&page=1&perPage=50'

req = urllib.request.Request(url)
res = urllib.request.urlopen(req)
data = json.loads(res.read().decode('utf-8'))
with open('odcloud_test.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
