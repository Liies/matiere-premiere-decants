# Validation performance

Après le passage des pages à `React.lazy`, la page d’accueil se charge correctement avec son hero Matière Première et ses CTA. Le catalogue se charge également correctement avec la recherche, les filtres olfactifs, les dix produits et leurs images.

Le build produit des chunks séparés pour les pages secondaires, notamment HomePremium, Products, ProductDetail, Cart, Checkout, FAQ et les pages éditoriales. Le chunk applicatif principal est passé d’environ 958 kB à environ 630 kB minifiés. Vite signale encore un avertissement non bloquant sur ce chunk principal, mais le découpage réduit significativement le chargement initial.
