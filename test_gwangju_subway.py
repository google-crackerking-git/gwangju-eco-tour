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

# We need to guess the operation names. Usually apis.data.go.kr appends operation like /getCltplceList
# Wait! "End Point" provided by user is already the full base. Sometimes the endpoint IS the operation.
# Let's try calling it directly. It supports JSON if we append ?type=json or &_type=json or &returnType=json

for ep in endpoints:
    try:
        url = ep + '?serviceKey=' + urllib.parse.quote(key) + '&pageNo=1&numOfRows=5&_type=json'
        req = urllib.request.Request(url)
        res = urllib.request.urlopen(req)
        print(f"URL: {ep} => HTTP 200")
        output = res.read().decode('utf-8')
        print(output[:500])
        print("---")
    except Exception as e:
        print(f"URL: {ep} => Error {e}")

