import React, { useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/Components/Navbar';
import NeuralNetworkBackground from '@/Components/NeuralNetworkBackground';
import GlassCard from '@/Components/GlassCard';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import IntroCodeAnimation from '@/Components/IntroCodeAnimation';

// Lazy load heavy sections
const CVSection = React.lazy(() => import('./CVSection'));
const CodeExamplesSection = React.lazy(() => import('@/Components/CodeExamplesSection'));
const CollaboratorsSection = React.lazy(() => import('@/Components/CollaboratorsSection'));

// Typewriter Component
const Typewriter = ({ text, delay = 0 }: { text: string | string[], delay?: number }) => {
    const [displayedText, setDisplayedText] = useState<string[]>(Array.isArray(text) ? Array(text.length).fill("") : [""]);
    const [currentIndex, setCurrentIndex] = useState<{ line: number, char: number }>({ line: 0, char: 0 });
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setStarted(true), delay * 1000);
        return () => clearTimeout(timeout);
    }, [delay]);

    useEffect(() => {
        if (!started) return;

        const lines = Array.isArray(text) ? text : [text];

        if (currentIndex.line >= lines.length) return;

        const currentLineText = lines[currentIndex.line];

        if (currentIndex.char < currentLineText.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => {
                    const newLines = [...prev];
                    newLines[currentIndex.line] = currentLineText.slice(0, currentIndex.char + 1);
                    return newLines;
                });
                setCurrentIndex(prev => ({ ...prev, char: prev.char + 1 }));
            }, 50); // Typing speed
            return () => clearTimeout(timeout);
        } else {
            // Move to next line
            if (currentIndex.line < lines.length - 1) {
                const timeout = setTimeout(() => {
                    setCurrentIndex(prev => ({ line: prev.line + 1, char: 0 }));
                }, 300); // Pause between lines
                return () => clearTimeout(timeout);
            }
        }
    }, [currentIndex, text, started]);

    return (
        <div className="font-['Paris2024'] text-[1.2rem] tracking-[4px] text-skin-text-main mt-4 leading-normal text-center min-h-[3.6rem]">
            {displayedText.map((line, i) => (
                <React.Fragment key={i}>
                    <span>
                        {line}
                        {/* Show cursor on the active line, or keep it on the last line when finished */}
                        {(i === currentIndex.line || (i === displayedText.length - 1 && currentIndex.line >= displayedText.length)) && (
                            <motion.span
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                className="inline-block w-[2px] h-[1.2rem] bg-[#0055ff] ml-1 align-middle"
                            />
                        )}
                    </span>
                    {(i < displayedText.length - 1) && <br />}
                </React.Fragment>
            ))}
        </div>
    );
};

export default function LandingPage() {
    useEffect(() => {
        document.title = "Synapseo - App Sécurisée";
    }, []);

    const { scrollY } = useScroll();
    const heroOpacity = useTransform(scrollY, [0, 200], [1, 0]);
    // Control blur radius directly for better visibility
    const blurValue = useTransform(scrollY, [0, 200], [10, 0]);
    const heroBlur = useTransform(blurValue, v => `blur(${v}px)`);

    const [showIntroAnimation, setShowIntroAnimation] = useState(false);
    const [animationPlayed, setAnimationPlayed] = useState(false);

    const scrollToNext = (e: React.MouseEvent) => {
        e.preventDefault();
        const nextSection = document.getElementById('neural-network-spacer');
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (!animationPlayed) {
                // Determine when to start animation - maybe after a small delay for scroll
                setTimeout(() => setShowIntroAnimation(true), 800);
            }
        }
    };

    return (
        <div className="relative w-full min-h-screen font-sans text-skin-text-main bg-skin-base transition-colors duration-500">
            <Navbar />

            {/* FIXED Background */}
            <div className="fixed top-0 left-0 w-full h-full z-0">
                <NeuralNetworkBackground />
            </div>

            {/* Scrollable Content Overlay */}
            <div className="relative z-10 flex flex-col items-center w-full pointer-events-none">

                {/* HERO SECTION */}
                <div className="min-h-screen flex flex-col items-center justify-center pointer-events-none p-4">
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
                            <h1 className="font-['Paris2024'] text-[5rem] font-[200] tracking-[12px] m-0 uppercase flex flex-wrap justify-center gap-x-8 select-none drop-shadow-sm leading-tight">
                                {"Briac Le Meillat".split(" ").map((word, i) => (
                                    <motion.span
                                        key={i}
                                        className="bg-gradient-to-br from-[#00f2ff] to-[#0055ff] bg-clip-text text-transparent"
                                        initial={{ opacity: 0, filter: 'blur(10px)' }}
                                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                                        transition={{ duration: 0.8, delay: 0.2 + i * 0.3, ease: "easeOut" }}
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                            </h1>

                            <div className="my-6">
                                <Typewriter
                                    text={["ÉTUDIANT EN", "DÉVELOPPEMENT WEB, RÉSEAUX INFORMATIQUES, IA, ET TÉLÉCOMMUNICATIONS"]}
                                    delay={1.5}
                                />
                            </div>

                            <a
                                href="#vision-section"
                                onClick={scrollToNext}
                                className="mt-8 bg-transparent border-2 border-blue-400 rounded-full w-[50px] h-[50px] flex items-center justify-center cursor-pointer transition-all duration-300 animate-bounce hover:border-blue-600 hover:shadow-[0_0_15px_rgba(0,140,255,0.5)]"
                            >
                                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-blue-500">
                                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* SPACER for Background Interaction */}
                <div id="neural-network-spacer" className="min-h-[100vh] w-full relative">
                    <AnimatePresence>
                        {showIntroAnimation && !animationPlayed && (
                            <motion.div
                                key="intro-animation-overlay"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, transition: { duration: 1.5, ease: "easeOut" } }}
                                exit={{ opacity: 0, transition: { duration: 2.0, ease: "easeInOut" } }}
                                className="absolute inset-0 bottom-auto h-screen sticky top-0 z-40 pointer-events-auto"
                            >
                                <IntroCodeAnimation onComplete={() => {
                                    setAnimationPlayed(true);
                                    setShowIntroAnimation(false);
                                }} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* SECTIONS Container */}
                <div className="w-full max-w-4xl px-4 pb-24 flex flex-col gap-32">

                    {/* VISION SECTION */}
                    <div id="vision-section" className="min-h-[50vh] flex items-center justify-center">
                        <GlassCard className="w-full">
                            <h2 className="text-[3rem] mb-8 text-[#0055ff] font-['Paris2024']">VISION</h2>
                            <p className="max-w-[800px] text-center leading-[1.6] text-[1.1rem] text-white font-['Montserrat_Alternates']">
                                Curieux de nature, je m’intéresse à de nombreux domaines liés à l’informatique, aux réseaux et à l’intelligence artificielle.
                                J’aime comprendre comment les choses fonctionnent, aller au-delà de la simple utilisation des outils et explorer leurs limites.
                                Chaque projet est pour moi une opportunité d’apprendre, d’expérimenter et de progresser.
                                Je m’investis avec sérieux et persévérance, en cherchant toujours à améliorer, approfondir et faire évoluer mes réalisations, aussi bien sur le plan technique que méthodologique.
                                Ma motivation principale est de construire des projets solides et cohérents, tout en développant mes compétences et ma vision globale des systèmes informatiques et réseaux.
                                Je considère l’apprentissage comme un processus continu, où chaque défi contribue à me faire grandir, autant en tant que développeur qu’en tant que futur professionnel.
                            </p>
                        </GlassCard>
                    </div>


                    {/* CV SECTION */}
                    <div id="cv-section" className="min-h-[50vh] flex items-center justify-center">
                        <Suspense fallback={<div className="text-white text-center">Chargement du CV...</div>}>
                            <CVSection />
                        </Suspense>
                    </div>


                    {/* CODE EXAMPLES SECTION - Moved from NeuralNetworkBackground Interaction */}
                    <div id="code-examples-section">
                        <Suspense fallback={<div className="h-[400px] w-full flex items-center justify-center text-white/50">Chargement des exemples...</div>}>
                            <CodeExamplesSection />
                        </Suspense>
                    </div>

                    {/* COLLABORATORS SECTION */}
                    <div id="collaborators-section" className="min-h-[50vh] flex items-center justify-center">
                        <Suspense fallback={<div className="text-white text-center">Chargement des collaborateurs...</div>}>
                            <CollaboratorsSection />
                        </Suspense>
                    </div>

                    {/* CONTACT SECTION */}
                    <div id="contact-section" className="min-h-[50vh] flex items-center justify-center">
                        <GlassCard className="w-full">
                            <h2 className="text-[3rem] mb-8 text-[#0055ff] font-['Paris2024']">Contact</h2>
                            <form className="w-full max-w-md flex flex-col gap-4">
                                <input
                                    type="text"
                                    placeholder="Nom"
                                    className="p-3 rounded-xl bg-white/40 border border-white/50 focus:outline-none focus:ring-2 focus:ring-[#00f2ff] placeholder-gray-600"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="p-3 rounded-xl bg-white/40 border border-white/50 focus:outline-none focus:ring-2 focus:ring-[#00f2ff] placeholder-gray-600"
                                />
                                <textarea
                                    placeholder="Votre message"
                                    rows={4}
                                    className="p-3 rounded-xl bg-white/40 border border-white/50 focus:outline-none focus:ring-2 focus:ring-[#00f2ff] placeholder-gray-600"
                                ></textarea>
                                <button className="mt-4 py-3 px-8 rounded-full bg-gradient-to-r from-[#00f2ff] to-[#0055ff] text-white font-bold tracking-wider hover:shadow-lg hover:scale-105 transition-all">
                                    ENVOYER
                                </button>
                            </form>
                        </GlassCard>
                    </div>

                </div>

            </div>

            {/* Footer */}
            <footer className="relative z-10 bg-[#050a14] text-white py-12 text-center border-t border-white/10 font-['Inter']">
                <Link to="/devop" className="text-gray-500 hover:text-[#00f2ff] transition-colors tracking-widest uppercase text-sm">
                    devop
                </Link>
            </footer>
        </div >
    );
}
