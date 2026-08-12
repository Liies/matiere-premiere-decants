# Validation du préchargement initial

Une session Chromium privée a confirmé l’écran de préchargement au premier accès à l’accueil. Le monogramme feuille et le nom « Matière Première » apparaissent en fondu sur un fond blanc, sans élément décoratif superflu. Après environ 1,2 seconde, l’écran se dissipe et révèle l’accueil premium complet.

Le préchargement ne s’affiche que lors de la première visite de la route `/` au cours d’une session. La page d’accueil est préchargée en parallèle, et les préférences `prefers-reduced-motion` suppriment les délais et transitions afin de ne pas entraver la navigation.
