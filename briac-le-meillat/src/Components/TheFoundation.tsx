import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Target, Code, Plus, Minus } from 'lucide-react';
import CompetencesBUT from './CompetencesBUT';

const APPLE_BEZIER = [0.21, 0.47, 0.32, 0.98];

export default function TheFoundation() {
    const [isExpanded, setIsExpanded] = useState(false);
    const expandedRef = useRef<HTMLDivElement>(null);
    const pillarsRef = useRef<HTMLDivElement>(null);

    const pillars = [
        {
            id: 'admin',
            title: 'Administrer',
            tagline: "L'Architecture Invisible",
            icon: <Layers strokeWidth={1} size={32} />,
            color: '#0075FF'
        },
        {
            id: 'connect',
            title: 'Connecter',
            tagline: 'Le Dialogue Universel',
            icon: <Target strokeWidth={1} size={32} />,
            color: '#f336f0'
        },
        {
            id: 'prog',
            title: 'Programmer',
            tagline: "L'Art de l'Interaction",
            icon: <Code strokeWidth={1} size={32} />,
            color: '#00ccff'
        }
    ];

    const handleToggle = () => {
        if (!isExpanded) {
            setIsExpanded(true);
            setTimeout(() => {
                if (expandedRef.current) {
                    const yOffset = -150; // Décale le scroll légèrement plus bas
                    const y = expandedRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }, 100);
        } else {
            setIsExpanded(false);
            setTimeout(() => {
                pillarsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);
        }
    };

    return (
        <section id="the-foundation" className="w-full py-32 bg-black border-t border-white/5 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">

                {/* Section Header */}
                <div className="mb-24 text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: APPLE_BEZIER as any }}
                        viewport={{ once: true }}
                    >
                        {/* <h2 className="text-[10px] font-['Paris2024'] uppercase tracking-[0.6em] text-blue-500 mb-2">The Foundation</h2> */}
                        <h3 className="text-4xl md:text-6xl font-['Paris2024'] text-white uppercase tracking-tight">
                            L'Évidence par <span className="opacity-40">Design</span>
                        </h3>
                    </motion.div>
                </div>

                {/* Level 1: Narrative Pillars */}
                <div ref={pillarsRef} className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
                    {pillars.map((pillar, index) => (
                        <motion.div
                            key={pillar.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, delay: index * 0.15, ease: APPLE_BEZIER as any }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center text-center space-y-8 p-10 rounded-[2.5rem] bg-zinc-900/40 border border-white/20 hover:border-white/40 transition-all duration-700 group"
                        >
                            <div className="text-white/40 group-hover:text-white transition-colors duration-500">
                                {pillar.icon}
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-3xl font-['Paris2024'] text-white uppercase tracking-widest leading-none">
                                    {pillar.title}
                                </h4>
                                <p className="text-[10px] font-mono text-white/70 uppercase tracking-[0.3em] group-hover:text-blue-500 transition-colors duration-500">
                                    {pillar.tagline}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Level 2: Push-down Interaction */}
                <div className="flex flex-col items-center">
                    <div className="w-full flex justify-center">
                        <AnimatePresence mode="wait">
                            {!isExpanded && (
                                <motion.button
                                    key="expand-button"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    onClick={handleToggle}
                                    className="group flex flex-col items-center gap-6 transition-all duration-500"
                                >
                                    <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:border-blue-500/50 group-hover:bg-blue-500/5 bg-transparent text-white">
                                        <Plus size={24} strokeWidth={1.5} />
                                    </div>
                                    <span className="text-[11px] font-['Paris2024'] uppercase tracking-[0.4em] text-white/70 group-hover:text-white transition-colors">
                                        Explorer les Fondations Académiques
                                    </span>
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                ref={expandedRef}
                                initial={{ height: 0, opacity: 0, filter: 'blur(10px)' }}
                                animate={{ height: 'auto', opacity: 1, filter: 'blur(0px)' }}
                                exit={{ height: 0, opacity: 0, filter: 'blur(10px)' }}
                                transition={{ duration: 1, ease: APPLE_BEZIER as any }}
                                className="w-full overflow-hidden mt-10"
                            >
                                <div className="pt-8 border-t border-white/5 px-4">
                                    <CompetencesBUT />

                                    {/* Replier Button at the bottom */}
                                    <div className="mt-5 flex flex-col items-center">
                                        <button
                                            onClick={handleToggle}
                                            className="group flex flex-col items-center gap-6 transition-all duration-500"
                                        >
                                            <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:border-blue-500/50 group-hover:bg-blue-500/5 bg-white text-black">
                                                <Minus size={24} strokeWidth={1.5} />
                                            </div>
                                            <span className="text-[11px] font-['Paris2024'] uppercase tracking-[0.4em] text-white/70 group-hover:text-white transition-colors">
                                                Replier L'Architecture
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Button to Nexus Collection */}
                    <div className="mt-20 flex justify-center">
                        <motion.a
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            href="#the-toolset"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('the-toolset')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="border border-white/10 rounded-full w-[60px] h-[60px] flex items-center justify-center cursor-pointer transition-all duration-300 animate-bounce hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] group"
                        >
                            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-blue-500 transition-transform group-hover:scale-110">
                                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                            </svg>
                        </motion.a>
                    </div>
                </div>

            </div>
        </section>
    );
}
