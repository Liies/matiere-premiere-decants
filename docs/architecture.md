# Architecture du projet

Le projet est organisé autour de dépendances dirigées vers les règles métier. Cette structure est appliquée progressivement, en priorisant les parcours sensibles tels que la commande et le paiement, sans modifier les contrats publics du storefront ou de l’administration.

| Couche | Responsabilité | Exemples |
|---|---|---|
| **Présentation** | Rend l’interface, gère les états d’interaction et appelle les procédures typées. | `client/src/pages`, `client/src/components` |
| **Interface applicative** | Valide les entrées, contrôle les droits et traduit les erreurs métier en réponses tRPC. | `server/routers` |
| **Application** | Orchestre un cas d’usage à travers des contrats injectés, sans dépendre de tRPC, Drizzle ou Stripe. | `server/application/orderCheckout.ts` |
| **Domaine partagé** | Porte les règles pures et déterministes, réutilisables côté client et serveur. | `shared/shipping.ts`, `shared/delivery-zones.ts`, `shared/inventory.ts` |
| **Infrastructure** | Implémente la persistance, le paiement, l’email, le stockage et les services externes. | `server/db.ts`, `server/stripeCheckout.ts`, `server/transactionalEmail.ts` |

## Règles de dépendance

Les composants UI ne doivent pas connaître les détails de persistance ou de paiement. Les routeurs restent minces : ils valident la forme des requêtes, appliquent l’autorisation, puis délèguent les enchaînements métier aux cas d’usage applicatifs. Les cas d’usage reçoivent leurs dépendances sous forme de contrats, ce qui permet de les tester avec des adaptateurs en mémoire.

> Les règles métier pures restent dans `shared/` lorsque le client et le serveur doivent prendre la même décision. Les opérations transactionnelles et les intégrations tierces restent dans `server/`.

## Parcours de commande

`prepareOrderCheckout` vérifie l’éligibilité de livraison, réserve les variantes via l’adaptateur transactionnel, prépare la session de paiement et rattache son identifiant à la commande. Si la préparation échoue après réservation, il demande la libération de cette réservation. Le routeur conserve le même contrat tRPC et ne fait plus porter cette orchestration sur la couche interface.

## Évolution

Les prochains extractions suivent la même méthode : isoler d’abord une règle pure ou un cas d’usage testable, conserver les adaptateurs existants, puis déplacer l’orchestration hors des routeurs ou des composants. Chaque extraction doit ajouter des tests du cas d’usage et maintenir les régressions d’intégration du parcours public.
