import React from 'react';
import { motion, useTransform } from 'framer-motion';
import { MotionValue } from 'framer-motion';
import { Smartphone } from 'lucide-react';
import {
  SERENITY_PHASES,
  SERENITY_COLORS,
  SERENITY_FONTS,
} from '../../constants/serenity';

interface DouchetteStageProps {
  scrollYProgress: MotionValue<number>;
}

export const DouchetteStage: React.FC<DouchetteStageProps> = ({ scrollYProgress }) => {
  // Phase 4 : 0.45 → 0.65 (Douchette)
  const stageOpacity = useTransform(scrollYProgress, [0.45, 0.50, 0.60, 0.65], [0, 1, 1, 0], { ease: [0.21, 0.47, 0.32, 0.98] as any });
  
  // Texte narratif : Scale 4 -> 1 sur le Blanc (Paris2024)
  const textScale = useTransform(scrollYProgress, [0.45, 0.65], [4, 1], { ease: [0.21, 0.47, 0.32, 0.98] as any });
  
  // Réduction du téléphone : 1 -> 0.5
  const phoneScale = useTransform(scrollYProgress, [0.45, 0.65], [1, 0.5], { ease: [0.21, 0.47, 0.32, 0.98] as any });
  const phoneOpacity = useTransform(scrollYProgress, [0.45, 0.60], [1, 0]);

  return (
    <motion.div
      className="absolute inset-0 bg-white flex items-center justify-center"
      style={{
        perspective: 1200,
        pointerEvents: 'none',
      }}
    >
      <div className="flex flex-col items-center justify-center gap-8">
        {/* Phone */}
        <motion.div
          style={{
            scale: phoneScale,
            opacity: phoneOpacity,
          }}
        >
          <Smartphone
            size={80}
            color={SERENITY_COLORS.BLACK}
            strokeWidth={1.5}
          />
        </motion.div>

        {/* Text with Z-axis effect (Scale 4 -> 1) */}
        <motion.div
          className="text-center"
          style={{
            scale: textScale,
            opacity: stageOpacity,
          }}
        >
          <motion.h2
            className={`${SERENITY_FONTS.TITLE} text-white text-5xl md:text-7xl font-bold uppercase tracking-widest drop-shadow-[0_2px_10px_rgba(0,0,0,0.2)]`}
          >
            Votre smartphone,
            <br />
            <span className="opacity-50">votre meilleure douchette.</span>
          </motion.h2>
        </motion.div>
      </div>
    </motion.div>
  );
};
