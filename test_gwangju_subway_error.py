import urllib.request
import urllib.parse
import json

env = {}
with open('.env.local', 'r') as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#'):
            k, v = line.split('=', 1)
            env[k] = v.strip('\"')

key = env.get('TOUR_API_SERVICE_KEY')

endpoints = [
    'https://apis.data.go.kr/B551232/OAMS_CLTPLCE_01',
    'https://apis.data.go.kr/B551232/OAMS_STATN_01'
]

for ep in endpoints:
    url = ep + '?serviceKey=' + urllib.parse.quote(key) + '&pageNo=1&numOfRows=5&_type=json'
    try:
        req = urllib.request.Request(url)
        res = urllib.request.urlopen(req)
        print(f"URL: {ep} => HTTP 200")
        print(res.read().decode('utf-8')[:300])
    except urllib.error.HTTPError as e:
        print(f"URL: {ep} => Error {e.code}")
        print(e.read().decode('utf-8')[:500])

