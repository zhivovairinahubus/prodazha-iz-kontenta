# Сборка одного index.html из src/: стили, SVG-символ свечи, данные курсов и логика — внутри файла
import re, pathlib
src = pathlib.Path(__file__).parent
css = (src/'style.css').read_text(encoding='utf-8')
courses = (src/'courses.js').read_text(encoding='utf-8')
app = (src/'app.js').read_text(encoding='utf-8')
candle = (src/'candle.svg').read_text(encoding='utf-8')
html = f'''<!DOCTYPE html>
<html lang="ru"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Продажа из контента — прототип VK · VK Case Champ 2026</title>
<meta name="description" content="Кликабельный прототип четырёх сценариев и обучения VK Академии для бизнес-сообществ во ВКонтакте">
<style>
{css}</style></head>
<body>
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>{candle}</defs></svg>
<div class="app" id="app"><div class="view" id="view"></div><div id="layer"></div></div>
<script>
{courses}
{app}</script>
</body></html>
'''
(src.parent/'index.html').write_text(html, encoding='utf-8')
print('index.html', len(html))
