# Règles de calcul de l'argumentaire

- Chaque argument se voit attribuer une valeur, à la discrétion de l'utilisateur, de 0 à 1, avec une valeur par défaut de 0.5.
- Cette valeur vient s'ajouter à l'argument qu'il soutient. Un argument de validité ajoute sa valeur à la validité de l'argument parent, et pareil pour la pertinence.
- Un argument a donc une validité et une pertinence héritée de ses enfants. La combinaison de la validité et de la pertinence donnent le poids de l'argument.
- Le poids d'un argument n'influence pas l'argument parent ; seul la valeur de l'argument influence l'argument parent.
- En revanche, le score de l'ensemble de l'argumentaire est déterminé par le poids de l'ensemble des arguments.
