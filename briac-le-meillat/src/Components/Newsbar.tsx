import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Newsbar - Narrative implementation
 * Strictly follows the logic: Phase 1 (2.5s) -> Phase 2 (Permanent)
 */
const Newsbar = () => {
    const [phase, setPhase] = useState(1);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPhase(2);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    const messages = {
        1: {
            prefix: "a",
            main: "Bérangère",
            suffix: "branch"
        },
        2: {
            prefix: "par",
            main: "Briac Le Meillat",
            suffix: ", étudiant en 1ère année de Réseaux et Télécommunications"
        }
    };

    return (
        <div className="w-full bg-transparent py-3 px-4 flex justify-center items-center overflow-hidden mix-blend-difference">
            <div className="flex items-center gap-2 text-[10px] md:text-[11px] tracking-[0.1em] font-['Paris2024'] text-white">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={phase}
                        initial={{ opacity: 0, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, filter: 'blur(10px)' }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="flex items-center gap-1.5"
                    >
                        <span 
                            className="opacity-60" 
                            style={phase === 1 ? { fontFamily: "'NeutrafaceText', 'Montserrat', sans-serif", fontWeight: 300, fontStyle: 'italic', letterSpacing: '0.15em' } : {}}
                        >
                            {messages[phase as 1 | 2].prefix}
                        </span>
                        <span 
                            className="font-normal"
                            style={phase === 1 ? { fontFamily: "'NeutrafaceTextDemiSC', 'Montserrat', sans-serif", fontStyle: 'normal', letterSpacing: '0.2em' } : {}}
                        >
                            {messages[phase as 1 | 2].main}
                        </span>
                        <span 
                            className="opacity-60"
                            style={phase === 1 ? { fontFamily: "'NeutrafaceText', 'Montserrat', sans-serif", fontWeight: 300, fontStyle: 'italic', letterSpacing: '0.15em' } : {}}
                        >
                            {messages[phase as 1 | 2].suffix}
                        </span>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Newsbar;
