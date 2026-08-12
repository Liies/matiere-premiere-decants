# Validation interface — panier et liste de souhaits

## Catalogue desktop

- Le catalogue affiche les dix cartes produit, les champs de quantité et les cœurs accessibles avec des libellés explicites.
- L’activation du cœur de **Vanilla Powder** met à jour son libellé vers « Retirer … de la liste de souhaits » et son état visuel rempli, tandis que le cœur de **Crystal Saffron** reste vide.
- Le bouton d’ajout est bien présent sur les cartes au focus ou au survol. Une vérification asynchrone complémentaire est nécessaire pour observer la confirmation après réponse serveur lors d’une session authentifiée.
- Le contrôle de console ne relève aucune erreur cliente lors du déclenchement du bouton. L’isolation du libellé « Ajouté » est donc couverte de manière déterministe par le test d’intégration du composant catalogue, avec deux cartes distinctes rendues simultanément.

## Liste de souhaits

- **Vanilla Powder** ajouté depuis le catalogue est bien présent après navigation vers `/wishlist`, avec le compteur « 1 parfum enregistré » et des contrôles de retrait explicites.
- Le retrait depuis `/wishlist` met immédiatement le compteur à zéro et rend l’état vide, avec un lien « Explorer la collection » opérationnel.

## Fiche produit

- Le contrôle cœur est visible à côté de l’ajout au panier de **Vanilla Powder**.
- Son activation fait basculer son libellé de « Ajouter aux favoris » à « Retirer des favoris » et affiche le cœur rempli, conformément au comportement de la liste de souhaits.

## Administration catalogue

- La route administrateur `/admin/catalogue` affiche la navigation de back-office, une liste de produits et les champs d’édition **nom**, **description**, **prix** et **contenance**.
- Les produits existants ont reçu la contenance par défaut de **50 ml** lors de la migration non destructive.
- Le changement de produit recharge les valeurs correspondantes dans le formulaire sans écriture involontaire.

## Navigation publique uniforme

- Le menu principal du catalogue affiche désormais **Accueil**, **Catalogue**, **À propos**, **FAQ** et **Contact** ; l’entrée « Par familles » a été retirée.
- Les filtres olfactifs restent accessibles directement dans la page Catalogue.

## Synchronisation du panier à la connexion

- Le panier authentifié continue de charger sans erreur après ajout du déclencheur global de synchronisation.
- Les entrées existantes en double d’un même produit sont prises en compte dans le plan de fusion et sont normalisées en une quantité unique dès qu’une synchronisation invitée réussit.

## Transitions entre pages

- Le catalogue se charge correctement après une navigation depuis l’accueil avec le conteneur de transition global.
- L’accès au panier reste direct et ne présente aucun délai de sortie, conformément à la règle de parcours d’achat rapide.
