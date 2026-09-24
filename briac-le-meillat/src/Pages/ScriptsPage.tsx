import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import UnifiedFooter from '@/Components/UnifiedFooter';
import { PillarCard, pillars, sharedStyles } from '@/Components/TheToolset';
import {
    ShowcaseWillkommen,
    ShowcaseReseau,
    ShowcaseLyrae,
} from '@/Components/ArchitectSpecs';

/* ── Carte Apple-style avant chaque showcase ── */
function PilierBridge({ index }: { index: number }) {
    const pillar = pillars[index];
    if (!pillar) return null;
    return (
        <>
            <style>{sharedStyles}</style>
            <section className="w-full py-32 flex flex-col items-center justify-center bg-black overflow-hidden relative">
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

export default function ScriptsPage() {
    useEffect(() => {
        document.title = 'Projets — Briac Le Meillat';
    }, []);

    return (
        <div className="relative w-full min-h-screen font-sans bg-black selection:bg-blue-500 overflow-x-hidden">

            {/* Navbar fixe */}
            <div className="pointer-events-none fixed top-0 left-0 w-full flex justify-center z-[100]">
                <div className="pointer-events-auto w-full flex justify-center">
                    <Navbar />
                </div>
            </div>

            <main className="relative w-full">

                {/* ── En-tête sobre ── */}
                <section className="relative flex flex-col items-center justify-end bg-black text-white pb-16 pt-40 px-6">
                    {/* Halo ambiant */}
                    <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                            background: 'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 60%)',
                        }}
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                        className="relative z-10 flex flex-col items-center text-center gap-4"
                    >
                        <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-zinc-600">
                            Projets personnels
                        </p>
                        <h1
                            className="font-['Baskerville'] text-white font-normal"
                            style={{
                                fontSize: 'clamp(2.6rem, 7vw, 6rem)',
                                letterSpacing: '-0.02em',
                                lineHeight: 1.1,
                            }}
                        >
                            Ce que j'ai construit.
                        </h1>
                        <p className="text-zinc-500 font-sans text-sm max-w-md leading-relaxed mt-2">
                            Automatisation, visualisation, infrastructure partagée —
                            trois axes de travail, trois projets qui reflètent ma façon de coder.
                        </p>
                    </motion.div>
                </section>

                {/* ── Pilier I — Automation & Workflow ── */}
                <PilierBridge index={0} />
                <ShowcaseWillkommen />

                {/* ── Pilier II — Visualisation & Outils ── */}
                <PilierBridge index={1} />
                <ShowcaseReseau />

                {/* ── Pilier III — Shared Infrastructure ── */}
                <PilierBridge index={2} />
                <ShowcaseLyrae />

                {/* ── Footer ── */}
                <UnifiedFooter />

            </main>
        </div>
    );
}
