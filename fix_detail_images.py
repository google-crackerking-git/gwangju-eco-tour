import io

with io.open('app/api/tourism/detail/route.ts', 'r', encoding='utf-8') as f:
    content = f.read()

old_block = '''    if (imgRes.ok) {
      const imgText = await imgRes.text();
      const imgXml = await parseStringPromise(imgText, { explicitArray: false });
      let items = imgXml?.result?.item;
      if (items) {
        if (!Array.isArray(items)) items = [items];
        items.forEach((imgItem: any) => {
          if (imgItem.imageUrl) images.push(imgItem.imageUrl);
        });
      }
    }'''

new_block = '''    if (imgRes.ok) {
      const imgText = await imgRes.text();
      const imgXml = await parseStringPromise(imgText, { explicitArray: false });
      let items = imgXml?.result?.item;
      if (items) {
        if (!Array.isArray(items)) items = [items];
        items.forEach((imgItem: any) => {
          if (imgItem.imageUrl) {
            const urls = Array.isArray(imgItem.imageUrl) ? imgItem.imageUrl : [imgItem.imageUrl];
            images.push(...urls);
          }
        });
      }
    }'''

content = content.replace(old_block, new_block)

with io.open('app/api/tourism/detail/route.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done API")
