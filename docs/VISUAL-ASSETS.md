# Графика и типографика

Визуальный выпуск 0.2 добавляет самостоятельные иллюстрации, локальные шрифты
и короткую анимацию. Все изображения — иллюстративные; это не реальные
котировки, сотрудники, торговые сигналы или доказательства доходности.

## Шрифты

Unbounded — заголовки; Golos Text — основной текст. Переменные WOFF2,
латиница и кириллица, около 140 КБ суммарно. Файлы включены в сборку,
`font-display: swap`. Браузер не обращается к Google.

Источники: [Unbounded](https://github.com/google/fonts/tree/main/ofl/unbounded),
[Golos Text](https://github.com/google/fonts/tree/main/ofl/golostext).
Оба семейства распространяются по SIL Open Font License 1.1; тексты
лицензий сохранены в `public/fonts/`.

## Изображения

Созданы встроенным ImageGen 20 октября 2026 года. WebP-версии 800 и 1440 px
хранятся в `public/images/`, общий вес четырёх файлов — около 270 КБ.
Изображение первого экрана загружается приоритетно, нижнее — отложенно.
Три иллюстрации режимов написаны в SVG в `ModeVisual.astro`.

### Запрос: signal-sculpture

Use case: stylized-concept. Asset type: hero artwork for the TraderAI
trading research website. Create a premium art-directed 3D still life of
an abstract financial market as a physical kinetic sculpture: a cluster
of tall translucent smoky-glass rectangular candlestick bars with fine
vertical metal stems, interrupted uneven rhythm (not a rising profit
staircase), a single flowing electric chartreuse ribbon weaving through
and encircling the bars, suspended above a black graphite plinth.
Dramatic close-up, generous charcoal-black negative space around the
sculpture, near-black #090d10 background seamless edges. Material
contrast: brushed dark titanium, smoked glass, soft neon lime edge
light, a little cool blue rim light. Sophisticated Swiss editorial
finance campaign, tactile and sculptural, precise optical rendering,
no generic network spheres or brains. Landscape composition 3:2,
subject on center-right, beautiful light reflections and shadows.
No text, no letters, no numbers, no logos, no arrows, no currency
symbols. Intended as conceptual art, not a screenshot or financial chart.

### Запрос: research-desk

Use case: photorealistic-natural. Asset type: wide editorial image for
a trading methodology research website. A quietly cinematic top-down
three-quarter photograph of a real-feeling research desk: a person's
hands annotating a paper notebook with a few rough geometric
price-scenario sketches and lines (no readable words or digits),
matte black laptop at the upper right showing an out-of-focus
abstract chart, mechanical pencil, small brushed-metal desk light.
Refined everyday workspace, warm off-white paper against near-black
charcoal desk, small lime-green sticky tab as brand accent, subtle
daylight and cool screen light. Strong tactile grain, editorial
magazine quality, not stock-photo corporate. Wide landscape 3:2.
Hands anatomically natural, no visible face, no logos, no text,
no currency symbols, no luxury objects, no profit arrows.
This is an illustrative scene, not a portrait of a real team.

## Движение и доступность

Анимация появления, прорисовки и реакция на наведение; без бесконечного
движения или имитации живых котировок. `prefers-reduced-motion`
отключает эффекты, включая смену настройки при открытой странице.
Содержимое по умолчанию видно, без JavaScript тоже.
Визуальные эффекты не меняют состояние учебного движка.
