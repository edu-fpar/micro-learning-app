#!/usr/bin/env node
/*
 * Outil de développement (facultatif) : génère les avatars SVG de démonstration
 * dans assets/characters/<id>/<expression>.svg + assets/characters/catalog.js.
 *   node tools/generate-avatars.js
 * L'application n'a PAS besoin de Node : les fichiers générés sont versionnés.
 * Pour utiliser vos propres illustrations, remplacez les SVG/PNG et éditez catalog.js.
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'assets', 'characters');
const EXPRESSIONS = ['neutral', 'happy', 'encouraging', 'thinking', 'surprised', 'concerned'];
const SKIN = { s1: '#F6D3BD', s2: '#EDC39A', s3: '#D9A066', s4: '#BC7A45', s5: '#8D5524', s6: '#5A3720' };

const CHARACTERS = [
  { id: 'amina', name: 'Amina', description: 'Ingénieure, porte un hijab.', tags: ['femme', 'adulte'], skin: 's5', bg: '#D8F3EE', shirt: '#264653', head: 'hijab', headColor: '#2A9D8F' },
  { id: 'lucas', name: 'Lucas', description: 'Chef de projet, porte des lunettes.', tags: ['homme', 'adulte'], skin: 's1', bg: '#DCE8FF', shirt: '#3A86FF', hair: 'short', hairColor: '#6B4226', glasses: 'rect' },
  { id: 'mei', name: 'Mei', description: 'Étudiante en design.', tags: ['femme', 'jeune'], skin: 's2', bg: '#FFE1E1', shirt: '#FF6B6B', hair: 'bob', hairColor: '#1B1B1B' },
  { id: 'jose', name: 'José', description: 'Formateur expérimenté, porte un appareil auditif.', tags: ['homme', 'senior', 'handicap'], skin: 's3', bg: '#F1E6DC', shirt: '#8D6E63', hair: 'sides', hairColor: '#C9C9C9', beard: 'full', hearingAid: true, wrinkles: true },
  { id: 'fatou', name: 'Fatou', description: 'Développeuse, se déplace en fauteuil roulant.', tags: ['femme', 'adulte', 'handicap'], skin: 's6', bg: '#FFF1CC', shirt: '#FFB703', hair: 'afro', hairColor: '#2B1B12', wheelchair: true, earrings: '#FB8500' },
  { id: 'tom', name: 'Tom', description: 'Alternant, curieux de tout.', tags: ['homme', 'jeune'], skin: 's1', bg: '#D6F8EC', shirt: '#06D6A0', hair: 'curly', hairColor: '#C1440E', freckles: true },
  { id: 'ines', name: 'Inès', description: 'Directrice, bientôt à la retraite.', tags: ['femme', 'senior'], skin: 's2', bg: '#EDE1FB', shirt: '#9B5DE5', hair: 'bun', hairColor: '#ECECEC', glasses: 'round', wrinkles: true },
  { id: 'karan', name: 'Karan', description: 'Responsable qualité, porte un turban.', tags: ['homme', 'adulte'], skin: 's4', bg: '#FDE4DC', shirt: '#1D3557', head: 'turban', headColor: '#E76F51', beard: 'full', hairColor: '#1A1A1A' },
  { id: 'sam', name: 'Sam', description: 'UX designer, non-binaire.', tags: ['non-binaire', 'jeune'], skin: 's3', bg: '#D9F4FA', shirt: '#00B4D8', hair: 'undercut', hairColor: '#7B2CBF', earrings: '#FFD166' },
  { id: 'noah', name: 'Noah', description: 'Expert accessibilité, non-voyant, utilise une canne blanche.', tags: ['homme', 'adulte', 'handicap'], skin: 's6', bg: '#FFDDE5', shirt: '#EF476F', hair: 'curly', hairColor: '#111111', glasses: 'dark', cane: true },
  { id: 'lea', name: 'Léa', description: 'Juriste, porte un implant cochléaire.', tags: ['femme', 'jeune', 'handicap'], skin: 's1', bg: '#E0E6FF', shirt: '#4361EE', hair: 'long', hairColor: '#E2B65A', implant: true },
  { id: 'malik', name: 'Malik', description: 'Consultant, la soixantaine.', tags: ['homme', 'senior'], skin: 's5', bg: '#DDF0E4', shirt: '#2D6A4F', hair: 'curly', hairColor: '#9E9E9E', glasses: 'rect', beard: 'short', wrinkles: true }
];

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) + amt, g = ((n >> 8) & 255) + amt, b = (n & 255) + amt;
  r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hairBack(c) {
  const h = c.hairColor;
  switch (c.hair) {
    case 'bob': return `<path d="M56 96 C52 52 78 38 100 38 C124 38 150 52 144 96 L146 128 C130 136 70 136 54 128 Z" fill="${h}"/>`;
    case 'long': return `<path d="M58 90 C54 48 80 36 100 36 C122 36 148 48 142 90 L150 170 C120 182 80 182 50 170 Z" fill="${h}"/>`;
    case 'afro': return `<g fill="${h}"><circle cx="100" cy="74" r="54"/><circle cx="58" cy="92" r="24"/><circle cx="142" cy="92" r="24"/></g>`;
    case 'bun': return `<circle cx="100" cy="40" r="17" fill="${h}"/>`;
    default: return '';
  }
}

function hairFront(c) {
  const h = c.hairColor;
  switch (c.hair) {
    case 'short': return `<path d="M63 92 C58 50 84 40 102 40 C126 40 144 54 137 92 C134 74 124 62 104 62 C92 70 76 70 63 92 Z" fill="${h}"/>`;
    case 'bob': return `<path d="M62 96 C60 58 82 48 100 48 C120 48 140 58 138 96 C128 78 118 66 102 64 C96 76 78 84 62 96 Z" fill="${h}"/>`;
    case 'long': return `<path d="M62 100 C58 56 84 46 102 46 C122 46 142 58 138 100 C132 80 122 64 108 60 C98 74 80 82 62 100 Z" fill="${h}"/>`;
    case 'afro': return `<path d="M64 84 C70 60 86 54 100 54 C116 54 132 60 136 84 C124 72 112 68 100 68 C88 68 76 72 64 84 Z" fill="${h}"/>`;
    case 'bun': return `<path d="M63 92 C60 56 84 46 100 46 C118 46 140 56 137 92 C130 70 116 62 100 62 C84 62 70 70 63 92 Z" fill="${h}"/>`;
    case 'curly': return `<g fill="${h}">${[[70, 70], [82, 58], [97, 53], [112, 55], [126, 62], [134, 76], [64, 84], [138, 88]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13"/>`).join('')}</g>`;
    case 'undercut': return `<path d="M66 84 C66 74 66 70 70 66 L70 92 Z" fill="${shade(SKIN[c.skin], -35)}"/><path d="M134 84 L134 66 C136 70 136 74 136 92 Z" fill="${shade(SKIN[c.skin], -35)}"/>` +
      `<path d="M70 72 C68 44 96 34 116 40 C134 46 142 60 132 72 C118 62 100 74 70 72 Z" fill="${h}"/>`;
    case 'sides': return `<path d="M63 100 C60 82 64 72 70 68 L72 96 Z M137 100 C140 82 136 72 130 68 L128 96 Z" fill="${h}"/>`;
    default: return '';
  }
}

function eyes(c, e) {
  const ink = '#2B2140';
  if (c.glasses === 'dark') return ''; // les lunettes noires couvrent les yeux
  const L = 84, R = 116, Y = 96;
  switch (e) {
    case 'happy': return `<path d="M${L - 6} ${Y + 2} Q${L} ${Y - 6} ${L + 6} ${Y + 2}" stroke="${ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M${R - 6} ${Y + 2} Q${R} ${Y - 6} ${R + 6} ${Y + 2}" stroke="${ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    case 'encouraging': return `<path d="M${L - 6} ${Y + 1} Q${L} ${Y - 5} ${L + 6} ${Y + 1}" stroke="${ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/><ellipse cx="${R}" cy="${Y}" rx="4.5" ry="5.5" fill="${ink}"/><circle cx="${R + 1.5}" cy="${Y - 2}" r="1.5" fill="#fff"/>`;
    case 'thinking': return `<ellipse cx="${L + 3}" cy="${Y - 2}" rx="4.5" ry="5.5" fill="${ink}"/><ellipse cx="${R + 3}" cy="${Y - 2}" rx="4.5" ry="5.5" fill="${ink}"/>`;
    case 'surprised': return `<circle cx="${L}" cy="${Y}" r="7" fill="#fff" stroke="${ink}" stroke-width="2"/><circle cx="${L}" cy="${Y}" r="3.8" fill="${ink}"/><circle cx="${R}" cy="${Y}" r="7" fill="#fff" stroke="${ink}" stroke-width="2"/><circle cx="${R}" cy="${Y}" r="3.8" fill="${ink}"/>`;
    default: return `<ellipse cx="${L}" cy="${Y}" rx="4.5" ry="5.5" fill="${ink}"/><ellipse cx="${R}" cy="${Y}" rx="4.5" ry="5.5" fill="${ink}"/><circle cx="${L + 1.5}" cy="${Y - 2}" r="1.5" fill="#fff"/><circle cx="${R + 1.5}" cy="${Y - 2}" r="1.5" fill="#fff"/>`;
  }
}

function brows(c, e) {
  const col = c.head === 'hijab' || c.head === 'turban' ? '#2B1B12' : shade(c.hairColor || '#333', c.hairColor && parseInt(c.hairColor.slice(1), 16) > 0xAAAAAA ? -60 : -10);
  const s = `stroke="${col}" stroke-width="4" stroke-linecap="round" fill="none"`;
  switch (e) {
    case 'happy': case 'encouraging': return `<path d="M76 82 Q84 76 92 81" ${s}/><path d="M108 81 Q116 76 124 82" ${s}/>`;
    case 'thinking': return `<path d="M76 84 L92 84" ${s}/><path d="M108 79 Q116 72 124 78" ${s}/>`;
    case 'surprised': return `<path d="M76 79 Q84 71 92 77" ${s}/><path d="M108 77 Q116 71 124 79" ${s}/>`;
    case 'concerned': return `<path d="M76 86 L92 80" ${s}/><path d="M108 80 L124 86" ${s}/>`;
    default: return `<path d="M76 84 Q84 80 92 83" ${s}/><path d="M108 83 Q116 80 124 84" ${s}/>`;
  }
}

function mouth(c, e) {
  const lip = '#8E3B46';
  switch (e) {
    case 'happy': return `<path d="M86 116 Q100 134 114 116 Z" fill="${lip}"/><path d="M89 117 L111 117 L109 121 L91 121 Z" fill="#fff"/>`;
    case 'encouraging': return `<path d="M86 116 Q100 129 114 116" stroke="${lip}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    case 'thinking': return `<path d="M94 121 Q104 118 112 120" stroke="${lip}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    case 'surprised': return `<ellipse cx="100" cy="121" rx="6.5" ry="8" fill="${lip}"/>`;
    case 'concerned': return `<path d="M89 124 Q100 116 111 124" stroke="${lip}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    default: return `<path d="M89 118 Q100 126 111 118" stroke="${lip}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  }
}

function svg(c, e) {
  const skin = SKIN[c.skin];
  const skinD = shade(skin, -22);
  const parts = [];
  parts.push(`<rect width="200" height="200" fill="${c.bg}"/>`);

  if (c.wheelchair) {
    parts.push(`<g stroke="#4A4E69" stroke-width="7" stroke-linecap="round" fill="none"><path d="M44 200 L44 126 L30 118"/><path d="M156 200 L156 126 L170 118"/></g>`);
  }
  if (c.head === 'hijab') {
    parts.push(`<path d="M50 200 C46 168 58 150 66 140 C52 112 56 50 100 44 C144 50 148 112 134 140 C142 150 154 168 150 200 Z" fill="${c.headColor}"/>`);
  } else {
    parts.push(hairBack(c));
  }
  // corps
  parts.push(`<path d="M32 200 C32 164 58 146 100 146 C142 146 168 164 168 200 Z" fill="${c.shirt}"/>`);
  if (c.head !== 'hijab') {
    parts.push(`<path d="M88 124 L112 124 L113 150 Q100 160 87 150 Z" fill="${skinD}"/>`);
    parts.push(`<path d="M84 148 L100 166 L116 148" fill="none" stroke="${shade(c.shirt, -30)}" stroke-width="4" stroke-linejoin="round"/>`);
    parts.push(`<circle cx="64" cy="100" r="8" fill="${skinD}"/><circle cx="136" cy="100" r="8" fill="${skinD}"/>`);
  } else {
    parts.push(`<path d="M80 148 Q100 170 120 148" fill="none" stroke="${shade(c.headColor, -25)}" stroke-width="3"/>`);
  }
  // tête
  parts.push(c.head === 'hijab'
    ? `<ellipse cx="100" cy="98" rx="32" ry="38" fill="${skin}"/>`
    : `<ellipse cx="100" cy="94" rx="36" ry="42" fill="${skin}"/>`);
  if (c.wrinkles) parts.push(`<g stroke="${skinD}" stroke-width="1.6" fill="none" stroke-linecap="round"><path d="M70 101 l-4 3 M70 96 l-5 0 M130 101 l4 3 M130 96 l5 0"/><path d="M90 72 Q100 69 110 72"/></g>`);
  if (c.head === 'hijab') parts.push(`<path d="M66 92 C66 66 82 56 100 56 C118 56 134 66 134 92 C128 74 116 66 100 66 C84 66 72 74 66 92 Z" fill="${shade(c.headColor, -18)}"/>`);
  if (c.head === 'turban') {
    parts.push(`<path d="M60 86 C56 48 80 30 100 30 C120 30 144 48 140 86 C130 72 116 66 100 66 C84 66 70 72 60 86 Z" fill="${c.headColor}"/>`);
    parts.push(`<path d="M66 70 Q100 44 136 72 M64 80 Q100 56 138 82 M100 36 L100 66" stroke="${shade(c.headColor, -30)}" stroke-width="2.5" fill="none"/>`);
  }
  if (!c.head) parts.push(hairFront(c));
  if (c.freckles) parts.push(`<g fill="${shade(skin, -45)}">${[[78, 108], [84, 111], [90, 108], [110, 108], [116, 111], [122, 108]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.4"/>`).join('')}</g>`);
  if (e === 'happy' || e === 'encouraging') parts.push(`<g fill="#FF8FA3" opacity=".45"><ellipse cx="76" cy="110" rx="7" ry="4.5"/><ellipse cx="124" cy="110" rx="7" ry="4.5"/></g>`);

  parts.push(brows(c, e));
  parts.push(eyes(c, e));
  if (c.beard === 'full') parts.push(`<path d="M64 98 C64 132 82 140 100 140 C118 140 136 132 136 98 C132 118 124 126 116 126 C112 118 88 118 84 126 C76 126 68 118 64 98 Z" fill="${c.hairColor}"/>`);
  if (c.beard === 'short') parts.push(`<path d="M70 108 C72 132 86 138 100 138 C114 138 128 132 130 108 C126 124 116 130 100 130 C84 130 74 124 70 108 Z" fill="${c.hairColor}" opacity=".85"/>`);
  parts.push(mouth(c, e));
  // nez
  parts.push(`<path d="M100 100 Q96 108 100 110" stroke="${skinD}" stroke-width="3" fill="none" stroke-linecap="round"/>`);

  if (c.glasses === 'rect') parts.push(`<g fill="none" stroke="#2B2140" stroke-width="3"><rect x="72" y="88" width="24" height="17" rx="5"/><rect x="104" y="88" width="24" height="17" rx="5"/><path d="M96 95 L104 95 M72 94 L64 92 M128 94 L136 92"/></g>`);
  if (c.glasses === 'round') parts.push(`<g fill="none" stroke="#B5838D" stroke-width="3"><circle cx="84" cy="96" r="11"/><circle cx="116" cy="96" r="11"/><path d="M95 96 L105 96 M73 94 L64 92 M127 94 L136 92"/></g>`);
  if (c.glasses === 'dark') parts.push(`<g><rect x="70" y="87" width="27" height="18" rx="7" fill="#1A1A2E"/><rect x="103" y="87" width="27" height="18" rx="7" fill="#1A1A2E"/><path d="M97 94 L103 94 M70 93 L63 91 M130 93 L137 91" stroke="#1A1A2E" stroke-width="3"/><path d="M75 91 L82 91" stroke="#fff" stroke-width="2" opacity=".5"/></g>`);
  if (c.hearingAid) parts.push(`<path d="M138 90 C146 92 146 106 138 108" stroke="#E0C9A6" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="137" cy="101" r="2.5" fill="#9C8466"/>`);
  if (c.implant) parts.push(`<circle cx="142" cy="78" r="8" fill="#5C6B7A" stroke="#fff" stroke-width="2"/><path d="M142 86 C146 92 144 98 139 100" stroke="#5C6B7A" stroke-width="2.5" fill="none"/>`);
  if (c.earrings) parts.push(`<circle cx="64" cy="110" r="3.5" fill="${c.earrings}"/><circle cx="136" cy="110" r="3.5" fill="${c.earrings}"/>`);
  if (c.wheelchair) {
    parts.push(`<g stroke="#4A4E69" fill="none"><circle cx="20" cy="196" r="40" stroke-width="7"/><circle cx="180" cy="196" r="40" stroke-width="7"/>` +
      `<path d="M20 196 L20 156 M20 196 L54 176 M20 196 L-14 176 M180 196 L180 156 M180 196 L214 176 M180 196 L146 176" stroke-width="2.5"/></g>` +
      `<circle cx="20" cy="196" r="6" fill="#4A4E69"/><circle cx="180" cy="196" r="6" fill="#4A4E69"/>`);
  }
  if (c.cane) {
    parts.push(`<path d="M150 128 L60 210" stroke="#333" stroke-width="8" stroke-linecap="round"/><path d="M150 128 L60 210" stroke="#fff" stroke-width="5" stroke-linecap="round"/>` +
      `<path d="M82 190 L66 205" stroke="#E63946" stroke-width="5"/><ellipse cx="150" cy="130" rx="9" ry="8" fill="${skin}"/>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img"><title>${c.name}</title>${parts.join('')}</svg>\n`;
}

const EN_DESC = {"amina":"Engineer, wears a hijab.","lucas":"Project manager, wears glasses.","mei":"Design student.","jose":"Experienced trainer, wears a hearing aid.","fatou":"Developer, uses a wheelchair.","tom":"Apprentice, curious about everything.","ines":"Director, about to retire.","karan":"Quality manager, wears a turban.","sam":"UX designer, non-binary.","noah":"Accessibility expert, blind, uses a white cane.","lea":"Lawyer, has a cochlear implant.","malik":"Consultant in his sixties."};
const catalog = { expressions: EXPRESSIONS, characters: [] };
for (const c of CHARACTERS) {
  const dir = path.join(OUT, c.id);
  fs.mkdirSync(dir, { recursive: true });
  const images = {};
  for (const e of EXPRESSIONS) {
    fs.writeFileSync(path.join(dir, e + '.svg'), svg(c, e));
    images[e] = `assets/characters/${c.id}/${e}.svg`;
  }
  catalog.characters.push({ id: c.id, name: c.name, description: { fr: c.description, en: EN_DESC[c.id] || c.description }, tags: c.tags, images });
}
fs.writeFileSync(path.join(OUT, 'catalog.js'),
  '/* Répertoire des personnages — généré par tools/generate-avatars.js, éditable à la main.\n' +
  ' * Chaque personnage : id, name, description, tags (filtres de l\'écran d\'accueil), images par expression.\n' +
  ' * Expressions utilisées par les formats : ' + EXPRESSIONS.join(', ') + ' (repli sur "neutral"). */\n' +
  'window.MLS_CHARACTERS = ' + JSON.stringify(catalog, null, 2) + ';\n');
console.log('OK :', CHARACTERS.length, 'personnages x', EXPRESSIONS.length, 'expressions');
