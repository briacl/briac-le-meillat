import React from 'react';
import { motion, useTransform } from 'framer-motion';
import { MotionValue } from 'framer-motion';
import {
  SERENITY_PHASES,
  SERENITY_COLORS,
  SERENITY_FONTS,
} from '../../constants/serenity';

interface SerenityStageProps {
  scrollYProgress: MotionValue<number>;
}

export const SerenityStage: React.FC<SerenityStageProps> = ({ scrollYProgress }) => {
  // Phase 5 : 0.65 → 0.85 (Sérénité)
  // Global opacity for stage (appears on white, fades out at end)
  const stageOpacity = useTransform(scrollYProgress, [0.65, 0.70, 0.80, 0.85], [0, 1, 1, 0], { ease: [0.21, 0.47, 0.32, 0.98] as any });

  // Word "sérénité" : White monumental -> Gradient reduced
  const sereniteScale = useTransform(scrollYProgress, [0.65, 0.85], [10, 1.5], { ease: [0.21, 0.47, 0.32, 0.98] as any });
  
  // Transition from White to Gradient (simulated with opacity overlays or text-fill)
  const colorTransition = useTransform(scrollYProgress, [0.70, 0.85], [0, 1]);
  
  // Background transition: White to Black
  const bgBlackOpacity = useTransform(scrollYProgress, [0.65, 0.85], [0, 1], { ease: [0.21, 0.47, 0.32, 0.98] as any });

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-white"
      style={{
        opacity: stageOpacity,
        pointerEvents: 'none',
        zIndex: 100, // Superior z-index for "aspiration" effect
      }}
    >
      {/* Background Black Overlay */}
      <motion.div
        className="absolute inset-0 bg-black"
        style={{
          opacity: bgBlackOpacity,
        }}
      />

      {/* Word "sérénité" */}
      <motion.div
        className="relative"
        style={{
          scale: sereniteScale,
        }}
      >
        {/* White Layer */}
        <motion.h2
          className={`${SERENITY_FONTS.TITLE} uppercase font-bold tracking-[0.5em] text-white whitespace-nowrap text-8xl`}
          style={{
            opacity: useTransform(scrollYProgress, [0.70, 0.85], [1, 0]),
          }}
        >
          sérénité
        </motion.h2>

        {/* Gradient Layer */}
        <motion.h2
          className={`${SERENITY_FONTS.TITLE} uppercase font-bold tracking-[0.5em] absolute inset-0 whitespace-nowrap text-8xl bg-clip-text text-transparent`}
          style={{
            backgroundImage: `linear-gradient(135deg, ${SERENITY_COLORS.BLUE_VIOLET_START}, ${SERENITY_COLORS.BLUE_VIOLET_END})`,
            opacity: colorTransition,
          }}
        >
          sérénité
        </motion.h2>
      </motion.div>
    </motion.div>
  );
};
