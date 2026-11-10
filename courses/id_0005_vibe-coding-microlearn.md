---
title: "Maîtriser le Vibe Coder : Le guide pour booster vos projets"
subtitle: "Micro-learning · Master Gestion"
description: "Apprenez à collaborer efficacement avec l'IA pour coder sans vous noyer dans les options."
duration: 12 min
author: "Enseignant Master Gestion"
lang: fr
theme: violet
characters:
  mentor: "Le Guide"
  peer: "L'Étudiant"
---

<!-- slide: format-title -->
<!-- character-role: mentor -->
<!-- character-expression: happy -->
<!-- eyebrow: Introduction -->
### Le grand bain du Vibe Coding
En 10 minutes, découvrez comment piloter des agents IA pour concevoir des applications et des outils sans vous noyer dans les choix techniques.

---

<!-- slide: format-dialogue -->
<!-- character-role: peer -->
<!-- character-expression: thinking -->
### Un peu de vertige...
> Dis, entre Excel, Python, Node.js et les plateformes de partage, je ne sais plus où donner de la tête. Il y a trop d'options !

> @mentor(encouraging): C'est normal ! Aujourd'hui, McKinsey mesure ses effectifs en « humains + agents » et vise des performances x10. L'important n'est pas de tout savoir coder, mais de savoir piloter.

---

<!-- slide: format-conseil -->
<!-- character-role: mentor -->
<!-- character-expression: happy -->
<!-- badge: Réflexe d'or -->
### Ne demandez jamais du code directement
Avant de lancer une IA sur une application, demandez-lui (ou à une autre IA) de vous aider à **rédiger un bon prompt**. 

> « Rédiger le prompt avec l'aide de l'IA m'a sauvé la mise : à sa lecture, on voit tout de suite ce qui manque ! » — Un ancien étudiant

---

<!-- slide: format-quiz -->
<!-- character-role: mentor -->
<!-- character-expression: thinking -->
### Quel est le premier réflexe à avoir avant de coder ?
- [ ] Foncer sur un IDE et écrire les premières lignes de code. :: Non, vous risquez de vous disperser.
- [x] Demander à l'IA de vous aider à rédiger un bon prompt structuré. :: Exact ! Cela permet d'identifier les manques en amont.
- [ ] Acheter un serveur web professionnel. :: Inutile pour commencer.

> Un bon prompt rédigé avec l'aide de l'IA clarifie instantanément vos besoins.

---

<!-- slide: format-title -->
<!-- character-role: mentor -->
<!-- character-expression: happy -->
<!-- eyebrow: Chapitre 2 -->
### Choisir ses outils et ses langages
Comment s'y retrouver entre Excel, Python et le web ?

---

<!-- slide: format-flashcards -->
### Les options bureautiques et locales
Retournez chaque carte pour comprendre comment gérer vos données.

- **Fichier Excel vide** :: L'IA vous fournit un modèle structuré et vous y insérez vos données.
- **Fichier Excel existant** :: À utiliser uniquement si vos données ne sont pas confidentielles.
- **Python (Local)** :: Idéal si vos données restent en local et si l'application nécessite des droits d'écriture sur le disque.

---

<!-- slide: format-content -->
### Attention aux applications web dans le navigateur
Lorsque vous créez une application web qui tourne directement dans le navigateur :
- Les navigateurs **n'ont pas le droit d'écrire** sur votre disque dur.
- Les modifications apportées peuvent **disparir à la fermeture** du navigateur.
- Si vous avez besoin d'une base de données et d'écrire sur le disque, privilégiez **Node.js** sur un serveur.

---

<!-- slide: format-quiz -->
<!-- character-role: peer -->
<!-- character-expression: surprised -->
### Pourquoi éviter une appli web simple si l'on veut stocker des données en local ?
- [ ] Parce que c'est trop cher.
- [x] Parce que le navigateur n'a pas les droits d'écriture sur le disque et les données risquent d'être perdues. :: Tout à fait, le stockage navigateur est volatile ou restreint.
- [ ] Parce que Python est incompatible avec le web.

> Pensez toujours à l'endroit où résident vos données avant de choisir la techno !

---

<!-- slide: format-title -->
<!-- character-role: mentor -->
<!-- character-expression: happy -->
<!-- eyebrow: Chapitre 3 -->
### Sécurité et partage des créations
Comment valider ses dépendances et montrer son travail au monde ?

---

<!-- slide: format-tabs -->
### Comment savoir si une librairie est sûre ?
#### Longévité
Demandez à l'IA depuis quand elle existe (gage de stabilité).
#### Actualisation
Vérifiez la date de sa dernière mise à jour pour éviter l'obsolescence.
#### Sécurité et adoption
Renseignez-vous sur d'éventuels problèmes de sécurité passés et sur les grands groupes qui l'utilisent.

---

<!-- slide: format-flashcards -->
### Où partager et déployer son application ?
Retournez chaque carte pour découvrir l'usage recommandé selon l'outil.

- **Google AI Studio** :: Parfait pour les expérimentations de prompts et de prototypes rapides.
- **Claude Artifacts** :: Idéal pour des démos interactives instantanées directement dans le chat.
- **Votre serveur web** :: Nom de domaine, hébergement et base de données pour un usage pro.
- **GitHub** :: Indispensable pour l'hébergement de code et le versioning.

---

<!-- slide: format-dialogue -->
<!-- character-role: peer -->
<!-- character-expression: happy -->
### Le mot de la fin
> Merci ! C'est beaucoup plus clair. Et du coup, il faut encore passer par la console ?

> @mentor(happy): De moins en moins ! Avec des outils comme Claude Code, la console devient optionnelle. Bon vibe coding à toi !