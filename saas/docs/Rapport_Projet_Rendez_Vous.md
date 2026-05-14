# PAGE DE GARDE

**Nom de l’établissement :** [À compléter]  
**Département / Filière :** [À compléter]  
**Module :** [À compléter]  

**Titre du projet :**  
## Application de gestion des rendez-vous en langage C avec site web

**Réalisé par (Membres du groupe) :**  
- Oussama  
- Othmane  
- Ilyass  
- Yahya  

**Nom de l’encadrant :** [À compléter]  

**Année universitaire :** [À compléter]  

*(Espace réservé pour le logo de l’établissement)*

---

# REMERCIEMENTS

Nous tenons tout d'abord à remercier chaleureusement notre professeur encadrant pour son accompagnement, ses précieux conseils et son soutien tout au long de la réalisation de ce projet.

Nos remerciements s'adressent également à notre établissement, pour nous avoir fourni le cadre et les ressources nécessaires au bon déroulement de notre formation.

Nous tenons à exprimer notre profonde gratitude envers tous les membres du groupe (Oussama, Othmane, Ilyass et Yahya) pour leur engagement, leur esprit d'équipe et le travail rigoureux fourni lors de chaque étape du développement.

Enfin, nous remercions toute personne ayant contribué, de près ou de loin, à l'aboutissement de ce projet, que ce soit par leurs conseils techniques ou leurs encouragements.

---

# RÉSUMÉ

Ce rapport présente la conception et le développement d'une application complète de gestion des rendez-vous. Le projet s'articule autour d'un programme principal développé en langage C, permettant de gérer efficacement les emplois du temps à travers une interface console intuitive. L'objectif principal est de fournir une solution logicielle robuste capable de gérer l'ajout, la modification, la consultation, la recherche et la suppression de rendez-vous tout en évitant les conflits horaires.

Pour atteindre cet objectif, nous avons implémenté des algorithmes stricts de validation de données et de contrôle de chevauchement. Parallèlement au développement logiciel, un site web vitrine a été conçu en utilisant les technologies web modernes (React, Next.js, Tailwind CSS) afin de présenter le projet, ses fonctionnalités et son interface aux utilisateurs potentiels.

---

# TABLE DES MATIÈRES


1. INTRODUCTION GÉNÉRALE ................................................................... 7
2. CHAPITRE 1 — ANALYSE ET ÉTUDE DU BESOIN ................................................ 8
   1.1 Présentation générale du projet
   1.2 Problématique
   1.3 Objectifs du projet
   1.4 Cahier des charges
3. CHAPITRE 2 — CONCEPTION DU SYSTÈME ...................................................... 12
   2.1 Architecture générale
   2.2 Conception des données
   2.3 Organisation des fonctions
   2.4 Algorithmes importants
4. CHAPITRE 3 — IMPLÉMENTATION EN LANGAGE C ................................................ 16
   3.1 Environnement de développement
   3.2 Bibliothèques utilisées
   3.3 Variables globales
   3.4 Interface console
   3.5 Gestion des rendez-vous
   3.6 Validation des données
5. CHAPITRE 4 — SITE WEB DU PROJET ........................................................ 20
   4.1 Présentation du site
   4.2 Technologies utilisées
   4.3 Structure du site
   4.4 Design du site
6. CHAPITRE 5 — TESTS ET VALIDATION ....................................................... 22
   5.1 Objectif des tests
   5.2 Tests réalisés
   5.3 Résultats obtenus
   5.4 Gestion des erreurs
7. CHAPITRE 6 — DIFFICULTÉS ET AMÉLIORATIONS .............................................. 25
   6.1 Difficultés rencontrées
   6.2 Solutions apportées
   6.3 Améliorations futures
8. CONCLUSION GÉNÉRALE .................................................................... 27
9. BIBLIOGRAPHIE .......................................................................... 28
10. ANNEXES ................................................................................ 29


# INTRODUCTION GÉNÉRALE

## Contexte du projet
Dans notre vie quotidienne comme dans le milieu professionnel, la gestion du temps est primordiale. Les rendez-vous s'accumulent (réunions professionnelles, consultations médicales, engagements personnels) et nécessitent une organisation rigoureuse. L'informatisation de cette gestion est devenue incontournable pour optimiser son emploi du temps.

## Problématique
La gestion manuelle des rendez-vous, souvent réalisée sur des agendas papier ou des outils non adaptés, présente de nombreuses difficultés. Elle entraîne fréquemment des pertes d'informations, des chevauchements horaires (conflits), une mauvaise organisation et une grande perte de temps lorsqu'il s'agit de rechercher un rendez-vous spécifique.

## Solution proposée
Pour répondre à ce besoin, nous avons conçu et développé une application informatique codée en langage C. Ce système permet d'automatiser entièrement la gestion des rendez-vous, assurant la fiabilité des données et empêchant les erreurs de planification grâce à des vérifications algorithmiques poussées.

## Objectifs du projet
Le but principal de ce projet est de :
- Faciliter l'organisation et la planification au quotidien.
- Éviter catégoriquement les conflits horaires.
- Améliorer la gestion, la recherche et la consultation des données.
- Fournir une vitrine numérique de l'outil via un site web dédié.

## Technologies utilisées
- **Langage C :** Pour le développement logique du cœur de l'application.
- **Terminal / Console :** Pour l'interface utilisateur du programme principal.
- **React, Next.js, Tailwind CSS :** Pour le développement de l'application web de présentation et de l'interface graphique moderne.
- **Outils de développement :** Compilateurs C (GCC), IDEs (VS Code), et outils de gestion de version.

## Organisation du rapport
Ce rapport est structuré en six chapitres. Le premier aborde l'analyse des besoins, le second détaille la conception architecturale et algorithmique. Le troisième chapitre est dédié à l'implémentation en langage C. Le quatrième présente la conception du site web. Le cinquième expose les tests effectués, et enfin, le dernier chapitre discute des difficultés rencontrées et des perspectives d'amélioration.

---

# CHAPITRE 1 — ANALYSE ET ÉTUDE DU BESOIN

## 1.1 Présentation générale du projet
Le projet consiste en une application logicielle de "Gestion des Rendez-vous". Son rôle est d'agir comme un assistant numérique de planification. Il s'adresse à tout utilisateur (professionnel ou particulier) souhaitant structurer son emploi du temps. 
L'application repose sur l'automatisation de la prise de rendez-vous, une gestion stricte des dates et heures, une organisation structurée des informations et un accès rapide (consultation et recherche) aux événements enregistrés.

## 1.2 Problématique
Sans l'aide d'un système informatique, l'organisation est sujette à l'erreur humaine. Les utilisateurs font face à :
- Des oublis fréquents de rendez-vous importants.
- Des chevauchements horaires (double réservation sur une même plage horaire).
- Des difficultés et une perte de temps pour rechercher un événement passé ou futur.
Notre projet vient résoudre ces problèmes en apportant de la rigueur et de l'automatisation.

## 1.3 Objectifs du projet
**Objectif principal :**
Créer une application robuste en langage C permettant une gestion complète et fiable des rendez-vous.

**Objectifs secondaires :**
- Ajouter, modifier et supprimer des rendez-vous.
- Rechercher rapidement un événement via plusieurs critères.
- Trier et afficher les rendez-vous de manière chronologique.
- Vérifier automatiquement les conflits horaires avant chaque ajout.
- Accompagner le logiciel d'un site web vitrine pour la présentation.

## 1.4 Cahier des charges

### 1.4.1 Fonctionnalités principales
- **Ajouter un rendez-vous :** Saisie obligatoire d'une date (jour, mois, année), d'une heure de début, d'une heure de fin, d'un lieu et d'une catégorie (personnel, professionnel, médical).
- **Supprimer un rendez-vous :** Suppression d'une entrée spécifique via son identifiant (ID) unique.
- **Modifier un rendez-vous :** Possibilité de mettre à jour la date, les heures, le lieu ou la catégorie d'un rendez-vous existant.
- **Rechercher un rendez-vous :** Le système offre une recherche multicritères : par ID, par date, par heure, par lieu ou par catégorie.
- **Consulter les rendez-vous :** Affichage de tous les rendez-vous enregistrés, filtrage pour une date précise, ou affichage sur une période donnée.

### 1.4.2 Contraintes techniques
- Le projet doit être développé exclusivement en langage C.
- L'interface utilisateur s'exécute dans une console/terminal.
- L'architecture de données repose sur l'utilisation de tableaux (pas de base de données externe ni de listes chaînées complexes pour la première version).
- Gestion simple et efficace de la mémoire.

### 1.4.3 Contraintes fonctionnelles
- **Validation des données :** Les dates doivent exister (ex: pas de 30 Février) et le format horaire doit être respecté.
- **Contrôle des conflits :** Le système doit interdire l'ajout d'un rendez-vous si la plage horaire est déjà occupée.
- **Catégories limitées :** L'utilisateur est restreint à un ensemble de catégories prédéfinies pour maintenir l'uniformité des données.

---

# CHAPITRE 2 — CONCEPTION DU SYSTÈME

## 2.1 Architecture générale
Le programme a été divisé en plusieurs modules pour faciliter le développement en équipe. L'architecture s'articule autour d'un **menu principal** qui redirige vers différents sous-modules :
1. **Module Ajout :** Saisie et vérification.
2. **Module Suppression :** Recherche par ID et décalage en mémoire.
3. **Module Consultation :** Tri et affichage formaté.
4. **Module Recherche :** Moteur de filtrage des tableaux.
5. **Module Modification :** Altération sécurisée des données existantes.

## 2.2 Conception des données
En l'absence de base de données ou de structures avancées dans le cahier des charges initial, nous avons opté pour une approche par tableaux parallèles de taille fixe (`MAX_RDV`).
Les variables globales structurant les données sont :
- `ids[]` : Identifiant entier unique.
- `jours[]`, `mois[]`, `annees[]` : Tableaux d'entiers pour la date.
- `heuresDebut[]`, `minutesDebut[]`, `heuresFin[]`, `minutesFin[]` : Tableaux d'entiers pour les plages horaires.
- `lieux[][]`, `categories[][]` : Tableaux à deux dimensions de caractères (chaînes) pour le texte.

Cette organisation permet un accès direct via l'indice du tableau pour manipuler toutes les caractéristiques d'un rendez-vous.

## 2.3 Organisation des fonctions

**Partie Menu (Oussama) :**
- `main()` : Boucle principale du programme.
- `afficherMenu()` : Affichage de l'interface de choix.

**Partie Affichage :**
- `afficherUnRendezVous(index)` : Affiche proprement les données de l'index donné.
- `afficherTousLesRendezVous()` : Parcours et affichage trié de tous les éléments.

**Partie Validation (Othmane) :**
- `dateValide()`, `periodeValide()`, `categorieValide()` : Fonctions booléennes (retournant 1 ou 0) empêchant toute saisie incohérente ou corrompue.

**Partie Ajout & Suppression :**
- `ajouterRendezVous()` : Intègre les validations et gère l'incrémentation du nombre de rendez-vous.
- `supprimerRendezVous()` : Gère l'écrasement de la case mémoire par décalage des éléments suivants.

**Partie Consultation (Ilyass) :**
- `consulterParDate()`, `consulterParPeriode()` : Filtre l'affichage global en fonction de critères temporels.

**Partie Recherche & Modification (Yahya) :**
- `rechercherParID()`, `rechercherParDate()`, `rechercherParLieu()`, `rechercherParCategorie()` : Itèrent sur les tableaux pour afficher les correspondances.
- `modifierRendezVous()` : Permet l'édition avec vérification des nouveaux conflits.

## 2.4 Algorithmes importants

- **Algorithme d'ajout :**
  Il boucle sur la saisie tant que `dateValide()` ou `categorieValide()` renvoient faux. Il calcule ensuite si la plage horaire se chevauche avec un index existant (`conflitRendezVous()`). Si tout est valide, il écrit dans `tableaux[nbRendezVous]` et incrémente `nbRendezVous`.

- **Algorithme de suppression :**
  Recherche l'indice `i` du rendez-vous correspondant à l'ID saisi. Puis, effectue une boucle de `j = i` jusqu'à `nbRendezVous - 1` pour écraser la case `j` par `j + 1`.

- **Algorithme de tri (pour l'affichage) :**
  L'affichage chronologique utilise un algorithme de tri par sélection adapté. Il recherche le plus petit élément non encore affiché (en comparant les dates puis les heures de début) et l'affiche, marquant son index dans un tableau `dejaAffiche[]`.

---

# CHAPITRE 3 — IMPLÉMENTATION EN LANGAGE C

## 3.1 Environnement de développement
Le code a été développé et compilé sous un environnement Windows à l'aide de l'IDE Visual Studio Code et du compilateur GCC (MinGW).

## 3.2 Bibliothèques utilisées
Seule la bibliothèque standard `stdio.h` a été utilisée, conformément aux restrictions du projet. Elle permet l'utilisation des fonctions essentielles d'entrée/sortie comme `printf` pour l'affichage console et `scanf` pour la récupération des saisies utilisateur.

## 3.3 Variables globales
Afin de faciliter l'accès aux données entre les différentes fonctions du programme sans utiliser de pointeurs complexes, nous avons défini :
- `MAX_RDV = 100` : Limite physique du nombre de rendez-vous.
- `TAILLE_TEXTE = 50` : Taille maximale des chaînes de caractères (lieux, catégories).
- `nbRendezVous` : Compteur du nombre actuel d'enregistrements.
- `prochainID` : Auto-incrémenté à chaque ajout pour garantir l'unicité de l'identifiant.

## 3.4 Interface console
L'interface est purement textuelle. Une attention particulière a été portée au formatage (lignes de séparation, alignements, zéros initiaux pour les dates `\%02d`) pour rendre l'expérience utilisateur claire et lisible, malgré l'absence d'interface graphique.

## 3.5 Gestion des rendez-vous
- **Ajout :** L'utilisateur est guidé étape par étape. Si une saisie est erronée, l'interface lui redemande spécifiquement cette information avant de poursuivre.
- **Suppression :** Le système exige l'ID précis pour éviter les suppressions accidentelles. Le décalage mémoire est instantané et transparent pour l'utilisateur.
- **Modification :** Les anciennes valeurs sont conservées en mémoire temporaire lors du processus de modification pour permettre une restauration si les nouvelles valeurs créent un conflit horaire inattendu.
- **Recherche & Consultation :** Les algorithmes parcourent l'ensemble des index valides (de `0` à `nbRendezVous - 1`) et affichent les fiches correspondantes de manière structurée.

## 3.6 Validation des données
La robustesse de l'application repose sur ces fonctions de contrôle :
- `dateValide()` : Prend en compte les années bissextiles et le nombre de jours exact par mois.
- `periodeValide()` : S'assure que l'heure de fin est strictement supérieure à l'heure de début.
- Contrôle des conflits : Convertit les heures en minutes absolues pour vérifier mathématiquement que la plage horaire `[debutNouveau, finNouveau]` n'intersecte aucune plage `[debutExistant, finExistant]`.

---

# CHAPITRE 4 — SITE WEB DU PROJET

## 4.1 Présentation du site
Afin de mettre en valeur notre travail et d'offrir une vitrine professionnelle au projet, un site web a été développé. Son rôle n'est pas d'exécuter le code C, mais de présenter l'application, d'expliquer son fonctionnement et de montrer des captures d'écran de l'interface.

## 4.2 Technologies utilisées
- **React & Next.js :** Pour la création des composants interactifs, la navigation fluide, le rendu performant et la structure globale de l'application web.
- **Tailwind CSS :** Pour le design, la mise en page, le style responsive et les animations grâce à une approche utilitaire moderne.
- **TypeScript :** Pour sécuriser et typer le code du frontend, évitant ainsi les erreurs d'exécution.

## 4.3 Structure du site
Le site est divisé en plusieurs sections clés :
- **Accueil :** Accroche visuelle et présentation rapide de l'outil.
- **Présentation :** Explication du contexte académique et des membres de l'équipe.
- **Fonctionnalités :** Liste détaillée des capacités de l'application (Ajout, Recherche, Gestion des conflits).
- **Galerie (Captures) :** Visualisation de l'application console en action.
- **Contact :** Formulaire et informations pour contacter l'équipe de développement.

## 4.4 Design du site
Le design a été pensé pour être moderne et de type "SaaS" (Software as a Service). 
- **Couleurs :** Choix d'une palette contrastée (mode sombre avec des accents lumineux) pour un effet premium.
- **Expérience Utilisateur (UX) :** Navigation intuitive, animations au survol, et typographie claire.
- **Responsive Design :** Le site s'adapte parfaitement aux écrans d'ordinateurs, de tablettes et de téléphones portables.

---

# CHAPITRE 5 — TESTS ET VALIDATION

## 5.1 Objectif des tests
L'objectif est de s'assurer que l'application réagit correctement à tous les cas d'usage, notamment les erreurs de saisie humaines, afin de garantir qu'elle ne plante (crash) jamais.

## 5.2 Tests réalisés
1. **Ajout valide :** Insertion de données correctes (Date valide, heures logiques).
2. **Ajout invalide :** Tentative de saisie du 31 Février, ou d'une heure de fin antérieure à l'heure de début.
3. **Conflit horaire :** Tentative d'ajout d'un rendez-vous de 10h à 12h alors qu'un rendez-vous existe de 11h à 13h le même jour.
4. **Suppression :** Suppression d'un ID inexistant, puis suppression valide et vérification de la nouvelle liste.
5. **Recherche :** Recherche par une catégorie mal orthographiée.

## 5.3 Résultats obtenus
Les résultats ont été conformes aux attentes. Le programme bloque systématiquement les données invalides grâce à nos boucles `do { ... } while(validation() == 0);`. Les conflits horaires sont détectés avec succès, empêchant la superposition d'événements.

## 5.4 Gestion des erreurs
- En cas de date erronée, le message *"Date invalide. Recommencez."* s'affiche, et l'utilisateur reste bloqué sur la saisie de la date.
- En cas de conflit horaire, l'ajout est annulé, le système affiche *"Conflit horaire"* et renvoie l'utilisateur au menu principal.

---

# CHAPITRE 6 — DIFFICULTÉS ET AMÉLIORATIONS

## 6.1 Difficultés rencontrées
- **Gestion des tableaux :** Gérer plusieurs tableaux parallèles pour représenter un seul objet conceptuel (un rendez-vous) s'est avéré complexe, notamment lors de la suppression où il faut décaler tous les tableaux de manière synchronisée.
- **Logique des conflits horaires :** Traduire le chevauchement horaire en algorithme mathématique sans faille a nécessité plusieurs itérations.
- **Travail collaboratif :** Intégrer les quatre parties (Oussama, Othmane, Ilyass, Yahya) dans un seul fichier C final tout en évitant les conflits de nommage de variables.

## 6.2 Solutions apportées
- Le problème des chevauchements horaires a été résolu en convertissant toutes les heures en une valeur absolue de minutes (`Heure * 60 + minutes`), ce qui simplifie grandement les comparaisons (`<` et `>`).
- Une communication constante et une définition claire des signatures de fonctions en amont du codage ont permis une intégration fluide du code de chaque membre.

## 6.3 Améliorations futures
- **Fichiers de sauvegarde :** Implémenter l'écriture et la lecture dans un fichier texte (via `fopen`, `fprintf`) pour conserver les rendez-vous après la fermeture du programme.
- **Structures (struct) :** Remplacer les multiples tableaux parallèles par un tableau unique de `struct RendezVous` pour optimiser le code.
- **Interface Graphique / Base de données :** Relier directement le cœur logique de l'application à l'interface Web (Next.js) et utiliser une base de données relationnelle pour la persistance.

---

# CONCLUSION GÉNÉRALE

Ce projet nous a permis de mettre en pratique nos connaissances théoriques en algorithmique et en langage C, tout en nous initiant aux défis du travail en équipe. L'application de gestion des rendez-vous répond avec succès à toutes les exigences du cahier des charges : elle est stable, sécurisée, empêche les erreurs humaines et fournit une interface console claire.

De plus, la conception du site web vitrine a enrichi notre expérience en nous permettant de toucher au développement web frontend moderne, apportant ainsi une dimension professionnelle complète à notre réalisation. Ce projet constitue une excellente base qui pourra être développée davantage à l'avenir, notamment par l'ajout d'une base de données et d'une interface graphique unifiée.

---

# BIBLIOGRAPHIE

- Cours magistraux et travaux dirigés d'algorithmique et programmation en C.
- Documentation officielle du Langage C (Standard Library `stdio.h`).
- Tutoriels et documentations web (Documentation officielle de React, Next.js et Tailwind CSS).
- Forums de développement (Stack Overflow) pour la résolution de problèmes spécifiques.

---

# ANNEXES

- Le code source complet (`prjt.c`) est joint avec le rapport.
- Le code source du site web (dossier `saas`) est disponible sur le dépôt du projet.
*(Insérer ici les captures d'écran, diagrammes, organigrammes et le planning de répartition des tâches du projet)*
