/*!
 * Utilitaires d'interface partagés par le Studio et le Format Lab.
 */
(function (MLS) {
  'use strict';

  var DEVICES = {
    desktop: null,
    tablet: { w: 820, h: 1180, label: 'Tablette · 820 × 1180' },
    mobile: { w: 390, h: 844, label: 'Mobile · 390 × 844' }
  };

  MLS.ui = {
    toast: function (msg, variant) {
      var box = document.getElementById('toasts');
      if (!box) return;
      var t = document.createElement('div');
      t.className = 'toast align-items-center border-0 text-bg-' + (variant || 'dark');
      t.setAttribute('role', 'status');
      t.innerHTML = '<div class="d-flex"><div class="toast-body">' + msg + '</div>' +
        '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Fermer"></button></div>';
      box.appendChild(t);
      var bt = new bootstrap.Toast(t, { delay: 3200 });
      t.addEventListener('hidden.bs.toast', function () { t.remove(); });
      bt.show();
    },

    /** Gère le cadre "appareil" de l'aperçu (bureau / tablette / mobile) avec mise à l'échelle. */
    devicePreview: function (area, device, label) {
      var current = 'desktop';
      function fit() {
        var d = DEVICES[current];
        area.setAttribute('data-device', current);
        if (!d) { device.style.width = device.style.height = device.style.transform = ''; if (label) label.textContent = ''; return; }
        var pad = 48, bezel = 24;
        var s = Math.min(1, (area.clientWidth - pad) / (d.w + bezel), (area.clientHeight - pad) / (d.h + bezel));
        device.style.width = d.w + 'px';
        device.style.height = d.h + 'px';
        device.style.transform = 'scale(' + s.toFixed(3) + ')';
        if (label) label.textContent = d.label + (s < 1 ? ' · ' + Math.round(s * 100) + ' %' : '');
      }
      if (window.ResizeObserver) new ResizeObserver(fit).observe(area); else window.addEventListener('resize', fit);
      return {
        set: function (name) { current = DEVICES.hasOwnProperty(name) ? name : 'desktop'; fit(); },
        get: function () { return current; },
        fit: fit
      };
    },

    /** Séparateur redimensionnable entre deux colonnes (variable CSS sur le conteneur). */
    splitter: function (handle, container, cssVar, opts) {
      opts = opts || {};
      var dragging = false;
      var key = opts.storeKey;
      var saved = key ? MLS.store.get(key, null) : null;
      if (saved) container.style.setProperty(cssVar, saved);
      function setFromX(x) {
        var r = container.getBoundingClientRect();
        var pct = opts.fromRight ? (r.right - x) / r.width * 100 : (x - r.left - (opts.offset || 0)) / r.width * 100;
        pct = Math.max(20, Math.min(75, pct));
        container.style.setProperty(cssVar, pct.toFixed(1) + '%');
      }
      handle.addEventListener('pointerdown', function (e) {
        dragging = true; handle.setPointerCapture(e.pointerId);
        document.body.style.userSelect = 'none';
        container.querySelectorAll('iframe').forEach(function (f) { f.style.pointerEvents = 'none'; });
      });
      handle.addEventListener('pointermove', function (e) { if (dragging) setFromX(e.clientX); });
      handle.addEventListener('pointerup', function () {
        dragging = false; document.body.style.userSelect = '';
        container.querySelectorAll('iframe').forEach(function (f) { f.style.pointerEvents = ''; });
        if (key) MLS.store.set(key, container.style.getPropertyValue(cssVar));
      });
      handle.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        var cur = parseFloat(getComputedStyle(container).getPropertyValue(cssVar)) || 45;
        var delta = (e.key === 'ArrowLeft' ? -2 : 2) * (opts.fromRight ? -1 : 1);
        container.style.setProperty(cssVar, Math.max(20, Math.min(75, cur + delta)) + '%');
        if (key) MLS.store.set(key, container.style.getPropertyValue(cssVar));
      });
    },

    /** Améliorations d'une zone de code : tabulation, indentation conservée. */
    codeArea: function (ta) {
      ta.addEventListener('keydown', function (e) {
        if (e.key === 'Tab' && !e.ctrlKey && !e.altKey) {
          // Échap puis Tab permet de sortir du champ (accessibilité clavier)
          if (ta.dataset.escaped === '1') { ta.dataset.escaped = ''; return; }
          e.preventDefault();
          var s = ta.selectionStart, en = ta.selectionEnd;
          ta.setRangeText('  ', s, en, 'end');
          ta.dispatchEvent(new Event('input'));
        } else if (e.key === 'Escape') {
          ta.dataset.escaped = '1';
        } else if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
          var pos = ta.selectionStart;
          var lineStart = ta.value.lastIndexOf('\n', pos - 1) + 1;
          var indent = ta.value.slice(lineStart, pos).match(/^[ \t]*/)[0];
          if (indent) { e.preventDefault(); ta.setRangeText('\n' + indent, pos, ta.selectionEnd, 'end'); ta.dispatchEvent(new Event('input')); }
        } else {
          ta.dataset.escaped = '';
        }
      });
    },

    readFile: function (accept) {
      return new Promise(function (resolve) {
        var inp = document.createElement('input');
        inp.type = 'file';
        inp.accept = accept;
        inp.onchange = function () {
          var f = inp.files[0];
          if (!f) return;
          var r = new FileReader();
          r.onload = function () { resolve({ name: f.name, text: r.result }); };
          r.readAsText(f, 'utf-8');
        };
        inp.click();
      });
    },

    downloadText: function (text, filename, type) {
      MLS.exporter
        ? MLS.exporter.download(new Blob([text], { type: type || 'text/plain;charset=utf-8' }), filename)
        : (function () {
          var a = document.createElement('a');
          a.href = URL.createObjectURL(new Blob([text], { type: type || 'text/plain;charset=utf-8' }));
          a.download = filename; a.click();
        })();
    },

    formatDate: function (iso) {
      try {
        return new Date(iso).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      } catch (e) { return iso; }
    }
  };
})(window.MLS);
