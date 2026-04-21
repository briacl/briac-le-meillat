# Heryze Cinematic Voyage: Technical Architecture & Blueprint

This document specifies the technical orchestration of the "Voyage Cinématique" within the Nexus landing page. It is designed for expert AI analysis to refine the transition between the Heryze Product Showcase and the interactive Neural Network.

---

## 1. Global Motion Standards
All cinematic easing is governed by the Apple Bezier constant to ensure iOS-like "braking" momentum.

```typescript
const APPLE_BEZIER = [0.21, 0.47, 0.32, 0.98];
```

---

## 2. Orchestration Layer (`UnifiedHeryzeTransition.tsx`)
The static product presentation and the 3D cinematic zoom are unified into a single `500vh` sticky container to eliminate transition gaps.

### A. Narrative Timeline (Scroll Progression)
The `scrollYProgress` [0, 1] is mapped as follows:

| Range (Progress) | Phase | Visual Action |
| :--- | :--- | :--- |
| `0.00 - 0.15` | **Identity Phase** | Product Title, Subtitle, and Aura Nexus button are visible. |
| `0.15 - 0.30` | **Dissolve Phase** | UI text fades out (`opacity: 1 -> 0`); Zoom prepared. |
| `0.15 - 0.55` | **Macro Zoom** | Three.js Mockup `scale: 1 -> 15`; Centered on the central blue node. |
| `0.45 - 0.65` | **Poetic Peak** | "L'harmonie naît du détail." (Baskerville) reveals at max zoom. |
| `0.75 - 0.90` | **Mutation Reveal** | Rapid de-zoom revealing the full Neural Network structure. |
| `0.90 - 1.00` | **Handoff** | Transition to the fully interactive `NeuralNetworkBackground`. |

---

## 3. Component Details (Surgical Logic)

### Heryze Mockup (Three.js Plane)
The mockup is a 16:9 plane tracked through scroll:

```typescript
// Inside HeryzeMockupPlane
const scale = useTransform(scrollProgress, [0.15, 0.45], [1, 15]);
const opacity = useTransform(scrollProgress, [0.4, 0.55], [1, 0]);

const smoothScale = useSpring(scale, { damping: 25, stiffness: 80 });
```

### The Mutation Node (Central Pixel)
This represents the "bridge" between the SaaS dashboard and the technical brain.

```typescript
// Inside CentralPixel
const opacity = useTransform(scrollProgress, [0.4, 0.5, 0.8, 0.9], [0, 1, 1, 0]);
const scale = useTransform(scrollProgress, [0.75, 0.85], [1, 12]);
const zPos = useTransform(scrollProgress, [0.75, 1], [0.1, -10]);
```

### Product Identity (UI Overlay)
Standardized branding in the Heryze section:

- **Title**: `Paris2024` font, Color: `#0066ff`, Style: Large, Centered.
- **Subtitle**: `Paris2024` font, Case: Lowercase (minuscules).
- **CTA**: Aura Nexus button with pulsing blue shadow (`shadow-blue-500/40`).
- **Background Texture**: "OFFLINE" text, `Paris2024`, 80% width, opacity: 0.1.

---

## 4. Known Synchronization Target
The "Deep Dive" zoom is surgically targeted at the exact blue pixel coordinates on the `heryze_dashboard.png` texture that corresponds to the initial position of the first interactive node in the `NeuralNetworkBackground.tsx`.

---

## 5. Visual Hand-off to Section 6
The **Baskerville** narration must perform a complete `fade-out` by `scrollYProgress: 0.85`, ensuring that by the time the Neural Network is "fully interactive," the screen is cleared for user exploration.

---

## Final Directive for Refinement
Ensure that during the zoom phase (`0.15 - 0.55`), the Three.js viewport stays perfectly fixed (Sticky) and that the interpolation between the static 2D image and the 3D plane is indistinguishable to the human eye.
