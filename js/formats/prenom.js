MLS.formats.register({
  id: 'format-prenom',
  name: 'Demande du prénom',
  icon: 'bi-person-vcard',
  category: 'Personnages',
  description: 'Le personnage pose une question (citation « > ») et l’apprenant tape son prénom (facultatif, gardé dans son navigateur). Il remplace ensuite {prenom} dans le texte ; {, prenom} ajoute « , Camille » et disparaît sans prénom.',
  sample: `<!-- slide: format-prenom -->
<!-- character-role: mentor -->
<!-- character-expression: happy -->
### Faisons connaissance
> Bonjour ! Avant de commencer, comment vous appelez-vous ?`,
  i18n: {
    "fr": {
      "label": "Votre prénom",
      "ok": "C’est parti",
      "hint": "Facultatif. Il reste dans votre navigateur, rien n’est envoyé.",
      "skip": "Continuer sans prénom",
      "hello": "Bienvenue, {name} !"
    },
    "tu": {
      "label": "Ton prénom",
      "hint": "Facultatif. Il reste dans ton navigateur, rien n’est envoyé."
    },
    "en": {
      "label": "Your first name",
      "ok": "Let’s go",
      "hint": "Optional. It stays in your browser; nothing is sent.",
      "skip": "Continue without a name",
      "hello": "Welcome, {name}!",
      "$name": "First name prompt",
      "$category": "Characters",
      "$description": "The character asks a question (\"> \" quote) and the learner types their first name (optional, kept in their browser). It then replaces {name} in the text; {, name} adds \", Sam\" and disappears when there is no name.",
      "$sample": "<!-- slide: format-prenom -->\n<!-- character-role: mentor -->\n<!-- character-expression: happy -->\n### Let's get acquainted\n> Hello! Before we start, what's your name?"
    },
    "es": {
      "label": "Tu nombre",
      "ok": "¡Vamos!",
      "hint": "Opcional. Se queda en tu navegador; no se envía nada.",
      "skip": "Continuar sin nombre",
      "hello": "¡Te damos la bienvenida, {name}!",
      "$name": "Pregunta del nombre",
      "$category": "Personajes",
      "$description": "El personaje hace una pregunta (cita «> ») y quien aprende escribe su nombre (opcional, se guarda en su navegador). Después sustituye {name} en el texto; {, name} añade «, Sam» y desaparece si no hay nombre.",
      "$sample": "<!-- slide: format-prenom -->\n<!-- character-role: mentor -->\n<!-- character-expression: happy -->\n### Vamos a conocernos\n> ¡Hola! Antes de empezar, ¿cómo te llamas?"
    }
  },
  template: `<div class="pn">
  {{#title}}<h2 class="mls-title">{{{titleHtml}}}</h2>{{/title}}
  {{#hasText}}<div class="mls-prose">{{{text}}}</div>{{/hasText}}
  {{#lines}}<div class="pn-row">{{#character}}<div class="pn-who">{{{avatar}}}<span class="pn-name">{{{nameTag}}}</span></div>{{/character}}
    <div class="pn-bubble" data-mls-speak="always" data-mls-speak-role="{{role}}">{{{html}}}</div></div>{{/lines}}
  <div class="pn-form" role="group">
    <label class="pn-label" for="pn-in-{{index}}">{{t.label}}</label>
    <span class="pn-field"><input class="pn-in" id="pn-in-{{index}}" type="text" autocomplete="given-name" maxlength="40" enterkeyhint="go" aria-describedby="pn-hint-{{index}}">
      <button class="mls-btn pn-ok" type="button"><i class="bi bi-arrow-right"></i> {{t.ok}}</button></span>
    <p class="pn-hint" id="pn-hint-{{index}}">{{t.hint}}</p>
    <button type="button" class="pn-skip">{{t.skip}}</button>
  </div>
</div>`,
  css: `:scope .pn { max-width: 660px; width: 100%; margin: 0 auto; display: flex; flex-direction: column; gap: 1.4rem; }
:scope .pn-row { display: flex; gap: 1rem; align-items: flex-end; }
:scope .pn-who { display: flex; flex-direction: column; align-items: center; gap: .3rem; flex: none; width: 120px; }
:scope .pn-who .mls-avatar { width: 112px; height: 112px; }
:scope .pn-name { font-weight: 700; font-size: .85rem; }
:scope .pn-bubble { position: relative; min-width: 0; background: var(--mls-surface); border-radius: 22px; border-bottom-left-radius: 6px; padding: 1rem 1.25rem; box-shadow: var(--mls-shadow);
  font-size: clamp(1.05rem, 2cqw, 1.3rem); line-height: 1.5; }
:scope .pn-bubble p:last-child { margin: 0; }
:scope .pn-form { display: flex; flex-direction: column; gap: .45rem; }
:scope .pn-label { font-weight: 700; }
:scope .pn-field { display: flex; gap: .5rem; flex-wrap: wrap; }
:scope .pn-in { flex: 1 1 200px; min-width: 0; font: inherit; font-size: 1.15rem; padding: .7rem 1rem; border-radius: 14px;
  border: 2px solid color-mix(in srgb, var(--mls-primary) 25%, transparent); background: var(--mls-surface); color: inherit; }
:scope .pn-in:focus { outline: none; border-color: var(--mls-primary); }
:scope .pn-hint { margin: .1rem 0 0; font-size: .85rem; color: var(--mls-muted); }
:scope .pn-skip { align-self: flex-start; background: none; border: 0; padding: 0; color: var(--mls-muted); text-decoration: underline; cursor: pointer; font-size: .9rem; }
@container slide (max-width: 640px) {
  :scope .pn-who { width: 70px; }
  :scope .pn-who .mls-avatar { width: 64px; height: 64px; }
}`,
  js: `var input = root.querySelector('.pn-in');
input.value = ctx.learnerName();
function go(name) {
  name = ctx.setLearnerName(name);
  if (name) ctx.announce(ctx.t('hello', { name: name }));
  ctx.next();
}
// pas de <form> : la vue apprenant les retire par sécurité
root.querySelector('.pn-ok').addEventListener('click', function () { go(input.value); });
input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); go(input.value); } });
root.querySelector('.pn-skip').addEventListener('click', function () { go(''); });
ctx.onEnter(function () { input.value = ctx.learnerName(); });`
});
