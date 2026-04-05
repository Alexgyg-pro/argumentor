# Argumentor

**Outil d'aide à la préparation d'un débat ou d'une négociation.**

→ [Accéder à l'application](#) *(lien à ajouter après déploiement)*

---

## À quoi ça sert ?

Argumentor permet d'organiser sa pensée avant un débat, une négociation, ou toute situation où l'on doit défendre une position face à un contradicteur.

L'idée centrale : un bon argument ne suffit pas. Il faut aussi anticiper les contre-arguments, savoir y répondre, et évaluer la solidité globale de sa position avant d'entrer dans le vif du sujet.

L'outil s'inspire d'une théorie de l'argumentation développée à l'université d'Oslo, qui distingue deux types de thèses — **descriptives** (vrai/faux) et **normatives** (bien/mal) — et deux dimensions pour évaluer la qualité d'un argument : sa **validité** et sa **pertinence**.

## Comment ça marche ?

On part d'une **thèse** (l'affirmation que l'on défend ou que l'on examine), puis on construit un **arbre d'arguments** :

- Chaque argument est *pour* ou *contre* sa thèse parente
- Un argument peut être soutenu ou contredit par des sous-arguments, et ainsi de suite
- Chaque argument porte sur la **validité** ou la **pertinence** de l'argument au-dessus de lui

L'application calcule automatiquement pour chaque argument une **validité**, une **pertinence** et un **poids** à partir de ses sous-arguments, en utilisant une courbe en S (diminishing returns : les premiers arguments ont beaucoup d'impact, les suivants de moins en moins). Un **score global** entre −10 et +10 donne une lecture immédiate de l'état de l'argumentaire.

Aucune donnée n'est envoyée à un serveur. L'argumentaire est sauvegardé en local au format JSON, exportable et réimportable.

## Fonctionnalités

- Arbre d'arguments récursif (profondeur illimitée)
- Codage automatique des arguments (P1, C2, p1c2P1…)
- Score calculé par argument (validité, pertinence, poids) et score global
- Formes descriptive et normative, avec changement de forme par branche
- Références bibliographiques associables aux arguments
- Glossaire de définitions
- Export JSON (sauvegarde) et PDF (impression / partage)
- Trois exemples préchargés pour démarrer

## Ce projet côté conception

Argumentor est un projet personnel mené dans le rôle de **Product Owner** : définition du modèle fonctionnel, spécification des fonctionnalités, validation des développements, arbitrages produit. Le développement a été assuré avec l'aide d'outils d'IA générative (DeepSeek, Claude).

Le modèle de scoring — propagation des valeurs dans l'arbre, courbe en S, score global sur une échelle de ±10 — a été conçu et spécifié fonctionnellement avant d'être implémenté.

## Stack technique

- React 19 + Vite
- Pas de backend, pas de base de données
- Export PDF via `@react-pdf/renderer`
- Déployable statiquement (Vercel, Netlify…)
