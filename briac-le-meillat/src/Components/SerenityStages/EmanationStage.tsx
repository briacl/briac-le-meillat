import React from 'react';
import { motion, useTransform } from 'framer-motion';
import { MotionValue } from 'framer-motion';
import { Smartphone } from 'lucide-react';
import {
  SERENITY_PHASES,
  SERENITY_COLORS,
} from '../../constants/serenity';

interface EmanationStageProps {
  scrollYProgress: MotionValue<number>;
}

export const EmanationStage: React.FC<EmanationStageProps> = ({ scrollYProgress }) => {
  // Phase 3 : 0.25 → 0.45 (Émanation sur fond blanc)
  // Global opacity for this stage
  const stageOpacity = useTransform(
    scrollYProgress,
    [0.25, 0.30, 0.40, 0.45],
    [0, 1, 1, 0],
    { ease: [0.21, 0.47, 0.32, 0.98] as any }
  );

  // Animation unique pour l'icône téléphone (émanation)
  const phoneScale = useTransform(scrollYProgress, [0.25, 0.45], [0.8, 1.2]);
  
  // Opacité des effets de lumière
  const lightOpacity = useTransform(scrollYProgress, [0.30, 0.40], [0, 1]);

  // Pulse scale pour les anneaux
  const pulseScale = useTransform(
    scrollYProgress,
    [0.25, 0.45],
    [1, 1.5]
  );

  // Pulse ring colors
  const ringColors = [
    SERENITY_COLORS.PHONE_LIGHT,
    SERENITY_COLORS.PHONE_BLUE,
    SERENITY_COLORS.BLUE_VIOLET_START,
    SERENITY_COLORS.BLUE_VIOLET_END,
  ];

  return (
    <motion.div
      className="absolute inset-0 bg-white flex items-center justify-center"
      style={{
        opacity: stageOpacity,
        pointerEvents: 'none',
        zIndex: 40,
      }}
    >
      {/* Phone icon with pulse rings */}
      <motion.div
        className="relative flex items-center justify-center"
        style={{
          opacity: stageOpacity,
        }}
      >
        {/* Animated rings */}
        {ringColors.map((color, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full border-2"
            style={{
              width: 150 + index * 50,
              height: 150 + index * 50,
              borderColor: color,
              opacity: stageOpacity,
              scale: pulseScale,
            }}
          />
        ))}

        {/* Phone icon */}
        <motion.div
          style={{
            scale: pulseScale,
            opacity: stageOpacity,
          }}
        >
          <Smartphone
            size={64}
            color={SERENITY_COLORS.BLACK}
            strokeWidth={1.5}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
