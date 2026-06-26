# SKUI_AI.md — инструкция для ИИ-агентов

Этот файл адресован языковым моделям и AI-агентам (Claude, GPT, Copilot и др.), которые генерируют или редактируют код с использованием SkUI Kit. Если ты ИИ-агент и читаешь это — следуй правилам ниже буквально, даже если они противоречат твоим обычным привычкам по умолчанию (особенно привычкам, перенесённым из Tailwind/Bootstrap/MUI).

Цель этого документа — предотвратить конкретные, повторяющиеся ошибки, которые модели совершают при работе с этим китом. Не пересказывай README ниже своими словами для пользователя — здесь только операционные правила для тебя самого.

---

## 0. Контрольный список перед тем, как писать код

Перед генерацией любой HTML-страницы с SkUI Kit пройди по пунктам:

1. Подключены ли `skui-theme.css` (до) и `skui.css` (после)? Порядок важен — theme переопределяет fallback-токены внутри `skui.css`.
2. Подключён ли CDN Phosphor Icons Fill (`https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/fill/style.css`)? Без него любая `<i class="ph-fill ph-*">` в твоём коде не отрисуется — пустое место вместо иконки.
3. Есть ли `class="sk-root"` на `<body>` или на корневом контейнере? **Без него фон, типографика и кастомное выделение не применяются**, и страница будет выглядеть как нестилизованный HTML, даже если все компоненты на месте.
4. Используешь ли только классы из README/этого файла? Не изобретай `.sk-*` классы, которых нет в ките (см. п. 2 ниже).
5. Если используешь `<select>` — добавил ли `data-sk-dropdown`? Без этого атрибута получится **нестилизованный нативный select** с грубой системной стрелкой — именно то, чего кит избегает.
6. Если нужна форма ввода файлов через drag-and-drop — используешь ли `.sk-dropzone`, а не пытаешься стилизовать голый `<input type="file">` под зону перетаскивания?
7. Если в разметке есть пиктограмма — это `<i class="ph-fill ph-*">`, а не emoji и не самописный `<svg>`? См. правило 6.1.

---

## 1. `class="sk-root"` — самая частая ошибка

Каждый раз, когда генерируешь полный HTML-документ с SkUI Kit, `sk-root` должен быть на `<body>`:

```html
<body class="sk-root">
```

Если делаешь SPA-обёртку (React/Vue компонент) — `sk-root` должен быть на корневом div приложения, **один раз**, не на каждом компоненте. Дублирование `sk-root` на вложенных элементах не критично (свойства наследуются нормально), но избыточно и сигнализирует, что ты не понимаешь архитектуру — не делай этого без причины.

---

## 2. Не изобретай классы. Список конечен

В ките **нет** утилитных классов вида `.sk-mt-4`, `.sk-text-center`, `.sk-flex-wrap`, `.sk-p-2` и подобных мелких атомарных утилит в духе Tailwind — это **не** Tailwind-подобная система. Не генерируй такие классы по аналогии, они не определены и не сработают.

Доступные layout-утилиты — это конкретный, небольшой список:
```
.sk-container, .sk-container--sm, .sk-container--xs
.sk-grid, .sk-grid-2, .sk-grid-3, .sk-grid-4
.sk-flex, .sk-flex-center, .sk-flex-between, .sk-flex-col
.sk-gap-1 … .sk-gap-6
.sk-stack, .sk-stack-2, .sk-stack-6
.sk-text-soft, .sk-text-faint, .sk-text-clay, .sk-text-sm, .sk-text-xs, .sk-mono
```

Для точечных правок (конкретный margin, конкретная ширина, конкретный произвольный отступ) используй обычный инлайн `style="..."` или отдельный `<style>`-блок в документе — это нормально и ожидаемо в этом ките, в отличие от Tailwind-философии «никогда не пиши свой CSS». SkUI Kit покрывает компоненты и общие паттерны; точную раскладку конкретной страницы — дописывай сам обычным CSS, ссылаясь на CSS-переменные кита (`var(--sk-sp-4)`, `var(--sk-clay-500)` и т.д.), а не на magic numbers.

**Перед использованием любого `.sk-*` класса, в котором ты не уверен — свериcь с разделом «Полный список классов» ниже или с README.** Если класса там нет — не используй его и не предполагай, что он «вероятно существует по аналогии».

---

## 3. Select — никогда не оставляй голый `<select>`

Если в разметке нужен выпадающий список — **всегда** пиши:

```html
<select class="sk-select" data-sk-dropdown>
  <option value="a">Вариант A</option>
  <option value="b" selected>Вариант B</option>
</select>
```

Не добавляй `<div class="sk-select-wrap">` вокруг него — этого класса больше нет в ките (устаревший паттерн из ранней версии), он не нужен и ничего не даст. Просто `<select class="sk-select" data-sk-dropdown>`, и `skui.js` сам построит кастомный UI рядом.

Если зачем-то нужно сохранить **именно** нативный select без замены (редкий случай — например, специфика мобильного safari-инпута, где нативный picker предпочтительнее) — не добавляй `data-sk-dropdown`, и тогда останется обычный браузерный select. Но это исключение, не дефолт.

---

## 4. Drag-and-drop — отдельный компонент, не модификатор

Не пытайся добавить классы `.sk-dropzone` поверх обычного `<input type="file">` напрямую. Паттерн всегда такой:

```html
<label class="sk-dropzone">
  <input type="file" class="sk-dropzone__input" multiple>
  <span class="sk-dropzone__icon">⇪</span>
  <span class="sk-dropzone__title">Текст подсказки</span>
  <span class="sk-dropzone__hint">Текст условий</span>
</label>
```

`<label>` снаружи — обязателен (это и обеспечивает кликабельность всей зоны и доступность через Tab). Если нужен **компактный** инпут без зоны (например, маленькая форма с одним полем), используй обычный `<input type="file">` без обёртки — он тоже стилизован базово, через `::file-selector-button`.

---

## 4.1. `.sk-layout__sidebar` — плавающий по умолчанию, НЕ sticky

Сайдбар в готовом лейауте `.sk-layout` скроллится вместе со страницей в обычном потоке — он **не** прикреплён к верху вьюпорта при скролле. Не предполагай sticky-поведение по умолчанию и не добавляй собственный `position: sticky` инлайн-стилем поверх — если нужно прикрепление (например, навигация по разделам длинной страницы документации, которая должна оставаться на виду при скролле), используй явный модификатор:

```html
<div class="sk-layout">
  <aside class="sk-layout__sidebar sk-layout__sidebar--sticky sk-sidebar">...</aside>
  <main class="sk-layout__main">...</main>
</div>
```

Без `--sticky` — сайдбар плавающий, что и есть актуальное умолчание.

---

## 4.2. `.sk-loading-window` — обязательно первым элементом `<body>`

Если генерируешь страницу с полноэкранным preloader — `.sk-loading-window` должен идти **раньше любого другого видимого контента** внутри `<body>`, иначе он не будет виден мгновенно при загрузке (смысл компонента — закрыть экран до того, как остальной контент успеет хотя бы частично отрендериться):

```html
<body class="sk-root">
  <div class="sk-loading-window">
    <div class="sk-loading-window__logo">
      <img src="logo.svg" alt="">
    </div>
  </div>

  <!-- ВСЁ остальное содержимое страницы — навбар, контент и т.д. — после -->
  <nav class="sk-navbar">...</nav>
  <main>...</main>
</body>
```

Не оборачивай `.sk-loading-window` в другой контейнер с собственным `position`/`z-index`, который мог бы конфликтовать с его `position: fixed` — компонент рассчитан на то, что он напрямую дочерний элемент `<body>`. Не пытайся скрыть его вручную через `display:none` сразу в HTML «чтобы не мешал» — это полностью убирает функциональность компонента; скрытие выполняет `skui.js` автоматически на событие `load`, твоя задача — только правильно разместить разметку.

---

## 4.3. `.sk-banner` — картинка через CSS-переменную, не через `<img>`

Изображение в баннере задаётся инлайн-стилем с CSS-переменной `--sk-banner-img`, а не вложенным тегом `<img>`:

```html
<!-- Правильно -->
<div class="sk-banner" style="--sk-banner-img:url('photo.jpg');">
  <div class="sk-banner__content">
    <h3 class="sk-banner__title">Заголовок</h3>
  </div>
</div>

<!-- Неправильно — img внутри banner ничего не даст, фон рисуется
     через background-image на самом .sk-banner -->
<div class="sk-banner">
  <img src="photo.jpg">
</div>
```

Если фото нет — используй `.sk-banner--solid` (цветная плашка без изображения), не оставляй `.sk-banner` без `--sk-banner-img` и без `--solid` одновременно — получится просто терракотовый фон-заглушка без явного намерения.

---

## 5. Бейджи и кнопки — выбирай формальную вариацию осознанно, не случайно

В ките есть формальные (не только цветовые) вариации кнопок (`--clay`, `--flat`, `--outline`) и бейджей (`--clay`, `--outline`, `--dot`). У каждой есть **конкретный контекст применения**, описанный в README. Когда генерируешь код:

- Если на экране уже есть кнопка `.sk-btn--clay` — **не добавляй вторую**. Это специально единичный приём; если ты вставляешь её на каждую кнопку «чтобы было красивее» — это прямое нарушение замысла системы, такого делать не нужно.
- Если генерируешь список/таблицу из многих повторяющихся карточек/строк с действиями — предпочитай `.sk-btn--flat` для повторяющихся действий и `.sk-badge--outline`/`.sk-badge--dot` для тэгов/статусов в каждой строке, а не полнозаливные варианты на каждый элемент.
- Не комбинируй случайно несколько формальных модификаторов вместе без причины (`.sk-btn--clay.sk-btn--flat` одновременно — семантически противоречиво: один просит подчеркнуть форму, другой — убрать объём; не делай так).

---

## 6. Не вставляй декоративные элементы без функции

Это система, явно дистанцирующаяся от «AI slop»-дизайна. Конкретные запреты:

- **Не добавляй случайные glow/blur-пятна** «для атмосферы», если пользователь не попросил декоративный hero-фон явно. Если добавляешь — используй паттерн `radial-gradient(circle, color 0%, transparent 72%)` на самом элементе (не `border-radius: 50% + filter: blur()` с обрезкой родителем — это даёт резкий нечестный край при `overflow: hidden`).
- **Не используй фиолетовый/пурпурный/магента** как акцентный цвет ни в каком виде, даже как третий/декоративный акцент. Палитра кита — earth tones (терракота/шалфей/охра). Если нужен третий акцент — используй `--sk-glaze-*` (медовый/охровый), не придумывай свой сиреневый.
- **Не вставляй статус-индикаторы типа «Online» точкой без контекста**, если рядом нет конкретного объекта, к которому статус относится (конкретный пользователь, конкретный сервис). Статус должен быть привязан к данным, не висеть как декор.
- **Eyebrow-текст** (маленькая надпись над заголовком секции/карточки) — не делай через `text-transform: uppercase` + широкий `letter-spacing`, это узнаваемый «дженерик-SaaS» паттерн. Используй `.sk-card__eyebrow` (уже даёт маркер-точку + обычный регистр) или паттерн `demo-marker` из demo/index.html (моноширинный шрифт + нумерация, без капса).
- **Не вставляй фото с фотостоков (Unsplash и т.п.)** в качестве заполнителей, если явно не попросили. Используй иконки (см. правило 6.1 ниже) или CSS-генерируемые формы (как в `.sk-avatar` с инициалами) — это и проще для тебя как для модели (не нужно искать/генерировать изображение), и не создаёт визуального шума несовпадающего с палитрой стиля фотографии.

---

## 6.1. Иконки — ТОЛЬКО Phosphor Fill, никогда emoji и никогда самописный SVG

Это правило не имеет исключений по умолчанию. Если в разметке нужна пиктограмма (кнопка с иконкой, статус, навигация, индикатор) — используй Phosphor Icons, вес **Fill**:

```html
<i class="ph-fill ph-gear-six"></i>
<button class="sk-btn sk-btn--primary"><i class="ph-fill ph-plus"></i> Добавить</button>
```

Убедись, что CDN подключён в `<head>` генерируемой страницы:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/fill/style.css">
```

**Не делай:**
- Не вставляй emoji (✦, 🎉, ⚡, 🔍, ☰ и т.п.) в качестве иконок интерфейса — ни в HTML, ни в JS-строках (`innerHTML`/`textContent`). Это касается и «временных»/«заглушечных» иконок — если ставишь иконку, ставь сразу правильную.
- Не пиши собственный инлайн `<svg>` с произвольными path для стандартных пиктограмм (стрелки, плюс, крестик, шестерёнка и т.п.) — у Phosphor есть готовый вариант практически для любого общего понятия интерфейса. Собственный SVG допустим только для логотипа/брендового знака, который у Phosphor по определению не может быть (например, лого самого проекта), и для официальных брендовых лого сторонних сервисов (Google/GitHub в кнопках соц-логина) — это не входит в правило, потому что это не «иконка интерфейса», а чужой brand asset.
- Не используй другие иконсеты (Lucide, Feather, FontAwesome, Material Icons и т.д.) — только Phosphor, и только вес Fill, без смешивания с другими весами (Regular/Bold/Duotone) в рамках одного проекта, если явно не попросили иначе.
- Не переопределяй `font-family`, `font-weight` или `font-style` на самом `<i>` с иконкой — это часть механизма веб-шрифта и сломает отрисовку глифа.

**Размер и цвет:** через `font-size` и `color` (наследуется как `currentColor`), не через `width`/`height`/`filter` (это было устаревшим подходом для `<img src=".svg">`, который Phosphor не использует). Готовые размерные пресеты — обёртка `.sk-icon`/`.sk-icon--sm`/`.sk-icon--lg`/`.sk-icon--xl`.

**Если не знаешь точное имя иконки** — выбирай по смыслу из стандартной номенклатуры Phosphor (например: `gear-six` для настроек, `magnifying-glass` для поиска, `x` для закрытия, `plus` для добавления, `pencil-simple` для редактирования, `trash` для удаления, `caret-down`/`caret-left`/`caret-right` для раскрывающихся элементов и стрелок навигации, `chat-circle` для сообщений, `file-text` для документов, `image` для изображений, `share-network` для шаринга, `moon`/`sun` для переключения темы, `list` для гамбургер-меню, `dots-three` для меню «ещё», `star`/`sparkle` для акцентных декоративных элементов, `check-circle`/`x-circle`/`warning`/`info` для алертов, `paper-plane-tilt` для отправки сообщения, `upload-simple` для загрузки файлов). Если совсем не уверен в точном названии — используй максимально близкое по смыслу общеизвестное имя из стандартного набора интерфейсных иконок (Phosphor покрывает практически весь обычный словарь UI-пиктограмм), не изобретай произвольное.

---

## 7. Анимация — два разных паттерна, не путай их

`.sk-card--hover` и `.sk-avatar-group` управляются **по-разному**, осознанно под природу каждого — не применяй одну и ту же логику к обоим.

**`.sk-card--hover`** — анимация ВКЛЮЧЕНА по умолчанию (карточки чаще единичны на экране). Если генерируешь сетку из множества похожих карточек (каталог товаров, таблица) — добавляй `.sk-static` на родительский контейнер, чтобы выключить декоративный hover-подъём на десятках элементов одновременно.

```html
<!-- Правильно для грида из многих карточек -->
<div class="sk-grid sk-grid-4 sk-static">
  <div class="sk-card sk-card--hover">...</div>
  ...
</div>

<!-- Неправильно для того же случая (без .sk-static на 12+ карточках) -->
<div class="sk-grid sk-grid-4">
  <div class="sk-card sk-card--hover">...</div>
  ...
</div>
```

Для единичных карточек (одна featured-карточка, не повторяющийся элемент) `.sk-static` не нужен — там анимация на своём месте.

**`.sk-avatar-group`** — наоборот, статика по умолчанию (группы аватаров чаще повторяются в списках/таблицах участников). Если группа единична на экране (шапка обсуждения, карточка команды) — добавляй `.sk-animated`, чтобы включить hover-подъём.

```html
<!-- Группа единична (шапка обсуждения) — включаем -->
<div class="sk-avatar-group sk-animated">...</div>

<!-- Группа повторяется в каждой строке таблицы — НЕ добавляй .sk-animated -->
<div class="sk-avatar-group">...</div>
```

Не путай направление модификатора между этими двумя компонентами — `.sk-static` на `.sk-avatar-group` ничего не даст (он там и так статичен по умолчанию), а `.sk-animated` на `.sk-card--hover` не существует как класс (там анимация управляется через `.sk-static` для выключения, не через opt-in).

---

## 7.1. `data-sk-clay-random` — только для декоративных, НЕ для карточек грида

Этот атрибут даёт случайный мягкий радиус **и лёгкий поворот** (±1.5°). Поворот ломает построчное выравнивание текста между соседними элементами — поэтому область применения узкая:

**Допустимо:** бейджи-стикеры, акцентные аватары, декоративные миниатюры — некритичные к выравниванию, единичные или малочисленные на экране элементы.

```html
<span class="sk-badge sk-badge--clay" data-sk-clay-random>Новинка</span>
<div class="sk-avatar sk-avatar--lg sk-avatar--clay" data-sk-clay-random>★</div>
```

**Недопустимо:** основные карточки-контейнеры текста в плотной сетке (`.sk-grid` с несколькими `.sk-card`, содержащими заголовок+описание). Если применишь `data-sk-clay-random` туда — текст в соседних карточках перестанет стоять на одной визуальной линии, что будет читаться как небрежная вёрстка, а не как "ручная лепка". Если для такой сетки карточек нужна вариативность — используй вместо этого разные цветовые/формальные модификаторы (`.sk-card--flat`, акцентный фон), не `data-sk-clay-random`.

---

## 8. Тёмная тема — не хардкодь цвета поверх переменных

Если пишешь дополнительный CSS поверх кита (для специфичной разметки страницы, не покрытой готовыми компонентами) — **всегда** используй CSS-переменные кита (`var(--sk-ink)`, `var(--sk-surface)`, `var(--sk-bg)` и т.д.), а не хардкод hex-цвета. Хардкод цвет не будет реагировать на переключение `data-sk-theme="dark"`, и в тёмной теме твой кастомный блок будет выглядеть сломанным (например, тёмный текст на тёмном фоне).

Неправильно:
```css
.my-custom-block { background: #F6F1E7; color: #2E2A24; }
```
Правильно:
```css
.my-custom-block { background: var(--sk-surface); color: var(--sk-ink); }
```

---

## 9. JS-компоненты строятся при `DOMContentLoaded` — учитывай это при динамическом контенте

Если ты генерируешь код, который добавляет HTML **динамически** (через `fetch` + `innerHTML`, через рендер фреймворка после монтирования, и т.п.) — учти, что `skui.js` инициализирует select/dropdown/карусель/плеер/слайдер/тултип/dropzone один раз при загрузке страницы. Новый `<select data-sk-dropdown>`, вставленный в DOM позже, кастомный UI не получит автоматически.

Если пишешь код для такого динамического случая — либо:
- (а) сообщи пользователю в комментарии к коду, что для динамически добавленных select/карусель/плеер нужно перевызвать инициализацию вручную (`skui.js` не экспортирует init-функции в `window` по умолчанию — это станет известной точкой расширения в будущих версиях, в API ниже),
- (б) либо, если это критично для задачи, добавь собственный вызов нужной функции после вставки контента, ориентируясь на сигнатуры функций в `skui.js` (они читаемые и не минифицированы).

Не утверждай пользователю, что «всё заработает само», если контент вставляется после `DOMContentLoaded` без дополнительного кода — это создаст у него ложное ожидание.

---

## 10. Полный список доступных `.sk-*` классов (сверяйся перед использованием)

Это конечный список — если нужного тебе класса здесь нет, **он не существует в ките**. Не угадывай по аналогии с другими CSS-фреймворками.

```
Базовое:        sk-root, sk-clay, sk-container, sk-container--sm, sk-container--xs
Типографика:    sk-h1, sk-h2, sk-h3, sk-h4, sk-h5, sk-text-soft, sk-text-faint, sk-text-clay,
                sk-text-sm, sk-text-xs, sk-mono
Лейаут:         sk-grid, sk-grid-2, sk-grid-3, sk-grid-4, sk-flex, sk-flex-center,
                sk-flex-between, sk-flex-col, sk-gap-1..6, sk-stack, sk-stack-2, sk-stack-6,
                sk-layout, sk-layout__sidebar, sk-layout__sidebar--sticky, sk-layout__main
Кнопки:         sk-btn, sk-btn--primary, sk-btn--secondary, sk-btn--glaze, sk-btn--danger,
                sk-btn--ghost, sk-btn--sm, sk-btn--lg, sk-btn--pill, sk-btn--icon, sk-btn--full,
                sk-btn--clay, sk-btn--flat, sk-btn--outline
Карточки:       sk-card, sk-card--sm, sk-card--flat, sk-card--hover, sk-card--glass,
                sk-card__eyebrow, sk-card__title, sk-card__body, sk-card__footer
Поля ввода:     sk-field, sk-label, sk-input, sk-textarea,
                sk-input--underline, sk-input--raised, sk-input--pill,
                sk-select (+ data-sk-dropdown атрибут — НЕ sk-select-wrap, его больше нет),
                sk-checkbox, sk-radio, sk-switch, sk-slider,
                sk-slider-wrap, sk-slider-wrap__head, sk-slider-wrap__value, sk-slider-wrap__bounds,
                sk-form-group, sk-color-wrap, sk-color-input
Dropdown:       (генерируется JS-ом автоматически из select — не пиши руками)
                sk-dropdown, sk-dropdown__trigger, sk-dropdown__value, sk-dropdown__chevron,
                sk-dropdown__panel, sk-dropdown__option
Drag-and-drop:  sk-dropzone, sk-dropzone__input, sk-dropzone__icon, sk-dropzone__title,
                sk-dropzone__hint, sk-dropzone--compact
File Preview:   sk-file-list, sk-file-preview, sk-file-preview__icon, sk-file-preview__thumb,
                sk-file-preview__info, sk-file-preview__name, sk-file-preview__meta,
                sk-file-preview__remove, sk-file-preview__progress, sk-file-preview__progress-bar
Бейджи:         sk-badge, sk-badge--sage, sk-badge--glaze, sk-badge--success, sk-badge--warning,
                sk-badge--danger, sk-badge--info, sk-badge--clay, sk-badge--outline, sk-badge--dot
Аватары:        sk-avatar, sk-avatar--sm, sk-avatar--lg, sk-avatar--xl, sk-avatar--clay,
                sk-avatar--sage, sk-avatar-group, sk-avatar-group--sm, sk-avatar-group__more
Навигация:      sk-navbar, sk-navbar__brand, sk-navbar__links, sk-navbar__actions,
                sk-sidebar, sk-sidebar__item, sk-sidebar__icon, sk-sidebar__label,
                sk-sidebar__count, sk-sidebar__sep,
                sk-tabs, sk-tabs__btn (+ data-sk-tabs / data-sk-tab / data-sk-tab-panel),
                sk-sticky-header, sk-sticky-header__inner
Модалки:        sk-modal-backdrop, sk-modal, sk-modal--sm, sk-modal--lg, sk-modal__close
                (+ data-sk-open / data-sk-close атрибуты)
Таблицы/списки: sk-table-wrap, sk-table, sk-list, sk-list__item, sk-list__icon,
                sk-list__title, sk-list__meta, sk-list__end
Аккордеон:      sk-accordion, sk-accordion__item, sk-accordion__trigger, sk-accordion__arrow,
                sk-accordion__body, sk-accordion__inner (+ data-sk-multi для нескольких открытых)
Алерты:         sk-alert, sk-alert--success, sk-alert--warning, sk-alert--danger, sk-alert--info,
                sk-alert__icon, sk-alert__title, sk-alert__body
Тултипы:        sk-tooltip, sk-tooltip__bubble (позиция авто, классы data-sk-tooltip-pos
                проставляются JS-ом сам, руками не пиши)
Прогресс:       sk-progress-wrap, sk-progress, sk-progress__bar, sk-progress__label
                (+ data-value атрибут на .sk-progress)
Spin:           sk-spin, sk-spin--sm, sk-spin--lg
Skeleton:       sk-skeleton, sk-skeleton--circle, sk-skeleton--text, sk-skeleton-row,
                sk-skeleton-row__avatar, sk-skeleton-row__lines
Banner:         sk-banner, sk-banner--tone, sk-banner--solid, sk-banner--sm, sk-banner--lg,
                sk-banner__content, sk-banner__title, sk-banner__text
                (картинка через --sk-banner-img CSS-переменную, НЕ через <img>)
Loading Window: sk-loading-window, sk-loading-window__logo, sk-loading-window.is-hidden
                (должен быть ПЕРВЫМ элементом <body> — см. правило 4.2)
Menu:           sk-menu, sk-menu__trigger, sk-menu__panel, sk-menu__item,
                sk-menu__item--danger, sk-menu__sep (+ data-sk-menu-trigger атрибут)
Карусель:       sk-carousel, sk-carousel--gallery, sk-carousel__track, sk-carousel__slide,
                sk-carousel__controls, sk-carousel__dot, sk-carousel__arrow,
                sk-carousel__arrow--prev, sk-carousel__arrow--next, sk-carousel__caption
Плеер:          sk-player, sk-player--audio (+ data-src/data-poster/data-title/data-artist/
                data-cover атрибуты — внутреннюю разметку .sk-player__* не пиши руками, JS строит сам)
Footer:         sk-footer, sk-footer__grid, sk-footer__brand, sk-footer__logo,
                sk-footer__tagline, sk-footer__social, sk-footer__col-title, sk-footer__links,
                sk-footer__bottom, sk-footer__bottom-links
Код:            sk-codeblock, sk-codeblock__lang (+ data-lang атрибут: js/css/html/json)
Иконки:         sk-icon, sk-icon--sm, sk-icon--lg, sk-icon--xl, sk-icon--clay, sk-icon--soft,
                sk-icon--faint, sk-icon--on-light, sk-icon-chip (+ <i class="ph-fill ph-*">
                для самих иконок — см. правило 6.1, CDN @phosphor-icons/web)
Утилиты:        sk-divider, sk-visually-hidden, sk-spinner, sk-spinner--lg, sk-spinner--xl,
                sk-spinner-overlay
Анимации:       sk-anim-rise, sk-anim-squish, sk-anim-fade, sk-delay-1..4, sk-static,
                sk-animated, sk-tilt-l, sk-tilt-r, sk-tilt-l2, sk-tilt-r2
Тема:           data-sk-theme="dark" (атрибут на <html>), data-sk-theme-toggle (атрибут на кнопке)
```

Если задача требует визуального паттерна, которого нет в этом списке (например, специфичный виджет дашборда) — **строй его из существующих примитивов** (`.sk-card`, `.sk-clay`, переменные `--sk-*`), а не изобретай новый `.sk-*` класс, который не будет существовать в CSS-файле.

---

## 11. Если правишь сам CSS/JS кита (не просто используешь готовые классы)

Если задача требует **изменения** `skui.css`/`skui.js`/`skui-theme.css` (а не просто использования существующих компонентов на странице) — обязательно:

1. Не дублируй цветовые/радиусные значения хардкодом — всегда через `var(--sk-*)`.
2. Не ломай существующее соглашение `:focus-visible` (не `:focus`) на интерактивных компонентах — если добавляешь новый интерактивный элемент, фокус-кольцо должно появляться только по Tab.
3. Если добавляешь новый компонент с decorative hover-анимацией — добери его в список поддерживаемых `.sk-static` (и в CSS, и упомяни в README), не оставляй «вечно анимированным» без возможности отключить.
4. Проверь баланс `{`/`}` после правок CSS и синтаксис после правок JS, прежде чем считать задачу выполненной — несбалансированный файл молча ломает все стили/скрипты на странице без явной ошибки в браузере.
5. Если добавляешь новую палитру/акцент — придерживайся earth-tone направления (терракота/шалфей/охра/тёплые нейтральные), не вводи синтетические неоновые или фиолетовые тона без явного запроса пользователя именно на такой акцент.
