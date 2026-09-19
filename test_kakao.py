# -*- coding: utf-8 -*-
import urllib.request
import ssl
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = 'https://map.kakao.com/link/from/A,35.1,126.8/to/B,35.2,126.9'
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    res = urllib.request.urlopen(req, context=ctx)
    print(res.geturl())
except Exception as e:
    print(e)
