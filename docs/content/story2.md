# 📖 Storyboard : Bérangère • Development
**Concept :** de la "Solidité de l'Infrastructure" à la "Fluidité de l'Expérience".
**Style :** Minimalisme Apple, Deep Black (#000000), Typographie épurée, Micro-interactions fluides.

---

## I. Hero Banner : L'Éveil de l'Instrument
* **Visuel :** Fond noir absolu (#000000). Le réseau neuronal animé est présent en arrière-plan avec une opacité très basse (15-20%) pour ne pas gêner la lecture.
* **Animation d'entrée :**
    * **pré-logo :** le texte "a Bérangère branch" apparait via un filtre `blur-in` (passe de flou à net) sur une durée de 1.5s.
    * **Logo :** Le texte "Bérangère • Development" apparaît via un filtre `blur-in` (passe de flou à net) sur une durée de 1.5s.
    * **Typewriter :** Juste en dessous, une ligne s'écrit automatiquement : `"par Briac Le Meillat, étudiant de 1ère année en Réseaux et Télécommunications"`
* **Interaction :** Un bouton "Ghost" (bordure fine 1px, sans fond) avec une flèche animée qui oscille doucement de haut en bas (effet *bounce* léger) pour inciter au scroll.

---

## II. Le Manifeste : La Vision
* **Transition :** Au clic sur la flèche ou au scroll, transition fluide vers une section plein écran (100vh).
* **Typographie :**
    * **Phrase principale :** `"Pour certains, un clavier n'est qu'un outil de saisie. Pour moi, c'est un instrument."` (Police Sans-Serif, extra-bold, blanc pur) affichée en prenant la même largeur que celle de la navbar.
    * **Sous-phrase :** (Apparaît avec un léger retard de 0.5s) : `"Chaque ligne de code est une note, chaque projet une partition."` (Police Serif Italique, gris clair) affichée en prenant la même largeur que celle de la navbar.
* **Effet Apple :** Le texte change de couleur (du gris sombre au blanc pur) au fur et à mesure que l'utilisateur scrolle (effet de remplissage progressif au scroll).

---

## III. Exploration : L'Émergence et le Retrait du Réseau

* **Phase A : L'Émergence (Scroll-In)**
    * **Déclencheur :** Une fois que le texte du Manifeste a atteint son opacité maximale, le scroll suivant active la mise au point de l'infrastructure.
    * **Effet de Focus :** * Le réseau neuronal gagne en opacité (de 15% à 80%) et en netteté (réduction progressive d'un flou gaussien).
        * Léger effet de zoom (scale 0.95 -> 1.0) pour donner une sensation de profondeur.
    * **L'Instruction Éphémère :** Le texte gris *"Explorez les neurones pour découvrir mes domaines d'expérimentation..."* apparaît en fondu, reste le temps d'une portion de scroll, puis s'efface pour laisser place à l'interaction pure.

* **Phase B : L'Interaction Libre**
    * **Statut :** Le scroll vertical est temporairement "bloqué" (ou très ralenti) pour permettre au curseur de survoler les nœuds.
    * **Feedback :** Au survol d'un neurone, une carte `Glassmorphism` surgit avec le nom du domaine et une icône minimaliste.

* **Phase C : Le Retrait (Scroll-Out)**
    * **Déclencheur :** Lorsque l'utilisateur reprend un scroll volontaire vers le bas.
    * **Effet de Fondu :** * Le réseau neuronal s'assombrit à nouveau progressivement (opacité 80% -> 15%).
        * Un léger flou revient pour signifier que l'on s'éloigne de la structure abstraite pour rejoindre la réalité du terrain.
    * **Transition :** Ce retrait visuel prépare l'arrivée de la ligne horizontale de la section **Fondation**.

---

## IV. La Fondation : The Data Stream (Timeline Horizontale)
* **Mécanique :** Utilisation du `Sticky Scroll`. La page se bloque verticalement et le scroll de la souris fait défiler la timeline de gauche à droite.
* **Visuel :** Une ligne de 1px traverse l'écran horizontalement, évoquant une fibre optique lumineuse.
* **Scroll Reveal :** Les étapes du parcours BUT R&T surgissent du bas vers le haut avec un effet `Spring` (rebond fluide) lorsqu'elles croisent le centre de l'écran.
* **Contenu :** aller voir le fichier competences.md pour détails du contenu
    1.  **IUT de Béthune :** *"Apprivoiser la couche physique pour libérer la création."*
    2.  **Architecture Net :** Focus sur les VLAN, le Routage et la commutation (La Solidité).
    3.  **Services & Cyber :** DNS, DHCP, SSH et certification ANSSI (La Sécurité).

---

## V. La Maîtrise : Expertise & Software (Bento Grid)
* **Transition :** La timeline horizontale s'efface pour laisser place à une grille de type "Bento Box" (style caractéristiques iPhone).
* **Cartes (Cards) :**
    * **Card 1 (Large) :** *"L'instinct du Code"*. Focus Python (daily coding) et C. Fond sombre avec un extrait de code subtil en opacité 5%.
    * **Card 2 (Verticale) :** *"L'harmonie visuelle"*. Focus React, Tailwind CSS, HeroUI. Mise en avant de l'UX minimaliste.
    * **Card 3 (Carrée) :** *"La sécurité par défaut"*. Focus Line 42, Pentesting éthique et rigueur réseau.
* **Transition narrative :** En bas de grille, une phrase apparaît : *"Une infrastructure solide ne sert à rien sans une expérience fluide."*

---

## VI. L'Atelier : Preuves Concrètes (Showcase)
* **Visuel :** Grandes cartes de projets (80% de la largeur du viewport) qui défilent verticalement avec un léger effet de parallaxe.
* **Projet Phare : L'Analyseur d'Encapsulation.**
    * **Image :** Mockup épuré de l'interface du script.
    * **Texte :** *"Donner un visage à la donnée. Visualiser le voyage d'un paquet à travers les couches OSI."*
    * **CTA :** Bouton pilule noir, bordure blanche fine : `[ Voir sur GitHub ]`.

---

## VII. Le Final : L'Unification (Footer)
* **Visuel :** L'écran s'assombrit totalement. Seule une ligne de texte technique reste au centre.
* **Signature :** `[ Eth ] — [ IP ] — [ TCP ] — [ HTTP ]` (L'analogie de l'encapsulation).
* **Interaction :** Au survol de chaque bloc (ex: IP), une info-bulle élégante explique brièvement le rôle de la couche (ex: *"Adressage logique et routage"*).
* **Message Final :** `"De la machine à l'utilisateur. Tout est lié."`

---

### 🛠️ Instructions techniques pour l'IA (Prompt Settings) :
1.  **Framework :** React + Tailwind CSS + Framer Motion (indispensable pour les transitions fluides).
2.  **Couleurs :** Fond principal `#000000`. Texte `#FFFFFF` (Titres) et `#A1A1A1` (Corps).
3.  **Effets :** Utiliser `backdrop-filter: blur(12px)` pour toutes les cartes et la navigation.
4.  **Courbes d'animation :** Utiliser des transitions `ease-in-out` ou des `spring` physics (stiffness: 100, damping: 20) pour éviter les mouvements saccadés.



bleu tech lumineux #3B82F6, un bleu profond #1E40AF, pour le violet #D946EF 


bleu base #0075FF
bleu clair #2bc3f2
(bleu profond #1736ff)
violet #f336f0
rouge #f92a2a

bleu base + violet