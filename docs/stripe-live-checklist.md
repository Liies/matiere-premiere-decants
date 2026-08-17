# Passage de Stripe en mode réel

> **Important :** ce document prépare la bascule, mais ne l’active pas. Ne remplacez les secrets de test que lorsque le compte Stripe est vérifié et que vous êtes prêt à accepter de vrais paiements.

## Déjà prêt dans la boutique

La création de session Checkout, la vérification de signature du webhook, la confirmation idempotente de paiement, la libération du stock lors d’une expiration et les contrôles qui distinguent les clés test des clés réelles sont déjà en place. Aucun changement de code n’est nécessaire pour passer en mode réel.

## Pré-requis

| Élément | À vérifier avant la bascule |
| --- | --- |
| Compte Stripe | Profil entreprise et vérification demandée par Stripe finalisés. |
| Clé serveur | Une clé `sk_live_…` ou clé restreinte `rk_live_…`, conservée uniquement dans les secrets du projet. |
| Clé publique | La clé `pk_live_…` si elle est requise par un futur composant Stripe côté navigateur. |
| Webhook réel | Un endpoint HTTPS actif : `https://matiere50ml-okjlk7qk.manus.space/api/stripe/webhook`. |
| Secret webhook | Le secret `whsec_…` propre à l’endpoint **réel** ; il est distinct du secret de test. |

## Événements à sélectionner

Le webhook de la boutique traite les événements suivants :

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.expired`

## Les seules actions à effectuer le moment venu

| Étape | Action dans Stripe ou dans le projet |
| --- | --- |
| 1 | Finalisez les informations demandées par Stripe et ajoutez votre compte bancaire pour les versements. |
| 2 | Dans le tableau de bord Stripe, passez en **mode réel**, puis créez l’endpoint HTTPS indiqué ci-dessus avec les trois événements listés. |
| 3 | Copiez le secret `whsec_…` affiché pour cet endpoint réel. Ne réutilisez pas le secret de test. |
| 4 | Dans les paramètres de paiement du projet, renseignez `STRIPE_SECRET_KEY` avec `sk_live_…` ou `rk_live_…`, et `STRIPE_WEBHOOK_SECRET` avec le nouveau `whsec_…`. La clé `VITE_STRIPE_PUBLISHABLE_KEY` n’est pas nécessaire au Checkout hébergé actuel ; elle peut rester vide jusqu’à l’ajout d’un paiement intégré à la page. |
| 5 | Demandez la publication des nouveaux secrets, puis envoyez un événement test depuis le webhook réel afin de confirmer sa réception. |

> Le dernier test avec une vraie carte ne doit être réalisé que lorsque vous êtes prêt à accepter un débit réel. Avant cela, le test d’événement du webhook ne débite personne.

## Après la bascule

Le site utilise automatiquement le mode correspondant à la clé serveur renseignée. Une clé `sk_live_…` ou `rk_live_…` fait passer les nouvelles sessions Checkout en mode réel ; une clé `sk_test_…` conserve les paiements simulés. La validation d’un webhook réel fait passer la commande à l’état payé et déclenche alors les emails de commande.

## Sécurité et exploitation

Ne placez jamais de clé `sk_`, `rk_` ou `whsec_` dans le code source, un fichier versionné ou une conversation. Stripe distingue les clés et les secrets de webhook des environnements test et réel ; un secret de signature ne peut pas être réutilisé entre ces environnements. Consultez la documentation Stripe avant toute bascule : [API keys](https://docs.stripe.com/keys) et [webhooks](https://docs.stripe.com/webhooks).
