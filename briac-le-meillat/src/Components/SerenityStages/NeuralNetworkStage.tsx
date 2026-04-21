import React from 'react';
import { motion, useTransform } from 'framer-motion';
import { MotionValue } from 'framer-motion';
import {
  SERENITY_COLORS,
  SERENITY_FONTS,
} from '../../constants/serenity';

interface NeuralNetworkStageProps {
  scrollYProgress: MotionValue<number>;
}

export const NeuralNetworkStage: React.FC<NeuralNetworkStageProps> = ({ scrollYProgress }) => {
  // Phase 6 : 0.85 → 1.00 (Handoff vers Développement Web)
  const stageOpacity = useTransform(scrollYProgress, [0.85, 0.90], [0, 1]);

  // Texte "Développement Web" : Apparition monumentale
  const devWebScale = useTransform(scrollYProgress, [0.85, 1.00], [0.1, 1.2], { ease: [0.21, 0.47, 0.32, 0.98] as any });
  const devWebOpacity = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]);

  return (
    <motion.div
      className="absolute inset-0 bg-black overflow-hidden flex flex-col items-center justify-center"
      style={{
        opacity: stageOpacity,
        pointerEvents: 'none',
        zIndex: 50, // Ajusté pour être au-dessus mais stable
      }}
    >
      {/* 
          Note: Suppression des particules dynamiques et de la balise <style> 
          pour éliminer les risques de crash au rendu. 
      */}
      
      {/* Content overlay */}
      <motion.div
        className="text-center z-10"
        style={{
          scale: devWebScale,
          opacity: devWebOpacity,
        }}
      >
        <motion.h1
          className={`${SERENITY_FONTS.TITLE} uppercase font-bold text-7xl md:text-9xl text-transparent bg-clip-text tracking-widest mb-4`}
          style={{
            backgroundImage: `linear-gradient(135deg, ${SERENITY_COLORS.BLUE_VIOLET_START}, ${SERENITY_COLORS.BLUE_VIOLET_END})`,
          }}
        >
          Développement Web
        </motion.h1>

        {/* Reveal subtext */}
        <motion.p
          className="text-xl text-white/40 tracking-[0.3em] font-light uppercase"
          style={{
            opacity: useTransform(scrollYProgress, [0.90, 1.00], [0, 1]),
          }}
        >
          explorez les noeuds de l'esprit
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
