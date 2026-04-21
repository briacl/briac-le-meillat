import React from 'react';
import { motion, useTransform } from 'framer-motion';
import { MotionValue } from 'framer-motion';
import {
  SERENITY_PHASES,
  SERENITY_COLORS,
  SERENITY_FONTS,
  SERENITY_ASSETS,
} from '../../constants/serenity';

interface VitrinStageProps {
  scrollYProgress: MotionValue<number>;
}

export const VitrinStage: React.FC<VitrinStageProps> = ({ scrollYProgress }) => {
  // Phase 1: 0.00 → 0.10 (Vitrine visible)
  // Opacity: 1 at start, fade to 0 at 0.15
  const titleOpacity = useTransform(scrollYProgress, [0, 0.10, 0.15], [1, 1, 0]);

  // Phase 1 : 0.00 → 0.10 (Image stable à 1.2)
  const imageScale = useTransform(scrollYProgress, [0, 0.10], [1.2, 1.2]);
  
  // Image opacity: disappear after phase ends
  const imageOpacity = useTransform(scrollYProgress, [0.10, 0.15], [1, 0]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center translate-y-12"
      style={{
        opacity: titleOpacity,
        zIndex: 80,
        pointerEvents: 'none',
      }}
    >
      {/* Title HERYZE */}
      <motion.h1
        className={`${SERENITY_FONTS.TITLE} text-white uppercase text-9xl font-bold mb-8 tracking-widest`}
        style={{
          opacity: titleOpacity,
        }}
      >
        HERYZE
      </motion.h1>

      {/* Subtitle with gradient */}
      <motion.p
        className="text-2xl text-transparent bg-clip-text font-bold"
        style={{
          backgroundImage: `linear-gradient(135deg, ${SERENITY_COLORS.BLUE_VIOLET_START}, ${SERENITY_COLORS.BLUE_VIOLET_END})`,
          opacity: titleOpacity,
        }}
      >
        Le réseau tombe. Votre business, jamais.
      </motion.p>

      {/* Image Mockup Premium */}
      <motion.img
        src={SERENITY_ASSETS.HERYZE_IMAGE}
        alt="Heryze Dashboard"
        className="mt-12 max-w-4xl rounded-2xl border border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
        style={{
          scale: imageScale,
          opacity: imageOpacity,
        }}
      />
    </motion.div>
  );
};
