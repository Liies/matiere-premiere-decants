# Optimisation des performances de chargement

## Mesure du bundle

Le build de référence chargeait la page `HomePremium` dans un chunk de **53 060 octets**. Après extraction du quiz, ce chunk est ramené à **34 036 octets**, soit **19 024 octets de moins** et une réduction d’environ **36 %** de la ressource JavaScript propre à l’accueil. Le module du quiz devient un chunk distinct de **20 274 octets**, téléchargé uniquement après l’action « Commencer l’Exploration ».

| Ressource | Avant | Après | Stratégie |
|---|---:|---:|---|
| Chunk `HomePremium` | 53 060 o | 34 036 o | Quiz extrait du chemin critique |
| Quiz olfactif | inclus dans l’accueil | 20 274 o séparés | Import dynamique au clic |
| Loader initial | 1 220 ms maximum | 630 ms maximum | Présence raccourcie de 590 ms |
| Images d’histoire et ingrédients | chargées sans priorité explicite | `lazy` / priorité basse | Différées hors écran |

## Autres améliorations

La connexion au CDN d’images est préparée dès le document HTML. Les visuels du hero conservent une priorité élevée et un décodage asynchrone, tandis que les visuels plus bas dans la page sont différés. Le cache de session d’authentification reste frais pendant cinq minutes, ce qui évite des requêtes identiques lors des changements de pages.

## Contrôle visuel

L’accueil s’affiche correctement après les optimisations. Le quiz reste absent du rendu initial puis s’ouvre normalement depuis le CTA final, avec la première question et les options accessibles.
