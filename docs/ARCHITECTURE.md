# Architecture du projet

## Objectif

Le projet utilise une architecture pragmatique en couches. Elle conserve le contrat tRPC et les comportements existants, tout en séparant les décisions métier, l’orchestration applicative, l’interface et les détails d’infrastructure.

| Couche | Répertoire | Responsabilité | Dépendances autorisées |
|---|---|---|---|
| Présentation | `client/src` | Pages, composants, état de l’interface et appels tRPC | Contrats partagés et client tRPC |
| Domaine | `shared` | Règles pures, types et politiques réutilisables | Aucune dépendance à React, tRPC ou base de données |
| Application | `server/routers` | Cas d’usage, validation, autorisation et orchestration | Domaine et ports/infrastructure nécessaires |
| Infrastructure | `server/db.ts`, `server/storage.ts`, `server/transactionalEmail.ts` | Base de données, stockage, email et services externes | Bibliothèques techniques |
| Composition | `server/routers.ts` | Assemblage des capacités dans `appRouter` | Routeurs applicatifs et capacités transverses |

## Conventions appliquées

Les règles de quantité et de disponibilité du panier vivent dans `shared/cart-domain.ts`. Elles sont pures et directement couvertes par des tests unitaires. Les routeurs `cartRouter` et `ordersRouter` concentrent leurs propres cas d’usage, tandis que `server/routers.ts` se limite désormais à composer les capacités et les routeurs plus légers.

Les capacités administratives emploient la garde `requireAdmin` commune. Les contrôleurs ne calculent plus eux-mêmes les quantités de panier : ils délèguent cette décision au domaine.

## Règles de contribution

Avant d’ajouter une fonctionnalité, identifier la couche propriétaire de la décision. Une règle calculable sans I/O appartient au domaine partagé. Une orchestration qui combine validation, autorisation et persistance appartient à un routeur applicatif. L’accès SQL, les emails et le stockage restent dans leurs adaptateurs d’infrastructure.

Chaque extraction doit conserver les contrats publics, ajouter un test ciblé et ne pas faire dépendre le domaine de React, tRPC, Drizzle ou Express.
