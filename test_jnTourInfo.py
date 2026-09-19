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
# Wait, TourAPI keys from env are usually decoded. We might need to encode it if passed in URL.
# Let's test a few common paths
paths = [
    '',
    '/getJnTourInfo',
    '/getTourInfoList',
    '/getTursmInfo',
    '/getTursmInfoList',
    '/getTursmList'
]

for p in paths:
    try:
        # For apis.data.go.kr, usually the decoded key must be passed to ?serviceKey= 
        # Actually it's often safer to use the encoded key, but let's try just appending
        # We'll URL encode the key first.
        # TourAPI keys are sometimes double encoded. 
        # Let's use the exact key string directly as serviceKey first.
        url = 'https://apis.data.go.kr/6460000/jnTourInfo' + p + '?serviceKey=' + urllib.parse.quote(key) + '&pageNo=1&numOfRows=10'
        req = urllib.request.Request(url)
        res = urllib.request.urlopen(req)
        print(f"Path: {p} => HTTP 200")
        print(res.read().decode('utf-8')[:300])
    except urllib.error.HTTPError as e:
        print(f"Path: {p} => HTTP Error {e.code}")
    except Exception as e:
        print(f"Path: {p} => Error {e}")
