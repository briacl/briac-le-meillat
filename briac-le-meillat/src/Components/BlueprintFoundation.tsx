import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import { Layers, Target, Code, Plus, Minus } from 'lucide-react';
import CompetencesBUT from './CompetencesBUT';

const APPLE_BEZIER = [0.21, 0.47, 0.32, 0.98];

const pillars = [
    {
        id: 'admin',
        title: 'Administrer',
        tagline: "L'Architecture Invisible",
        icon: <Layers strokeWidth={1} size={32} />,
    },
    {
        id: 'connect',
        title: 'Connecter',
        tagline: 'Le Dialogue Universel',
        icon: <Target strokeWidth={1} size={32} />,
    },
    {
        id: 'prog',
        title: 'Programmer',
        tagline: "L'Art de l'Interaction",
        icon: <Code strokeWidth={1} size={32} />,
    },
];

export default function BlueprintFoundation({ defaultExpanded = false }: { defaultExpanded?: boolean }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const expandedRef = useRef<HTMLDivElement>(null);
    const pillarsRef = useRef<HTMLDivElement>(null);
    const [phase, setPhase] = useState<'blueprint' | 'foundation'>(defaultExpanded ? 'foundation' : 'blueprint');
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);
    const isInView = useInView(containerRef, { once: true, margin: '-10% 0px -10% 0px' });

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    // Fond : blanc → noir entre 15 % et 65 % du scroll
    const bgColor = useTransform(scrollYProgress, [0.15, 0.65], ['#ffffff', '#000000']);

    // Titre "La Fondation." : noir → blanc avec le fond
    const titleColor = useTransform(scrollYProgress, [0.15, 0.65], ['#000000', '#ffffff']);
    const titleDimColor = useTransform(scrollYProgress, [0.15, 0.65], ['rgba(0,0,0,0.4)', 'rgba(255,255,255,0.4)']);

    const handleArrowClick = () => {
        setPhase('foundation');
    };

    const handleExpand = () => {
        setIsExpanded(true);
        // Scroll vers la fin du container (fond 100% noir) puis vers le référentiel
        if (containerRef.current) {
            const containerTop = containerRef.current.offsetTop;
            const scrollDistance = containerRef.current.offsetHeight - window.innerHeight;
            window.scrollTo({ top: containerTop + scrollDistance * 0.95, behavior: 'smooth' });
        }
        setTimeout(() => {
            expandedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 900);
    };

    const handleCollapse = () => {
        setIsExpanded(false);
        // Retour vers le début du container (fond blanc + grille)
        // getBoundingClientRect donne la position visuelle → + scrollY = position absolue dans le document
        if (containerRef.current) {
            const absoluteTop = containerRef.current.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: absoluteTop, behavior: 'smooth' });
        }
    };

    return (
        <>
            {/* Container 300vh — donne l'espace de scroll pour la transition */}
            <div ref={containerRef} id="blueprint-transition" style={{ height: '300vh' }}>

                {/* Sticky inner — reste affiché pendant tout le scroll du container */}
                <motion.div
                    className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center"
                    style={{ backgroundColor: bgColor }}
                >
                    {/* Grille blueprint — constante */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.42]">
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage: `
                                    linear-gradient(to right, rgba(0, 210, 255, 0.2) 2px, transparent 2px),
                                    linear-gradient(to bottom, rgba(0, 210, 255, 0.2) 2px, transparent 2px),
                                    linear-gradient(to right, rgba(0, 210, 255, 0.1) 1px, transparent 1px),
                                    linear-gradient(to bottom, rgba(0, 210, 255, 0.1) 1px, transparent 1px)
                                `,
                                backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
                            }}
                        />
                    </div>

                    {/* Contenu central */}
                    <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center gap-14">

                        {/* Titre : Blueprint → La Fondation. */}
                        <div className="text-center">
                            <AnimatePresence mode="wait">
                                {phase === 'blueprint' ? (
                                    <motion.div
                                        key="blueprint"
                                        initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
                                        animate={isInView ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
                                        exit={{ opacity: 0, scale: 1.05, filter: 'blur(12px)' }}
                                        transition={{ duration: 1, ease: APPLE_BEZIER as any }}
                                    >
                                        <h2 className="text-6xl md:text-8xl lg:text-[11rem] font-normal tracking-tighter leading-none font-['Paris2024']">
                                            <span className="bg-gradient-to-r from-[#00D2FF] to-[#3a7bd5] bg-clip-text text-transparent select-none">
                                                Blueprint.
                                            </span>
                                        </h2>
                                        <motion.p
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={isInView ? { opacity: 0.4, y: 0 } : { opacity: 0, y: 10 }}
                                            transition={{ delay: 0.6, duration: 0.8 }}
                                            className="mt-6 text-black font-['Baskerville'] tracking-[0.5em] text-xl md:text-2xl"
                                        >
                                            From Vision to Performance.
                                        </motion.p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="foundation"
                                        initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 1.1, ease: APPLE_BEZIER as any }}
                                    >
                                        <h2 className="text-6xl md:text-8xl lg:text-[9rem] font-['Paris2024'] tracking-tighter leading-none">
                                            <motion.span style={{ color: titleDimColor }}>La </motion.span>
                                            <motion.span style={{ color: titleColor }}>Fondation.</motion.span>
                                        </h2>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Spacer invisible en phase blueprint — maintient la position du titre */}
                        {phase === 'blueprint' && (
                            <div className="w-full" style={{ height: '320px' }} aria-hidden />
                        )}

                        {/* Cards + bouton Explorer — phase driven */}
                        <AnimatePresence>
                            {phase === 'foundation' && (
                                <motion.div
                                    key="foundation-content"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-full flex flex-col items-center gap-10"
                                >
                                    {/* Cards blanches */}
                                    <div ref={pillarsRef} className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
                                        {pillars.map((pillar, i) => (
                                            <motion.div
                                                key={pillar.id}
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.8, delay: 0.2 + i * 0.12, ease: APPLE_BEZIER as any }}
                                                className="flex flex-col items-center text-center space-y-6 p-8 rounded-[2rem] bg-white border border-black/8 shadow-sm hover:shadow-md transition-all duration-500 group"
                                            >
                                                <div className="text-black/30 group-hover:text-black transition-colors duration-500">
                                                    {pillar.icon}
                                                </div>
                                                <div className="space-y-2">
                                                    <h4 className="text-2xl font-normal text-black font-['Paris2024'] uppercase tracking-widest leading-none">
                                                        {pillar.title}
                                                    </h4>
                                                    <p className="text-[10px] font-mono text-black/40 uppercase tracking-[0.3em] group-hover:text-blue-600 transition-colors duration-500">
                                                        {pillar.tagline}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Bouton Explorer */}
                                    {!isExpanded && (
                                        <motion.button
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.7, delay: 0.7, ease: APPLE_BEZIER as any }}
                                            onClick={handleExpand}
                                            className="group flex flex-col items-center gap-4"
                                        >
                                            <div className="w-14 h-14 rounded-full border border-black/15 flex items-center justify-center group-hover:border-blue-500/50 group-hover:bg-blue-500/5 transition-all duration-500 text-black/60 group-hover:text-blue-600">
                                                <Plus size={22} strokeWidth={1.5} />
                                            </div>
                                            <span className="text-[10px] font-['Paris2024'] uppercase tracking-[0.4em] text-black/50 group-hover:text-black transition-colors">
                                                Explorer les Fondations Académiques
                                            </span>
                                        </motion.button>
                                    )}

                                    {/* Flèche vers Pilier I */}
                                    <motion.button
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.7, delay: 1, ease: APPLE_BEZIER as any }}
                                        onClick={() => {
                                            const el = document.getElementById('the-toolset');
                                            if (el) {
                                                const top = el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.15;
                                                window.scrollTo({ top, behavior: 'smooth' });
                                            }
                                        }}
                                        className="border border-black/10 rounded-full w-[52px] h-[52px] flex items-center justify-center cursor-pointer transition-all duration-300 animate-bounce hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] group"
                                    >
                                        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-blue-500 transition-transform group-hover:scale-110">
                                            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                                        </svg>
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Flèche de déclenchement — phase blueprint uniquement */}
                    <AnimatePresence>
                        {phase === 'blueprint' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ delay: 1, duration: 0.8 }}
                                className="absolute bottom-[17%] left-0 w-full flex justify-center z-30"
                            >
                                <button
                                    onClick={handleArrowClick}
                                    className="border border-black/10 rounded-full w-[60px] h-[60px] flex items-center justify-center cursor-pointer transition-all duration-300 animate-bounce hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] group"
                                >
                                    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-blue-500 transition-transform group-hover:scale-110">
                                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                                    </svg>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* CompetencesBUT — hors du container, toujours sur fond noir */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        ref={expandedRef}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.8, ease: APPLE_BEZIER as any }}
                        className="w-full bg-black border-t border-white/5 px-6 py-20"
                    >
                        <CompetencesBUT />
                        <div className="mt-12 flex flex-col items-center">
                            <button
                                onClick={handleCollapse}
                                className="group flex flex-col items-center gap-4"
                            >
                                <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:border-blue-500/50 bg-white text-black transition-all duration-500">
                                    <Minus size={22} strokeWidth={1.5} />
                                </div>
                                <span className="text-[10px] font-['Paris2024'] uppercase tracking-[0.4em] text-white/60 group-hover:text-white transition-colors">
                                    Replier L'Architecture
                                </span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
