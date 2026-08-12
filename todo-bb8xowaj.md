# Project TODO

- [x] Créer une branche Git dédiée à la refonte multi-maisons et la publier sur le dépôt distant.
- [x] Auditer le schéma, le seed et les parcours de catalogue, panier et commande existants.
- [x] Introduire les entités de domaine `brands`, `notes`, `productNotes`, `sourceBottles` et `variants` avec les contraintes nécessaires.
- [x] Ajouter les clés étrangères et stratégies d’intégrité entre maisons, produits, notes, variantes et flacons sources.
- [x] Générer et appliquer une migration de base de données compatible avec les données existantes.
- [x] Remplacer le catalogue dupliqué par une source structurée unique couvrant les 56 références fournies et leurs pyramides olfactives.
- [x] Adapter le script de seed pour importer les maisons, produits et notes, sans inventer les variantes tarifaires ni les flacons sources manquants.
- [x] Basculer la disponibilité sur le stock en millilitres des flacons sources et les variantes vendables.
- [x] Rendre la création de commande transactionnelle et atomique afin d'éviter toute survente.
- [x] Ajouter les procédures d'administration réutilisables et des erreurs métier tRPC explicites.
- [x] Exposer le catalogue par maison et par slug stable pour préparer les routes `/parfum/:brand/:slug`.
- [x] Adapter le routage client et les pages catalogue/produit au nouveau modèle multi-maisons sans briser les liens existants.
- [x] Masquer les niveaux olfactifs vides afin de préserver la lisibilité des références à pyramide partielle.
- [x] Écrire ou mettre à jour les tests Vitest couvrant le seed, les routes et le contrôle de stock.
- [x] Lancer les validations TypeScript, tests et build, puis sauvegarder un checkpoint publié avec la branche.
