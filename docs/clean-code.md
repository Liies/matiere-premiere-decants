# Conventions clean code

Les évolutions du projet privilégient une lecture locale : une fonction doit exprimer une intention unique, les valeurs significatives doivent être nommées, et les détails techniques doivent être regroupés hors des composants ou routeurs qui ne les utilisent pas directement.

| Principe | Application dans le projet |
|---|---|
| **Responsabilité unique** | Les composants rendent l’interface ; les hooks portent les effets réutilisables ; les modules `lib` concentrent les transformations et constantes propres à une intégration. |
| **Noms explicites** | Les noms décrivent l’intention (`formatDeliveryLocation`, `useDeferredElementVisibility`) plutôt que la mécanique interne. |
| **Éviter la duplication** | Les classes de navigation active sont construites par des fonctions dédiées ; la configuration de carte et le format d’adresse sont partagés. |
| **Données immuables** | Les constantes d’intégration et listes de navigation sont définies à un seul endroit et consommées sans mutation. |
| **Tests au niveau adapté** | Les règles pures sont couvertes par des tests unitaires ; les effets sur l’interface et les intégrations sont couverts par des tests de composants et de parcours. |

## Règles de contribution

Une nouvelle règle déterministe doit être extraite dans un module testable avant d’être intégrée à un composant. Une nouvelle interaction qui dépend du navigateur doit privilégier un hook dédié, avec un repli explicite si l’API navigateur est indisponible. Les classes utilitaires longues doivent être regroupées lorsque leur combinaison porte un état ou une signification métier identifiable.

> Une refactorisation n’est considérée comme terminée que lorsque le comportement public est couvert par les tests existants ou par une nouvelle régression ciblée.
