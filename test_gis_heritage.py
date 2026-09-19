import urllib.request
import urllib.parse
# Test WFS endpoint
url = 'https://www.gis-heritage.go.kr/openapi/xmlService/spca.do'
try:
    req = urllib.request.Request(url)
    res = urllib.request.urlopen(req)
    print(res.read().decode('utf-8')[:500])
except Exception as e:
    print(f"Error: {e}")
