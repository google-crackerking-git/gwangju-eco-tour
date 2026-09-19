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
    'pageIndex=1&pageUnit=10',
    'startPage=1&pageSize=10',
    'pageNo=1&numOfRows=10'
]

for p in params:
    try:
        url = 'https://apis.data.go.kr/6460000/jnTourInfo/getTourInfoList?serviceKey=' + urllib.parse.quote(key) + '&' + p
        req = urllib.request.Request(url)
        res = urllib.request.urlopen(req)
        print(f"Param: {p} => HTTP 200")
        output = res.read().decode('utf-8')[:300]
        if 'SQLException' not in output:
            print(output)
            break
        else:
            print("SQL Exception")
    except Exception as e:
        print(f"Param: {p} => Error {e}")
