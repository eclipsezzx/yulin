from pathlib import Path
import re
p=Path(__file__).resolve().parent
parts=['art.js','contours.js','chapters.js','core.js','interact.js','cutting.js','yangge-score.js','yangge.js','sound-score.js','sound.js','collage.js','app.js','chapter1-v3.js','prologue-v4.js','heritage-contours.js','heritage-v5.js','route-v6.js','detail-v7.js','free-window-v7.js','ch23-contours-v8.js','ansai-score-v8.js','folk-v8.js','folk-culture-v8.js','year-window-v8.js','ansai-rhythm-v8.js','food-contours-v9.js','food-v9.js','table-contours-v10.js','food-table-v10.js','waist-contours-v11.js','waist-v11.js','bowls-contours-v12.js','editorial-v12.js','serving-art-v13.js','serving-v13.js','perspective-art-v14.js','perspective-v14.js','scroll-gestures-v14.js','scroll-v13.js','flow-v15.js','loading-v16.js','narration-fit-v8.js']
(p/'js/game.bundle.js').write_text('\n\n'.join((p/'js'/n).read_text(encoding='utf-8-sig') for n in parts),encoding='utf-8')
version=re.search(r"version:'([^']+)'",(p/'js/flow-v15.js').read_text(encoding='utf-8')).group(1)
f=p/'index.html';s=f.read_text(encoding='utf-8-sig');s=re.sub(r'(css/main\.css|js/game\.bundle\.js)\?v=[^\"]+',lambda m:m.group(1)+'?v='+version,s);f.write_text(s,encoding='utf-8')
print('Prologue bundle built: '+version)



