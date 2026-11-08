/*!
 * Versioning des cours : snapshots du Markdown stockés dans le localStorage.
 */
(function (MLS) {
  'use strict';

  var KEY = 'versions';
  var MAX = 60;

  function list() { return MLS.store.get(KEY, []) || []; }

  function lineDiff(a, b) {
    // Comparaison par multiensemble de lignes : rapide et suffisante pour un résumé.
    var count = {};
    String(a).split('\n').forEach(function (l) { count[l] = (count[l] || 0) + 1; });
    var added = 0;
    String(b).split('\n').forEach(function (l) { if (count[l]) count[l]--; else added++; });
    var removed = 0;
    Object.keys(count).forEach(function (k) { removed += count[k]; });
    return { added: added, removed: removed };
  }

  MLS.versions = {
    list: list,
    get: function (id) { return list().filter(function (v) { return v.id === id; })[0] || null; },
    save: function (md, label, extra) {
      var course = MLS.parser.parseCourse(md);
      var v = {
        id: MLS.util.uid('v'),
        label: label || 'Version sans nom',
        date: new Date().toISOString(),
        title: course.title,
        slides: course.slides.length,
        size: md.length,
        auto: !!(extra && extra.auto),
        md: md
      };
      var all = list();
      all.unshift(v);
      // on élague d'abord les sauvegardes automatiques les plus anciennes
      while (all.length > MAX) {
        var idx = -1;
        for (var i = all.length - 1; i >= 0; i--) if (all[i].auto) { idx = i; break; }
        all.splice(idx === -1 ? all.length - 1 : idx, 1);
      }
      return MLS.store.set(KEY, all) ? v : null;
    },
    rename: function (id, label) {
      var all = list();
      all.forEach(function (v) { if (v.id === id) v.label = label; });
      MLS.store.set(KEY, all);
    },
    remove: function (id) {
      MLS.store.set(KEY, list().filter(function (v) { return v.id !== id; }));
    },
    diff: lineDiff
  };
})(window.MLS);
