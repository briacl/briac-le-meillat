import React, { useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/Components/Navbar';
import NeuralNetworkBackground from '@/Components/NeuralNetworkBackground';
import GlassCard from '@/Components/GlassCard';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { User, Mail, MessageSquare, Send, CheckCircle } from 'lucide-react';
import IntroCodeAnimation from '@/Components/IntroCodeAnimation';

// Lazy load heavy sections
const CVSection = React.lazy(() => import('./CVSection'));
const CodeExamplesSection = React.lazy(() => import('@/Components/CodeExamplesSection'));
const CollaboratorsSection = React.lazy(() => import('@/Components/CollaboratorsSection'));
const SkillsAnalysisSection = React.lazy(() => import('@/Components/SkillsAnalysisSection'));
const CertificationsSection = React.lazy(() => import('@/Components/CertificationsSection'));

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

const ContactForm = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const API_URL = 'http://localhost:8001/api';

    const handleSubmit = async (e: React.FormEvent | React.MouseEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            setSuccess(true);
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setSuccess(false), 5000);
        } catch (error) {
            console.error('Error sending message:', error);
            // alert("Erreur lors de l'envoi du message.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <GlassCard className="w-full max-w-[500px]">
                <div className="text-center py-6 space-y-6 animate-scale-in w-full">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="h-10 w-10 text-green-400" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Message envoyé !</h3>
                        <p className="text-zinc-400">Je vous répondrai dès que possible.</p>
                    </div>
                    <button
                        onClick={() => setSuccess(false)}
                        className="text-sm text-[#00f2ff] hover:underline mt-4"
                    >
                        Envoyer un autre message
                    </button>
                </div>
            </GlassCard>
        );
    }

    return (
        <div className="w-full flex flex-col items-center">
            <GlassCard className="w-full max-w-[500px] !p-10 !rounded-3xl border border-white/5 bg-black/20 backdrop-blur-xl">
                <div className="w-full flex flex-col items-center mb-8">
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Contactez-moi</h2>
                    <p className="text-sm text-zinc-400 text-center">
                        Une question, un projet ? N'hésitez pas.
                    </p>
                </div>

                <form className="w-full space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2 text-left">
                        <label className="block text-sm font-medium text-zinc-300 ml-1">Nom complet</label>
                        <div className="relative group">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-[#00f2ff] transition-colors" />
                            <input
                                type="text"
                                placeholder="Votre nom"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#00f2ff]/50 focus:border-[#00f2ff]/50 sm:text-sm transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 text-left">
                        <label className="block text-sm font-medium text-zinc-300 ml-1">Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-[#00f2ff] transition-colors" />
                            <input
                                type="email"
                                placeholder="vous@exemple.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#00f2ff]/50 focus:border-[#00f2ff]/50 sm:text-sm transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 text-left">
                        <label className="block text-sm font-medium text-zinc-300 ml-1">Message</label>
                        <div className="relative group">
                            <MessageSquare className="absolute left-3 top-4 h-5 w-5 text-zinc-500 group-focus-within:text-[#00f2ff] transition-colors" />
                            <textarea
                                placeholder="Votre message..."
                                rows={4}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#00f2ff]/50 focus:border-[#00f2ff]/50 sm:text-sm transition-all shadow-sm resize-none"
                            ></textarea>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-black bg-gradient-to-r from-white to-gray-200 hover:to-white hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        ) : (
                            <>
                                ENVOYER LE MESSAGE <Send className="h-4 w-4 ml-1" />
                            </>
                        )}
                    </button>
                </form>
            </GlassCard>
        </div>
    );
};

export default function LandingPage() {
    useEffect(() => {
        document.title = "briac-le-meillat - App Sécurisée";
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
                                href="#cv-section"
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

                {/* SECTIONS Container Part 1 - Vision */}
                <div className="w-11/12 max-w-7xl flex flex-col gap-32 mb-32">




                    {/* CV SECTION */}
                    <div id="cv-section" className="min-h-[50vh] flex items-center justify-center">
                        <Suspense fallback={<div className="text-white text-center">Chargement du CV...</div>}>
                            <CVSection />
                        </Suspense>
                    </div>

                    {/* VISION SECTION */}
                    <div id="vision-section" className="min-h-[50vh] flex items-center justify-center">
                        <GlassCard className="w-full">
                            <h2 className="text-[3rem] mb-8 text-[#0055ff] font-['Paris2024']">VISION</h2>
                            <p className="max-w-[800px] text-center leading-[1.6] text-[1.1rem] text-skin-text-main font-['Montserrat_Alternates']">
                                Curieux de nature, je m’intéresse à de nombreux domaines liés à l’informatique, aux réseaux et à l’intelligence artificielle.
                                J’aime comprendre comment les choses fonctionnent, aller au-delà de la simple utilisation des outils et explorer leurs limites.
                                Chaque projet est pour moi une opportunité d’apprendre, d’expérimenter et de progresser.
                                Je m’investis avec sérieux et persévérance, en cherchant toujours à améliorer, approfondir et faire évoluer mes réalisations, aussi bien sur le plan technique que méthodologique.
                                Ma motivation principale est de construire des projets solides et cohérents, tout en développant mes compétences et ma vision globale des systèmes informatiques et réseaux.
                                Je considère l’apprentissage comme un processus continu, où chaque défi contribue à me faire grandir, autant en tant que développeur qu’en tant que futur professionnel.
                            </p>
                        </GlassCard>
                    </div>

                </div>


                {/* CERTIFICATIONS SECTION */}
                <div id="certifications-section" className="w-11/12 max-w-7xl mb-32">
                    <Suspense fallback={<div className="h-[400px] w-full flex items-center justify-center text-skin-text-main/50">Chargement des certifications...</div>}>
                        <CertificationsSection />
                    </Suspense>
                </div>

                {/* SKILLS ANALYSIS SECTION - WIDER CONTAINER */}
                <div id="skills-analysis-section" className="w-11/12 max-w-7xl mb-32">
                    <Suspense fallback={<div className="h-[400px] w-full flex items-center justify-center text-skin-text-main/50">Chargement de l'analyse...</div>}>
                        <SkillsAnalysisSection />
                    </Suspense>
                </div>

                {/* SECTIONS Container Part 2 - Rest of content */}
                <div className="w-11/12 max-w-7xl pb-24 flex flex-col gap-32">




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
                        <ContactForm />
                    </div>
                </div>

            </div>


            <footer className="relative z-10 bg-[#050a14] text-white py-12 text-center border-t border-white/10 font-['Inter']">
                <Link to="/devop" className="text-gray-500 hover:text-[#00f2ff] transition-colors tracking-widest uppercase text-sm">
                    devop
                </Link>
            </footer>
        </div >
    );
}
