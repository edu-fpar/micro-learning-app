/*!
 * MicroLearn Studio — éditeur Markdown live + aperçu + versions + export.
 */
(function (MLS) {
  'use strict';

  var U = MLS.util, ui = MLS.ui;
  var $ = function (id) { return document.getElementById(id); };
  var LANG = MLS.i18n.uiLang();
  var T = MLS.i18n.translator(LANG);
  var esc = U.escapeHtml;

  MLS.i18n.apply(document, LANG);
  /** Couples d'exemples (même cours dans chaque langue) : utilisés quand on change la langue de l'interface. */
  function samplePairs() {
    var s = MLS.samples || {};
    return [{ fr: s.fr, en: s.en }, { fr: s.diagrams, en: s.diagramsEn }];
  }

  // Changer la langue de l'interface ne change pas le cours, sauf s'il s'agit d'un exemple et que l'utilisateur le souhaite.
  MLS.i18n.mountSwitcher($('lang-switch'), {
    beforeChange: function (newLang) {
      var cur = editor.value.trim();
      var pair = samplePairs().filter(function (p) {
        return Object.keys(p).some(function (l) { return p[l] && p[l].trim() === cur; });
      })[0];
      if (!pair || !pair[newLang] || pair[newLang].trim() === cur) return;
      var name = T('c.lang.' + newLang);
      return ui.confirm(T('s.switchCourse', { lang: name }), { ok: T('s.switchCourseYes', { lang: name }), cancel: T('s.switchCourseNo') })
        .then(function (ok) { if (ok) MLS.store.set('draft', pair[newLang]); });
    }
  });

  var editor = $('editor');
  var iframe = $('preview');
  var state = {
    formats: MLS.formats.all(),
    course: null,
    ready: false,
    cursorSlide: 0,
    previewSlide: 0,
    popup: null,
    errors: {}
  };

  var NEW_COURSE = {
    fr: [
      '---', 'title: "Mon nouveau module"', 'description: "Décrivez en une phrase ce que l’apprenant va découvrir."',
      'duration: 5 min', 'lang: fr', 'theme: violet', 'characters:', '  mentor: "Le Guide Pédagogique"', '---', '',
      '<!-- slide: format-title -->', '<!-- character-role: mentor -->', '<!-- character-expression: happy -->',
      '### Bienvenue !', 'Une phrase d’accroche pour donner envie.', '', '---', '',
      '<!-- slide: format-content -->', '### Première notion', 'Votre contenu ici…', ''
    ].join('\n'),
    en: [
      '---', 'title: "My new module"', 'description: "Describe in one sentence what the learner will discover."',
      'duration: 5 min', 'lang: en', 'theme: violet', 'characters:', '  mentor: "The Guide"', '---', '',
      '<!-- slide: format-title -->', '<!-- character-role: mentor -->', '<!-- character-expression: happy -->',
      '### Welcome!', 'A catchy sentence to spark curiosity.', '', '---', '',
      '<!-- slide: format-content -->', '### First concept', 'Your content here…', ''
    ].join('\n')
  };

  function sample() { return (MLS.samples && (MLS.samples[LANG] || MLS.samples.fr)) || MLS.sampleCourse; }
  function courseLang() { return MLS.i18n.pick((state.course && state.course.meta.lang) || 'fr'); }
  function savedBadge(key) { return '<span class="ok"><i class="bi bi-cloud-check"></i> ' + T(key) + '</span>'; }

  /* ------------------------------------------------------------ Aperçu */

  function formatsPayload() { return state.formats.map(function (f) { return MLS.formats.serialize(f); }); }

  function send(target, msg) { if (target) target.postMessage(msg, '*'); }

  function loadPreview(extra) {
    if (!state.ready) return;
    var msg = { type: 'mls:load', markdown: editor.value, formats: formatsPayload(), mode: 'preview', index: state.cursorSlide };
    if (!$('act-sync').checked) msg.index = state.previewSlide;
    Object.assign(msg, extra || {});
    state.errors = {};
    send(iframe.contentWindow, msg);
  }
  var loadPreviewSoon = U.debounce(loadPreview, 280);

  window.addEventListener('message', function (e) {
    var m = e.data || {};
    if (e.source === iframe.contentWindow) {
      if (m.type === 'mls:ready') { state.ready = true; loadPreview(); }
      else if (m.type === 'mls:slide') { state.previewSlide = m.index; }
      else if (m.type === 'mls:error') { state.errors[m.error.slide] = m.error; renderDiagnostics(); }
    } else if (state.popup && e.source === state.popup && m.type === 'mls:ready') {
      send(state.popup, { type: 'mls:load', markdown: state.popupMd || editor.value, formats: formatsPayload(), mode: 'standalone', welcome: true });
    }
  });

  /* ---------------------------------------------------------- Éditeur */

  function analyse() {
    state.course = MLS.parser.parseCourse(editor.value, { formats: state.formats.map(function (f) { return f.id; }) });
    renderDiagnostics();
    updateCursorInfo();
  }

  function renderDiagnostics() {
    var diag = $('diag');
    var items = (state.course ? state.course.warnings : []).map(function (w) {
      return { slide: w.slide, line: w.line, msg: w.code ? T('w.' + w.code, w.params) : w.msg };
    });
    Object.keys(state.errors).forEach(function (k) {
      var er = state.errors[k];
      var sl = state.course && state.course.slides[er.slide];
      items.push({ slide: er.slide, line: sl && sl.line, msg: T('s.errorOf', { kind: T('s.kind.' + er.kind), msg: er.message }) });
    });
    diag.innerHTML = '';
    items.forEach(function (w) {
      var b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = '<i class="bi bi-exclamation-triangle"></i><span>' + (w.slide >= 0 ? '<strong>' + esc(T('s.slideStatus', { n: w.slide + 1, total: state.course.slides.length })) + '</strong> · ' : '') + esc(w.msg) + '</span>';
      b.addEventListener('click', function () { if (w.line) gotoLine(w.line); });
      diag.appendChild(b);
    });
  }

  function gotoLine(line) {
    var lines = editor.value.split('\n');
    var pos = 0;
    for (var i = 0; i < line - 1 && i < lines.length; i++) pos += lines[i].length + 1;
    editor.focus();
    editor.setSelectionRange(pos, pos);
    var lh = parseFloat(getComputedStyle(editor).lineHeight) || 22;
    editor.scrollTop = Math.max(0, (line - 4) * lh);
    updateCursorInfo();
  }

  function updateCursorInfo() {
    if (!state.course) return;
    var pos = editor.selectionStart;
    var idx = MLS.parser.slideIndexAt(state.course, pos);
    var line = editor.value.slice(0, pos).split('\n').length;
    var n = state.course.slides.length;
    var sl = state.course.slides[idx];
    $('st-slide').innerHTML = '<i class="bi bi-collection"></i> ' + esc(T('s.slideStatus', { n: n ? idx + 1 : 0, total: n })) +
      (sl ? ' · <code>' + esc(sl.format) + '</code>' : '');
    $('st-line').textContent = T('s.line', { n: line });
    if (idx !== state.cursorSlide) {
      state.cursorSlide = idx;
      if ($('act-sync').checked && state.ready) send(iframe.contentWindow, { type: 'mls:goto', index: idx });
    }
  }

  var saveDraft = U.debounce(function () {
    var ok = MLS.store.set('draft', editor.value);
    $('st-saved').innerHTML = ok ? savedBadge('s.draftSaved')
      : '<span class="text-danger"><i class="bi bi-exclamation-octagon"></i> ' + T('s.storageFull') + '</span>';
  }, 600);

  editor.addEventListener('input', function () {
    $('st-saved').textContent = T('s.editing');
    analyse();
    loadPreviewSoon();
    saveDraft();
  });
  ['keyup', 'click', 'select'].forEach(function (ev) { editor.addEventListener(ev, updateCursorInfo); });
  ui.codeArea(editor);

  function setContent(md) {
    editor.value = md;
    state.cursorSlide = 0;
    editor.setSelectionRange(0, 0);
    editor.scrollTop = 0;
    analyse();
    loadPreview({ index: 0 });
    MLS.store.set('draft', md);
    $('st-saved').innerHTML = savedBadge('s.draftSaved');
  }

  /* ------------------------------------------------ Insertion de formats */

  function renderFormatMenu() {
    var menu = $('format-menu');
    menu.innerHTML = '<h6 class="dropdown-header">' + T('s.formatsHeader') + '</h6>';
    state.formats.forEach(function (f) {
      var name = MLS.formats.text(f, 'name', LANG), desc = MLS.formats.text(f, 'description', LANG);
      var b = document.createElement('button');
      b.className = 'dropdown-item';
      b.type = 'button';
      b.innerHTML = '<i class="bi ' + esc(f.icon || 'bi-square') + '"></i><span><strong>' + esc(name) + '</strong>' +
        (f.builtin ? '' : ' <span class="badge text-bg-warning">' + T('c.custom') + '</span>') +
        '<small>' + esc(desc.slice(0, 110)) + (desc.length > 110 ? '…' : '') + '</small></span>';
      b.addEventListener('click', function () { insertSlide(f); });
      menu.appendChild(b);
    });
    menu.insertAdjacentHTML('beforeend', '<div class="dropdown-divider"></div><a class="dropdown-item" href="lab.html"><i class="bi bi-palette"></i><span><strong>' +
      T('s.createFormat') + '</strong><small>' + T('s.openLab') + '</small></span></a>');
  }

  function insertSlide(f) {
    var v = editor.value;
    var pos = editor.selectionStart;
    // on insère après la fin de la slide courante, avec l'exemple dans la langue du cours
    var idx = state.course ? MLS.parser.slideIndexAt(state.course, pos) : 0;
    var sl = state.course && state.course.slides[idx];
    var at = sl ? sl.end : v.length;
    var block = '\n\n---\n\n<!-- slide: ' + f.id + ' -->\n' + (MLS.formats.text(f, 'sample', courseLang()) || '### Title') + '\n';
    var before = v.slice(0, at).replace(/\s+$/, '');
    var after = v.slice(at).replace(/^\s*/, '');
    var nv = before + block + (after ? '\n' + after : '');
    editor.value = nv;
    var caret = before.length + block.indexOf('<!--');
    editor.focus();
    editor.setSelectionRange(caret, caret);
    var lh = parseFloat(getComputedStyle(editor).lineHeight) || 22;
    editor.scrollTop = Math.max(0, (nv.slice(0, caret).split('\n').length - 4) * lh);
    editor.dispatchEvent(new Event('input'));
    updateCursorInfo();
    ui.toast('<i class="bi bi-plus-circle"></i> ' + esc(T('s.inserted', { name: MLS.formats.text(f, 'name', LANG) })), 'primary');
  }

  /* ---------------------------------------------------------- Versions */

  var snapshotModal = new bootstrap.Modal($('snapshot-modal'));

  function openSnapshot() {
    $('snapshot-label').value = T('s.snapDefault', { date: new Date().toLocaleString(T('c.dateLocale'), { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) });
    snapshotModal.show();
    setTimeout(function () { $('snapshot-label').select(); }, 300);
  }

  $('snapshot-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var v = MLS.versions.save(editor.value, $('snapshot-label').value.trim() || T('s.unnamed'));
    snapshotModal.hide();
    if (v) ui.toast('<i class="bi bi-camera"></i> ' + esc(T('s.snapSaved', { label: v.label })), 'success');
    else ui.toast(T('s.snapFull'), 'danger');
    renderHistory();
  });

  function renderHistory() {
    var list = MLS.versions.list();
    $('history-count').textContent = list.length;
    var box = $('history-list');
    if (!list.length) {
      box.innerHTML = '<div class="text-center text-secondary py-5"><i class="bi bi-inbox fs-1 d-block"></i>' + T('s.histEmpty') +
        '<br><small>' + T('s.histEmptyHint') + '</small></div>';
      return;
    }
    box.innerHTML = '';
    list.forEach(function (v) {
      var same = v.md === editor.value;
      var d = MLS.versions.diff(v.md, editor.value);
      var card = document.createElement('div');
      card.className = 'st-version' + (same ? ' current' : '');
      card.innerHTML =
        '<div class="d-flex align-items-start gap-2"><div class="flex-grow-1">' +
        '<div class="fw-semibold">' + (v.auto ? '<i class="bi bi-robot text-secondary" title="' + T('s.auto') + '"></i> ' : '') + esc(v.label) + '</div>' +
        '<div class="meta">' + ui.formatDate(v.date) + ' · ' + T('s.slidesN', { n: v.slides }) + ' · ' + esc(v.title || '') + '</div>' +
        '<div class="meta">' + (same ? '<span class="badge text-bg-primary">' + T('s.identical') + '</span>'
          : T('s.diff', { add: '<span class="diff-add">+' + d.added + '</span>', del: '<span class="diff-del">−' + d.removed + '</span>' })) + '</div>' +
        '</div></div>' +
        '<div class="d-flex gap-1 mt-2 flex-wrap">' +
        '<button class="btn btn-sm btn-outline-primary" data-a="restore"' + (same ? ' disabled' : '') + '><i class="bi bi-arrow-counterclockwise"></i> ' + T('s.restore') + '</button>' +
        '<button class="btn btn-sm btn-outline-secondary" data-a="preview" title="' + T('s.previewTab') + '" aria-label="' + T('s.previewTab') + '"><i class="bi bi-eye"></i></button>' +
        '<button class="btn btn-sm btn-outline-secondary" data-a="rename" title="' + T('s.rename') + '" aria-label="' + T('s.rename') + '"><i class="bi bi-pencil"></i></button>' +
        '<button class="btn btn-sm btn-outline-secondary" data-a="download" title="' + T('s.downloadThis') + '" aria-label="' + T('s.downloadThis') + '"><i class="bi bi-download"></i></button>' +
        '<button class="btn btn-sm btn-outline-danger ms-auto" data-a="delete" title="' + T('s.delete') + '" aria-label="' + T('s.delete') + '"><i class="bi bi-trash"></i></button></div>';
      card.addEventListener('click', function (e) {
        var b = e.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'restore') {
          ui.confirm(T('s.confirmRestore', { label: v.label }), { ok: T('s.restore') }).then(function (ok) {
            if (!ok) return;
            MLS.versions.save(editor.value, T('s.beforeRestore', { label: v.label }), { auto: true });
            setContent(v.md);
            renderHistory();
            ui.toast(T('s.restored'), 'success');
          });
        } else if (a === 'preview') {
          openPopup(v.md);
        } else if (a === 'rename') {
          ui.prompt(T('s.renamePrompt'), v.label, { ok: T('s.rename') }).then(function (nl) {
            if (nl && nl.trim()) { MLS.versions.rename(v.id, nl.trim()); renderHistory(); }
          });
        } else if (a === 'download') {
          ui.downloadText(v.md, (U.slugify(v.title) || 'course') + '-' + U.slugify(v.label) + '.md', 'text/markdown;charset=utf-8');
        } else if (a === 'delete') {
          ui.confirm(T('s.confirmDelete', { label: v.label }), { ok: T('s.delete'), danger: true }).then(function (ok) {
            if (ok) { MLS.versions.remove(v.id); renderHistory(); }
          });
        }
      });
      box.appendChild(card);
    });
  }
  $('history').addEventListener('show.bs.offcanvas', renderHistory);

  /* ---------------------------------------------------------- Fichiers */

  $('act-snapshot').addEventListener('click', openSnapshot);
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); openSnapshot(); }
  });

  $('act-new').addEventListener('click', function () {
    ui.confirm(T('s.confirmNew'), { ok: T('s.new') }).then(function (ok) {
      if (!ok) return;
      MLS.versions.save(editor.value, T('s.beforeNew'), { auto: true });
      setContent(NEW_COURSE[LANG] || NEW_COURSE.en);
      renderHistory();
    });
  });
  $('act-sample').addEventListener('click', function () {
    ui.confirm(T('s.confirmSample'), { ok: T('s.sample') }).then(function (ok) {
      if (!ok) return;
      MLS.versions.save(editor.value, T('s.beforeSample'), { auto: true });
      setContent(sample());
      renderHistory();
    });
  });
  function loadTest(md, label) {
    ui.confirm(T('s.confirmSampleDiagrams'), { ok: label }).then(function (ok) {
      if (!ok) return;
      MLS.versions.save(editor.value, T('s.beforeSample'), { auto: true });
      setContent(md);
      renderHistory();
    });
  }
  $('act-sample-diagrams').addEventListener('click', function () { loadTest(MLS.samples.diagrams, T('s.sampleDiagrams')); });
  $('act-sample-diagrams-en').addEventListener('click', function () { loadTest(MLS.samples.diagramsEn, T('s.sampleDiagramsEn')); });
  $('act-open').addEventListener('click', function () {
    ui.readFile('.md,.markdown,.txt,text/markdown').then(function (f) {
      MLS.versions.save(editor.value, T('s.beforeOpen', { name: f.name }), { auto: true });
      setContent(f.text.replace(/\r\n?/g, '\n'));
      renderHistory();
      ui.toast('<i class="bi bi-folder2-open"></i> ' + esc(T('s.opened', { name: f.name })), 'primary');
    });
  });
  $('act-save-md').addEventListener('click', function () {
    var c = state.course || MLS.parser.parseCourse(editor.value);
    ui.downloadText(editor.value, (U.slugify(c.title) || 'course') + '.md', 'text/markdown;charset=utf-8');
  });

  /* ---------------------------------------------------- Barre d'aperçu */

  var device = ui.devicePreview($('preview-area'), $('device'), $('device-label'));
  document.querySelectorAll('input[name="device"]').forEach(function (r) {
    r.addEventListener('change', function () { device.set(r.value); MLS.store.set('studio.device', r.value); });
  });
  var savedDevice = MLS.store.get('studio.device', 'desktop');
  var radio = document.querySelector('input[name="device"][value="' + savedDevice + '"]');
  if (radio) { radio.checked = true; device.set(savedDevice); }

  $('act-cast').addEventListener('click', function () { send(iframe.contentWindow, { type: 'mls:cast' }); });
  $('act-welcome').addEventListener('click', function () { send(iframe.contentWindow, { type: 'mls:welcome' }); });
  $('act-sync').addEventListener('change', function () { if (this.checked) send(iframe.contentWindow, { type: 'mls:goto', index: state.cursorSlide }); });

  function openPopup(md) {
    state.popupMd = md || null;
    state.popup = window.open('player.html', '_blank');
    if (!state.popup) ui.toast(T('s.popupBlocked'), 'warning');
  }
  $('act-popup').addEventListener('click', function () { openPopup(); });

  $('act-theme').addEventListener('click', function () {
    editor.classList.toggle('light');
    MLS.store.set('studio.lightEditor', editor.classList.contains('light'));
  });
  if (MLS.store.get('studio.lightEditor', false)) editor.classList.add('light');

  ui.splitter($('splitter'), $('main'), '--left', { storeKey: 'studio.split' });

  document.querySelectorAll('.st-mobile-tabs button').forEach(function (b) {
    b.addEventListener('click', function () {
      $('main').setAttribute('data-view', b.getAttribute('data-view'));
      document.querySelectorAll('.st-mobile-tabs button').forEach(function (x) {
        x.classList.toggle('active', x === b); x.setAttribute('aria-selected', x === b);
      });
      device.fit();
    });
  });

  /* ------------------------------------------------------------ Export */

  function exportSummary() {
    var c = state.course || MLS.parser.parseCourse(editor.value);
    var media = MLS.exporter.localMedia(editor.value);
    var nChars = (window.MLS_CHARACTERS && MLS_CHARACTERS.characters.length) || 0;
    var custom = state.formats.filter(function (f) { return !f.builtin || f.modified; }).length;
    var l = courseLang();
    $('export-summary').innerHTML = '<strong>' + esc(c.title) + '</strong> · ' +
      esc(T('s.exSummary', { slides: c.slides.length, roles: c.roles.length, chars: nChars, media: media.length })) +
      (custom ? esc(T('s.exCustom', { n: custom })) : '') +
      '<br>' + esc(T('s.exLang', { lang: l.toUpperCase() + ' · ' + MLS.i18n.names[l] })) +
      '<br><span class="text-secondary">' + T('s.exNoDeps') + '</span>';
    $('export-msg').innerHTML = '';
  }
  $('export-modal').addEventListener('show.bs.modal', exportSummary);

  $('export-go').addEventListener('click', function () {
    var btn = this;
    var type = document.querySelector('input[name="export-type"]:checked').value;
    var bar = $('export-progress');
    bar.hidden = false;
    bar.firstElementChild.style.width = '0';
    btn.disabled = true;
    $('export-msg').innerHTML = '<span class="text-secondary">' + T('s.exBuilding') + '</span>';
    MLS.exporter.build({
      type: type,
      markdown: editor.value,
      formats: state.formats,
      t: T,
      onProgress: function (p) { bar.firstElementChild.style.width = Math.round(p * 100) + '%'; }
    }).then(function (res) {
      MLS.exporter.download(res.blob, res.filename);
      $('export-msg').innerHTML = '<div class="text-success"><i class="bi bi-check-circle"></i> ' +
        esc(T('s.exDone', { file: res.filename, size: (res.blob.size / 1024 / 1024).toFixed(2) })) + '</div>' +
        res.warnings.map(function (w) { return '<div class="text-warning-emphasis"><i class="bi bi-exclamation-triangle"></i> ' + esc(w) + '</div>'; }).join('');
    }).catch(function (err) {
      $('export-msg').innerHTML = '<div class="text-danger"><i class="bi bi-x-octagon"></i> ' + esc(err.message) + '</div>';
    }).then(function () {
      btn.disabled = false;
      setTimeout(function () { bar.hidden = true; }, 800);
    });
  });

  /* ------------------------------------------- Formats modifiés ailleurs */

  window.addEventListener('storage', function (e) {
    if (e.key === 'mls.formats.custom') {
      state.formats = MLS.formats.all();
      renderFormatMenu();
      analyse();
      loadPreview();
      ui.toast('<i class="bi bi-palette"></i> ' + T('s.formatsUpdated'), 'primary');
    }
  });

  /* -------------------------------------------------------------- Init */

  renderFormatMenu();
  editor.value = MLS.store.get('draft', null) || sample();
  // on mémorise le cours affiché : changer la langue de l'interface ne le remplacera pas
  if (MLS.store.get('draft', null) == null) MLS.store.set('draft', editor.value);
  editor.setSelectionRange(0, 0);
  analyse();
  renderHistory();
  $('st-saved').innerHTML = savedBadge('s.draftLocal');
  // si l'iframe est déjà prête avant ce script, elle répondra à ce "hello"
  send(iframe.contentWindow, { type: 'mls:hello' });
})(window.MLS);
