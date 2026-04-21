import React from 'react';
import { motion, useTransform } from 'framer-motion';
import { MotionValue } from 'framer-motion';
import {
  SERENITY_PHASES,
  SERENITY_COLORS,
  SERENITY_ASSETS,
} from '../../constants/serenity';

interface WhiteOutStageProps {
  scrollYProgress: MotionValue<number>;
}

export const WhiteOutStage: React.FC<WhiteOutStageProps> = ({ scrollYProgress }) => {
  // Phase 2 : 0.10 → 0.25 (Zoom massif)
  // Background blanc : 0 à 1
  const bgOpacity = useTransform(scrollYProgress, [0.10, 0.25], [0, 1], { ease: [0.21, 0.47, 0.32, 0.98] as any });

  const imageScale = useTransform(
    scrollYProgress, 
    [0.10, 0.25], 
    [1.2, 20]
  );

  // Content opacity: fade out as we zoom in deeper
  const contentOpacity = useTransform(scrollYProgress, [0.20, 0.25], [1, 0]);

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      style={{
        pointerEvents: 'none',
      }}
    >
      {/* White overlay background */}
      <motion.div
        className="absolute inset-0 bg-white"
        style={{
          opacity: bgOpacity,
        }}
      />

      {/* Zoomed image (hidden behind white) */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: contentOpacity,
        }}
      >
        <motion.img
          src={SERENITY_ASSETS.HERYZE_IMAGE}
          alt="Heryze Dashboard Zoom"
          className="max-w-4xl rounded-2xl border border-white/5"
          style={{
            scale: imageScale,
          }}
        />
      </motion.div>
    </motion.div>
  );
};
