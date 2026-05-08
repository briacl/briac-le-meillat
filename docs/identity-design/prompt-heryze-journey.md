C'est le scénario émotionnel et narratif que tu as décrit au fil de nos échanges.

"Je veux au départ un titre 'HERYZE' écrit en blanc Paris2024, avec un sous-titre 'Le réseau tombe. Votre business, jamais.' écrit avec le même gradient de couleur que le Manifeste.

Ensuite, le scroll déclenche un zoom monumental sur l'image du dashboard Heryze. On plonge dedans jusqu'à ce que tout devienne blanc (le White-out). Dans ce blanc, une icône de téléphone et le texte 'Votre smartphone, votre meilleure douchette' apparaissent. Ils sont écrits en blanc sur blanc au départ pour qu'on ne les voie pas, puis ils rétrécissent au centre.

C'est là que le mot 'Sérénité' arrive en taille colossale, écrit en blanc. Il sert de 'fond' à la scène précédente. En scrollant, 'Sérénité' dézoome. En devenant plus petit, il révèle le fond noir tout autour de lui et passe de la couleur blanche au dégradé bleu/violet. À la fin, le mot devient un simple point (un nœud). Au-dessus de ce point, le texte 'Architecting Flow' (ou Développement Web) glisse pour ouvrir la carte de projet du Neural Network."

2. La Traduction Technique (Le Prompt de Code)
C'est le "Blueprint" à donner à une IA (Claude ou Gemini) pour reconstruire la mécanique sans erreur de calques.

OBJET : Implémentation du Voyage Cinématique "Heryze Journey" (800vh).

STRUCTURE PARENTE :

Un wrapper de 800vh de hauteur.

Un conteneur sticky top-0 h-screen w-full overflow-hidden qui verrouille la vue.

Chaque phase est un motion.div en absolute inset-0 flex items-center justify-center.

PHASE 1 : IDENTITÉ (Scroll 0.00 -> 0.10)

Titre 'HERYZE' (Paris2024) + Sous-titre Gradient.

Opacité : 1 -> 0 et Translation Y: 0 -> -50px à partir de 0.05.

PHASE 2 : LE ZOOM DASHBOARD (Scroll 0.10 -> 0.25)

Image du Mockup centrée.

Animation : scale: 1 -> 40 (Dead-Center). L'image doit finir par saturer l'écran pour créer la transition vers le blanc.

PHASE 3 : L'ÉMANATION / DOUCHETTE (Scroll 0.25 -> 0.45)

Fond : bg-white (Z-index supérieur au dashboard).

Contenu : Icône Smartphone SVG + Texte 'Votre smartphone, votre meilleure douchette.'.

Inversion Logic : Le texte est text-white au repos. Il rétrécit (scale 4 -> 1) en même temps que la phase suivante.

PHASE 4 : LE MORPHING SÉRÉNITÉ (Scroll 0.45 -> 0.82)

Le mot 'SÉRÉNITÉ' (Paris2024, Uppercase) arrive en scale: 50.

Couleur : Reste white jusqu'à 0.72, puis transition vers gradient (bleu/violet) entre 0.72 et 0.78.

Dézoom : scale 50 -> 2. En rétrécissant, il révèle le fond bg-black qui arrive en dessous.

Le Point : À 0.82, le scale passe de 2 -> 0.01 pour devenir un nœud lumineux.

PHASE 5 : LE HANDOFF (Scroll 0.85 -> 1.00)

Apparition de 'Architecting Flow' (Paris2024, Gradient).

Le titre glisse du centre vers le haut-gauche.

Déclenchement de l'état showCard pour ouvrir la NodeDetailCard (Glassmorphism) à 0.90.

RÈGLES CRITIQUES :

Utiliser useSpring pour lisser le scroll.

w-full partout, interdiction du w-screen pour éviter le scroll horizontal.

Z-index croissants pour chaque phase pour éviter les chevauchements fantômes.