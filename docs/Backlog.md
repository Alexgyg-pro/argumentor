# Argumentor Backlog

---

## Backlog court terme

##### isDirty

On dirait que toutes les modifications ne conduisent pas à l'affichage d'une alerte avant l'ouverture d'un autre argumentaire ou la création d'un nouveau. Vérifier et si nécessaire, corriger.

##### Forma list

En tant qu'utilisateur je veux qu'il me soit donné le choix entre descriptif et normatif (descriptif par défaut), mais qu'il y ait sur la liste également Esthétique en mode disabled. Ceci aussi bien sur la liste du formulaire de l'argumentaire que celui du formulaire d'argument.

##### Logo

Il ne faut pas un graphique, mais il faut y mettre un lien vers l'accueil de l'application.

##### Sample folder scan

Si on veut ajouter des argumentaires dans le dossier samples et qu'ils apparaissent dans l'onglet Exemples de l'aide, il faut aussi mettre à jour le fichier HelpModal. Il vaut mieux qu'il regarde ce qu'il y a dans ce dossier et qu'il le liste.

##### Improve pdf layout

Les textes sont un peu gros, revoir les couleurs.

##### Composant boutons crud

En tant que développeur, les boutons Ajouter, Modifier, Déplacer, Supprimer un argument pourraient être un composant à part. Ça simplifierait le code de ArgumentNode.

##### File split

En tant que développeur, je veux que ArgumentTree et ArgumentNode se retrouvent dans deux fichiers distincts afin d'alléger l'actuel ArgumentTree.jsx.

---

## Backlog long terme

##### Argumentaire esthétique

En tant qu'utilisateur, je veux pouvoir créer un argumentaire de type esthétique (beau/laid), en plus des types descriptif et normatif. Ce type introduit une troisième dimension d'évaluation : la **résonance**, en plus de la validité et de la pertinence. Le système de scoring devra être étendu pour intégrer cette troisième composante dans le calcul du poids.

##### Sophismes

En tant qu'utilisateur, je veux pouvoir associer un argument à un ou plusieurs sophismes connus (ad hominem, pente glissante, homme de paille…). Cela permettrait d'identifier les failles rhétoriques dans sa propre position ou dans celle de l'adversaire.

##### Paires de débats

Certaines structures de débat sont récurrentes et asymétriques : expert vs bon sens, modéré vs extrémiste (avec la prime à l'extrémiste), majorité vs minorité, etc. Chaque paire implique des stratégies argumentatives différentes selon le camp. Prévoir une bibliothèque de paires avec des guides de structure.

##### Argument à double emploi

Un même fait peut servir des positions opposées selon la série de prémisses dans laquelle il s'insère. Exemple : « Il y a beaucoup d'étrangers dans les prisons françaises » peut argumenter pour une politique migratoire plus stricte (droite) ou pour l'existence d'une discrimination systémique (gauche). Permettre qu'un argument puisse être instancié dans deux branches opposées de l'arbre, avec des rôles différents, sans être considéré comme une contradiction.

##### Dédoublement de branches selon l'interlocuteur

On ne débat pas de la même façon avec un interlocuteur qui accepte certaines prémisses de base qu'avec un autre qui les conteste. Exemple : l'argument citant l'ISS n'a pas le même poids face à quelqu'un qui accepte l'exploration spatiale et face à un platiste. Permettre de dupliquer ou de conditionner certaines branches de l'arbre selon le profil de l'interlocuteur. Lié à la fonctionnalité multi-argumentaire.

##### Multi-argumentaire

Les débats étant souvent complexes, Argumentor doit pouvoir gérer plusieurs argumentaires en parallèle — par exemple pour adapter sa position selon l'interlocuteur (plus à droite, plus à gauche, expert, néophyte). Lié au dédoublement de branches.

##### Argumentor collaboratif

Version avec backend, base de données et comptes utilisateurs, permettant à des équipes de travailler sur un même argumentaire. La version locale gratuite serait maintenue en parallèle.

---

## Terminé

##### Calculations : value, weight, global score

Implémentation complète du système de scoring : valeur utilisateur (0,0–1,0), validité et pertinence calculées récursivement depuis les enfants, poids via courbe en S (tanh), score global ±10. Les champs calculés ne sont plus stockés dans le JSON.

##### Forma heritage

Lorsqu'un argument est créé ou déplacé, il hérite de la forme de l'argument parent.

##### Default cause

Lorsqu'un argument est déplacé, lui et tous ses enfants prennent une cause neutre.

##### Unuseful controls

Dans le formulaire d'argument, les contrôles inutiles ont été masqués ou supprimés. Les options "value" et "weight" retirées du sélecteur de natura.

##### Close button

Hover du bouton de fermeture des formulaires corrigé.

##### Improve help texts

Textes de l'aide révisés, section scoring ajoutée dans Théorie et Mode d'emploi.

##### GitHub / Déploiement

Projet versionné sur GitHub, déployé sur Vercel : https://argumentor-a33q.vercel.app/
