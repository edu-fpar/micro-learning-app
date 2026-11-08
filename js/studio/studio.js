/*!
 * MicroLearn Studio — éditeur Markdown live + aperçu + versions + export.
 */
(function (MLS) {
  'use strict';

  var U = MLS.util, ui = MLS.ui;
  var $ = function (id) { return document.getElementById(id); };

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

  var NEW_COURSE = [
    '---',
    'title: "Mon nouveau module"',
    'description: "Décrivez en une phrase ce que l’apprenant va découvrir."',
    'duration: 5 min',
    'theme: violet',
    'characters:',
    '  mentor: "Le Guide Pédagogique"',
    '---',
    '',
    '<!-- slide: format-title -->',
    '<!-- character-role: mentor -->',
    '<!-- character-expression: happy -->',
    '### Bienvenue !',
    'Une phrase d’accroche pour donner envie.',
    '',
    '---',
    '',
    '<!-- slide: format-content -->',
    '### Première notion',
    'Votre contenu ici…',
    ''
  ].join('\n');

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
    var items = (state.course ? state.course.warnings : []).slice();
    Object.keys(state.errors).forEach(function (k) {
      var er = state.errors[k];
      var sl = state.course && state.course.slides[er.slide];
      items.push({ slide: er.slide, line: sl && sl.line, msg: 'Erreur de ' + er.kind + ' : ' + er.message });
    });
    diag.innerHTML = '';
    items.forEach(function (w) {
      var b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = '<i class="bi bi-exclamation-triangle"></i><span>' + (w.slide >= 0 ? '<strong>Slide ' + (w.slide + 1) + '</strong> · ' : '') + U.escapeHtml(w.msg) + '</span>';
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
    $('st-slide').innerHTML = '<i class="bi bi-collection"></i> Slide ' + (n ? idx + 1 : 0) + ' / ' + n +
      (sl ? ' · <code>' + U.escapeHtml(sl.format) + '</code>' : '');
    $('st-line').textContent = 'Ligne ' + line;
    if (idx !== state.cursorSlide) {
      state.cursorSlide = idx;
      if ($('act-sync').checked && state.ready) send(iframe.contentWindow, { type: 'mls:goto', index: idx });
    }
  }

  var saveDraft = U.debounce(function () {
    var ok = MLS.store.set('draft', editor.value);
    $('st-saved').innerHTML = ok ? '<span class="ok"><i class="bi bi-cloud-check"></i> Brouillon enregistré</span>'
      : '<span class="text-danger"><i class="bi bi-exclamation-octagon"></i> Stockage plein : exportez votre Markdown</span>';
  }, 600);

  editor.addEventListener('input', function () {
    $('st-saved').textContent = 'Modification…';
    analyse();
    loadPreviewSoon();
    saveDraft();
  });
  ['keyup', 'click', 'select'].forEach(function (ev) { editor.addEventListener(ev, updateCursorInfo); });
  ui.codeArea(editor);

  function setContent(md, opts) {
    editor.value = md;
    state.cursorSlide = 0;
    editor.setSelectionRange(0, 0);
    editor.scrollTop = 0;
    analyse();
    loadPreview({ index: 0 });
    MLS.store.set('draft', md);
    if (!(opts && opts.silent)) $('st-saved').innerHTML = '<span class="ok"><i class="bi bi-cloud-check"></i> Brouillon enregistré</span>';
  }

  /* ------------------------------------------------ Insertion de formats */

  function renderFormatMenu() {
    var menu = $('format-menu');
    menu.innerHTML = '<h6 class="dropdown-header">Formats disponibles</h6>';
    state.formats.forEach(function (f) {
      var b = document.createElement('button');
      b.className = 'dropdown-item';
      b.type = 'button';
      b.innerHTML = '<i class="bi ' + U.escapeHtml(f.icon || 'bi-square') + '"></i><span><strong>' + U.escapeHtml(f.name) + '</strong>' +
        (f.builtin ? '' : ' <span class="badge text-bg-warning">perso</span>') +
        '<small>' + U.escapeHtml((f.description || '').slice(0, 110)) + ((f.description || '').length > 110 ? '…' : '') + '</small></span>';
      b.addEventListener('click', function () { insertSlide(f); });
      menu.appendChild(b);
    });
    menu.insertAdjacentHTML('beforeend', '<div class="dropdown-divider"></div><a class="dropdown-item" href="lab.html"><i class="bi bi-palette"></i><span><strong>Créer un format…</strong><small>Ouvrir le Format Lab</small></span></a>');
  }

  function insertSlide(f) {
    var v = editor.value;
    var pos = editor.selectionStart;
    // on insère après la fin de la slide courante
    var idx = state.course ? MLS.parser.slideIndexAt(state.course, pos) : 0;
    var sl = state.course && state.course.slides[idx];
    var at = sl ? sl.end : v.length;
    var block = '\n\n---\n\n<!-- slide: ' + f.id + ' -->\n' + (f.sample || '### Titre') + '\n';
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
    ui.toast('<i class="bi bi-plus-circle"></i> Slide « ' + U.escapeHtml(f.name) + ' » insérée.', 'primary');
  }

  /* ---------------------------------------------------------- Versions */

  var snapshotModal = new bootstrap.Modal($('snapshot-modal'));

  function openSnapshot() {
    $('snapshot-label').value = 'Version du ' + new Date().toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    snapshotModal.show();
    setTimeout(function () { $('snapshot-label').select(); }, 300);
  }

  $('snapshot-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var v = MLS.versions.save(editor.value, $('snapshot-label').value.trim());
    snapshotModal.hide();
    if (v) ui.toast('<i class="bi bi-camera"></i> Version « ' + U.escapeHtml(v.label) + ' » enregistrée.', 'success');
    else ui.toast('Stockage du navigateur plein : supprimez d’anciennes versions.', 'danger');
    renderHistory();
  });

  function renderHistory() {
    var list = MLS.versions.list();
    $('history-count').textContent = list.length;
    var box = $('history-list');
    if (!list.length) { box.innerHTML = '<div class="text-center text-secondary py-5"><i class="bi bi-inbox fs-1 d-block"></i>Aucune version enregistrée.<br><small>Utilisez le bouton « Version » ou Ctrl+S.</small></div>'; return; }
    box.innerHTML = '';
    list.forEach(function (v) {
      var same = v.md === editor.value;
      var d = MLS.versions.diff(v.md, editor.value);
      var card = document.createElement('div');
      card.className = 'st-version' + (same ? ' current' : '');
      card.innerHTML =
        '<div class="d-flex align-items-start gap-2"><div class="flex-grow-1">' +
        '<div class="fw-semibold">' + (v.auto ? '<i class="bi bi-robot text-secondary" title="Automatique"></i> ' : '') + U.escapeHtml(v.label) + '</div>' +
        '<div class="meta">' + ui.formatDate(v.date) + ' · ' + v.slides + ' slides · ' + U.escapeHtml(v.title || '') + '</div>' +
        '<div class="meta">' + (same ? '<span class="badge text-bg-primary">identique au brouillon</span>'
          : 'Écart avec le brouillon : <span class="diff-add">+' + d.added + '</span> / <span class="diff-del">−' + d.removed + '</span> lignes') + '</div>' +
        '</div></div>' +
        '<div class="d-flex gap-1 mt-2 flex-wrap">' +
        '<button class="btn btn-sm btn-outline-primary" data-a="restore"' + (same ? ' disabled' : '') + '><i class="bi bi-arrow-counterclockwise"></i> Restaurer</button>' +
        '<button class="btn btn-sm btn-outline-secondary" data-a="preview" title="Aperçu dans un nouvel onglet"><i class="bi bi-eye"></i></button>' +
        '<button class="btn btn-sm btn-outline-secondary" data-a="rename" title="Renommer"><i class="bi bi-pencil"></i></button>' +
        '<button class="btn btn-sm btn-outline-secondary" data-a="download" title="Télécharger le .md"><i class="bi bi-download"></i></button>' +
        '<button class="btn btn-sm btn-outline-danger ms-auto" data-a="delete" title="Supprimer"><i class="bi bi-trash"></i></button></div>';
      card.addEventListener('click', function (e) {
        var b = e.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'restore') {
          if (!confirm('Restaurer « ' + v.label + ' » ? Le brouillon actuel sera d’abord sauvegardé automatiquement.')) return;
          MLS.versions.save(editor.value, 'Avant restauration de « ' + v.label + ' »', { auto: true });
          setContent(v.md);
          renderHistory();
          ui.toast('Version restaurée.', 'success');
        } else if (a === 'preview') {
          openPopup(v.md);
        } else if (a === 'rename') {
          var nl = prompt('Nouveau nom :', v.label);
          if (nl && nl.trim()) { MLS.versions.rename(v.id, nl.trim()); renderHistory(); }
        } else if (a === 'download') {
          ui.downloadText(v.md, (U.slugify(v.title) || 'cours') + '-' + U.slugify(v.label) + '.md', 'text/markdown;charset=utf-8');
        } else if (a === 'delete') {
          if (confirm('Supprimer définitivement la version « ' + v.label + ' » ?')) { MLS.versions.remove(v.id); renderHistory(); }
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
    if (!confirm('Créer un nouveau cours ? Le brouillon actuel sera sauvegardé dans l’historique.')) return;
    MLS.versions.save(editor.value, 'Avant nouveau cours', { auto: true });
    setContent(NEW_COURSE);
    renderHistory();
  });
  $('act-sample').addEventListener('click', function () {
    if (!confirm('Charger le cours d’exemple ? Le brouillon actuel sera sauvegardé dans l’historique.')) return;
    MLS.versions.save(editor.value, 'Avant chargement de l’exemple', { auto: true });
    setContent(MLS.sampleCourse);
    renderHistory();
  });
  $('act-open').addEventListener('click', function () {
    ui.readFile('.md,.markdown,.txt,text/markdown').then(function (f) {
      MLS.versions.save(editor.value, 'Avant ouverture de ' + f.name, { auto: true });
      setContent(f.text.replace(/\r\n?/g, '\n'));
      renderHistory();
      ui.toast('<i class="bi bi-folder2-open"></i> ' + U.escapeHtml(f.name) + ' ouvert.', 'primary');
    });
  });
  $('act-save-md').addEventListener('click', function () {
    var c = state.course || MLS.parser.parseCourse(editor.value);
    ui.downloadText(editor.value, (U.slugify(c.title) || 'cours') + '.md', 'text/markdown;charset=utf-8');
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
    if (!state.popup) ui.toast('Le navigateur a bloqué la fenêtre. Autorisez les pop-ups pour ce site.', 'warning');
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
    $('export-summary').innerHTML = '<strong>' + U.escapeHtml(c.title) + '</strong> · ' + c.slides.length + ' slides · ' +
      c.roles.length + ' rôle(s) · ' + nChars + ' personnages au choix · ' + media.length + ' image(s) locale(s)' +
      (custom ? ' · ' + custom + ' format(s) personnalisé(s)' : '') +
      '<br><span class="text-secondary">Aucune dépendance externe : Bootstrap, icônes, moteur Markdown et polices sont inclus.</span>';
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
    $('export-msg').innerHTML = '<span class="text-secondary">Assemblage du paquet…</span>';
    MLS.exporter.build({
      type: type,
      markdown: editor.value,
      formats: state.formats,
      onProgress: function (p) { bar.firstElementChild.style.width = Math.round(p * 100) + '%'; }
    }).then(function (res) {
      MLS.exporter.download(res.blob, res.filename);
      $('export-msg').innerHTML = '<div class="text-success"><i class="bi bi-check-circle"></i> <strong>' + U.escapeHtml(res.filename) + '</strong> généré (' +
        (res.blob.size / 1024 / 1024).toFixed(2) + ' Mo).</div>' +
        res.warnings.map(function (w) { return '<div class="text-warning-emphasis"><i class="bi bi-exclamation-triangle"></i> ' + U.escapeHtml(w) + '</div>'; }).join('');
    }).catch(function (err) {
      $('export-msg').innerHTML = '<div class="text-danger"><i class="bi bi-x-octagon"></i> ' + U.escapeHtml(err.message) + '</div>';
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
      ui.toast('<i class="bi bi-palette"></i> Formats mis à jour depuis le Format Lab.', 'primary');
    }
  });

  /* -------------------------------------------------------------- Init */

  renderFormatMenu();
  editor.value = MLS.store.get('draft', null) || MLS.sampleCourse;
  editor.setSelectionRange(0, 0);
  analyse();
  renderHistory();
  $('st-saved').innerHTML = '<span class="ok"><i class="bi bi-cloud-check"></i> Brouillon local</span>';
  // si l'iframe est déjà prête avant ce script, elle répondra à ce "hello"
  send(iframe.contentWindow, { type: 'mls:hello' });
})(window.MLS);
