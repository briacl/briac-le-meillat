import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Terminal, BrainCircuit, Layers, ArrowUpRight } from 'lucide-react';

const APPLE_BEZIER = [0.21, 0.47, 0.32, 0.98];

/* ── Keyframes injectées pour le shimmer tournant ── */
const sharedStyles = `
@keyframes rotateShineBlue {
    0%   { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
}
@keyframes rotateShineViolet {
    0%   { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
}
@keyframes rotateShineCyan {
    0%   { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
}
.toolset-shimmer-blue   { animation: rotateShineBlue   6s linear infinite; }
.toolset-shimmer-violet { animation: rotateShineViolet 6s linear infinite; }
.toolset-shimmer-cyan   { animation: rotateShineCyan   6s linear infinite; }
.toolset-card-wrap { position: relative; }
.toolset-card-aura {
    transition: transform 0.7s cubic-bezier(0.21,0.47,0.32,0.98), opacity 0.7s ease;
}
.toolset-card-wrap:hover .toolset-card-aura {
    transform: scale(1.06);
}
`;

interface Pillar {
    id: string;
    label: string;
    title: string;
    tagline: string;
    description: string;
    projects: string[];
    projectTaglines: string[];
    icon: React.ReactNode;
    auraColor: string;
    accentColor: string;
    accentColorRgb: string;
    shimmerClass: string;
    shimmerGradient: string;
    benefitGradient: string;
}

const pillars: Pillar[] = [
    {
        id: 'automation',
        label: 'Pilier I',
        title: 'Automation & Workflow',
        tagline: 'Standardiser la création.',
        description: "L'art de rendre la mise en place invisible.",
        projects: ['willkommen_v2', 'readme-generator', 'own-cli-template'],
        projectTaglines: [
            'L\'accueil réinventé par le code.',
            'Documentation générée, jamais écrite.',
            'L\'architecture de démarrage universelle.',
        ],
        icon: <Terminal size={48} strokeWidth={0.75} />,
        auraColor: 'rgba(59, 130, 246, 0.4)',
        accentColor: '#3B82F6',
        accentColorRgb: '59, 130, 246',
        shimmerClass: 'toolset-shimmer-blue',
        shimmerGradient: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.85) 20deg, #3B82F6 50deg, transparent 80deg)',
        benefitGradient: 'linear-gradient(to right, #ffffff 0%, #3B82F6 100%)',
    },
    {
        id: 'intelligence',
        label: 'Pilier II',
        title: 'Intelligence & Data',
        tagline: 'Rendre la donnée vivante.',
        description: 'Transformer des flux complexes en insights.',
        projects: ['machine-learning', 'visualisation-réseau'],
        projectTaglines: [
            'La géométrie des flux.',
            'Des modèles qui apprennent, des décisions qui s\'affinent.',
        ],
        icon: <BrainCircuit size={48} strokeWidth={0.75} />,
        auraColor: 'rgba(139, 92, 246, 0.4)',
        accentColor: '#8B5CF6',
        accentColorRgb: '139, 92, 246',
        shimmerClass: 'toolset-shimmer-violet',
        shimmerGradient: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.85) 20deg, #8B5CF6 50deg, transparent 80deg)',
        benefitGradient: 'linear-gradient(to right, #ffffff 0%, #8B5CF6 100%)',
    },
    {
        id: 'infrastructure',
        label: 'Pilier III',
        title: 'Shared Infrastructure',
        tagline: 'Le noyau universel.',
        description: 'Bibliothèques réutilisables pour une cohérence totale.',
        projects: ['lyrae-shared'],
        projectTaglines: [
            'Écrire une fois, déployer partout.',
        ],
        icon: <Layers size={48} strokeWidth={0.75} />,
        auraColor: 'rgba(6, 182, 212, 0.4)',
        accentColor: '#06B6D4',
        accentColorRgb: '6, 182, 212',
        shimmerClass: 'toolset-shimmer-cyan',
        shimmerGradient: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.85) 20deg, #06B6D4 50deg, transparent 80deg)',
        benefitGradient: 'linear-gradient(to right, #ffffff 0%, #06B6D4 100%)',
    },
];

/* ── Card Component ── */
const PillarCard = ({ pillar, index }: { pillar: Pillar; index: number }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(cardRef, { once: true, margin: '-80px' });

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: index * 0.18, ease: APPLE_BEZIER as any }}
            className="flex flex-col items-center gap-10"
        >
            {/* ── CARD ZONE ── */}
            <div className="toolset-card-wrap w-full max-w-sm mx-auto">

                {/* Aura */}
                <div
                    className="toolset-card-aura absolute pointer-events-none"
                    style={{
                        inset: '-100px',
                        background: `radial-gradient(circle at 50% 50%, ${pillar.auraColor} 0%, transparent 70%)`,
                        filter: 'blur(50px)',
                        zIndex: 0,
                    }}
                />

                {/* Card */}
                <div
                    className="relative z-10 w-full rounded-[3rem] overflow-hidden cursor-default"
                    style={{
                        aspectRatio: '1 / 1',
                        backgroundColor: '#0a0a0a',
                        border: '1px solid rgba(63,63,70,0.85)',
                        boxShadow: `inset 0 1px 1px rgba(255,255,255,0.08), 0 40px 80px rgba(0,0,0,0.6)`,
                    }}
                >
                    {/* Shimmer border */}
                    <div
                        aria-hidden="true"
                        className={`absolute ${pillar.shimmerClass} pointer-events-none`}
                        style={{
                            top: '50%',
                            left: '50%',
                            width: '200%',
                            height: '200%',
                            background: pillar.shimmerGradient,
                            zIndex: 1,
                        }}
                    />
                    {/* Inner fill */}
                    <div
                        aria-hidden="true"
                        className="absolute rounded-[2.8rem] pointer-events-none"
                        style={{ inset: '1px', backgroundColor: '#0a0a0a', zIndex: 2 }}
                    />

                    {/* Card content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 z-10 px-8">
                        {/* Top edge accent */}
                        <div
                            className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
                            style={{
                                width: '55%',
                                height: '1px',
                                background: `linear-gradient(to right, transparent, rgba(${pillar.accentColorRgb}, 0.35), transparent)`,
                            }}
                        />

                        {/* Pillar label */}
                        <p
                            className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-60"
                            style={{ color: pillar.accentColor }}
                        >
                            {pillar.label}
                        </p>

                        {/* Icon */}
                        <div
                            className="opacity-90 transition-opacity duration-500"
                            style={{ color: pillar.accentColor }}
                        >
                            {pillar.icon}
                        </div>

                        {/* Title */}
                        <div className="text-center space-y-2">
                            <p
                                className="font-['Paris2024'] text-2xl font-normal uppercase tracking-widest leading-tight"
                                style={{ color: pillar.accentColor }}
                            >
                                {pillar.title}
                            </p>
                            <p className="font-['Paris2024'] text-zinc-400 text-xs font-normal tracking-[0.18em] px-4 leading-relaxed">
                                {pillar.description}
                            </p>
                        </div>

                        {/* Divider */}
                        <div
                            style={{
                                width: '3.5rem',
                                height: '0.5px',
                                background: `rgba(${pillar.accentColorRgb}, 0.3)`,
                            }}
                        />

                        {/* Projects list */}
                        <div className="flex flex-col items-center gap-1.5">
                            {pillar.projects.map((proj) => (
                                <span
                                    key={proj}
                                    className="text-[9px] font-mono tracking-[0.3em] text-zinc-500 uppercase"
                                >
                                    {proj}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Project taglines below the card ── */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.9, delay: index * 0.18 + 0.4, ease: APPLE_BEZIER as any }}
                className="w-full max-w-sm space-y-3"
            >
                {pillar.projectTaglines.map((tagline, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: index * 0.18 + i * 0.09 + 0.55, ease: APPLE_BEZIER as any }}
                        className="flex items-start gap-3"
                    >
                        <span
                            className="mt-1 flex-shrink-0 w-1 h-1 rounded-full"
                            style={{ backgroundColor: pillar.accentColor }}
                        />
                        <span
                            className="font-['Paris2024'] text-sm font-normal leading-relaxed"
                            style={{
                                background: pillar.benefitGradient,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            {tagline}
                        </span>
                    </motion.div>
                ))}
            </motion.div>

            {/* ── Tagline italic ── */}
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: index * 0.18 + 0.7, ease: APPLE_BEZIER as any }}
                className="font-['Paris2024'] text-center text-lg font-normal italic leading-relaxed max-w-xs"
                style={{
                    background: pillar.benefitGradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                }}
            >
                {pillar.tagline}
            </motion.p>
        </motion.div>
    );
};

/* ── Main Section ── */
export default function TheToolset() {
    const headerRef = useRef<HTMLDivElement>(null);
    const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' });

    return (
        <>
            <style>{sharedStyles}</style>

            <section
                id="the-toolset"
                className="w-full py-40 relative overflow-hidden"
                style={{ backgroundColor: '#000000' }}
            >
                <div className="max-w-7xl mx-auto px-6">

                    {/* ── 1. ACCROCHE NARRATIVE ── */}
                    <div ref={headerRef} className="mb-32 text-center max-w-4xl mx-auto">
                        {/* <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, ease: APPLE_BEZIER as any }}
                            className="text-xs font-mono uppercase tracking-[0.4em] text-zinc-500 mb-6"
                        >
                            Mouvement III
                        </motion.p> */}

                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 1.2, delay: 0.1, ease: APPLE_BEZIER as any }}
                            className="text-6xl md:text-9xl font-['Paris2024'] text-white tracking-tighter leading-none mb-10"
                        >
                            The Toolset.
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 1, delay: 0.25, ease: APPLE_BEZIER as any }}
                            className="text-xl md:text-2xl font-sans leading-relaxed"
                        >
                            <span className="text-white">Une quête d'harmonie à travers mes premières architectures : des instruments forgés pour apprendre à bâtir demain.</span>{' '}
                            <span className="text-zinc-400">
                                De la recherche académique à l'application industrielle — chaque projet est un outil forgé
                                dans l'intention de résoudre un problème réel, avec une rigueur d'ingénierie durable.
                            </span>
                        </motion.p>
                    </div>

                    {/* ── 2. LES TROIS PILIERS ── */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-10">
                        {pillars.map((pillar, index) => (
                            <PillarCard key={pillar.id} pillar={pillar} index={index} />
                        ))}
                    </div>

                    {/* ── 3. NOTE DE TRANSITION (Le Futur de Bérangère) ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: APPLE_BEZIER as any }}
                        viewport={{ once: true }}
                        className="mt-48 max-w-4xl mx-auto border border-white/5 rounded-3xl px-10 py-12 bg-white/[0.02] backdrop-blur-sm text-center space-y-6"
                    >
                        <p
                            className="text-xs font-mono uppercase tracking-[0.4em] text-zinc-600"
                        >
                            En construction
                        </p>
                        <p className="text-xl md:text-2xl font-['Paris2024'] leading-relaxed tracking-tight">
                            <span className="text-white">
                                Bérangère • Development travaille activement avec Nexus sur des architectures
                                de nouvelle génération,{' '}
                            </span>
                            <span className="text-zinc-500">
                                qui redéfiniront l'expérience utilisateur dès 2027.
                            </span>
                        </p>

                        {/* <div className="pt-2">
                            <a
                                href="#nexus-collection"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById('nexus-collection')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="group inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-300 transition-colors text-[10px] font-mono uppercase tracking-[0.4em]"
                            >
                                Découvrir la Nexus Collection
                                <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </a>
                        </div> */}
                    </motion.div>

                    {/* ── 4. NAVIGATION BUTTON ── */}
                    <div className="mt-32 flex justify-center">
                        <motion.a
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            href="#code-poetics"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('code-poetics')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="bg-black border border-white/10 rounded-full w-[60px] h-[60px] flex items-center justify-center cursor-pointer transition-all duration-300 animate-bounce hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] group"
                        >
                            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-blue-500 transition-transform group-hover:scale-110">
                                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                            </svg>
                        </motion.a>
                    </div>

                </div>
            </section>
        </>
    );
}
