# Validation — cartes catalogue retournables

## Vérification du 12 août 2026

| Contrôle | Résultat |
|---|---|
| Recto des cartes | Les flacons, le nom, la contenance, la description, le prix et les actions restent visibles et lisibles. |
| Notes sous l’image | Les trois blocs de notes précédemment placés sous chaque image ont été retirés. |
| Verso olfactif | Chaque carte contient un verso avec la pyramide `Tête / Cœur / Fond` et un lien vers la fiche produit. |
| Interaction souris | Le retournement est déclenché par survol de la carte sur écran large ; le captureur d’aperçu ne garantit pas toujours l’état intermédiaire de la transition 3D. |
| Interaction clavier et tactile | Le focus sur la carte déclenche le verso et un contrôle « Afficher les notes » est proposé sur mobile. |
| Mouvement réduit | Le verso remplace le recto par opacité sans rotation lorsque `prefers-reduced-motion` est activé. |

Les tests d’intégration couvrent la présence du verso, le retrait des libellés de notes sous les visuels et le contrôle tactile. La validation complète est effectuée par Vitest, TypeScript et build de production.

## Contrôle technique complémentaire

Le lien du recto de la première carte reçoit correctement le focus clavier et le conteneur 3D porte la transition `transform` attendue. Le navigateur de validation réinitialise le curseur à chaque capture, ce qui ne permet pas de conserver l’état `:hover` entre deux captures ; la règle de survol est contrôlée par le style `.catalog-product-card:hover .catalog-flip-card-inner` et par la couverture d’intégration tactile.
