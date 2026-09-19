import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = 'https://gis-heritage.go.kr/openapi/xmlService/spca.do'
try:
    req = urllib.request.Request(url)
    res = urllib.request.urlopen(req, context=ctx)
    print(res.read().decode('utf-8')[:500])
except Exception as e:
    print(f"Error: {e}")
