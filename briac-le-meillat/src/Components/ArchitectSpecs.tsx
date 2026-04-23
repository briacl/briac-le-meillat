import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const APPLE_BEZIER = [0.21, 0.47, 0.32, 0.98];

// --- Sound Wave Component for Code Poetics ---
const SoundWave = ({ progress }: { progress: any }) => {
    // We create multiple bars that scale based on progress
    const barCount = 40;
    return (
        <div className="flex items-center justify-center gap-1 h-64 w-full max-w-md mx-auto">
            {[...Array(barCount)].map((_, i) => {
                // Calculate individual scale based on position and progress
                // We want a wave effect that moves or grows
                const delay = i * 0.05;
                const scale = useTransform(
                    progress,
                    [0, 0.5, 1],
                    [0.2, Math.sin(i * 0.5) * 0.8 + 1, 0.2]
                );

                return (
                    <motion.div
                        key={i}
                        style={{ scaleY: scale }}
                        className="w-1.5 h-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-full origin-center"
                    />
                );
            })}
        </div>
    );
};

export const PureStructure = () => {
    return (
        <section id="pure-structure" className="w-full min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: APPLE_BEZIER as any }}
                viewport={{ once: true }}
                className="max-w-4xl space-y-6"
            >
                <h2 className="text-5xl md:text-7xl font-['Paris2024'] text-white tracking-tighter">
                    Pure Structure.
                </h2>
                <p className="text-xl md:text-2xl font-sans leading-relaxed max-w-3xl mx-auto">
                    <span className="text-white">L'invisible au service de l'invincible.</span>{" "}
                    <span className="text-zinc-400">
                        Nous bâtissons des architectures capables d'absorber la charge sans jamais fléchir.
                        Parce qu'un beau design sans une structure robuste n'est qu'une façade.
                    </span>
                </p>
            </motion.div>

            {/* Navigation Button to The Foundation */}
            <div className="absolute bottom-12 left-0 w-full flex justify-center">
                <motion.a
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    href="#the-foundation"
                    onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('the-foundation')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-white border border-gray-200 shadow-sm rounded-full w-[60px] h-[60px] flex items-center justify-center cursor-pointer transition-all duration-300 animate-bounce hover:border-blue-500 hover:shadow-lg group"
                >
                    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-blue-500 transition-transform group-hover:scale-110">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                    </svg>
                </motion.a>
            </div>
        </section>
    );
};

export const CodePoetics = () => {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    return (
        <section id="code-poetics" ref={sectionRef} className="w-full min-h-screen bg-[#0d0d0d] flex items-center justify-center px-6 md:px-20 relative overflow-hidden border-t border-white/5">
            <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: APPLE_BEZIER as any }}
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    <h2 className="text-5xl md:text-7xl font-['Paris2024'] tracking-tighter bg-gradient-to-r from-[#0075FF] via-white to-[#0075FF] bg-clip-text text-transparent">
                        Code Poetics.
                    </h2>
                    <p className="text-xl md:text-2xl font-sans leading-relaxed">
                        <span className="text-white">Écrire pour l'utilisateur, composer pour la machine.</span>{" "}
                        <span className="text-zinc-400">
                            Nous n'agençons pas seulement des lignes, nous composons. Comme un instrument parfaitement accordé, votre interface réagit à l'instinct, sans friction, avec une justesse mathématique.
                        </span>
                    </p>
                </motion.div>

                <div className="flex justify-center">
                    <SoundWave progress={scrollYProgress} />
                </div>
            </div>

            {/* Navigation Button to Logic as Canvas */}
            <div className="absolute bottom-12 left-0 w-full flex justify-center">
                <motion.a
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    href="#logic-as-canvas"
                    onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('logic-as-canvas')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-white border border-gray-200 shadow-sm rounded-full w-[60px] h-[60px] flex items-center justify-center cursor-pointer transition-all duration-300 animate-bounce hover:border-blue-500 hover:shadow-lg group"
                >
                    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-blue-500 transition-transform group-hover:scale-110">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                    </svg>
                </motion.a>
            </div>
        </section>
    );
};

export const LogicAsCanvas = () => {
    return (
        <section id="logic-as-canvas" className="w-full min-h-screen bg-[#0d0d0d] flex items-center justify-center px-6 md:px-24 relative overflow-hidden border-t border-white/5">
            <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, x: -30 }}
                    whileInView={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 1.2, ease: APPLE_BEZIER as any }}
                    viewport={{ once: true }}
                    className="order-2 md:order-1 relative"
                >
                    <div className="absolute -inset-4 bg-blue-500/5 blur-3xl rounded-[2.5rem] pointer-events-none" />
                    <img
                        src={`${import.meta.env.BASE_URL}img_ref/synapseo_dashboard.png`}
                        alt="Nexus Dashboard Preview"
                        className="w-full h-auto rounded-3xl shadow-2xl border border-white/10"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: APPLE_BEZIER as any }}
                    viewport={{ once: true }}
                    className="order-1 md:order-2 space-y-6"
                >
                    <h2 className="text-5xl md:text-7xl font-['Paris2024'] tracking-tighter bg-gradient-to-r from-white via-[#f336f0] to-[#0075FF] bg-clip-text text-transparent">
                        Logic as Canvas.
                    </h2>
                    <p className="text-xl md:text-2xl font-sans leading-relaxed">
                        <span className="text-white">Où la donnée devient émotion.</span>{" "}
                        <span className="text-zinc-400">
                            La logique est notre canevas. Nous transformons des flux complexes en expériences sereines. Notre rôle est de rendre l'informatique invisible pour ne laisser que l'harmonie.
                        </span>
                    </p>
                </motion.div>
            </div>

            {/* Navigation Button to The Core */}
            <div className="absolute bottom-12 left-0 w-full flex justify-center">
                <motion.a
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    href="#nexus-collection"
                    onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('nexus-collection')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-white border border-gray-200 shadow-sm rounded-full w-[60px] h-[60px] flex items-center justify-center cursor-pointer transition-all duration-300 animate-bounce hover:border-blue-500 hover:shadow-lg group"
                >
                    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-blue-500 transition-transform group-hover:scale-110">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                    </svg>
                </motion.a>
            </div>
        </section>
    );
};

export const TheCoreHeader = () => {
    return (
        <section id="the-core-header" className="w-full min-h-screen bg-[#000000] flex flex-col items-center justify-center px-6 text-center relative overflow-hidden border-t border-white/5">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: APPLE_BEZIER as any }}
                viewport={{ once: true }}
                className="max-w-5xl space-y-6"
            >
                <h2 className="text-5xl md:text-8xl font-['Paris2024'] text-white tracking-tighter">
                    The Ecosystem.
                </h2>
                <p className="text-xl md:text-2xl text-zinc-400 font-sans leading-relaxed max-w-3xl mx-auto">
                    La vue macro de la galaxie de micro-outils et de recherches.
                </p>
            </motion.div>

            {/* Navigation Button to The Core Visual */}
            <div className="absolute bottom-12 left-0 w-full flex justify-center">
                <motion.a
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    href="#the-core-visual"
                    onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('the-core-visual')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-white border border-gray-200 shadow-sm rounded-full w-[60px] h-[60px] flex items-center justify-center cursor-pointer transition-all duration-300 animate-bounce hover:border-blue-500 hover:shadow-lg group"
                >
                    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-blue-500 transition-transform group-hover:scale-110">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                    </svg>
                </motion.a>
            </div>
        </section>
    );
};

export const FinalCTA = () => {
    const navigate = useNavigate();
    return (
        <section className="w-full min-h-screen bg-[#000000] flex flex-col items-center justify-center px-6 text-center relative overflow-hidden border-t border-white/5">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="space-y-12 relative z-10"
            >
                <h2 className="text-4xl md:text-6xl font-['Paris2024'] text-white uppercase tracking-widest">
                    Prêt à composer ?
                </h2>

                <div className="relative group flex items-center justify-center w-fit mx-auto">
                    {/* Halo d'émanation Nexus */}
                    <div className="absolute -inset-1 bg-blue-500/40 rounded-full blur-md opacity-20 group-hover:opacity-100 transition-opacity duration-500 will-change-[opacity,filter]"></div>

                    <motion.button
                        whileHover={{ y: -4 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        onClick={() => navigate('/contact')}
                        className="relative px-12 py-5 rounded-full font-black text-xl border border-blue-600 text-blue-600 bg-transparent hover:bg-blue-600 hover:text-white transition-colors duration-300 flex items-center justify-center min-w-[240px] z-10 will-change-transform uppercase tracking-widest"
                    >
                        Lancer un projet
                    </motion.button>
                </div>
            </motion.div>

            {/* Decorative background lines */}
            <div className="absolute top-1/2 left-0 w-full h-[60vh] -translate-y-1/2 pointer-events-none opacity-[0.25]">
                <div
                    className="absolute inset-0 bg-gradient-to-br from-[#0075FF] to-[#f336f0]"
                    style={{
                        maskImage: `
                            linear-gradient(#000 2px, transparent 2px), 
                            linear-gradient(90deg, #000 2px, transparent 2px),
                            linear-gradient(#000 1px, transparent 1px), 
                            linear-gradient(90deg, #000 1px, transparent 1px)
                        `,
                        maskSize: '200px 200px, 200px 200px, 40px 40px, 40px 40px',
                        maskPosition: '0 -50px, 0 -50px, 0 -50px, 0 -50px',
                        WebkitMaskImage: `
                            linear-gradient(#000 2px, transparent 2px), 
                            linear-gradient(90deg, #000 2px, transparent 2px),
                            linear-gradient(#000 1px, transparent 1px), 
                            linear-gradient(90deg, #000 1px, transparent 1px)
                        `,
                        WebkitMaskSize: '200px 200px, 200px 200px, 40px 40px, 40px 40px',
                        WebkitMaskPosition: '0 -50px, 0 -50px, 0 -50px, 0 -50px'
                    }}
                />
            </div>
        </section>
    );
};
