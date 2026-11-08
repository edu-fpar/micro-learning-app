/*!
 * Export autonome du cours :
 *  - 'zip'   : dossier HTML/CSS/JS + assets relatifs, lisible hors-ligne (clé USB, intranet)
 *  - 'scorm' : idem + imsmanifest.xml (SCORM 1.2) pour un LMS
 *  - 'html'  : un seul fichier .html avec tout intégré (CSS, JS, polices, images en data URI)
 * Les fichiers sources sont relus depuis le serveur qui héberge le Studio (http/https requis).
 */
(function (MLS) {
  'use strict';

  var U = MLS.util;

  function fetchOk(url, kind) {
    return fetch(url, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error('Fichier introuvable : ' + url + ' (' + r.status + ')');
      return kind === 'text' ? r.text() : r.arrayBuffer();
    }, function () {
      throw new Error('Impossible de lire « ' + url + ' ». L’export nécessite que le Studio soit servi en http(s) ' +
        '(GitHub Pages, serveur local…) et non ouvert en file://.');
    });
  }

  function toBase64(buf) {
    var bytes = new Uint8Array(buf), bin = '';
    for (var i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  }

  var MIME = { svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp',
    woff2: 'font/woff2', woff: 'font/woff', mp3: 'audio/mpeg', mp4: 'video/mp4' };
  function mime(path) { return MIME[(path.split('?')[0].split('.').pop() || '').toLowerCase()] || 'application/octet-stream'; }

  /** Chemins d'images relatifs utilisés dans le Markdown (les URL http/data sont laissées telles quelles). */
  function localMedia(md) {
    var found = {}, re = /!\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)|<img[^>]+src=["']([^"']+)["']/g, m;
    while ((m = re.exec(md))) {
      var p = m[1] || m[2];
      if (p && !/^([a-z]+:|\/\/|#)/i.test(p)) found[p.replace(/^\.\//, '')] = true;
    }
    return Object.keys(found);
  }

  function externalMedia(md) {
    var out = [], re = /!\[[^\]]*\]\(\s*(https?:\/\/[^)\s]+)/g, m;
    while ((m = re.exec(md))) out.push(m[1]);
    return out;
  }

  var LS = String.fromCharCode(0x2028), PS = String.fromCharCode(0x2029);
  function safeJson(o) {
    return JSON.stringify(o).replace(/</g, '\\u003c').split(LS).join('\\u2028').split(PS).join('\\u2029');
  }

  function bootScript() {
    return '(function () {\n' +
      '  var c = window.MLS_COURSE;\n' +
      '  MLS.scorm.init();\n' +
      '  var p = new MLS.Player(document.getElementById("player"), { mode: "standalone", formats: c.formats, catalog: window.MLS_CHARACTERS });\n' +
      '  p.load(c.markdown, { welcome: true });\n' +
      '  window.mlsPlayer = p;\n' +
      '})();';
  }

  function indexHtml(title, cssLinks, jsLinks) {
    return '<!doctype html>\n<html lang="fr">\n<head>\n  <meta charset="utf-8">\n' +
      '  <meta name="viewport" content="width=device-width, initial-scale=1">\n' +
      '  <meta name="generator" content="MicroLearn Studio ' + MLS.version + '">\n' +
      '  <title>' + U.escapeHtml(title) + '</title>\n' + cssLinks + '\n</head>\n<body class="mls-body">\n' +
      '  <div id="player"></div>\n' +
      '  <noscript><p style="padding:2rem;font-family:sans-serif">Ce module de formation nécessite JavaScript.</p></noscript>\n' +
      jsLinks + '\n</body>\n</html>\n';
  }

  function manifest(id, title, files) {
    var x = function (s) { return U.escapeHtml(s); };
    return '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<manifest identifier="' + x(id) + '" version="1.0"\n' +
      '  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"\n' +
      '  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"\n' +
      '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n' +
      '  xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">\n' +
      '  <metadata><schema>ADL SCORM</schema><schemaversion>1.2</schemaversion></metadata>\n' +
      '  <organizations default="org-1">\n    <organization identifier="org-1">\n      <title>' + x(title) + '</title>\n' +
      '      <item identifier="item-1" identifierref="res-1"><title>' + x(title) + '</title></item>\n' +
      '    </organization>\n  </organizations>\n' +
      '  <resources>\n    <resource identifier="res-1" type="webcontent" adlcp:scormtype="sco" href="index.html">\n' +
      files.map(function (f) { return '      <file href="' + x(f) + '"/>'; }).join('\n') +
      '\n    </resource>\n  </resources>\n</manifest>\n';
  }

  function readme(title, type) {
    return 'MODULE : ' + title + '\r\n' +
      '======================================================\r\n\r\n' +
      'Généré avec MicroLearn Studio ' + MLS.version + ' le ' + new Date().toLocaleString('fr-FR') + '.\r\n\r\n' +
      (type === 'scorm'
        ? 'Paquet SCORM 1.2 : importez ce fichier ZIP tel quel dans votre LMS (Moodle, 360Learning, etc.).\r\n' +
          'La progression (dernière slide) et le score des quiz sont transmis au LMS.\r\n'
        : 'Ouvrez simplement « index.html » dans un navigateur récent.\r\n' +
          'Aucune connexion Internet n\'est nécessaire : tout est inclus dans ce dossier\r\n' +
          '(vous pouvez le copier sur une clé USB, un intranet ou un partage réseau).\r\n') +
      '\r\nContenu :\r\n  index.html       point d\'entrée\r\n  course.js        contenu du cours (Markdown + formats)\r\n' +
      '  css/, js/, vendor/  moteur de lecture\r\n  assets/          personnages et images\r\n';
  }

  /**
   * @param {{type:'zip'|'scorm'|'html', markdown:string, formats:Array, onProgress?:function}} o
   * @returns {Promise<{blob: Blob, filename: string, warnings: string[]}>}
   */
  function build(o) {
    var type = o.type || 'zip';
    var md = o.markdown;
    var course = MLS.parser.parseCourse(md);
    var title = course.title;
    var slug = U.slugify(title) || 'module';
    var formats = o.formats.map(function (f) { return MLS.formats.serialize(f); });
    var catalog = U.clone(window.MLS_CHARACTERS || { characters: [] });
    var warnings = externalMedia(md).map(function (u) { return 'Image distante (nécessite Internet) : ' + u; });
    var progress = o.onProgress || function () {};

    var F = MLS.PLAYER_FILES;
    var charFiles = [];
    catalog.characters.forEach(function (c) { Object.keys(c.images || {}).forEach(function (e) { if (charFiles.indexOf(c.images[e]) === -1) charFiles.push(c.images[e]); }); });
    var media = localMedia(md);
    var tasks = [];
    F.css.forEach(function (p) { tasks.push({ path: p, kind: 'text' }); });
    F.js.forEach(function (p) { if (p !== 'assets/characters/catalog.js' || type !== 'html') tasks.push({ path: p, kind: 'text' }); });
    F.binary.forEach(function (p) { if (type !== 'html' || /\.woff2$/.test(p)) tasks.push({ path: p, kind: 'bin' }); });
    charFiles.forEach(function (p) { tasks.push({ path: p, kind: /\.svg$/i.test(p) && type === 'html' ? 'text' : 'bin' }); });
    media.forEach(function (p) { tasks.push({ path: p, kind: 'bin', optional: true }); });

    var done = 0;
    var results = {};
    return Promise.all(tasks.map(function (t) {
      return fetchOk(t.path, t.kind).then(function (data) {
        results[t.path] = data;
        progress(++done / tasks.length);
      }, function (err) {
        if (t.optional) { warnings.push('Image locale introuvable, ignorée : ' + t.path); progress(++done / tasks.length); return; }
        throw err;
      });
    })).then(function () {
      var data = { markdown: md, formats: formats, scorm: type === 'scorm', exportedAt: new Date().toISOString(), generator: 'MicroLearn Studio ' + MLS.version };

      if (type === 'html') {
        // Tout intégrer dans un seul fichier
        var mdInline = md;
        media.forEach(function (p) {
          if (!results[p]) return;
          var uri = 'data:' + mime(p) + ';base64,' + toBase64(results[p]);
          mdInline = mdInline.split('(' + p).join('(' + uri).split('(./' + p).join('(' + uri).split('"' + p + '"').join('"' + uri + '"');
        });
        data.markdown = mdInline;
        catalog.characters.forEach(function (c) {
          Object.keys(c.images).forEach(function (e) {
            var p = c.images[e], v = results[p];
            if (v == null) return;
            c.images[e] = typeof v === 'string' ? 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(v) : 'data:' + mime(p) + ';base64,' + toBase64(v);
          });
        });
        var woff2 = results['vendor/bootstrap-icons/fonts/bootstrap-icons.woff2'];
        var css = F.css.map(function (p) {
          var txt = results[p];
          if (/bootstrap-icons/.test(p)) {
            txt = txt.replace(/src:[^;}]*/, 'src:url("data:font/woff2;base64,' + toBase64(woff2) + '") format("woff2")');
          }
          return '<style>/* ' + p + ' */\n' + txt.replace(/\/\*# sourceMappingURL=[^*]*\*\//g, '') + '\n</style>';
        }).join('\n');
        var js = F.js.filter(function (p) { return p !== 'assets/characters/catalog.js'; }).map(function (p) {
          return '<script>/* ' + p + ' */\n' + results[p].replace(/\/\/# sourceMappingURL=\S+/g, '').replace(/<\/script/gi, '<\\/script') + '\n</script>';
        }).join('\n');
        js += '\n<script>window.MLS_CHARACTERS = ' + safeJson(catalog) + ';\nwindow.MLS_COURSE = ' + safeJson(data) + ';</script>\n<script>' + bootScript() + '</script>';
        var html = indexHtml(title, css, js);
        return { blob: new Blob([html], { type: 'text/html;charset=utf-8' }), filename: slug + '.html', warnings: warnings };
      }

      var zip = MLS.zip();
      var root = type === 'scorm' ? '' : slug + '/';
      Object.keys(results).forEach(function (p) {
        var v = results[p];
        if (v == null) return;
        if (typeof v === 'string') v = v.replace(/\/\*# sourceMappingURL=[^*]*\*\/|\/\/# sourceMappingURL=\S+/g, '');
        zip.add(root + p, v);
      });
      zip.add(root + 'course.js', '/* Contenu du cours — généré par MicroLearn Studio */\nwindow.MLS_COURSE = ' + safeJson(data) + ';\n');
      zip.add(root + 'course.md', md);
      var cssLinks = F.css.map(function (p) { return '  <link rel="stylesheet" href="' + p + '">'; }).join('\n');
      var jsLinks = F.js.concat(['course.js']).map(function (p) { return '  <script src="' + p + '"></script>'; }).join('\n') +
        '\n  <script>\n' + bootScript() + '\n  </script>';
      zip.add(root + 'index.html', indexHtml(title, cssLinks, jsLinks));
      zip.add(root + 'LISEZMOI.txt', readme(title, type));
      if (type === 'scorm') {
        var list = zip.paths();
        zip.add('imsmanifest.xml', manifest('mls-' + slug, title, list));
      }
      return { blob: zip.blob(), filename: slug + (type === 'scorm' ? '-scorm12' : '') + '.zip', warnings: warnings };
    });
  }

  function download(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 1500);
  }

  MLS.exporter = { build: build, download: download, localMedia: localMedia };
})(window.MLS);
