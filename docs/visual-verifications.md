# Vérifications visuelles

## Catalogue — Filtres olfactifs

La sélection de l’accord **Boisé** a été vérifiée sur le catalogue. Le filtre actif adopte correctement son état sombre, la sélection affiche le compteur « 1 accord sélectionné », le bouton de réinitialisation apparaît et la grille est réduite aux parfums correspondants. La micro-animation de sélection est déclenchée par l’état actif du filtre et respecte la préférence de réduction des mouvements.

## Fiche produit — Ajout au panier

La fiche de **Vanilla Powder** affiche correctement le bouton « Ajouter au panier » pour le format 50 ml disponible. Le bouton conserve un cadrage stable et un contraste lisible ; sa confirmation améliorée combine une impulsion, un balayage lumineux et une coche animée après l’ajout réussi, avec un repli sans mouvement pour les utilisateurs qui le demandent.

Le parcours de consultation confirme que le bouton est disponible sur la fiche Vanilla Powder ; la confirmation transitoire est également couverte par une régression de composant afin de garantir son affichage immédiatement après l’ajout.

## Fiche produit — Mouvement du visuel au défilement

Le flacon de **Vanilla Powder** a été vérifié au chargement de sa fiche : le cadrage reste stable et le mouvement est limité à une zone discrète. La nouvelle courbe accélère avec douceur au début du défilement, puis se stabilise, avec une dérive horizontale très légère, une translation verticale, un zoom contenu et une rotation imperceptible. Les préférences de réduction des mouvements conservent le visuel fixe.

## Fiche produit — Film officiel

Sur la fiche **Vanilla Powder**, le module « Film officiel » apparaît sous les informations du parfum. Le bouton « Lire le film officiel » est présent avant le lecteur, ce qui évite tout chargement du contenu Instagram sans action explicite. Le lien vers la publication officielle `@matierepremiereparfums` est également visible.

Le déclencheur vidéo conserve une mise en page verticale cohérente avec les reels officiels et reste séparé de l’action d’achat. Le test de composant confirme que le lecteur Instagram n’est ajouté au DOM qu’après activation explicite.

## Panier — Indicateur d’articles

L’en-tête du panier affiche un libellé « Votre sélection », le titre principal et un compteur en pastille aligné à droite sur écran large. Le compteur présente l’icône de sac, le total et le libellé grammaticalement adapté ; l’état vide affiche correctement « 0 article » sans déséquilibrer la mise en page.
