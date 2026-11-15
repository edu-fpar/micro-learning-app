MLS.formats.register({
  id: 'format-menu',
  name: 'Menu à branches',
  icon: 'bi-signpost-split',
  category: 'Navigation',
  description: 'Boutons qui mènent chacun à une partie : « - [📌 Libellé](#id) :: description », la partie commençant par une slide <!-- branch: id -->. Les parties vues sont cochées et la fin de chaque partie ramène au menu. Les citations « > » sont les répliques du guide : 1re au premier passage, 2e au retour, 3e quand tout est vu. [Libellé](#id "featured") met un élément en avant.',
  sample: `<!-- slide: format-menu -->
<!-- id: menu -->
<!-- character-role: mentor -->
### Par quoi commencer ?
> @mentor(happy): Choisis une partie, je t’y emmène. Tu reviendras ici à la fin de chacune.

> @mentor(encouraging): On continue ? Les parties déjà vues sont cochées.

> @mentor(happy): Tu as tout vu, bravo !

- [📖 Les bases](#bases) :: Le vocabulaire à connaître
- [🛠️ La pratique](#pratique) :: Les gestes du quotidien
- [🚀 Pour aller plus loin](#plus "featured") :: Les astuces des pros`,
  i18n: {
    "fr": {
      "seen": "vu",
      "done": "J’ai terminé",
      "back": "Retour au menu",
      "missing": "Partie introuvable : ajoutez une slide <!-- branch: {id} -->."
    },
    "en": {
      "seen": "seen",
      "done": "I’m done",
      "back": "Back to menu",
      "missing": "Part not found: add a slide <!-- branch: {id} -->.",
      "$name": "Branching menu",
      "$category": "Navigation",
      "$description": "Buttons that each lead to a part: \"- [📌 Label](#id) :: description\", the part starting with a <!-- branch: id --> slide. Parts already seen are ticked and the end of each part leads back to the menu. \"> \" quotes are the guide's lines: 1st on the first visit, 2nd on return, 3rd when everything has been seen. [Label](#id \"featured\") highlights an item.",
      "$sample": "<!-- slide: format-menu -->\n<!-- id: menu -->\n<!-- character-role: mentor -->\n### Where shall we start?\n> @mentor(happy): Pick a part and I'll take you there. You'll come back here at the end of each one.\n\n> @mentor(encouraging): Shall we go on? Parts you have seen are ticked.\n\n> @mentor(happy): You've seen everything, well done!\n\n- [📖 The basics](#basics) :: The words you need\n- [🛠️ In practice](#practice) :: Everyday actions\n- [🚀 Going further](#further \"featured\") :: Tips from the pros"
    }
  },
  template: `<div class="mn">
  {{#title}}<h2 class="mls-title">{{{titleHtml}}}</h2>{{/title}}
  {{#hasText}}<div class="mls-prose mn-intro">{{{text}}}</div>{{/hasText}}
  {{#lines.0}}<div class="mn-guide">{{#character}}<div class="mn-who">{{{avatar}}}</div>{{/character}}<div class="mn-bubble" data-mls-speak="always" data-mls-speak-role="{{role}}"></div></div>{{/lines.0}}
  <div class="mn-grid"></div>
  <div class="mn-actions"></div>
</div>`,
  css: `:scope .mn { max-width: 880px; width: 100%; margin: 0 auto; }
:scope .mn-intro { margin-bottom: 1rem; }
:scope .mn-guide { display: flex; gap: .9rem; align-items: flex-end; margin-bottom: 1.2rem; }
:scope .mn-who { flex: none; }
:scope .mn-who .mls-avatar { width: 84px; height: 84px; }
:scope .mn-bubble { position: relative; min-width: 0; background: var(--mls-surface); border-radius: 20px; border-bottom-left-radius: 6px; padding: .8rem 1.1rem; box-shadow: var(--mls-shadow);
  font-size: clamp(1rem, 1.9cqw, 1.18rem); line-height: 1.5; }
:scope .mn-bubble p:last-child { margin: 0; }
:scope .mn-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .7rem; }
:scope .mn-item { position: relative; display: flex; gap: .8rem; align-items: center; text-align: left; width: 100%; border: 2px solid transparent; background: var(--mls-surface); color: inherit;
  border-radius: 16px; padding: .85rem 1rem; box-shadow: var(--mls-shadow); cursor: pointer; font: inherit; transition: transform .15s, border-color .15s; }
:scope .mn-item:hover, :scope .mn-item:focus-visible { border-color: var(--mls-primary); transform: translateY(-2px); }
:scope .mn-ico { font-size: 1.7rem; line-height: 1; flex: none; width: 2.2rem; text-align: center; }
:scope .mn-txt { display: flex; flex-direction: column; gap: .15rem; min-width: 0; padding-right: 2.2rem; }
:scope .mn-txt strong { font-size: 1.02rem; }
:scope .mn-txt small { color: var(--mls-muted); font-size: .86rem; line-height: 1.35; }
:scope .mn-txt small p { margin: 0; }
:scope .mn-seen { position: absolute; top: .45rem; right: .6rem; font-size: .72rem; font-weight: 700; color: var(--mls-primary); display: none; }
:scope .mn-item.is-seen .mn-seen { display: inline-flex; gap: .2rem; align-items: center; }
:scope .mn-item.is-seen { opacity: .85; }
:scope .mn-item.mn-featured { grid-column: 1 / -1; background: linear-gradient(120deg, var(--mls-secondary), color-mix(in srgb, var(--mls-secondary) 55%, #fff)); color: #1f2933; padding: 1.05rem 1.2rem; }
:scope .mn-item.mn-featured .mn-ico { font-size: 2.1rem; }
:scope .mn-item.mn-featured strong { font-size: 1.12rem; }
:scope .mn-item.mn-featured small, :scope .mn-item.mn-featured .mn-seen { color: #1f2933; }
:scope .mn-item.is-missing { opacity: .55; cursor: not-allowed; }
:scope .mn-actions { display: flex; flex-wrap: wrap; gap: .6rem; justify-content: center; margin-top: 1.3rem; }
@container slide (max-width: 640px) {
  :scope .mn-grid { grid-template-columns: 1fr; }
  :scope .mn-who .mls-avatar { width: 56px; height: 56px; }
}`,
  js: `var grid = root.querySelector('.mn-grid'), bubble = root.querySelector('.mn-bubble'), acts = root.querySelector('.mn-actions');
var img = root.querySelector('.mn-who .mls-avatar');
var EMOJI = /^(\\p{Extended_Pictographic}\\uFE0F?(?:\\u200D\\p{Extended_Pictographic}\\uFE0F?)*)\\s*([\\s\\S]*)$/u;
var items = data.items.map(function (it) {
  var d = document.createElement('div'); d.innerHTML = it.term;
  var a = d.querySelector('a'); if (!a) return null;
  var label = a.textContent.trim(), m = label.match(EMOJI);
  var v = (a.getAttribute('title') || '').toLowerCase();
  return { target: (a.getAttribute('href') || '').replace(/^#/, ''), ico: m ? m[1] : '', label: m ? m[2] : label, desc: it.def,
    featured: /^(featured|vedette|highlight|terrain)$/.test(v) };
}).filter(Boolean);
grid.innerHTML = items.map(function (x) {
  var missing = ctx.player.slideIdx(x.target) == null;
  return '<button type="button" class="mn-item' + (x.featured ? ' mn-featured' : '') + (missing ? ' is-missing' : '') + '" data-go="' + ctx.escape(x.target) + '"' +
    (missing ? ' title="' + ctx.escape(ctx.t('missing', { id: x.target })) + '"' : '') + '>' +
    (x.ico ? '<span class="mn-ico" aria-hidden="true">' + x.ico + '</span>' : '') +
    '<span class="mn-txt"><strong>' + ctx.escape(x.label) + '</strong>' + (x.desc ? '<small>' + x.desc + '</small>' : '') + '</span>' +
    '<span class="mn-seen"><i class="bi bi-check-circle-fill" aria-hidden="true"></i> ' + ctx.escape(ctx.t('seen')) + '</span></button>';
}).join('');
var parent = data.meta.parent;
acts.innerHTML = parent
  ? '<button type="button" class="mls-btn mls-btn-ghost" data-back><i class="bi bi-arrow-left"></i> ' + ctx.escape(ctx.t('back')) + '</button>'
  : '<button type="button" class="mls-btn mls-btn-ghost" data-finish><i class="bi bi-flag"></i> ' + ctx.escape(ctx.t('done')) + '</button>';
function refresh() {
  var n = 0;
  grid.querySelectorAll('.mn-item').forEach(function (b) {
    var s = ctx.seen(b.getAttribute('data-go'));
    b.classList.toggle('is-seen', s);
    if (s) n++;
  });
  var q = data.quotes;
  if (!bubble || !q.length) return;
  var k = n === 0 ? 0 : (n >= items.length && q[2] ? 2 : 1);
  var line = q[Math.min(k, q.length - 1)];
  bubble.innerHTML = line.html;
  if (img) ctx.setExpression(img, line.expression || 'happy');
  ctx.player.applyName();
  ctx.speakable(bubble);
}
root.addEventListener('click', function (e) {
  var g = e.target.closest('[data-go]');
  if (g) { if (!g.classList.contains('is-missing')) ctx.go(g.getAttribute('data-go')); return; }
  if (e.target.closest('[data-back]')) { ctx.go(parent); return; }
  if (e.target.closest('[data-finish]')) ctx.finish();
});
ctx.onEnter(refresh);
refresh();`
});
