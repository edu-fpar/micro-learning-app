/* Formats « schémas interactifs » : rendu et interactivité dans js/core/diagram.js */
(function () {
  function template(type) {
    return '<div class="dg dg-' + type + '">\n' +
      '  <div class="dg-head mls-rise">\n' +
      '    {{#title}}<h2 class="mls-title">{{{titleHtml}}}</h2>{{/title}}\n' +
      '    {{#hasText}}<div class="mls-prose">{{{text}}}</div>{{/hasText}}\n' +
      '  </div>\n' +
      '  <div class="dg-body mls-rise" style="animation-delay:.1s"></div>\n' +
      '  <template class="dg-data">{{#items}}<div><div class="dg-t">{{{term}}}</div><div class="dg-d">{{{def}}}{{{extra}}}{{{sub}}}</div></div>{{/items}}</template>\n' +
      '</div>';
  }

  var COMMON_FR = 'Syntaxe : « - **Partie** :: explication ». Une citation « > » sert de synthèse, révélée quand toutes les parties ont été explorées.';
  var COMMON_EN = 'Syntax: "- **Part** :: explanation". A "> " quote is a takeaway revealed once every part has been explored.';
  var COMMON_ES = 'Sintaxis: «- **Parte** :: explicación». Una cita «> » sirve de síntesis y se revela cuando se han explorado todas las partes.';

  var defs = [
    { type: 'pyramid', icon: 'bi-triangle', name: 'Pyramide', en: 'Pyramid', es: 'Pirámide',
      desc: 'Niveaux hiérarchiques, du sommet (1er élément) à la base. ', descEn: 'Hierarchical levels, from the top (1st item) to the base. ', descEs: 'Niveles jerárquicos, de la cima (1.er elemento) a la base. ',
      sample: '### La pyramide de Bloom\nDu plus simple (en bas) au plus exigeant (en haut).\n\n- **Créer** :: Produire une œuvre ou une solution originale.\n- **Évaluer** :: Justifier une décision, critiquer.\n- **Analyser** :: Décomposer, relier les parties.\n- **Appliquer** :: Utiliser une méthode dans une situation.\n- **Comprendre** :: Expliquer avec ses mots.\n- **Se souvenir** :: Restituer des faits.\n\n> On ne crée bien que ce que l\'on a d\'abord compris.' },
    { type: 'funnel', icon: 'bi-funnel', name: 'Entonnoir', en: 'Funnel', es: 'Embudo',
      desc: 'Étapes de filtrage ou de conversion, du plus large au plus étroit. ', descEn: 'Filtering or conversion stages, from widest to narrowest. ', descEs: 'Etapas de filtrado o de conversión, de la más amplia a la más estrecha. ',
      sample: '### De l\'information au souvenir\n- **Stimulations** :: Tout ce que perçoivent nos sens.\n- **Attention** :: Ce que l\'on sélectionne.\n- **Mémoire de travail** :: Ce que l\'on manipule un instant.\n- **Mémoire à long terme** :: Ce qui est consolidé.' },
    { type: 'cycle', icon: 'bi-arrow-repeat', name: 'Cycle', en: 'Cycle', es: 'Ciclo',
      desc: 'Étapes qui se répètent en boucle, avec lecture automatique. Option <!-- center: … --> pour un libellé central. ', descEn: 'Steps that repeat in a loop, with autoplay. Optional <!-- center: … --> label. ', descEs: 'Etapas que se repiten en bucle, con reproducción automática. Opción <!-- center: … --> para una etiqueta central. ',
      sample: '<!-- center: Apprendre par l\'expérience -->\n### Le cycle de Kolb\n- **Expérience concrète** :: Vivre une situation.\n- **Observation réfléchie** :: Prendre du recul, décrire.\n- **Conceptualisation** :: Tirer des règles générales.\n- **Expérimentation active** :: Tester dans une nouvelle situation.' },
    { type: 'process', icon: 'bi-chevron-double-right', name: 'Processus', en: 'Process', es: 'Proceso',
      desc: 'Étapes successives en chevrons (verticales sur mobile), avec lecture automatique. ', descEn: 'Successive steps as chevrons (vertical on mobile), with autoplay. ', descEs: 'Etapas sucesivas en forma de flechas (verticales en móvil), con reproducción automática. ',
      sample: '### Réviser efficacement\n- **Lire** :: Une première lecture active.\n- **Fermer** :: Fermer le cours.\n- **Se tester** :: Retrouver de mémoire.\n- **Corriger** :: Comparer et compléter.\n- **Espacer** :: Recommencer quelques jours plus tard.' },
    { type: 'matrix', icon: 'bi-grid', name: 'Matrice 2 × 2', en: '2 × 2 matrix', es: 'Matriz 2 × 2',
      desc: '4 quadrants (haut-gauche, haut-droite, bas-gauche, bas-droite). Axes : <!-- axis-x: … --> et <!-- axis-y: … -->. ', descEn: '4 quadrants (top-left, top-right, bottom-left, bottom-right). Axes: <!-- axis-x: … --> and <!-- axis-y: … -->. ', descEs: '4 cuadrantes (arriba a la izquierda, arriba a la derecha, abajo a la izquierda, abajo a la derecha). Ejes: <!-- axis-x: … --> y <!-- axis-y: … -->. ',
      sample: '<!-- axis-x: Urgence → -->\n<!-- axis-y: Importance → -->\n### La matrice d\'Eisenhower\n- **Planifier** :: Important, pas urgent.\n- **Faire** :: Important et urgent.\n- **Abandonner** :: Ni important ni urgent.\n- **Déléguer** :: Urgent mais peu important.' },
    { type: 'hub', icon: 'bi-diagram-3', name: 'Hub / concept central', en: 'Hub / central concept', es: 'Hub / concepto central',
      desc: 'Un concept central (le titre, ou <!-- center: … -->) et ses composantes autour. ', descEn: 'A central concept (the title, or <!-- center: … -->) and its components around it. ', descEs: 'Un concepto central (el título, o <!-- center: … -->) y sus componentes alrededor. ',
      sample: '<!-- center: Compétences -->\n### Les 4 C\n- **Esprit critique** :: Évaluer la fiabilité d\'une information.\n- **Créativité** :: Imaginer des solutions nouvelles.\n- **Collaboration** :: Travailler ensemble.\n- **Communication** :: Se faire comprendre.' },
    { type: 'puzzle', icon: 'bi-puzzle', name: 'Puzzle à assembler', en: 'Puzzle to assemble', es: 'Puzle para montar',
      desc: '2 à 6 pièces dispersées que l\'apprenant remet en place une à une pour reconstituer un tout. ', descEn: '2 to 6 scattered pieces the learner puts back one by one to rebuild the whole. ', descEs: 'De 2 a 6 piezas dispersas que quien aprende vuelve a colocar una a una para reconstruir el conjunto. ',
      sample: '### Les 4 piliers de l\'apprentissage\n- **Attention** :: Sélectionner l\'information utile.\n- **Engagement actif** :: Chercher, prédire, essayer.\n- **Retour d\'information** :: Savoir où l\'on s\'est trompé.\n- **Consolidation** :: Automatiser, dormir, espacer.\n\n> Les quatre piliers ensemble font un apprentissage solide.' }
  ];

  defs.forEach(function (d) {
    MLS.formats.register({
      id: 'format-' + d.type,
      name: d.name,
      icon: d.icon,
      category: 'Schémas interactifs',
      description: d.desc + COMMON_FR,
      sample: d.sample,
      i18n: {
        en: { $name: d.en, $category: 'Interactive diagrams', $description: d.descEn + COMMON_EN },
        es: { $name: d.es, $category: 'Diagramas interactivos', $description: d.descEs + COMMON_ES }
      },
      template: template(d.type),
      css: '',
      js: "MLS.diagram.mount(root, data, ctx, '" + d.type + "');"
    });
  });
})();
