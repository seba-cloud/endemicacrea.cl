/* ============================================================
   i18n.js — carga el contenido por idioma desde /content/<lang>.json
   y lo inyecta en el DOM vía atributos data-i18n / data-i18n-attr.
   Estructura técnica pensada para que el copy viva en archivos
   separados por idioma, no hardcodeado en el HTML.
   ============================================================ */

(function () {
  var SUPPORTED_LANGS = ['es', 'en', 'fr'];
  var DEFAULT_LANG = 'es';
  var STORAGE_KEY = 'endemicacrea_lang';
  var cache = {};

  function getPreferredLang() {
    var stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (stored && SUPPORTED_LANGS.indexOf(stored) !== -1) return stored;

    var browserLang = (navigator.language || '').slice(0, 2);
    if (SUPPORTED_LANGS.indexOf(browserLang) !== -1) return browserLang;

    return DEFAULT_LANG;
  }

  function getValueByPath(obj, path) {
    return path.split('.').reduce(function (acc, key) {
      return acc && acc[key] !== undefined ? acc[key] : undefined;
    }, obj);
  }

  function applyContent(content) {
    document.documentElement.lang = content.lang || DEFAULT_LANG;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var value = getValueByPath(content, key);
      if (typeof value === 'string') {
        el.textContent = value;
      }
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      var spec = el.getAttribute('data-i18n-attr');
      spec.split(';').forEach(function (pair) {
        var parts = pair.split(':');
        if (parts.length !== 2) return;
        var attr = parts[0].trim();
        var key = parts[1].trim();
        var value = getValueByPath(content, key);
        if (typeof value === 'string') el.setAttribute(attr, value);
      });
    });

    renderOficio(content.oficio);
    renderTrayectoria(content.trayectoria);
  }

  function renderOficio(oficio) {
    var grid = document.getElementById('oficio-grid');
    if (!grid || !oficio) return;
    grid.innerHTML = '';
    oficio.cards.forEach(function (card) {
      var div = document.createElement('div');
      div.className = 'oficio-card';
      var h3 = document.createElement('h3');
      h3.textContent = card.title;
      var p = document.createElement('p');
      p.textContent = card.text;
      div.appendChild(h3);
      div.appendChild(p);
      grid.appendChild(div);
    });
  }

  function renderTrayectoria(trayectoria) {
    var timeline = document.getElementById('timeline');
    if (!timeline || !trayectoria) return;
    timeline.innerHTML = '';
    trayectoria.items.forEach(function (item) {
      var li = document.createElement('li');
      var year = document.createElement('span');
      year.className = 'year';
      year.textContent = item.year;
      var h3 = document.createElement('h3');
      h3.textContent = item.title;
      var p = document.createElement('p');
      p.textContent = item.text;
      li.appendChild(year);
      li.appendChild(h3);
      li.appendChild(p);
      timeline.appendChild(li);
    });
  }

  function setActiveLangButton(lang) {
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  }

  function loadLang(lang) {
    if (cache[lang]) {
      applyContent(cache[lang]);
      setActiveLangButton(lang);
      return Promise.resolve(cache[lang]);
    }
    return fetch('content/' + lang + '.json')
      .then(function (res) {
        if (!res.ok) throw new Error('No se pudo cargar content/' + lang + '.json');
        return res.json();
      })
      .then(function (content) {
        cache[lang] = content;
        applyContent(content);
        setActiveLangButton(lang);
        try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
        return content;
      })
      .catch(function (err) {
        console.error(err);
      });
  }

  function initLangSwitch() {
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lang = btn.getAttribute('data-lang');
        loadLang(lang);
      });
    });
  }

  window.EndemicaI18n = { loadLang: loadLang, getCurrentContent: function (lang) { return cache[lang]; } };

  document.addEventListener('DOMContentLoaded', function () {
    initLangSwitch();
    loadLang(getPreferredLang());
  });
})();
