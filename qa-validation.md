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
