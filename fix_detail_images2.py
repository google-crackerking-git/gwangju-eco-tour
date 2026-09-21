import io

with io.open('app/api/tourism/detail/route.ts', 'r', encoding='utf-8') as f:
    content = f.read()

old_block2 = '''      if (dtXml?.result?.item?.imageUrl) {
        images.push(dtXml.result.item.imageUrl);
      }'''

new_block2 = '''      if (dtXml?.result?.item?.imageUrl) {
        const urls = Array.isArray(dtXml.result.item.imageUrl) ? dtXml.result.item.imageUrl : [dtXml.result.item.imageUrl];
        images.push(...urls);
      }'''

content = content.replace(old_block2, new_block2)

with io.open('app/api/tourism/detail/route.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done API 2")
