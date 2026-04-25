import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import Newsbar from '@/Components/Newsbar';
import NeuralNetworkBackground from '@/Components/NeuralNetworkBackground';
import ManifestoSection from '@/Components/ManifestoSection';
import FluxLabSection from '@/Components/FluxLabSection';
import TheFoundation from '@/Components/TheFoundation';
import BlueprintTransition from '@/Components/BlueprintTransition';
import { PureStructure, CodePoetics, LogicAsCanvas, FinalCTA, TheCoreHeader } from '@/Components/ArchitectSpecs';
import TheToolset from '@/Components/TheToolset';
import NexusCollection from '@/Components/NexusCollection';
import FieldNotes from '@/Components/FieldNotes';
import UnifiedFooter from '@/Components/UnifiedFooter';

const APPLE_BEZIER = [0.21, 0.47, 0.32, 0.98];

/**
 * LandingPageTest - Restructuring for Apple-Inspired Storytelling
 * Structure in 4 Movements
 */
export default function LandingPage() {
    useEffect(() => {
        document.title = "Nexus • Build Harmony";
    }, []);

    const { scrollY } = useScroll();

    // Hero Animations
    const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
    const blurValue = useTransform(scrollY, [0, 300], [0, 10]);
    const heroBlur = useTransform(blurValue, v => `blur(${v}px)`);

    return (
        <div className="relative w-full min-h-screen font-sans bg-black selection:bg-blue-500 overflow-x-hidden">

            {/* FIXED Navbar */}
            <div className="pointer-events-none fixed top-0 left-0 w-full flex justify-center z-[100]">
                <div className="pointer-events-auto w-full flex justify-center">
                    <Navbar />
                </div>
            </div>

            {/* FIXED Newsbar */}
            <div className="fixed top-28 left-0 w-full pointer-events-auto z-[50] mix-blend-difference">
                <Newsbar />
            </div>

            <main className="relative w-full">

                {/* ──────────────────────────────────────────────────────────── */}
                {/* MOUVEMENT I : L'ÉMOTION (Le Monde Blanc)                     */}
                {/* ──────────────────────────────────────────────────────────── */}
                <div className="relative bg-white z-20">

                    {/* 1. HERO SECTION */}
                    <section className="min-h-screen flex flex-col items-center justify-center p-4 w-full relative">
                        <motion.div
                            style={{ opacity: heroOpacity, filter: heroBlur }}
                            className="flex flex-col items-center text-center text-black translate-y-[5vh]"
                        >
                            <h1 className="m-0 flex flex-col items-center select-none leading-tight z-10">
                                <motion.span
                                    className="font-['Baskerville']"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1.2, ease: "easeOut" }}
                                    style={{
                                        fontSize: 'clamp(3rem, 10vw, 8rem)',
                                        fontWeight: 400,
                                        letterSpacing: '-0.02em',
                                        textShadow: '0 8px 30px rgba(0, 0, 0, 0.52)'
                                    }}
                                >
                                    Build Harmony.
                                </motion.span>
                            </h1>

                            <div
                                onClick={() => document.getElementById('manifesto-section')?.scrollIntoView({ behavior: 'smooth' })}
                                className="mt-20 border border-white/10 rounded-full w-[60px] h-[60px] flex items-center justify-center cursor-pointer transition-all duration-300 animate-bounce hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] group"
                            >
                                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-blue-500 transition-transform group-hover:scale-110">
                                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                                </svg>
                            </div>
                        </motion.div>
                    </section>

                    {/* 2. MANIFESTO */}
                    <div id="manifesto-section">
                        <ManifestoSection />
                    </div>

                    {/* 3. FLUX LAB (Light variant) */}
                    <div className="pb-32">
                        <FluxLabSection isLight={true} />
                    </div>
                </div>


                {/* ──────────────────────────────────────────────────────────── */}
                {/* MOUVEMENT II : LA RÉVÉLATION DE L'INGÉNIERIE (Le Pivot)      */}
                {/* ──────────────────────────────────────────────────────────── */}
                <div className="relative z-10 bg-black">

                    {/* 4. BLUEPRINT TRANSITION (White to Dark Pivot) */}
                    <div className="bg-white">
                        <BlueprintTransition />
                    </div>

                    {/* 5. PURE STRUCTURE */}
                    <div className="text-white">
                        <PureStructure />
                    </div>

                    {/* 6. THE FOUNDATION (Academic Background) */}
                    <TheFoundation />
                </div>


                {/* ──────────────────────────────────────────────────────────── */}
                {/* MOUVEMENT III : THE TOOLSET (Les Instruments)               */}
                {/* ──────────────────────────────────────────────────────────── */}
                <div id="the-toolset" className="relative z-10 bg-black text-white">

                    {/* 7. THE TOOLSET — 3 piliers de projets personnels */}
                    <TheToolset />

                </div>


                {/* ──────────────────────────────────────────────────────────── */}
                {/* MOUVEMENT IV : L'EXPLORATION (L'Infini)                      */}
                {/* ──────────────────────────────────────────────────────────── */}
                <div id="the-ecosystem" className="relative z-10 bg-black text-white min-h-screen">

                    {/* 8. CODE POETICS & LOGIC AS CANVAS — Humanisation des projets */}
                    <CodePoetics />
                    <LogicAsCanvas />

                    {/* 9. NEXUS COLLECTION — Vitrine des produits finis */}
                    {/* <NexusCollection /> */}

                    {/* 10. THE CORE HEADER */}
                    <TheCoreHeader />

                    {/* 11. NEURAL NETWORK BACKGROUND (The Ecosystem Visual) */}
                    <div id="the-core-visual" className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center">
                        <NeuralNetworkBackground className="opacity-60" />
                    </div>

                    {/* 12. FIELD NOTES (Archive Finale) */}
                    <FieldNotes />

                    {/* 13. FINAL CTA */}
                    <FinalCTA />

                    {/* 14. FOOTER */}
                    <UnifiedFooter />
                </div>

                <div className="h-[20vh] bg-black"></div>

            </main>
        </div>
    );
}
