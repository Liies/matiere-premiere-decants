# Validation navigation et storytelling

Le parcours `/products#boise` sélectionne correctement la famille **Boisé**, fait défiler le catalogue jusqu’aux filtres et affiche les produits correspondants. La navigation desktop contient bien l’accès « Par familles » avec son indicateur de menu.

La première capture de `/#craft` a révélé un cas spécifique : le préchargement initial termine après que le navigateur a tenté de résoudre l’ancre, ce qui laisse l’utilisateur en haut de l’accueil. La fermeture du préchargement redéclenche donc la résolution de l’ancre, tandis que la page d’accueil marque immédiatement la section ciblée comme visible pour que son animation au scroll ne masque jamais le contenu d’un lien profond.

La vérification interactive confirme aussi le menu ouvert sur desktop : les huit familles apparaissent dans une grille à deux colonnes avec une légère progression, puis filtrent réellement le catalogue via l’ancre correspondante. Sur mobile, le menu principal expose un accordéon « Par familles » avec des cibles tactiles lisibles et les mêmes catégories, sans dépendre du survol.

La section savoir-faire a été vérifiée après un défilement réel. Elle affiche le récit « De la matière à l’émotion » et ses trois étapes — sélectionner, composer, transmettre — avec une entrée progressive et une mise en page claire sur desktop.
