/*!
 * SkUI Kit v1.0 — skui.js
 * Подключение: <script src="skui.js" defer></script>
 * Без зависимостей. Управление через data-атрибуты.
 */
(function () {
  'use strict';

  /* ========================================================
     1. ТЕМА — плавный переход через View Transitions API
        (с фоллбеком на CSS-фейд для браузеров без поддержки)
  ======================================================== */
  function applyTheme(isDark) {
    var html = document.documentElement;
    if (isDark) html.setAttribute('data-sk-theme', 'dark');
    else html.removeAttribute('data-sk-theme');
    try { localStorage.setItem('sk-theme', isDark ? 'dark' : 'light'); } catch (e) {}
  }

  function toggleThemeSmoothly() {
    var html = document.documentElement;
    var isDark = html.getAttribute('data-sk-theme') === 'dark';
    var next = !isDark;

    // Современные браузеры — мягкий crossfade всей страницы
    if (document.startViewTransition) {
      document.startViewTransition(function () { applyTheme(next); });
      return;
    }

    // Фоллбек: затемняем экран на мгновение, меняем тему, снимаем затемнение
    var veil = document.createElement('div');
    veil.style.cssText =
      'position:fixed;inset:0;z-index:9999;background:var(--sk-bg);opacity:0;' +
      'pointer-events:none;transition:opacity 180ms ease;';
    document.body.appendChild(veil);
    requestAnimationFrame(function () {
      veil.style.opacity = '1';
      setTimeout(function () {
        applyTheme(next);
        requestAnimationFrame(function () {
          veil.style.opacity = '0';
          setTimeout(function () { veil.remove(); }, 200);
        });
      }, 180);
    });
  }

  function initTheme() {
    var html = document.documentElement;
    var stored;
    try { stored = localStorage.getItem('sk-theme'); } catch (e) {}
    if (stored === 'dark') html.setAttribute('data-sk-theme', 'dark');
    else html.removeAttribute('data-sk-theme');

    document.addEventListener('click', function (e) {
      if (!e.target.closest('[data-sk-theme-toggle]')) return;
      toggleThemeSmoothly();
    });
  }

  /* ========================================================
     2. МОДАЛКИ — через opacity/visibility, не hidden
        data-sk-open="modal-id" — открыть
        data-sk-close — закрыть ближайший backdrop
        Клик по backdrop (не по .sk-modal) — закрыть
  ======================================================== */
  function openModal(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(backdrop) {
    if (!backdrop) return;
    backdrop.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function initModals() {
    document.addEventListener('click', function (e) {
      // открыть
      var opener = e.target.closest('[data-sk-open]');
      if (opener) { openModal(opener.getAttribute('data-sk-open')); return; }

      // закрыть по кнопке
      var closer = e.target.closest('[data-sk-close]');
      if (closer) { closeModal(closer.closest('.sk-modal-backdrop')); return; }

      // закрыть клик по backdrop (но не по содержимому)
      if (e.target.classList.contains('sk-modal-backdrop')) {
        closeModal(e.target);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('.sk-modal-backdrop.is-open').forEach(closeModal);
    });

    // Публичный API
    window.skModal = { open: openModal, close: function (id) { closeModal(document.getElementById(id)); } };
  }

  /* ========================================================
     3. ТАБЫ
        data-sk-tabs на контейнере
        data-sk-tab="id" на кнопках
        data-sk-tab-panel="id" на панелях
  ======================================================== */
  function initTabs() {
    document.querySelectorAll('[data-sk-tabs]').forEach(function (group) {
      var buttons = group.querySelectorAll('[data-sk-tab]');
      var scope   = group.closest('[data-sk-tabs-scope]') || document;

      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var target = btn.getAttribute('data-sk-tab');
          buttons.forEach(function (b) { b.classList.remove('is-active'); });
          btn.classList.add('is-active');

          scope.querySelectorAll('[data-sk-tab-panel]').forEach(function (p) {
            var isTarget = p.getAttribute('data-sk-tab-panel') === target;
            p.hidden = !isTarget;
            if (isTarget) {
              p.classList.remove('sk-anim-fade');
              void p.offsetWidth; // reflow
              p.classList.add('sk-anim-fade');
            }
          });
        });
      });
    });
  }

  /* ========================================================
     4. АККОРДЕОН
        data-sk-accordion на контейнере
        .sk-accordion__trigger внутри .sk-accordion__item
  ======================================================== */
  function initAccordion() {
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('.sk-accordion__trigger');
      if (!trigger) return;
      var item = trigger.closest('.sk-accordion__item');
      if (!item) return;
      var isOpen = item.classList.contains('is-open');
      // закрыть остальные в той же группе если нет data-sk-multi
      var acc = item.closest('.sk-accordion');
      if (acc && !acc.hasAttribute('data-sk-multi')) {
        acc.querySelectorAll('.sk-accordion__item.is-open').forEach(function (i) {
          i.classList.remove('is-open');
        });
      }
      if (!isOpen) item.classList.add('is-open');
    });
  }

  /* ========================================================
     5. КАРУСЕЛЬ
        .sk-carousel обёртка
        .sk-carousel__track трек слайдов
        .sk-carousel__slide слайды
        .sk-carousel__controls + .sk-carousel__dot точки
  ======================================================== */
  function initCarousels() {
    document.querySelectorAll('.sk-carousel').forEach(function (car) {
      var track  = car.querySelector('.sk-carousel__track');
      var slides = car.querySelectorAll('.sk-carousel__slide');
      var dots   = car.querySelectorAll('.sk-carousel__dot');
      if (!track || !slides.length) return;

      var current = 0;

      function go(n) {
        current = (n + slides.length) % slides.length;
        track.style.transform = 'translateX(-' + (current * 100) + '%)';
        dots.forEach(function (d, i) {
          d.classList.toggle('is-active', i === current);
        });
      }

      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () { go(i); });
      });

      // Стрелки — независимые кнопки ВНЕ track, всегда работают кликом
      // на любом устройстве (мышь, тач, перо).
      var prev = car.querySelector('[data-sk-prev]');
      var next = car.querySelector('[data-sk-next]');
      if (prev) prev.addEventListener('click', function (e) { e.stopPropagation(); go(current - 1); });
      if (next) next.addEventListener('click', function (e) { e.stopPropagation(); go(current + 1); });

      // Drag / Swipe по самому треку — изолирован от кнопок через
      // pointer capture, чтобы события мыши и тача не путались
      // и не блокировали клики по стрелкам.
      var dragging = false;
      var startX = 0;
      var deltaX = 0;
      var pointerId = null;

      track.addEventListener('pointerdown', function (e) {
        dragging = true;
        pointerId = e.pointerId;
        startX = e.clientX;
        deltaX = 0;
        track.style.transition = 'none';
        try { track.setPointerCapture(pointerId); } catch (err) {}
      });

      track.addEventListener('pointermove', function (e) {
        if (!dragging || e.pointerId !== pointerId) return;
        deltaX = e.clientX - startX;
        var pct = (deltaX / track.clientWidth) * 100;
        track.style.transform = 'translateX(calc(-' + (current * 100) + '% + ' + pct + '%))';
      });

      function endDrag(e) {
        if (!dragging) return;
        dragging = false;
        track.style.transition = '';
        try { track.releasePointerCapture(pointerId); } catch (err) {}

        var threshold = track.clientWidth * 0.15;
        if (Math.abs(deltaX) > threshold) {
          go(current + (deltaX < 0 ? 1 : -1));
        } else {
          go(current); // вернуть на место
        }
        deltaX = 0;
      }

      track.addEventListener('pointerup', endDrag);
      track.addEventListener('pointercancel', endDrag);
      track.addEventListener('pointerleave', function (e) {
        if (dragging) endDrag(e);
      });

      go(0);
    });
  }

  /* ========================================================
     6. СКРОЛЛ-REVEAL
        data-sk-reveal на элементе
        data-sk-reveal-delay="200" задержка в мс
  ======================================================== */
  function initReveal() {
    if (!('IntersectionObserver' in window)) return;
    var items = document.querySelectorAll('[data-sk-reveal]');
    if (!items.length) return;

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var delay = Number(entry.target.getAttribute('data-sk-reveal-delay') || 0);
        var cls   = entry.target.getAttribute('data-sk-reveal-class') || 'sk-anim-rise';
        setTimeout(function () { entry.target.classList.add(cls); }, delay);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el) { obs.observe(el); });
  }

  /* ========================================================
     7. ТОСТЫ  — window.skToast(msg, variant, duration)
        variant: 'success' | 'warning' | 'danger' | 'info'
  ======================================================== */
  (function () {
    var host;

    function getHost() {
      if (!host) {
        host = document.createElement('div');
        host.style.cssText =
          'position:fixed;bottom:1.5rem;right:1.5rem;display:flex;flex-direction:column;gap:.6rem;z-index:999;pointer-events:none;';
        document.body.appendChild(host);
      }
      return host;
    }

    var borderColors = {
      success: 'var(--sk-success)',
      warning: 'var(--sk-warning)',
      danger:  'var(--sk-danger)',
      info:    'var(--sk-info)'
    };

    window.skToast = function (message, variant, duration) {
      var h = getHost();
      var el = document.createElement('div');
      el.className = 'sk-card sk-card--flat sk-anim-squish';
      el.style.cssText =
        'padding:.85rem 1.2rem;font-size:var(--sk-fs-sm);font-weight:600;' +
        'max-width:320px;pointer-events:auto;cursor:pointer;';
      if (variant && borderColors[variant]) {
        el.style.borderLeft = '4px solid ' + borderColors[variant];
      }
      el.textContent = message;
      h.appendChild(el);
      el.addEventListener('click', dismiss);

      var timer = setTimeout(dismiss, duration || 3500);
      function dismiss() {
        clearTimeout(timer);
        el.style.transition = 'opacity 280ms, transform 280ms';
        el.style.opacity = '0';
        el.style.transform = 'translateX(16px)';
        setTimeout(function () { el.remove(); }, 300);
      }
    };
  })();

  /* ========================================================
     8. АВТОПОДСВЕТКА КОДА — .sk-codeblock[data-lang]
        Поддержка: js, css, html, json
  ======================================================== */
  function highlight(code, lang) {
    // Безопасная HTML-экранизация
    function esc(s) {
      return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }
    var s = esc(code);

    if (lang === 'html') {
      // теги
      s = s.replace(/(&lt;\/?)([\w-]+)/g, '<span class="sk-tok-tag">$1$2</span>');
      // атрибуты
      s = s.replace(/([\w-]+)(=)(&quot;[^&]*&quot;)/g,
        '<span class="sk-tok-atr">$1</span><span class="sk-tok-pun">$2</span><span class="sk-tok-val">$3</span>');
      // комментарии
      s = s.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="sk-tok-cmt">$1</span>');
      return s;
    }
    if (lang === 'json') {
      s = s.replace(/(&quot;[^&]*&quot;)(\s*:)/g, '<span class="sk-tok-atr">$1</span>$2');
      s = s.replace(/:\s*(&quot;[^&]*&quot;)/g, ': <span class="sk-tok-val">$1</span>');
      s = s.replace(/:\s*(\d+\.?\d*)/g, ': <span class="sk-tok-num">$1</span>');
      s = s.replace(/:\s*(true|false|null)/g, ': <span class="sk-tok-kw">$1</span>');
      return s;
    }
    // JS / CSS / default
    var isCSS = lang === 'css';
    // Строки
    s = s.replace(/(&#39;[^&#]*&#39;|&quot;[^&]*&quot;|`[^`]*`)/g,
      '<span class="sk-tok-str">$1</span>');
    // Комментарии // …
    s = s.replace(/(\/\/[^\n]*)/g, '<span class="sk-tok-cmt">$1</span>');
    // Комментарии /* … */
    s = s.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="sk-tok-cmt">$1</span>');
    // Числа
    s = s.replace(/\b(\d+\.?\d*(?:px|rem|em|%|vh|vw|ms|s)?)\b/g, '<span class="sk-tok-num">$1</span>');
    if (isCSS) {
      // CSS свойства
      s = s.replace(/(--?[\w-]+)(\s*:)/g, '<span class="sk-tok-atr">$1</span>$2');
      // CSS at-rules
      s = s.replace(/(@[\w-]+)/g, '<span class="sk-tok-kw">$1</span>');
    } else {
      // JS ключевые слова
      s = s.replace(/\b(const|let|var|function|return|if|else|for|while|new|class|import|export|default|from|async|await|typeof|instanceof|this|null|undefined|true|false)\b/g,
        '<span class="sk-tok-kw">$1</span>');
      // Функции
      s = s.replace(/\b([\w$]+)(?=\s*\()/g, '<span class="sk-tok-fn">$1</span>');
    }
    return s;
  }

  function initCodeHighlight() {
    document.querySelectorAll('.sk-codeblock[data-lang]').forEach(function (block) {
      var lang = block.getAttribute('data-lang');
      var pre  = block.querySelector('pre') || block;
      var raw  = pre.textContent;
      pre.innerHTML = highlight(raw, lang);
    });
  }

  /* ========================================================
     9. ПРОГРЕСС-БАР — числовой label
        .sk-progress[data-value="64"] автоматически обновит
        .sk-progress__bar width и label
  ======================================================== */
  function initProgressBars() {
    document.querySelectorAll('.sk-progress[data-value]').forEach(function (bar) {
      var val  = Math.min(100, Math.max(0, parseInt(bar.getAttribute('data-value'), 10) || 0));
      var fill = bar.querySelector('.sk-progress__bar');
      if (fill) fill.style.width = val + '%';
      // если есть .sk-progress__label span[data-val]
      var lbl = bar.closest('.sk-progress-wrap');
      if (lbl) {
        var valEl = lbl.querySelector('[data-progress-value]');
        if (valEl) valEl.textContent = val + '%';
      }
    });
  }

  /* ========================================================
     11. CLAY RANDOM — фирменная "ручная лепка"
        data-sk-clay-random на элементе → получает случайный,
        но мягкий ассиметричный радиус (вариация --sk-radius-clay).
        ВАЖНО: поворот (rotate) сюда не входит специально —
        он ломает выравнивание текста между соседними карточками
        в гриде. Для декоративных элементов используйте явные
        классы .sk-tilt-l / .sk-tilt-r из CSS.
  ======================================================== */
  function initClayRandom() {
    document.querySelectorAll('[data-sk-clay-random]').forEach(function (el) {
      // Диапазон подобран так, чтобы форма всегда читалась как
      // "вариация" фирменного радиуса, а не случайный артефакт
      var base = 18, spread = 18;
      var r = function () { return base + Math.round(Math.random() * spread); };
      el.style.borderRadius = r() + 'px ' + r() + 'px ' + r() + 'px ' + r() + 'px';

      // Лёгкий случайный поворот ±1.5° — только для декоративных
      // вспомогательных блоков (см. комментарий в CSS), достаточно
      // мал, чтобы не выглядеть криво, но заметен как "ручная лепка"
      var angle = (Math.random() * 3 - 1.5).toFixed(2);
      el.style.transform = 'rotate(' + angle + 'deg)';
    });
  }

  /* ========================================================
     12. STICKY HEADER — добавляет .is-scrolled при скролле
        Работает на любом .sk-sticky-header
  ======================================================== */
  function initStickyHeader() {
    var headers = document.querySelectorAll('.sk-sticky-header');
    if (!headers.length) return;
    function onScroll() {
      var scrolled = window.scrollY > 8;
      headers.forEach(function (h) { h.classList.toggle('is-scrolled', scrolled); });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ========================================================
     13. FILE PREVIEW — удаление превью файла по кнопке
        [data-sk-file-remove] внутри .sk-file-preview
  ======================================================== */
  function initFilePreview() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.sk-file-preview__remove');
      if (!btn) return;
      var preview = btn.closest('.sk-file-preview');
      if (preview) preview.remove();
    });
  }

  /* ========================================================
     13.1 DROPZONE — визуальное состояние drag-and-drop
        .sk-dropzone оборачивает скрытый input[type=file].
        Браузер уже передаёт файлы через сам input при drop
        (это нативное поведение <label> + <input type=file>),
        здесь только подсветка состояния is-dragover и удобный
        колбэк window.skOnFilesDropped, если нужно своё поведение.
  ======================================================== */
  function initDropzones() {
    document.querySelectorAll('.sk-dropzone').forEach(function (zone) {
      var input = zone.querySelector('.sk-dropzone__input, input[type="file"]');
      var depth = 0; // считаем вложенные dragenter/dragleave, чтобы не мигало

      zone.addEventListener('dragenter', function (e) {
        e.preventDefault();
        depth++;
        zone.classList.add('is-dragover');
      });
      zone.addEventListener('dragover', function (e) { e.preventDefault(); });
      zone.addEventListener('dragleave', function () {
        depth = Math.max(0, depth - 1);
        if (depth === 0) zone.classList.remove('is-dragover');
      });
      zone.addEventListener('drop', function (e) {
        e.preventDefault();
        depth = 0;
        zone.classList.remove('is-dragover');
        var files = e.dataTransfer && e.dataTransfer.files;
        if (!files || !files.length) return;
        // Прокидываем файлы в реальный input, чтобы форма видела их обычным образом
        if (input) {
          try { input.files = files; } catch (err) { /* старые браузеры могут не поддержать */ }
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
        if (typeof window.skOnFilesDropped === 'function') {
          window.skOnFilesDropped(files, zone);
        }
      });
    });
  }

  /* ========================================================
     13.2 TOOLTIP — автовыбор стороны по свободному месту
        По умолчанию тултип целится сверху. Если сверху не
        хватает места до края вьюпорта — переключаем на низ,
        затем (если и там тесно) пробуем право/лево.
        Пересчитываем непосредственно перед показом (hover/focus),
        чтобы реагировать на скролл/resize без лишних слушателей.
  ======================================================== */
  function positionTooltip(tip) {
    var bubble = tip.querySelector('.sk-tooltip__bubble');
    if (!bubble) return;

    var tipRect    = tip.getBoundingClientRect();
    var bubbleRect = bubble.getBoundingClientRect();
    var margin     = 12; // комфортный отступ от края экрана
    var vw = window.innerWidth;
    var vh = window.innerHeight;

    var spaceTop    = tipRect.top;
    var spaceBottom = vh - tipRect.bottom;
    var spaceRight  = vw - tipRect.right;
    var spaceLeft   = tipRect.left;

    var needVertical   = bubbleRect.height + margin;
    var needHorizontal = bubbleRect.width + margin;

    var pos = 'top'; // по умолчанию
    if (spaceTop < needVertical) {
      if (spaceBottom >= needVertical) {
        pos = 'bottom';
      } else if (spaceRight >= needHorizontal) {
        pos = 'right';
      } else if (spaceLeft >= needHorizontal) {
        pos = 'left';
      } else {
        pos = 'bottom'; // совсем тесно со всех сторон — низ как наименьшее зло
      }
    }

    if (pos === 'top') tip.removeAttribute('data-sk-tooltip-pos');
    else tip.setAttribute('data-sk-tooltip-pos', pos);
  }

  function initTooltips() {
    document.querySelectorAll('.sk-tooltip').forEach(function (tip) {
      tip.addEventListener('mouseenter', function () { positionTooltip(tip); });
      tip.addEventListener('focusin',    function () { positionTooltip(tip); });
    });
  }

  /* ========================================================
     13.3 DROPDOWN SELECT — полная замена нативного <select>

     Разметка от разработчика — самый обычный select:
       <select class="sk-select" data-sk-dropdown>
         <option value="a">Вариант A</option>
         <option value="b" selected>Вариант B</option>
       </select>

     Эта функция находит такие select'ы и строит рядом кастомный
     UI (.sk-dropdown), скрывая оригинал (но не удаляя — он
     остаётся источником истины и участвует в отправке формы).
     Дальнейшие изменения (выбор опции) синхронизируются в обе
     стороны: клик в кастомном списке меняет .value нативного
     select и стреляет 'change', чтобы код пользователя, слушающий
     обычный select.addEventListener('change', ...), продолжил
     работать без переписывания.
  ======================================================== */
  function buildDropdownFor(select) {
    if (select.classList.contains('sk-select--replaced')) return; // уже обработан

    var options = Array.from(select.options);
    var dropdown = document.createElement('div');
    dropdown.className = 'sk-dropdown';

    var trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'sk-dropdown__trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');

    var valueLabel = document.createElement('span');
    valueLabel.className = 'sk-dropdown__value';

    var chevron = document.createElement('span');
    chevron.className = 'sk-dropdown__chevron';
    chevron.setAttribute('aria-hidden', 'true');

    trigger.appendChild(valueLabel);
    trigger.appendChild(chevron);

    var panel = document.createElement('div');
    panel.className = 'sk-dropdown__panel';
    panel.setAttribute('role', 'listbox');

    var checkSvg =
      '<svg class="sk-dropdown__option-check" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<path d="M5 12l4 4 10-10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    var optionEls = options.map(function (opt, i) {
      var el = document.createElement('div');
      el.className = 'sk-dropdown__option' + (opt.selected ? ' is-selected' : '');
      el.setAttribute('role', 'option');
      el.setAttribute('data-index', i);
      el.setAttribute('aria-selected', opt.selected ? 'true' : 'false');
      el.innerHTML = '<span>' + opt.textContent + '</span>' + checkSvg;
      panel.appendChild(el);
      return el;
    });

    if (!options.length) {
      var empty = document.createElement('div');
      empty.className = 'sk-dropdown__empty';
      empty.textContent = 'Нет доступных вариантов';
      panel.appendChild(empty);
    }

    dropdown.appendChild(trigger);
    dropdown.appendChild(panel);

    function syncTriggerLabel() {
      var selected = options[select.selectedIndex];
      if (selected && selected.textContent.trim()) {
        valueLabel.textContent = selected.textContent;
        valueLabel.classList.remove('sk-dropdown__value--placeholder');
      } else {
        valueLabel.textContent = select.getAttribute('data-sk-placeholder') || 'Выберите…';
        valueLabel.classList.add('sk-dropdown__value--placeholder');
      }
    }

    var highlighted = select.selectedIndex >= 0 ? select.selectedIndex : 0;

    function setHighlighted(i) {
      if (!optionEls.length) return;
      highlighted = (i + optionEls.length) % optionEls.length;
      optionEls.forEach(function (el, idx) {
        el.classList.toggle('is-highlighted', idx === highlighted);
      });
      optionEls[highlighted].scrollIntoView({ block: 'nearest' });
    }

    function selectIndex(i) {
      select.selectedIndex = i;
      optionEls.forEach(function (el, idx) {
        el.classList.toggle('is-selected', idx === i);
        el.setAttribute('aria-selected', idx === i ? 'true' : 'false');
      });
      syncTriggerLabel();
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function openPanel() {
      // Авто-flip: проверяем, хватает ли места снизу
      var rect = dropdown.getBoundingClientRect();
      var panelHeight = Math.min(280, optionEls.length * 40 + 8);
      var spaceBelow = window.innerHeight - rect.bottom;
      panel.classList.toggle('sk-dropdown__panel--up', spaceBelow < panelHeight && rect.top > panelHeight);

      dropdown.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      setHighlighted(select.selectedIndex >= 0 ? select.selectedIndex : 0);
    }
    function closePanel() {
      dropdown.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    }

    trigger.addEventListener('click', function () {
      if (dropdown.classList.contains('is-open')) closePanel();
      else openPanel();
    });

    optionEls.forEach(function (el, i) {
      el.addEventListener('click', function () {
        selectIndex(i);
        closePanel();
        trigger.focus();
      });
      el.addEventListener('mouseenter', function () { setHighlighted(i); });
    });

    trigger.addEventListener('keydown', function (e) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' ', 'Escape'].indexOf(e.key) === -1) return;
      e.preventDefault();
      var isOpen = dropdown.classList.contains('is-open');
      if (e.key === 'Escape') { closePanel(); return; }
      if (!isOpen) { openPanel(); return; }
      if (e.key === 'ArrowDown') setHighlighted(highlighted + 1);
      else if (e.key === 'ArrowUp') setHighlighted(highlighted - 1);
      else if (e.key === 'Enter' || e.key === ' ') { selectIndex(highlighted); closePanel(); }
    });

    document.addEventListener('click', function (e) {
      if (!dropdown.contains(e.target)) closePanel();
    });

    // Если нативный select меняется программно (например, форма
    // сброшена кодом пользователя) — держим кастомный UI в синхроне
    select.addEventListener('sk:sync', syncTriggerLabel);

    select.classList.add('sk-select--replaced');
    select.setAttribute('aria-hidden', 'true');
    select.setAttribute('tabindex', '-1');
    select.parentNode.insertBefore(dropdown, select.nextSibling);
    syncTriggerLabel();
  }

  function initDropdownSelects() {
    document.querySelectorAll('select[data-sk-dropdown]').forEach(buildDropdownFor);
  }

  /* ========================================================
     13.4 MENU — контекстное меню на "три точки"
        [data-sk-menu-trigger] внутри .sk-menu открывает/закрывает
        соседнюю .sk-menu__panel. Закрывается кликом вне, Escape,
        или кликом по любому .sk-menu__item внутри (типичное
        поведение — выбор пункта меню закрывает меню).
        На мобильных раскладка переключается в bottom-sheet
        полностью через CSS (см. media-запрос в skui.css) —
        JS логика открытия/закрытия одна и та же для обоих видов.
  ======================================================== */
  function initMenus() {
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-sk-menu-trigger]');
      if (trigger) {
        var menu = trigger.closest('.sk-menu');
        if (!menu) return;
        var willOpen = !menu.classList.contains('is-open');
        // закрыть остальные открытые меню на странице
        document.querySelectorAll('.sk-menu.is-open').forEach(function (m) {
          if (m !== menu) m.classList.remove('is-open');
        });
        if (willOpen) {
          var panel = menu.querySelector('.sk-menu__panel');
          if (panel && window.innerWidth > 640) {
            // авто-flip вверх, если снизу не хватает места (десктоп;
            // на мобильном bottom-sheet всегда у низа экрана — не нужно)
            var rect = menu.getBoundingClientRect();
            var panelHeight = panel.offsetHeight || 200;
            panel.classList.toggle('sk-menu__panel--up', window.innerHeight - rect.bottom < panelHeight);
          }
          menu.classList.add('is-open');
        } else {
          menu.classList.remove('is-open');
        }
        return;
      }

      // клик по пункту меню — закрыть после выбора
      if (e.target.closest('.sk-menu__item')) {
        var openMenu = e.target.closest('.sk-menu');
        if (openMenu) openMenu.classList.remove('is-open');
        return;
      }

      // клик вне любого открытого меню — закрыть все
      if (!e.target.closest('.sk-menu')) {
        document.querySelectorAll('.sk-menu.is-open').forEach(function (m) {
          m.classList.remove('is-open');
        });
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('.sk-menu.is-open').forEach(function (m) {
        m.classList.remove('is-open');
      });
    });
  }

  /* ========================================================
     13.5 SLIDER — заполненная дорожка + живое значение
        от min/max самого input[type=range], без доп. атрибутов.
        Если слайдер обёрнут в .sk-slider-wrap с дочерним
        .sk-slider-wrap__value — число обновляется автоматически.
  ======================================================== */
  function updateSliderFill(slider) {
    var min = parseFloat(slider.min || 0);
    var max = parseFloat(slider.max || 100);
    var val = parseFloat(slider.value || 0);
    var pct = max > min ? ((val - min) / (max - min)) * 100 : 0;
    slider.style.setProperty('--sk-slider-fill', pct + '%');
  }

  function initSliders() {
    document.querySelectorAll('.sk-slider').forEach(function (slider) {
      var wrap     = slider.closest('.sk-slider-wrap');
      var valueEl  = wrap ? wrap.querySelector('.sk-slider-wrap__value') : null;
      var minBound = wrap ? wrap.querySelector('[data-sk-slider-min]') : null;
      var maxBound = wrap ? wrap.querySelector('[data-sk-slider-max]') : null;

      if (minBound) minBound.textContent = slider.min || '0';
      if (maxBound) maxBound.textContent = slider.max || '100';

      function sync() {
        updateSliderFill(slider);
        if (valueEl) valueEl.textContent = slider.value;
      }

      slider.addEventListener('input', sync);
      sync();
    });
  }


  /* ========================================================
     13.6 COLOR INPUT — органичное "пятно" вместо квадрата
        Разметка:
          <span class="sk-color-wrap">
            <input type="color" class="sk-color-input">
          </span>
        Пока цвет не выбран — видна иконка палитры.
        После выбора — заливка цветом + случайная (один раз,
        при первом выборе) органичная форма пятна.
  ======================================================== */
  function randomBlobRadius() {
    // 4 значения по горизонтали + 4 по вертикали, мягкий диапазон 38–62%,
    // чтобы форма всегда читалась как "капля/пятно", а не квадрат/звезда
    function v() { return 38 + Math.round(Math.random() * 24); }
    return v() + '% ' + v() + '% ' + v() + '% ' + v() + '% / ' + v() + '% ' + v() + '% ' + v() + '% ' + v() + '%';
  }

  function initColorInputs() {
    document.querySelectorAll('.sk-color-wrap').forEach(function (wrap) {
      var input = wrap.querySelector('.sk-color-input');
      if (!input) return;

      function sync() {
        var hasValue = !!input.value && input.value !== '';
        wrap.classList.toggle('has-value', hasValue);
        if (hasValue) {
          wrap.style.setProperty('--sk-color-current', input.value);
          // форму "пятна" фиксируем один раз за выбор, чтобы не дёргалась
          // на каждое микро-изменение слайдера цвета внутри пикера
          if (!wrap.dataset.blobSet) {
            wrap.style.borderRadius = randomBlobRadius();
            wrap.dataset.blobSet = '1';
          }
        }
      }

      input.addEventListener('input', sync);
      input.addEventListener('change', sync);
      sync(); // если value уже стоит при загрузке страницы
    });
  }

  /* ========================================================
     14. КАСТОМНЫЙ ВИДЕО/АУДИО ПЛЕЕР — auto-build
        Минимальная разметка от пользователя:

          <div class="sk-player" data-src="video.mp4"></div>

        или для аудио:

          <div class="sk-player sk-player--audio"
               data-src="track.mp3"
               data-title="Название"
               data-artist="Исполнитель"
               data-cover="cover.jpg"></div>

        JS сам достраивает <video>/<audio>, кнопку play,
        таймлайн и подписи времени — никакой ручной разметки
        внутренних .sk-player__* элементов не требуется.
        Если внутренняя разметка уже есть (старый способ) —
        компонент её не трогает и просто навешивает поведение.
  ======================================================== */
  function formatTime(sec) {
    if (!isFinite(sec) || sec < 0) return '0:00';
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  // Иконки плеера через Phosphor (требует подключения CDN в <head>,
  // см. документацию — sk-player без подключённого Phosphor покажет
  // play/pause кнопку без видимого глифа внутри, но сама функция
  // воспроизведения не пострадает)
  var PLAY_ICON  = '<i class="ph-fill ph-play" style="color:#fff;"></i>';
  var PAUSE_ICON = '<i class="ph-fill ph-pause" style="color:#fff;"></i>';

  // Общий блок play-кнопка + таймлайн + время — одинаков для
  // видео и аудио, раньше дублировался в двух строителях разметки
  function controlsMarkup(playBtnStyle, timeStyle) {
    return '<button type="button" class="sk-player__play"' + (playBtnStyle ? ' style="' + playBtnStyle + '"' : '') + ' aria-label="Воспроизвести">' + PLAY_ICON + '</button>' +
      '<div class="sk-player__timeline"><div class="sk-player__progress"></div></div>' +
      '<span class="sk-player__time"' + (timeStyle ? ' style="' + timeStyle + '"' : '') + '>0:00 / 0:00</span>';
  }

  function buildVideoMarkup(player, src, poster) {
    player.innerHTML =
      '<div class="sk-player__media-wrap">' +
        '<video' + (poster ? ' poster="' + poster + '"' : '') + ' preload="metadata" playsinline>' +
          '<source src="' + src + '">' +
        '</video>' +
      '</div>' +
      '<div class="sk-player__controls">' + controlsMarkup() + '</div>';
  }

  function buildAudioMarkup(player, src, title, artist, cover) {
    player.innerHTML =
      '<audio preload="metadata"><source src="' + src + '"></audio>' +
      '<div class="sk-player__cover">' + (cover
        ? '<img src="' + cover + '" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">'
        : '🎵') + '</div>' +
      '<div class="sk-player__body">' +
        '<div class="sk-player__title">' + (title || 'Без названия') + '</div>' +
        '<div class="sk-player__artist">' + (artist || '') + '</div>' +
        '<div class="sk-player__row">' + controlsMarkup('width:2.2rem;height:2.2rem;', 'min-width:60px;') + '</div>' +
      '</div>';
  }

  function wirePlayer(player) {
    var media = player.querySelector('video, audio');
    if (!media) return;

    var playBtn   = player.querySelector('.sk-player__play');
    var timeline  = player.querySelector('.sk-player__timeline');
    var progress  = player.querySelector('.sk-player__progress');
    var timeLabel = player.querySelector('.sk-player__time');

    function render() {
      if (media.duration) {
        progress.style.width = (media.currentTime / media.duration * 100) + '%';
      }
      if (timeLabel) {
        timeLabel.textContent = formatTime(media.currentTime) + ' / ' + formatTime(media.duration);
      }
    }

    function setPlayIcon(isPlaying) {
      if (playBtn) playBtn.innerHTML = isPlaying ? PAUSE_ICON : PLAY_ICON;
    }

    if (playBtn) {
      playBtn.addEventListener('click', function () {
        if (media.paused) {
          var p = media.play();
          if (p && p.catch) p.catch(function () {});
        } else {
          media.pause();
        }
      });
    }
    media.addEventListener('play',  function () { setPlayIcon(true); });
    media.addEventListener('pause', function () { setPlayIcon(false); });
    media.addEventListener('ended', function () { setPlayIcon(false); });
    media.addEventListener('timeupdate', render);
    media.addEventListener('loadedmetadata', render);

    if (timeline) {
      function seek(clientX) {
        var rect = timeline.getBoundingClientRect();
        var ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
        if (media.duration) media.currentTime = ratio * media.duration;
        // timeupdate у браузеров троттлится (~250ms) — без явного
        // render() здесь ползунок визуально "застывал" бы пока не
        // отпустишь палец/кнопку мыши, хотя currentTime уже меняется
        render();
      }
      timeline.addEventListener('click', function (e) { seek(e.clientX); });
      // Драг по таймлайну (зажать и тащить)
      var seeking = false;
      timeline.addEventListener('pointerdown', function (e) {
        seeking = true; seek(e.clientX);
        timeline.classList.add('is-seeking');
        try { timeline.setPointerCapture(e.pointerId); } catch (err) {}
      });
      timeline.addEventListener('pointermove', function (e) { if (seeking) seek(e.clientX); });
      function stopSeeking() { seeking = false; timeline.classList.remove('is-seeking'); }
      timeline.addEventListener('pointerup', stopSeeking);
      timeline.addEventListener('pointercancel', stopSeeking);
    }
  }

  function initPlayers() {
    document.querySelectorAll('.sk-player').forEach(function (player) {
      // Авто-сборка: если указан data-src и внутри ещё нет <video>/<audio> —
      // строим разметку сами. Если разметка уже есть (старый ручной способ
      // или просто без data-src) — ничего не перестраиваем.
      var src = player.getAttribute('data-src');
      var alreadyBuilt = player.querySelector('video, audio');

      if (src && !alreadyBuilt) {
        if (player.classList.contains('sk-player--audio')) {
          buildAudioMarkup(
            player, src,
            player.getAttribute('data-title'),
            player.getAttribute('data-artist'),
            player.getAttribute('data-cover')
          );
        } else {
          buildVideoMarkup(player, src, player.getAttribute('data-poster'));
        }
      }

      wirePlayer(player);
    });
  }

  /* ========================================================
     15. ГАЛЕРЕЯ С СТРЕЛКАМИ — расширение initCarousels
        [data-sk-prev] / [data-sk-next] уже поддержаны там;
        здесь просто гарантируем подсветку точек при ресайзе
  ======================================================== */
  function initGalleryArrows() {
    document.querySelectorAll('.sk-carousel--gallery').forEach(function (car) {
      var prevBtn = car.querySelector('.sk-carousel__arrow--prev');
      var nextBtn = car.querySelector('.sk-carousel__arrow--next');
      if (prevBtn) prevBtn.setAttribute('data-sk-prev', '');
      if (nextBtn) nextBtn.setAttribute('data-sk-next', '');
    });
  }

  /* ========================================================
     10. NAVBAR MOBILE — гамбургер
  ======================================================== */
  function initNavMobile() {
    document.addEventListener('click', function (e) {
      var burger = e.target.closest('[data-sk-burger]');
      if (!burger) return;
      var nav = burger.closest('.sk-navbar');
      if (nav) nav.classList.toggle('sk-navbar--mobile-open');
    });
  }

  function findSidebarForToggle(toggle) {
    var target = toggle.getAttribute('data-sk-sidebar-toggle');
    if (target) {
      var byId = document.getElementById(target);
      if (byId) return byId;
      try {
        var bySelector = document.querySelector(target);
        if (bySelector) return bySelector;
      } catch (e) {}
    }
    return toggle.closest('.sk-sidebar');
  }

  function setSidebarCollapsed(sidebar, collapsed) {
    sidebar.classList.toggle('is-collapsed', collapsed);
    sidebar.querySelectorAll('[data-sk-sidebar-toggle]').forEach(function (toggle) {
      toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    });
  }

  function initSidebarCollapse() {
    document.querySelectorAll('.sk-sidebar').forEach(function (sidebar) {
      setSidebarCollapsed(sidebar, sidebar.classList.contains('is-collapsed'));
    });

    document.addEventListener('click', function (e) {
      var toggle = e.target.closest('[data-sk-sidebar-toggle]');
      if (!toggle) return;
      var sidebar = findSidebarForToggle(toggle);
      if (!sidebar) return;
      var collapsed = !sidebar.classList.contains('is-collapsed');
      setSidebarCollapsed(sidebar, collapsed);
      toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    });
  }

  /* ========================================================
     14.5 LOADING WINDOW — полноэкранный preloader

        Вызывается СРАЗУ при загрузке скрипта, не дожидаясь
        ready()/DOMContentLoaded — слушатель на window 'load'
        нужно навесить максимально рано, чтобы не упустить
        момент полной готовности страницы, если она наступит
        быстрее, чем выполнится остальная инициализация кита.
        Сам элемент .sk-loading-window виден с первой миллисекунды
        просто за счёт того, что он есть в HTML/CSS — JS отвечает
        только за момент и плавность его скрытия.
  ======================================================== */
  function initLoadingWindow() {
    var el = document.querySelector('.sk-loading-window');
    if (!el) return; // компонент не используется на странице — ничего не делаем

    var MIN_VISIBLE_MS = 350; // не даём preloader-у мигнуть на быстрых соединениях
    var shownAt = Date.now();

    function hide() {
      var elapsed = Date.now() - shownAt;
      var wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
      setTimeout(function () {
        // .is-hidden даёт opacity:0 + visibility:hidden + pointer-events:none —
        // этого достаточно, чтобы элемент не мешал кликам/скроллу;
        // не удаляем из DOM, чтобы компонент можно было показать
        // повторно программно (el.classList.remove('is-hidden')),
        // если это понадобится коду пользователя
        el.classList.add('is-hidden');
      }, wait);
    }

    if (document.readyState === 'complete') {
      hide();
    } else {
      window.addEventListener('load', hide);
    }
  }
  initLoadingWindow();

  /* ========================================================
     ИНИЦИАЛИЗАЦИЯ
  ======================================================== */
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    initTheme();
    initModals();
    initTabs();
    initAccordion();
    initGalleryArrows();
    initCarousels();
    initReveal();
    initCodeHighlight();
    initProgressBars();
    initNavMobile();
    initSidebarCollapse();
    initClayRandom();
    initStickyHeader();
    initFilePreview();
    initDropzones();
    initTooltips();
    initDropdownSelects();
    initMenus();
    initColorInputs();
    initSliders();
    initPlayers();
  });

})();
