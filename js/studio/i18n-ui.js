/*!
 * Textes de l'interface du Studio et du Format Lab (FR / EN).
 */
(function (MLS) {
  'use strict';

  MLS.i18n.add('fr', {
    // commun
    'c.studio': 'Studio', 'c.lab': 'Format Lab', 'c.docs': 'Docs', 'c.language': 'Langue de l’interface',
    'c.cancel': 'Annuler', 'c.ok': 'Continuer', 'c.close': 'Fermer', 'c.save': 'Enregistrer', 'c.preview': 'Aperçu',
    'c.desktop': 'Bureau', 'c.deviceDesktop': 'Vue bureau', 'c.deviceTablet': 'Vue tablette', 'c.deviceMobile': 'Vue mobile', 'c.mobile': 'Mobile',
    'c.deviceGroup': 'Type d’écran', 'c.tablet': 'Tablette', 'c.resize': 'Redimensionner les panneaux',
    'c.custom': 'perso', 'c.modified': 'modifié', 'c.dateLocale': 'fr-FR',
    // studio : barre
    's.file': 'Fichier', 's.new': 'Nouveau cours', 's.open': 'Ouvrir un fichier .md…', 's.sample': 'Charger le cours d’exemple', 's.sampleDiagrams': 'Exemple : schémas interactifs (test)', 's.confirmSampleDiagrams': 'Charger l’exemple « schémas interactifs » ? Le brouillon actuel sera sauvegardé dans l’historique.',
    's.downloadMd': 'Télécharger le Markdown', 's.version': 'Version', 's.versionTitle': 'Enregistrer une version (Ctrl+S)',
    's.history': 'Historique', 's.historyTitle': 'Historique des versions', 's.export': 'Exporter',
    's.tabEdit': 'Édition', 's.tabPreview': 'Aperçu',
    // studio : éditeur
    's.editorAria': 'Éditeur Markdown', 's.insert': 'Insérer une slide', 's.editorTheme': 'Thème de l’éditeur clair/sombre',
    's.editorTextarea': 'Contenu Markdown du cours', 's.formatsHeader': 'Formats disponibles', 's.createFormat': 'Créer un format…',
    's.openLab': 'Ouvrir le Format Lab', 's.slideStatus': 'Slide {n} / {total}', 's.line': 'Ligne {n}',
    's.draftSaved': 'Brouillon enregistré', 's.draftLocal': 'Brouillon local', 's.storageFull': 'Stockage plein : exportez votre Markdown',
    's.editing': 'Modification…', 's.inserted': 'Slide « {name} » insérée.', 's.errorOf': 'Erreur de {kind} : {msg}',
    's.kind.template': 'gabarit', 's.kind.script': 'script',
    // studio : aperçu
    's.cast': 'Choisir les personnages et les voix', 's.welcome': 'Tester l’écran d’accueil apprenant',
    's.sync': 'Synchroniser l’aperçu avec la position du curseur', 's.popup': 'Ouvrir l’aperçu dans un nouvel onglet',
    's.iframe': 'Aperçu du module', 's.popupBlocked': 'Le navigateur a bloqué la fenêtre. Autorisez les pop-ups pour ce site.',
    // avertissements du parseur
    'w.frontmatter': 'Front-matter illisible : {msg}', 'w.unknownFormat': 'Format inconnu « {format} » (rendu en format-content).',
    'w.unknownRole': 'Rôle « {role} » non déclaré dans le front-matter (characters).', 'w.noSlides': 'Aucune slide : séparez vos slides par une ligne « --- ».',
    'w.moduleRange': 'En-tête : module ({n}) est supérieur à modules ({total}).',
    // versions
    's.historyIntro': 'Les versions sont enregistrées dans ce navigateur (localStorage). Pensez à télécharger le Markdown pour une sauvegarde durable.',
    's.snapTitle': 'Enregistrer une version', 's.snapLabel': 'Nom de la version', 's.snapHelp': 'Ex. : « Relecture client », « Ajout du quiz final »…',
    's.snapDefault': 'Version du {date}', 's.snapSaved': 'Version « {label} » enregistrée.', 's.snapFull': 'Stockage du navigateur plein : supprimez d’anciennes versions.',
    's.histEmpty': 'Aucune version enregistrée.', 's.histEmptyHint': 'Utilisez le bouton « Version » ou Ctrl+S.', 's.auto': 'Automatique',
    's.slidesN': '{n} slides', 's.identical': 'identique au brouillon', 's.diff': 'Écart avec le brouillon : {add} / {del} lignes',
    's.restore': 'Restaurer', 's.previewTab': 'Aperçu dans un nouvel onglet', 's.rename': 'Renommer', 's.downloadThis': 'Télécharger le .md', 's.delete': 'Supprimer',
    's.confirmRestore': 'Restaurer « {label} » ? Le brouillon actuel sera d’abord sauvegardé automatiquement.',
    's.beforeRestore': 'Avant restauration de « {label} »', 's.restored': 'Version restaurée.', 's.renamePrompt': 'Nouveau nom :',
    's.confirmDelete': 'Supprimer définitivement la version « {label} » ?',
    's.confirmNew': 'Créer un nouveau cours ? Le brouillon actuel sera sauvegardé dans l’historique.', 's.beforeNew': 'Avant nouveau cours',
    's.confirmSample': 'Charger le cours d’exemple ? Le brouillon actuel sera sauvegardé dans l’historique.', 's.beforeSample': 'Avant chargement de l’exemple',
    's.beforeOpen': 'Avant ouverture de {name}', 's.opened': '{name} ouvert.', 's.unnamed': 'Version sans nom',
    // export
    's.exportTitle': 'Exporter le module', 's.exportType': 'Type d’export',
    's.exZip': 'Paquet ZIP', 's.exZipDesc': 'Dossier autonome (index.html + assets). Clé USB, intranet, GitHub Pages.',
    's.exHtml': 'Fichier HTML unique', 's.exHtmlDesc': 'Tout intégré dans un seul fichier, à envoyer par mail ou à déposer partout.',
    's.exScorm': 'SCORM 1.2', 's.exScormDesc': 'ZIP avec imsmanifest.xml : progression et score remontés au LMS.',
    's.exGo': 'Générer et télécharger', 's.exBuilding': 'Assemblage du paquet…', 's.exDone': '{file} généré ({size} Mo).',
    's.exSummary': '{slides} slides · {roles} rôle(s) · {chars} personnages au choix · {media} image(s) locale(s)',
    's.exCustom': ' · {n} format(s) personnalisé(s)', 's.exLang': 'Langue du module : {lang}',
    's.exNoDeps': 'Aucune dépendance externe : Bootstrap, icônes, moteur Markdown et polices sont inclus.',
    's.exFetch': 'Impossible de lire « {url} ». L’export nécessite que le Studio soit servi en http(s) (GitHub Pages, serveur local…) et non ouvert en file://.',
    's.exMissing': 'Fichier introuvable : {url} ({status})', 's.exRemote': 'Image distante (nécessite Internet) : {url}',
    's.exNoLocal': 'Image locale introuvable, ignorée : {url}',
    's.formatsUpdated': 'Formats mis à jour depuis le Format Lab.',

    // Format Lab
    'l.title': 'Format Lab', 'l.import': 'Importer', 'l.importTitle': 'Importer des formats (.json)', 'l.exportAll': 'Exporter',
    'l.exportAllTitle': 'Exporter tous les formats personnalisés (.json)', 'l.formats': 'Formats', 'l.new': 'Nouveau',
    'l.editAria': 'Édition du format', 'l.name': 'Nom', 'l.id': 'Identifiant', 'l.idTitle': 'Utilisé dans le Markdown : <!-- slide: identifiant -->', 'l.icon': 'Icône',
    'l.category': 'Catégorie', 'l.description': 'Description / mode d’emploi',
    'l.tabTemplate': 'Gabarit', 'l.tabCss': 'CSS', 'l.tabJs': 'Script', 'l.tabSample': 'Markdown d’exemple', 'l.tabI18n': 'Textes FR/EN',
    'l.tabData': 'Données', 'l.tabHelp': 'Aide',
    'l.saveBtn': 'Enregistrer', 'l.duplicate': 'Dupliquer', 'l.exportOne': 'Exporter ce format', 'l.reset': 'Réinitialiser', 'l.delete': 'Supprimer',
    'l.dirty': 'Modifications non enregistrées', 'l.liveTest': 'Test en direct', 'l.testTheme': 'Thème de test', 'l.testLang': 'Langue de test',
    'l.cast': 'Changer les personnages et les voix', 'l.refresh': 'Recharger (réinitialise l’interactivité)', 'l.previewAria': 'Aperçu du format',
    'l.confirmDiscard': 'Des modifications ne sont pas enregistrées. Les abandonner ?',
    'l.needName': 'Donnez un nom au format.', 'l.badId': 'Identifiant invalide.', 'l.idExists': 'L’identifiant « {id} » existe déjà.',
    'l.overrideBuiltin': '« {id} » est un format intégré : votre version le remplacera. Continuer ?',
    'l.badTemplate': 'Gabarit invalide : {msg}', 'l.badScript': 'Script invalide : {msg}', 'l.badI18n': 'Textes FR/EN : JSON invalide ({msg}).',
    'l.saveFailed': 'Impossible d’enregistrer (stockage plein ?).', 'l.saved': 'Format « {name} » enregistré. Il est disponible dans le Studio.',
    'l.copyCreated': 'Copie créée : pensez à l’enregistrer.', 'l.copySuffix': ' (copie)',
    'l.confirmReset': 'Revenir à la version d’origine de ce format intégré ?', 'l.resetDone': 'Format réinitialisé.',
    'l.confirmDelete': 'Supprimer définitivement le format « {name} » ? Les slides qui l’utilisent passeront en format Contenu.',
    'l.nothingToExport': 'Aucun format personnalisé ou modifié à exporter.', 'l.imported': '{n} format(s) importé(s).', 'l.badJson': 'Fichier JSON invalide : {msg}',
    'l.iconHelp': 'Nom d’une icône Bootstrap Icons, ex. <code class="text-warning">bi-stars</code>, <code class="text-warning">bi-puzzle</code>, <code class="text-warning">bi-map</code>. Liste : icons.getbootstrap.com',
    'l.dataNote': 'Données transmises au gabarit et au script (data) pour le Markdown d’exemple.\n   « character », « lines[].character », « cast » sont résolus par le player selon le choix de l’apprenant.',
    'l.i18nNote': 'Textes de l’interface du format, par langue : utilisables dans le gabarit avec {{t.cle}} et dans le script avec ctx.t("cle"). Les clés $name, $description, $category et $sample traduisent la fiche du format.',
    'l.blankName': 'Mon format', 'l.blankCategory': 'Personnalisés', 'l.blankDescription': 'Liste d’éléments dépliables. Syntaxe : « - **Élément** :: Détail ».',
    'l.blankSample': '### Mon nouveau format\nUne courte introduction.\n\n- **Premier point** :: Le détail du premier point.\n- **Deuxième point** :: Le détail du deuxième point.\n- **Troisième point** :: Le détail du troisième point.',
    'l.testCharMentor': 'Le Guide Pédagogique', 'l.testCharPeer': 'Le Collègue'
  });

  MLS.i18n.add('en', {
    'c.studio': 'Studio', 'c.lab': 'Format Lab', 'c.docs': 'Docs', 'c.language': 'Interface language',
    'c.cancel': 'Cancel', 'c.ok': 'Continue', 'c.close': 'Close', 'c.save': 'Save', 'c.preview': 'Preview',
    'c.desktop': 'Desktop', 'c.deviceDesktop': 'Desktop view', 'c.deviceTablet': 'Tablet view', 'c.deviceMobile': 'Mobile view', 'c.mobile': 'Mobile',
    'c.deviceGroup': 'Screen type', 'c.tablet': 'Tablet', 'c.resize': 'Resize panels',
    'c.custom': 'custom', 'c.modified': 'modified', 'c.dateLocale': 'en-GB',
    's.file': 'File', 's.new': 'New course', 's.open': 'Open a .md file…', 's.sample': 'Load the sample course', 's.sampleDiagrams': 'Sample: interactive diagrams (test)', 's.confirmSampleDiagrams': 'Load the “interactive diagrams” sample? The current draft will be saved in the history.',
    's.downloadMd': 'Download the Markdown', 's.version': 'Version', 's.versionTitle': 'Save a version (Ctrl+S)',
    's.history': 'History', 's.historyTitle': 'Version history', 's.export': 'Export',
    's.tabEdit': 'Edit', 's.tabPreview': 'Preview',
    's.editorAria': 'Markdown editor', 's.insert': 'Insert a slide', 's.editorTheme': 'Light/dark editor theme',
    's.editorTextarea': 'Markdown content of the course', 's.formatsHeader': 'Available formats', 's.createFormat': 'Create a format…',
    's.openLab': 'Open the Format Lab', 's.slideStatus': 'Slide {n} / {total}', 's.line': 'Line {n}',
    's.draftSaved': 'Draft saved', 's.draftLocal': 'Local draft', 's.storageFull': 'Storage full: export your Markdown',
    's.editing': 'Editing…', 's.inserted': '“{name}” slide inserted.', 's.errorOf': '{kind} error: {msg}',
    's.kind.template': 'Template', 's.kind.script': 'Script',
    's.cast': 'Choose characters and voices', 's.welcome': 'Test the learner welcome screen',
    's.sync': 'Sync the preview with the cursor position', 's.popup': 'Open the preview in a new tab',
    's.iframe': 'Module preview', 's.popupBlocked': 'The browser blocked the window. Allow pop-ups for this site.',
    'w.frontmatter': 'Unreadable front matter: {msg}', 'w.unknownFormat': 'Unknown format “{format}” (rendered as format-content).',
    'w.unknownRole': 'Role “{role}” is not declared in the front matter (characters).', 'w.noSlides': 'No slides: separate your slides with a “---” line.',
    'w.moduleRange': 'Header: module ({n}) is greater than modules ({total}).',
    's.historyIntro': 'Versions are stored in this browser (localStorage). Download the Markdown for a durable backup.',
    's.snapTitle': 'Save a version', 's.snapLabel': 'Version name', 's.snapHelp': 'E.g. “Client review”, “Final quiz added”…',
    's.snapDefault': 'Version of {date}', 's.snapSaved': 'Version “{label}” saved.', 's.snapFull': 'Browser storage is full: delete older versions.',
    's.histEmpty': 'No saved version yet.', 's.histEmptyHint': 'Use the “Version” button or Ctrl+S.', 's.auto': 'Automatic',
    's.slidesN': '{n} slides', 's.identical': 'same as the draft', 's.diff': 'Difference with the draft: {add} / {del} lines',
    's.restore': 'Restore', 's.previewTab': 'Preview in a new tab', 's.rename': 'Rename', 's.downloadThis': 'Download the .md', 's.delete': 'Delete',
    's.confirmRestore': 'Restore “{label}”? The current draft will be saved automatically first.',
    's.beforeRestore': 'Before restoring “{label}”', 's.restored': 'Version restored.', 's.renamePrompt': 'New name:',
    's.confirmDelete': 'Permanently delete version “{label}”?',
    's.confirmNew': 'Create a new course? The current draft will be saved in the history.', 's.beforeNew': 'Before new course',
    's.confirmSample': 'Load the sample course? The current draft will be saved in the history.', 's.beforeSample': 'Before loading the sample',
    's.beforeOpen': 'Before opening {name}', 's.opened': '{name} opened.', 's.unnamed': 'Untitled version',
    's.exportTitle': 'Export the module', 's.exportType': 'Export type',
    's.exZip': 'ZIP package', 's.exZipDesc': 'Self-contained folder (index.html + assets). USB stick, intranet, GitHub Pages.',
    's.exHtml': 'Single HTML file', 's.exHtmlDesc': 'Everything in one file, easy to email or upload anywhere.',
    's.exScorm': 'SCORM 1.2', 's.exScormDesc': 'ZIP with imsmanifest.xml: progress and score sent to the LMS.',
    's.exGo': 'Build and download', 's.exBuilding': 'Building the package…', 's.exDone': '{file} generated ({size} MB).',
    's.exSummary': '{slides} slides · {roles} role(s) · {chars} characters to choose from · {media} local image(s)',
    's.exCustom': ' · {n} custom format(s)', 's.exLang': 'Module language: {lang}',
    's.exNoDeps': 'No external dependency: Bootstrap, icons, Markdown engine and fonts are included.',
    's.exFetch': 'Cannot read “{url}”. Exporting requires the Studio to be served over http(s) (GitHub Pages, local server…), not opened as file://.',
    's.exMissing': 'File not found: {url} ({status})', 's.exRemote': 'Remote image (requires Internet): {url}',
    's.exNoLocal': 'Local image not found, skipped: {url}',
    's.formatsUpdated': 'Formats updated from the Format Lab.',
    'l.title': 'Format Lab', 'l.import': 'Import', 'l.importTitle': 'Import formats (.json)', 'l.exportAll': 'Export',
    'l.exportAllTitle': 'Export all custom formats (.json)', 'l.formats': 'Formats', 'l.new': 'New',
    'l.editAria': 'Format editing', 'l.name': 'Name', 'l.id': 'Identifier', 'l.idTitle': 'Used in the Markdown: <!-- slide: identifier -->', 'l.icon': 'Icon',
    'l.category': 'Category', 'l.description': 'Description / how to use',
    'l.tabTemplate': 'Template', 'l.tabCss': 'CSS', 'l.tabJs': 'Script', 'l.tabSample': 'Sample Markdown', 'l.tabI18n': 'FR/EN texts',
    'l.tabData': 'Data', 'l.tabHelp': 'Help',
    'l.saveBtn': 'Save', 'l.duplicate': 'Duplicate', 'l.exportOne': 'Export this format', 'l.reset': 'Reset', 'l.delete': 'Delete',
    'l.dirty': 'Unsaved changes', 'l.liveTest': 'Live test', 'l.testTheme': 'Test theme', 'l.testLang': 'Test language',
    'l.cast': 'Change characters and voices', 'l.refresh': 'Reload (resets interactivity)', 'l.previewAria': 'Format preview',
    'l.confirmDiscard': 'You have unsaved changes. Discard them?',
    'l.needName': 'Give the format a name.', 'l.badId': 'Invalid identifier.', 'l.idExists': 'Identifier “{id}” already exists.',
    'l.overrideBuiltin': '“{id}” is a built-in format: your version will replace it. Continue?',
    'l.badTemplate': 'Invalid template: {msg}', 'l.badScript': 'Invalid script: {msg}', 'l.badI18n': 'FR/EN texts: invalid JSON ({msg}).',
    'l.saveFailed': 'Could not save (storage full?).', 'l.saved': 'Format “{name}” saved. It is now available in the Studio.',
    'l.copyCreated': 'Copy created: remember to save it.', 'l.copySuffix': ' (copy)',
    'l.confirmReset': 'Revert this built-in format to its original version?', 'l.resetDone': 'Format reset.',
    'l.confirmDelete': 'Permanently delete format “{name}”? Slides using it will fall back to the Content format.',
    'l.nothingToExport': 'No custom or modified format to export.', 'l.imported': '{n} format(s) imported.', 'l.badJson': 'Invalid JSON file: {msg}',
    'l.iconHelp': 'Name of a Bootstrap Icons icon, e.g. <code class="text-warning">bi-stars</code>, <code class="text-warning">bi-puzzle</code>, <code class="text-warning">bi-map</code>. List: icons.getbootstrap.com',
    'l.dataNote': 'Data passed to the template and the script (data) for the sample Markdown.\n   “character”, “lines[].character” and “cast” are resolved by the player from the learner’s choices.',
    'l.i18nNote': 'Interface texts of the format, per language: use them in the template with {{t.key}} and in the script with ctx.t("key"). The $name, $description, $category and $sample keys translate the format card.',
    'l.blankName': 'My format', 'l.blankCategory': 'Custom', 'l.blankDescription': 'List of expandable items. Syntax: "- **Item** :: Detail".',
    'l.blankSample': '### My new format\nA short introduction.\n\n- **First point** :: Details of the first point.\n- **Second point** :: Details of the second point.\n- **Third point** :: Details of the third point.',
    'l.testCharMentor': 'The Guide', 'l.testCharPeer': 'The Colleague'
  });

  /** Sélecteur de langue de l'interface (FR / EN), à placer dans la barre de navigation. */
  MLS.i18n.mountSwitcher = function (container) {
    var cur = MLS.i18n.uiLang();
    container.innerHTML = '<div class="dropdown">' +
      '<button class="btn btn-sm btn-st dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" title="' + MLS.i18n.t(cur, 'c.language') + '">' +
      '<i class="bi bi-translate"></i> ' + cur.toUpperCase() + '</button><ul class="dropdown-menu dropdown-menu-end">' +
      MLS.i18n.langs().map(function (l) {
        return '<li><button class="dropdown-item' + (l === cur ? ' active' : '') + '" data-ui-lang="' + l + '" lang="' + l + '">' +
          l.toUpperCase() + ' · ' + MLS.i18n.names[l] + '</button></li>';
      }).join('') + '</ul></div>';
    container.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ui-lang]');
      if (!b || b.getAttribute('data-ui-lang') === cur) return;
      MLS.i18n.setUiLang(b.getAttribute('data-ui-lang'));
      location.reload();
    });
  };
})(window.MLS);
