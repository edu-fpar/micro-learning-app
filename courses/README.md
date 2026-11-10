# Cours publiés · Published courses

**Français** — Déposez ici vos cours Markdown pour les ouvrir dans la vue apprenant avec un code court.

- Nom du fichier : `id_<code>_<nom>.md`, par exemple `id_1234_accessibilite-fr.md`. Le code (`1234`) doit être unique ; le nom est libre (minuscules, chiffres, tirets).
- Lien à donner aux apprenants : `view.html?c=1234` (ou `view.html?c=1234_accessibilite-fr`, qui fonctionne même sans index).
- **Rien d'autre à faire** : déposez le fichier et commitez. Sur GitHub, une action régénère `index.json` automatiquement (`.github/workflows/courses-index.yml`). En attendant (ou ailleurs que sur GitHub), la vue apprenant trouve quand même le cours en lisant le dossier. Pour régénérer l'index à la main : `node tools/build-courses-index.js`.
- Images : un chemin relatif (`images/schema.png`) est cherché à côté du fichier `.md` ; `assets/…` désigne les images fournies avec l'application.
- Module suivant : dans l'en-tête, `next:` avec `title: "…"` et `url: id_1235_suite-fr.md` (lignes indentées en dessous) ouvre la suite dans la vue apprenant.

**English** — Put your Markdown courses here to open them in the learner view with a short code.

- File name: `id_<code>_<name>.md`, e.g. `id_1234_accessibility-en.md`. The code (`1234`) must be unique; the name is free (lowercase, digits, hyphens).
- Link for learners: `view.html?c=1234` (or `view.html?c=1234_accessibility-en`, which works even without the index).
- **Nothing else to do**: add the file and commit. On GitHub, an action rebuilds `index.json` automatically (`.github/workflows/courses-index.yml`). Meanwhile (or outside GitHub), the learner view still finds the course by reading the folder. To rebuild the index by hand: `node tools/build-courses-index.js`.
- Images: a relative path (`images/diagram.png`) is looked up next to the `.md` file; `assets/…` refers to the images bundled with the app.
- Next module: in the header, `next:` with `title: "…"` and `url: id_1235_next-en.md` (indented lines below it) opens the next module in the learner view.
