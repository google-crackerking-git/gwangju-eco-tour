import io
with io.open('public/minigame.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("ctx.fillText('✨', item.x + 10, bobbingY + 17);", "ctx.fillText('✨', item.x + 12, bobbingY + 28);")
text = text.replace("ctx.fillText('ARRIVE', goal.x + 9, goal.y + 32);", "ctx.fillText('ARRIVE', goal.x + 9, goal.y + 32);") # keep same
text = text.replace("ctx.font = 'bold 11px sans-serif';", "ctx.font = 'bold 16px sans-serif';")

with io.open('public/minigame.html', 'w', encoding='utf-8') as f:
    f.write(text)
print("fixed")
