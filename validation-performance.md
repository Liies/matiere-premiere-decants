# Validation performance

Après le passage des pages à `React.lazy`, la page d’accueil se charge correctement avec son hero Matière Première et ses CTA. Le catalogue se charge également correctement avec la recherche, les filtres olfactifs, les dix produits et leurs images.

Le build produit des chunks séparés pour les pages secondaires, notamment HomePremium, Products, ProductDetail, Cart, Checkout, FAQ et les pages éditoriales. Les dépendances React, UI et données sont également séparées en chunks vendor dédiés. Le chunk React vendor reste sous le seuil d’avertissement Vite à environ 459 kB minifiés, et le build ne signale plus d’avertissement de taille.
