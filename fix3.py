import os
f = "D:/gwnagju-eco-tour/app/api/heritage/route.ts"
with open(f, "r", encoding="utf-8") as file:
    content = file.read()
content = content.replace("\\`https://www.gis-heritage.go.kr/openapi/xmlService/spca.do?\\${wfsParams.toString()}\\`", "`https://www.gis-heritage.go.kr/openapi/xmlService/spca.do?${wfsParams.toString()}`")
with open(f, "w", encoding="utf-8") as file:
    file.write(content)

