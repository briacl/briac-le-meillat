# NeuralNetworkBackground — Config & Variantes

---

## Config actuelle : Dark Mode (référence)

**Fichier :** `briac-le-meillat/src/Components/NeuralNetworkBackground.tsx`

### Couleurs CSS custom (injectées via ThemeProvider)
```css
--node-color: /* bleu vif, probablement #0055ff ou #0075FF selon le thème */
```

### Canvas
| Élément | Valeur actuelle |
|---------|----------------|
| Fond de la section parent | `bg-black` (défini dans `LandingPage.tsx`) |
| Nœuds majeurs | `fillStyle = nodeColor` (bleu #0055ff) + `shadowBlur: 20` + glow bleu |
| Nœuds mineurs | `fillStyle = nodeColor` (bleu #00aaff) + `shadowBlur: 10` |
| Particules background | `rgba(100, 150, 255, 0.5)` |
| Label majeur | Gradient linéaire `#0075ff → #f336f0` + `shadowColor rgba(0,0,0,0.5)` |
| Label mineur | `rgba(textColorRaw, 0.8)` — textColorRaw = `"255, 255, 255"` en dark |
| Liens minor→major | `rgba(255,255,255, opacity*0.6)` |
| Liens proximité | `rgba(255,255,255, opacity*0.2)` |
| Font majeur | `28px 'Paris2024'` |
| Font mineur | `400 14px 'Montserrat Alternates'` |

### Containment (ajouté lors du dernier sprint)
```ts
const TOP_MARGIN = 120;   // espace sous la navbar fixe
const X_PADDING = 110;    // marge latérale pour les labels larges
// Spawn : x ∈ [X_PADDING, width-X_PADDING], y ∈ [TOP_MARGIN, height-20]
// Bounce : mêmes limites
// HitRadius : major=50, minor=30
```

---

## Config proposée : Light Mode

### Principe
Fond blanc, nœuds en encre foncée, liens en gris doux, gradient de labels inversé — ambiance "blueprint sur papier" plutôt que "néon sur noir".

### Changements canvas

| Élément | Dark (actuel) | Light (proposé) |
|---------|--------------|-----------------|
| Fond section | `bg-black` | `bg-white` ou `bg-[#f8f8f6]` (blanc chaud) |
| Nœuds majeurs | bleu vif + glow | `#0055cc` (bleu encre) + `shadowBlur: 8` discret |
| Nœuds mineurs | bleu #00aaff | `#3377cc` (bleu moyen) + `shadowBlur: 0` |
| Particules background | `rgba(100,150,255, 0.5)` | `rgba(0, 80, 200, 0.12)` |
| Label majeur | gradient bleu→rose fluo | gradient `#003399 → #6600cc` (encre foncée, sobre) |
| Label mineur | blanc/0.8 | `rgba(0,0,0, 0.65)` — texte quasi-noir lisible |
| Liens minor→major | blanc/0.6 | `rgba(0, 60, 150, 0.35)` — bleu encre discret |
| Liens proximité | blanc/0.2 | `rgba(0, 0, 0, 0.08)` — très léger |
| Shadow label majeur | `rgba(0,0,0,0.5)` | `rgba(255,255,255,0.8)` (halo blanc pour lisibilité sur blanc) |

### Comment basculer en light mode

La variable `textColorRaw` est déjà conditionnelle selon `theme` :
```ts
const textColorRaw = theme === 'light' ? "0, 0, 0" : "255, 255, 255";
```

Il faut étendre cette logique à toutes les couleurs. Créer un objet `palette` en haut du `useEffect` :

```ts
const isLight = theme === 'light';

const palette = {
    majorNode:   isLight ? '#0055cc' : (nodeColor || '#0055ff'),
    minorNode:   isLight ? '#3377cc' : (nodeColor || '#00aaff'),
    bgParticle:  isLight ? 'rgba(0, 80, 200, 0.12)' : 'rgba(100, 150, 255, 0.5)',
    labelMajorFrom: isLight ? '#003399' : '#0075ff',
    labelMajorTo:   isLight ? '#6600cc' : '#f336f0',
    labelMinor:  isLight ? 'rgba(0, 0, 0, 0.65)' : `rgba(${textColorRaw}, 0.8)`,
    linkStrong:  isLight ? 'rgba(0, 60, 150, 0.35)' : `rgba(${textColorRaw}, 0.6)`,
    linkWeak:    isLight ? 'rgba(0, 0, 0, 0.08)'    : `rgba(${textColorRaw}, 0.2)`,
    shadowLabel: isLight ? 'rgba(255,255,255,0.8)'  : 'rgba(0,0,0,0.5)',
    majorShadowBlur: isLight ? 8 : 20,
    minorShadowBlur: isLight ? 0 : 10,
};
```

Puis remplacer chaque couleur codée en dur par `palette.xxx`.

### Changement de fond section (dans LandingPage.tsx)
```tsx
// Actuellement :
<div id="the-core-visual" className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center">

// En light mode, ajouter bg-white ou bg-[#f8f8f6] à la section, 
// et adapter TheCoreHeader si nécessaire (texte blanc → texte noir)
```

### Aperçu visuel attendu
- Fond : blanc crème `#f8f8f6`
- Nœuds : points bleu encre bien définis, sans glow agressif
- Labels majeurs : gradient bleu nuit → violet encre, lisibles sur fond clair
- Labels mineurs : texte gris foncé, sobre
- Liens : traits bleu très pâle, presque invisibles
- Ambiance générale : blueprint / schéma technique sur papier, cohérent avec le "mouvement blanc" du début de la landing page

---

## Décision à prendre

Le NNB en light mode nécessite aussi d'adapter `TheCoreHeader` (titre "The Ecosystem." est blanc sur noir → doit devenir noir sur blanc).

**Option 1 :** Basculer tout le Mouvement IV en light mode (cohérent avec la narration arc blanc → noir → blanc)
**Option 2 :** Garder le NNB en dark mode comme "trou noir" au milieu de la page (contraste fort, effet dramatique voulu)

**Ma recommandation :** Option 2 pour l'instant — le contraste blanc/noir est un choix narratif fort, et le NNB en dark fonctionne bien visuellement. Le light mode est disponible ici pour une future itération si tu veux tester.
