MLS.formats.register({
  id: 'format-sms',
  name: 'Dialogue façon messagerie',
  icon: 'bi-chat-dots',
  category: 'Personnages',
  description: 'Comme le dialogue, mais façon messagerie : les répliques « > @role(expression): texte » arrivent une à une, précédées de « … ». Défilement automatique (durée selon la longueur) ou au clic : <!-- autoplay: off --> sur la slide, dialogue-autoplay: dans l’en-tête ; l’apprenant peut aussi choisir dans ses réglages. Boutons Pause et Tout afficher.',
  sample: `<!-- slide: format-sms -->
### Un message de Léa
> @mentor: Salut ! Tu as vu le nouveau planning ?

> @peer(surprised): Pas encore… il y a du changement ?

> @mentor(happy): Oui : la réunion passe au jeudi. Pense à prévenir l’équipe !

> @peer(happy): Super, merci, je m’en occupe.`,
  i18n: {
    "fr": {
      "pause": "Pause",
      "resume": "Reprendre",
      "all": "Tout afficher",
      "more": "Suite"
    },
    "en": {
      "pause": "Pause",
      "resume": "Resume",
      "all": "Show all",
      "more": "Continue",
      "$name": "Chat-style dialogue",
      "$category": "Characters",
      "$description": "Like the dialogue, but chat-style: \"> @role(expression): text\" lines arrive one by one, after a \"…\" typing indicator. Automatic playback (timed by length) or on click: <!-- autoplay: off --> on the slide, dialogue-autoplay: in the header; learners can also choose in their settings. Pause and Show all buttons.",
      "$sample": "<!-- slide: format-sms -->\n### A message from Lea\n> @mentor: Hi! Have you seen the new schedule?\n\n> @peer(surprised): Not yet… has anything changed?\n\n> @mentor(happy): Yes: the meeting moves to Thursday. Remember to tell the team!\n\n> @peer(happy): Great, thanks, I'll take care of it."
    }
  },
  template: `<div class="sms">
  {{#title}}<h2 class="mls-title">{{{titleHtml}}}</h2>{{/title}}
  {{#hasText}}<div class="mls-prose sms-intro">{{{text}}}</div>{{/hasText}}
  <div class="sms-thread">
    {{#lines}}<div class="sms-line side-{{side}} is-hidden" data-n="{{index}}">
      {{#character}}<div class="sms-who">{{{avatar}}}</div>{{/character}}
      <div class="sms-col">{{#character}}<span class="sms-name">{{{nameTag}}}</span>{{/character}}
        <div class="sms-bubble" data-mls-speak="always" data-mls-speak-role="{{role}}">{{{html}}}</div></div>
    </div>{{/lines}}
    <div class="sms-typing is-hidden" aria-hidden="true"><div class="sms-who"></div><div class="sms-dots"><i></i><i></i><i></i></div></div>
  </div>
  <div class="sms-actions">
    <button class="mls-btn sms-more" type="button" hidden><i class="bi bi-chat-dots"></i> {{t.more}}</button>
    <button class="mls-btn mls-btn-ghost sms-pause" type="button" hidden><i class="bi bi-pause-fill"></i> <span>{{t.pause}}</span></button>
    <button class="mls-btn mls-btn-ghost sms-all" type="button"><i class="bi bi-chevron-double-down"></i> {{t.all}}</button>
  </div>
</div>`,
  css: `:scope .sms { max-width: 760px; width: 100%; margin: 0 auto; }
:scope .sms-thread { display: flex; flex-direction: column; gap: .75rem; }
:scope .sms-line, :scope .sms-typing { display: flex; gap: .6rem; align-items: flex-end; }
:scope .sms-line { animation: sms-in .35s cubic-bezier(.2,.9,.3,1.2) both; }
:scope .side-right { flex-direction: row-reverse; }
:scope .is-hidden { display: none; }
:scope .sms-who { flex: none; width: 52px; }
:scope .sms-who .mls-avatar { width: 52px; height: 52px; border-width: 2px; }
:scope .sms-col { display: flex; flex-direction: column; gap: .2rem; min-width: 0; max-width: min(78%, 60ch); }
:scope .side-right .sms-col { align-items: flex-end; }
:scope .sms-name { font-size: .75rem; font-weight: 700; color: var(--mls-muted); padding: 0 .6rem; }
:scope .sms-bubble { background: var(--mls-surface); border-radius: 20px; border-bottom-left-radius: 6px; padding: .7rem 1rem; box-shadow: var(--mls-shadow);
  font-size: clamp(1rem, 1.8cqw, 1.12rem); line-height: 1.5; overflow-wrap: anywhere; }
:scope .side-right .sms-bubble { background: var(--mls-primary); color: #fff; border-radius: 20px; border-bottom-right-radius: 6px; }
:scope .side-right .sms-bubble a { color: #fff; }
:scope .side-right .mls-speak-btn { background: transparent; color: #fff; border-color: rgba(255,255,255,.5); }
:scope .sms-bubble p:last-child { margin-bottom: 0; }
:scope .sms-dots { background: var(--mls-surface); border-radius: 20px; padding: .85rem 1rem; box-shadow: var(--mls-shadow); display: flex; gap: .3rem; }
:scope .sms-dots i { width: 8px; height: 8px; border-radius: 50%; background: currentColor; opacity: .35; animation: sms-dot 1.2s infinite; }
:scope .sms-dots i:nth-child(2) { animation-delay: .2s; }
:scope .sms-dots i:nth-child(3) { animation-delay: .4s; }
:scope .sms-actions { display: flex; justify-content: center; gap: .6rem; flex-wrap: wrap; margin-top: 1.2rem; }
:scope .sms-actions[hidden], :scope .sms-actions [hidden] { display: none; }
@keyframes sms-in { from { opacity: 0; transform: translateY(10px) scale(.98); } }
@keyframes sms-dot { 0%, 60%, 100% { opacity: .25; transform: none; } 30% { opacity: .8; transform: translateY(-3px); } }
@media (prefers-reduced-motion: reduce) { :scope .sms-line { animation: none; } :scope .sms-dots i { animation: none; opacity: .5; } }
@container slide (max-width: 640px) {
  :scope .sms-who { width: 38px; }
  :scope .sms-who .mls-avatar { width: 38px; height: 38px; }
  :scope .sms-col { max-width: 84%; }
}`,
  js: `var lines = [].slice.call(root.querySelectorAll('.sms-line'));
var typing = root.querySelector('.sms-typing'), tWho = typing.querySelector('.sms-who');
var acts = root.querySelector('.sms-actions');
var moreBtn = root.querySelector('.sms-more'), pauseBtn = root.querySelector('.sms-pause'), allBtn = root.querySelector('.sms-all');
if (!lines.length) { acts.hidden = true; return; }
var st = ctx.state;
st.shown = st.shown || 0;
var timer = null, paused = false, active = false, auto = ctx.autoplay();

function words(el) { return (el.textContent || '').trim().split(/\\s+/).filter(Boolean).length; }
// temps de lecture d'une réplique : 700 ms + 260 ms par mot, entre 1,4 et 8 s ; ×1,5 quand la voix lit les répliques
function readTime(i) {
  var m = ctx.audioMode();
  return Math.min(8000, Math.max(1400, 700 + words(lines[i].querySelector('.sms-bubble')) * 260)) * (m === 'auto' || m === 'interact' ? 1.5 : 1);
}
// défilement vertical de la slide seulement (scrollIntoView décalerait aussi la scène horizontalement)
function bringIntoView(el) {
  var sc = root.closest('.mls-slide');
  if (!sc) return;
  var r = el.getBoundingClientRect(), b = sc.getBoundingClientRect(), d = 0;
  if (r.bottom > b.bottom - 12) d = r.bottom - b.bottom + 12;
  else if (r.top < b.top + 12) d = r.top - b.top - 12;
  if (d) sc.scrollTo({ top: sc.scrollTop + d, behavior: 'smooth' });
}
function wait(fn, ms) { clearTimeout(timer); timer = setTimeout(fn, ms); }
function render() {
  lines.forEach(function (l, i) { l.classList.toggle('is-hidden', i >= st.shown); });
  var done = st.shown >= lines.length;
  acts.hidden = done;
  moreBtn.hidden = auto || done;
  pauseBtn.hidden = !auto || done;
}
function hideTyping() { typing.classList.add('is-hidden'); }
function showTyping(i) {
  var l = lines[i], w = l.querySelector('.sms-who');
  tWho.innerHTML = w ? w.innerHTML : '';
  typing.classList.toggle('side-right', l.classList.contains('side-right'));
  l.parentNode.insertBefore(typing, l);
  typing.classList.remove('is-hidden');
  bringIntoView(typing);
}
function reveal(i) {
  hideTyping();
  st.shown = i + 1;
  render();
  var l = lines[i];
  ctx.announce(l.textContent.replace(/\\s+/g, ' ').trim());
  ctx.speak(l.querySelector('.sms-bubble'));
  bringIntoView(l);
  if (st.shown >= lines.length && root.contains(document.activeElement) && acts.contains(document.activeElement)) {
    l.setAttribute('tabindex', '-1'); l.focus({ preventScroll: true });
  }
}
// défilement automatique : attend la fermeture de l'écran d'accueil, puis la fin de la lecture à voix haute
function step() {
  clearTimeout(timer);
  if (!active || paused || !auto) return;
  if (ctx.overlayOpen()) { wait(step, 400); return; }
  if (st.shown >= lines.length) { hideTyping(); render(); return; }
  var i = st.shown;
  showTyping(i);
  wait(function () { reveal(i); wait(afterRead, readTime(i)); }, i === 0 ? 600 : 1000);
}
function afterRead() {
  if (window.MLS && MLS.speech.isSpeaking()) { wait(afterRead, 300); return; }
  step();
}
// au clic : la première réplique arrive seule, les suivantes avec « Suite »
function more() {
  if (!active || st.shown >= lines.length) return;
  var i = st.shown;
  moreBtn.disabled = true;
  showTyping(i);
  wait(function () { moreBtn.disabled = false; reveal(i); }, 450);
}
function startClick() {
  if (!active) return;
  if (ctx.overlayOpen()) { wait(startClick, 400); return; }
  if (st.shown === 0) more();
}
function setPaused(p) {
  paused = p;
  pauseBtn.querySelector('i').className = 'bi ' + (p ? 'bi-play-fill' : 'bi-pause-fill');
  pauseBtn.querySelector('span').textContent = ctx.t(p ? 'resume' : 'pause');
  pauseBtn.setAttribute('aria-pressed', p);
  if (p) { clearTimeout(timer); hideTyping(); } else step();
}
moreBtn.addEventListener('click', more);
pauseBtn.addEventListener('click', function () { setPaused(!paused); });
allBtn.addEventListener('click', function () {
  clearTimeout(timer); hideTyping(); moreBtn.disabled = false;
  st.shown = lines.length; render();
  var l = lines[lines.length - 1];
  l.setAttribute('tabindex', '-1'); l.focus({ preventScroll: true });
  bringIntoView(l);
});
ctx.onEnter(function () {
  active = true;
  clearTimeout(timer); hideTyping(); moreBtn.disabled = false;
  auto = ctx.autoplay();
  render();
  if (auto) step(); else startClick();
});
ctx.onLeave(function () { active = false; clearTimeout(timer); hideTyping(); moreBtn.disabled = false; });
render();`
});
