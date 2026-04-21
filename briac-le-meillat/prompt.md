Guide d'Exécution : Le Voyage de la Sérénité
Ce guide définit la structure du composant UnifiedHeryzeTransition.tsx. L'objectif est de transformer le scroll en une caméra virtuelle qui traverse des dimensions de texte et de lumière.

1. Fondations Techniques
Courbe Apple : const APPLE_BEZIER = [0.21, 0.47, 0.32, 0.98];

Conteneur Parent : relative w-full h-[800vh] bg-black (800vh pour laisser de la place à chaque étape).

Caméra Sticky : sticky top-0 w-full h-screen overflow-hidden.

Typographie : 'Paris2024' pour tous les textes, sauf mention contraire.

2. Chronologie du Voyage (Mapping scrollYProgress [0, 1])
Phase 1 : La Vitrine (0.00 → 0.10)
Éléments :

Titre : "HERYZE" (Uppercase, Blanc, Monumental).

Sous-titre : "Le réseau tombe.


Votre business, jamais." (Normal, Gradient bleu-violet identique au texte "Development" du Hero).

Image : Interface blanche Heryze avec bords arrondis.

Action : Apparition statique, le user finit de scroller pour voir l'ensemble.

Phase 2 : Le White-Out (0.10 → 0.25)
Action : La caméra virtuelle zoome agressivement sur l'interface blanche.

Résultat : À 0.25, l'écran est totalement blanc (immersion dans la matière de l'interface).

Phase 3 : L'Icône et la Lumière (0.25 → 0.45)
0.25 → 0.35 : Une grande icône de téléphone apparaît en Fade-in sur le fond blanc.

0.35 → 0.45 : Des effets de lumière multicolore jaillissent autour du téléphone (émanation de puissance).

Phase 4 : La Meilleure Douchette (0.45 → 0.65)
Action 1 : L'icône du téléphone réduit légèrement sa taille.

Action 2 : Le texte "Votre smartphone, votre meilleure douchette." (Blanc) apparaît en Fade-in avec un mouvement de translation Z (il vient de "derrière" la caméra pour se stabiliser devant l'utilisateur).

Phase 5 : La Révélation "Sérénité" (0.65 → 0.85)
Action 1 (Dézoom Monumental) : Toute la scène précédente (téléphone + texte + lumières) rétrécit.

Action 2 (Le Masque) : On découvre que tout cela était contenu à l'intérieur du mot "sérénité".

Évolution du Texte "sérénité" :

Au départ : Énorme (plein écran), couleur Blanc (pour assurer la transition avec le blanc de la phase 2).

Au scroll : Il rétrécit. Sa couleur passe du Blanc au Gradient bleu-violet.

Fond : Le fond blanc de la scène précédente disparaît pour révéler le Noir originel.

Phase 6 : Transition Neural Network (0.85 → 1.00)
Action 1 : Le mot "sérénité" continue de réduire jusqu'à devenir un point minuscule presque invisible.

Action 2 : Le texte "Développement Web" jaillit de l'arrière-plan, passe devant nous et se positionne au centre.

Action 3 (Le Noeud) : Une particule (le nœud de développement) apparaît sous le texte, rejointe par d'autres particules reliées entre elles.

Action 4 : Texte "explorez les noeuds..." (Fade-in puis Fade-out).

Final : La carte projet "Développement Web" s'affiche avec sa croix de fermeture. Le voyage est fini, l'exploration commence.

🚨 Directives de Code Impératives (Anti-Bug)
Z-Axis (Profondeur) : Utilise translateZ ou scale avec Framer Motion pour l'effet "vient de derrière nous". Pour le texte "Développement Web", utilise une valeur initiale de scale: 4 et opacity: 0 vers scale: 1 et opacity: 1.

Color Transition : Pour le passage du Blanc au Gradient sur "sérénité", utilise un useTransform lié à la couleur CSS ou un masque d'opacité sur deux calques de texte superposés.

Sticky Lock : Raptor Mini doit impérativement mettre overflow: visible sur le conteneur parent (800vh) pour que la div sticky ne "saute" pas.

Transitions "Smooth" : Utilise useSpring sur le progrès du scroll pour éviter que les zooms ne soient saccadés.

Mission pour Raptor Mini : Code le composant UnifiedHeryzeTransition.tsx. Ne cherche pas à simplifier. Respecte chaque phase de scroll. Le passage du "White-out" à la révélation du mot "sérénité" doit être le moment de "claque visuelle" du site. Une fois le Neural Network atteint, libère le scroll pour la section suivante.