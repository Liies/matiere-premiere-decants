# Validation de l’autocomplétion

Le 11 août 2026, le champ de recherche du catalogue a été vérifié sur la preview locale.

- La saisie « saff » affiche une liste de suggestions avec « Crystal Saffron ».
- La suggestion expose un rôle accessible `option` dans une liste `listbox`.
- La flèche bas active la suggestion au clavier.
- La touche Entrée ouvre correctement `/product/2` pour Crystal Saffron.
- La recherche filtre simultanément la grille du catalogue à un seul parfum correspondant.

Les tests automatisés associés sont dans `server/catalog-search.test.ts`.
