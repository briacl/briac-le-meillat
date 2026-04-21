import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/Components/Navbar';
import NeuralNetworkBackground from '@/Components/NeuralNetworkBackground';
import GlassCard from '@/Components/GlassCard';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { User, Mail, MessageSquare, Send, CheckCircle } from 'lucide-react';
import IntroCodeAnimation from '@/Components/IntroCodeAnimation';
import Typewriter from '@/Components/Typewriter';
import ManifestoSection from '@/Components/ManifestoSection';

// Lazy load heavy sections
const CVSection = React.lazy(() => import('./CVSection'));
const CollaboratorsSection = React.lazy(() => import('@/Components/CollaboratorsSection'));
const CertificationsSection = React.lazy(() => import('@/Components/CertificationsSection'));

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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!response.ok) throw new Error('Failed to send message');
            setSuccess(true);
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setSuccess(false), 5000);
        } catch (error) {
            console.error('Error sending message:', error);
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
                    <button onClick={() => setSuccess(false)} className="text-sm text-[#00f2ff] hover:underline mt-4">
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
                    <p className="text-sm text-zinc-400 text-center">Une question, un projet ? N'hésitez pas.</p>
                </div>
                <form className="w-full space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2 text-left">
                        <label className="block text-sm font-medium text-zinc-300 ml-1">Nom complet</label>
                        <div className="relative group">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-[#00f2ff] transition-colors" />
                            <input type="text" placeholder="Votre nom" value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#00f2ff]/50 focus:border-[#00f2ff]/50 sm:text-sm transition-all shadow-sm" />
                        </div>
                    </div>
                    <div className="space-y-2 text-left">
                        <label className="block text-sm font-medium text-zinc-300 ml-1">Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-[#00f2ff] transition-colors" />
                            <input type="email" placeholder="vous@exemple.com" value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#00f2ff]/50 focus:border-[#00f2ff]/50 sm:text-sm transition-all shadow-sm" />
                        </div>
                    </div>
                    <div className="space-y-2 text-left">
                        <label className="block text-sm font-medium text-zinc-300 ml-1">Message</label>
                        <div className="relative group">
                            <MessageSquare className="absolute left-3 top-4 h-5 w-5 text-zinc-500 group-focus-within:text-[#00f2ff] transition-colors" />
                            <textarea placeholder="Votre message..." rows={4} value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#00f2ff]/50 focus:border-[#00f2ff]/50 sm:text-sm transition-all shadow-sm resize-none">
                            </textarea>
                        </div>
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-black bg-gradient-to-r from-white to-gray-200 hover:to-white hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        ) : (
                            <>ENVOYER LE MESSAGE <Send className="h-4 w-4 ml-1" /></>
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

    // Hero Animations
    const heroOpacity = useTransform(scrollY, [0, 200], [1, 0]);
    const blurValue = useTransform(scrollY, [0, 200], [10, 0]);
    const heroBlur = useTransform(blurValue, v => `blur(${v}px)`);

    const explorationRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress: expProgress } = useScroll({
        target: explorationRef,
        offset: ["start center", "end center"]
    });

    // Neural Network animation based on exploration progress
    const bgOpacity = useTransform(expProgress, [0, 0.2, 0.8, 1], [0.15, 0.8, 0.8, 0.15]);
    const bgScale = useTransform(expProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95]);
    const blurObj = useTransform(expProgress, [0, 0.2, 0.8, 1], [4, 0, 0, 4]);
    const bgFilter = useTransform(blurObj, b => `blur(${b}px)`);

    const [showIntroAnimation, setShowIntroAnimation] = useState(false);
    const [animationPlayed, setAnimationPlayed] = useState(false);

    return (
        <>
        <Navbar />
        <div className="relative w-full min-h-screen font-sans text-skin-text-main bg-skin-base transition-colors duration-500">

            {/* FIXED Background - Neural Network */}
            <motion.div
                className="fixed top-0 left-0 w-full h-full z-0 pointer-events-auto"
                style={{
                    opacity: bgOpacity,
                    scale: bgScale,
                    filter: bgFilter
                }}
            >
                <NeuralNetworkBackground />
            </motion.div>

            {/* Scrollable Content Overlay */}
            <div className="relative z-10 flex flex-col items-center w-full pointer-events-none" style={{ overflowX: 'clip' }}>

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

                            {/* Small Title: a Bérangère branch */}
                            <motion.div className="mb-2 flex items-center justify-center gap-2 drop-shadow-sm z-10">
                                <motion.span
                                    className="text-black/70 dark:text-white/70"
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
                                    className="text-black/80 dark:text-white/80"
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
                                    className="text-black/70 dark:text-white/70"
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
                                    className="text-black dark:text-white"
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
                                    className="text-black dark:text-white opacity-50 font-sans"
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
                                    className="text-xl tracking-wide text-black dark:text-white font-['Baskerville']"
                                />
                            </div>

                            <a
                                href="#manifesto-section"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById('manifesto-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }}
                                className="mt-16 bg-transparent border border-[#0075FF]/50 rounded-full w-[50px] h-[50px] flex items-center justify-center cursor-pointer transition-all duration-300 animate-bounce hover:border-[#0075FF] hover:bg-[#0075FF]/10 hover:shadow-[0_0_15px_rgba(0,117,255,0.3)]"
                            >
                                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#0075FF]">
                                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* SPACER for Background Interaction */}
                <div id="neural-network-spacer" className="w-full relative h-0">
                    <AnimatePresence>
                        {showIntroAnimation && !animationPlayed && (
                            <motion.div
                                key="intro-animation-overlay"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, transition: { duration: 1.5, ease: "easeOut" } }}
                                exit={{ opacity: 0, transition: { duration: 2.0, ease: "easeInOut" } }}
                                className="fixed inset-0 h-screen z-40 pointer-events-auto"
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
                <div className="w-[95%] max-w-[1920px] mx-auto flex flex-col gap-0 mb-16">

                    {/* MANIFESTO SECTION */}
                    <div id="manifesto-section" className="pointer-events-auto w-full">
                        <ManifestoSection />
                    </div>

                    {/* EXPLORATION SECTION (Neural Network interaction zone) */}
                    <div id="exploration-section" ref={explorationRef} className="h-screen w-full relative z-10 pointer-events-none">
                        {/* The NeuralNetworkBackground stays underneath */}
                    </div>

                    {/* CV SECTION */}
                    <div id="cv-section" className="min-h-[50vh] flex items-center justify-center pointer-events-auto w-full z-10">
                        <Suspense fallback={<div className="text-white text-center">Chargement du CV...</div>}>
                            <CVSection />
                        </Suspense>
                    </div>

                    {/* CERTIFICATIONS SECTION */}
                    <div id="certifications-section" className="w-full pointer-events-auto z-10 mt-32">
                        <Suspense fallback={<div className="h-[400px] w-full flex items-center justify-center text-skin-text-main/50">Chargement des certifications...</div>}>
                            <CertificationsSection />
                        </Suspense>
                    </div>

                    {/* COLLABORATORS SECTION */}
                    <div id="collaborators-section" className="min-h-[50vh] flex items-center justify-center pointer-events-auto w-full z-10 mt-32">
                        <Suspense fallback={<div className="text-white text-center">Chargement des collaborateurs...</div>}>
                            <CollaboratorsSection />
                        </Suspense>
                    </div>

                    {/* CONTACT SECTION */}
                    <div id="contact-section" className="min-h-[50vh] flex items-center justify-center pointer-events-auto w-full z-10 bg-black/50 py-32 backdrop-blur-sm mt-32">
                        <ContactForm />
                    </div>

                </div>

            </div>

            <footer className="relative z-10 bg-[#050a14] text-white py-12 text-center border-t border-white/10 font-['Inter']">
                <div className="flex justify-center gap-6">
                    <Link to="/devop" className="text-gray-500 hover:text-[#00f2ff] transition-colors tracking-widest uppercase text-sm">
                        devop
                    </Link>
                    <Link to="/admin" className="text-gray-500 hover:text-[#00f2ff] transition-colors tracking-widest uppercase text-sm">
                        admin
                    </Link>
                </div>
            </footer>
        </div>
        </>
    );
}
