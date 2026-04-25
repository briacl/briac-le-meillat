import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Activity, Banknote, ArrowUpRight, Cpu, Zap, Shield, Wifi, TrendingUp, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const APPLE_BEZIER = [0.21, 0.47, 0.32, 0.98];

/* ── Keyframes injectées pour le shimmer tournant ── */
const sharedStyles = `
@keyframes rotateShineCyan {
    0%   { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
}
@keyframes rotateShineMagenta {
    0%   { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
}
.shimmer-cyan {
    animation: rotateShineCyan 4s linear infinite;
}
.shimmer-magenta {
    animation: rotateShineMagenta 4s linear infinite;
}
.nexus-card-wrap { position: relative; }
.nexus-card-aura {
    transition: transform 0.7s cubic-bezier(0.21,0.47,0.32,0.98), opacity 0.7s ease;
}
.nexus-card-wrap:hover .nexus-card-aura {
    transform: scale(1.05);
}
`;

const projects = [
    {
        id: 'synapseo',
        title: 'SYNAPSEO',
        tagline: 'Intelligence juridique augmentée.',
        icon: <Activity size={52} strokeWidth={0.8} />,
        auraColor: 'rgba(0, 210, 255, 0.45)',
        accentColor: '#00D2FF',
        accentColorRgb: '0, 210, 255',
        shimmerClass: 'shimmer-cyan',
        shimmerGradient: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.9) 20deg, #00D2FF 50deg, transparent 80deg)',
        benefits: [
            { icon: <Shield size={15} strokeWidth={1.5} />, label: 'Secret professionnel sanctuarisé' },
            { icon: <Cpu size={15} strokeWidth={1.5} />, label: 'Analyse documentaire par IA' },
            { icon: <Zap size={15} strokeWidth={1.5} />, label: 'Génération de résumés en temps réel' },
            { icon: <Wifi size={15} strokeWidth={1.5} />, label: 'Synchronisation multi-cabinet' },
        ],
        benefitGradient: 'linear-gradient(to right, #ffffff 0%, #00D2FF 100%)',
        taglineGradient: 'linear-gradient(to right, #ffffff 0%, #00D2FF 100%)',
    },
    {
        id: 'heryze',
        title: 'HERYZE',
        tagline: 'Commerce de terrain réinventé.',
        icon: <Banknote size={52} strokeWidth={0.8} />,
        auraColor: 'rgba(255, 45, 155, 0.45)',
        accentColor: '#FF2D9B',
        accentColorRgb: '255, 45, 155',
        shimmerClass: 'shimmer-magenta',
        shimmerGradient: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.9) 20deg, #FF2D9B 50deg, transparent 80deg)',
        benefits: [
            { icon: <TrendingUp size={15} strokeWidth={1.5} />, label: 'Vente offline & synchronisation auto' },
            { icon: <Package size={15} strokeWidth={1.5} />, label: 'Gestion des stocks en temps réel' },
            { icon: <Zap size={15} strokeWidth={1.5} />, label: 'Encaissement mobile ultra-rapide' },
            { icon: <Wifi size={15} strokeWidth={1.5} />, label: 'Mode sans réseau intégré' },
        ],
        benefitGradient: 'linear-gradient(to right, #ffffff 0%, #FF2D9B 100%)',
        taglineGradient: 'linear-gradient(to right, #ffffff 0%, #FF2D9B 100%)',
    },
];

export default function NexusCollection() {
    const headerRef = useRef<HTMLDivElement>(null);
    const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' });

    return (
        <>
            {/* Inject keyframe styles */}
            <style>{sharedStyles}</style>

            <section
                id="nexus-collection"
                className="w-full py-40 relative overflow-hidden"
                style={{ backgroundColor: '#000000' }}
            >
                <div className="max-w-6xl mx-auto px-6">

                    {/* ── 1. TITRE ── */}
                    <div ref={headerRef} className="mb-32 text-center">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, ease: APPLE_BEZIER as any }}
                            className="text-xs font-mono uppercase tracking-[0.4em] text-zinc-500 mb-6"
                        >
                            Nexus Collection
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 1.2, delay: 0.1, ease: APPLE_BEZIER as any }}
                            className="text-5xl md:text-8xl font-['Paris2024'] text-white tracking-tighter"
                        >
                            Turbopropulsé par la
                        </motion.h2>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 1.2, delay: 0.2, ease: APPLE_BEZIER as any }}
                            className="text-5xl md:text-8xl font-['Paris2024'] tracking-tighter"
                            style={{
                                background: 'linear-gradient(135deg, #00D2FF 0%, #FF2D9B 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            Nexus Intelligence.
                        </motion.h2>
                    </div>

                    {/* ── 2. CARTES ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
                        {projects.map((project, index) => (
                            <div key={project.id} className="flex flex-col items-center gap-10">

                                {/* ── CARD ZONE ── */}
                                <div className="nexus-card-wrap w-full max-w-sm mx-auto">

                                    {/* Aura — intense par défaut, scale au hover via CSS */}
                                    <div
                                        className="nexus-card-aura absolute pointer-events-none"
                                        style={{
                                            inset: '-120px',
                                            background: `radial-gradient(circle at 50% 50%, ${project.auraColor} 0%, transparent 70%)`,
                                            filter: 'blur(60px)',
                                            zIndex: 0,
                                        }}
                                    />

                                    {/* Card — overflow:hidden pour clipper le shimmer */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 1.2, delay: index * 0.15, ease: APPLE_BEZIER as any }}
                                        viewport={{ once: true }}
                                        className="relative z-10 w-full rounded-[2rem] overflow-hidden cursor-default"
                                        style={{
                                            aspectRatio: '1 / 1',
                                            backgroundColor: '#0d0d0d',
                                            border: '1px solid rgba(63,63,70,0.9)',
                                            boxShadow: `inset 0 1px 1px rgba(255,255,255,0.10), 0 50px 100px rgba(0,0,0,0.7)`,
                                        }}
                                    >
                                        {/* ── TRAVELING SHIMMER BORDER ── */}
                                        {/*
                                            Technique : un div carré 200%×200% centré sur la carte,
                                            animé en rotation continue avec un conic-gradient partant
                                            de blanc et allant vers la couleur accent.
                                            La carte a overflow:hidden, donc seule la bordure est visible.
                                            Un masque central opaque (#0d0d0d) recouvre l'intérieur.
                                        */}
                                        <div
                                            aria-hidden="true"
                                            className={`absolute ${project.shimmerClass} pointer-events-none`}
                                            style={{
                                                top: '50%',
                                                left: '50%',
                                                width: '200%',
                                                height: '200%',
                                                background: project.shimmerGradient,
                                                zIndex: 1,
                                            }}
                                        />
                                        {/* Inner fill — cache le conic à l'intérieur */}
                                        <div
                                            aria-hidden="true"
                                            className="absolute rounded-[1.8rem] pointer-events-none"
                                            style={{
                                                inset: '1px',
                                                backgroundColor: '#0d0d0d',
                                                zIndex: 2,
                                            }}
                                        />

                                        {/* Card Content — au-dessus du masque */}
                                        <div
                                            className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-10"
                                        >
                                            {/* Top edge shimmer accent */}
                                            <div
                                                className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
                                                style={{
                                                    width: '60%',
                                                    height: '1px',
                                                    background: `linear-gradient(to right, transparent, rgba(${project.accentColorRgb}, 0.4), transparent)`,
                                                }}
                                            />

                                            {/* Icon */}
                                            <div
                                                className="opacity-90 transition-opacity duration-500"
                                                style={{ color: project.accentColor }}
                                            >
                                                {project.icon}
                                            </div>

                                            {/* Title + Subtitle */}
                                            <div className="text-center space-y-2">
                                                <p
                                                    className="font-['Paris2024'] text-3xl font-normal uppercase tracking-widest"
                                                    style={{ color: project.accentColor }}
                                                >
                                                    {project.title}
                                                </p>
                                                <p className="font-['Paris2024'] text-zinc-400 text-xs font-normal tracking-[0.2em] px-6">
                                                    {project.tagline}
                                                </p>
                                            </div>

                                            {/* Divider */}
                                            <div
                                                style={{
                                                    width: '4rem',
                                                    height: '0.5px',
                                                    background: `rgba(${project.accentColorRgb}, 0.3)`,
                                                }}
                                            />
                                        </div>
                                    </motion.div>
                                </div>

                                {/* ── 3. BÉNÉFICES — SOUS LA CARTE ── */}
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.9, delay: index * 0.15 + 0.4, ease: APPLE_BEZIER as any }}
                                    viewport={{ once: true }}
                                    className="w-full max-w-sm space-y-3"
                                >
                                    {project.benefits.map((b, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -8 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.15 + i * 0.08 + 0.55, ease: APPLE_BEZIER as any }}
                                            viewport={{ once: true }}
                                            className="flex items-center gap-3"
                                        >
                                            {/* Icon with gradient color */}
                                            <span
                                                className="flex-shrink-0"
                                                style={{
                                                    background: project.benefitGradient,
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                    backgroundClip: 'text',
                                                    color: project.accentColor, /* fallback */
                                                }}
                                            >
                                                {b.icon}
                                            </span>

                                            {/* Label with white→accent gradient */}
                                            <span
                                                className="font-['Paris2024'] text-sm font-normal"
                                                style={{
                                                    background: project.benefitGradient,
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                    backgroundClip: 'text',
                                                }}
                                            >
                                                {b.label}
                                            </span>
                                        </motion.div>
                                    ))}
                                </motion.div>

                                {/* ── 4. TAGLINE ITALIC ── */}
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1, delay: index * 0.15 + 0.7, ease: APPLE_BEZIER as any }}
                                    viewport={{ once: true }}
                                    className="font-['Paris2024'] text-center text-lg md:text-xl font-normal italic leading-relaxed max-w-xs"
                                    style={{
                                        background: project.taglineGradient,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                    }}
                                >
                                    {project.id === 'synapseo'
                                        ? 'Sanctuarisez le secret professionnel.'
                                        : 'Vendez sans limites, même sans réseau.'}
                                </motion.p>

                            </div>
                        ))}
                    </div>

                    {/* ── 5. FOOTER ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: APPLE_BEZIER as any }}
                        viewport={{ once: true }}
                        className="mt-48 max-w-4xl mx-auto text-center space-y-8"
                    >
                        <p className="text-2xl md:text-4xl font-['Paris2024'] leading-tight tracking-tight">
                            <span className="text-white">L'excellence ne se construit pas seul.{' '}</span>
                            <span className="text-zinc-500">
                                Chaque solution Nexus est le fruit d'une collaboration étroite avec les acteurs du terrain — pour transformer la complexité en harmonie.
                            </span>
                        </p>

                        <div className="pt-4">
                            <Link
                                to="/nexus-prop"
                                className="group inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-300 transition-colors text-[10px] font-mono uppercase tracking-[0.4em]"
                            >
                                Explorer l'écosystème complet
                                <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Navigation Button to Code Poetics */}
                    <div className="mt-32 flex justify-center">
                        <motion.a
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            href="#the-core-header"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('the-core-header')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="border border-white/10 rounded-full w-[60px] h-[60px] flex items-center justify-center cursor-pointer transition-all duration-300 animate-bounce hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] group"
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
