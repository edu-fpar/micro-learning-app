/*!
 * Format Lab — création, modification et test des formats de slides.
 */
(function (MLS) {
  'use strict';

  var U = MLS.util, ui = MLS.ui;
  var $ = function (id) { return document.getElementById(id); };
  var iframe = $('preview');
  var FIELDS = ['name', 'id', 'icon', 'category', 'description', 'template', 'css', 'js', 'sample'];

  var state = { formats: [], current: null, originalId: null, draft: null, dirty: false, ready: false };

  var BLANK = {
    id: 'format-mon-format',
    name: 'Mon format',
    icon: 'bi-magic',
    category: 'Personnalisés',
    description: 'Liste d’éléments dépliables. Syntaxe : « - **Élément** :: Détail ».',
    sample: '### Mon nouveau format\nUne courte introduction.\n\n- **Premier point** :: Le détail du premier point.\n- **Deuxième point** :: Le détail du deuxième point.\n- **Troisième point** :: Le détail du troisième point.',
    template: [
      '<div class="mf mls-card mls-rise">',
      '  {{#title}}<h2 class="mls-title">{{{titleHtml}}}</h2>{{/title}}',
      '  {{#hasText}}<div class="mls-prose">{{{text}}}</div>{{/hasText}}',
      '  <ol class="mf-list">',
      '    {{#items}}<li>',
      '      <button type="button" class="mf-item" aria-expanded="false">{{{term}}}</button>',
      '      <div class="mf-detail mls-prose" hidden>{{{def}}}</div>',
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
      "  });",
      "});"
    ].join('\n')
  };

  /* ------------------------------------------------------------ Liste */

  function refreshFormats() { state.formats = MLS.formats.all(); }

  function renderList() {
    var box = $('list');
    var cats = {};
    state.formats.forEach(function (f) { var c = f.category || 'Autres'; (cats[c] = cats[c] || []).push(f); });
    box.innerHTML = '';
    Object.keys(cats).forEach(function (c) {
      box.insertAdjacentHTML('beforeend', '<div class="lab-cat">' + U.escapeHtml(c) + '</div>');
      cats[c].forEach(function (f) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'lab-item' + (f.id === state.originalId ? ' active' : '');
        var badge = !f.builtin ? '<span class="badge text-bg-warning">perso</span>' : f.modified ? '<span class="badge text-bg-info">modifié</span>' : '';
        b.innerHTML = '<i class="bi ' + U.escapeHtml(f.icon || 'bi-square') + ' ico"></i><span>' + U.escapeHtml(f.name) + '</span>' + badge;
        b.title = f.id;
        b.addEventListener('click', function () { select(f.id); });
        box.appendChild(b);
      });
    });
  }

  function select(id, force) {
    if (!force && state.dirty && !confirm('Des modifications ne sont pas enregistrées. Les abandonner ?')) return;
    var f = state.formats.filter(function (x) { return x.id === id; })[0];
    if (!f) return;
    loadDraft(f);
  }

  function loadDraft(f) {
    state.draft = U.clone(f);
    state.originalId = f.isNew ? null : f.id;
    FIELDS.forEach(function (k) { $('f-' + k).value = f[k] || ''; });
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
    $('dirty').innerHTML = d ? '<i class="bi bi-circle-fill"></i> Modifications non enregistrées' : '';
  }

  /* ---------------------------------------------------------- Édition */

  function readFields() {
    FIELDS.forEach(function (k) { state.draft[k] = $('f-' + k).value; });
  }

  FIELDS.forEach(function (k) {
    var el = $('f-' + k);
    el.addEventListener('input', function () {
      readFields();
      setDirty(true);
      if (k === 'icon') $('f-icon-preview').className = 'bi ' + el.value;
      if (k === 'template' || k === 'css' || k === 'js' || k === 'sample' || k === 'id') { sendPreviewSoon(); updateDataSoon(); }
    });
    if (el.tagName === 'TEXTAREA') ui.codeArea(el);
  });

  /* ------------------------------------------------------------ Aperçu */

  function testCourse() {
    var d = state.draft;
    return '---\ntitle: "Format Lab · ' + String(d.name || '').replace(/"/g, "'") + '"\ntheme: ' + $('theme').value +
      '\ncharacters:\n  mentor: "Le Guide Pédagogique"\n  peer: "Le Collègue"\n---\n\n<!-- slide: ' + (d.id || 'format-sans-id') + ' -->\n' + (d.sample || '');
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
    var m = e.data || {};
    if (m.type === 'mls:ready') { state.ready = true; sendPreview(); }
    if (m.type === 'mls:error') { /* affiché directement dans la slide */ }
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
      out = '/* Données transmises au gabarit et au script (data) pour le Markdown d’exemple.\n' +
        '   « character », « lines[].character », « cast » sont résolus par le player selon le choix de l’apprenant. */\n' +
        JSON.stringify(data, null, 2);
    } catch (err) {
      out = 'Erreur : ' + err.message;
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
    if (!d.name.trim()) { ui.toast('Donnez un nom au format.', 'warning'); return false; }
    if (d.id === 'format-') { ui.toast('Identifiant invalide.', 'warning'); return false; }
    var clash = state.formats.some(function (f) { return f.id === d.id && f.id !== state.originalId; });
    if (clash && !MLS.formats.isBuiltin(d.id)) { ui.toast('L’identifiant « ' + d.id + ' » existe déjà.', 'warning'); return false; }
    if (clash && MLS.formats.isBuiltin(d.id) && !confirm('« ' + d.id + ' » est un format intégré : votre version le remplacera. Continuer ?')) return false;
    try { MLS.template.compile(d.template); } catch (err) { ui.toast('Gabarit invalide : ' + U.escapeHtml(err.message), 'danger'); return false; }
    try { new Function('root', 'data', 'ctx', d.js || ''); } catch (err2) { ui.toast('Script invalide : ' + U.escapeHtml(err2.message), 'danger'); return false; }
    return true;
  }

  function save() {
    if (!state.draft || !validate()) return;
    var d = state.draft;
    // un format personnalisé renommé : on supprime l'ancien identifiant
    if (state.originalId && state.originalId !== d.id && !MLS.formats.isBuiltin(state.originalId)) MLS.formats.remove(state.originalId);
    if (!MLS.formats.save(d)) { ui.toast('Impossible d’enregistrer (stockage plein ?).', 'danger'); return; }
    refreshFormats();
    setDirty(false);
    loadDraft(MLS.formats.get(d.id));
    ui.toast('<i class="bi bi-check-circle"></i> Format « ' + U.escapeHtml(d.name) + ' » enregistré. Il est disponible dans le Studio.', 'success');
  }

  $('act-save').addEventListener('click', save);
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); save(); }
  });

  $('act-new').addEventListener('click', function () {
    if (state.dirty && !confirm('Des modifications ne sont pas enregistrées. Les abandonner ?')) return;
    var f = U.clone(BLANK);
    var n = 1;
    while (state.formats.some(function (x) { return x.id === f.id; })) f.id = 'format-mon-format-' + (++n);
    f.builtin = false; f.isNew = true;
    loadDraft(f);
    $('f-name').focus();
  });

  $('act-duplicate').addEventListener('click', function () {
    readFields();
    var f = U.clone(state.draft);
    f.id = f.id + '-copie';
    while (state.formats.some(function (x) { return x.id === f.id; })) f.id += '-2';
    f.name = f.name + ' (copie)';
    f.builtin = false; f.modified = false; f.isNew = true;
    loadDraft(f);
    ui.toast('Copie créée : pensez à l’enregistrer.', 'primary');
  });

  $('act-reset').addEventListener('click', function () {
    if (!confirm('Revenir à la version d’origine de ce format intégré ?')) return;
    MLS.formats.remove(state.originalId);
    refreshFormats();
    setDirty(false);
    loadDraft(MLS.formats.get(state.originalId));
    ui.toast('Format réinitialisé.', 'success');
  });

  $('act-delete').addEventListener('click', function () {
    if (!confirm('Supprimer définitivement le format « ' + state.draft.name + ' » ? Les slides qui l’utilisent passeront en format Contenu.')) return;
    MLS.formats.remove(state.originalId);
    refreshFormats();
    setDirty(false);
    loadDraft(state.formats[0]);
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
    if (!list.length) { ui.toast('Aucun format personnalisé ou modifié à exporter.', 'warning'); return; }
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
        ui.toast(n + ' format(s) importé(s).', n ? 'success' : 'warning');
        if (n) select(list[0].id, true);
      } catch (err) {
        ui.toast('Fichier JSON invalide : ' + U.escapeHtml(err.message), 'danger');
      }
    });
  });

  /* ------------------------------------------------------ Barre aperçu */

  var device = ui.devicePreview($('preview-area'), $('device'), $('device-label'));
  document.querySelectorAll('input[name="device"]').forEach(function (r) {
    r.addEventListener('change', function () { device.set(r.value); });
  });
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
    ui.toast('Nom d’une icône Bootstrap Icons, ex. <code class="text-warning">bi-stars</code>, <code class="text-warning">bi-puzzle</code>, <code class="text-warning">bi-map</code>. Liste : icons.getbootstrap.com', 'dark');
  });

  window.addEventListener('beforeunload', function (e) { if (state.dirty) { e.preventDefault(); e.returnValue = ''; } });

  /* -------------------------------------------------------------- Aide */

  $('help').innerHTML = [
    '<h5>Anatomie d’un format</h5>',
    '<p>Un format est un modèle réutilisable composé de quatre éléments, tous enregistrés dans votre navigateur et embarqués dans les exports :</p>',
    '<ul><li><strong>Gabarit HTML</strong> — syntaxe type Mustache, alimentée par les <em>données</em> extraites du Markdown de la slide.</li>',
    '<li><strong>CSS</strong> — préfixez vos sélecteurs par <code>:scope</code> : ils ne s’appliqueront qu’aux slides de ce format.</li>',
    '<li><strong>Script</strong> — corps d’une fonction <code>function (root, data, ctx)</code> exécutée à l’affichage.</li>',
    '<li><strong>Markdown d’exemple</strong> — inséré par le bouton « Insérer une slide » du Studio.</li></ul>',
    '<h5 class="mt-4">Gabarit</h5>',
    '<table class="table table-sm"><tbody>',
    '<tr><td><code>{{title}}</code></td><td>valeur échappée</td></tr>',
    '<tr><td><code>{{{body}}}</code></td><td>HTML brut (contenu Markdown rendu)</td></tr>',
    '<tr><td><code>{{#items}}…{{/items}}</code></td><td>boucle sur une liste / bloc si la valeur est vraie</td></tr>',
    '<tr><td><code>{{^items}}…{{/items}}</code></td><td>bloc si vide ou faux</td></tr>',
    '<tr><td><code>{{character.name}}</code></td><td>chemin pointé ; <code>{{.}}</code> = élément courant</td></tr></tbody></table>',
    '<h5 class="mt-4">Données disponibles</h5>',
    '<table class="table table-sm"><tbody>',
    '<tr><td><code>title</code>, <code>titleHtml</code></td><td>premier titre de la slide</td></tr>',
    '<tr><td><code>body</code></td><td>tout le contenu (hors titre) en HTML</td></tr>',
    '<tr><td><code>content</code></td><td>idem sans les images isolées</td></tr>',
    '<tr><td><code>text</code></td><td>paragraphes hors listes, citations, images et sections</td></tr>',
    '<tr><td><code>items[]</code></td><td>éléments de listes : <code>term</code>, <code>def</code>, <code>extra</code> (découpés par <code>::</code>), <code>parts[]</code>, <code>html</code>, <code>termText</code>, <code>checked</code>/<code>task</code> (<code>[x]</code>), <code>index</code>, <code>number</code>, <code>sub</code></td></tr>',
    '<tr><td><code>quotes[]</code> / <code>lines[]</code></td><td>citations <code>&gt;</code> : <code>html</code>, <code>role</code>, <code>expression</code>, <code>character</code>, <code>side</code> (left/right)</td></tr>',
    '<tr><td><code>images[]</code>, <code>image</code></td><td><code>src</code>, <code>alt</code> des images seules sur leur ligne</td></tr>',
    '<tr><td><code>sections[]</code></td><td>découpage par sous-titres : <code>title</code>, <code>titleHtml</code>, <code>html</code></td></tr>',
    '<tr><td><code>character</code></td><td>personnage du rôle de la slide : <code>name</code>, <code>label</code>, <code>img</code>, <code>alt</code>, <code>avatar</code> (balise img prête), <code>nameTag</code></td></tr>',
    '<tr><td><code>meta</code></td><td>tous les commentaires <code>&lt;!-- clé: valeur --&gt;</code> de la slide</td></tr>',
    '<tr><td><code>id</code>, <code>index</code>, <code>number</code>, <code>total</code>, <code>course.title</code></td><td>contexte</td></tr>',
    '<tr><td><code>hasText</code>, <code>hasItems</code>, <code>hasImage</code>, <code>hasQuotes</code>, <code>multiple</code>, <code>correctCount</code></td><td>drapeaux pratiques</td></tr>',
    '</tbody></table>',
    '<p>L’onglet <strong>Données</strong> montre l’objet exact obtenu avec votre Markdown d’exemple.</p>',
    '<h5 class="mt-4">Script : l’objet <code>ctx</code></h5>',
    '<table class="table table-sm"><tbody>',
    '<tr><td><code>ctx.next()</code>, <code>ctx.prev()</code>, <code>ctx.goTo(i)</code></td><td>navigation</td></tr>',
    '<tr><td><code>ctx.state</code></td><td>objet persistant pour la slide (survit aux allers-retours)</td></tr>',
    '<tr><td><code>ctx.gradable()</code>, <code>ctx.score(bool)</code></td><td>déclare une activité notée et son résultat (écran de fin, SCORM)</td></tr>',
    '<tr><td><code>ctx.setExpression(img, "happy")</code></td><td>change l’expression d’un avatar (neutral, happy, encouraging, thinking, surprised, concerned)</td></tr>',
    '<tr><td><code>ctx.character(role, expr)</code></td><td>personnage choisi par l’apprenant pour un rôle</td></tr>',
    '<tr><td><code>ctx.onEnter(fn)</code>, <code>ctx.onLeave(fn)</code></td><td>quand la slide devient visible / est quittée</td></tr>',
    '<tr><td><code>ctx.announce(texte)</code></td><td>message lu par les lecteurs d’écran</td></tr>',
    '<tr><td><code>ctx.speak(el)</code></td><td>lit l’élément à voix haute si l’apprenant a choisi le mode « à l’ouverture » ou « automatique » (à appeler quand il ouvre un contenu)</td></tr>',
    '<tr><td><code>ctx.speakable(el)</code></td><td>ajoute l’icône d’écoute à un contenu inséré dynamiquement</td></tr>',
    '<tr><td><code>ctx.mode</code></td><td>"preview", "lab" ou "standalone"</td></tr></tbody></table>',
    '<h5 class="mt-4">Lecture à voix haute</h5>',
    '<p>Marquez les textes lisibles dans le gabarit : <code>data-mls-speak</code> (icône si le texte est long), <code>data-mls-speak="always"</code> (icône toujours), <code>data-mls-speak="reveal"</code> (pas d’icône, lu seulement via <code>ctx.speak</code>), <code>data-mls-speak-role="{{role}}"</code> (voix du personnage). <code>data-mls-nospeak</code> exclut un élément de la lecture. Ne placez pas <code>data-mls-speak</code> dans un bouton.</p>',
    '<h5 class="mt-4">Responsive</h5>',
    '<p>Chaque slide est un conteneur nommé <code>slide</code> : utilisez des <em>container queries</em> pour adapter votre format à la largeur réellement disponible.</p>',
    '<pre>@container slide (max-width: 640px) {\n  :scope .ma-grille { grid-template-columns: 1fr; }\n}</pre>',
    '<p>Classes utilitaires disponibles : <code>mls-card</code>, <code>mls-title</code>, <code>mls-prose</code>, <code>mls-btn</code>, <code>mls-btn-ghost</code>, <code>mls-eyebrow</code>, <code>mls-avatar</code>, <code>mls-rise</code> (animation d’entrée), <code>mls-muted</code>. ',
    'Variables CSS du thème : <code>--mls-primary</code>, <code>--mls-secondary</code>, <code>--mls-accent</code>, <code>--mls-ink</code>, <code>--mls-muted</code>, <code>--mls-surface</code>, <code>--mls-soft</code>, <code>--mls-radius</code>, <code>--mls-shadow</code>.</p>'
  ].join('');

  /* -------------------------------------------------------------- Init */

  refreshFormats();
  var last = MLS.store.get('lab.last', null);
  var first = state.formats.filter(function (f) { return f.id === last; })[0] || state.formats[0];
  loadDraft(first);
  iframe.contentWindow.postMessage({ type: 'mls:hello' }, '*');
})(window.MLS);
