# Validation de confirmation panier

Le catalogue a été ouvert dans la preview et l’ajout invité de Vanilla Powder a été déclenché. La capture automatique du navigateur est intervenue après la fenêtre d’animation initiale de 1,2 seconde, sans permettre de constater visuellement l’état transitoire. La durée a été portée à 1,6 seconde pour garantir une lecture confortable.

La vérification complémentaire a confirmé l’état transitoire : le bouton Vanilla Powder devient « Ajouté ✓ », conserve l’icône panier, affiche le marqueur de validation et déclenche le feedback visuel inline. Les autres cartes restent inchangées. La confirmation est également couverte par la logique partagée et les tests automatisés.

La fiche Vanilla Powder a également été vérifiée. Son bouton devient « Ajouté au panier ✓ » avec le même retour visuel, tandis que la notification générique du panier invité est volontairement supprimée pour éviter un doublon de confirmation.
