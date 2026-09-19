# -*- coding: utf-8 -*-
import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

params = [
    'ccbaCtcd=24',
    'searchKeyword=%EA%B4%91%EC%A3%BC',
    'siDo=24',
    'sidoCd=24',
    'ctcd=24',
    'bcode=24',
    'type=1'
]

for p in params:
    url = f'https://gis-heritage.go.kr/openapi/xmlService/spca.do?{p}'
    try:
        req = urllib.request.Request(url)
        res = urllib.request.urlopen(req, context=ctx)
        print(f"Param: {p}")
        print(res.read().decode('utf-8')[:200])
        print("---")
    except Exception as e:
        print(f"Param: {p} => Error {e}")
