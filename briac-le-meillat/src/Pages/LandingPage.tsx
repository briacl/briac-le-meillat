import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import Newsbar from '@/Components/Newsbar';
import ManifestoSection from '@/Components/ManifestoSection';
import BlueprintFoundation from '@/Components/BlueprintFoundation';
import { PillarCard, pillars, sharedStyles } from '@/Components/TheToolset';
import {
    ShowcaseWillkommen,
    ShowcaseReseau,
    ShowcaseLyrae,
    TheCoreHeader,
    FinalCTA,
} from '@/Components/ArchitectSpecs';
import NeuralNetworkBackground from '@/Components/NeuralNetworkBackground';
import FieldNotes from '@/Components/FieldNotes';
import UnifiedFooter from '@/Components/UnifiedFooter';

/* ── Séparateur de pilier — carte centrée avant chaque showcase ── */
function PilierBridge({ index }: { index: number }) {
    const pillar = pillars[index];
    if (!pillar) return null;
    return (
        <>
            <style>{sharedStyles}</style>
            <section className="w-full py-32 flex flex-col items-center justify-center bg-black overflow-hidden relative">
                {/* Halo de fond */}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background: `radial-gradient(ellipse at 50% 60%, ${pillar.auraColor} 0%, transparent 60%)`,
                        filter: 'blur(80px)',
                    }}
                />
                <div className="relative z-10 w-full max-w-sm mx-auto px-6">
                    <PillarCard pillar={pillar} index={0} />
                </div>
            </section>
        </>
    );
}

export default function LandingPage() {
    useEffect(() => {
        document.title = 'Briac Le Meillat';
    }, []);

    const { scrollY } = useScroll();
    const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
    const blurValue = useTransform(scrollY, [0, 300], [0, 10]);
    const heroBlur = useTransform(blurValue, v => `blur(${v}px)`);

    return (
        <div className="relative w-full min-h-screen font-sans bg-black selection:bg-blue-500 overflow-x-hidden">

            {/* Navbar fixe */}
            <div className="pointer-events-none fixed top-0 left-0 w-full flex justify-center z-[100]">
                <div className="pointer-events-auto w-full flex justify-center">
                    <Navbar />
                </div>
            </div>

            {/* Newsbar fixe */}
            <div className="fixed top-28 left-0 w-full pointer-events-auto z-[50] mix-blend-difference">
                <Newsbar />
            </div>

            <main className="relative w-full">

                {/* ── I. L'ÉMOTION — fond blanc ─────────────────────────── */}
                <div className="relative bg-white z-20">

                    {/* 1. Hero */}
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
                                    transition={{ duration: 1.2, ease: 'easeOut' }}
                                    style={{
                                        fontSize: 'clamp(3rem, 10vw, 8rem)',
                                        fontWeight: 400,
                                        letterSpacing: '-0.02em',
                                        textShadow: '0 8px 30px rgba(0,0,0,0.52)',
                                    }}
                                >
                                    Build Harmony.
                                </motion.span>
                            </h1>

                            <div
                                onClick={() => document.getElementById('manifesto-section')?.scrollIntoView({ behavior: 'smooth' })}
                                className="mt-20 border border-black/10 rounded-full w-[60px] h-[60px] flex items-center justify-center cursor-pointer transition-all duration-300 animate-bounce hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] group"
                            >
                                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-blue-500 transition-transform group-hover:scale-110">
                                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                                </svg>
                            </div>
                        </motion.div>
                    </section>

                    {/* 2. Manifesto */}
                    <div id="manifesto-section">
                        <ManifestoSection />
                    </div>
                </div>


                {/* ── II. LA RÉVÉLATION — pivot blanc → noir (scroll-driven) ── */}
                <div className="relative z-10">
                    <BlueprintFoundation />
                </div>


                {/* ── III. APPLE SILICON — Pilier → Showcase → Pilier → … ─ */}
                <div id="the-toolset" className="relative z-10 bg-black text-white">

                    {/* Pilier I — Automation & Workflow */}
                    <PilierBridge index={0} />

                    {/* Showcase 1 — willkommen_v2 */}
                    <ShowcaseWillkommen />

                    {/* Pilier II — Intelligence & Data */}
                    <PilierBridge index={1} />

                    {/* Showcase 2 — Visualisation réseau */}
                    <ShowcaseReseau />

                    {/* Pilier III — Shared Infrastructure */}
                    <PilierBridge index={2} />

                    {/* Showcase 3 — lyrae-shared */}
                    <ShowcaseLyrae />

                </div>


                {/* ── IV. LE CLIMAX & L'ARCHIVE ─────────────────────────── */}
                <div id="the-ecosystem" className="relative z-10 bg-black text-white">

                    {/* The Ecosystem header */}
                    <TheCoreHeader />

                    {/* Réseau de neurones interactif */}
                    <div id="the-core-visual" className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center">
                        <NeuralNetworkBackground className="opacity-60" />
                    </div>

                    {/* Archive complète */}
                    <div id="field-notes">
                        <FieldNotes />
                    </div>

                    {/* CTA final */}
                    <FinalCTA />

                    <UnifiedFooter />
                </div>

                <div className="h-[20vh] bg-black" />

            </main>
        </div>
    );
}
