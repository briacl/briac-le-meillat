// Courbe d'animation Apple
export const APPLE_BEZIER = [0.21, 0.47, 0.32, 0.98];

// Phases de la timeline
export const SERENITY_PHASES = {
  VITRINE: { start: 0.0, end: 0.1 },
  WHITEOUT: { start: 0.1, end: 0.25 },
  EMANATION: { start: 0.25, end: 0.45 },
  DOUCHETTE: { start: 0.45, end: 0.65 },
  SERENITY: { start: 0.65, end: 0.85 },
  NEURAL: { start: 0.85, end: 1.0 },
};

// Couleurs
export const SERENITY_COLORS = {
  WHITE: '#ffffff',
  BLACK: '#000000',
  BLUE_VIOLET_START: '#3b82f6',
  BLUE_VIOLET_END: '#a855f7',
  PHONE_LIGHT: '#fbbf24',
  PHONE_BLUE: '#06b6d4',
};

// Fonts
export const SERENITY_FONTS = {
  TITLE: "font-[Paris2024]",
  NARRATION: "font-[Baskerville]",
};

// Assets
export const SERENITY_ASSETS = {
  HERYZE_IMAGE: '/briac-le-meillat/img_ref/heryze-presentation.png',
};

// Spring config
export const SPRING_CONFIG = {
  default: {
    type: 'spring' as const,
    stiffness: 100,
    damping: 15,
    mass: 1,
  },
  smooth: {
    type: 'spring' as const,
    stiffness: 80,
    damping: 20,
    mass: 1,
  },
};
