/*!
 * Format Lab — création, modification et test des formats de slides.
 */
(function (MLS) {
  'use strict';

  var U = MLS.util, ui = MLS.ui;
  var $ = function (id) { return document.getElementById(id); };
  var LANG = MLS.i18n.uiLang();
  var T = MLS.i18n.translator(LANG);
  var esc = U.escapeHtml;
  var iframe = $('preview');
  var FIELDS = ['name', 'id', 'icon', 'category', 'description', 'template', 'css', 'js', 'sample'];

  MLS.i18n.apply(document, LANG);
  MLS.i18n.mountSwitcher($('lang-switch'));

  var state = { formats: [], originalId: null, draft: null, dirty: false, ready: false, i18nError: null };

  var BLANK = {
    id: 'format-mon-format',
    name: T('l.blankName'),
    icon: 'bi-magic',
    category: T('l.blankCategory'),
    description: T('l.blankDescription'),
    sample: T('l.blankSample'),
    i18n: { fr: { open: 'Ouvrir' }, en: { open: 'Open' } },
    template: [
      '<div class="mf mls-card mls-rise">',
      '  {{#title}}<h2 class="mls-title">{{{titleHtml}}}</h2>{{/title}}',
      '  {{#hasText}}<div class="mls-prose">{{{text}}}</div>{{/hasText}}',
      '  <ol class="mf-list">',
      '    {{#items}}<li>',
      '      <button type="button" class="mf-item" aria-expanded="false" title="{{t.open}}">{{{term}}}</button>',
      '      <div class="mf-detail mls-prose" hidden data-mls-speak="reveal">{{{def}}}</div>',
      '    </li>{{/items}}',
      '  </ol>',
      '</div>'
    ].join('\n'),
    css: [
      ':scope .mf-list { list-style: none; padding: 0; display: grid; gap: .6rem; }',
      ':scope .mf-item { width: 100%; text-align: left; border: 0; border-radius: 14px; padding: .8rem 1rem;',
      '  background: var(--mls-soft); color: var(--mls-ink); font-weight: 700; cursor: pointer; }',
      ':scope .mf-item[aria-expanded="true"] { background: var(--mls-primary); color: #fff; }',
      ':scope .mf-detail { padding: .6rem 1rem; }',
      '@container slide (max-width: 640px) {',
      '  :scope .mf-item { font-size: .95rem; }',
      '}'
    ].join('\n'),
    js: [
      "root.querySelectorAll('.mf-item').forEach(function (btn) {",
      "  btn.addEventListener('click', function () {",
      "    var open = btn.getAttribute('aria-expanded') !== 'true';",
      "    btn.setAttribute('aria-expanded', open);",
      "    btn.nextElementSibling.hidden = !open;",
      "    if (open) ctx.speak(btn.nextElementSibling);",
      "  });",
      "});"
    ].join('\n')
  };

  /* ------------------------------------------------------------ Liste */

  function refreshFormats() { state.formats = MLS.formats.all(); }

  function renderList() {
    var box = $('list');
    var cats = {};
    state.formats.forEach(function (f) { var c = MLS.formats.text(f, 'category', LANG) || '—'; (cats[c] = cats[c] || []).push(f); });
    box.innerHTML = '';
    Object.keys(cats).forEach(function (c) {
      box.insertAdjacentHTML('beforeend', '<div class="lab-cat">' + esc(c) + '</div>');
      cats[c].forEach(function (f) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'lab-item' + (f.id === state.originalId ? ' active' : '');
        var badge = !f.builtin ? '<span class="badge text-bg-warning">' + T('c.custom') + '</span>'
          : f.modified ? '<span class="badge text-bg-info">' + T('c.modified') + '</span>' : '';
        b.innerHTML = '<i class="bi ' + esc(f.icon || 'bi-square') + ' ico"></i><span>' + esc(MLS.formats.text(f, 'name', LANG)) + '</span>' + badge;
        b.title = f.id;
        b.addEventListener('click', function () { select(f.id); });
        box.appendChild(b);
      });
    });
  }

  /** Exécute fn tout de suite, ou après confirmation s'il y a des modifications non enregistrées. */
  function guard(fn, force) {
    if (force || !state.dirty) { fn(); return; }
    ui.confirm(T('l.confirmDiscard'), { danger: true }).then(function (ok) { if (ok) fn(); });
  }

  function select(id, force) {
    guard(function () {
      var f = state.formats.filter(function (x) { return x.id === id; })[0];
      if (f) loadDraft(f);
    }, force);
  }

  function loadDraft(f) {
    state.draft = U.clone(f);
    state.originalId = f.isNew ? null : f.id;
    state.i18nError = null;
    state.loadedSample = f.sample || '';
    FIELDS.forEach(function (k) { $('f-' + k).value = f[k] || ''; });
    $('f-i18n').value = JSON.stringify(f.i18n || { fr: {}, en: {} }, null, 2);
    $('f-icon-preview').className = 'bi ' + (f.icon || 'bi-square');
    $('act-reset').hidden = !(f.builtin && f.modified);
    $('act-delete').hidden = !!f.builtin || !state.originalId;
    setDirty(!!f.isNew);
    renderList();
    updateData();
    sendPreview();
    MLS.store.set('lab.last', f.id);
  }

  function setDirty(d) {
    state.dirty = d;
    $('dirty').innerHTML = d ? '<i class="bi bi-circle-fill"></i> ' + T('l.dirty') : '';
  }

  /* ---------------------------------------------------------- Édition */

  function readFields() {
    FIELDS.forEach(function (k) { state.draft[k] = $('f-' + k).value; });
    try {
      var v = $('f-i18n').value.trim();
      state.draft.i18n = v ? JSON.parse(v) : {};
      state.i18nError = null;
    } catch (e) {
      state.i18nError = e.message;
    }
    $('f-i18n').classList.toggle('is-invalid', !!state.i18nError);
  }

  FIELDS.concat(['i18n']).forEach(function (k) {
    var el = $('f-' + k);
    el.addEventListener('input', function () {
      readFields();
      setDirty(true);
      if (k === 'icon') $('f-icon-preview').className = 'bi ' + el.value;
      if (['template', 'css', 'js', 'sample', 'id', 'i18n'].indexOf(k) !== -1) { sendPreviewSoon(); updateDataSoon(); }
    });
    if (el.tagName === 'TEXTAREA') ui.codeArea(el);
  });

  /* ------------------------------------------------------------ Aperçu */

  function testLang() { return $('test-lang').value || LANG; }

  function testCourse() {
    var d = state.draft, l = testLang(), tt = MLS.i18n.translator(l);
    return '---\ntitle: "Format Lab · ' + String(MLS.formats.text(d, 'name', l) || '').replace(/"/g, "'") + '"\nlang: ' + l +
      '\ntheme: ' + $('theme').value +
      '\ncharacters:\n  mentor: "' + tt('l.testCharMentor') + '"\n  peer: "' + tt('l.testCharPeer') + '"\n---\n\n<!-- slide: ' +
      (d.id || 'format-sans-id') + ' -->\n' + sampleFor(d, l);
  }

  /** Exemple dans la langue de test si le champ n'a pas été modifié (sinon on teste ce qui est édité). */
  function sampleFor(d, l) {
    if (d.sample === state.loadedSample) return MLS.formats.text(d, 'sample', l) || d.sample || '';
    return d.sample || '';
  }

  function testFormats() {
    var d = MLS.formats.serialize(state.draft);
    var list = state.formats.filter(function (f) { return f.id !== state.originalId && f.id !== d.id; }).map(function (f) { return MLS.formats.serialize(f); });
    list.push(d);
    return list;
  }

  function sendPreview() {
    if (!state.ready || !state.draft) return;
    iframe.contentWindow.postMessage({ type: 'mls:load', markdown: testCourse(), formats: testFormats(), mode: 'lab', index: 0 }, '*');
  }
  var sendPreviewSoon = U.debounce(sendPreview, 350);

  window.addEventListener('message', function (e) {
    if (e.source !== iframe.contentWindow) return;
    if ((e.data || {}).type === 'mls:ready') { state.ready = true; sendPreview(); }
  });

  function updateData() {
    if (!state.draft) return;
    var out;
    try {
      var c = MLS.parser.parseCourse(testCourse());
      var data = MLS.parser.slideData(c.slides[0]);
      data.character = data.role ? { role: data.role, label: '…', name: '…', img: '…', alt: '…', expression: data.expression, avatar: '<img …>', nameTag: '<span …>' } : null;
      data.lines = data.quotes;
      data.course = { title: c.title, meta: '{…front-matter…}' };
      data.total = 1;
      data.lang = testLang();
      data.t = '{…' + T('l.tabI18n') + '…}';
      out = '/* ' + T('l.dataNote') + ' */\n' + JSON.stringify(data, null, 2);
    } catch (err) {
      out = 'Error: ' + err.message;
    }
    $('f-data').value = out;
  }
  var updateDataSoon = U.debounce(updateData, 400);

  /* ----------------------------------------------------------- Actions */

  function validate() {
    readFields();
    var d = state.draft;
    d.id = U.slugify(d.id);
    if (d.id.indexOf('format-') !== 0) d.id = 'format-' + d.id.replace(/^format-?/, '');
    $('f-id').value = d.id;
    if (!d.name.trim()) { ui.toast(T('l.needName'), 'warning'); return false; }
    if (d.id === 'format-') { ui.toast(T('l.badId'), 'warning'); return false; }
    if (state.i18nError) { ui.toast(esc(T('l.badI18n', { msg: state.i18nError })), 'danger'); return false; }
    var clash = state.formats.some(function (f) { return f.id === d.id && f.id !== state.originalId; });
    if (clash && !MLS.formats.isBuiltin(d.id)) { ui.toast(esc(T('l.idExists', { id: d.id })), 'warning'); return false; }
    if (clash && MLS.formats.isBuiltin(d.id) && !state.overrideOk) {
      ui.confirm(T('l.overrideBuiltin', { id: d.id })).then(function (ok) { if (ok) { state.overrideOk = true; save(); state.overrideOk = false; } });
      return false;
    }
    try { MLS.template.compile(d.template); } catch (err) { ui.toast(esc(T('l.badTemplate', { msg: err.message })), 'danger'); return false; }
    try { new Function('root', 'data', 'ctx', d.js || ''); } catch (err2) { ui.toast(esc(T('l.badScript', { msg: err2.message })), 'danger'); return false; }
    return true;
  }

  function save() {
    if (!state.draft || !validate()) return;
    var d = state.draft;
    // un format personnalisé renommé : on supprime l'ancien identifiant
    if (state.originalId && state.originalId !== d.id && !MLS.formats.isBuiltin(state.originalId)) MLS.formats.remove(state.originalId);
    if (!MLS.formats.save(d)) { ui.toast(T('l.saveFailed'), 'danger'); return; }
    refreshFormats();
    setDirty(false);
    loadDraft(MLS.formats.get(d.id));
    ui.toast('<i class="bi bi-check-circle"></i> ' + esc(T('l.saved', { name: d.name })), 'success');
  }

  $('act-save').addEventListener('click', save);
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); save(); }
  });

  $('act-new').addEventListener('click', function () {
    guard(function () {
      var f = U.clone(BLANK);
      var n = 1;
      while (state.formats.some(function (x) { return x.id === f.id; })) f.id = 'format-mon-format-' + (++n);
      f.builtin = false; f.isNew = true;
      loadDraft(f);
      $('f-name').focus();
    });
  });

  $('act-duplicate').addEventListener('click', function () {
    readFields();
    var f = U.clone(state.draft);
    f.id = f.id + '-copie';
    while (state.formats.some(function (x) { return x.id === f.id; })) f.id += '-2';
    f.name = f.name + T('l.copySuffix');
    if (f.i18n) Object.keys(f.i18n).forEach(function (l) { if (f.i18n[l] && f.i18n[l].$name) f.i18n[l].$name += MLS.i18n.t(l, 'l.copySuffix'); });
    f.builtin = false; f.modified = false; f.isNew = true;
    loadDraft(f);
    ui.toast(T('l.copyCreated'), 'primary');
  });

  $('act-reset').addEventListener('click', function () {
    ui.confirm(T('l.confirmReset'), { ok: T('l.reset'), danger: true }).then(function (ok) {
      if (!ok) return;
      MLS.formats.remove(state.originalId);
      refreshFormats();
      setDirty(false);
      loadDraft(MLS.formats.get(state.originalId));
      ui.toast(T('l.resetDone'), 'success');
    });
  });

  $('act-delete').addEventListener('click', function () {
    ui.confirm(T('l.confirmDelete', { name: state.draft.name }), { ok: T('l.delete'), danger: true }).then(function (ok) {
      if (!ok) return;
      MLS.formats.remove(state.originalId);
      refreshFormats();
      setDirty(false);
      loadDraft(state.formats[0]);
    });
  });

  function downloadJson(obj, name) {
    ui.downloadText(JSON.stringify(obj, null, 2), name, 'application/json;charset=utf-8');
  }

  $('act-export-one').addEventListener('click', function () {
    readFields();
    downloadJson({ generator: 'MicroLearn Format Lab', formats: [MLS.formats.serialize(state.draft)] }, state.draft.id + '.json');
  });

  $('act-export-all').addEventListener('click', function () {
    var list = state.formats.filter(function (f) { return !f.builtin || f.modified; }).map(function (f) { return MLS.formats.serialize(f); });
    if (!list.length) { ui.toast(T('l.nothingToExport'), 'warning'); return; }
    downloadJson({ generator: 'MicroLearn Format Lab', formats: list }, 'formats-microlearn.json');
  });

  $('act-import').addEventListener('click', function () {
    ui.readFile('.json,application/json').then(function (f) {
      try {
        var data = JSON.parse(f.text);
        var list = Array.isArray(data) ? data : data.formats ? data.formats : [data];
        var n = 0;
        list.forEach(function (fmt) {
          if (fmt && fmt.id && fmt.template != null) { MLS.formats.save(fmt); n++; }
        });
        refreshFormats();
        renderList();
        ui.toast(esc(T('l.imported', { n: n })), n ? 'success' : 'warning');
        if (n) select(list[0].id, true);
      } catch (err) {
        ui.toast(esc(T('l.badJson', { msg: err.message })), 'danger');
      }
    });
  });

  /* ------------------------------------------------------ Barre aperçu */

  var device = ui.devicePreview($('preview-area'), $('device'), $('device-label'));
  document.querySelectorAll('input[name="device"]').forEach(function (r) {
    r.addEventListener('change', function () { device.set(r.value); });
  });
  $('test-lang').innerHTML = MLS.i18n.langs().map(function (l) {
    return '<option value="' + l + '"' + (l === LANG ? ' selected' : '') + '>' + l.toUpperCase() + '</option>';
  }).join('');
  $('test-lang').addEventListener('change', function () { sendPreview(); updateData(); });
  $('theme').addEventListener('change', sendPreview);
  $('act-refresh').addEventListener('click', sendPreview);
  $('act-cast').addEventListener('click', function () { iframe.contentWindow.postMessage({ type: 'mls:cast' }, '*'); });
  ui.splitter($('splitter'), $('main'), '--right', { storeKey: 'lab.split', fromRight: true });

  document.querySelectorAll('.lab-tabs .nav-link').forEach(function (t) {
    t.addEventListener('click', function () {
      var p = t.getAttribute('data-panel');
      document.querySelectorAll('.lab-tabs .nav-link').forEach(function (x) { x.classList.toggle('active', x === t); x.setAttribute('aria-selected', x === t); });
      document.querySelectorAll('.lab-panel').forEach(function (x) { x.classList.toggle('active', x.getAttribute('data-panel') === p); });
      if (p === 'data') updateData();
    });
  });

  $('icon-help').addEventListener('click', function (e) {
    e.preventDefault();
    ui.toast(T('l.iconHelp'), 'dark');
  });

  window.addEventListener('beforeunload', function (e) { if (state.dirty) { e.preventDefault(); e.returnValue = ''; } });

  $('help').innerHTML = (MLS.labHelp && (MLS.labHelp[LANG] || MLS.labHelp.fr)) || '';

  /* -------------------------------------------------------------- Init */

  refreshFormats();
  var last = MLS.store.get('lab.last', null);
  var first = state.formats.filter(function (f) { return f.id === last; })[0] || state.formats[0];
  loadDraft(first);
  iframe.contentWindow.postMessage({ type: 'mls:hello' }, '*');
})(window.MLS);
