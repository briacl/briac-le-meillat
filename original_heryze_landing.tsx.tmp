import React, { useEffect, useRef } from 'react';
import Navbar from '@/Components/Navbar';
import { motion, useScroll, useTransform } from 'framer-motion';
import NeuralNetworkBackground from '@/Components/NeuralNetworkBackground';
import ManifestoSection from '@/Components/ManifestoSection';
import Signature from '@/Components/Signature';
import Typewriter from '@/Components/Typewriter';
import NexusCollection from '@/Components/NexusCollection';
import UnifiedHeryzeTransition from '@/Components/UnifiedHeryzeTransition';

/**
 * LandingPageTest - VERSION FINALE DU HERO (SANCTUAIRE)
 * Ce code est une copie conforme du Hero de la page racine (/), 
 * adaptée exclusivement pour le Dark Mode.
 */
export default function LandingPageTest() {
    useEffect(() => {
        document.title = "Nexus • Version de Test";
    }, []);

    const { scrollY, scrollYProgress: globalScroll } = useScroll();

    // Hero Animations (Originales strictes)
    const heroOpacity = useTransform(scrollY, [0, 200], [1, 0]);
    const blurValue = useTransform(scrollY, [0, 200], [0, 10]);
    const heroBlur = useTransform(blurValue, v => `blur(${v}px)`);

    // --- CONTRÔLEUR DE LA TRANSITION HERYZE ---
    const heryzeTrackRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress: heryzeProgress } = useScroll({
        target: heryzeTrackRef,
        offset: ["start start", "end end"]
    });

    // Fond (Original)
    const bgOpacity = useTransform(globalScroll, [0.4, 0.8, 1], [0.15, 0.8, 1]);

    return (
        <>
            <Navbar />
            <div className="relative w-full min-h-screen font-sans text-white bg-black selection:bg-blue-500" style={{ overflowX: 'clip' }}>

                {/* FIXED Background - Neural Network */}
                <motion.div
                    className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
                    style={{ opacity: bgOpacity }}
                >
                    <NeuralNetworkBackground />
                </motion.div>

                <main className="relative w-full z-[10]" style={{ overflowX: 'clip' }}>

                    {/* 1. HERO SECTION (RESTAURATION STRICTE) */}
                    <div className="min-h-screen flex flex-col items-center justify-center pointer-events-none p-4 w-full">
                        <div className="relative w-full max-w-7xl mx-auto flex flex-col items-center justify-center pointer-events-auto">

                            {/* BLUR LAYER - Behind text */}
                            <motion.div
                                style={{
                                    opacity: heroOpacity,
                                    backdropFilter: heroBlur,
                                    WebkitBackdropFilter: heroBlur,
                                    maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
                                    WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)"
                                }}
                                className="absolute inset-0 -m-40 z-0"
                            />

                            {/* CONTENT LAYER */}
                            <div className="relative z-10 flex flex-col items-center justify-center text-center">

                                {/* Small Title: a Bérangère branch */}
                                <motion.div className="mb-2 flex items-center justify-center gap-2 drop-shadow-sm z-10">
                                    <motion.span
                                        className="text-white/70"
                                        style={{
                                            fontFamily: "'NeutrafaceText', 'Montserrat', sans-serif",
                                            fontWeight: 300,
                                            fontStyle: 'italic',
                                            letterSpacing: '0.15em',
                                            fontSize: 'clamp(0.8rem, 1.5vw, 1.2rem)'
                                        }}
                                        initial={{ opacity: 0, filter: 'blur(10px)' }}
                                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                                        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                                    >
                                        a
                                    </motion.span>

                                    <motion.span
                                        className="text-white/80"
                                        style={{
                                            fontFamily: "'NeutrafaceTextDemiSC', 'Montserrat', sans-serif",
                                            fontStyle: 'normal',
                                            fontSize: 'clamp(0.9rem, 1.7vw, 1.35rem)',
                                            letterSpacing: '0.2em'
                                        }}
                                        initial={{ opacity: 0, filter: 'blur(10px)' }}
                                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                                    >
                                        Bérangère
                                    </motion.span>

                                    <motion.span
                                        className="text-white/70"
                                        style={{
                                            fontFamily: "'NeutrafaceText', 'Montserrat', sans-serif",
                                            fontWeight: 300,
                                            fontStyle: 'italic',
                                            letterSpacing: '0.15em',
                                            fontSize: 'clamp(0.8rem, 1.5vw, 1.2rem)'
                                        }}
                                        initial={{ opacity: 0, filter: 'blur(10px)' }}
                                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                                        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                                    >
                                        branch
                                    </motion.span>
                                </motion.div>

                                {/* Main Title: Bérangère • Development */}
                                <h1 className="m-0 flex flex-wrap justify-center items-center gap-x-4 gap-y-2 select-none drop-shadow-sm leading-tight text-center sm:text-left z-10">
                                    <motion.span
                                        className="text-white"
                                        initial={{ opacity: 0, filter: 'blur(10px)' }}
                                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                                        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                                        style={{
                                            fontFamily: "'NeutrafaceText', 'Montserrat', sans-serif",
                                            fontWeight: 300,
                                            fontStyle: 'italic',
                                            letterSpacing: '0.42em',
                                            marginRight: '-0.42em',
                                            fontSize: 'clamp(1.8rem, 3.5vw, 3rem)'
                                        }}
                                    >
                                        Bérangère
                                    </motion.span>

                                    <motion.span
                                        className="text-white opacity-100 font-sans"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                                        style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', paddingBottom: '0.1em' }}
                                    >
                                        •
                                    </motion.span>

                                    <motion.span
                                        className="font-['Paris2024'] uppercase bg-gradient-to-br from-[#0075FF] to-[#f336f0] bg-clip-text text-transparent"
                                        initial={{ opacity: 0, filter: 'blur(10px)' }}
                                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                                        transition={{ duration: 0.8, delay: 1.0, ease: "easeOut" }}
                                        style={{
                                            letterSpacing: '0.2em',
                                            fontSize: 'clamp(1.8rem, 3.5vw, 3rem)'
                                        }}
                                    >
                                        Development
                                    </motion.span>
                                </h1>

                                <div className="mt-2 z-10">
                                    <Typewriter
                                        text="par Briac Le Meillat, étudiant de 1ère année en Réseaux et Télécommunications"
                                        delay={1.5}
                                        className="text-xl tracking-wide text-white font-['Baskerville'] italic opacity-60"
                                    />
                                </div>

                                <div
                                    onClick={() => document.getElementById('manifesto-section')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="mt-16 bg-transparent border border-[#0075FF]/50 rounded-full w-[50px] h-[50px] flex items-center justify-center cursor-pointer transition-all duration-300 animate-bounce hover:border-[#0075FF] hover:bg-[#0075FF]/10 hover:shadow-[0_0_15_rgba(0,117,255,0.3)]"
                                >
                                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#0075FF]">
                                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. MANIFESTO & SIGNATURE */}
                    <div id="manifesto-section" className="w-full">
                        <ManifestoSection />
                    </div>
                    <Signature />

                    {/* 3. CINEMATIC TRANSITION */}
                    <div ref={heryzeTrackRef} className="w-full">
                        <UnifiedHeryzeTransition progress={heryzeProgress} />
                    </div>

                    {/* 4. NEXUS COLLECTION */}
                    <NexusCollection />

                    <div className="h-[20vh] bg-black"></div>

                </main>
            </div>
        </>
    );
}
