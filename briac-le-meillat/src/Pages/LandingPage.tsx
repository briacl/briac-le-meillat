import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import Newsbar from '@/Components/Newsbar';
import ManifestoSection from '@/Components/ManifestoSection';
import LastProjectSpotlight from '@/Components/LastProjectSpotlight';
import LastTpSpotlight from '@/Components/LastTpSpotlight';
import { PillarCard, pillars, sharedStyles } from '@/Components/TheToolset';
import {
    ShowcaseWillkommen,
    ShowcaseReseau,
    ShowcaseLyrae,
    TheCoreHeader,
    FinalCTA,
} from '@/Components/ArchitectSpecs';
import NeuralNetworkBackground from '@/Components/NeuralNetworkBackground';
// import FieldNotes from '@/Components/FieldNotes';
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

                {/* ── I. LES SPOTLIGHTS (fond blanc) ── */}
                <div className="relative z-10 bg-white">
                    <LastProjectSpotlight />
                    <LastTpSpotlight />
                </div>

                {/* ── II. LE MANIFESTE (conservé mais non affiché / commenté) ── */}
                {/*
                <div id="manifesto-section" className="relative bg-white z-20">
                    <ManifestoSection />
                </div>
                */}

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

                {/* ── IV. LE CLIMAX, L'ARCHIVE & LA CONCLUSION ─────────────────────────── */}
                <div id="the-ecosystem" className="relative z-10 bg-black text-white">

                    {/* The Ecosystem header */}
                    <TheCoreHeader />

                    {/* Réseau de neurones interactif */}
                    <div id="the-core-visual" className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center">
                        <NeuralNetworkBackground className="opacity-60" />
                    </div>

                    {/* Archive complète */}
                    <div id="field-notes" className="flex flex-col items-center justify-center py-24 px-6 text-center">
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
                            className="text-xl md:text-2xl font-sans leading-relaxed max-w-3xl mx-auto"
                        >
                            <span className="text-white">L'ensemble des travaux pratiques et compte-rendus</span>{' '}
                            <span className="text-zinc-400">est consultable et téléchargeable sur le </span>
                            <a
                                href="/blog"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white underline underline-offset-4 hover:text-[#0075FF] transition-colors"
                            >
                                blog →
                            </a>
                        </motion.p>
                    </div>

                    {/* CTA final */}
                    <FinalCTA />

                    {/* ── V. CONCLUSION - BUILD HARMONY (fond blanc pour un contraste premium) ── */}
                    <section className="min-h-[70vh] bg-white text-black flex flex-col items-center justify-center p-4 w-full relative z-20">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                            className="flex flex-col items-center text-center"
                        >
                            <h1 className="m-0 flex flex-col items-center select-none leading-tight z-10">
                                <span
                                    className="font-['Baskerville']"
                                    style={{
                                        fontSize: 'clamp(3rem, 10vw, 8rem)',
                                        fontWeight: 400,
                                        letterSpacing: '-0.02em',
                                        textShadow: '0 8px 30px rgba(0,0,0,0.12)',
                                    }}
                                >
                                    Build Harmony.
                                </span>
                            </h1>
                        </motion.div>
                    </section>

                    <UnifiedFooter />
                </div>

                <div className="h-[20vh] bg-black" />

            </main>
        </div>
    );
}
