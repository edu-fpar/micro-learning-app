# Skill MicroLearn : mettre un cours en forme pour le slideshow interactif

> **Tu es une IA et on t'a donné l'adresse de cette page ?** Elle contient tes instructions.
> Lis-la en entier, puis transforme le cours que l'enseignant·e te fournit en **un seul document Markdown**
> qui respecte exactement la syntaxe ci-dessous. Ce fichier sera collé dans *MicroLearn Studio*,
> qui le transforme en slideshow interactif (quiz, cartes à retourner, frises, dialogues avec personnages…).

---

## 1. Ta mission

1. **Lis le contenu fourni** (texte, plan, notes, PDF copié, etc.). Ne perds aucune information importante et n'invente aucun fait.
2. **Découpe-le en slides courtes** : une idée par slide, 40 à 80 mots de texte au maximum. Un module fait en général 8 à 20 slides.
3. **Pour chaque slide, choisis le format le plus engageant** (voir § 4). Alterne les formats : évite d'enchaîner plus de deux slides « Contenu » de suite.
4. **Ajoute de l'interactivité** : au moins un quiz toutes les 4 à 6 slides, des cartes pour le vocabulaire, une frise pour les dates, un dialogue pour introduire une situation.
5. **Fais parler des personnages** (rôles `mentor` et `peer` par défaut) dans les dialogues, conseils et quiz.
6. **Rends ta réponse** dans le format décrit au § 7.

Rédige le cours dans la langue demandée (par défaut celle du contenu fourni) et indique-la dans `lang`. Les exemples de cette page sont en français (version anglaise : skill-en.md), mais la syntaxe est identique en anglais : seuls les textes changent ; les identifiants de formats, de rôles et d'expressions restent en anglais/minuscules.

**Cours long ?** Au-delà d'environ 20 slides, découpe-le : soit en **chapitres** dans un même module (une slide `format-title` par chapitre), soit en **plusieurs modules** (voir § 2 bis) si l'enseignant·e le demande ou si le contenu dépasse 30 à 40 slides.

Si l'enseignant·e donne des consignes (durée, public, ton, nombre de slides, formats à privilégier), elles passent avant les recommandations de cette page. Ne change jamais la **syntaxe**.

---

## 2. Structure générale du fichier

Le fichier commence par un **en-tête YAML** entre deux lignes `---`, suivi des slides, **séparées par une ligne contenant uniquement `---`**.

```markdown
---
title: "Titre du module"
subtitle: "Micro-learning · 10 minutes"
description: "Une phrase qui donne envie de suivre le module."
duration: 10 min
author: "Nom de l'enseignant·e"
lang: fr
theme: violet
characters:
  mentor: "Le Guide Pédagogique"
  peer: "Le Collègue"
---

<!-- slide: format-title -->
### Premier titre
Texte de la première slide.

---

<!-- slide: format-content -->
### Deuxième slide
Texte…
```

### Champs de l'en-tête

| Champ | Obligatoire | Rôle |
|---|---|---|
| `title` | oui | Titre du module (entre guillemets s'il contient `:` ou `'`). |
| `subtitle` | non | Petit texte au-dessus du titre sur l'écran d'accueil. |
| `description` | conseillé | Une phrase de présentation sur l'écran d'accueil. |
| `duration` | conseillé | Durée estimée, ex. `10 min`. |
| `author` | non | Auteur·rice. |
| `theme` | non | Couleurs : `violet` (défaut), `ocean`, `sunset`, `forest`, `night`. |
| `characters` | conseillé | Les **rôles** de personnages et leur intitulé (voir § 5). |
| `lang` | **oui** | Langue du cours : `fr` ou `en` (d'autres langues viendront). Elle traduit les boutons et consignes du slideshow (Suivant, Valider, Réessayer…) et choisit les voix de lecture. **Mets toujours la langue dans laquelle tu rédiges le cours.** |
| `audio` | non | `off` pour désactiver la lecture à voix haute dans tout le module. |
| `audio-min` | non | Longueur (en caractères) à partir de laquelle un texte reçoit une icône d'écoute. Défaut : `120`. |
| `course` | non | Nom du **parcours** quand la formation compte plusieurs modules. |
| `module` / `modules` | non | Position de ce module et nombre total de modules du parcours, ex. `module: 2` et `modules: 4`. |
| `next` | non | Module suivant : `title` (et `url` facultative, pour une diffusion web ; ignorée en SCORM). |

### Règles impératives

- Une ligne `---` seule **sépare toujours deux slides**. N'utilise **jamais** `---` comme simple trait horizontal à l'intérieur d'une slide.
- Chaque slide commence par le commentaire `<!-- slide: format-xxx -->` (voir § 4), puis éventuellement d'autres commentaires `<!-- clé: valeur -->`.
- Chaque slide a **un seul titre principal**, de niveau `###`. Les sous-titres `####` ne servent qu'au format Onglets.
- Les commentaires `<!-- … -->` ne s'affichent pas : ils servent de réglages.
- Le reste est du Markdown standard : **gras**, *italique*, listes, liens, tableaux, `code`.
- N'invente **aucun chemin d'image**. N'utilise une image (`![texte alternatif](chemin)`) que si l'enseignant·e t'en fournit le chemin ou l'URL ; sinon, choisis un format qui n'en a pas besoin. Donne toujours un texte alternatif descriptif.

### 2 bis. Parcours en plusieurs modules

Chaque module est un document Markdown complet et autonome (son propre en-tête, ses propres slides). **C'est toi qui numérotes les modules et qui les relies entre eux.**

**Procédure :**

1. Planifie d'abord le découpage : liste les N modules dans l'ordre, chacun avec un titre court et distinct (5 à 15 slides par module).
2. Dans l'en-tête de **chaque** module, renseigne :
   - `course` : le **même nom de parcours** dans tous les modules (copie-le à l'identique, au caractère près) ;
   - `module` : la position du module, de `1` à N ;
   - `modules` : N, **identique dans tous les modules** ;
   - `next` → `title` : le `title` **exact** du module suivant (module k+1) ;
   - même `lang`, mêmes rôles dans `characters` et même `theme` dans tous les modules, pour une expérience cohérente.
3. **Dernier module** (module N) : pas de champ `next`.
4. Chaque module commence par une slide `format-title` (avec `<!-- eyebrow: Module k -->` par exemple) et se termine par une courte slide de conclusion qui annonce le module suivant.
5. `url` : **ne l'ajoute que si l'enseignant·e indique que les modules seront publiés sur le web, un intranet ou une clé USB.** Dans ce cas, utilise `url: "../<dossier>/index.html"`, où `<dossier>` est le titre du module suivant mis en minuscules, sans accents, chaque suite de caractères autres que lettres et chiffres remplacée par un tiret, sans tiret au début ni à la fin (ex. « Les contrastes et les couleurs » → `les-contrastes-et-les-couleurs`). C'est le nom du dossier créé par l'export ZIP. Ne mets jamais d'`url` pour une diffusion SCORM.

**Exemple : module 2 d'un parcours de 3 modules**

```markdown
---
title: "Les formulaires accessibles"
course: "Accessibilité numérique"
module: 2
modules: 3
next:
  title: "Les contrastes et les couleurs"
lang: fr
theme: ocean
characters:
  mentor: "Le Guide Pédagogique"
  peer: "Le Collègue"
---
```

Le module 1 aurait `module: 1` et `next` → `title: "Les formulaires accessibles"` ; le module 3, `module: 3` et aucun `next`.

L'écran de fin de chaque module affiche la progression dans le parcours (« Module 2 / 3 ») et présente le module suivant.

---

## 3. Réglages de slide (commentaires)

| Commentaire | Effet |
|---|---|
| `<!-- slide: format-quiz -->` | Format de la slide (obligatoire). |
| `<!-- character-role: mentor -->` | Personnage qui porte la slide (dialogue, conseil, quiz, couverture). |
| `<!-- character-expression: happy -->` | Expression du personnage. |
| `<!-- eyebrow: Chapitre 2 -->` | Petit libellé au-dessus du titre (format Couverture). |
| `<!-- button: Commencer -->` | Texte du bouton (format Couverture). |
| `<!-- badge: Astuce -->` | Texte du badge (format Conseil). |
| `<!-- audio: all -->` | Icône d'écoute sur tous les textes de la slide, même courts. |
| `<!-- audio: off -->` | Aucune lecture à voix haute sur cette slide (ex. quand le texte lu gâcherait l'exercice). |
| `<!-- chapter: Nom du chapitre -->` | Ouvre un chapitre sur cette slide. Chaque slide `format-title` en ouvre déjà un automatiquement (`<!-- chapter: no -->` pour l'éviter). |

**Expressions disponibles** : `neutral`, `happy`, `encouraging`, `thinking`, `surprised`, `concerned`.

---

## 4. Les formats de slides

### `format-title` — Couverture / début de chapitre
Grand titre, accroche, personnage ou image, bouton pour démarrer. À utiliser pour la **première slide** et pour ouvrir chaque grande partie.

```markdown
<!-- slide: format-title -->
<!-- character-role: mentor -->
<!-- character-expression: happy -->
<!-- eyebrow: Module 1 -->
### Bienvenue dans l'univers de la photosynthèse
En 10 minutes, découvrez comment les plantes fabriquent leur énergie.
```

### `format-content` — Contenu
Texte, listes, tableaux. Une image seule sur sa ligne s'affiche à côté du texte.

```markdown
<!-- slide: format-content -->
### Les ingrédients de la photosynthèse
La plante a besoin de trois éléments :

- la **lumière** du soleil
- l'**eau** puisée par les racines
- le **dioxyde de carbone** de l'air
```

### `format-dialogue` — Dialogue entre personnages
Chaque citation `>` est une réplique, affichée une à une. Pour changer d'interlocuteur, mets un commentaire `character-role` avant la réplique, **ou** commence la réplique par `@role:` ou `@role(expression):`.

```markdown
<!-- slide: format-dialogue -->
<!-- character-role: peer -->
<!-- character-expression: thinking -->
### Une question de départ
> Dis, pourquoi les feuilles sont-elles vertes ?

> @mentor(happy): Grâce à la chlorophylle ! C'est elle qui capte la lumière.

> @peer(surprised): Ah, c'est donc elle le panneau solaire de la plante !
```

Idéal pour : introduire une situation, poser une problématique, conclure le module (une seule réplique suffit).

### `format-conseil` — Conseil porté par un personnage
Encadré « astuce » avec le personnage en grand. Une citation `>` à l'intérieur est mise en valeur.

```markdown
<!-- slide: format-conseil -->
<!-- character-role: mentor -->
<!-- character-expression: encouraging -->
<!-- badge: Moyen mnémotechnique -->
### Retenir l'équation
Pense à « **CO₂ + eau + lumière → sucre + O₂** ».

> La plante mange de la lumière et respire ce que nous expirons !
```

### `format-quiz` — Quiz
- `- [x]` = bonne réponse, `- [ ]` = mauvaise réponse.
- **Plusieurs `[x]`** = quiz à choix multiples (bouton Valider).
- Après une réponse, ajoute ` :: explication` pour un retour personnalisé (conseillé pour les mauvaises réponses).
- Une citation `>` à la fin = explication générale affichée après la réponse.
- Le personnage réagit automatiquement (content / inquiet).
- 3 à 5 propositions, une seule question par slide.

```markdown
<!-- slide: format-quiz -->
<!-- character-role: mentor -->
<!-- character-expression: thinking -->
### Quel gaz la plante rejette-t-elle ?
- [ ] Le dioxyde de carbone :: Non, c'est celui qu'elle absorbe.
- [x] Le dioxygène :: Exact, c'est un « déchet » précieux pour nous.
- [ ] L'azote
- [ ] La vapeur d'eau :: Elle en rejette aussi, mais ce n'est pas le produit de la photosynthèse.

> La photosynthèse produit du sucre et rejette du dioxygène.
```

### `format-flashcards` — Cartes à retourner
Vocabulaire, définitions, notions clés. Syntaxe : `- **Terme** :: Définition`. 3 à 8 cartes.

```markdown
<!-- slide: format-flashcards -->
### Le vocabulaire clé
Retournez chaque carte pour découvrir sa définition.

- **Chlorophylle** :: Pigment vert qui capte la lumière.
- **Stomate** :: Petit orifice de la feuille par où entrent et sortent les gaz.
- **Glucose** :: Sucre fabriqué par la plante, sa source d'énergie.
```

### `format-timeline` — Frise chronologique
Dates, étapes d'un processus, procédure ordonnée. Syntaxe : `- **Repère** :: Description`. 3 à 7 étapes.

```markdown
<!-- slide: format-timeline -->
### Les étapes de la photosynthèse
- **1. Captation** :: La chlorophylle absorbe la lumière.
- **2. Absorption** :: Les racines puisent l'eau, les stomates captent le CO₂.
- **3. Transformation** :: L'énergie lumineuse fabrique du glucose.
- **4. Rejet** :: Le dioxygène est libéré dans l'air.
```

### `format-tabs` — Onglets (accordéon sur mobile)
Plusieurs facettes d'une même notion. Chaque sous-titre `####` crée un onglet. 2 à 6 onglets.

```markdown
<!-- slide: format-tabs -->
### Où se passe la photosynthèse ?
#### Les feuilles
Elles concentrent la chlorophylle et captent le maximum de lumière.

#### Les tiges vertes
Certaines plantes, comme les cactus, réalisent la photosynthèse dans leurs tiges.

#### Les algues
Elles réalisent la photosynthèse dans l'eau et produisent une grande partie de l'oxygène terrestre.
```

### `format-hotspots` — Image interactive
**Seulement si une image est fournie.** Points cliquables sur l'image. Syntaxe : `- X,Y :: **Titre** :: Texte`, où X et Y sont des pourcentages (0 à 100) depuis le coin supérieur gauche. Si tu ne connais pas l'image, place les points de façon régulière et signale à l'enseignant·e qu'il faudra ajuster les coordonnées.

```markdown
<!-- slide: format-hotspots -->
### Anatomie d'une feuille
Cliquez sur les points pour explorer la feuille.

![Schéma en coupe d'une feuille](images/feuille.png)

- 20,30 :: **Épiderme** :: Couche protectrice transparente.
- 50,55 :: **Chloroplastes** :: Là où se déroule la photosynthèse.
- 75,85 :: **Stomate** :: Ouverture pour les échanges gazeux.
```


### Formats bêta : schémas interactifs

Ces 7 formats (en test) transforment une liste en schéma que l'apprenant explore partie par partie. Syntaxe commune : `- **Partie** :: explication` (libellé de 1 à 3 mots) ; une citation `>` facultative sert de **synthèse**, révélée seulement quand toutes les parties ont été explorées.

| Format | Quand l'utiliser | Éléments | Options |
|---|---|---|---|
| `format-puzzle` | les composantes d'un tout (pièces à remettre en place) | 2 à 6 | — |
| `format-pyramid` | une hiérarchie ; le 1er élément est au **sommet** | 2 à 7 | — |
| `format-funnel` | un filtrage, du plus large au plus étroit | 2 à 7 | — |
| `format-cycle` | des étapes qui reviennent en boucle | 2 à 8 | `<!-- center: … -->` |
| `format-process` | une méthode, des étapes successives | 2 à 7 | — |
| `format-matrix` | deux critères croisés ; ordre : haut-gauche, haut-droite, bas-gauche, bas-droite | 4 | `<!-- axis-x: … -->`, `<!-- axis-y: … -->` |
| `format-hub` | un concept central et ses composantes | 2 à 8 | `<!-- center: … -->` (sinon le titre) |

```markdown
<!-- slide: format-cycle -->
<!-- center: Apprendre par l'expérience -->
### Le cycle de Kolb
- **Expérience concrète** :: Vivre une situation.
- **Observation réfléchie** :: Prendre du recul, décrire.
- **Conceptualisation** :: En tirer une règle.
- **Expérimentation active** :: La tester ailleurs.

> Apprendre, c'est boucler ce cycle encore et encore.
```

Utilise-les quand la **structure de l'idée** correspond à la forme, au plus un ou deux par module. Comme ils sont en bêta, préfère les formats principaux en cas de doute.

---

## 5. Les personnages

- Dans l'en-tête, `characters` déclare des **rôles** (identifiant court en minuscules → intitulé affiché).
- L'apprenant·e choisit lui-même ou elle-même l'apparence de chaque rôle au lancement, parmi un répertoire varié (âges, genres, origines, situations de handicap). **Ne décris donc jamais l'apparence physique** des personnages dans le texte.
- Tout rôle utilisé dans une slide **doit être déclaré** dans l'en-tête.
- Deux rôles suffisent en général : `mentor` (la personne qui guide) et `peer` (un·e collègue ou camarade qui pose les questions de l'apprenant·e). Tu peux en ajouter (ex. `client: "Le Client"`).
- Les personnages s'adressent à l'apprenant·e avec un ton chaleureux et simple. Choisis le tutoiement ou le vouvoiement selon le public et garde-le dans tout le module.

---

## 6. Bonnes pratiques pédagogiques

- **Slide 1** : `format-title`. **Slide 2** : souvent un `format-dialogue` qui pose la problématique ou l'enjeu.
- **Dernière slide** : un dialogue court ou un conseil qui récapitule et encourage.
- Titres courts et parlants (moins de 60 caractères), de préférence sous forme de question ou d'affirmation.
- Phrases courtes, vocabulaire adapté au public, une notion par slide.
- Les quiz vérifient ce qui vient d'être vu ; les mauvaises réponses doivent être plausibles et leurs explications utiles.
- Accessibilité : texte alternatif pour chaque image, pas d'information transmise uniquement par la couleur.
- Lecture à voix haute : elle est automatique (textes longs, dialogues, éléments ouverts). Écris des phrases qui sonnent bien à l'oral ; évite les abréviations obscures et les symboles lus de travers. N'ajoute `<!-- audio: all -->` que si c'est utile.

---

## 7. Format de ta réponse

1. Rends **chaque module dans son propre bloc de code** Markdown (un seul bloc si le cours tient en un module), dans l'ordre, chacun précédé d'une ligne « Module k / N : titre » hors du bloc (balisé ```` ```markdown ````), du premier `---` de l'en-tête jusqu'à la dernière slide, pour que l'enseignant·e puisse le copier d'un clic.
2. Si un exemple de code doit figurer *dans* une slide, utilise des tildes `~~~` pour ce bloc intérieur (pour ne pas casser ton bloc de réponse).
3. **Après** le bloc, ajoute au maximum 5 lignes : nombre de slides, formats utilisés, points à vérifier par l'enseignant·e (images à fournir, coordonnées à ajuster, choix pédagogiques discutables).
4. Ne mets aucun autre texte dans le bloc de code.

### Vérification avant d'envoyer

- [ ] L'en-tête commence et finit par `---` et contient `title`, `lang` et `characters`.
- [ ] Chaque slide commence par `<!-- slide: format-… -->` avec un format de la liste du § 4 (formats bêta compris).
- [ ] Les slides sont séparées par une ligne `---` seule, sans aucun `---` décoratif.
- [ ] Chaque slide a exactement un titre `###`.
- [ ] Chaque quiz a au moins une réponse `[x]`.
- [ ] Les cartes et les étapes de frise utilisent `**Terme** :: texte`.
- [ ] Tous les rôles utilisés sont déclarés dans `characters`.
- [ ] Aucune image inventée ; chaque image a un texte alternatif.
- [ ] Plusieurs modules : même `course` (à l'identique) et même `modules` partout ; `module` numéroté de 1 à N sans trou ; `next.title` = `title` exact du module suivant ; pas de `next` dans le dernier ; `url` seulement si une diffusion web est demandée.

---

## 8. Phrase à utiliser par l'enseignant·e

> « Lis les instructions sur [adresse de cette page] et mets en forme le cours suivant pour MicroLearn : … »
>
> Pour un parcours : « … et découpe-le en 3 modules (diffusion web) : … »

*Source de vérité de la syntaxe : MicroLearn Studio. Cette page décrit la version 1.0.*
