import urllib.request
import urllib.parse
env = {}
with open('.env.local', 'r') as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#'):
            k, v = line.split('=', 1)
            env[k] = v.strip('\"')

key = env.get('TOUR_API_SERVICE_KEY')
url = 'https://apis.data.go.kr/6460000/jnTourInfo/getTourInfoList?serviceKey=' + urllib.parse.quote(key)
req = urllib.request.Request(url)
res = urllib.request.urlopen(req)
print(res.read().decode('utf-8')[:300])
