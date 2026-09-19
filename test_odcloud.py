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
url1 = 'https://api.odcloud.kr/api/15133527/v1/uddi:f2427b4c-386e-42bd-ab03-a067cbde14c9?serviceKey=' + key + '&page=1&perPage=5'

req = urllib.request.Request(url1)
res = urllib.request.urlopen(req)
print(res.read().decode('utf-8'))
