import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import Newsbar from '@/Components/Newsbar';
import FavoriteProjects from '@/Components/FavoriteProjects';
import CertificationCards from '@/Components/CertificationCards';
import LastTpSpotlight from '@/Components/LastTpSpotlight';
import NetworkBriacSpotlight from '@/Components/NetworkBriacSpotlight';
import DeepNetworkProjects from '@/Components/DeepNetworkProjects';
import StudentShowcaseSection from '@/Components/StudentShowcaseSection';
import { FinalCTA } from '@/Components/ArchitectSpecs';
import UnifiedFooter from '@/Components/UnifiedFooter';

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
            <div className="fixed top-24 left-0 w-full pointer-events-auto z-[50] mix-blend-difference">
                <Newsbar />
            </div>

            <main className="relative w-full">

                {/* ── I. LES SPOTLIGHTS (fond blanc) ── */}
                <div className="relative z-10 bg-white">
                    <NetworkBriacSpotlight />

                    <FavoriteProjects />
                    <DeepNetworkProjects />
                    <StudentShowcaseSection />
                    <LastTpSpotlight />
                    <CertificationCards />
                </div>

                {/* ── II. SECTION SOMBRE — CTAs + Conclusion ── */}
                <div id="the-toolset" className="relative z-10 bg-black text-white">

                    {/* 
                    <div id="field-notes" className="flex flex-col items-center justify-center py-40 px-6 text-center">
                        <motion.a
                            href={`${import.meta.env.BASE_URL}blog`}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 1.2, ease: [0.21, 0.47, 0.32, 0.98] }}
                            className="group relative flex flex-col items-center justify-center w-full max-w-lg p-10 rounded-[3rem] overflow-hidden"
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05), 0 20px 40px rgba(0,0,0,0.5)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)'
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                            
                            <p className="font-['Paris2024'] text-2xl md:text-3xl text-white mb-3 tracking-wide drop-shadow-md">
                                Explorer l'Archive
                            </p>
                            <p className="text-zinc-400 font-sans text-sm mb-8 max-w-sm leading-relaxed">
                                Plongez dans les détails techniques, travaux pratiques et cas d'étude concrets.
                            </p>
                            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white group-hover:border-white/30 transition-all duration-500 transform group-hover:translate-x-1">
                                <svg viewBox="0 0 24 24" className="w-4 h-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </div>
                        </motion.a>
                    </div>
                    */}

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
                                    className="font-['Baskerville'] text-zinc-900"
                                    style={{
                                        fontSize: 'clamp(3rem, 10vw, 8rem)',
                                        fontWeight: 400,
                                        letterSpacing: '-0.02em',
                                        textShadow: '0 4px 10px rgba(0,0,0,0.05), 0 10px 20px rgba(0,0,0,0.1), 0 25px 50px rgba(0,0,0,0.15)',
                                    }}
                                >
                                    Build Harmony.
                                </span>
                            </h1>
                        </motion.div>
                    </section>

                    <UnifiedFooter />
                </div>

            </main>
        </div>
    );
}
