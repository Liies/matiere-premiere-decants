# Matière Première - E-commerce Décants 50ml - TODO

## Base de données et schéma
- [x] Créer table `products` avec tous les parfums Matière Première
- [x] Créer table `orders` pour gérer les commandes
- [x] Créer table `order_items` pour les articles dans chaque commande
- [x] Créer table `cart_items` pour le panier utilisateur
- [x] Ajouter colonnes pour les métadonnées produits (notes olfactives, descriptions)
- [x] Exécuter les migrations SQL
- [x] Ajouter les fonctions de requête dans db.ts

## Intégration Stripe (Version démo simplifiée - Stripe sera intégré plus tard)
- [x] Créer les procédures tRPC pour gérer le tunnel de commande
- [x] Implémenter la création de commande avec validation
- [x] Gérer les statuts de commande (pending, paid, processing, shipped, delivered, cancelled)
- [x] Créer un formulaire de paiement simplifié (placeholder pour Stripe)
- [x] Implémenter la confirmation de commande

## Backend (tRPC procedures)
- [x] Procédure pour récupérer tous les produits
- [x] Procédure pour récupérer les détails d'un produit
- [x] Procédure pour ajouter un article au panier
- [x] Procédure pour récupérer le panier de l'utilisateur
- [x] Procédure pour mettre à jour la quantité d'un article du panier
- [x] Procédure pour supprimer un article du panier
- [x] Procédure pour créer une commande (placeholder Stripe)
- [x] Procédure pour récupérer les commandes de l'utilisateur
- [x] Procédure pour récupérer les détails d'une commande
- [x] Procédure admin pour récupérer toutes les commandes
- [x] Procédure admin pour mettre à jour le statut d'une commande
- [x] Procédure pour envoyer des notifications au propriétaire

## Frontend - Pages principales
- [x] Page d'accueil (Home) avec hero section luxueuse
- [x] Page catalogue des produits
- [ ] Page détail produit (optionnel)
- [x] Page panier
- [x] Page tunnel de commande (checkout)
- [x] Page confirmation de commande
- [x] Page compte utilisateur avec historique des commandes
- [ ] Page admin - Gestion du catalogue (optionnel)
- [x] Page admin - Gestion des commandes

## Frontend - Composants et UI
- [x] Composant Header/Navigation
- [x] Composant Footer
- [x] Composant ProductCard
- [ ] Composant ProductDetail (optionnel)
- [x] Composant CartSummary
- [x] Composant CheckoutForm
- [x] Composant OrderHistory
- [x] Composant AdminDashboard
- [ ] Intégration Stripe Elements pour le formulaire de paiement (à faire avec clés Stripe)

## Design et animations
- [x] Définir la palette de couleurs (minimalisme luxueux)
- [x] Configurer la typographie élégante
- [x] Créer les animations de transition et hover
- [x] Implémenter les animations de scroll
- [x] Ajouter les micro-interactions (feedback utilisateur)

## Visuels et assets
- [x] Générer/récupérer les images des parfums
- [x] Créer le logo Matière Première (utiliser Leaf icon)
- [x] Générer les images pour la hero section
- [x] Créer les icônes de navigation (lucide-react)

## Notifications et emails
- [ ] Configurer le service d'email (utiliser les notifications Manus)
- [ ] Template email pour nouvelle commande (propriétaire)
- [ ] Template email pour confirmation commande (client)
- [ ] Template email pour changement de statut (client)
- [ ] Implémenter l'envoi automatique d'emails via notifyOwner et tRPC

## Tests
- [x] Tests unitaires pour les procédures tRPC
- [x] Tests du panier
- [x] Tests du hook useLocalCart
- [ ] Tests d'intégration pour le flux de commande (optionnel)
- [ ] Tests de paiement Stripe (optionnel - à faire avec clés Stripe)
- [ ] Tests des notifications email (optionnel)

## Déploiement et finalisation
- [x] Vérifier la responsivité sur mobile/tablet/desktop
- [ ] Vérifier les performances (optionnel)
- [x] Vérifier la sécurité (authentification, autorisations)
- [x] Tester le flux complet de commande
- [x] Créer un checkpoint final
- [ ] Publier le site


## Améliorations - Images et panier sans connexion
- [x] Générer les images pour les 6 parfums restants
- [x] Intégrer les images dans le catalogue produits
- [x] Implémenter le panier avec localStorage pour les utilisateurs non connectés
- [ ] Synchroniser le panier localStorage avec le panier utilisateur à la connexion (optionnel)
- [x] Tester le flux complet sans connexion


## Amélioration Page d'accueil - Images et design
- [x] Générer des images supplémentaires pour la hero section (ambiance luxe)
- [x] Générer des images pour la section "Pourquoi Matière Première"
- [x] Générer des images pour la section "Collection"
- [x] Intégrer les images dans la page Home
- [x] Ajouter des sections visuelles attractives
- [x] Améliorer le design avec des grilles d'images


## Page d'accueil Premium Style Apple
- [x] Générer des images pour l'histoire de Matière Première
- [x] Générer des images pour les nez/créateurs
- [x] Générer des images pour les sections produits
- [x] Créer des sections avec scroll animations (parallax, fade-in, scale)
- [x] Implémenter les transitions fluides entre sections
- [x] Créer une section "Notre Histoire" avec timeline
- [x] Créer une section "Les Nez" avec profils des créateurs
- [x] Ajouter des animations de texte (reveal, typewriter)
- [x] Implémenter le scroll-triggered animations avec Intersection Observer
- [x] Créer la page HomePremium avec design Apple-inspired


## Contenu enrichi - Descriptions et histoire
- [x] Ajouter descriptions détaillées pour chaque parfum (dans les données produits)
- [x] Créer des profils complets pour les nez créatifs (dans HomePremium)
- [x] Ajouter des notes olfactives détaillées (tête, cœur, fond)
- [ ] Créer une section blog/articles sur la parfumerie (optionnel)

## Améliorations design - Animations et sections
- [x] Ajouter des animations sur les cartes produits (hover effects)
- [x] Créer des sections avec animations de révélation de texte
- [ ] Ajouter des animations de chargement (skeleton screens) (optionnel)
- [ ] Améliorer les transitions entre pages (optionnel)
- [x] Ajouter des micro-interactions (boutons, formulaires)

## Pages supplémentaires
- [x] Page À propos (About) - Histoire détaillée de la marque
- [x] Page FAQ - Questions fréquemment posées
- [x] Page Contact - Formulaire de contact
- [x] Page Conditions d'utilisation (Terms)
- [x] Page Politique de confidentialité (Privacy)
- [ ] Page Livraison et retours (optionnel)
- [x] Mettre à jour la navigation pour inclure ces pages
- [x] Ajouter les liens dans le footer
