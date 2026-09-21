import io

with io.open('next.config.ts', 'r', encoding='utf-8') as f:
    content = f.read()

old_patterns = '''      { protocol: 'http', hostname: 'k.kakaocdn.net' },
    ],'''

new_patterns = '''      { protocol: 'http', hostname: 'k.kakaocdn.net' },
      // 국가유산청 이미지 서버
      { protocol: 'http', hostname: 'www.khs.go.kr' },
      { protocol: 'https', hostname: 'www.khs.go.kr' },
      { protocol: 'http', hostname: 'search.cha.go.kr' },
      { protocol: 'https', hostname: 'search.cha.go.kr' },
    ],'''

content = content.replace(old_patterns, new_patterns)

with io.open('next.config.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done config")
