import urllib.request
url = 'http://www.heritage.go.kr/heri/irani/openapi/heritageSearch.do?ccbaCtcd=24' # 24 is Gwangju
try:
    req = urllib.request.Request(url)
    res = urllib.request.urlopen(req)
    print(res.read().decode('utf-8')[:300])
except Exception as e:
    print(f"Error: {e}")
