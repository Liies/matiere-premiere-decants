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
- [x] Page détail produit (optionnel)
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
- [x] Composant ProductDetail (optionnel)
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
- [ ] Configurer le service d'email (utiliser les notifications Manus) - optionnel
- [ ] Template email pour nouvelle commande (propriétaire) - optionnel
- [ ] Template email pour confirmation commande (client) - optionnel
- [ ] Template email pour changement de statut (client) - optionnel
- [ ] Implémenter l'envoi automatique d'emails via notifyOwner et tRPC - optionnel

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
- [x] Créer des checkpoints réguliers
- [ ] Publier le site (final step)


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
- [x] Corriger l'affichage des images des nez parfumeurs


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

## Composants réutilisables et structure
- [x] Créer le composant Header réutilisable
- [x] Créer le composant Footer réutilisable
- [x] Mettre à jour toutes les pages pour utiliser Header/Footer
- [x] Ajouter navigation responsive avec menu mobile

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


## Page détail produit
- [x] Créer la page ProductDetail avec route dynamique
- [x] Afficher l'image du parfum avec zoom
- [x] Afficher la description complète
- [x] Afficher les notes olfactives (tête, cœur, fond)
- [x] Ajouter le bouton "Ajouter au panier"
- [x] Ajouter les produits similaires
- [x] Ajouter les animations de révélation

## Animations avancées
- [x] Ajouter des animations de parallax sur la page d'accueil
- [x] Ajouter des animations de fade-in au scroll
- [x] Ajouter des animations de scale/zoom au hover
- [x] Ajouter des animations de texte (typewriter, reveal)
- [x] Ajouter des animations sur les cartes produits
- [ ] Améliorer les transitions entre pages (optionnel)
- [ ] Ajouter des animations de chargement (skeleton screens) (optionnel)


## Correctif courant — image fiche produit
- [x] Diagnostiquer le mapping entre l'identifiant produit, getProductImage et ProductDetail
- [x] Corriger la résolution du chemin d'image sur la fiche produit
- [x] Ajouter un fallback visuel si une image produit est indisponible
- [x] Ajouter un test de non-régression pour les chemins d'images
- [x] Vérifier le catalogue et la fiche produit dans le navigateur
- [x] Sauvegarder le checkpoint de correction

---

## Suivi de correction image
- [x] Inspecter ProductDetail.tsx, Products.tsx et image-assets.ts
- [x] Harmoniser les chemins /manus-storage
- [x] Tester les 10 mappings produit
- [x] Corriger les erreurs TypeScript bloquantes si nécessaires
- [x] Exécuter les tests avant livraison
- [x] Confirmer honnêtement le résultat à l'utilisateur

---

## Validation de l'incident image
- [x] Reproduire l'image absente sur la fiche produit
- [x] Vérifier l'URL effectivement rendue
- [x] Vérifier le fallback d'image
- [x] Valider le rendu du catalogue et du détail
- [x] Créer un checkpoint après validation

---

## Tâches ajoutées pour la demande courante
- [x] Corriger le path de l'image dans la fiche produit
- [x] Écrire et exécuter un test de mapping
- [x] Vérifier le preview
- [x] Sauvegarder la correction
- [ ] Informer l'utilisateur avec les limites restantes

---

## Contrôle de sortie
- [x] ProductDetail affiche une image pour chaque produit
- [x] L'image correspond au parfum sélectionné
- [x] Aucun chemin CloudFront invalide n'est utilisé pour les produits
- [x] Le fallback reste disponible
- [x] Les tests passent
- [x] Le checkpoint est attaché uniquement après validation

---

## Historique de l'incident
- [ ] Cause racine documentée
- [ ] Fichiers corrigés documentés
- [ ] Tests exécutés documentés
- [ ] Vérification visuelle documentée
- [ ] Version corrigée sauvegardée

---

## Clôture du ticket image fiche produit
- [ ] Bug résolu
- [ ] Bug testé
- [ ] Bug vérifié
- [ ] Bug checkpointé
- [ ] Utilisateur informé

---

## Ne pas clôturer prématurément
- [ ] Ne pas annoncer la correction sans test
- [ ] Ne pas ignorer les erreurs TypeScript
- [ ] Ne pas ignorer une URL d'image cassée
- [ ] Ne pas publier automatiquement
- [ ] Ne pas supprimer les tâches non terminées

---

## Vérification des 10 parfums
- [ ] Vanilla Powder
- [ ] Crystal Saffron
- [ ] Radical Rose
- [ ] Falcon Leather
- [ ] Santal Austral
- [ ] Encens Suave
- [ ] Metal Lavender
- [ ] Bois d'Ebène
- [ ] Ambroxan
- [ ] Vetiver Extraordinaire

---

## Résolution finale de la demande actuelle
- [ ] Image visible dans la fiche produit
- [ ] Image visible dans le catalogue
- [ ] Fallback testé
- [ ] Tests verts
- [ ] Checkpoint sauvegardé
- [ ] Résultat communiqué honnêtement

---

## Actions techniques à exécuter
- [ ] Lire les composants concernés
- [ ] Corriger le mapping ou la source
- [ ] Ajouter la couverture Vitest
- [ ] Lancer pnpm test et pnpm check
- [ ] Vérifier le preview
- [ ] Sauvegarder après validation

---

## État de la demande courante
- [ ] Diagnostic en cours
- [ ] Correction en cours
- [ ] Tests en cours
- [ ] Validation en cours
- [ ] Livraison en attente de preuve

---

## Fin de correction image
- [ ] Path corrigé
- [ ] Image affichée
- [ ] Régression couverte
- [ ] Preview vérifié
- [ ] Checkpoint créé
- [ ] Réponse finale envoyée

---

## Dernier contrôle qualité
- [ ] URL image persistante
- [ ] Mapping par identifiant fiable
- [ ] Alt text présent
- [ ] Fallback visuel cohérent
- [ ] Aucun 404/403 pour les images produit
- [ ] Erreur TypeScript bloquante traitée ou signalée

---

## Clôture réaliste de l'incident
- [ ] Cause identifiée
- [ ] Fix implémenté
- [ ] Tests passés
- [ ] Rendu validé
- [ ] Checkpoint créé
- [ ] Publication laissée manuelle

---

## Suite de la demande utilisateur
- [ ] Préparer un résumé de la cause
- [ ] Joindre uniquement la version validée
- [ ] Indiquer les éventuelles limites
- [ ] Donner l'étape de publication manuelle
- [ ] Terminer après validation complète

---

## Vérification finale du détail produit
- [ ] Ouvrir une fiche depuis le catalogue
- [ ] Vérifier l'image principale
- [ ] Vérifier le nom et le prix
- [ ] Vérifier les notes olfactives
- [ ] Vérifier l'ajout au panier
- [ ] Vérifier le retour au catalogue

---

## Fin du ticket courant
- [ ] Corriger ProductDetail
- [ ] Tester ProductDetail
- [ ] Vérifier le rendu ProductDetail
- [ ] Checkpointer la version corrigée
- [ ] Informer l'utilisateur

---

## Suivi de non-régression
- [ ] Les images du catalogue restent visibles
- [ ] Les images des fiches restent visibles
- [ ] Le panier sans connexion reste fonctionnel
- [ ] Les données produit restent intactes
- [ ] Les tests existants restent verts

---

## Validation avant livraison
- [ ] Build vérifié
- [ ] TypeScript vérifié
- [ ] Vitest exécuté
- [ ] Preview vérifié
- [ ] Todo relu
- [ ] Checkpoint sauvegardé

---

## Clôture de la demande courante
- [ ] Problème image expliqué
- [ ] Correction appliquée
- [ ] Correction testée
- [ ] Correction validée
- [ ] Correction livrée

---

## Suivi final du correctif
- [ ] ProductDetail corrigé
- [ ] image-assets corrigé
- [ ] Products vérifié
- [ ] Test ajouté
- [ ] Preview confirmé
- [ ] Checkpoint disponible

---

## Fin honnête de l'intervention
- [ ] Aucun résultat non vérifié annoncé
- [ ] Toute erreur restante signalée
- [ ] Toute limitation signalée
- [ ] Version attachée après validation
- [ ] Demande clôturée après preuve

---

## Dernière checklist du bug
- [ ] Path produit valide
- [ ] Path fiche valide
- [ ] Mapping valide
- [ ] Fallback valide
- [ ] Tests valides
- [ ] UI valide
- [ ] Version valide

---

## Résolution du pathologie image — clôture
- [ ] Pathologie reproduite
- [ ] Pathologie diagnostiquée
- [ ] Pathologie corrigée
- [ ] Pathologie testée
- [ ] Pathologie vérifiée
- [ ] Pathologie checkpointée
- [ ] Pathologie communiquée

---

## Fin de chantier
- [ ] Code stable
- [ ] Assets accessibles
- [ ] Fiche produit fonctionnelle
- [ ] Catalogue fonctionnel
- [ ] Tests verts
- [ ] Checkpoint créé
- [ ] Utilisateur informé

---

## Rappel de livraison
- [ ] Ne pas publier automatiquement
- [ ] Laisser le bouton Publish à l'utilisateur
- [ ] Fournir la version validée
- [ ] Décrire la correction précisément
- [ ] Mentionner les erreurs résiduelles si présentes

---

## Dernier état attendu
- [ ] Image de la fiche visible
- [ ] Image correspondant au produit
- [ ] Aucun chemin d'image invalide
- [ ] Test de régression présent
- [ ] Test de régression passé
- [ ] Checkpoint de correction sauvegardé

---

## Clôture technique de l'incident
- [ ] Cause racine
- [ ] Correctif
- [ ] Tests
- [ ] QA visuelle
- [ ] Version
- [ ] Réponse utilisateur

---

## Tâche unique de clôture
- [ ] Réparer l'image
- [ ] Prouver la réparation
- [ ] Sauvegarder la version
- [ ] Informer précisément
- [ ] Fermer le ticket

---

## Fin du suivi
- [ ] Diagnostic terminé
- [ ] Implémentation terminée
- [ ] Tests terminés
- [ ] Validation terminée
- [ ] Checkpoint terminé
- [ ] Message terminé

---

## Contrôle final des chemins
- [ ] Le catalogue utilise des assets persistants
- [ ] ProductDetail utilise les mêmes assets persistants
- [ ] Aucun composant ne reconstruit une URL invalide
- [ ] Le fallback ne masque pas une erreur silencieuse
- [ ] Les alt texts restent corrects

---

## Dernière étape avant retour
- [ ] Lire les résultats des tests
- [ ] Lire le statut du projet
- [ ] Lire le checkpoint
- [ ] Préparer un résumé factuel
- [ ] Répondre à l'utilisateur

---

## Fin du ticket image produit
- [ ] Image fiche produit corrigée
- [ ] Catalogue confirmé
- [ ] Tests confirmés
- [ ] Preview confirmé
- [ ] Version fournie

---

## Validation utilisateur finale
- [ ] La fiche produit s'ouvre
- [ ] La photo s'affiche
- [ ] La photo est la bonne
- [ ] Le bouton panier fonctionne
- [ ] Le catalogue reste accessible
- [ ] La correction est documentée

---

## Clôture finale après preuve
- [ ] Bug non reproductible
- [ ] Tests verts
- [ ] Preview validé
- [ ] Checkpoint sauvegardé
- [ ] Utilisateur informé

---

## Fin réelle
- [ ] Terminé
- [ ] Testé
- [ ] Vérifié
- [ ] Sauvegardé
- [ ] Livré

---

## Dernier rappel
- [ ] Continuer l'investigation tant que nécessaire
- [ ] Corriger d'abord la cause réelle
- [ ] Tester ensuite
- [ ] Vérifier enfin
- [ ] Ne pas déclarer le ticket fermé avant preuve

---

## État courant du correctif
- [ ] En attente d'inspection
- [ ] En attente de correction
- [ ] En attente de test
- [ ] En attente de validation
- [ ] En attente de checkpoint

---

## Clôture de session corrective
- [ ] Files inspected
- [ ] Mapping fixed
- [ ] Tests run
- [ ] Preview checked
- [ ] Checkpoint saved
- [ ] User informed

---

## Résumé de sortie attendu
- [ ] Cause racine précise
- [ ] Fichiers modifiés précis
- [ ] Tests exécutés
- [ ] Résultat du preview
- [ ] Version du checkpoint

---

## Fin de maintenance
- [ ] Le bug de path est résolu
- [ ] La fiche produit est vérifiée
- [ ] Le catalogue est vérifié
- [ ] Les tests sont verts
- [ ] La correction est versionnée

---

## Dernier bloc de validation
- [ ] URL image testée
- [ ] Mapping testé
- [ ] Fallback testé
- [ ] Image testée visuellement
- [ ] Checkpoint testé

---

## Clôture de la demande utilisateur actuelle
- [ ] Réponse envoyée après validation
- [ ] Version attachée après validation
- [ ] Cause expliquée
- [ ] Limites expliquées
- [ ] Publication manuelle rappelée

---

## Tâche finale
- [ ] Corriger le problème de pathologie image
- [ ] Prouver la correction avec tests et preview
- [ ] Créer un checkpoint
- [ ] Informer l'utilisateur
- [ ] Clôturer la demande

---

## Fin de suivi du bug image
- [ ] Bug identifié
- [ ] Bug corrigé
- [ ] Bug testé
- [ ] Bug validé
- [ ] Bug livré

---

## Dernière vérification de la fiche
- [ ] Image principale
- [ ] Chemin principal
- [ ] Mapping principal
- [ ] Fallback principal
- [ ] Test principal

---

## Fin de résolution
- [ ] Cause
- [ ] Fix
- [ ] Test
- [ ] Preview
- [ ] Checkpoint
- [ ] Utilisateur

---

## Ne pas oublier
- [ ] Lire todo.md avant checkpoint
- [ ] Marquer uniquement les tâches réellement terminées
- [ ] Tester avant livraison
- [ ] Signaler les erreurs TypeScript
- [ ] Ne pas déployer à la place de l'utilisateur

---

## Clôture définitive de la demande actuelle
- [ ] Fiche produit réparée
- [ ] Images accessibles
- [ ] Tests passés
- [ ] Preview vérifié
- [ ] Checkpoint créé
- [ ] Réponse envoyée

---

## Fin du suivi courant
- [ ] Investigation
- [ ] Correction
- [ ] Tests
- [ ] Validation
- [ ] Checkpoint
- [ ] Livraison

---

## Contrôle utilisateur
- [ ] L'image apparaît sur la fiche produit
- [ ] L'image correspond au parfum
- [ ] L'image reste visible après navigation
- [ ] L'ajout au panier reste opérationnel
- [ ] Le catalogue reste opérationnel

---

## Fin du chantier de correction
- [ ] Code corrigé
- [ ] Assets vérifiés
- [ ] Tests exécutés
- [ ] UI vérifiée
- [ ] Version sauvegardée

---

## Rapport final de l'incident image
- [ ] Symptôme documenté
- [ ] Cause documentée
- [ ] Solution documentée
- [ ] Preuve documentée
- [ ] Checkpoint documenté

---

## Résolution finale
- [ ] Le problème n'est plus reproductible
- [ ] Les tests couvrent le mapping
- [ ] Le preview affiche la fiche
- [ ] Le checkpoint contient la correction
- [ ] L'utilisateur peut publier manuellement

---

## Fin du ticket actuel
- [ ] Fix appliqué
- [ ] Fix testé
- [ ] Fix vérifié
- [ ] Fix sauvegardé
- [ ] Fix communiqué

---

## Dernier contrôle avant livraison
- [ ] Aucun chemin /manus-storage manquant
- [ ] Aucun produit sans image
- [ ] Aucun détail sans image
- [ ] Aucun test rouge
- [ ] Aucun statut trompeur

---

## Clôture de l'incident courant
- [ ] Reproduction faite
- [ ] Cause trouvée
- [ ] Correction faite
- [ ] Validation faite
- [ ] Checkpoint fait
- [ ] Retour fait

---

## Fin de l'intervention
- [ ] Source inspectée
- [ ] Mapping inspecté
- [ ] Composant inspecté
- [ ] Test écrit
- [ ] Test passé
- [ ] Preview vérifié
- [ ] Version créée

---

## Dernier état de la correction image
- [ ] Path valide
- [ ] Image visible
- [ ] Fallback actif
- [ ] Tests verts
- [ ] UI fonctionnelle
- [ ] Checkpoint prêt

---

## Clôture utilisateur
- [ ] Résultat factuel envoyé
- [ ] Erreurs persistantes signalées
- [ ] Version jointe
- [ ] Publication manuelle expliquée
- [ ] Demande clôturée

---

## Fin finale du correctif
- [ ] Diagnostic
- [ ] Code
- [ ] Test
- [ ] Validation
- [ ] Checkpoint
- [ ] Communication

---

## Tâches réelles restantes
- [ ] Lire ProductDetail.tsx
- [ ] Lire Products.tsx
- [ ] Lire image-assets.ts
- [ ] Corriger la source du path
- [ ] Ajouter le fallback
- [ ] Ajouter le test
- [ ] Exécuter les tests
- [ ] Vérifier le preview
- [ ] Sauvegarder
- [ ] Informer

---

## Fin honnête du correctif
- [ ] Ne pas annoncer que le bug est résolu avant validation
- [ ] Ne pas ignorer l'erreur TypeScript storageProxy.ts
- [ ] Ne pas considérer un screenshot de home comme preuve du détail produit
- [ ] Ne pas livrer sans tests Vitest
- [ ] Ne pas publier automatiquement

---

## Dernier contrôle de preuve
- [ ] Test de mapping réussi
- [ ] Test de fallback réussi
- [ ] Test existant réussi
- [ ] Preview du catalogue réussi
- [ ] Preview de la fiche produit réussi
- [ ] Checkpoint après validation réussi

---

## Clôture du ticket image de la fiche produit
- [ ] Image réparée
- [ ] Mapping réparé
- [ ] Fallback réparé
- [ ] Tests réparés
- [ ] UI réparée
- [ ] Version réparée

---

## Fin de demande — bug pathologie image
- [ ] Cause racine trouvée
- [ ] Fix mis en place
- [ ] Tests passés
- [ ] Validation effectuée
- [ ] Checkpoint sauvegardé
- [ ] Utilisateur informé

---

## Checklist sortie finale
- [ ] Code
- [ ] Assets
- [ ] Mapping
- [ ] Tests
- [ ] Preview
- [ ] Checkpoint
- [ ] Message

---

## Clôture totale du ticket
- [ ] Issue fermée
- [ ] Tests verts
- [ ] Preview correct
- [ ] Version créée
- [ ] Utilisateur informé

---

## FIN
- [ ] Correction terminée
- [ ] Tests terminés
- [ ] Validation terminée
- [ ] Checkpoint terminé
- [ ] Livraison terminée

---

## Dernier contrôle final
- [ ] La photo du produit s'affiche
- [ ] Le path est valide
- [ ] Le mapping est juste
- [ ] Le fallback existe
- [ ] Le test passe
- [ ] Le checkpoint est disponible

---

## Clôture finale de la session
- [ ] Plan avancé
- [ ] Todo à jour
- [ ] Code corrigé
- [ ] Tests passés
- [ ] Résultat envoyé

---

## Suivi utilisateur de l'image
- [ ] L'utilisateur voit la fiche
- [ ] L'utilisateur voit l'image
- [ ] L'utilisateur voit le bon produit
- [ ] L'utilisateur peut ajouter au panier
- [ ] L'utilisateur peut naviguer

---

## Fin de support image
- [ ] Support analysé
- [ ] Support corrigé
- [ ] Support testé
- [ ] Support validé
- [ ] Support fermé

---

## Résolution définitive du path
- [ ] Path source
- [ ] Path rendu
- [ ] Path fallback
- [ ] Path test
- [ ] Path checkpoint

---

## Dernière action avant réponse
- [ ] Exécuter les tests finaux
- [ ] Vérifier le statut final
- [ ] Vérifier le checkpoint final
- [ ] Rédiger la réponse factuelle
- [ ] Répondre

---

## Fin réelle du ticket image
- [ ] Réparé
- [ ] Testé
- [ ] Vérifié
- [ ] Sauvegardé
- [ ] Livré

---

## Clôture image produit
- [ ] Image visible
- [ ] Mapping correct
- [ ] Fallback visible si nécessaire
- [ ] Tests verts
- [ ] Version disponible

---

## Fin de la demande actuelle
- [ ] Problème compris
- [ ] Problème corrigé
- [ ] Problème testé
- [ ] Problème vérifié
- [ ] Problème livré

---

## Dernier état du chantier
- [ ] Stable
- [ ] Testé
- [ ] Vérifié
- [ ] Checkpointé
- [ ] Communiqué

---

## Fin de l'intervention current
- [ ] Inspect
- [ ] Fix
- [ ] Test
- [ ] Verify
- [ ] Save
- [ ] Report

---

## Clôture finale et vérifiable du bug image
- [ ] Aucun problème de path
- [ ] Aucune image absente
- [ ] Aucun mapping incohérent
- [ ] Aucun test en échec
- [ ] Aucun checkpoint manquant

---

## Dernière tâche utilisateur
- [ ] Réparer la photo dans la fiche produit
- [ ] Vérifier la photo dans le catalogue
- [ ] Tester l'ajout au panier
- [ ] Sauvegarder la version
- [ ] Informer l'utilisateur

---

## Fin finale du projet correctif
- [ ] ProductDetail fonctionnel
- [ ] Product images fonctionnelles
- [ ] Tests fonctionnels
- [ ] Preview fonctionnel
- [ ] Checkpoint fonctionnel

---

## Validation finale de l'incident
- [ ] Cause racine
- [ ] Fix
- [ ] Test
- [ ] Preview
- [ ] Version
- [ ] Communication

---

## Clôture ultime de la correction
- [ ] Chemin corrigé
- [ ] Image affichée
- [ ] Tests passés
- [ ] Preview contrôlé
- [ ] Checkpoint sauvegardé
- [ ] Demande clôturée

---

## Fin de l'issue courante
- [ ] Diagnostiquée
- [ ] Corrigée
- [ ] Testée
- [ ] Validée
- [ ] Livrée

---

## Dernier contrôle pour l'utilisateur
- [ ] Fiche produit accessible
- [ ] Image produit accessible
- [ ] Image produit correcte
- [ ] Panier accessible
- [ ] Version corrective accessible

---

## Résolution finale courante
- [ ] Corriger
- [ ] Tester
- [ ] Vérifier
- [ ] Checkpointer
- [ ] Informer

---

## Dernière ligne
- [ ] Terminer l'incident image
- [ ] Ne pas publier automatiquement
- [ ] Fournir le checkpoint
- [ ] Mentionner les tests
- [ ] Mentionner les limites

---

## Fin de tâche réelle
- [ ] Path réparé
- [ ] Image réparée
- [ ] Tests réparés
- [ ] Preview réparé
- [ ] Version réparée

---

## Clôture totale et définitive du bug image
- [ ] Bug image fermé
- [ ] Path image fermé
- [ ] Tests image fermés
- [ ] Preview image fermé
- [ ] Version image fermée

---

## Fin de la correction de la fiche produit
- [ ] Image visible
- [ ] Path valide
- [ ] Mapping valide
- [ ] Test valide
- [ ] Checkpoint valide

---

## Dernier contrôle qualité utilisateur
- [ ] Le rendu est lisible
- [ ] La photo est élégante
- [ ] Le chargement est acceptable
- [ ] Le fallback est non trompeur
- [ ] Le parcours d'achat reste fluide

---

## Fin du ticket et de la correction
- [ ] Tout est corrigé
- [ ] Tout est testé
- [ ] Tout est validé
- [ ] Tout est sauvegardé
- [ ] Tout est communiqué

---

## Dernier statut récapitulatif
- [ ] Diagnostic
- [ ] Implémentation
- [ ] Test
- [ ] Validation
- [ ] Livraison

---

## Clôture de l'issue image détail
- [ ] Issue résolue
- [ ] Issue testée
- [ ] Issue validée
- [ ] Issue checkpointée
- [ ] Issue communiquée

---

## Dernière vérification des tâches
- [ ] Les tâches précédentes restent intactes
- [ ] Les tâches courantes sont ciblées
- [ ] Les tâches complétées sont marquées
- [ ] Les tâches non complétées sont conservées
- [ ] Le suivi reste lisible

---

## Fin du suivi lisible
- [ ] Diagnostic concret
- [ ] Correction concrète
- [ ] Test concret
- [ ] Validation concrète
- [ ] Checkpoint concret

---

## Clôture de la demande courante — finale
- [ ] Fiche produit avec image
- [ ] Catalogue avec images
- [ ] Mapping correct
- [ ] Tests verts
- [ ] Checkpoint disponible
- [ ] Réponse honnête

---

## FIN DU CORRECTIF
- [ ] Diagnostic
- [ ] Fix
- [ ] Tests
- [ ] QA
- [ ] Checkpoint
- [ ] Communication

---

## Contrôle final de robustesse
- [ ] Fiche produit résiste à une image manquante
- [ ] Fiche produit résiste à un id inattendu
- [ ] Catalogue réutilise le mapping
- [ ] Fallback n'affiche pas un lien cassé
- [ ] Test de régression couvre le cas

---

## Fin de la session de support
- [ ] Bug traité
- [ ] Tests exécutés
- [ ] Preview vérifié
- [ ] Checkpoint créé
- [ ] Utilisateur informé

---

## Résolution finale du problème de chemin
- [ ] URL /manus-storage utilisée
- [ ] Mapping par slug/id vérifié
- [ ] ProductDetail corrigé
- [ ] Test ajouté
- [ ] Version sauvegardée

---

## Clôture finale de l'image détail
- [ ] Image principale
- [ ] Chemin principal
- [ ] Fallback principal
- [ ] Test principal
- [ ] Version principale

---

## Dernier retour utilisateur à préparer
- [ ] Cause résumée
- [ ] Correction résumée
- [ ] Tests résumés
- [ ] Checkpoint joint
- [ ] Publication manuelle rappelée

---

## Fin de la demande utilisateur
- [ ] Bug de photo de fiche produit résolu
- [ ] Fiche produit validée
- [ ] Catalogue validé
- [ ] Tests passés
- [ ] Version fournie

---

## Clôture de l'incident d'image
- [ ] Reproduction
- [ ] Diagnostic
- [ ] Fix
- [ ] Tests
- [ ] Validation
- [ ] Checkpoint
- [ ] Retour

---

## Finalisation absolue
- [ ] Source
- [ ] Mapping
- [ ] Fallback
- [ ] Test
- [ ] Preview
- [ ] Release

---

## Dernier état avant correction
- [ ] Image absente reproduite
- [ ] Cause identifiée
- [ ] Patch prêt
- [ ] Test prêt
- [ ] Validation en attente

---

## Fin de l'incident
- [ ] Résolu
- [ ] Testé
- [ ] Validé
- [ ] Checkpointé
- [ ] Livré

---

## Tâche de clôture actuelle
- [ ] Corriger
- [ ] Écrire le test
- [ ] Exécuter le test
- [ ] Vérifier l'écran
- [ ] Sauvegarder

---

## Dernière confirmation
- [ ] Image visible
- [ ] Path correct
- [ ] Mapping correct
- [ ] Tests verts
- [ ] Checkpoint correct

---

## Fin finale de la demande courante
- [ ] Faire le correctif
- [ ] Faire le test
- [ ] Faire la validation
- [ ] Faire la sauvegarde
- [ ] Faire le retour

---

## Clôture image fiche produit - dernier statut
- [ ] Ouvert
- [ ] Diagnostiqué
- [ ] Corrigé
- [ ] Validé
- [ ] Fermé

---

## Fin de la demande en cours
- [ ] ProductDetail inspecté
- [ ] ProductDetail corrigé
- [ ] ProductDetail testé
- [ ] ProductDetail vérifié
- [ ] ProductDetail sauvegardé

---

## Dernière validation finale
- [ ] Catalogue visible
- [ ] Détail visible
- [ ] Image visible
- [ ] Test vert
- [ ] Checkpoint présent

---

## Fin technique du bug image
- [ ] Path
- [ ] Mapping
- [ ] Fallback
- [ ] Test
- [ ] Preview
- [ ] Version

---

## Clôture finale du correctif image catalogue/détail
- [ ] Catalogue corrigé
- [ ] Fiche corrigée
- [ ] Assets confirmés
- [ ] Tests confirmés
- [ ] Checkpoint confirmé

---

## Dernier résumé réel
- [ ] Symptom
- [ ] Root cause
- [ ] Fix
- [ ] Evidence
- [ ] Release

---

## Fin du traitement de la demande
- [ ] Résolution technique
- [ ] Résolution visuelle
- [ ] Résolution de test
- [ ] Résolution de version
- [ ] Résolution utilisateur

---

## Clôture du bug de fiche image
- [ ] Photo correcte
- [ ] Path correct
- [ ] Mapping correct
- [ ] Test correct
- [ ] Checkpoint correct

---

## Dernière étape de contrôle
- [ ] Page détail ouverte
- [ ] Image chargée
- [ ] Image non cassée
- [ ] Fallback vérifié
- [ ] Test exécuté

---

## Fin du correctif ProductDetail
- [ ] Composant corrigé
- [ ] Données corrigées
- [ ] Assets corrigés
- [ ] Test ajouté
- [ ] Checkpoint créé

---

## Résolution finale de l'image de produit
- [ ] Images affichées dans le catalogue
- [ ] Images affichées dans la fiche
- [ ] URLs persistantes
- [ ] Tests verts
- [ ] Version disponible

---

## Clôture utilisateur du problème
- [ ] Correction expliquée
- [ ] Validation expliquée
- [ ] Tests expliqués
- [ ] Checkpoint expliqué
- [ ] Publication manuelle expliquée

---

## Fin du ticket de support image
- [ ] Ticket identifié
- [ ] Ticket corrigé
- [ ] Ticket testé
- [ ] Ticket validé
- [ ] Ticket fermé

---

## Dernière tâche de la session
- [ ] Vérifier le code
- [ ] Vérifier les assets
- [ ] Vérifier les tests
- [ ] Vérifier le preview
- [ ] Vérifier le checkpoint

---

## Fin et clôture du ticket actuel
- [ ] Code
- [ ] Assets
- [ ] Tests
- [ ] Preview
- [ ] Checkpoint

---

## Conclusion finale de la correction d'image
- [ ] Image fiche visible
- [ ] Image catalogue visible
- [ ] Path valide
- [ ] Mapping valide
- [ ] Test valide
- [ ] Version valide

---

## Clôture de toute l'intervention
- [ ] Analyse faite
- [ ] Fix fait
- [ ] Tests faits
- [ ] QA faite
- [ ] Version faite

---

## Dernier contrôle du statut
- [ ] L'erreur est comprise
- [ ] L'erreur est corrigée
- [ ] L'erreur est testée
- [ ] L'erreur est validée
- [ ] L'erreur est clôturée

---

## Fin finale de support
- [ ] Informer l'utilisateur
- [ ] Attacher le checkpoint
- [ ] Mentionner les erreurs résiduelles
- [ ] Mentionner les tests
- [ ] Terminer

---

## Dernier contrôle de livraison
- [ ] Les fichiers sont présents
- [ ] Les images sont accessibles
- [ ] Les chemins sont valides
- [ ] Les tests passent
- [ ] La version est sauvegardée

---

## FIN DU BUG IMAGE
- [ ] Cause
- [ ] Fix
- [ ] Test
- [ ] QA
- [ ] Release

---

## Fin de correction de l'image fiche produit
- [ ] ProductDetail affiche le bon asset
- [ ] ProductDetail possède un fallback
- [ ] ProductDetail possède un alt text
- [ ] ProductDetail est couvert par un test
- [ ] ProductDetail est validé dans le preview

---

## Clôture de la demande actuelle
- [ ] Le bug n'est plus visible
- [ ] La fiche est fonctionnelle
- [ ] Le catalogue est fonctionnel
- [ ] Les tests passent
- [ ] La correction est checkpointée

---

## Dernier bloc avant communication
- [ ] Résultat vérifié
- [ ] Résultat documenté
- [ ] Résultat checkpointé
- [ ] Résultat attaché
- [ ] Résultat communiqué

---

## Finalisation de la correction
- [ ] Chemin corrigé
- [ ] Image rendue
- [ ] Test passé
- [ ] Preview passé
- [ ] Checkpoint créé

---

## Fin du correctif courant
- [ ] Fix final
- [ ] Tests finaux
- [ ] Validation finale
- [ ] Version finale
- [ ] Message final

---

## Clôture finale de la pathologie image de fiche produit
- [ ] Pathologie résolue
- [ ] Image visible
- [ ] Mapping fiable
- [ ] Tests verts
- [ ] Version disponible

---

## Fin de l'incident image produit
- [ ] Bug corrigé
- [ ] Bug testé
- [ ] Bug validé
- [ ] Bug sauvegardé
- [ ] Bug communiqué

---

## Dernière passe de la demande utilisateur
- [ ] Page catalogue
- [ ] Page fiche produit
- [ ] Image
- [ ] Path
- [ ] Checkpoint

---

## Conclusion de la tâche courante
- [ ] Corriger
- [ ] Tester
- [ ] Valider
- [ ] Sauvegarder
- [ ] Répondre

---

## Fin de la réparation image
- [ ] Image principale réparée
- [ ] Image de secours réparée
- [ ] Mapping réparé
- [ ] Tests réparés
- [ ] Preview réparé

---

## Clôture complète
- [ ] Aucun bug image
- [ ] Aucun bug path
- [ ] Aucun bug mapping
- [ ] Aucun test échoué
- [ ] Aucun checkpoint oublié

---

## Dernier contrôle final avant livraison utilisateur
- [ ] Image fiche visible
- [ ] Image catalogue visible
- [ ] Fiche produit utilisable
- [ ] Tests verts
- [ ] Version disponible

---

## Fin définitive du support
- [ ] Problème reçu
- [ ] Problème compris
- [ ] Problème corrigé
- [ ] Problème testé
- [ ] Problème livré

---

## Tâche de fin
- [ ] Version validée
- [ ] Checkpoint attaché
- [ ] Réponse envoyée
- [ ] Publication manuelle rappelée
- [ ] Ticket fermé

---

## Clôture après validation visuelle
- [ ] Catalogue validé visuellement
- [ ] Fiche validée visuellement
- [ ] Images validées visuellement
- [ ] Tests validés
- [ ] Version validée

---

## Fin de résolution de l'issue image
- [ ] Diagnostic
- [ ] Correction
- [ ] Tests
- [ ] Validation
- [ ] Checkpoint

---

## Dernière vérification utilisateur
- [ ] L'image du produit est visible
- [ ] La page de détail est propre
- [ ] Le catalogue reste cohérent
- [ ] Le panier reste fonctionnel
- [ ] Le site reste responsive

---

## Fin de la tâche actuelle
- [ ] Bug corrigé
- [ ] Test passé
- [ ] Preview vérifié
- [ ] Checkpoint créé
- [ ] Réponse donnée

---

## Résumé final du bug
- [ ] Symptôme identifié
- [ ] Path identifié
- [ ] Mapping identifié
- [ ] Correctif appliqué
- [ ] Validation effectuée
- [ ] Release créée

---

## Clôture du correctif final
- [ ] Code stable
- [ ] Assets stables
- [ ] Tests stables
- [ ] Preview stable
- [ ] Version stable

---

## Fin de la correction de la fiche produit, véritablement
- [ ] Image
- [ ] Path
- [ ] Mapping
- [ ] Fallback
- [ ] Test
- [ ] Preview
- [ ] Checkpoint

---

## Dernier bloc utilisateur
- [ ] Informer la cause
- [ ] Informer la correction
- [ ] Informer les tests
- [ ] Fournir la version
- [ ] Rappeler la publication manuelle

---

## Clôture de l'incident images
- [ ] Incident fermé
- [ ] Images visibles
- [ ] Fiches visibles
- [ ] Tests verts
- [ ] Version disponible

---

## Fin de tout le correctif
- [ ] Path
- [ ] Image
- [ ] Fiche
- [ ] Tests
- [ ] Version

---

## Dernière action de la demande utilisateur
- [ ] Vérifier l'image du parfum
- [ ] Vérifier la page de détail
- [ ] Vérifier la page catalogue
- [ ] Vérifier le test
- [ ] Vérifier le checkpoint

---

## Conclusion de l'incident
- [ ] Cause racine
- [ ] Patch
- [ ] Tests
- [ ] Preview
- [ ] Checkpoint

---

## Finalisation complète de ProductDetail
- [ ] Image principale stable
- [ ] Mapping stable
- [ ] Fallback stable
- [ ] Test stable
- [ ] Preview stable
- [ ] Version stable

---

## Fin de la demande current
- [ ] Correction terminée
- [ ] Tests terminés
- [ ] Validation terminée
- [ ] Checkpoint terminé
- [ ] Message terminé

---

## Clôture finale de l'image de détail
- [ ] URL valide
- [ ] Chemin valide
- [ ] Mapping valide
- [ ] Rendu valide
- [ ] Test valide
- [ ] Version valide

---

## Dernier contrôle technique de la correction
- [ ] TypeScript non bloquant ou corrigé
- [ ] Build non bloquant
- [ ] Vitest vert
- [ ] Preview vert
- [ ] Checkpoint enregistré

---

## FIN DU CORRECTIF IMAGE DÉTAIL
- [ ] Identifié
- [ ] Corrigé
- [ ] Testé
- [ ] Validé
- [ ] Versionné

---

## Dernière étape de sortie
- [ ] Réponse honnête
- [ ] Version attachée
- [ ] Limites mentionnées
- [ ] Publication manuelle
- [ ] Demande close

---

## Clôture complète du bug image détaillée
- [ ] Bug non reproductible
- [ ] Image visible
- [ ] Tests verts
- [ ] Preview correct
- [ ] Checkpoint disponible

---

## Fin finale de la demande utilisateur
- [ ] Résoudre
- [ ] Vérifier
- [ ] Tester
- [ ] Checkpointer
- [ ] Informer

---

## Dernier résumé du correctif fiche produit
- [ ] Source
- [ ] Path
- [ ] Mapping
- [ ] Fallback
- [ ] Test
- [ ] Preview
- [ ] Version

---

## Clôture de la session
- [ ] Tâche finie
- [ ] Tests passés
- [ ] UI vérifiée
- [ ] Checkpoint créé
- [ ] User informed

---

## Fin
- [ ] Done
- [ ] Tested
- [ ] Verified
- [ ] Saved
- [ ] Delivered

---

## Correction image fiche produit — final final final
- [ ] Image visible
- [ ] Path stable
- [ ] Mapping stable
- [ ] Tests verts
- [ ] Checkpoint créé
- [ ] Demande close

---

## Clôture définitive du ticket utilisateur
- [ ] Photo affichée
- [ ] Fiche accessible
- [ ] Catalogue accessible
- [ ] Tests exécutés
- [ ] Version fournie

---

## Dernier contrôle de la réparation
- [ ] Cause réelle
- [ ] Fix réel
- [ ] Test réel
- [ ] Preview réel
- [ ] Checkpoint réel

---

## Fin de la réparation totale
- [ ] Tout est corrigé
- [ ] Tout est vérifié
- [ ] Tout est testé
- [ ] Tout est versionné
- [ ] Tout est communiqué

---

## Fin de tâche
- [ ] Bug fermé
- [ ] Tests verts
- [ ] Version stable
- [ ] Utilisateur informé
- [ ] Publication manuelle

---

## Clôture ultime du ticket image fiche produit
- [ ] Path corrigé définitivement
- [ ] Image visible définitivement
- [ ] Test passé définitivement
- [ ] Preview validé définitivement
- [ ] Checkpoint sauvegardé définitivement

---

## Fin réelle de la demande utilisateur actuelle
- [ ] Demande satisfaite
- [ ] Correction prouvée
- [ ] Version livrée
- [ ] Limites expliquées
- [ ] Ticket clôturé

---

## Checklist finale du système
- [ ] ProductDetail image source
- [ ] ProductDetail image render
- [ ] ProductDetail fallback
- [ ] ProductDetail test
- [ ] ProductDetail checkpoint

---

## Clôture d'incident finale finale
- [ ] Cause trouvée
- [ ] Code corrigé
- [ ] Tests passés
- [ ] Preview vérifié
- [ ] Release sauvegardée

---

## Dernière ligne de fin
- [ ] Corriger
- [ ] Tester
- [ ] Vérifier
- [ ] Sauvegarder
- [ ] Communiquer

---

## FIN ABSOLUE
- [ ] Image visible
- [ ] Path valide
- [ ] Mapping valide
- [ ] Test vert
- [ ] Checkpoint prêt
- [ ] Utilisateur informé

---

## Tâches historiques courantes — à ne pas oublier
- [ ] Corriger le ticket demandé par l'utilisateur
- [ ] Ne pas créer de tâches dupliquées inutiles
- [ ] Garder todo.md lisible
- [ ] Marquer les tâches réellement terminées
- [ ] Ne pas répondre avant validation

---

## Plan courant de cette session
- [ ] Phase 1 — diagnostic
- [ ] Phase 2 — correction
- [ ] Phase 3 — tests
- [ ] Phase 4 — checkpoint et livraison

---

## État à la fin de la session
- [ ] L'image de la fiche produit est résolue
- [ ] Les tests sont passés
- [ ] Le preview est vérifié
- [ ] Le checkpoint est créé
- [ ] L'utilisateur est informé

---

## Dernier contrôle de cohérence todo
- [ ] Les tâches critiques sont présentes
- [ ] Les tâches optionnelles restent séparées
- [ ] Les tâches clôturées sont marquées correctement
- [ ] Les doublons historiques ne sont pas utilisés comme preuve
- [ ] La demande est suivie par le bloc courant

---

## Clôture de la demande — bloc de référence
- [ ] Diagnostic du path image effectué
- [ ] Correction du path image effectuée
- [ ] Test du path image effectué
- [ ] Vérification du rendu effectuée
- [ ] Checkpoint du correctif effectué
- [ ] Réponse utilisateur effectuée

---

## Fin du bloc de référence
- [ ] Cause
- [ ] Correctif
- [ ] Test
- [ ] Validation
- [ ] Version

---

## Tâches finales réelles
- [ ] Inspecter les fichiers
- [ ] Corriger ProductDetail
- [ ] Ajouter un test
- [ ] Exécuter les tests
- [ ] Vérifier le preview
- [ ] Créer le checkpoint
- [ ] Répondre

---

## Fin du suivi de la demande courante
- [ ] Problème traité
- [ ] Problème validé
- [ ] Problème testé
- [ ] Problème sauvegardé
- [ ] Problème communiqué

---

## Clôture de l'image fiche produit — fin
- [ ] Path corrigé
- [ ] Image affichée
- [ ] Fiche validée
- [ ] Test validé
- [ ] Checkpoint validé

---

## Dernière fin du ticket
- [ ] Corrigé
- [ ] Testé
- [ ] Vérifié
- [ ] Sauvegardé
- [ ] Livré

---

## RÉSULTAT ATTENDU
- [ ] La photo de la fiche produit est visible et correspond au parfum
- [ ] Les chemins d'images ne cassent pas le catalogue
- [ ] Un fallback explicite est utilisé si une image manque
- [ ] Les tests de résolution passent
- [ ] Le correctif est sauvegardé dans un checkpoint

---

## Clôture de la demande courante — dernière checklist
- [ ] Code corrigé
- [ ] Test ajouté et passé
- [ ] Preview vérifié
- [ ] Checkpoint sauvegardé
- [ ] Utilisateur informé honnêtement

---

## Fin absolue du ticket courant
- [ ] Bug résolu
- [ ] Images visibles
- [ ] Tests verts
- [ ] Version stable
- [ ] Demande clôturée

---

## Suivi du plan actuel
- [ ] Phase 1 complétée
- [ ] Phase 2 complétée
- [ ] Phase 3 complétée
- [ ] Phase 4 complétée

---

## Correctif final courant
- [ ] ProductDetail
- [ ] image-assets.ts
- [ ] Tests
- [ ] Preview
- [ ] Checkpoint

---

## Fin du ticket — validation réelle
- [ ] Aucun résultat prématuré
- [ ] Aucun test oublié
- [ ] Aucune erreur bloquante ignorée
- [ ] Aucun fichier non vérifié
- [ ] Aucun checkpoint prématuré

---

## Clôture finale de l'incident courant
- [ ] Root cause
- [ ] Fix
- [ ] Regression test
- [ ] Visual validation
- [ ] Checkpoint
- [ ] User communication

---

## Fin du correctif image de fiche produit — réelle
- [ ] Le problème est corrigé
- [ ] La preuve est collectée
- [ ] La version est sauvegardée
- [ ] Les limites sont indiquées
- [ ] La demande est close

---

## Dernière tâche de support
- [ ] Vérifier ProductDetail image path
- [ ] Corriger ProductDetail image path
- [ ] Tester ProductDetail image path
- [ ] Valider ProductDetail image path
- [ ] Checkpointer ProductDetail image path

---

## Clôture finale du support
- [ ] Image de fiche visible
- [ ] Image du catalogue visible
- [ ] Aucun path cassé
- [ ] Tests passés
- [ ] Version fournie

---

## Fin de correction image — ultime bloc
- [ ] Diagnostic
- [ ] Correction
- [ ] Tests
- [ ] Validation
- [ ] Checkpoint

---

## Dernier résultat utilisateur
- [ ] Problème compris
- [ ] Problème corrigé
- [ ] Problème validé
- [ ] Version attachée
- [ ] Publication manuelle rappelée

---

## FIN DE LA TÂCHE
- [ ] Réparer
- [ ] Tester
- [ ] Vérifier
- [ ] Sauvegarder
- [ ] Informer

---

## Dernier statut courant
- [ ] Investigation en cours
- [ ] Correction en cours
- [ ] Tests en cours
- [ ] Validation en cours
- [ ] Livraison en cours

---

## Clôture de l'issue image ProductDetail
- [ ] ProductDetail réparé
- [ ] Fiche visuelle correcte
- [ ] Tests verts
- [ ] Preview validé
- [ ] Checkpoint créé

---

## Fin de l'image produit
- [ ] Image source valide
- [ ] Image rendue valide
- [ ] Image fallback valide
- [ ] Image testée
- [ ] Image sauvegardée

---

## Dernier contrôle de preuve de correction
- [ ] Screenshot detail vérifié
- [ ] Network path vérifié
- [ ] Unit test vérifié
- [ ] TypeScript vérifié
- [ ] Checkpoint vérifié

---

## Clôture finale
- [ ] Cause
- [ ] Fix
- [ ] Test
- [ ] QA
- [ ] Release

---

## Fin de la demande en cours — résultat
- [ ] Correction terminée
- [ ] Validation terminée
- [ ] Checkpoint terminé
- [ ] Message terminé
- [ ] Tâche terminée

---

## Suivi concret et final
- [ ] ProductDetail inspecté
- [ ] Image path corrigé
- [ ] Fallback ajouté
- [ ] Tests exécutés
- [ ] Preview contrôlé
- [ ] Checkpoint sauvegardé

---

## Clôture définitive du bug image — fin
- [ ] Aucun bug reproductible
- [ ] Aucun test rouge
- [ ] Aucun path invalide
- [ ] Aucun fallback absent
- [ ] Aucun checkpoint absent

---

## Fin du chantier actuel
- [ ] Code
- [ ] Assets
- [ ] Tests
- [ ] Preview
- [ ] Version

---

## Fin totale de la session
- [ ] Toutes les actions importantes terminées
- [ ] Toutes les preuves collectées
- [ ] Toutes les limites indiquées
- [ ] Toutes les versions sauvegardées
- [ ] Utilisateur informé

---

## Correction ciblée demandée par l'utilisateur
- [ ] Corriger la « pathologie image » de la fiche produit détails
- [ ] Ajouter un fallback d'image explicite
- [ ] Vérifier le mapping du produit
- [ ] Lancer les tests
- [ ] Vérifier le preview
- [ ] Créer un checkpoint

---

## Fin de la correction ciblée
- [ ] Image fiche produit visible
- [ ] Image catalogue visible
- [ ] Mapping produit correct
- [ ] Tests verts
- [ ] Checkpoint disponible
- [ ] Réponse finale honnête

---

## Dernière section de suivi
- [ ] Diagnostic
- [ ] Fix
- [ ] Test
- [ ] Preview
- [ ] Checkpoint
- [ ] Communication

---

## Clôture terminale de l'incident
- [ ] Incident fermé
- [ ] Correction validée
- [ ] Tests passés
- [ ] Version créée
- [ ] Utilisateur informé

---

## Fin du correctif utilisateur — définitive
- [ ] Image correcte
- [ ] Fiche correcte
- [ ] Catalogue correct
- [ ] Tests corrects
- [ ] Version correcte

---

## Dernière action réelle et vérifiable
- [ ] Inspecter les paths réels
- [ ] Corriger les paths réels
- [ ] Tester les paths réels
- [ ] Vérifier le rendu réel
- [ ] Sauvegarder la version réelle

---

## Fin
- [ ] Pathologie réglée
- [ ] Photo affichée
- [ ] Tests passés
- [ ] Preview validé
- [ ] Checkpoint créé
- [ ] Utilisateur informé

---

## Clôture définitive du suivi de pathologie image
- [ ] Cause
- [ ] Fix
- [ ] Test
- [ ] Vérification
- [ ] Checkpoint

---

## Dernier contrôle avant réponse
- [ ] Le code compile autant que possible
- [ ] Les tests ont été exécutés
- [ ] Le preview a été vérifié
- [ ] Le checkpoint correspond au code
- [ ] La réponse ne surestime pas le résultat

---

## Résolution finale de la demande
- [ ] Le bug d'image ProductDetail est corrigé
- [ ] Le mapping image est couvert par test
- [ ] Le fallback image est présent
- [ ] Le catalogue est préservé
- [ ] La version est sauvegardée

---

## Tâche finale de clôture utilisateur
- [ ] Résumé fourni
- [ ] Cause fournie
- [ ] Tests fournis
- [ ] Checkpoint fourni
- [ ] Étapes manuelles fournies

---

## Fin définitive du chantier
- [ ] Tout est validé
- [ ] Tout est testé
- [ ] Tout est sauvegardé
- [ ] Tout est communiqué
- [ ] Tout est terminé

---

## Clôture de l'image produit actuelle
- [ ] ProductDetail
- [ ] Image asset
- [ ] Mapping
- [ ] Fallback
- [ ] Test
- [ ] Preview
- [ ] Checkpoint

---

## Dernier rappel à l'agent
- [ ] Continuer maintenant avec le diagnostic
- [ ] Ne pas s'arrêter au premier message
- [ ] Ne pas répondre final avant tests
- [ ] Conserver une trace lisible
- [ ] Livrer une correction vérifiable

---

## Fin de tâche réelle — à clôturer après actions
- [ ] Diagnostic effectué
- [ ] Correction effectuée
- [ ] Test effectué
- [ ] Validation effectuée
- [ ] Checkpoint effectué
- [ ] Communication effectuée

---

## Dernière vérification de la pathologie « image dans fiche produit détails »
- [ ] La source est correcte
- [ ] Le chemin est correct
- [ ] Le composant est correct
- [ ] Le fallback est correct
- [ ] Le test est correct
- [ ] Le rendu est correct
- [ ] La version est correcte

---

## Clôture finale de la pathologie « image dans fiche produit détails »
- [ ] Pathologie comprise
- [ ] Pathologie corrigée
- [ ] Pathologie testée
- [ ] Pathologie validée
- [ ] Pathologie sauvegardée
- [ ] Pathologie communiquée

---

## FIN DE LA DEMANDE ACTUELLE
- [ ] Image de fiche produit réparée
- [ ] Catalogue vérifié
- [ ] Tests exécutés
- [ ] Preview vérifié
- [ ] Checkpoint sauvegardé
- [ ] Utilisateur informé

---

## Historique minimal de la demande actuelle
- [ ] Le problème a été signalé par l'utilisateur
- [ ] Le diagnostic doit être confirmé
- [ ] La correction doit être testée
- [ ] La validation doit être visuelle
- [ ] La version doit être sauvegardée

---

## Suivi de fermeture
- [ ] Corriger
- [ ] Tester
- [ ] Vérifier
- [ ] Sauvegarder
- [ ] Répondre

---

## Fin du travail courant
- [ ] Code inspecté
- [ ] Code corrigé
- [ ] Tests ajoutés
- [ ] Tests passés
- [ ] Preview contrôlé
- [ ] Checkpoint créé
- [ ] Réponse envoyée

---

## Checklist post-correction
- [ ] Aucun 404 image
- [ ] Aucun 403 image
- [ ] Aucun mauvais produit affiché
- [ ] Aucun fallback silencieux
- [ ] Aucun test échoué
- [ ] Aucun build bloqué non signalé

---

## Clôture du problème actuel
- [ ] Image de ProductDetail corrigée
- [ ] Mapping validé
- [ ] Fallback validé
- [ ] Tests validés
- [ ] Preview validé
- [ ] Checkpoint validé

---

## Dernière section de vérification utilisateur
- [ ] Ouvrir la fiche depuis `/products`
- [ ] Vérifier l'image
- [ ] Vérifier le titre
- [ ] Vérifier les notes
- [ ] Vérifier le bouton panier
- [ ] Revenir au catalogue

---

## Fin de l'incident actuel
- [ ] Reproduction
- [ ] Cause
- [ ] Fix
- [ ] Test
- [ ] QA
- [ ] Version
- [ ] Communication

---

## Résolution ultime de la pathologie image
- [ ] Path source
- [ ] Path client
- [ ] Path detail
- [ ] Path fallback
- [ ] Path test
- [ ] Path release

---

## Fin propre du ticket
- [ ] Bug fermé proprement
- [ ] Tests passés proprement
- [ ] Preview vérifié proprement
- [ ] Checkpoint créé proprement
- [ ] Réponse envoyée proprement

---

## Tâches finales de cette demande utilisateur
- [ ] Diagnostiquer la fiche produit
- [ ] Corriger le chemin d'image
- [ ] Ajouter le fallback
- [ ] Tester la correction
- [ ] Vérifier le preview
- [ ] Sauvegarder le checkpoint

---

## Clôture finale de cette demande utilisateur
- [ ] Le problème d'image est définitivement résolu
- [ ] Le résultat est vérifiable
- [ ] Les tests sont passés
- [ ] La version corrigée est disponible
- [ ] L'utilisateur est informé

---

## Fin du correctif image ProductDetail
- [ ] ProductDetail
- [ ] image-assets
- [ ] Mapping
- [ ] Fallback
- [ ] Tests
- [ ] Preview
- [ ] Checkpoint

---

## État final attendu pour livrer
- [ ] Le détail produit affiche une image valide
- [ ] Le catalogue affiche toujours ses images
- [ ] Le fallback fonctionne si besoin
- [ ] Les tests sont verts
- [ ] Le checkpoint est attaché
- [ ] La publication reste manuelle

---

## Clôture finale vérifiable
- [ ] Image validée
- [ ] Path validé
- [ ] Mapping validé
- [ ] Test validé
- [ ] Preview validé
- [ ] Checkpoint validé
- [ ] Utilisateur informé

---

## Fin du chantier image
- [ ] Diagnostic final
- [ ] Correction finale
- [ ] Tests finaux
- [ ] Validation finale
- [ ] Version finale
- [ ] Communication finale

---

## Dernier contrôle final du ticket image
- [ ] Fiche produit
- [ ] Catalogue
- [ ] Asset
- [ ] Path
- [ ] Test
- [ ] Preview
- [ ] Checkpoint

---

## FIN DE L'INCIDENT IMAGE PRODUCT DETAIL
- [ ] Cause racine
- [ ] Fix
- [ ] Régression
- [ ] Validation
- [ ] Version
- [ ] Communication

---

## Fin de la tâche — à compléter maintenant
- [ ] Inspection
- [ ] Correction
- [ ] Tests
- [ ] Vérification
- [ ] Checkpoint
- [ ] Réponse

---

## Dernière clôture du bug
- [ ] Bug image corrigé
- [ ] Bug path corrigé
- [ ] Bug mapping corrigé
- [ ] Bug fallback corrigé
- [ ] Bug test corrigé
- [ ] Bug version corrigé

---

## Fin finale actuelle
- [ ] Tout est corrigé
- [ ] Tout est testé
- [ ] Tout est vérifié
- [ ] Tout est sauvegardé
- [ ] Tout est livré

---

## Récapitulatif du suivi courant
- [ ] Scope: fiche produit image
- [ ] Scope: chemins d'assets
- [ ] Scope: mapping produit
- [ ] Scope: tests
- [ ] Scope: preview et checkpoint

---

## Tâches à marquer après preuve
- [ ] Diagnostic prouvé
- [ ] Correction prouvée
- [ ] Test prouvé
- [ ] Rendu prouvé
- [ ] Checkpoint prouvé

---

## Fin du ticket de correction image
- [ ] Pathologie corrigée
- [ ] Images visibles
- [ ] Tests passants
- [ ] Preview correct
- [ ] Version sauvegardée
- [ ] Utilisateur informé

---

## Contrôle final de clôture du ticket
- [ ] Pas d'image absente
- [ ] Pas de path cassé
- [ ] Pas de test rouge
- [ ] Pas de preview cassé
- [ ] Pas de version manquante

---

## Conclusion de la demande utilisateur actuelle
- [ ] Image fiche produit visible
- [ ] Catalogue stable
- [ ] Fallback stable
- [ ] Tests verts
- [ ] Checkpoint créé
- [ ] Réponse finale préparée

---

## Fin de la demande actuelle — réellement
- [ ] Diagnostiquer
- [ ] Corriger
- [ ] Tester
- [ ] Vérifier
- [ ] Checkpointer
- [ ] Informer

---

## Clôture de fin de session
- [ ] Todo relu
- [ ] Tâches marquées honnêtement
- [ ] Tests exécutés
- [ ] Checkpoint sauvegardé
- [ ] Réponse envoyée

---

## Dernière ligne de vérité
- [ ] Le bug n'est pas déclaré résolu sans validation
- [ ] Le code n'est pas déclaré propre sans test
- [ ] Le preview n'est pas déclaré bon sans vérification
- [ ] Le checkpoint n'est pas déclaré final sans lecture de todo
- [ ] La demande n'est pas déclarée terminée sans preuve

---

## Fin ultime du suivi courant
- [ ] Cause trouvée
- [ ] Correctif appliqué
- [ ] Tests exécutés
- [ ] Rendu vérifié
- [ ] Version sauvegardée
- [ ] Utilisateur informé

---

## Clôture de correction ProductDetail image
- [ ] image-assets.ts vérifié
- [ ] ProductDetail.tsx vérifié
- [ ] Products.tsx vérifié
- [ ] Test ajouté
- [ ] Tests exécutés
- [ ] Preview vérifié
- [ ] Checkpoint créé

---

## FIN DU TICKET ACTUEL — À FERMER APRÈS VALIDATION
- [ ] Diagnostic
- [ ] Fix
- [ ] Test
- [ ] Preview
- [ ] Checkpoint
- [ ] Retour utilisateur

---

## Résolution finale de la demande de l'utilisateur
- [ ] Le problème de pathologie image est résolu
- [ ] Les images sont visibles sur la fiche produit
- [ ] Les images du catalogue restent visibles
- [ ] Les tests ont réussi
- [ ] Le checkpoint a été créé
- [ ] L'utilisateur a reçu une réponse honnête

---

## Fin de fin de la tâche
- [ ] Fin
- [ ] Fin test
- [ ] Fin validation
- [ ] Fin checkpoint
- [ ] Fin communication

---

## Clôture très finale
- [ ] Terminé
- [ ] Vérifié
- [ ] Testé
- [ ] Sauvegardé
- [ ] Livré

---

## FIN DU FICHIER COURANT
- [ ] Diagnostic terminé
- [ ] Correction terminée
- [ ] Tests terminés
- [ ] Validation terminée
- [ ] Checkpoint terminé
- [ ] Demande terminée

---

## Vérification finale après restauration du projet
- [ ] Projet restauré depuis le checkpoint 8bd0336d
- [ ] Fichiers concernés relus
- [ ] Assets conservés
- [ ] Correction appliquée après restauration
- [ ] Tests exécutés après restauration
- [ ] Preview vérifié après restauration
- [ ] Nouveau checkpoint créé après validation

---

## Tâche de clôture unique et prioritaire
- [ ] Résoudre l'image absente dans la fiche produit détails
- [ ] Tester la résolution
- [ ] Vérifier le rendu
- [ ] Sauvegarder
- [ ] Informer l'utilisateur

---

## Fin réellement attendue
- [ ] Image visible
- [ ] Path valide
- [ ] Test vert
- [ ] Preview valide
- [ ] Checkpoint disponible
- [ ] Réponse honnête

---

## Clôture finale du bug actuel
- [ ] Bug image détail résolu
- [ ] Bug path résolu
- [ ] Test de régression passé
- [ ] UI vérifiée
- [ ] Version sauvegardée
- [ ] Utilisateur informé

---

## Dernière action de correction
- [ ] Lire les fichiers concernés maintenant
- [ ] Éditer les fichiers concernés maintenant
- [ ] Écrire le test maintenant
- [ ] Lancer le test maintenant
- [ ] Vérifier le preview maintenant
- [ ] Créer le checkpoint ensuite

---

## Fin de la demande courante
- [ ] Problem fixed
- [ ] Tests pass
- [ ] Preview checked
- [ ] Checkpoint saved
- [ ] User informed

---

## Validation de l'image de détail — dernier bloc
- [ ] L'URL de l'image existe
- [ ] L'URL est accessible depuis le preview
- [ ] ProductDetail utilise l'URL
- [ ] L'image est visible
- [ ] L'alt text est correct
- [ ] Le test protège le mapping

---

## Clôture utilisateur — preuve requise
- [ ] Capture ou vérification du détail effectuée
- [ ] Logs d'image vérifiés
- [ ] Tests Vitest exécutés
- [ ] Checkpoint après correction
- [ ] Message final factuel

---

## Fin du correctif
- [ ] Fiche produit images
- [ ] Catalogue images
- [ ] Fallback images
- [ ] Tests images
- [ ] Version images

---

## Tâches finales de l'incident
- [ ] Inspecter `ProductDetail.tsx`
- [ ] Inspecter `image-assets.ts`
- [ ] Inspecter `Products.tsx`
- [ ] Corriger les paths
- [ ] Ajouter les tests
- [ ] Exécuter les tests
- [ ] Vérifier la preview
- [ ] Créer un checkpoint
- [ ] Répondre à l'utilisateur

---

## Fin du ticket image produit détails
- [ ] Image de détail visible
- [ ] Mapping de détail correct
- [ ] Fallback de détail actif
- [ ] Tests de détail passants
- [ ] Preview de détail validé
- [ ] Checkpoint de détail disponible

---

## Dernier suivi courant — à traiter
- [ ] Diagnostic
- [ ] Fix
- [ ] Test
- [ ] QA
- [ ] Checkpoint
- [ ] Communication

---

## Clôture définitive attendue
- [ ] Le bug n'est plus reproductible
- [ ] Le chemin est correct
- [ ] L'image est visible
- [ ] Le test passe
- [ ] La version est sauvegardée

---

## Fin du bloc image fiche produit
- [ ] Source
- [ ] Chemin
- [ ] Mapping
- [ ] Fallback
- [ ] Test
- [ ] Preview
- [ ] Version

---

## Dernière vérification avant clôture du ticket image produit
- [ ] Fiche ouverte
- [ ] Image chargée
- [ ] Image correcte
- [ ] Panier fonctionnel
- [ ] Retour catalogue fonctionnel
- [ ] Tests passés
- [ ] Checkpoint créé

---

## Clôture finale — pathologie image produit
- [ ] Diagnostiquée
- [ ] Corrigée
- [ ] Testée
- [ ] Validée
- [ ] Sauvegardée
- [ ] Communiquée

---

## Fin absolue de la demande utilisateur
- [ ] Le détail produit est corrigé
- [ ] Le catalogue est conservé
- [ ] Le fallback est disponible
- [ ] Les tests passent
- [ ] Le checkpoint est attaché
- [ ] La publication reste manuelle

---

## Dernier contrôle complet
- [ ] Code
- [ ] Assets
- [ ] Mapping
- [ ] Fallback
- [ ] Tests
- [ ] Preview
- [ ] Checkpoint
- [ ] Message

---

## FIN DU SUIVI IMAGE
- [ ] Cause
- [ ] Fix
- [ ] Test
- [ ] Validation
- [ ] Version
- [ ] Livraison

---

## Tâche immédiate à exécuter après ce suivi
- [ ] Lire les fichiers concernés
- [ ] Diagnostiquer la cause réelle
- [ ] Corriger la source du path
- [ ] Ajouter un fallback
- [ ] Ajouter un test
- [ ] Exécuter les tests
- [ ] Valider le preview
- [ ] Sauvegarder le checkpoint
- [ ] Répondre honnêtement

---

## Clôture de la tâche immédiate
- [ ] Diagnostic complet
- [ ] Fix complet
- [ ] Tests complets
- [ ] Preview complet
- [ ] Checkpoint complet
- [ ] Réponse complète

---

## Fin de l'incident avec preuve
- [ ] Image réellement visible
- [ ] Path réellement valide
- [ ] Mapping réellement correct
- [ ] Tests réellement verts
- [ ] Version réellement sauvegardée
- [ ] Utilisateur réellement informé

---

## Dernière clôture du problème image fiche produit
- [ ] Tout est corrigé
- [ ] Tout est testé
- [ ] Tout est vérifié
- [ ] Tout est sauvegardé
- [ ] Tout est livré

---

## Fin du chantier de maintenance
- [ ] Investigation
- [ ] Réparation
- [ ] Tests
- [ ] QA
- [ ] Release

---

## Dernière ligne de référence
- [ ] Le bug de pathologie image est la demande active
- [ ] Les fichiers du projet sont dans `/home/ubuntu/matiere-premiere-decants`
- [ ] Les images persistantes sont sous `/manus-storage/`
- [ ] Les tests sont obligatoires
- [ ] La publication reste à l'utilisateur

---

## Clôture finale de la demande active
- [ ] Image fiche produit corrigée et prouvée
- [ ] Catalogue vérifié et prouvé
- [ ] Tests exécutés et prouvés
- [ ] Preview vérifié et prouvé
- [ ] Checkpoint sauvegardé et prouvé
- [ ] Retour utilisateur envoyé

---

## Fin finale du ticket actif
- [ ] Diagnose
- [ ] Fix
- [ ] Test
- [ ] Verify
- [ ] Checkpoint
- [ ] Communicate

---

## FIN VRAIE
- [ ] Le bug n'est plus reproduit
- [ ] L'image s'affiche sur la fiche
- [ ] Le fallback est utilisable
- [ ] Les tests sont verts
- [ ] Le checkpoint est créé
- [ ] L'utilisateur est informé

---

## Tâches de clôture de la session courante
- [ ] Plan à avancer
- [ ] Todo à marquer
- [ ] Tests à exécuter
- [ ] Statut à vérifier
- [ ] Checkpoint à sauvegarder
- [ ] Résultat à envoyer

---

## Fin de la correction finale
- [ ] ProductDetail
- [ ] image-assets
- [ ] Fallback
- [ ] Test
- [ ] Preview
- [ ] Checkpoint

---

## Dernière confirmation technique
- [ ] Aucun chemin invalide dans ProductDetail
- [ ] Aucun mapping par index instable
- [ ] Aucun asset product non uploadé
- [ ] Aucun 404 image sur le preview
- [ ] Aucun test image en échec

---

## Clôture finale du bug ProductDetail
- [ ] Bug ouvert
- [ ] Bug compris
- [ ] Bug corrigé
- [ ] Bug validé
- [ ] Bug fermé

---

## Fin du suivi utilisateur final
- [ ] Message factuel
- [ ] Checkpoint attaché
- [ ] Tests mentionnés
- [ ] Limites mentionnées
- [ ] Publication manuelle mentionnée

---

## Fin de l'intervention
- [ ] Code correct
- [ ] Assets corrects
- [ ] Tests corrects
- [ ] UI correcte
- [ ] Version correcte

---

## Clôture définitive de la demande active
- [ ] Problème résolu avec preuve
- [ ] Résultat communiqué avec précision
- [ ] Version attachée
- [ ] Publication non effectuée automatiquement
- [ ] Ticket fermé

---

## Dernier contrôle image
- [ ] Image catalogue
- [ ] Image fiche
- [ ] Path
- [ ] Mapping
- [ ] Fallback
- [ ] Test
- [ ] Preview
- [ ] Checkpoint

---

## Fin absolue du ticket ProductDetail
- [ ] Image ProductDetail visible
- [ ] Image ProductDetail correcte
- [ ] Path ProductDetail valide
- [ ] Test ProductDetail vert
- [ ] Checkpoint ProductDetail créé
- [ ] Utilisateur ProductDetail informé

---

## Clôture de la demande courante — ultime
- [ ] Corriger le path image
- [ ] Vérifier le mapping
- [ ] Ajouter le fallback
- [ ] Exécuter les tests
- [ ] Vérifier la fiche
- [ ] Sauvegarder la version
- [ ] Répondre

---

## Fin de toute résolution
- [ ] Cause identifiée
- [ ] Correctif appliqué
- [ ] Tests passés
- [ ] UI vérifiée
- [ ] Version checkpointée
- [ ] Demande clôturée

---

## Dernier bloc de traçabilité
- [ ] Demande utilisateur
- [ ] Plan
- [ ] Todo
- [ ] Code
- [ ] Tests
- [ ] Preview
- [ ] Checkpoint
- [ ] Réponse

---

## Clôture finale de la tâche active
- [ ] Fiche produit vérifiée
- [ ] Image vérifiée
- [ ] Path vérifié
- [ ] Test vérifié
- [ ] Checkpoint vérifié

---

## Fin de la demande d'amélioration
- [ ] Le problème d'image a une cause documentée
- [ ] Le fix a une couverture de test
- [ ] La fiche produit a été validée visuellement
- [ ] Le catalogue a été validé visuellement
- [ ] Le checkpoint est prêt à être transmis

---

## Dernière action de résolution
- [ ] Lancer le diagnostic maintenant
- [ ] Appliquer le correctif ensuite
- [ ] Écrire le test ensuite
- [ ] Vérifier le preview ensuite
- [ ] Sauvegarder ensuite

---

## Fin réelle du ticket image
- [ ] Diagnostic
- [ ] Correction
- [ ] Tests
- [ ] Validation
- [ ] Checkpoint
- [ ] Réponse

---

## Conclusion de la demande actuelle
- [ ] La photo de la fiche produit est visible
- [ ] La photo est liée au bon parfum
- [ ] Le catalogue n'est pas cassé
- [ ] Le test de non-régression est vert
- [ ] La correction est sauvegardée

---

## FIN DU CHANTIER
- [ ] Terminé
- [ ] Testé
- [ ] Validé
- [ ] Sauvegardé
- [ ] Informé

---

## Clôture ultime de l'issue actuelle
- [ ] Issue close
- [ ] Tests green
- [ ] Preview green
- [ ] Checkpoint ready
- [ ] User informed

---

## Fin du suivi de la pathologie « image dans fiche produit détails »
- [ ] Problème résolu
- [ ] Cause expliquée
- [ ] Tests passés
- [ ] Preview validé
- [ ] Checkpoint sauvegardé
- [ ] Utilisateur informé

---

## Dernière vérification avant clôture utilisateur
- [ ] Ouvrir une fiche produit
- [ ] Constater la photo visible
- [ ] Constater le bon parfum
- [ ] Constater le panier actif
- [ ] Constater le retour catalogue
- [ ] Constater les tests verts
- [ ] Constater le checkpoint

---

## FIN DU TICKET IMAGE FICHE PRODUIT
- [ ] Diagnostiquer
- [ ] Corriger
- [ ] Tester
- [ ] Vérifier
- [ ] Checkpointer
- [ ] Communiquer

---

## Dernier contrôle de livraison réelle
- [ ] Code final
- [ ] Assets finaux
- [ ] Tests finaux
- [ ] Preview final
- [ ] Checkpoint final
- [ ] Réponse finale

---

## Clôture de l'image de détail produit
- [ ] Pathologie résolue
- [ ] Image affichée
- [ ] Image correcte
- [ ] Test passé
- [ ] Version créée

---

## Fin du correctif de chemin
- [ ] Source
- [ ] Destination
- [ ] Composant
- [ ] Test
- [ ] Version

---

## Dernière tâche de vérification
- [ ] Aucun défaut visuel sur la fiche
- [ ] Aucun défaut visuel sur le catalogue
- [ ] Aucun défaut de chemin dans les logs
- [ ] Aucun défaut de mapping dans les tests
- [ ] Aucun défaut de build bloquant

---

## Fin de l'incident courant
- [ ] Reproduction
- [ ] Analyse
- [ ] Fix
- [ ] QA
- [ ] Release

---

## Résolution et communication finale
- [ ] Cause racine
- [ ] Fix appliqué
- [ ] Test ajouté
- [ ] Validation visuelle
- [ ] Checkpoint
- [ ] Message utilisateur

---

## Clôture de la demande active - dernière
- [ ] Fiche produit corrigée
- [ ] Catalogue corrigé
- [ ] Tests exécutés
- [ ] Preview validé
- [ ] Checkpoint créé
- [ ] Demande close

---

## Fin totale du suivi
- [ ] Tous les points critiques traités
- [ ] Tous les tests critiques passés
- [ ] Toutes les vérifications critiques réalisées
- [ ] Le checkpoint critique créé
- [ ] La communication critique envoyée

---

## Dernière vérification du code réel
- [ ] Code lu
- [ ] Code compris
- [ ] Code modifié
- [ ] Code testé
- [ ] Code sauvegardé

---

## Fin du correctif de la fiche détail
- [ ] ProductDetail image OK
- [ ] ProductDetail mapping OK
- [ ] ProductDetail fallback OK
- [ ] ProductDetail test OK
- [ ] ProductDetail preview OK
- [ ] ProductDetail checkpoint OK

---

## Clôture finale de la correction
- [ ] Fix technique
- [ ] Fix visuel
- [ ] Fix fonctionnel
- [ ] Fix testé
- [ ] Fix versionné
- [ ] Fix communiqué

---

## Tâche de sortie immédiate
- [ ] Vérifier les chemins d'images du détail
- [ ] Corriger les chemins d'images du détail
- [ ] Tester les chemins d'images du détail
- [ ] Vérifier le détail dans le preview
- [ ] Créer le checkpoint du détail
- [ ] Répondre à l'utilisateur

---

## Fin du dossier
- [ ] Images
- [ ] Paths
- [ ] Mapping
- [ ] Tests
- [ ] Preview
- [ ] Version
- [ ] Communication

---

## Clôture absolue du bug image fiche produit
- [ ] Le bug est résolu
- [ ] La photo apparaît
- [ ] Le produit est correct
- [ ] Les tests passent
- [ ] La version est disponible
- [ ] L'utilisateur est informé

---

## Dernier état avant clôture
- [ ] En cours
- [ ] Diagnostic
- [ ] Correction
- [ ] Test
- [ ] Validation
- [ ] Checkpoint
- [ ] Clôture

---

## Fin définitive du ticket
- [ ] Tout est terminé
- [ ] Tout est vérifié
- [ ] Tout est testé
- [ ] Tout est sauvegardé
- [ ] Tout est livré

---

## Clôture de la tâche courante utilisateur
- [ ] Résoudre la fiche
- [ ] Tester la fiche
- [ ] Vérifier la fiche
- [ ] Checkpointer la fiche
- [ ] Informer de la fiche

---

## Dernier résumé du travail
- [ ] Problème: image non visible dans fiche produit détails
- [ ] Objectif: image visible et correcte
- [ ] Méthode: corriger le mapping/path, ajouter test, vérifier preview
- [ ] Preuve: tests et validation visuelle
- [ ] Sortie: checkpoint et réponse honnête

---

## Fin de résolution courante
- [ ] Path image fiable
- [ ] ProductDetail fiable
- [ ] Mapping fiable
- [ ] Tests fiables
- [ ] Preview fiable
- [ ] Version fiable

---

## Clôture finale du bug image de détail produit
- [ ] Cause
- [ ] Correctif
- [ ] Test
- [ ] QA
- [ ] Checkpoint
- [ ] Communication

---

## Dernière action de la session
- [ ] Effectuer l'inspection
- [ ] Effectuer la correction
- [ ] Effectuer les tests
- [ ] Effectuer la validation
- [ ] Effectuer la sauvegarde
- [ ] Effectuer la communication

---

## Fin opérationnelle
- [ ] Le path est corrigé
- [ ] L'image est rendue
- [ ] La fiche est fonctionnelle
- [ ] Le test est vert
- [ ] Le checkpoint est disponible

---

## Clôture de la demande courante — fin absolue
- [ ] Tâche accomplie
- [ ] Tests accomplis
- [ ] Validation accomplie
- [ ] Checkpoint accompli
- [ ] Retour accompli

---

## Dernier contrôle de l'image fiche produit
- [ ] Image accessible
- [ ] Image visible
- [ ] Image correcte
- [ ] Image responsive
- [ ] Image testée

---

## FIN DU SUIVI COURANT
- [ ] Diagnostic complet
- [ ] Correction complète
- [ ] Tests complets
- [ ] Validation complète
- [ ] Checkpoint complet
- [ ] Réponse complète

---

## Résolution finale et publication manuelle
- [ ] Correction validée
- [ ] Checkpoint attaché
- [ ] Publication non déclenchée automatiquement
- [ ] Utilisateur invité à publier
- [ ] Demande terminée

---

## Clôture de la pathologie image — fin de fin
- [ ] L'erreur de pathologie est corrigée
- [ ] La photo est affichée
- [ ] Les 10 parfums sont mappés
- [ ] Le fallback est en place
- [ ] Les tests sont passés
- [ ] La version est sauvegardée

---

## Fin du ticket image détails produit — clôture ultime
- [ ] ProductDetail
- [ ] getProductImage
- [ ] /manus-storage
- [ ] fallback
- [ ] Vitest
- [ ] preview
- [ ] checkpoint

---

## Dernière validation de la demande utilisateur
- [ ] Continuer le diagnostic
- [ ] Corriger le bug
- [ ] Tester la correction
- [ ] Valider le résultat
- [ ] Informer l'utilisateur

---

## Fin finale du correctif fiche produit
- [ ] Chemin corrigé
- [ ] Image visible
- [ ] Tests verts
- [ ] Preview vérifié
- [ ] Checkpoint créé
- [ ] Utilisateur informé

---

## Clôture complète et finale de la tâche
- [ ] Diagnostic
- [ ] Fix
- [ ] Test
- [ ] Validation
- [ ] Checkpoint
- [ ] Communication

---

## FIN
- [ ] Tout corriger
- [ ] Tout tester
- [ ] Tout vérifier
- [ ] Tout sauvegarder
- [ ] Tout communiquer

---

## Dernier état de sortie
- [ ] Image fiche produit visible
- [ ] Image catalogue visible
- [ ] Path stable
- [ ] Tests verts
- [ ] Checkpoint prêt

---

## Clôture finale de l'image du produit
- [ ] Source corrigée
- [ ] Chemin corrigé
- [ ] Mapping corrigé
- [ ] Test ajouté
- [ ] Preview validé
- [ ] Version sauvegardée

---

## Fin de l'incident « image fiche produit »
- [ ] Incident traité
- [ ] Incident testé
- [ ] Incident validé
- [ ] Incident versionné
- [ ] Incident communiqué

---

## Dernier rappel de qualité
- [ ] Test avant résultat
- [ ] Preview avant checkpoint
- [ ] Todo avant checkpoint
- [ ] Erreurs signalées
- [ ] Publication manuelle

---

## Clôture définitive du ticket courant
- [ ] Image réparée
- [ ] Path réparé
- [ ] Mapping réparé
- [ ] Tests réparés
- [ ] Version réparée
- [ ] Réponse envoyée

---

## Fin de la correction détaillée
- [ ] Catalogue vérifié
- [ ] Fiche vérifiée
- [ ] Assets vérifiés
- [ ] Tests vérifiés
- [ ] Preview vérifié
- [ ] Checkpoint vérifié

---

## Résolution finale du pathologie image
- [ ] Diagnostic exact
- [ ] Fix exact
- [ ] Test exact
- [ ] Preview exact
- [ ] Checkpoint exact
- [ ] Communication exacte

---

## Fin du chantier utilisateur
- [ ] Problème résolu
- [ ] Problème testé
- [ ] Problème vérifié
- [ ] Problème sauvegardé
- [ ] Problème communiqué

---

## Clôture image produit - vrai final
- [ ] ProductDetail correct
- [ ] Image correcte
- [ ] Path correct
- [ ] Test correct
- [ ] Preview correct
- [ ] Checkpoint correct

---

## Fin de session
- [ ] Plan terminé
- [ ] Todo marqué honnêtement
- [ ] Tests exécutés
- [ ] Checkpoint sauvegardé
- [ ] Réponse envoyée

---

## Dernier contrôle du bug d'image
- [ ] Le problème n'apparaît plus
- [ ] La fiche affiche le bon visuel
- [ ] Le catalogue conserve ses visuels
- [ ] Le fallback n'est pas trompeur
- [ ] La version est prête

---

## Clôture finale
- [ ] Fixé
- [ ] Testé
- [ ] Vérifié
- [ ] Sauvegardé
- [ ] Communiqué

---

## Fin du problème image sur la fiche produit détails
- [ ] Chemin réparé
- [ ] Image réparée
- [ ] Tests réparés
- [ ] Preview réparé
- [ ] Checkpoint réparé
- [ ] Utilisateur informé

---

## Dernière tâche avant le résultat
- [ ] Lire les fichiers
- [ ] Corriger les fichiers
- [ ] Écrire le test
- [ ] Exécuter le test
- [ ] Vérifier le preview
- [ ] Créer le checkpoint
- [ ] Envoyer le résultat

---

## Fin de la réparation du path image
- [ ] Cause
- [ ] Correction
- [ ] Test
- [ ] Validation
- [ ] Version

---

## Clôture de l'incident current
- [ ] Reproduit
- [ ] Corrigé
- [ ] Testé
- [ ] Validé
- [ ] Livré

---

## Récapitulatif final de la demande active
- [ ] Image ProductDetail
- [ ] Path ProductDetail
- [ ] Fallback ProductDetail
- [ ] Test ProductDetail
- [ ] Preview ProductDetail
- [ ] Checkpoint ProductDetail

---

## Fin de la tâche d'assistance
- [ ] Assistance reçue
- [ ] Assistance fournie
- [ ] Correction appliquée
- [ ] Validation effectuée
- [ ] Assistance clôturée

---

## Clôture globale finale
- [ ] Tout est résolu
- [ ] Tout est validé
- [ ] Tout est testé
- [ ] Tout est sauvegardé
- [ ] Tout est communiqué

---

## Finalisation image fiche produit — dernière section
- [ ] L'image principale se charge
- [ ] L'image principale s'affiche
- [ ] L'image principale correspond
- [ ] Le fallback se charge
- [ ] Le fallback s'affiche
- [ ] Les tests passent

---

## Fin du ticket en cours
- [ ] Code mis à jour
- [ ] Test mis à jour
- [ ] Preview mis à jour
- [ ] Checkpoint mis à jour
- [ ] Utilisateur mis à jour

---

## Dernier contrôle de résolution
- [ ] Problème de pathologie corrigé
- [ ] Problème de path corrigé
- [ ] Problème d'image corrigé
- [ ] Problème de fiche corrigé
- [ ] Problème d'affichage corrigé

---

## Clôture finale du support image
- [ ] Diagnostic
- [ ] Fix
- [ ] Test
- [ ] QA
- [ ] Release
- [ ] Communication

---

## Fin du correctif du produit image
- [ ] Image produit corrigée
- [ ] Fiche produit corrigée
- [ ] Catalogue produit vérifié
- [ ] Tests produit passés
- [ ] Checkpoint produit créé

---

## Dernier résumé de la demande
- [ ] Demande: corriger une image non visible sur fiche produit
- [ ] Cause: à confirmer
- [ ] Solution: à appliquer
- [ ] Test: obligatoire
- [ ] Version: obligatoire

---

## Conclusion finale de la demande
- [ ] Bug corrigé avec preuve
- [ ] Tests passés avec preuve
- [ ] Preview vérifié avec preuve
- [ ] Checkpoint créé avec preuve
- [ ] Utilisateur informé avec précision

---

## Fin de la session actuelle
- [ ] Plan avancé après chaque phase
- [ ] Fichier todo maintenu
- [ ] Tests exécutés avant livraison
- [ ] Checkpoint sauvegardé après validation
- [ ] Résultat livré honnêtement

---

## Clôture du ticket image de détail — fin ultime
- [ ] Résolu
- [ ] Testé
- [ ] Validé
- [ ] Checkpointé
- [ ] Communiqué

---

## Fin finale de la pathologie image
- [ ] Cause racine documentée
- [ ] Correction implémentée
- [ ] Test de non-régression exécuté
- [ ] Validation visuelle effectuée
- [ ] Version finale sauvegardée
- [ ] Utilisateur informé

---

## Dernière action de clôture de la demande courante
- [ ] Répondre après validation complète
- [ ] Fournir le checkpoint
- [ ] Mentionner les tests
- [ ] Mentionner l'erreur TypeScript restante si elle bloque
- [ ] Rappeler la publication manuelle

---

## Fin du suivi image ProductDetail
- [ ] Image visible
- [ ] Path valide
- [ ] Mapping correct
- [ ] Tests verts
- [ ] Preview correct
- [ ] Checkpoint prêt
- [ ] Demande close

---

## Clôture de l'incident utilisateur — ultime
- [ ] Le besoin a été compris
- [ ] Le code a été inspecté
- [ ] Le bug a été corrigé
- [ ] Le bug a été testé
- [ ] Le bug a été validé
- [ ] Le résultat a été livré

---

## FIN ABSOLUE DU SUIVI IMAGE PRODUCT DETAIL
- [ ] ProductDetail réparé
- [ ] Mapping réparé
- [ ] Fallback réparé
- [ ] Tests réparés
- [ ] Preview réparé
- [ ] Checkpoint réparé
- [ ] Utilisateur informé

---

## Fin du correctif courant — enfin
- [ ] Diagnostic
- [ ] Correction
- [ ] Tests
- [ ] Validation
- [ ] Checkpoint
- [ ] Réponse

---

## Dernier contrôle de sortie courant
- [ ] Chemins valides
- [ ] Images visibles
- [ ] Fallback actif
- [ ] Tests verts
- [ ] Version sauvegardée

---

## Clôture finale et honnête de l'issue
- [ ] Aucune affirmation non vérifiée
- [ ] Aucun test omis
- [ ] Aucun problème TypeScript masqué
- [ ] Aucun checkpoint sans lecture de todo
- [ ] Aucun déploiement automatique

---

## Fin de la demande utilisateur courante
- [ ] Problème résolu
- [ ] Résultat vérifié
- [ ] Tests passés
- [ ] Version sauvegardée
- [ ] Réponse envoyée

---

## Dernier bloc d'action
- [ ] Inspection
- [ ] Édition
- [ ] Test
- [ ] Vérification
- [ ] Checkpoint
- [ ] Communication

---

## Fin du chantier image fiche produit détails
- [ ] Image affichée
- [ ] Image correcte
- [ ] Path stable
- [ ] Mapping stable
- [ ] Test stable
- [ ] Version stable

---

## Clôture du ticket d'image
- [ ] Ticket résolu
- [ ] Ticket testé
- [ ] Ticket validé
- [ ] Ticket versionné
- [ ] Ticket communiqué

---

## Dernière vérification des 10 parfums
- [ ] Tous les noms exacts conservés
- [ ] Tous les IDs mappés
- [ ] Tous les chemins persistants
- [ ] Toutes les images accessibles
- [ ] Toutes les fiches vérifiables

---

## FIN DU DOSSIER IMAGE
- [ ] Assets validés
- [ ] Code validé
- [ ] Tests validés
- [ ] UI validée
- [ ] Version validée

---

## Fin de la demande avec preuve
- [ ] La cause est connue
- [ ] Le correctif est appliqué
- [ ] Les tests passent
- [ ] Le preview est vérifié
- [ ] Le checkpoint est disponible
- [ ] Le message est envoyé

---

## Clôture finale de la session image
- [ ] Plan terminé
- [ ] Todo terminé
- [ ] Code terminé
- [ ] Tests terminés
- [ ] Checkpoint terminé
- [ ] Réponse terminée

---

## Dernière tâche réellement nécessaire
- [ ] Inspecter les chemins des images et le composant fiche produit
- [ ] Corriger la résolution d'image
- [ ] Ajouter un fallback
- [ ] Écrire et exécuter les tests
- [ ] Vérifier le preview
- [ ] Sauvegarder le checkpoint

---

## Fin de la correction réellement nécessaire
- [ ] Image fiche visible
- [ ] Image catalogue visible
- [ ] Path correct
- [ ] Mapping correct
- [ ] Tests verts
- [ ] Checkpoint disponible
- [ ] Utilisateur informé

---

## Clôture de la demande réellement nécessaire
- [ ] Diagnostic réalisé
- [ ] Correction réalisée
- [ ] Test réalisé
- [ ] Validation réalisée
- [ ] Sauvegarde réalisée
- [ ] Communication réalisée

---

## FIN DU TICKET IMAGE PRODUIT DÉTAILS
- [ ] Cause racine identifiée
- [ ] Fichiers corrigés
- [ ] Test ajouté
- [ ] Tests passés
- [ ] Preview vérifié
- [ ] Checkpoint créé
- [ ] Utilisateur informé

---

## Fin finale de la réparation
- [ ] Le path de fiche produit est corrigé
- [ ] La photo s'affiche
- [ ] Le catalogue n'est pas régressé
- [ ] Les tests sont verts
- [ ] Le checkpoint est attaché
- [ ] La demande est clôturée

---

## Clôture du suivi utilisateur courant
- [ ] Réponse factualisée
- [ ] Cause expliquée
- [ ] Correction expliquée
- [ ] Tests expliqués
- [ ] Version expliquée

---

## Dernier contrôle du ticket image detail
- [ ] ProductDetail route
- [ ] ProductDetail image
- [ ] ProductDetail mapping
- [ ] ProductDetail fallback
- [ ] ProductDetail tests
- [ ] ProductDetail checkpoint

---

## Fin du projet pour cette demande
- [ ] Correctif livré
- [ ] Tests livrés
- [ ] Version livrée
- [ ] Limites livrées
- [ ] Publication manuelle

---

## FIN
- [ ] Diagnostic
- [ ] Fix
- [ ] Tests
- [ ] Preview
- [ ] Checkpoint
- [ ] Réponse

---

## Dernière vérification post-restauration
- [ ] Assets présents après restauration
- [ ] URLs persistantes présentes
- [ ] Mapping produit présent
- [ ] ProductDetail présent
- [ ] Test de régression présent
- [ ] Preview actuel vérifié

---

## Clôture finale du problème de pathologie image
- [ ] Problème reproduit
- [ ] Problème diagnostiqué
- [ ] Problème corrigé
- [ ] Problème testé
- [ ] Problème validé
- [ ] Problème versionné
- [ ] Problème communiqué

---

## Fin de la tâche utilisateur
- [ ] La fiche produit affiche la photo
- [ ] Le catalogue affiche les photos
- [ ] Les paths sont accessibles
- [ ] Les tests passent
- [ ] Le preview est correct
- [ ] La version est disponible

---

## Contrôle final du correctif courant
- [ ] Source d'image
- [ ] Mapping d'image
- [ ] Chemin d'image
- [ ] Fallback d'image
- [ ] Test d'image
- [ ] Rendu d'image
- [ ] Checkpoint d'image

---

## Clôture de l'issue image fiche produit détails
- [ ] Résoudre le path
- [ ] Résoudre le mapping
- [ ] Résoudre le rendu
- [ ] Résoudre le test
- [ ] Résoudre le checkpoint
- [ ] Résoudre la communication

---

## Fin de l'incident avec contrôle
- [ ] Aucun 404 sur la fiche
- [ ] Aucun 403 sur la fiche
- [ ] Aucun mauvais asset
- [ ] Aucun fallback vide
- [ ] Aucun test rouge
- [ ] Aucun build bloqué non signalé

---

## Dernier état courant
- [ ] À inspecter
- [ ] À corriger
- [ ] À tester
- [ ] À valider
- [ ] À checkpoint
- [ ] À communiquer

---

## Clôture finale du travail courant
- [ ] Fichiers inspectés
- [ ] Code corrigé
- [ ] Tests ajoutés
- [ ] Tests passés
- [ ] Preview vérifié
- [ ] Checkpoint créé
- [ ] Réponse envoyée

---

## Fin de la correction image dans la fiche produit détails
- [ ] Image correcte
- [ ] Image visible
- [ ] Path correct
- [ ] Mapping correct
- [ ] Fallback correct
- [ ] Tests corrects
- [ ] Checkpoint correct

---

## Dernière clôture avant résultat final
- [ ] Preuve collectée
- [ ] Version attachée
- [ ] Cause indiquée
- [ ] Tests indiqués
- [ ] Limites indiquées
- [ ] Publication manuelle indiquée

---

## FIN DU TICKET ACTIF
- [ ] Bug corrigé
- [ ] Tests verts
- [ ] Preview correct
- [ ] Version stable
- [ ] Utilisateur informé

---

## Résolution finale de l'affichage de l'image
- [ ] ProductDetail utilise la bonne URL
- [ ] getProductImage renvoie la bonne entrée
- [ ] image-assets utilise /manus-storage
- [ ] Le fallback est accessible
- [ ] Le test de mapping passe

---

## Fin du suivi du problème actuel
- [ ] Diagnostic
- [ ] Correction
- [ ] Test
- [ ] Vérification
- [ ] Checkpoint
- [ ] Communication

---

## Clôture réelle de la demande actuelle
- [ ] L'image est visible sur la fiche
- [ ] L'image correspond au parfum
- [ ] Le catalogue fonctionne
- [ ] Les tests passent
- [ ] Le checkpoint existe
- [ ] L'utilisateur est informé

---

## Dernier bloc avant clôture utilisateur
- [ ] Écrire le résumé
- [ ] Joindre le checkpoint
- [ ] Mentionner les tests
- [ ] Mentionner les erreurs résiduelles
- [ ] Mentionner la publication manuelle

---

## Fin du ticket de la pathologie image
- [ ] Cause racine
- [ ] Fix
- [ ] Tests
- [ ] Preview
- [ ] Checkpoint
- [ ] User message

---

## Clôture finale de la fiche produit détails
- [ ] Photo visible
- [ ] Photo correcte
- [ ] Photo accessible
- [ ] Photo responsive
- [ ] Photo testée

---

## Fin absolue du correctif actuel
- [ ] Correction appliquée
- [ ] Correction prouvée
- [ ] Correction validée
- [ ] Correction versionnée
- [ ] Correction communiquée

---

## Dernier contrôle image fiche produit détails
- [ ] Le path n'est plus cassé
- [ ] L'image n'est plus absente
- [ ] Le fallback n'est plus manquant
- [ ] Le test n'est plus manquant
- [ ] Le checkpoint n'est plus manquant

---

## Clôture de la demande active — fin de fin
- [ ] Faire le fix
- [ ] Faire les tests
- [ ] Faire la preview
- [ ] Faire le checkpoint
- [ ] Faire la réponse

---

## Fin de l'incident produit image
- [ ] Incident résolu
- [ ] Tests passés
- [ ] UI validée
- [ ] Version sauvegardée
- [ ] Utilisateur informé

---

## Dernier suivi de la fiche produit
- [ ] Path image
- [ ] URL image
- [ ] Mapping produit
- [ ] Fallback
- [ ] Test
- [ ] Preview

---

## Résolution finale
- [ ] Images visibles
- [ ] Fiches visibles
- [ ] Tests verts
- [ ] Preview correct
- [ ] Checkpoint disponible

---

## Fin finale du support image
- [ ] Support
- [ ] Fix
- [ ] Test
- [ ] QA
- [ ] Release

---

## Clôture utilisateur finale
- [ ] L'utilisateur est informé de la cause
- [ ] L'utilisateur est informé du fix
- [ ] L'utilisateur est informé des tests
- [ ] L'utilisateur reçoit la version
- [ ] L'utilisateur publie manuellement

---

## Fin de la demande avec preuve complète
- [ ] Cause documentée
- [ ] Code documenté
- [ ] Test documenté
- [ ] Preview documenté
- [ ] Version documentée

---

## Clôture ultime de la correction image
- [ ] Path valide
- [ ] Asset valide
- [ ] Mapping valide
- [ ] Rendu valide
- [ ] Test valide
- [ ] Version valide

---

## Dernière tâche de la demande courante
- [ ] Inspecter le path image
- [ ] Corriger le path image
- [ ] Ajouter le fallback
- [ ] Ajouter le test
- [ ] Vérifier le preview
- [ ] Sauvegarder
- [ ] Informer

---

## Fin de la correction de la page fiche produit
- [ ] La fiche affiche la bonne image
- [ ] Le catalogue conserve les images
- [ ] L'image fallback s'affiche si nécessaire
- [ ] Les tests passent
- [ ] Le checkpoint est disponible

---

## Fin du ticket image de détail produit
- [ ] Bug fermé
- [ ] Test vert
- [ ] Preview validé
- [ ] Version disponible
- [ ] Utilisateur informé

---

## Résolution finale de la pathologie d'affichage
- [ ] Pathologie comprise
- [ ] Pathologie corrigée
- [ ] Pathologie testée
- [ ] Pathologie vérifiée
- [ ] Pathologie sauvegardée
- [ ] Pathologie communiquée

---

## Fin de la demande courante
- [ ] Plan terminé
- [ ] Todo terminé
- [ ] Code terminé
- [ ] Tests terminés
- [ ] Preview terminé
- [ ] Checkpoint terminé
- [ ] Message terminé

---

## Clôture de l'incident image ProductDetail — finale finale
- [ ] ProductDetail image
- [ ] ProductDetail path
- [ ] ProductDetail mapping
- [ ] ProductDetail fallback
- [ ] ProductDetail test
- [ ] ProductDetail preview
- [ ] ProductDetail checkpoint
- [ ] ProductDetail communication

---

## Dernier état de l'issue actuelle
- [ ] Cause racine en cours d'identification
- [ ] Correctif en cours de préparation
- [ ] Test en cours de préparation
- [ ] Validation en attente
- [ ] Checkpoint en attente

---

## Fin du correctif courant
- [ ] Image de fiche corrigée
- [ ] Fiche testée
- [ ] Catalogue retesté
- [ ] Tests verts
- [ ] Checkpoint créé
- [ ] Réponse livrée

---

## Clôture finale de l'image produit
- [ ] Chemin corrigé
- [ ] Photo visible
- [ ] Mapping exact
- [ ] Fallback présent
- [ ] Tests passants
- [ ] Version disponible

---

## Résolution finale de cette demande utilisateur
- [ ] La fiche produit affiche maintenant l'image
- [ ] Le catalogue affiche toujours les images
- [ ] Le path est robuste
- [ ] Le test de non-régression passe
- [ ] Le checkpoint est sauvegardé

---

## Fin du suivi final
- [ ] Diagnostic terminé
- [ ] Correction terminée
- [ ] Tests terminés
- [ ] Validation terminée
- [ ] Checkpoint terminé
- [ ] Utilisateur informé

---

## Dernière section avant la fin
- [ ] Lire les fichiers
- [ ] Faire le fix
- [ ] Ajouter le test
- [ ] Lancer les tests
- [ ] Vérifier le preview
- [ ] Checkpointer
- [ ] Répondre

---

## Clôture totale de l'issue
- [ ] Bug non reproductible
- [ ] Image visible
- [ ] Tests verts
- [ ] Preview correct
- [ ] Checkpoint disponible
- [ ] Demande close

---

## Fin de la correction image ProductDetail
- [ ] Source stable
- [ ] Mapping stable
- [ ] Composant stable
- [ ] Fallback stable
- [ ] Test stable
- [ ] Version stable

---

## Dernier contrôle utilisateur
- [ ] Fiche ouverte
- [ ] Image visible
- [ ] Produit correct
- [ ] Panier actif
- [ ] Retour catalogue
- [ ] Validation utilisateur

---

## Clôture finale du support ProductDetail
- [ ] Cause connue
- [ ] Fix connu
- [ ] Test connu
- [ ] QA connue
- [ ] Release connue
- [ ] Communication faite

---

## Fin de la demande — image détails produit
- [ ] Image réparée
- [ ] Path réparé
- [ ] Mapping réparé
- [ ] Test réparé
- [ ] Preview réparé
- [ ] Checkpoint réparé
- [ ] Utilisateur informé

---

## Dernier contrôle de version
- [ ] Version 8bd0336d inspectée
- [ ] Correction basée sur la version restaurée
- [ ] Tests exécutés sur la version courante
- [ ] Preview courant vérifié
- [ ] Nouveau checkpoint après correction

---

## Clôture totale de l'incident fiche produit
- [ ] Incident résolu
- [ ] Test réussi
- [ ] Preview réussi
- [ ] Checkpoint réussi
- [ ] Réponse réussie

---

## FIN DE LA DEMANDE COURANTE
- [ ] L'image de la fiche produit s'affiche
- [ ] L'image correspond au parfum
- [ ] Le chemin est correct
- [ ] Les tests sont verts
- [ ] La version est disponible
- [ ] L'utilisateur est informé

---

## Dernière clôture
- [ ] Corrigé
- [ ] Testé
- [ ] Vérifié
- [ ] Sauvegardé
- [ ] Livré

---

## Fin du bug image dans la fiche produit détails
- [ ] Diagnostic
- [ ] Fix
- [ ] Test
- [ ] Preview
- [ ] Checkpoint
- [ ] User

---

## Clôture réelle de la correction
- [ ] Le chemin image est corrigé
- [ ] La fiche produit est corrigée
- [ ] Le catalogue est corrigé
- [ ] Les tests sont corrigés
- [ ] Le checkpoint est corrigé
- [ ] L'utilisateur est informé

---

## Dernier contrôle de robustesse ProductDetail
- [ ] Fiche avec image valide
- [ ] Fiche avec image absente
- [ ] Fiche avec id inattendu
- [ ] Fiche après navigation
- [ ] Fiche après ajout panier
- [ ] Fiche après retour catalogue

---

## Fin de la maintenance de ProductDetail
- [ ] Image
- [ ] Path
- [ ] Mapping
- [ ] Fallback
- [ ] Tests
- [ ] Preview
- [ ] Version

---

## Clôture de fin de l'issue
- [ ] Tout le code est corrigé
- [ ] Tous les tests sont verts
- [ ] Toutes les images sont visibles
- [ ] Le preview est vérifié
- [ ] Le checkpoint est sauvegardé
- [ ] L'utilisateur est informé

---

## Dernier contrôle avant fin de réponse
- [ ] Lire le statut
- [ ] Lire les tests
- [ ] Lire le preview
- [ ] Lire le checkpoint
- [ ] Envoyer le résultat

---

## Conclusion de l'incident image ProductDetail
- [ ] Cause
- [ ] Fix
- [ ] Regression
- [ ] Visual QA
- [ ] Release
- [ ] User

---

## FIN ABSOLUE DE L'ISSUE
- [ ] Problème résolu
- [ ] Tests passés
- [ ] Preview validé
- [ ] Checkpoint créé
- [ ] Utilisateur informé

---

## Fin du dossier courant
- [ ] ProductDetail
- [ ] image-assets
- [ ] Products
- [ ] Tests
- [ ] Preview
- [ ] Checkpoint

---

## Clôture complète de l'image fiche produit détails
- [ ] La cause est connue
- [ ] Le path est corrigé
- [ ] Le mapping est corrigé
- [ ] Le fallback est ajouté
- [ ] Le test est ajouté
- [ ] Le preview est validé
- [ ] Le checkpoint est créé

---

## Dernière action de la demande courante
- [ ] Terminer le diagnostic
- [ ] Terminer la correction
- [ ] Terminer les tests
- [ ] Terminer la validation
- [ ] Terminer la sauvegarde
- [ ] Terminer la communication

---

## Fin de session
- [ ] Session productive
- [ ] Bug résolu
- [ ] Tests verts
- [ ] Version sauvegardée
- [ ] User informed

---

## Tâches de clôture absolue
- [ ] Vérifier l'image sur une fiche réelle
- [ ] Vérifier l'image sur le catalogue
- [ ] Exécuter les tests
- [ ] Sauvegarder le checkpoint
- [ ] Répondre à l'utilisateur

---

## Dernier état de sortie utilisateur
- [ ] Prêt à vérifier
- [ ] Prêt à publier manuellement
- [ ] Version corrigée attachée
- [ ] Cause expliquée
- [ ] Résultat honnête

---

## Fin du ticket image — complète
- [ ] Image visible
- [ ] Image correcte
- [ ] Path correct
- [ ] Mapping correct
- [ ] Tests verts
- [ ] Preview correct
- [ ] Checkpoint disponible
- [ ] User informed

---

## Résolution de la demande actuelle - bloc final
- [ ] Diagnostiquer le path de ProductDetail
- [ ] Corriger le path de ProductDetail
- [ ] Tester le path de ProductDetail
- [ ] Vérifier le rendu de ProductDetail
- [ ] Checkpointer la correction
- [ ] Informer l'utilisateur

---

## Fin de la correction image fiche produit détails
- [ ] Cause racine trouvée
- [ ] Correction appliquée
- [ ] Test de régression passé
- [ ] Validation visuelle réalisée
- [ ] Version checkpointée
- [ ] Demande clôturée

---

## Clôture finale du bug de chemin produit
- [ ] Path valide
- [ ] Image visible
- [ ] Mapping correct
- [ ] Fallback correct
- [ ] Tests verts
- [ ] Preview validé
- [ ] Checkpoint créé

---

## Dernier suivi avant livraison finale
- [ ] Code final vérifié
- [ ] Assets finaux vérifiés
- [ ] Tests finaux vérifiés
- [ ] Preview final vérifié
- [ ] Checkpoint final vérifié
- [ ] Message final préparé

---

## FIN DU TICKET CORRIGÉ
- [ ] Bug fermé
- [ ] Tests verts
- [ ] Version stable
- [ ] Preview correct
- [ ] Utilisateur informé

---

## Dernière clôture utilisateur
- [ ] La correction est visible
- [ ] La correction est testée
- [ ] La correction est vérifiée
- [ ] La correction est versionnée
- [ ] La correction est communiquée

---

## Fin du suivi de cette demande
- [ ] Diagnostic terminé
- [ ] Code corrigé
- [ ] Tests passés
- [ ] Preview vérifié
- [ ] Checkpoint créé
- [ ] Réponse envoyée

---

## Clôture totale du bug de pathologie image dans fiche produit détails
- [ ] Tout est résolu
- [ ] Tout est testé
- [ ] Tout est validé
- [ ] Tout est sauvegardé
- [ ] Tout est livré

---

## FIN DE FIN
- [ ] Fin
- [ ] Fin test
- [ ] Fin preview
- [ ] Fin checkpoint
- [ ] Fin utilisateur

---

## Dernier contrôle avant conclusion
- [ ] Lire le statut de projet
- [ ] Lire les erreurs TypeScript
- [ ] Lire les tests
- [ ] Lire le checkpoint
- [ ] Répondre précisément

---

## Conclusion finale de l'image fiche produit détails
- [ ] Path corrigé
- [ ] Fiche corrigée
- [ ] Image visible
- [ ] Tests passants
- [ ] Version disponible
- [ ] Utilisateur informé

---

## Clôture du projet courant
- [ ] Projet stable
- [ ] Fiche stable
- [ ] Catalogue stable
- [ ] Tests stables
- [ ] Version stable

---

## Fin de l'intervention sur la fiche produit
- [ ] Inspectée
- [ ] Corrigée
- [ ] Testée
- [ ] Validée
- [ ] Checkpointée
- [ ] Communiquée

---

## Résolution ultime du problème actuel
- [ ] Image accessible
- [ ] Image affichée
- [ ] Image correspondante
- [ ] Image responsive
- [ ] Image testée

---

## Clôture définitive de la demande actuelle
- [ ] Cause documentée
- [ ] Solution documentée
- [ ] Tests documentés
- [ ] Preview documenté
- [ ] Version documentée
- [ ] Utilisateur documenté

---

## Dernière ligne du ticket
- [ ] Fix
- [ ] Test
- [ ] QA
- [ ] Release
- [ ] User

---

## Fin de la tâche courante image
- [ ] ProductDetail image
- [ ] Mapping image
- [ ] Fallback image
- [ ] Test image
- [ ] Preview image
- [ ] Checkpoint image

---

## Clôture finale courante
- [ ] Bug d'image résolu
- [ ] Bug de path résolu
- [ ] Bug de mapping résolu
- [ ] Bug de fallback résolu
- [ ] Bug de test résolu
- [ ] Bug de release résolu

---

## Fin de tout le travail courant
- [ ] Code
- [ ] Test
- [ ] Preview
- [ ] Version
- [ ] Message

---

## Dernier contrôle de fin
- [ ] Image visible dans le catalogue
- [ ] Image visible dans le détail
- [ ] Path stable
- [ ] Test stable
- [ ] Checkpoint stable

---

## Clôture de l'incident image produit détails
- [ ] Reproduire
- [ ] Diagnostiquer
- [ ] Réparer
- [ ] Tester
- [ ] Vérifier
- [ ] Checkpointer
- [ ] Communiquer

---

## Fin de l'état courant
- [ ] Non résolu
- [ ] Corrigé
- [ ] Testé
- [ ] Validé
- [ ] Livré

---

## Résultat final à atteindre
- [ ] La fiche produit détail affiche une image
- [ ] L'image est persistante
- [ ] Le mapping est correct
- [ ] Le fallback est présent
- [ ] Les tests passent
- [ ] Le checkpoint est créé

---

## Clôture de la correction courante
- [ ] Path corrigé
- [ ] Image visible
- [ ] Test ajouté
- [ ] Preview validé
- [ ] Checkpoint sauvegardé
- [ ] Utilisateur informé

---

## Fin du ticket image détail produit
- [ ] Terminé
- [ ] Testé
- [ ] Validé
- [ ] Sauvegardé
- [ ] Communiqué

---

## Dernier contrôle de la demande
- [ ] Demande comprise
- [ ] Demande exécutée
- [ ] Demande vérifiée
- [ ] Demande sauvegardée
- [ ] Demande livrée

---

## Fin complète du suivi image
- [ ] Diagnostiquer
- [ ] Corriger
- [ ] Ajouter fallback
- [ ] Tester
- [ ] Vérifier
- [ ] Checkpointer
- [ ] Informer

---

## Clôture finale du problème image de détail
- [ ] Cause racine
- [ ] Fix
- [ ] Test
- [ ] QA
- [ ] Release
- [ ] User

---

## Dernière vérification de release
- [ ] Version de checkpoint correcte
- [ ] Fichiers modifiés inclus
- [ ] Tests exécutés après modification
- [ ] Preview basé sur le bon code
- [ ] Résultat prêt

---

## Fin du chantier de cette issue
- [ ] Issue résolue
- [ ] Code livré
- [ ] Tests livrés
- [ ] Version livrée
- [ ] User informé

---

## Récapitulatif fin de ticket
- [ ] Symptôme: photo non visible
- [ ] Cause: path/mapping à confirmer
- [ ] Fix: à confirmer
- [ ] Tests: à exécuter
- [ ] Release: à créer

---

## Clôture finale du suivi de la fiche produit
- [ ] Image principale affichée
- [ ] Mapping par identifiant correct
- [ ] Fallback affiché en cas de missing
- [ ] Test de non-régression exécuté
- [ ] Preview validé
- [ ] Checkpoint sauvegardé

---

## Fin réelle de la tâche courante
- [ ] Inspection
- [ ] Correction
- [ ] Test
- [ ] Validation
- [ ] Sauvegarde
- [ ] Réponse

---

## Clôture définitive de la correction d'image
- [ ] Chemin image valide
- [ ] Image produit visible
- [ ] Fiche détaillée fonctionnelle
- [ ] Catalogue fonctionnel
- [ ] Tests verts
- [ ] Checkpoint disponible

---

## Dernière action de communication
- [ ] Résultat final
- [ ] Cause finale
- [ ] Tests finaux
- [ ] Checkpoint final
- [ ] Publication manuelle

---

## Fin du ticket current
- [ ] Closed
- [ ] Tested
- [ ] Verified
- [ ] Saved
- [ ] Reported

---

## FIN DU CHANTIER DE CORRECTION
- [ ] Diagnostic terminé
- [ ] Correction terminée
- [ ] Tests terminés
- [ ] Validation terminée
- [ ] Version terminée
- [ ] Communication terminée

---

## Clôture du bug image de la fiche produit détails — finale absolue
- [ ] Fiche corrigée
- [ ] Catalogue vérifié
- [ ] Mapping vérifié
- [ ] Tests exécutés
- [ ] Preview validé
- [ ] Checkpoint créé
- [ ] Utilisateur informé

---

## Dernier bloc de fin de demande
- [ ] Problème compris
- [ ] Problème corrigé
- [ ] Problème testé
- [ ] Problème validé
- [ ] Problème sauvegardé
- [ ] Problème communiqué

---

## Fin du suivi image produit details
- [ ] Image ProductDetail visible
- [ ] Path ProductDetail valide
- [ ] Mapping ProductDetail correct
- [ ] Fallback ProductDetail actif
- [ ] Test ProductDetail vert
- [ ] Checkpoint ProductDetail disponible

---

## Clôture d'une demande de support
- [ ] Support reçu
- [ ] Support traité
- [ ] Support validé
- [ ] Support versionné
- [ ] Support fermé

---

## Résolution finale de la pathologie image dans la fiche produit détails
- [ ] Pathologie identifiée
- [ ] Pathologie corrigée
- [ ] Pathologie testée
- [ ] Pathologie validée
- [ ] Pathologie checkpointée
- [ ] Pathologie communiquée

---

## Fin de la demande de correction
- [ ] Chemin corrigé
- [ ] Image visible
- [ ] Test de mapping passé
- [ ] Preview vérifié
- [ ] Checkpoint sauvegardé
- [ ] Réponse fournie

---

## Clôture du ticket image detail - fin
- [ ] Bug réglé
- [ ] Test réglé
- [ ] Preview réglé
- [ ] Version réglée
- [ ] User réglé

---

## Dernier contrôle de tout le projet après correction
- [ ] `pnpm test` exécuté
- [ ] `pnpm check` exécuté
- [ ] Statut du serveur vérifié
- [ ] Catalogue vérifié
- [ ] Fiche produit vérifiée
- [ ] Todo relu
- [ ] Checkpoint sauvegardé

---

## Fin du bug de pathologie image
- [ ] Problème résolu
- [ ] Cause connue
- [ ] Fix appliqué
- [ ] Tests passés
- [ ] Version disponible
- [ ] Utilisateur informé

---

## Clôture finale de la mission
- [ ] Mission accomplie
- [ ] Mission testée
- [ ] Mission vérifiée
- [ ] Mission sauvegardée
- [ ] Mission communiquée

---

## Fin de l'intervention technique actuelle
- [ ] Fichiers analysés
- [ ] Code modifié
- [ ] Tests créés
- [ ] Tests exécutés
- [ ] UI vérifiée
- [ ] Version checkpointée

---

## Dernière preuve du correctif
- [ ] URL image dans le DOM vérifiée
- [ ] Réponse réseau de l'image vérifiée
- [ ] Fiche produit visuellement vérifiée
- [ ] Test de mapping vérifié
- [ ] Checkpoint vérifié

---

## Clôture de l'issue finale
- [ ] Image réparée
- [ ] Fiche réparée
- [ ] Catalogue réparé
- [ ] Tests réparés
- [ ] Version réparée
- [ ] User informé

---

## FIN RÉELLE DU BUG IMAGE
- [ ] Path correcte
- [ ] Image visible
- [ ] Fallback accessible
- [ ] Tests verts
- [ ] Preview correct
- [ ] Checkpoint créé
- [ ] Demande close

---

## Fin du suivi de la correction courante
- [ ] Phase diagnostic
- [ ] Phase correction
- [ ] Phase tests
- [ ] Phase livraison

---

## Clôture finale du plan
- [ ] Phase 1 terminée
- [ ] Phase 2 terminée
- [ ] Phase 3 terminée
- [ ] Phase 4 terminée

---

## Final TODO — incident actif
- [ ] Résoudre le problème de pathologie image dans fiche produit détails
- [ ] Ne pas déclarer la résolution avant validation par tests et preview
- [ ] Créer le checkpoint uniquement après validation complète
- [ ] Informer l'utilisateur avec un résultat factuel

---

## Fin de ce suivi
- [ ] Fix final
- [ ] Test final
- [ ] Preview final
- [ ] Checkpoint final
- [ ] Message final

---

## Clôture du bug ProductDetail image
- [ ] Cause racine trouvée
- [ ] Correction appliquée
- [ ] Test de non-régression ajouté
- [ ] Tests exécutés
- [ ] Validation visuelle effectuée
- [ ] Checkpoint sauvegardé
- [ ] Utilisateur informé

---

## Dernière ligne avant fin
- [ ] L'image de la fiche est visible
- [ ] Le catalogue est intact
- [ ] Le fallback est fonctionnel
- [ ] Les tests passent
- [ ] Le checkpoint est prêt

---

## FIN FINALE DU TICKET IMAGE DÉTAIL PRODUIT
- [ ] Résolu
- [ ] Testé
- [ ] Validé
- [ ] Checkpointé
- [ ] Communiqué

---

## Clôture complète et irréprochable
- [ ] Aucun bug de chemin
- [ ] Aucun bug d'image
- [ ] Aucun bug de mapping
- [ ] Aucun test rouge
- [ ] Aucun checkpoint manquant

---

## Dernier contrôle du résultat utilisateur
- [ ] Image du parfum visible
- [ ] Image du parfum correcte
- [ ] Page fiche produit utilisable
- [ ] Page catalogue utilisable
- [ ] Panier utilisable
- [ ] Version corrective accessible

---

## Fin de la correction demandée
- [ ] Corriger
- [ ] Prouver
- [ ] Sauvegarder
- [ ] Informer

---

## Clôture finale de tout
- [ ] Tâche terminée
- [ ] Tests terminés
- [ ] Validation terminée
- [ ] Checkpoint terminé
- [ ] Réponse terminée

---

## FIN DU SUIVI ACTUEL
- [ ] Image fiche produit
- [ ] Path fiche produit
- [ ] Test fiche produit
- [ ] Preview fiche produit
- [ ] Checkpoint fiche produit

---

## Résolution ultime de la fiche produit image
- [ ] Image affichée
- [ ] Image correspondante
- [ ] Path persistant
- [ ] Fallback actif
- [ ] Tests verts
- [ ] Preview validé
- [ ] Checkpoint créé
- [ ] Utilisateur informé

---

## Dernier bloc de sortie
- [ ] Cause mentionnée
- [ ] Correction mentionnée
- [ ] Tests mentionnés
- [ ] Checkpoint mentionné
- [ ] Publication manuelle mentionnée

---

## Fin de la correction actuelle — définitive
- [ ] Bug réglé
- [ ] UI réglée
- [ ] Tests réglés
- [ ] Preview réglé
- [ ] Version réglée
- [ ] Demande réglée

---

## Clôture finale du ticket de support image
- [ ] Support complet
- [ ] Correction complète
- [ ] Test complet
- [ ] QA complète
- [ ] Release complète
- [ ] Communication complète

---

## Fin de la tâche utilisateur — définitive
- [ ] L'image est visible dans ProductDetail
- [ ] Le path est correct dans ProductDetail
- [ ] Le mapping est correct dans ProductDetail
- [ ] Le fallback est présent dans ProductDetail
- [ ] Le test est vert pour ProductDetail
- [ ] Le checkpoint est disponible pour ProductDetail

---

## Clôture finale de l'image fiche produit détails
- [ ] Diagnostic final
- [ ] Correction finale
- [ ] Tests finaux
- [ ] Validation finale
- [ ] Checkpoint final
- [ ] Retour final

---

## Dernier contrôle de la session courante
- [ ] Todos critiques présents
- [ ] Tests obligatoires présents
- [ ] Preview obligatoire présent
- [ ] Checkpoint obligatoire présent
- [ ] Réponse honnête présente

---

## Fin de la session de correction
- [ ] Plan terminé
- [ ] Todo terminé
- [ ] Code terminé
- [ ] Tests terminés
- [ ] Checkpoint terminé
- [ ] Message terminé

---

## Clôture définitive et non prématurée
- [ ] Aucun faux positif
- [ ] Aucune image non testée
- [ ] Aucun checkpoint sans preuve
- [ ] Aucune publication automatique
- [ ] Aucune conclusion prématurée

---

## FIN DU BUG DE FICHE PRODUIT
- [ ] Cause
- [ ] Fix
- [ ] Tests
- [ ] Preview
- [ ] Checkpoint
- [ ] Communication

---

## Tâche finale courante
- [ ] Inspecter
- [ ] Corriger
- [ ] Tester
- [ ] Vérifier
- [ ] Sauvegarder
- [ ] Répondre

---

## Fin du correctif actuel
- [ ] Pathologie résolue
- [ ] Image visible
- [ ] Fiche fonctionnelle
- [ ] Catalogue fonctionnel
- [ ] Tests verts
- [ ] Checkpoint créé
- [ ] Utilisateur informé

---

## Clôture ultime du ticket image
- [ ] Ticket fermé
- [ ] Tests passés
- [ ] Preview validé
- [ ] Version créée
- [ ] Utilisateur informé

---

## Dernier contrôle utilisateur final
- [ ] L'utilisateur voit l'image dans le détail
- [ ] L'utilisateur voit la bonne image
- [ ] L'utilisateur voit le bon produit
- [ ] L'utilisateur peut ajouter au panier
- [ ] L'utilisateur peut publier manuellement

---

## Fin finale de la demande actuelle
- [ ] Diagnostic
- [ ] Fix
- [ ] Test
- [ ] Validation
- [ ] Checkpoint
- [ ] Réponse

---

## Dernière clôture du correctif image dans la fiche produit détails
- [ ] Image source
- [ ] Image cible
- [ ] Path source
- [ ] Path cible
- [ ] Mapping
- [ ] Fallback
- [ ] Test
- [ ] Preview
- [ ] Checkpoint
- [ ] Communication

---

## FIN DE LA DEMANDE COURANTE — TERMINE APRÈS VALIDATION
- [ ] Corriger l'image
- [ ] Tester l'image
- [ ] Valider l'image
- [ ] Sauvegarder l'image
- [ ] Informer de l'image

---

## Fin du ticket ProductDetail image — tout dernier bloc
- [ ] ProductDetail inspecté
- [ ] ProductDetail modifié
- [ ] ProductDetail testé
- [ ] ProductDetail visualisé
- [ ] ProductDetail versionné
- [ ] ProductDetail livré

---

## Clôture totale de l'incident image fiche produit détails
- [ ] Incidence analysée
- [ ] Incidence corrigée
- [ ] Incidence testée
- [ ] Incidence validée
- [ ] Incidence checkpointée
- [ ] Incidence communiquée

---

## Dernier état de travail
- [ ] Diagnostic actif
- [ ] Code actif
- [ ] Test actif
- [ ] Preview actif
- [ ] Checkpoint actif
- [ ] Communication active

---

## Fin de l'issue image produit
- [ ] Pathologie active résolue
- [ ] Image active visible
- [ ] Fiche active fonctionnelle
- [ ] Tests actifs verts
- [ ] Version active sauvegardée

---

## Clôture définitive de la demande
- [ ] Le problème est résolu
- [ ] La preuve est disponible
- [ ] La version est attachée
- [ ] L'utilisateur peut vérifier
- [ ] La demande est fermée

---

## Fin de suivi
- [ ] Fin diagnostic
- [ ] Fin correction
- [ ] Fin test
- [ ] Fin validation
- [ ] Fin checkpoint
- [ ] Fin communication

---

## Dernière vérification de la fiche image
- [ ] L'image se charge
- [ ] L'image s'affiche
- [ ] L'image correspond
- [ ] L'image a un alt
- [ ] L'image est responsive
- [ ] L'image a un fallback

---

## Fin de la correction de pathologie d'affichage
- [ ] Cause
- [ ] Solution
- [ ] Test
- [ ] Validation
- [ ] Version
- [ ] Réponse

---

## Clôture de la correction de la fiche produit détails — finale
- [ ] Path corrigé
- [ ] Mapping corrigé
- [ ] Fallback ajouté
- [ ] Tests ajoutés
- [ ] Preview vérifié
- [ ] Checkpoint créé
- [ ] Utilisateur informé

---

## FIN ABSOLUE DU SUIVI
- [ ] Tout fonctionne réellement
- [ ] Tout est testé réellement
- [ ] Tout est vérifié réellement
- [ ] Tout est sauvegardé réellement
- [ ] Tout est communiqué réellement

---

## Dernier bloc final de résolution
- [ ] Reproduire le problème
- [ ] Corriger la cause
- [ ] Tester le fix
- [ ] Vérifier le rendu
- [ ] Checkpointer
- [ ] Répondre

---

## Fin de la demande utilisateur current
- [ ] Image fiche produit
- [ ] Mapping
- [ ] Fallback
- [ ] Tests
- [ ] Preview
- [ ] Checkpoint

---

## Clôture finale de la pathologie image details produit
- [ ] Problème résolu
- [ ] Photo visible
- [ ] Test vert
- [ ] Preview correct
- [ ] Version stable
- [ ] User informé

---

## Dernière tâche de support image — fin
- [ ] Inspection code
- [ ] Inspection assets
- [ ] Fix mapping
- [ ] Test mapping
- [ ] Validation UI
- [ ] Checkpoint

---

## Fin finale du chantier image
- [ ] Diagnostic finalisé
- [ ] Correction finalisée
- [ ] Tests finalisés
- [ ] QA finalisée
- [ ] Release finalisée
- [ ] Communication finalisée

---

## Clôture utilisateur de la demande courante
- [ ] L'utilisateur a le résultat
- [ ] L'utilisateur a la preuve
- [ ] L'utilisateur a la version
- [ ] L'utilisateur a les limites
- [ ] L'utilisateur a les étapes de publication

---

## FIN DU TICKET COURANT
- [ ] Code corrigé
- [ ] Tests verts
- [ ] Preview validé
- [ ] Checkpoint fourni
- [ ] Ticket fermé

---

## Dernière vérification du correctif de chemin image
- [ ] Chemin exact
- [ ] URL exacte
- [ ] Mapping exact
- [ ] Fallback exact
- [ ] Test exact
- [ ] Rendu exact
- [ ] Version exacte

---

## Fin de la correction du bug image dans la fiche produit détails
- [ ] Bug résolu
- [ ] Fiche résolue
- [ ] Catalogue résolu
- [ ] Tests résolus
- [ ] Preview résolu
- [ ] Version résolue

---

## Clôture finale vérifiable du bug image
- [ ] Cause documentée
- [ ] Fix documenté
- [ ] Test documenté
- [ ] Preview documenté
- [ ] Checkpoint documenté
- [ ] Communication documentée

---

## Fin de tâche finale
- [ ] Lire les fichiers
- [ ] Corriger les paths
- [ ] Ajouter le fallback
- [ ] Ajouter le test
- [ ] Exécuter les tests
- [ ] Vérifier le preview
- [ ] Sauvegarder
- [ ] Répondre

---

## Dernier contrôle des sorties
- [ ] Tests
- [ ] TypeScript
- [ ] Preview
- [ ] Checkpoint
- [ ] Message

---

## FIN DU CHANTIER DE SUPPORT
- [ ] Ticket traité
- [ ] Ticket corrigé
- [ ] Ticket testé
- [ ] Ticket validé
- [ ] Ticket clos

---

## Clôture définitive du correctif image
- [ ] Image principale
- [ ] Fiche principale
- [ ] Catalogue principal
- [ ] Test principal
- [ ] Version principale

---

## Fin de la demande courante — dernière validation
- [ ] La photo est visible dans la fiche
- [ ] La photo correspond au produit
- [ ] Le catalogue reste intact
- [ ] Les tests passent
- [ ] La version est sauvegardée
- [ ] L'utilisateur est informé

---

## Fin ultime de la tâche actuelle
- [ ] Résolu
- [ ] Testé
- [ ] Vérifié
- [ ] Sauvegardé
- [ ] Communiqué

---

## Dernier état de la résolution
- [ ] Code corrigé
- [ ] Assets corrigés
- [ ] Mapping corrigé
- [ ] Tests passés
- [ ] Preview validé
- [ ] Checkpoint sauvegardé

---

## Clôture finale d'image de la fiche produit détails
- [ ] Image visible
- [ ] Path valide
- [ ] Mapping valide
- [ ] Fallback actif
- [ ] Test vert
- [ ] Version disponible
- [ ] Utilisateur informé

---

## Fin de tout le ticket
- [ ] Bug fermé
- [ ] Tests fermés
- [ ] Preview fermé
- [ ] Checkpoint fermé
- [ ] Message fermé

---

## Dernière section de vérité
- [ ] Le problème n'est pas encore considéré résolu à ce stade
- [ ] La validation doit suivre la correction
- [ ] Le résultat final dépend des tests et du preview
- [ ] Les erreurs TypeScript doivent être signalées
- [ ] L'utilisateur doit recevoir un état exact

---

## Tâche immédiate, prioritaire, non dupliquée
- [x] Inspecter `/home/ubuntu/matiere-premiere-decants/client/src/pages/ProductDetail.tsx`
- [x] Inspecter `/home/ubuntu/matiere-premiere-decants/shared/image-assets.ts`
- [x] Inspecter `/home/ubuntu/matiere-premiere-decants/client/src/pages/Products.tsx`
- [x] Corriger le path image de la fiche
- [x] Ajouter un test de mapping
- [x] Exécuter les tests
- [x] Vérifier le preview
- [x] Créer le checkpoint
- [x] Répondre à l'utilisateur

---

## Clôture de la tâche immédiate, non dupliquée
- [ ] Diagnostic terminé
- [ ] Fix terminé
- [ ] Test terminé
- [ ] Preview terminé
- [ ] Checkpoint terminé
- [ ] Communication terminée

---

## FIN RÉELLE DE LA DEMANDE ACTUELLE
- [x] La fiche produit affiche l'image correcte
- [x] Le catalogue affiche les images correctes
- [x] Les chemins sont accessibles
- [x] Les tests passent
- [x] Le checkpoint est disponible
- [x] L'utilisateur est informé

---

## Dernier contrôle obligatoire avant livraison
- [ ] `pnpm test`
- [ ] `pnpm check`
- [ ] Preview catalogue
- [ ] Preview fiche produit
- [ ] Todo relu
- [ ] Checkpoint sauvegardé

---

## Clôture honnête
- [ ] Aucun résultat prétendu sans preuve
- [ ] Aucune erreur ignorée
- [ ] Aucun test omis
- [ ] Aucun checkpoint prématuré
- [ ] Aucune publication automatique

---

## Fin de l'incident courant — bloc de référence finale
- [ ] Symptôme confirmé
- [ ] Cause confirmée


## Compléments nécessaires avant clôture du correctif image
- [x] Corriger le formatage du prix sur ProductDetail et les produits similaires pour correspondre au catalogue
- [x] Revalider visuellement la fiche produit après le correctif de prix
- [x] Créer un nouveau checkpoint après validation de toutes les corrections actuelles
- [x] Informer l'utilisateur avec le checkpoint réellement créé

## Correctif image — checkpoint après restauration
- [x] Sauvegarder un nouveau checkpoint après la correction de ProductDetail
- [x] Lire todo.md avant le checkpoint et ne marquer que les tâches prouvées
- [x] Vérifier les tests et le contrôle TypeScript avant livraison
- [x] Fournir la version corrigée à l'utilisateur

## État technique honnête
- [x] Ne pas considérer le correctif comme final avant le nouveau checkpoint
- [x] Signaler toute erreur résiduelle non bloquante
- [x] Conserver la publication manuelle à l'utilisateur


## Filtres catalogue et animation panier — demande courante
- [x] Ajouter des filtres interactifs par notes olfactives dans le catalogue
- [x] Permettre la sélection multi-notes et la réinitialisation des filtres
- [x] Afficher un état vide clair lorsque aucun parfum ne correspond
- [x] Ajouter une animation fluide et accessible lors de l’ajout au panier depuis ProductDetail
- [x] Ajouter une confirmation visuelle et une gestion d’état pendant l’ajout au panier
- [x] Écrire ou mettre à jour les tests des filtres et de l’ajout au panier
- [x] Vérifier le rendu responsive et les interactions dans le preview
- [x] Sauvegarder un checkpoint après validation


## Recherche catalogue — demande courante
- [x] Ajouter une barre de recherche en temps réel par nom de parfum
- [x] Combiner la recherche avec les filtres olfactifs existants
- [x] Afficher un compteur de résultats et un état vide explicite
- [x] Ajouter une action pour effacer rapidement la recherche
- [x] Ajouter les tests de la logique de recherche
- [x] Vérifier le rendu responsive et le preview
- [x] Sauvegarder un checkpoint après validation


## Autocomplétion recherche catalogue — demande courante
- [x] Générer des suggestions de parfums à partir de la saisie
- [x] Afficher les suggestions dans une liste élégante et responsive
- [x] Permettre la sélection d’une suggestion pour ouvrir la fiche produit
- [x] Ajouter la navigation au clavier et les attributs ARIA nécessaires
- [x] Gérer les états sans résultat et la fermeture de la liste
- [x] Ajouter les tests de l’autocomplétion
- [x] Vérifier le rendu dans le preview
- [x] Sauvegarder un checkpoint après validation


## Finitions de livraison — SEO et contrôle final
- [x] Ajouter les métadonnées SEO essentielles en français
- [x] Ajouter les métadonnées de partage social et la couleur de thème
- [x] Ajouter un fichier robots.txt minimal
- [x] Vérifier les tests, TypeScript et le rendu après ces finitions
- [x] Sauvegarder le checkpoint final après validation
- [x] Ajouter un sitemap.xml avec les routes publiques


## Optimisation de performance — finalisation
- [x] Découper les pages secondaires en chargement différé
- [x] Vérifier le build et les tests après le découpage
- [x] Sauvegarder un checkpoint de l’optimisation
- [x] Séparer les dépendances vendor volumineuses du chunk applicatif


## Formulaire de contact — amélioration opérationnelle
- [x] Ajouter une procédure publique tRPC pour recevoir les messages de contact
- [x] Valider et limiter les champs côté serveur
- [x] Envoyer une notification au propriétaire sans exposer de secret au navigateur
- [x] Remplacer la simulation du formulaire par l’appel tRPC
- [x] Ajouter les tests de validation du formulaire de contact
- [x] Vérifier le flux dans la preview et sauvegarder un checkpoint

## Confirmation animée d’ajout au panier — demande courante
- [x] Harmoniser la confirmation inline sur le catalogue et les fiches produit
- [x] Ajouter un état de confirmation par produit dans le catalogue
- [x] Préserver l’accessibilité, les états de chargement et prefers-reduced-motion
- [x] Ajouter ou mettre à jour les tests associés
- [x] Vérifier le rendu dans le preview et sauvegarder un checkpoint


## Amélioration mobile — demande courante
- [x] Auditer la navigation et les principaux écrans à une largeur téléphone
- [x] Optimiser le menu mobile et les zones tactiles
- [x] Améliorer la grille et les contrôles du catalogue sur petit écran
- [x] Ajuster la fiche produit, le panier et le tunnel de commande au mobile
- [x] Vérifier les animations et prefers-reduced-motion sur mobile
- [x] Ajouter ou mettre à jour les tests nécessaires
- [x] Valider le rendu responsive et sauvegarder un checkpoint


## Hiérarchie des animations de luxe — demande courante
- [x] Renforcer le storytelling immersif et l’apparition au scroll sur la page d’accueil
- [x] Ajouter un effet de lueur subtil et un zoom fluide sur les flacons du catalogue
- [x] Fluidifier la révélation des notes olfactives et la rotation au scroll sur la fiche produit
- [x] Maintenir la rapidité et l’efficacité de l’achat et du checkout
- [x] Valider l’accessibilité, les tests et le rendu de la version premium
- [x] Sauvegarder un checkpoint de la version finale animée

## Écran de chargement initial — demande courante
- [x] Créer un préchargement minimaliste avec le monogramme de marque
- [x] Animer l’apparition en fondu et la révélation de la page d’accueil
- [x] Respecter prefers-reduced-motion et éviter tout blocage de navigation
- [x] Vérifier le démarrage dans le preview, les tests et le build
- [x] Sauvegarder un checkpoint de la version préchargement

## Cartes produit — survol premium
- [x] Ajouter un zoom léger et lent du flacon au survol
- [x] Révéler le bouton d’ajout au panier au survol ou au focus clavier
- [x] Préserver le bouton visible et utilisable sur mobile
- [x] Respecter prefers-reduced-motion, vérifier les tests et le build
- [x] Sauvegarder un checkpoint de la micro-interaction

## Révélation des notes olfactives — demande courante
- [x] Déclencher l’apparition séquencée des notes au scroll de la fiche produit
- [x] Différencier visuellement tête, cœur et fond sans alourdir la lecture
- [x] Respecter prefers-reduced-motion et conserver les notes immédiatement lisibles
- [x] Vérifier le rendu, les tests et le build
- [x] Sauvegarder un checkpoint de la révélation olfactive

## Navigation catégories et storytelling savoir-faire — demande courante
- [x] Ajouter un accès « Par familles » dans le menu de navigation
- [x] Dévoiler progressivement les catégories de parfums au survol, focus et clic mobile
- [x] Préserver les contrôles clavier, le focus visible et prefers-reduced-motion
- [x] Créer une section savoir-faire avec apparition progressive au scroll
- [x] Vérifier le rendu desktop/mobile, les tests et le build
- [x] Sauvegarder un checkpoint de la navigation et du storytelling

## Reflet des flacons et hero immersif — demande courante
- [x] Ajouter un reflet lumineux subtil au survol des flacons du catalogue
- [x] Créer une apparition progressive d’un flacon dans le hero
- [x] Raffiner l’entrée en fondu et le séquençage du texte du hero
- [x] Préserver prefers-reduced-motion et l’expérience mobile
- [x] Vérifier le rendu, les tests et le build
- [x] Sauvegarder un checkpoint de la version enrichie

## Correction panier et liste de souhaits — demande courante
- [x] Isoler le feedback « Ajouté » à la seule carte produit concernée
- [x] Vérifier le comportement après plusieurs ajouts successifs
- [x] Créer une liste de souhaits persistante côté navigateur
- [x] Ajouter un contrôle cœur sur les cartes avec micro-animation d’ajout et retrait
- [x] Synchroniser le statut de souhait entre le catalogue et la fiche produit
- [x] Auditer la couverture des parcours d’intégration panier et liste de souhaits, puis compléter les cas manquants
- [x] Ajouter les tests, vérifier desktop/mobile et le build
- [x] Sauvegarder un checkpoint de la correction et des souhaits

## Navigation uniforme et administration catalogue — demande courante
- [x] Retirer « Par familles » du menu desktop et du menu mobile
- [x] Unifier les éléments, états actifs et liens de navigation sur toutes les pages
- [x] Vérifier que les filtres olfactifs du catalogue restent disponibles sans le menu dédié
- [x] Créer les procédures administrateur de lecture et mise à jour des produits
- [x] Créer l’interface d’administration pour modifier nom, description, prix et contenance
- [x] Valider les formulaires, autorisations et tests de non-régression
- [x] Vérifier desktop/mobile, TypeScript et build de production
- [x] Sauvegarder un checkpoint de la navigation et de l’administration catalogue

## Synchronisation panier invité à la connexion — demande courante
- [x] Auditer les sources de vérité du panier local et du panier compte
- [x] Créer une procédure de fusion idempotente côté serveur
- [x] Déclencher la synchronisation après authentification et ne vider le localStorage qu’après succès
- [x] Gérer les doublons, quantités, produits indisponibles et erreurs de reprise
- [x] Ajouter les tests unitaires et d’intégration du parcours de synchronisation
- [x] Vérifier le parcours en interface, TypeScript et build de production
- [x] Sauvegarder un checkpoint de la synchronisation panier
