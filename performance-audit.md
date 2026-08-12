# Audit de performance — 12 août 2026

## Mesures effectuées

| Surface mesurée | Résultat observé | Lecture |
|---|---:|---|
| Serveur local : accueil / catalogue | TTFB ~19 ms ; total ~70 ms | Le serveur applicatif local répond rapidement. |
| Build de production | `dist` : 1,7 Mo | Le découpage par page est actif. |
| CSS principal | 23,61 Ko gzip | Poids initial CSS maîtrisé. |
| Entrée applicative | 9,38 Ko gzip | Bootstrap applicatif léger. |
| Page accueil différée | 4,90 Ko gzip | La page premium est chargée à la demande. |
| Vendor React | 142,45 Ko gzip | Principal poste JavaScript partagé ; nécessaire au socle React, au routage et à l’interface. |
| Déploiement publié | TTFB entre ~2,5 s et ~5,7 s depuis le sandbox | Variabilité en amont de l’application, cohérente avec une latence de plateforme/réseau ; elle ne se reproduit pas localement. |

## Vérification fonctionnelle

La page d’accueil publiée termine son écran de chargement initial et rend correctement le hero, la navigation et les visuels. Aucun correctif de rendu ni ressource bloquante n’a été constaté pendant le contrôle visuel.

Après redémarrage du serveur de développement, l’aperçu local rend également l’accueil complet. Les erreurs de pré-transformation observées pendant le rechargement de configuration n’affectent donc pas l’application finale.

## Optimisation appliquée

Le collecteur de diagnostic réservé au serveur de développement n’est plus injecté dans le document de production. Cette correction retire une requête cliente non nécessaire aux visiteurs. Après optimisation, le document produit pèse **369 497 octets** (**106,02 Ko gzip**) et ne contient plus de référence à `__manus__/debug-collector.js`.

## Conclusion technique

La composition front-end est déjà optimisée par découpage de routes et de dépendances. À ce stade, réduire arbitrairement les bundles partagés risquerait d’augmenter les requêtes sans apporter de bénéfice certain. La principale variabilité mesurée provient de la réponse du déploiement publié, et non du traitement applicatif local. Une nouvelle mesure depuis une localisation utilisateur ou via un outil RUM permettra de confirmer la latence réellement perçue par les visiteurs.
