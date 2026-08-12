# Emails transactionnels

Le projet utilise un adaptateur centralisé dans `server/transactionalEmail.ts`. Il prépare des emails en français pour la notification de nouvelle commande au propriétaire, la confirmation de commande au client et les changements de statut. Une erreur d’email est journalisée mais ne doit jamais annuler une commande ni empêcher une mise à jour administrative.

## Mode actif

La variable `EMAIL_DELIVERY_MODE` vaut actuellement `mock`. Aucun email réel ne quitte le projet : chaque envoi est seulement journalisé côté serveur avec son destinataire et son objet. Les modèles, les déclencheurs et les chemins d’erreur restent néanmoins exécutés et couverts par les tests.

## Passage à Resend

Après avoir créé une clé API Resend valide et vérifié le domaine expéditeur, mettez à jour les variables d’environnement suivantes dans les paramètres du projet.

| Variable | Valeur attendue |
|---|---|
| `RESEND_API_KEY` | Clé API Resend active. |
| `EMAIL_FROM` | Adresse expéditrice d’un domaine vérifié, par exemple `commandes@votredomaine.fr`. |
| `ORDER_NOTIFICATION_EMAIL` | Adresse qui reçoit les alertes de nouvelles commandes ; si elle est absente, `EMAIL_FROM` est utilisé. |
| `EMAIL_DELIVERY_MODE` | Remplacer `mock` par `resend`. |

Avant la bascule, exécutez `pnpm test --run server/email-provider.test.ts`. Ce test vérifie l’authentification auprès de Resend uniquement lorsque le mode `resend` est actif.
