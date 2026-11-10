/*!
 * MicroLearn — vue apprenant (view.html).
 * Ouvre un cours directement dans le player, sans le Studio, à partir :
 *   view.html?c=1234                code court → courses/id_1234_<nom>.md
 *   view.html?c=1234_accessibilite-fr  nom complet sans préfixe ni extension
 *   view.html?src=<url du .md>      fichier Markdown en ligne (même site ou site autorisant CORS)
 *   view.html#z=<…>                 cours complet compressé dans le lien (bouton « Lien vue apprenant » du Studio)
 *   view.html?md=<texte>            Markdown brut encodé dans l'URL (cours très courts)
 * Sans paramètre : page d'accueil (saisie d'un code ou d'une adresse, dépôt d'un fichier, liste des cours).
 */
(function (MLS) {
  'use strict';

  var COURSES_DIR = 'courses/';
  var esc = MLS.util.escapeHtml;
  var $ = function (id) { return document.getElementById(id); };
  var query = new URLSearchParams(location.search);
  var hash = new URLSearchParams(location.hash.replace(/^#/, ''));

  var STR = {
    fr: {
      title: 'Vue apprenant', intro: 'Ouvrez un module MicroLearn avec son code, l’adresse de son fichier Markdown, ou en déposant le fichier ici.',
      field: 'Code du cours ou adresse du fichier .md', placeholder: 'ex. 0001 ou https://…/cours.md', open: 'Ouvrir',
      drop: 'Glissez-déposez un fichier <strong>.md</strong> ou <u>parcourez</u>', available: 'Cours disponibles',
      studio: 'Créer un cours dans le Studio', docs: 'Documentation',
      errTitle: 'Impossible d’ouvrir ce cours', errCode: 'Aucun cours ne porte le code « {code} ».',
      errList: 'La liste des cours est introuvable : utilisez le nom complet du fichier (ex. ?c=1234_accessibilite-fr) ou ajoutez courses/index.json.',
      errFetch: 'Le fichier n’a pas pu être chargé ({detail}).', errCors: 'Le site qui héberge ce fichier refuse peut-être qu’on le lise depuis une autre page (CORS).',
      errFile: 'Cette page doit être ouverte depuis un serveur web (http://…), pas directement depuis le disque.',
      errLink: 'Ce lien est incomplet ou abîmé. Demandez à votre formateur ou formatrice de le copier à nouveau.',
      errUnsupported: 'Ce navigateur ne sait pas lire ce lien compressé. Essayez avec une version récente de Chrome, Edge, Firefox ou Safari.',
      errEmpty: 'Ce fichier ne contient aucune slide.', errBad: 'Ce fichier n’est pas un fichier Markdown (.md).', badCode: 'Ce code contient des caractères non autorisés.'
    },
    en: {
      title: 'Learner view', intro: 'Open a MicroLearn module with its code, the address of its Markdown file, or by dropping the file here.',
      field: 'Course code or address of the .md file', placeholder: 'e.g. 0001 or https://…/course.md', open: 'Open',
      drop: 'Drag and drop a <strong>.md</strong> file or <u>browse</u>', available: 'Available courses',
      studio: 'Create a course in the Studio', docs: 'Documentation',
      errTitle: 'This course cannot be opened', errCode: 'No course has the code “{code}”.',
      errList: 'The course list cannot be found: use the full file name (e.g. ?c=1234_accessibility-en) or add courses/index.json.',
      errFetch: 'The file could not be loaded ({detail}).', errCors: 'The site hosting this file may not allow other pages to read it (CORS).',
      errFile: 'This page must be opened from a web server (http://…), not directly from the disk.',
      errLink: 'This link is incomplete or damaged. Ask your trainer to copy it again.',
      errUnsupported: 'This browser cannot read this compressed link. Try a recent version of Chrome, Edge, Firefox or Safari.',
      errEmpty: 'This file contains no slides.', errBad: 'This file is not a Markdown file (.md).', badCode: 'This code contains characters that are not allowed.'
    }
  };
  var lang = /^(fr|en)$/.test(query.get('lang') || '') ? query.get('lang') : MLS.i18n.uiLang();
  if (!STR[lang]) lang = 'en';
  function t(k, vars) { return String(STR[lang][k] || STR.en[k] || k).replace(/\{(\w+)\}/g, function (m, n) { return vars && vars[n] != null ? vars[n] : m; }); }
  function fail(key, vars) { var e = new Error(t(key, vars)); e.friendly = true; return e; }

  /* ------------------------------------------------------------------ Sécurité
   * Un lien peut venir de n'importe qui : le HTML du cours est nettoyé (pas de script,
   * pas de gestionnaire on…, pas d'URL javascript:). Les formats (JS) restent ceux de l'application. */
  var BAD_TAGS = /^(script|iframe|frame|frameset|object|embed|applet|base|meta|link|form|animate|set|handler|noscript)$/i;
  var URL_ATTRS = /^(href|src|xlink:href|action|formaction|poster|background|data)$/i;
  function unsafeUrl(v) { return /^\s*(javascript|vbscript|data:text\/html)/i.test(String(v).replace(/[\u0000- ]+/g, '')); }
  function cleanNode(root) {
    var nodes = root.nodeType === 1 ? [root].concat([].slice.call(root.querySelectorAll('*'))) : [].slice.call(root.querySelectorAll ? root.querySelectorAll('*') : []);
    nodes.forEach(function (el) {
      if (BAD_TAGS.test(el.localName)) { el.remove(); return; }
      [].slice.call(el.attributes).forEach(function (a) {
        var n = a.name.toLowerCase();
        if (n.indexOf('on') === 0 || n === 'srcdoc' || (URL_ATTRS.test(n) && unsafeUrl(a.value))) el.removeAttribute(a.name);
      });
    });
  }
  function guard(root) {
    new MutationObserver(function (list) {
      list.forEach(function (m) {
        if (m.type === 'attributes') cleanNode(m.target);
        else m.addedNodes.forEach(function (n) { if (n.nodeType === 1) cleanNode(n); });
      });
    }).observe(root, { subtree: true, childList: true, attributes: true });
  }

  /* -------------------------------------------- Chemins relatifs des images
   * Les images relatives sont cherchées à côté du fichier .md ; « assets/… » désigne les ressources de l'application. */
  var base = location.href;
  function resolve(p) {
    if (!p || /^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(p) || /^assets\//.test(p)) return p;
    try { return new URL(p, base).href; } catch (e) { return p; }
  }
  /* Nettoyage du HTML brut écrit dans le Markdown, dès sa conversion : le parseur analyse aussi le
   * HTML hors de la page (pour repérer les images), donc on ne peut pas attendre son affichage. */
  var decoder = document.createElement('textarea');
  function decode(v) { decoder.innerHTML = v; return decoder.value; }
  var DROP_BLOCK = /<(script|style|iframe|frame|frameset|object|embed|applet|noscript|template|xmp|noembed|noframes)\b[\s\S]*?<\/\1\s*>/gi;
  var DROP_TAG = /<\/?(script|style|iframe|frame|frameset|object|embed|applet|base|meta|link|form|animate|set|handler|noscript|template|xmp|noembed|noframes)\b(?:"[^"]*"|'[^']*'|[^'">])*>/gi;
  var TAG = /<([a-z][^\s>\/]*)((?:"[^"]*"|'[^']*'|[^'">])*)>/gi;
  var ATTR = /([^\s"'>\/=]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s"'=<>`]+))?/g;
  function cleanHtml(html) {
    return String(html).replace(DROP_BLOCK, '').replace(DROP_TAG, '').replace(TAG, function (all, name, rest) {
      var out = '', selfClose = /\/\s*$/.test(rest), m;
      ATTR.lastIndex = 0;
      while ((m = ATTR.exec(rest))) {
        var n = m[1].toLowerCase(), raw = m[2], v = raw == null ? '' : decode(raw.replace(/^["']|["']$/g, ''));
        if (n.indexOf('on') === 0 || n === 'srcdoc' || n === 'style' && /expression|url\s*\(\s*['"]?\s*javascript/i.test(v)) continue;
        if (URL_ATTRS.test(n) && unsafeUrl(v)) continue;
        if (n === 'src' && /^img$/i.test(name)) v = resolve(v);
        out += ' ' + n + (raw == null ? '' : '="' + esc(v) + '"');
      }
      return '<' + name + out + (selfClose ? ' /' : '') + '>';
    });
  }
  MLS.marked.use({
    renderer: {
      html: function (html) { return cleanHtml(typeof html === 'object' ? html.text : html); },
      image: function (href, title, text) {
        if (unsafeUrl(href)) return esc(text);
        return '<img src="' + esc(resolve(href)) + '" alt="' + esc(text) + '"' + (title ? ' title="' + esc(title) + '"' : '') + '>';
      },
      link: function (href) { return unsafeUrl(href) ? arguments[2] : false; }
    }
  });

  /* ------------------------------------------------------------- Chargement */
  function fetchText(url) {
    if (location.protocol === 'file:') return Promise.reject(fail('errFile'));
    return fetch(url, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw fail('errFetch', { detail: 'HTTP ' + r.status });
      return r.text();
    }, function (e) {
      var err = fail('errFetch', { detail: e.message });
      if (new URL(url, location.href).origin !== location.origin) err.hint = t('errCors');
      throw err;
    });
  }

  var listCache = null;
  /** Liste des fichiers du dossier courses/ : index.json, sinon page d'index du serveur, sinon API GitHub (GitHub Pages). */
  function listCourses() {
    if (listCache) return listCache;
    function norm(arr) {
      return (arr || []).map(function (x) { return typeof x === 'string' ? { file: x } : x; })
        .filter(function (x) { return x && /^[\w.-]+\.md$/i.test(x.file || ''); });
    }
    function fromIndex() {
      return fetch(COURSES_DIR + 'index.json', { cache: 'no-cache' }).then(function (r) {
        if (!r.ok) throw new Error('no index');
        return r.json();
      }).then(function (j) { return norm(Array.isArray(j) ? j : j.courses); });
    }
    function fromListing() {
      return fetch(COURSES_DIR, { cache: 'no-cache' }).then(function (r) {
        if (!r.ok) throw new Error('no listing');
        return r.text();
      }).then(function (html) {
        var found = {}, re = /href=["']?(?:[^"'>]*\/)?(id_[^"'\/>?#]+\.md)["'>]/gi, m;
        while ((m = re.exec(html))) found[decodeURIComponent(m[1])] = true;
        var files = Object.keys(found);
        if (!files.length) throw new Error('empty listing');
        return norm(files);
      });
    }
    function fromGitHub() {
      var host = location.hostname;
      if (!/\.github\.io$/i.test(host)) return Promise.reject(new Error('not github'));
      var owner = host.split('.')[0], seg = location.pathname.split('/').filter(Boolean)[0];
      var repo = seg && !/\.html?$/i.test(seg) ? seg : host;
      return fetch('https://api.github.com/repos/' + owner + '/' + repo + '/contents/courses').then(function (r) {
        if (!r.ok) throw new Error('github ' + r.status);
        return r.json();
      }).then(function (arr) { return norm(arr.map(function (x) { return x.name; })); });
    }
    listCache = fromIndex().catch(fromListing).catch(fromGitHub).catch(function () { listCache = null; return null; });
    return listCache;
  }

  function idOf(file) { var m = /^id_([^_]+)_/i.exec(file); return m ? m[1] : null; }
  function codeOf(file) { return file.replace(/^id_/i, '').replace(/\.md$/i, ''); }

  /** Code court → adresse du fichier .md dans courses/. */
  function resolveCode(code) {
    code = String(code).trim().replace(/^id_/i, '').replace(/\.md$/i, '');
    if (!/^[\w-]+$/.test(code)) return Promise.reject(fail('badCode'));
    if (code.indexOf('_') > 0) return Promise.resolve(COURSES_DIR + 'id_' + code + '.md');
    return listCourses().then(function (list) {
      if (!list) throw fail('errList');
      var hit = list.filter(function (c) { return (idOf(c.file) || '').toLowerCase() === code.toLowerCase() || codeOf(c.file).toLowerCase() === code.toLowerCase(); })[0];
      if (!hit) throw fail('errCode', { code: code });
      return COURSES_DIR + hit.file;
    });
  }

  /** Le module suivant (en-tête next.url) peut désigner un autre .md : on le rouvre dans la vue apprenant. */
  function fixNextUrl(md) {
    return md.replace(/^(\s*url:\s*["']?)([^"'\s]+\.md)(["']?\s*)$/m, function (all, a, url, b) {
      try {
        var abs = new URL(url, base);
        var dir = new URL(COURSES_DIR, location.href);
        var name = abs.pathname.split('/').pop();
        var link = abs.href.indexOf(dir.href) === 0 && /^id_/i.test(name) ? 'view.html?c=' + encodeURIComponent(codeOf(name)) : 'view.html?src=' + encodeURIComponent(abs.href);
        return a + new URL(link, location.href).href + b;
      } catch (e) { return all; }
    });
  }

  var player = null;
  function play(md, srcUrl) {
    md = String(md || '').replace(/^﻿/, '').replace(/\r\n?/g, '\n');
    base = srcUrl ? new URL(srcUrl, location.href).href : location.href;
    md = fixNextUrl(md);
    var root = $('player');
    if (!player) {
      guard(root);
      player = new MLS.Player(root, {
        mode: 'standalone',
        formats: MLS.formats.all().map(function (f) { return MLS.formats.serialize(f); }),
        catalog: window.MLS_CHARACTERS
      });
      window.mlsPlayer = player;
    }
    var course = player.load(md, { welcome: true });
    if (!course.slides.length) throw fail('errEmpty');
    document.documentElement.lang = MLS.i18n.pick(course.meta.lang || 'fr');
    $('vw-loading').hidden = true;
    $('vw-home').hidden = true;
    root.hidden = false;
  }

  /* -------------------------------------------------------------- Accueil */
  function home(err) {
    $('vw-loading').hidden = true;
    $('player').hidden = true;
    document.documentElement.lang = lang;
    document.title = 'MicroLearn — ' + t('title');
    var langUrl = function (l) { var q = new URLSearchParams(location.search); q.set('lang', l); return '?' + q.toString() + location.hash; };
    var h = $('vw-home');
    h.innerHTML = '<div class="vw-card">' +
      '<div class="vw-brand"><span class="logo"><i class="bi bi-stars"></i></span> MicroLearn' +
      '<nav class="vw-lang" aria-label="Langue / Language">' +
        ['fr', 'en'].map(function (l) { return '<a href="' + esc(langUrl(l)) + '" lang="' + l + '"' + (l === lang ? ' aria-current="true"' : '') + '>' + l.toUpperCase() + '</a>'; }).join('') +
      '</nav></div>' +
      (err ? '<div class="alert alert-danger" role="alert"><strong><i class="bi bi-exclamation-triangle"></i> ' + esc(t('errTitle')) + '</strong><br>' + esc(err.message) +
        (err.hint ? '<br><small>' + esc(err.hint) + '</small>' : '') + '</div>' : '') +
      '<h1>' + esc(t('title')) + '</h1><p class="lead">' + esc(t('intro')) + '</p>' +
      '<form class="vw-form" novalidate><label class="form-label fw-semibold" for="vw-q">' + esc(t('field')) + '</label>' +
      '<div class="input-group"><input class="form-control" id="vw-q" autocomplete="off" spellcheck="false" placeholder="' + esc(t('placeholder')) + '">' +
      '<button class="btn btn-primary" type="submit"><i class="bi bi-play-fill"></i> ' + esc(t('open')) + '</button></div></form>' +
      '<button type="button" class="vw-drop" id="vw-drop"><i class="bi bi-cloud-arrow-up"></i> <span>' + t('drop') + '</span></button>' +
      '<div id="vw-courses"></div>' +
      '<div class="vw-foot"><a href="index.html"><i class="bi bi-pencil-square"></i> ' + esc(t('studio')) + '</a>' +
      '<a href="docs/index.html?lang=' + lang + '"><i class="bi bi-book"></i> ' + esc(t('docs')) + '</a></div>' +
      '</div>';
    h.hidden = false;

    var q = h.querySelector('#vw-q');
    var prev = query.get('c') || query.get('code') || query.get('id') || query.get('src') || query.get('url') || '';
    q.value = prev;
    h.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault();
      var v = q.value.trim();
      if (!v) { q.focus(); return; }
      var isUrl = /[\/:]/.test(v) || (/\.md$/i.test(v) && !/^id_/i.test(v) && !/^\w+_/.test(v));
      var p = new URLSearchParams();
      p.set(isUrl ? 'src' : 'c', v);
      if (query.get('lang')) p.set('lang', query.get('lang'));
      location.href = 'view.html?' + p.toString();
    });

    // Fichier local : déposé ou choisi.
    var drop = h.querySelector('#vw-drop');
    function readFile(file) {
      if (!file) return;
      if (!/\.(md|markdown|txt)$/i.test(file.name) && !/^text\//.test(file.type || '')) { home(fail('errBad')); return; }
      var r = new FileReader();
      r.onload = function () { try { play(String(r.result)); } catch (e) { home(e); } };
      r.readAsText(file, 'utf-8');
    }
    drop.addEventListener('click', function () {
      var inp = document.createElement('input');
      inp.type = 'file'; inp.accept = '.md,.markdown,.txt,text/markdown';
      inp.onchange = function () { readFile(inp.files[0]); };
      inp.click();
    });
    function hasFiles(e) { return e.dataTransfer && [].indexOf.call(e.dataTransfer.types || [], 'Files') >= 0; }
    h.ondragover = function (e) { if (hasFiles(e)) { e.preventDefault(); drop.classList.add('is-over'); } };
    h.ondragleave = function (e) { if (e.target === h) drop.classList.remove('is-over'); };
    h.ondrop = function (e) { if (!hasFiles(e)) return; e.preventDefault(); drop.classList.remove('is-over'); readFile(e.dataTransfer.files[0]); };

    // Liste des cours du dossier courses/.
    listCourses().then(function (list) {
      if (!list || !list.length) return;
      var box = h.querySelector('#vw-courses');
      box.innerHTML = '<h2 class="h6 fw-bold mt-4 mb-1">' + esc(t('available')) + '</h2><ul class="vw-list">' +
        list.map(function (c) {
          var code = idOf(c.file) || codeOf(c.file);
          var name = c.title || codeOf(c.file).replace(/^[^_]+_/, '').replace(/[-_]+/g, ' ');
          var l = c.lang || ((/-(fr|en|es|de)$/i.exec(codeOf(c.file)) || [])[1]);
          return '<li><a href="view.html?c=' + encodeURIComponent(code) + '"><i class="bi bi-journal-richtext text-primary"></i> <span>' + esc(name) + '</span>' +
            (l ? ' <span class="vw-lng">' + esc(l) + '</span>' : '') + '<code>' + esc(code) + '</code></a></li>';
        }).join('') + '</ul>';
    });
  }

  /* ----------------------------------------------------------- Démarrage */
  function start() {
    var z = hash.get('z'), raw = hash.get('md') || query.get('md');
    var src = query.get('src') || query.get('url');
    var code = query.get('c') || query.get('code') || query.get('id');
    var job;
    if (z) {
      if (!MLS.share.supported()) return home(fail('errUnsupported'));
      job = MLS.share.decode(z).then(function (md) { play(md); }, function () { throw fail('errLink'); });
    } else if (raw) {
      job = Promise.resolve().then(function () { play(raw); });
    } else if (src) {
      job = fetchText(src).then(function (md) { play(md, src); });
    } else if (code) {
      job = resolveCode(code).then(function (url) { return fetchText(url).then(function (md) { play(md, url); }); });
    } else {
      return home();
    }
    job.catch(function (e) {
      if (!e.friendly && window.console) console.error(e);
      home(e.friendly ? e : fail('errFetch', { detail: e.message }));
    });
  }

  start();
})(window.MLS);
