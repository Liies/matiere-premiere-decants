# Matière Première — Décants 50 ml

Une boutique e-commerce premium consacrée à une sélection de décants de parfums de niche **Matière Première**. Le projet associe une interface minimaliste inspirée des standards Apple à un catalogue olfactif, un panier invité, un tunnel de commande, une administration sécurisée et une base de tests automatisés.

> **Site publié :** [matiere50ml-okjlk7qk.manus.space](https://matiere50ml-okjlk7qk.manus.space/)

## Fonctionnalités

| Domaine | Fonctionnalités principales |
|---|---|
| Expérience de marque | Accueil éditorial, écran de chargement initial, hero progressif, storytelling et animations lentes compatibles avec la réduction des mouvements. |
| Catalogue | Recherche en temps réel, suggestions d’autocomplétion, filtres olfactifs multiples, cartes premium et fiches produit détaillées. |
| Commerce | Panier invité persistant, synchronisation idempotente avec le panier utilisateur à la connexion, checkout et historique de commandes. |
| Liste de souhaits | Ajout/retrait persistant, synchronisation entre catalogue et fiche produit, micro-animation accessible. |
| Administration | Gestion des commandes et édition protégée du catalogue : nom, description, prix et contenance. |
| Notifications | Modèles d’emails transactionnels pour commande et changement de statut ; le projet est actuellement en mode simulation. |
| Qualité | Tests Vitest, vérification TypeScript, build de production, validation visuelle et dossiers d’incident. |

## Stack technique

| Couche | Technologies |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4, Wouter, React Query. |
| Interface | Radix UI, Lucide, Sonner, React Hook Form et Zod. |
| Backend | Express 4, tRPC 11, Manus OAuth. |
| Données | Drizzle ORM, MySQL/TiDB. |
| Tests | Vitest, Testing Library et JSDOM. |
| Déploiement | Manus WebDev avec publication automatique lors d’un checkpoint. |

## Structure du dépôt

```text
client/
  src/
    components/       # En-tête, composants UI et éléments réutilisables
    hooks/            # Panier invité, souhaits, synchronisation à la connexion
    pages/            # Accueil, catalogue, checkout, compte et administration
    App.tsx           # Routage, chargement différé et transitions de pages
    index.css         # Thème global et animations accessibles
server/
  routers.ts          # Contrats tRPC : produits, panier, commandes, administration
  db.ts               # Accès aux données Drizzle
  transactionalEmail.ts # Modèles et adaptateur d’emails transactionnels
  *.test.ts           # Tests serveur et intégrations tRPC
shared/
  *.ts                # Contrats de domaine et logique partagée testable
drizzle/
  schema.ts           # Schéma de données et migrations
docs/
  EMAIL_TRANSACTIONNEL.md
  INCIDENT_TRANSITIONS_ET_BUILD.md
```

## Démarrage local

### Prérequis

Le projet nécessite **Node.js 22**, **pnpm 10** et les variables système injectées par l’environnement Manus, notamment la connexion à la base de données et les paramètres OAuth. La liste des variables attendues est disponible dans [`.env.example`](.env.example). Ne copiez jamais de secrets réels dans ce fichier.

```bash
pnpm install
pnpm dev
```

L’application est alors servie par le processus Express/Vite sur le port fourni par l’environnement. Ne pas figer ce port dans le code applicatif.

## Commandes utiles

| Commande | Usage |
|---|---|
| `pnpm dev` | Démarre le serveur de développement avec rechargement. |
| `pnpm test --run` | Exécute l’ensemble des tests Vitest. |
| `pnpm check` | Vérifie les types TypeScript sans générer de fichiers. |
| `pnpm build` | Construit le frontend Vite et le serveur Node de production. |
| `pnpm start` | Démarre l’artefact serveur de production. |
| `pnpm db:push` | Génère et applique les migrations Drizzle dans un environnement local configuré. |
| `curl -i http://localhost:<port>/healthz` | Vérifie la configuration de production sans révéler les valeurs des secrets. |

En production, `/healthz` renvoie `200` uniquement si les variables obligatoires sont présentes et si l’envoi d’emails est configuré en mode réel. En développement, le mode email `mock` reste autorisé. La réponse ne contient que les noms des variables manquantes.

Avant toute livraison, exécuter la séquence suivante :

```bash
pnpm test --run && pnpm check && pnpm build
```

## Données et administration

Le catalogue est exposé publiquement en lecture. Les opérations de mise à jour sont restreintes aux utilisateurs ayant le rôle `admin` et accessibles depuis `/admin/catalogue`.

Les montants sont stockés en **centimes** afin d’éviter les imprécisions de calcul. La contenance est stockée en millilitres. Les commandes recalculent systématiquement les prix et contrôlent le stock côté serveur : le navigateur ne constitue jamais la source de vérité du montant.

## Panier invité et synchronisation

Le panier invité est conservé dans `localStorage`. Lorsqu’un utilisateur se connecte, il est fusionné avec le panier associé à son compte. La fusion est idempotente, normalise les doublons et ne vide le stockage local qu’après confirmation du serveur. En cas de stock insuffisant ou d’erreur réseau, le panier invité est conservé pour une nouvelle tentative.

## Emails transactionnels

Les modèles couvrent la nouvelle commande côté propriétaire, la confirmation client et les changements de statut. Le mode courant est **`mock`** : aucun email réel ne quitte l’application, mais les déclencheurs sont exécutés et testés.

Pour basculer vers Resend, vérifier le domaine expéditeur, fournir une clé API valide et configurer les variables suivantes :

| Variable | Rôle |
|---|---|
| `RESEND_API_KEY` | Clé API Resend active. |
| `EMAIL_FROM` | Adresse expéditrice sur un domaine vérifié. |
| `ORDER_NOTIFICATION_EMAIL` | Adresse destinataire des nouvelles commandes ; `EMAIL_FROM` est utilisée à défaut. |
| `EMAIL_DELIVERY_MODE` | Passer de `mock` à `resend` après validation des identifiants. |

Les détails opérationnels sont disponibles dans [la documentation email](docs/EMAIL_TRANSACTIONNEL.md).

## Qualité, accessibilité et performance

Le projet comporte des tests unitaires et d’intégration sur la recherche, les filtres, le panier, les souhaits, la synchronisation à la connexion, le checkout, les commandes, l’administration, les emails et les transitions de page. La dernière validation complète compte **87 tests**.

Les animations respectent `prefers-reduced-motion`. Les pages éditoriales bénéficient de transitions courtes et discrètes, tandis que le panier et le checkout restent immédiats. Les routes sont chargées à la demande et le build de production exclut le collecteur de diagnostic destiné au développement.

## Documentation complémentaire

| Document | Contenu |
|---|---|
| [Dossier d’incident](docs/INCIDENT_TRANSITIONS_ET_BUILD.md) | Chronologie, cause racine, corrections, validations et prévention concernant l’incident de chargement de l’aperçu. |
| [Emails transactionnels](docs/EMAIL_TRANSACTIONNEL.md) | Mode simulation, configuration Resend et procédure de bascule. |
| [Audit de performance](performance-audit.md) | Mesures, composition des bundles, optimisation et interprétation des résultats. |
| [Validation interface](qa-validation.md) | Contrôles visuels des parcours catalogue, souhaits, administration, synchronisation et transitions. |

## Contribution et versionnement

Avant de soumettre une évolution, documenter les changements fonctionnels, écrire ou mettre à jour les tests pertinents, puis exécuter les commandes de qualité. Les modifications publiées via un checkpoint sont synchronisées avec le dépôt Git connecté ; le README fait donc partie de l’historique versionné du projet.

## Licence

Ce projet est distribué sous licence **MIT**. Consultez [`package.json`](package.json) pour la déclaration de licence du dépôt.
