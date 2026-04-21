import React, { useRef } from 'react';
import { useScroll } from 'framer-motion';
import UnifiedHeryzeTransition from '../Components/UnifiedHeryzeTransition';

/**
 * Demo page for the Serenity Journey cinematic sequence
 */
export const SerenityJourneyDemo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="w-full h-[300vh] bg-black">
      <UnifiedHeryzeTransition progress={scrollYProgress} />
    </div>
  );
};

export default SerenityJourneyDemo;
