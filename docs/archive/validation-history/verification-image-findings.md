# Vérification des images produit — 11 août 2026

La page `/products` affiche correctement les images des dix parfums. Les URLs rendues sont des chemins persistants `/manus-storage/perfume-bottle-*.png`, notamment `/manus-storage/perfume-bottle-1_35573870.png` pour Vanilla Powder.

La page `/product/1` affiche correctement l'image principale de Vanilla Powder et les images des produits similaires. La fiche rend également le même chemin `/manus-storage/perfume-bottle-1_35573870.png`. Le correctif ProductDetail utilisant `getProductImage(product.id)` est donc validé visuellement sur le preview.

Le fallback visuel à base d'icône Leaf est présent dans `ProductImage` si l'asset est absent ou échoue au chargement. Les tests Vitest du mapping ont été déplacés dans `server/image-assets.test.ts` afin d'être détectés par la configuration du projet.

À noter séparément : la fiche affiche actuellement des montants comme `8500.00€` alors que le catalogue affiche `€85.00`; ce point n'est pas lié au problème d'image et n'a pas été modifié dans ce correctif.


## Revalidation après correctif de prix

La fiche `/product/1` affiche bien l'image `/manus-storage/perfume-bottle-1_35573870.png`, le prix `85,00 €` et les images des produits similaires avec des prix cohérents.

La fiche `/product/10` affiche bien l'image `/manus-storage/perfume-bottle-10_8dfc5687.png` pour Cologne Cédrat, le prix `80,00 €` et les produits similaires. Le mapping fonctionne donc aussi pour un produit en fin de catalogue, pas seulement pour le premier produit.


## Validation des nouvelles interactions

Le catalogue `/products` affiche les huit familles olfactives sous forme de boutons multi-sélection. L’activation de « Boisé » recalculait immédiatement le catalogue et affichait « 7 parfums correspondants ». L’activation supplémentaire de « Floral » conservait une sélection multiple active et le compteur attendu selon la règle « au moins une note correspondante ».

La fiche `/product/1` affiche après clic le message « Vanilla Powder ajouté au panier », le bouton passe brièvement à « Ajouté au panier » avec l’icône animée, le ripple visuel et la confirmation toast. Le bouton revient ensuite à son état initial. Les contrôles Vitest et TypeScript étaient verts avant cette vérification visuelle.


## Validation de la recherche catalogue

Le catalogue `/products` affiche le champ `catalog-search` avec le placeholder « Rechercher un parfum par son nom… ». La saisie de « Vanilla » filtre instantanément la collection à un seul résultat, Vanilla Powder, et affiche le compteur « 1 parfum correspondant ». Le bouton d’effacement apparaît dans le champ et les filtres olfactifs restent visibles sous la recherche.
