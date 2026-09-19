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
params = [
    'signguCd=11',
    'sigunCd=11',
    'sggCd=11',
    'signguCode=11',
    'areaCode=11',
    'areaCd=11',
    'tourId=1',
    'cid=1'
]

for p in params:
    try:
        url = 'https://apis.data.go.kr/6460000/jnTourInfo/getTourInfoList?serviceKey=' + urllib.parse.quote(key) + '&pageNo=1&numOfRows=10&' + p
        req = urllib.request.Request(url)
        res = urllib.request.urlopen(req)
        output = res.read().decode('utf-8')[:300]
        if 'SQLException' not in output:
            print(f"Param: {p} => SUCCESS!")
            print(output)
            break
        else:
            print(f"Param: {p} => SQL Exception")
    except Exception as e:
        print(f"Param: {p} => Error {e}")
