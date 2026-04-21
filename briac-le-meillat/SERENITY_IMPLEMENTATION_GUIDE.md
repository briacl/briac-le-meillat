# Voyage de la Sérénité — Guide d'implémentation

## Résumé

Le composant `UnifiedHeryzeTransition` implémente une séquence cinématique ultra-fluide de 800vh de hauteur, organisée en 6 phases animées par le scroll.

## Structure des fichiers

```
src/
├── constants/
│   └── serenity.ts           # Constantes, phases, couleurs, assets
├── Components/
│   ├── UnifiedHeryzeTransition.tsx    # Composant principal
│   └── SerenityStages/
│       ├── index.ts
│       ├── VitrinStage.tsx            # Phase A (0.00-0.10)
│       ├── WhiteOutStage.tsx          # Phase B (0.10-0.25)
│       ├── EmanationStage.tsx         # Phase C (0.25-0.45)
│       ├── DouchetteStage.tsx         # Phase D (0.45-0.65)
│       ├── SerenityStage.tsx          # Phase E (0.65-0.85)
│       └── NeuralNetworkStage.tsx     # Phase F (0.85-1.00)
└── Pages/
    └── SerenityJourneyDemo.tsx        # Page de démo
```

## Phases de la timeline

### A. La Vitrine (0.00 → 0.10)
- Titre "HERYZE" en blanc, monumental
- Sous-titre avec gradient bleu-violet
- Image du produit centrée

### B. Le White-Out (0.10 → 0.25)
- Zoom massif de la caméra
- Fond blanc s'opacifie progressivement
- Contenu disparaît

### C. L'Émanation (0.25 → 0.45)
- Icône téléphone fade-in
- Lumière multicolore pulsante autour

### D. La Douchette (0.45 → 0.65)
- Téléphone réduit en taille
- Texte "Votre smartphone, votre meilleure douchette"
- Effet Z-axis (vient de loin)

### E. La Révélation Sérénité (0.65 → 0.85)
- Dézoom monumental
- Morphing du mot "sérénité"
- Fond blanc → noir, révélation Neural Network

### F. Handoff Neural Network (0.85 → 1.00)
- "sérénité" disparaît
- "Développement Web" jaillit du fond
- Particules animées
- Card projet apparaît

## Utilisation

### Import simple
```tsx
import UnifiedHeryzeTransition from '@/Components/UnifiedHeryzeTransition';

export function MyPage() {
  return (
    <div className="w-full bg-black">
      <UnifiedHeryzeTransition />
    </div>
  );
}
```

### Dans une page existante
Intégrer comme une section de landing page:
```tsx
import UnifiedHeryzeTransition from '@/Components/UnifiedHeryzeTransition';

export function LandingPage() {
  return (
    <>
      <NavBar />
      <UnifiedHeryzeTransition />
      <RestOfPage />
    </>
  );
}
```

## Configuration

### Modifier les constantes
Éditer `src/constants/serenity.ts` pour changer:
- **Courbe d'animation**: `APPLE_BEZIER`
- **Phases**: `SERENITY_PHASES` (ranges de scroll)
- **Couleurs**: `SERENITY_COLORS`
- **Assets**: `SERENITY_ASSETS.HERYZE_IMAGE`

### Modifier l'image du produit
Dans `src/constants/serenity.ts`:
```ts
export const SERENITY_ASSETS = {
  HERYZE_IMAGE: '/votre/nouvelle/image.png',
};
```

## Prérequis

- React 18+
- Framer Motion 12+
- Tailwind CSS 3+
- Lucide React (icônes)

## Performance

- **Scroll-based**: Utilise `useScroll()` de Framer Motion
- **Transforms**: Chaque mouvement est une MotionValue réactive
- **GPU accelerated**: Animations CSS et Framer Motion optimisées
- **Lazy rendering**: Tous les stages sont rendus mais opacity-controlled

## Notes techniques

1. **Sticky Viewport**: Le viewport reste fixe pendant que le parent scroll. C'est clé pour la cinématique.
2. **useTransform**: Chaque propriété animée est liée directement au `scrollYProgress` pour une réactivité parfaite.
3. **Phase ranges**: Les phases ne se chevauchent pas — aucune rupture entre 0.10 et 0.11.
4. **Responsive**: Utilise `vw` et `clamp()` pour adapter les tailles à l'écran.

## Debugging

### Vérifier le scroll
```tsx
const { scrollYProgress } = useScroll();
useEffect(() => {
  console.log(scrollYProgress.get()); // 0 to 1
}, []);
```

### Vérifier une phase spécifique
Éditer les ranges dans `src/constants/serenity.ts` pour tester:
```ts
VITRINE: { start: 0.0, end: 0.3 }, // Double la phase pour debug
```

## Prochaines étapes

1. Tester le scroll comportement sur mobile et desktop
2. Ajuster les courbes d'animation si besoin (APPLE_BEZIER)
3. Ajouter d'autres stages ou transitions
4. Intégrer avec authentification/backend si nécessaire
5. Optimiser les particules du Neural Network (R3F si haute perf requise)

## Support des navigateurs

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

**Créé le 21 avril 2026**
