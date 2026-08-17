# Passage de Stripe en mode réel

> **Important :** ce document prépare la bascule, mais ne l’active pas. Ne remplacez les secrets de test que lorsque le compte Stripe est vérifié et que vous êtes prêt à accepter de vrais paiements.

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

## Procédure de bascule

1. Dans Stripe, passez le tableau de bord en **mode réel** et créez l’endpoint HTTPS ci-dessus pour votre compte.
2. Récupérez le secret de signature **de cet endpoint réel**.
3. Dans les paramètres de paiement du projet, remplacez `STRIPE_SECRET_KEY` par la clé serveur réelle et `STRIPE_WEBHOOK_SECRET` par ce nouveau secret de signature. Ajoutez `VITE_STRIPE_PUBLISHABLE_KEY` avec la clé `pk_live_…` uniquement si nécessaire.
4. Vérifiez que le mode test reste désactivé dans Stripe avant de réaliser une commande réelle volontaire.
5. Réalisez une commande de contrôle à faible risque, puis vérifiez la livraison de `checkout.session.completed` et le passage de la commande à l’état payé.

## Sécurité et exploitation

Ne placez jamais de clé `sk_`, `rk_` ou `whsec_` dans le code source, un fichier versionné ou une conversation. Stripe distingue les clés et les secrets de webhook des environnements test et réel ; un secret de signature ne peut pas être réutilisé entre ces environnements. Consultez la documentation Stripe avant toute bascule : [API keys](https://docs.stripe.com/keys) et [webhooks](https://docs.stripe.com/webhooks).
