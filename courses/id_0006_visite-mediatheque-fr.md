---
title: "Bienvenue à la médiathèque"
subtitle: "Visite guidée · 5 minutes"
description: "Une petite visite entre collègues pour ta première semaine : les espaces, les bons réflexes, les personnes à connaître."
duration: 5 min
author: "Équipe de la médiathèque"
lang: fr
color: "#1f7a8c"
accent: "#e9b44c"
address: tu
score: off
jobs: [bibliothécaire, magasinier/magasinière, médiateur/médiatrice numérique, responsable de l'accueil]
dialogue-autoplay: on
exit: "view.html"
exit-label: "Revenir aux cours"
labels:
  p.moduleEyebrow: "Visite guidée"
  p.slide: "Étape {n}"
  p.slideOf: "Étape {n} sur {total}"
  p.slidesCount: "{n} étapes"
  p.resume: "Reprendre (étape {n})"
  p.start: "Commencer la visite"
  p.chooseCastHint: "Ils t’accompagnent pendant toute la visite. Tu pourras les changer à tout moment avec le bouton <i class=\"bi bi-people\"></i>."
  p.endTitle: "Visite terminée !"
  p.endThanks: "Merci d’avoir suivi la visite. À bientôt dans les rayons !"
  p.review: "Revoir la visite"
  p.upNext: "Et maintenant ?"
next:
  title: "Introduction à l'accessibilité UX"
  url: id_0001_accessibilite-fr.md
  label: "Ouvrir le module suivant"
characters:
  guide: "Ta guide"
  collegue: "Une collègue"
---

<!-- slide: format-title -->
<!-- character-role: guide -->
<!-- character-expression: happy -->
<!-- eyebrow: Première semaine -->
### Bienvenue dans l'équipe !
Cinq minutes pour découvrir les lieux et les bons réflexes, comme si on se promenait ensemble entre les rayons.

---

<!-- slide: format-prenom -->
<!-- character-role: guide -->
<!-- character-expression: happy -->
### Faisons connaissance
> Salut ! C'est moi qui te fais visiter. On se tutoie ? Dis-moi comment tu t'appelles.

---

<!-- slide: format-sms -->
### Un message avant l'ouverture
> @collegue: Coucou{, prenom} ! J'arrive à 9 h 50, c'est trop juste pour l'ouverture ?

> @guide(thinking): Un peu : on ouvre les portes à 10 h, mais il faut allumer les postes et vider la boîte de retours avant.

> @collegue(concerned): Ah… je ne savais pas pour la boîte de retours.

> @guide(happy): Pas de souci, c'est ta première semaine ! Viens à 9 h 30 demain, je te montrerai.

---

<!-- slide: format-menu -->
<!-- id: menu -->
<!-- character-role: guide -->
### Par quoi on commence ?
> @guide(happy): Alors{, prenom}, choisis une partie : je t'y emmène. Tu reviendras ici à la fin de chacune.

> @guide(encouraging): On continue ? Les parties déjà vues sont cochées.

> @guide(happy): Tu as tout vu, bravo ! Tu peux terminer la visite ou revoir une partie.

- [🛎️ L'accueil](#accueil) :: Là où tout commence
- [📚 Les mots de la maison](#mots) :: Cote, fantôme, désherbage…
- [🚐 Les réservations](#reservations "featured") :: Faire venir un livre d'une autre médiathèque

---

<!-- slide: format-dialogue -->
<!-- branch: accueil -->
<!-- character-role: collegue -->
<!-- character-expression: thinking -->
### Par où commencer ?
> Je ne sais même pas où se trouve la salle de pause… Par où on commence ?

> @guide(happy): Par l'accueil ! C'est là que tout se passe : inscriptions, retours, questions du public.

> @collegue(surprised): Même les questions sur les ordinateurs ?

> @guide(encouraging): Oui, l'accueil oriente vers l'espace numérique. Tu verras, on se relaie.

---

<!-- slide: format-quiz -->
<!-- character-role: guide -->
<!-- character-expression: thinking -->
### Un lecteur rapporte un livre abîmé. Que fais-tu ?
- [ ] Tu le remets en rayon :: Le prochain lecteur aurait la mauvaise surprise.
- [x] Tu le mets de côté pour la réparation :: Exact, et tu préviens l'équipe.
- [ ] Tu le jettes :: Pas si vite : beaucoup de livres se réparent.

> Un document abîmé passe toujours par la petite table « réparations ».

---

<!-- slide: format-flashcards -->
<!-- branch: mots -->
### Les mots de la maison
Retourne chaque carte pour découvrir le sens du mot.

- **Cote** :: L'étiquette au dos du livre qui indique où le ranger.
- **Fantôme** :: Le carton qu'on laisse à la place d'un document sorti du rayon.
- **Désherbage** :: Retirer des rayons les documents abîmés ou périmés.

---

<!-- slide: format-sms -->
<!-- branch: reservations -->
<!-- autoplay: off -->
### Une question de dernière minute
> @collegue(thinking): Dernière question : si un lecteur me demande un livre qu'on n'a pas ?

> @guide(encouraging): Tu peux proposer une réservation dans une autre médiathèque du réseau.

> @collegue(surprised): On peut faire ça ?

> @guide(happy): Oui, la navette passe deux fois par semaine. Les lecteurs adorent !

---

<!-- slide: format-dialogue -->
<!-- id: fin -->
<!-- character-role: guide -->
<!-- character-expression: happy -->
### On récapitule
> L'accueil oriente, les documents abîmés vont aux réparations, et la navette rend presque tout possible. Bienvenue parmi nous{, prenom} !
