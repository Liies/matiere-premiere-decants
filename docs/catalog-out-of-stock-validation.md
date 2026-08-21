# Validation — Signal de rupture de stock du catalogue

La vérification du 21 août 2026 confirme que les cartes dont toutes les variantes publiques sont à zéro affichent l’étiquette **« Indisponible »**, le statut **« Indisponible actuellement »** et un lien **« Voir le parfum »**. Elles ne présentent aucun contrôle d’ajout au panier.

La validation automatisée couvre le badge, la palette minérale chaude et l’absence de contrôle d’achat dans `Products.integration.test.tsx`. Les 14 tests ciblés, la vérification TypeScript et le build de production ont réussi. Le contrôle du catalogue sur le serveur de développement a également confirmé les états de Parisian Musk et French Flower.
