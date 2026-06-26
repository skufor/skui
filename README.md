# 🜍 SkUI Kit

**Claymorphism-дизайн-система для быстрой сборки сайтов.** Тёплый рельеф, терракотовая палитра, фирменная глиняная зернистость. Подключается двумя CSS-файлами и одним JS — без сборщиков, без npm, без зависимостей.

**Версия:** 1.0
**Лицензия:** используйте свободно в своих проектах

---

## Содержание

- [Быстрый старт](#быстрый-старт)
- [Структура пакета](#структура-пакета)
- [Дизайн-философия](#дизайн-философия)
- [Кастомизация темы](#кастомизация-темы)
- [Тёмная тема](#тёмная-тема)
- [Каталог компонентов](#каталог-компонентов)
  - [Типографика](#типографика)
  - [Кнопки](#кнопки)
  - [Карточки](#карточки)
  - [Поля ввода](#поля-ввода)
  - [Select / Dropdown](#select--dropdown-полностью-кастомный)
  - [Чекбоксы, радио, свитчи, слайдер](#чекбоксы-радио-свитчи-слайдер)
  - [Drag-and-drop зона](#drag-and-drop-зона)
  - [Бейджи](#бейджи)
  - [Аватары и группы аватаров](#аватары-и-группы-аватаров)
  - [Навигация (Navbar, Sidebar, Tabs)](#навигация)
  - [Menu](#menu)
  - [Модалки](#модалки)
  - [Таблицы и списки](#таблицы-и-списки)
  - [Аккордеон](#аккордеон)
  - [Алерты](#алерты)
  - [Тултипы](#тултипы)
  - [Прогресс-бар](#прогресс-бар)
  - [Spin](#spin)
  - [Skeleton](#skeleton)
  - [Banner](#banner)
  - [Loading Window](#loading-window)
  - [Карусель](#карусель)
  - [Аудио/видео плеер](#аудиовидео-плеер)
  - [Footer](#footer)
  - [Блок кода с подсветкой](#блок-кода-с-подсветкой)
  - [Тосты](#тосты)
  - [Иконки](#иконки)
- [JS API](#js-api)
- [Анимации, `.sk-static` и `.sk-animated`](#анимации-sk-static-и-sk-animated)
- [Доступность](#доступность)
- [Адаптивность](#адаптивность)
- [Готовые примеры](#готовые-примеры)
- [Соглашения и анти-паттерны](#соглашения-и-анти-паттерны)

---

## Быстрый старт

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/fill/style.css"> <!-- иконки -->
<link rel="stylesheet" href="skui-theme.css"> <!-- токены — правьте под себя -->
<link rel="preload" href="skui-critical.css" as="style">
<link rel="stylesheet" href="skui-critical.css"> <!-- критичные стили -->
<link rel="stylesheet" href="skui-bc.css">       <!-- остальные компоненты -->
<script src="skui.js" defer></script>

<body class="sk-root">
  <button class="sk-btn sk-btn--primary"><i class="ph-fill ph-check"></i> Готово!</button>
  <div class="sk-card">Карточка готова</div>
</body>
```

`class="sk-root"` обязателен на `<body>` (или на корневом контейнере приложения) — он включает фон, типографику, кастомное выделение текста и скроллбар. Без него отдельные компоненты будут выглядеть нормально, но фирменный фон и базовые стили текста не применятся.

---

## Структура пакета

```
skui-kit/
├── dist/
│   ├── skui-theme.css   ← правьте этот файл, чтобы перекрасить кит
│   ├── skui-critical.css ← критичные стили, подключайте с preload
│   ├── skui-bc.css      ← полный слой компонентов поверх critical
│   ├── skui.css         ← compatibility entry через @import critical + bc
│   └── skui.js          ← поведение (модалки, табы, select и т.д.)
├── icons/                ← набор SVG-иконок (заглушки/референс)
└── demo/
    ├── index.html        ← полная витрина всех компонентов
    ├── auth.html          ← пример: окно авторизации SkuforID
    └── ai-chat.html        ← пример: интерфейс AI-чата с сайдбаром
```

**Зачем три CSS-файла.** `skui-theme.css` содержит только переменные (цвета, радиусы, шрифты, тени) — это единственное место, которое стоит редактировать для кастомизации. `skui-critical.css` содержит fallback-токены и критичные стили первого экрана, поэтому его стоит предварительно загрузить через `preload` и затем подключить как обычный stylesheet. `skui-bc.css` содержит остальной компонентный слой. `skui.css` оставлен как compatibility entry через `@import` двух новых файлов для старых проектов.

---

## Дизайн-философия

SkUI Kit — это не «дженерик soft-UI», а Claymorphism с конкретной авторской подписью:

- **Clay Seam (глиняный шов).** Каждая поверхность (`.sk-card`, `.sk-btn`, `.sk-clay`) получает двойной рельеф: мягкая внешняя тень + внутренний блик сверху-слева (`var(--sk-seam)`) — как край вылепленного вручную куска глины, а не идеально гладкий пластик.
- **Glaze Grain (зернистость).** SVG-шум через `::after` накладывается поверх карточек и поверхностей — материал не выглядит гладким экранным пластиком.
- **Ассиметричные скругления.** `--sk-radius-clay: 24px 28px 20px 32px` — фирменный «неидеальный» радиус вместо одинаковых углов.
- **Earth tones.** Тёплая терракотовая (clay), шалфейная (sage) и медовая (glaze) палитра — без синтетических неоновых или пурпурных акцентов.
- **Анимация — деталь, не обязательство.** Декоративные hover-эффекты (`.sk-card--hover`, `.sk-avatar-group`) можно глобально приглушить через `.sk-static` (см. [раздел ниже](#анимации-sk-static-и-sk-animated)) — система не настаивает на движении там, где оно не нужно.

---

## Кастомизация темы

Откройте `dist/skui-theme.css` — там всё структурировано по комментариям-секциям. Минимальный пример смены акцентного цвета:

```css
:root {
  --sk-clay-500: #2E7D6B;  /* было #E0785B */
  --sk-clay-700: #1F5A4C;
  --sk-clay-300: #5BA593;
}
```

Все компоненты, использующие акцент (кнопки, прогресс-бар, фокус-кольца, чекбоксы), перекрасятся автоматически — они ссылаются на переменные, а не на хардкод-значения.

**Шрифты.** По умолчанию: `Fraunces` (заголовки, тёплая вариативная антиква) + `Golos Text` (текст, нейтральный гротеск). Меняются так:

```css
:root {
  --sk-font-display: 'Your Display Font', serif;
  --sk-font-body: 'Your Body Font', sans-serif;
}
```

Не забудьте подключить сами шрифты (Google Fonts `<link>` или `@font-face`) — переменная только указывает, какое имя использовать.

В конце `skui-theme.css` есть закомментированные примеры альтернативных палитр («Шалфей», «Лаванда») — раскомментируйте нужную или используйте как референс для своей.

---

## Тёмная тема

Переключается атрибутом `data-sk-theme="dark"` на `<html>`:

```html
<button data-sk-theme-toggle>🌗</button>
```

Любой элемент с атрибутом `data-sk-theme-toggle` автоматически переключает тему при клике (обработчик навешивается `skui.js`). Переход — плавный crossfade через `View Transitions API` с фоллбеком на затемнение для браузеров без поддержки. Выбор сохраняется в `localStorage` и восстанавливается при следующей загрузке страницы.

Программно:
```js
document.documentElement.setAttribute('data-sk-theme', 'dark'); // включить
document.documentElement.removeAttribute('data-sk-theme');       // выключить (светлая по умолчанию)
```

---

## Каталог компонентов

### Типографика

```html
<h1 class="sk-h1">Заголовок H1</h1>
<h2 class="sk-h2">Заголовок H2</h2>
<h3 class="sk-h3">Заголовок H3</h3>
<h4 class="sk-h4">Заголовок H4</h4>
<h5 class="sk-h5">Заголовок H5 (на шрифте текста, не display)</h5>

<p class="sk-text-soft">Вторичный текст</p>
<p class="sk-text-faint">Подсказки, метаданные</p>
<code class="sk-mono">моноширинный текст</code>
```

Теги `<time>` и `<mark>` стилизуются автоматически внутри `.sk-root`, без класса:
```html
<p>Опубликовано <time datetime="2026-06-19">19 июня 2026</time>. <mark>Важная фраза.</mark></p>
```

### Кнопки

```html
<button class="sk-btn sk-btn--primary">Первичная</button>
<button class="sk-btn sk-btn--secondary">Вторичная</button>
<button class="sk-btn sk-btn--glaze">Glaze</button>
<button class="sk-btn sk-btn--danger">Опасная</button>
<button class="sk-btn">Нейтральная</button>
<button class="sk-btn sk-btn--ghost">Призрачная</button>
```

Размеры: `--sm`, `--lg` (по умолчанию средний). Форма: `--pill`, `--icon`, `--full` (100% ширины).

**Формальные вариации — у каждой свой контекст применения, не «разнообразие для вида»:**

| Класс | Когда использовать |
|---|---|
| `.sk-btn--clay` | **Единственная** hero-кнопка экрана (главный CTA лендинга, финальный шаг формы). Получает фирменный ассиметричный радиус. Не используйте на нескольких кнопках одного экрана одновременно — приём «особая форма = особая кнопка» работает только в единственном числе. |
| `.sk-btn--flat` | Повторяющаяся однотипная кнопка в списках/гридах (кнопка «Подробнее» в каждой из дюжины карточек каталога). Без объёмной тени — на множестве экземпляров рельеф каждой создавал бы визуальный шум. |
| `.sk-btn--outline` | Вторичное действие **рядом** с первичным в одной паре («Отмена» / «Удалить»). Заметнее, чем `--ghost`, но явно менее весомое, чем заливка. |

```html
<button class="sk-btn sk-btn--primary sk-btn--clay sk-btn--lg">Создать аккаунт</button>
<button class="sk-btn sk-btn--secondary sk-btn--flat">Подробнее</button>
<button class="sk-btn sk-btn--outline">Отмена</button>
```

### Карточки

```html
<div class="sk-card">
  <div class="sk-card__eyebrow">Метка раздела</div>
  <div class="sk-card__title">Заголовок карточки</div>
  <p class="sk-card__body">Описание.</p>
  <div class="sk-card__footer">
    <button class="sk-btn sk-btn--primary sk-btn--sm">Действие</button>
  </div>
</div>
```

- `.sk-card--flat` — без объёмной тени (плотные списки).
- `.sk-card--hover` — добавляет hover-подъём (см. [раздел про анимации](#анимации-sk-static-и-sk-animated) для глобального отключения).
- `.sk-card--glass` — полупрозрачная, с `backdrop-filter: blur` — для оверлеев на ярком/сложном фоне.

**`data-sk-clay-random`** — случайный мягкий радиус + лёгкий поворот ±1.5° для ощущения «вылепленного вручную». Это атрибут для **декоративных вспомогательных** блоков (бейджи-стикеры, акцентные аватары, миниатюры) — **не** для основных карточек-контейнеров текста в плотной сетке, там поворот сбивает выравнивание между соседями:

```html
<span class="sk-badge sk-badge--clay" data-sk-clay-random>Новинка</span>
<div class="sk-avatar sk-avatar--lg sk-avatar--clay" data-sk-clay-random>★</div>
```

### Поля ввода

Базовое поле — `.sk-input` / `.sk-textarea`, утопленный («вдавленный в глину») рельеф:

```html
<div class="sk-field">
  <label class="sk-label">Имя</label>
  <input class="sk-input" placeholder="Александр">
</div>
```

Любой `<input>` **без класса** внутри `.sk-root` автоматически получает базовый стиль кита — включая `type="date"`, `time"`, `"datetime-local"`, `"number"`, `"tel"`, `"search"`, `"url"`, `"color"` (см. ниже отдельный паттерн) и `"file"` (кастомная кнопка через `::file-selector-button`).

**Три формальные вариации полей — каждая под свой контекст:**

| Класс | Контекст |
|---|---|
| `.sk-input--underline` | Инлайн-редактирование (заголовок документа, переименование на месте) — поле должно сливаться с текстом до фокуса, полноценная «коробка» с тенью была бы избыточной. |
| `.sk-input--raised` | Поле на ярком/сложном фоне (hero-секция, шапка с фото) — утопленный рельеф там сливается с фоном; выпуклый читается как самостоятельный объект. |
| `.sk-input--pill` | Компактный поиск в навбаре/тулбаре, где соседние элементы (теги, табы) уже pill-формы. |

```html
<input class="sk-input sk-input--underline" value="Название документа">
<input class="sk-input sk-input--raised" placeholder="Поиск по сайту">
<input class="sk-input sk-input--pill" placeholder="Поиск…">
```

**`type="color"`** — нативный `::color-swatch` плохо стилизуется в Chrome (border-radius часто игнорируется), поэтому используется обёртка:

```html
<span class="sk-color-wrap">
  <input type="color" class="sk-color-input" value="#E0785B">
</span>
```

Пока цвет не выбран — показывается иконка палитры. После выбора — заливка цветом + случайная (фиксируется один раз за сессию) органичная форма «пятна» через множественный `border-radius`, без острых углов.

### Select / Dropdown (полностью кастомный)

Нативный `<select>` практически не поддаётся единообразной стилизации — список опций рисуют ОС/браузер, и его вид невозможно привести к общему знаменателю между Chrome/Firefox/Safari. Поэтому SkUI Kit **полностью заменяет** `<select>` на кастомный UI.

Разметка для разработчика — обычный, привычный `<select>`, никакой новой синтаксической конструкции учить не нужно:

```html
<select class="sk-select" data-sk-dropdown>
  <option value="msk">Москва</option>
  <option value="spb" selected>Санкт-Петербург</option>
  <option value="ekb">Екатеринбург</option>
</select>
```

`skui.js` находит такие select'ы при загрузке страницы, визуально скрывает оригинал (он остаётся в DOM и участвует в отправке формы как обычно) и строит рядом кнопку-триггер + выпадающую панель в стиле кита. Выбор опции в кастомном UI синхронизируется с `select.value` и стреляет обычное событие `change` — весь код, слушающий `select.addEventListener('change', ...)`, продолжает работать без переписывания.

Поддержано: клавиатурная навигация (стрелки/Enter/Escape), авто-разворот панели вверх, если снизу не хватает места, и плейсхолдер через `data-sk-placeholder="Выберите…"` на самом `<select>`, если ни одна опция не выбрана.

Если JS по какой-то причине не выполнился — страница не ломается: пользователь увидит обычный select (он скрывается только после успешной замены).

### Чекбоксы, радио, свитчи, слайдер

```html
<label class="sk-form-group">
  <input type="checkbox" class="sk-checkbox" checked>
  <span>Квадратный чекбокс</span>
</label>

<label class="sk-form-group">
  <input type="radio" class="sk-radio" name="plan" checked>
  <span>Круглое радио</span>
</label>

<label class="sk-form-group">
  <input type="checkbox" class="sk-switch">
  <span>Переключатель</span>
</label>
```

Чекбоксы — **квадратные** (скругление 5px), радио — **круглые**: формы намеренно различаются, чтобы пользователь не путал «выбери один из» с «отметь любое количество».

**Слайдер** с автоматическим расчётом заполнения от `min`/`max` (поддерживает отрицательные диапазоны) и живым числовым значением:

```html
<div class="sk-slider-wrap">
  <div class="sk-slider-wrap__head">
    <label class="sk-label">Громкость</label>
    <span class="sk-slider-wrap__value">65</span>
  </div>
  <input type="range" class="sk-slider" min="0" max="100" value="65">
  <div class="sk-slider-wrap__bounds">
    <span data-sk-slider-min>0</span>
    <span data-sk-slider-max>100</span>
  </div>
</div>
```

Дорожка визуально заполняется до текущего значения, `.sk-slider-wrap__value` обновляется на каждый `input`-event — никакой дополнительной разметки сверх стандартных атрибутов `min`/`max`/`value` не требуется.

### Drag-and-drop зона

Отдельный компонент, не модификатор над обычным `input[type=file]` — drag-and-drop нуждается в большей кликабельной площади, подсказке и состоянии «наведения файла»:

```html
<label class="sk-dropzone">
  <input type="file" class="sk-dropzone__input" multiple>
  <span class="sk-dropzone__icon">⇪</span>
  <span class="sk-dropzone__title">Перетащите файлы сюда</span>
  <span class="sk-dropzone__hint">или нажмите, чтобы выбрать · до 10 МБ</span>
</label>
```

`skui.js` навешивает обработку `dragenter`/`dragover`/`dragleave`/`drop`, подсвечивает зону классом `.is-dragover` и прокидывает брошенные файлы в реальный `input` (форма получает их как обычно). Чтобы перехватить файлы своим кодом:

```js
window.skOnFilesDropped = function (files, zone) {
  console.log('Брошено файлов:', files.length);
};
```

`.sk-dropzone--compact` — горизонтальная компоновка для узких мест (сайдбар, модалка).

### File Preview

Карточка уже прикреплённого файла — отдельно от drag-and-drop зоны, показывает результат после того, как файл выбран:

```html
<div class="sk-file-list">
  <div class="sk-file-preview">
    <div class="sk-file-preview__icon"><img src="document-icon.svg"></div>
    <div class="sk-file-preview__info">
      <div class="sk-file-preview__name">Документ.pdf</div>
      <div class="sk-file-preview__meta">240 КБ</div>
    </div>
    <button class="sk-file-preview__remove">✕</button>
  </div>
</div>
```

Кнопка `.sk-file-preview__remove` удаляет свою карточку из DOM автоматически (обработчик навешан на `document`, работает и для добавленных позже превью). Для отображения прогресса загрузки добавьте `.sk-file-preview__progress` с дочерним `.sk-file-preview__progress-bar`:

```html
<div class="sk-file-preview">
  ...
  <div class="sk-file-preview__progress">
    <div class="sk-file-preview__progress-bar" style="width:64%;"></div>
  </div>
</div>
```

Вместо иконки можно показать миниатюру изображения через `.sk-file-preview__thumb` (`<img class="sk-file-preview__thumb" src="...">`).

### Бейджи

```html
<span class="sk-badge">Стандарт</span>
<span class="sk-badge sk-badge--sage">Sage</span>
<span class="sk-badge sk-badge--success">Успех</span>
<span class="sk-badge sk-badge--warning">Внимание</span>
<span class="sk-badge sk-badge--danger">Ошибка</span>
```

**Формальные вариации (форма, не только цвет) — у каждой свой контекст:**

| Класс | Контекст |
|---|---|
| `.sk-badge--clay` | Брендовый/акцентный лейбл на карточке продукта («Новинка», «Beta») — получает фирменный ассиметричный радиус вместо pill. |
| `.sk-badge--outline` | Тэги в **плотных** списках/таблицах (десятки строк) — контур не соревнуется за внимание со сплошной заливкой на каждой строке. |
| `.sk-badge--dot` | Статус в узкой колонке/мобильной карточке («в сети» / «не в сети») — точка-индикатор компактнее, чем закрашенный прямоугольник. |

```html
<span class="sk-badge sk-badge--clay">Новинка</span>
<span class="sk-badge sk-badge--outline sk-badge--sage">Vue</span>
<span class="sk-badge sk-badge--dot sk-badge--success">В сети</span>
```

### Аватары и группы аватаров

```html
<div class="sk-avatar">АЛ</div>
<div class="sk-avatar sk-avatar--lg sk-avatar--clay">АЛ</div>
<div class="sk-avatar"><img src="photo.jpg" alt=""></div>
```

Размеры: `--sm`, `--lg`, `--xl`. Цветовые варианты фона: `--clay`, `--sage` (по умолчанию — glaze).

**Группа аватаров** («кто в обсуждении») — перекрывающийся стек с лёгким подъёмом по hover:

```html
<div class="sk-avatar-group">
  <div class="sk-avatar sk-avatar--clay">АЛ</div>
  <div class="sk-avatar sk-avatar--sage">МА</div>
  <div class="sk-avatar">ИВ</div>
  <div class="sk-avatar-group__more">+5</div>
</div>
```

Если такая группа повторяется много раз на экране (например, в каждой строке таблицы «участники проекта») — добавьте `.sk-static`, чтобы убрать hover-анимацию: на повторяющихся элементах она превращается в шум, а не приятную деталь.

```html
<div class="sk-avatar-group sk-static">...</div>
```

### Навигация

**Navbar:**
```html
<nav class="sk-navbar">
  <a class="sk-navbar__brand" href="#">🜍 Бренд</a>
  <ul class="sk-navbar__links">
    <li><a href="#" class="is-active">Главная</a></li>
    <li><a href="#">О нас</a></li>
  </ul>
  <div class="sk-navbar__actions">
    <button class="sk-btn sk-btn--primary sk-btn--sm">Начать</button>
  </div>
</nav>
```

`.is-active` и `:hover` оформлены **по-разному и намеренно**: hover — лёгкий цветовой отклик без заливки (временное состояние), `.is-active` — заливка + рельеф (постоянное состояние «вы здесь»). Это сделано специально, чтобы наведение мышью на соседний пункт меню не читалось как «вот тут я нахожусь сейчас».

**Sidebar:**
```html
<nav class="sk-sidebar">
  <button class="sk-sidebar__item is-active">
    <img class="sk-sidebar__icon" src="icon.svg">
    <span class="sk-sidebar__label">Дашборд</span>
    <span class="sk-sidebar__count">3</span>
  </button>
  <hr class="sk-sidebar__sep">
  <button class="sk-sidebar__item">
    <img class="sk-sidebar__icon" src="icon.svg">
    <span class="sk-sidebar__label">Настройки</span>
  </button>
</nav>
```

**Tabs:**
```html
<div class="sk-tabs" data-sk-tabs>
  <button class="sk-tabs__btn is-active" data-sk-tab="t1">Профиль</button>
  <button class="sk-tabs__btn" data-sk-tab="t2">Настройки</button>
</div>
<div data-sk-tab-panel="t1">Контент 1</div>
<div data-sk-tab-panel="t2" hidden>Контент 2</div>
```

**Sticky-хэдер** (закрепляется при скролле):
```html
<div class="sk-sticky-header">
  <div class="sk-sticky-header__inner">
    <!-- содержимое навбара -->
  </div>
</div>
```
JS добавляет `.is-scrolled` (усиливает тень) после скролла на 8px.

**Готовый лейаут «сайдбар + контент»:**
```html
<div class="sk-layout">
  <aside class="sk-layout__sidebar sk-sidebar">...</aside>
  <main class="sk-layout__main">...</main>
</div>
```
Сайдбар по умолчанию **плавающий** — скроллится вместе со страницей в обычном потоке, не прикреплён к верху вьюпорта. Если нужно sticky-поведение (навигация по разделам длинной страницы документации, которая должна оставаться на виду) — добавьте `.sk-layout__sidebar--sticky`. На мобильных лейаут автоматически складывается в одну колонку.

### Menu

Контекстное меню на «три точки» — для действий над элементом (карточка файла, строка таблицы), не для навигации по сайту:

```html
<div class="sk-menu">
  <button class="sk-menu__trigger" data-sk-menu-trigger aria-label="Меню">
    <i class="ph-fill ph-dots-three"></i>
  </button>
  <div class="sk-menu__panel">
    <button class="sk-menu__item"><i class="ph-fill ph-pencil-simple"></i> Редактировать</button>
    <button class="sk-menu__item"><i class="ph-fill ph-share-network"></i> Поделиться</button>
    <hr class="sk-menu__sep">
    <button class="sk-menu__item sk-menu__item--danger"><i class="ph-fill ph-trash"></i> Удалить</button>
  </div>
</div>
```

Открытие/закрытие — клик по триггеру, клик вне, `Escape`, либо клик по любому `.sk-menu__item` (закрывает после выбора). Авто-flip вверх, если снизу не хватает места. На мобильных (`<640px`) панель **автоматически** превращается в bottom-sheet — выезжает снизу экрана целиком с затемнением фона, что удобнее для тача, чем мелкое меню у края пальца; никакой дополнительной разметки для этого не требуется, переключение полностью на CSS-медиазапросе.

### Модалки

```html
<button data-sk-open="my-modal">Открыть</button>

<div class="sk-modal-backdrop" id="my-modal">
  <div class="sk-modal">
    <button class="sk-modal__close" data-sk-close>✕</button>
    <h3 class="sk-h3">Заголовок</h3>
    <p>Содержимое.</p>
    <button data-sk-close class="sk-btn sk-btn--primary">Понятно</button>
  </div>
</div>
```

Открытие/закрытие управляется через `data-sk-open="id"` / `data-sk-close`, клик по затемнению или клавиша `Escape`. Скролл страницы блокируется автоматически на время, пока модалка открыта. Размеры: `.sk-modal--sm`, `.sk-modal--lg`.

Программно: `skModal.open('my-modal')`, `skModal.close('my-modal')`.

### Таблицы и списки

```html
<div class="sk-table-wrap">
  <table class="sk-table">
    <thead><tr><th>Имя</th><th>Статус</th></tr></thead>
    <tbody>
      <tr><td>Александр</td><td><span class="sk-badge sk-badge--success">Активен</span></td></tr>
    </tbody>
  </table>
</div>
```

```html
<ul class="sk-list">
  <li class="sk-list__item">
    <img class="sk-list__icon" src="icon.svg">
    <div>
      <div class="sk-list__title">Заголовок</div>
      <div class="sk-list__meta">Подпись</div>
    </div>
    <div class="sk-list__end"><button class="sk-btn sk-btn--sm">Открыть</button></div>
  </li>
</ul>
```

### Аккордеон

```html
<div class="sk-accordion">
  <div class="sk-accordion__item is-open">
    <button class="sk-accordion__trigger">Вопрос 1 <span class="sk-accordion__arrow">▾</span></button>
    <div class="sk-accordion__body"><div class="sk-accordion__inner">Ответ.</div></div>
  </div>
</div>
```

По умолчанию открыт только один пункт за раз (как радио). Добавьте `data-sk-multi` на `.sk-accordion`, чтобы разрешить несколько открытых одновременно.

### Алерты

```html
<div class="sk-alert sk-alert--success">
  <span class="sk-alert__icon">✓</span>
  <div class="sk-alert__body">
    <div class="sk-alert__title">Сохранено</div>
    Изменения применены.
  </div>
</div>
```
Варианты: `--success`, `--warning`, `--danger`, `--info`.

### Тултипы

```html
<span class="sk-tooltip">
  <button class="sk-btn sk-btn--sm">Кнопка</button>
  <span class="sk-tooltip__bubble">Подсказка</span>
</span>
```

Позиция **автоматически адаптируется** к свободному пространству на экране: по умолчанию тултип появляется сверху, но если сверху не хватает места до края вьюпорта — JS переключает его вниз, затем (если и там тесно) на правую/левую сторону. Пересчёт происходит при каждом hover/focus, поэтому реагирует на скролл и resize без отдельных слушателей.

### Прогресс-бар

```html
<div class="sk-progress-wrap">
  <div class="sk-progress__label"><span>Загрузка</span><span data-progress-value>0%</span></div>
  <div class="sk-progress" data-value="78"><div class="sk-progress__bar"></div></div>
</div>
```
`data-value` задаёт процент — JS сам проставит ширину `.sk-progress__bar` и текст в `[data-progress-value]`.

### Spin

Фирменный лоадер — толще обычного `.sk-spinner` и заметно **неровный** по толщине дуги (через `conic-gradient`), что даёт ощущение «вылепленного» кольца, а не идеального геометрического спиннера. Используйте для самостоятельных, заметных состояний загрузки (секция, карточка) — для мелкой инлайн-пометки внутри кнопки лучше подходит компактный `.sk-spinner`.

```html
<span class="sk-spin"></span>
<span class="sk-spin sk-spin--sm"></span>
<span class="sk-spin sk-spin--lg"></span>
```

### Skeleton

Плейсхолдер загрузки с анимацией перелива:

```html
<div class="sk-skeleton" style="width:100%;height:1.2rem;"></div>
<div class="sk-skeleton sk-skeleton--circle" style="width:3rem;height:3rem;"></div>
```

Готовый пресет «аватар + две строки текста» (карточка пользователя/комментария во время загрузки):

```html
<div class="sk-skeleton-row">
  <div class="sk-skeleton sk-skeleton-row__avatar sk-skeleton--circle"></div>
  <div class="sk-skeleton-row__lines">
    <div class="sk-skeleton"></div>
    <div class="sk-skeleton"></div>
  </div>
</div>
```

### Banner

Картинка задаётся CSS-переменной `--sk-banner-img`, а не тегом `<img>` — это даёт `background-position`/`size` из коробки без лишней разметки, и позволяет легко тонировать фото под палитру кита:

```html
<div class="sk-banner" style="--sk-banner-img:url('photo.jpg');">
  <div class="sk-banner__content">
    <h3 class="sk-banner__title">Заголовок</h3>
    <p class="sk-banner__text">Подпись поверх изображения.</p>
  </div>
</div>
```

Тёмный градиент-оверлей снизу для читаемости текста включён по умолчанию. Модификаторы:

| Класс | Назначение |
|---|---|
| `.sk-banner--tone` | Тонирует фото в терракотовый дуплекс (`background-blend-mode`) — изображение вписывается в палитру кита вместо чужеродного цветного пятна. |
| `.sk-banner--solid` | Без фото вообще — цветная градиентная плашка для анонсов/промо, когда изображения нет. |
| `.sk-banner--sm` / `.sk-banner--lg` | Высота баннера. |

### Loading Window

Полноэкранный preloader, видимый до полной готовности страницы. Должен быть **первым элементом `<body>`**, чтобы отрисоваться раньше остального контента:

```html
<body class="sk-root">
  <div class="sk-loading-window">
    <div class="sk-loading-window__logo">
      <img src="logo.svg" alt="">
      <!-- подходит любой формат: img, инлайн <svg>, анимированный svg —
           обёртка только центрирует содержимое строго по центру экрана -->
    </div>
  </div>
  <!-- остальная страница -->
</body>
```

`skui.js` сам скрывает окно плавным fade-out, когда страница полностью загрузилась (`window.load`), с минимальной задержкой показа ~350ms (чтобы preloader не мигал на быстрых соединениях). Если `.sk-loading-window` нет на странице — функция инициализации просто ничего не делает, без ошибок.

### Карусель

```html
<div class="sk-carousel sk-carousel--gallery">
  <div class="sk-carousel__track">
    <div class="sk-carousel__slide">...</div>
    <div class="sk-carousel__slide">...</div>
  </div>
  <button class="sk-carousel__arrow sk-carousel__arrow--prev">‹</button>
  <button class="sk-carousel__arrow sk-carousel__arrow--next">›</button>
  <div class="sk-carousel__controls">
    <button class="sk-carousel__dot is-active"></button>
    <button class="sk-carousel__dot"></button>
  </div>
</div>
```

Поддержаны одновременно: клик по стрелкам, клик по точкам, и драг/свайп мышью или тачем — все три способа навигации изолированы друг от друга через `pointer capture`, так что использование одного не блокирует другие ни на десктопе, ни на мобильных.

### Аудио/видео плеер

Полностью рабочий, без ручной сборки внутренней разметки — достаточно `data-src`:

```html
<!-- Видео -->
<div class="sk-player" data-src="video.mp4" data-poster="cover.jpg"></div>

<!-- Аудио -->
<div class="sk-player sk-player--audio"
     data-src="track.mp3"
     data-title="Название трека"
     data-artist="Исполнитель"
     data-cover="cover.jpg"></div>
```

`skui.js` сам строит `<video>`/`<audio>`, кнопку play/pause, перетаскиваемый таймлайн с видимой ручкой-маркером в конце прогресса (упрощённая архитектура: одна полоса прогресса с `::after`-ручкой, без отдельного слоя буферизации — для большинства случаев он избыточен), и счётчик времени. Play-кнопка использует фирменный ассиметричный радиус (не идеальный круг — это самый «дефолтный» паттерн плееров в вебе).

### Footer

```html
<footer class="sk-footer sk-container">
  <div class="sk-footer__grid">
    <div class="sk-footer__brand">
      <div class="sk-footer__logo">🜍 Бренд</div>
      <p class="sk-footer__tagline">Краткое описание.</p>
      <div class="sk-footer__social">
        <a href="#"><img src="icon.svg"></a>
      </div>
    </div>
    <div>
      <div class="sk-footer__col-title">Раздел</div>
      <ul class="sk-footer__links"><li><a href="#">Пункт</a></li></ul>
    </div>
  </div>
  <div class="sk-footer__bottom">
    <span>© 2026 Бренд</span>
    <div class="sk-footer__bottom-links"><a href="#">Лицензия</a></div>
  </div>
</footer>
```
Наследует фон страницы (не отдельный цветной блок) — стыкуется с остальными секциями. Для простых одностраничников можно использовать только `.sk-footer__bottom` без сетки колонок.

### Блок кода с подсветкой

```html
<div class="sk-codeblock" data-lang="js">
  <span class="sk-codeblock__lang">JS</span>
  <pre>const x = 42; // комментарий</pre>
</div>
```
Поддерживаемые `data-lang`: `js`, `css`, `html`, `json`. Подсветка применяется автоматически при загрузке страницы — никаких сторонних библиотек типа highlight.js не требуется.

### Тосты

```js
skToast('Сохранено успешно', 'success');
skToast('Ошибка загрузки', 'danger');
skToast('Просто уведомление'); // без variant — нейтральное
```
Варианты: `success`, `warning`, `danger`, `info`. Автоматически исчезает через 3.5 секунды или по клику.

### Иконки

SkUI Kit использует [Phosphor Icons](https://phosphoricons.com), вес **Fill**, как стандартный набор пиктограмм. Подключите CDN один раз в `<head>`:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/fill/style.css">
```

Дальше иконка — это обычный `<i>` с двумя классами: весом и именем:

```html
<i class="ph-fill ph-gear-six"></i>
<i class="ph-fill ph-share-network"></i>
<button class="sk-btn sk-btn--primary"><i class="ph-fill ph-plus"></i> Добавить</button>
```

Цвет наследуется через `currentColor` — управляется обычным `color` (как у любого текста), без `filter`-хаков на изображении. Размер — через `font-size`. Обёртка `.sk-icon` даёт готовые размерные пресеты:

```html
<span class="sk-icon sk-icon--lg sk-icon--clay"><i class="ph-fill ph-star"></i></span>
```
`.sk-icon--sm` / `.sk-icon--lg` / `.sk-icon--xl` — размер. `.sk-icon--clay` / `.sk-icon--soft` / `.sk-icon--faint` / `.sk-icon--on-light` — цвет.

**Важно:** не переопределяйте `font-family`/`font-weight`/`font-style` на самой иконке — это часть механизма веб-шрифта Phosphor, и переопределение сломает отрисовку глифа (превратит иконку в невидимый или неправильный символ).

**Зависимость от CDN.** Компонент аудио/видео плеера (`.sk-player`) использует Phosphor для play/pause-иконок внутри play-кнопки — если CDN не подключён, сама функция воспроизведения не пострадает, но кнопка будет без видимого глифа внутри. Подключайте CDN-ссылку выше на любой странице, где используется `.sk-player`.

---

## JS API

Всё ниже подключается автоматически при загрузке страницы через `skui.js` — слушатели навешиваются один раз на `document`, поэтому работают даже для динамически добавленных элементов (кроме компонентов, требующих построения при инициализации — карусель, плеер, select, dropzone, слайдер; для них при динамическом добавлении в DOM нужно повторно вызвать соответствующую функцию, см. ниже).

| Глобальная функция | Назначение |
|---|---|
| `skToast(message, variant?, duration?)` | Показать тост-уведомление |
| `skModal.open(id)` / `skModal.close(id)` | Открыть/закрыть модалку программно |
| `window.skOnFilesDropped(files, zone)` | Переопределите для своей обработки drag-and-drop |

Внутренние функции инициализации (на случай динамически добавленного контента — если вы вставили новый `<select data-sk-dropdown>` после загрузки страницы, вызовите её повторно вручную из консоли/своего скрипта при необходимости; они не экспортированы по умолчанию в `window`, но определены внутри замыкания и перезапускаются при `DOMContentLoaded`):

`initTheme`, `initModals`, `initTabs`, `initAccordion`, `initCarousels`, `initReveal`, `initCodeHighlight`, `initProgressBars`, `initClayRandom`, `initStickyHeader`, `initFilePreview`, `initDropzones`, `initTooltips`, `initDropdownSelects`, `initSliders`, `initColorInputs`, `initPlayers`, `initGalleryArrows`, `initNavMobile`.

---

## Анимации, `.sk-static` и `.sk-animated`

`prefers-reduced-motion: reduce` отключает анимацию **системно**, для всех пользователей с такой настройкой ОС. Классы ниже — это **ручной**, локальный контроль декоративной (не функциональной) анимации, выбранный под природу каждого конкретного компонента — а не один и тот же подход на всё подряд:

**Opt-OUT через `.sk-static`** — для компонентов, которые обычно **единичны** на экране: анимация включена по умолчанию, класс её глушит там, где конкретно у вас компонент всё же оказался в списке.

```html
<!-- Отключить подъём конкретной карточки -->
<div class="sk-card sk-card--hover sk-static">...</div>

<!-- Отключить для всех карточек внутри грида сразу -->
<div class="sk-grid sk-grid-4 sk-static">
  <div class="sk-card sk-card--hover">...</div>
  <div class="sk-card sk-card--hover">...</div>
  <!-- ...десятки карточек, без анимации на каждую -->
</div>
```
Поддержано на `.sk-card--hover`.

**Opt-IN через `.sk-animated`** — для компонентов, которые по природе **чаще повторяются** (списки участников, строки таблицы): статика по умолчанию, анимация — осознанное включение там, где компонент на экране единичен.

```html
<!-- Группа аватаров единична на экране (шапка обсуждения) — включаем подъём -->
<div class="sk-avatar-group sk-animated">...</div>
```
Поддержано на `.sk-avatar-group`.

В обоих случаях класс можно поставить на сам компонент или на любого родителя — оба варианта работают одинаково для пакетного управления через обёртку грида/списка.

Кнопки, чекбоксы, стрелки карусели, фокус-кольца — ни `.sk-static`, ни `.sk-animated` их не затрагивают: там реакция на hover/focus это функциональная обратная связь о кликабельности, а не декоративное украшение, и отключать её не нужно.

---

## Доступность

- Все интерактивные компоненты (кнопки, табы, аккордеон, карусель, select, sidebar) используют **`:focus-visible`**, а не `:focus` — обводка фокуса появляется только при навигации с клавиатуры (Tab), никогда по клику мышью/тачем.
- Кастомный select полностью доступен с клавиатуры (стрелки, Enter, Escape) и имеет `role="listbox"`/`aria-selected`/`aria-expanded`.
- Drag-and-drop зона остаётся доступной через обычный `<input type="file">`, обёрнутый в `<label>` — работает по Tab + Enter/Space без мыши.
- Цвета бейджей и алертов подобраны с контрастом, достаточным для основного текста на их фоне, включая тёмную тему.

---

## Адаптивность

Брейкпоинты: `1100px`, `860px`, `540px`, `380px`. Все компоненты (навбар → гамбургер, сетки → меньше колонок, отступы → плотнее) адаптируются автоматически без дополнительных классов. Тестировалось от 360px (компактный телефон) до широких десктопов.

---

## Готовые примеры

В папке `demo/`:

- **`index.html`** — полная витрина всех компонентов с живыми примерами.
- **`auth.html`** — экран авторизации «SkuforID» (email → пароль/регистрация → успех), демонстрирует многошаговую форму и соц-кнопки входа.
- **`ai-chat.html`** — интерфейс AI-чата: сайдбар с историей сообщений и кнопкой нового чата, композер с file-input, выбором модели и авто-resize textarea.

---

## Соглашения и анти-паттерны

Чтобы сайты на ките не выглядели как типовой «AI-дженерик» дизайн:

- **Не больше 2–3 акцентных цветов на одном экране.** Clay — основной, Sage/Glaze — для расстановки смысловых акцентов (категории, статусы), не «для красоты».
- **`.sk-btn--clay` — не более одной на экран.** Особая форма работает только как исключение.
- **Eyebrow-текст** (`.sk-card__eyebrow`) — без CAPS и широкого letter-spacing, с маленьким маркером-точкой вместо «воздуха».
- **Декоративные фоновые пятна** — если используете (как в demo hero), делайте их через `radial-gradient`, не через `border-radius: 50% + filter: blur()`: при обрезке родительским `overflow: hidden` сплошной круг с блюром даёт резкий, нечестный край; градиент затухает сам по себе.
- **Секции должны визуально стыковаться** — используйте `var(--sk-bg)`/`var(--sk-surface)` и стандартные `--sk-sp-*` отступы везде, а не вставляйте секцию с произвольным сторонним фоном/паддингом.
