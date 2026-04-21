import React, { useState } from 'react';
import { motion, useTransform, MotionValue, useSpring, useMotionValueEvent } from 'framer-motion';
import NodeDetailCard from './NodeDetailCard';

interface UnifiedHeryzeTransitionProps {
    progress: MotionValue<number>;
}

export const UnifiedHeryzeTransition: React.FC<UnifiedHeryzeTransitionProps> = ({ progress }) => {
    const [showCard, setShowCard] = useState(false);
    const [cardDismissed, setCardDismissed] = useState(false);

    useMotionValueEvent(progress, 'change', (v) => {
        if (v >= 0.90 && !showCard && !cardDismissed) {
            setShowCard(true);
        } else if (v < 0.85 && showCard) {
            setShowCard(false);
            setCardDismissed(false);
        } else if (v < 0.85 && cardDismissed) {
            setCardDismissed(false);
        }
    });

    // Lissage du scroll
    const smoothProgress = useSpring(progress, {
        stiffness: 40,
        damping: 20,
        restDelta: 0.001
    });

    // --- PHASE 1 : TITAN (0.00 -> 0.10) ---
    const uiOpacity = useTransform(smoothProgress, [0.05, 0.10], [1, 0]);
    const introY = useTransform(smoothProgress, [0.05, 0.10], [0, -50]);

    // --- ZOOM MOCKUP (0.10 -> 0.25) ---
    const mockupScale = useTransform(smoothProgress, [0.10, 0.25], [1, 20]);
    const mockupOpacity = useTransform(smoothProgress, [0.20, 0.25], [1, 0]);
    const blurValue = useTransform(smoothProgress, [0.15, 0.25], [0, 15]);
    const mockupBlur = useTransform(blurValue, v => `blur(${v}px)`);

    // --- PHASE 2/3 : WHITE-OUT (0.15 -> 0.57) ---
    // Reste à 1 tant que la Douchette est visible. Bascule à NOIR dès qu'elle a disparu.
    const whiteOutOpacity = useTransform(smoothProgress, [0.15, 0.25, 0.55, 0.57], [0, 1, 1, 0]);

    // --- LA DOUCHETTE EN NOIR (0.25 -> 0.55) ---
    // Douchette apparaît
    const phoneOpacity = useTransform(smoothProgress, [0.25, 0.35], [0, 1]);
    const douchetteTextScale = useTransform(smoothProgress, [0.30, 0.40], [4, 1]);
    const douchetteTextOpacity = useTransform(smoothProgress, [0.30, 0.40], [0, 1]);

    // La scène Douchette s'efface "très petite" sur le fond BLANC
    const douchetteSceneScale = useTransform(smoothProgress, [0.50, 0.55], [1, 0.01]);
    const douchetteSceneOpacity = useTransform(smoothProgress, [0.53, 0.55], [1, 0]);

    // Le Halo disparaît avec le téléphone
    const haloOpacity = useTransform(smoothProgress, [0.50, 0.55], [1, 0]);

    // --- PHASE 5 : MASQUE SÉRÉNITÉ GÉANT (0.44 -> 0.85) ---
    // ASTUCE : Sérénité est en BLANC à scale:100 → invisible sur le fond blanc de la Douchette.
    // Quand le fond blanc s'efface (0.54-0.56), le mot est en plein dézoom → magiquement révélé.
    const sereniteVisibility = useTransform(smoothProgress, [0.44, 0.45], [0, 1]);

    // Dézoom monumental (100 → 2)
    // Ne commence à rétrécir QUE quand le téléphone est parti et que le fond devient noir
    const sereniteScale = useTransform(smoothProgress, [0.57, 0.77, 0.80, 0.82], [100, 2, 2, 0.01]);
    const sereniteTextOpacity = useTransform(smoothProgress, [0.81, 0.82], [1, 0]);

    // Magic Swap : Le point apparaît à 0.82 exact
    const pointSwapOpacity = useTransform(smoothProgress, [0.81, 0.82], [0, 1]);

    // Morphing de Blanc vers Gradient (0.75 -> 0.80)
    // Reste blanc beaucoup plus longtemps pour un effet de pureté pendant le dézoom
    const sereniteWhiteOpacity = useTransform(smoothProgress, [0.75, 0.80], [1, 0]);
    const sereniteGradientOpacity = useTransform(smoothProgress, [0.75, 0.80], [0, 1]);

    // --- PHASE 6 : HANDOFF (0.83 -> 0.94) ---
    const handoffTextOpacity = useTransform(smoothProgress, [0.83, 0.86, 0.90, 0.94], [0, 1, 1, 0]); // Disparaît en douceur quand la carte Pope
    const handoffTextX = useTransform(smoothProgress, [0.85, 0.90], ["35vw", "0vw"]);
    const handoffTextY = useTransform(smoothProgress, [0.85, 0.90], ["35vh", "0vh"]);
    const handoffScale = useTransform(smoothProgress, [0.85, 0.90], [1.3, 1]);

    return (
        <section className="relative w-full h-[800vh]" style={{ overflow: 'visible' }}>
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-black">

                {/* Z-10 : L'IMAGE DE ZOOM (autônome - décalée vers le bas pour laisser espace au titre) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[10]" style={{ paddingTop: '30vh' }}>
                    <motion.img
                        src="/briac-le-meillat/img_ref/heryze-presentation.png"
                        style={{ scale: mockupScale, opacity: mockupOpacity, filter: mockupBlur, originX: 0.5, originY: 0.5 }}
                        className="w-[85vw] md:w-[70vw] lg:max-w-4xl h-auto rounded-2xl shadow-2xl border border-white/10"
                    />
                </div>

                {/* Z-20 : L'INTERFACE TITAN - Titre + Sous-titre ABOVE l'image (haut de l'écran) */}
                <div className="absolute inset-0 z-[20] pointer-events-none flex flex-col items-center justify-start pt-[14vh]">
                    <motion.div
                        style={{ opacity: uiOpacity, y: introY }}
                        className="w-full flex flex-col items-center"
                    >
                        {/* Texte en haut, centré horizontalement - ABOVE the centered image */}
                        <div className="flex flex-col items-center text-center px-4">
                            <h1 className="text-6xl md:text-8xl lg:text-9xl font-normal font-['Paris2024'] uppercase text-white leading-none tracking-tight">
                                HERYZE
                            </h1>
                            <h2 className="mt-4 text-lg md:text-2xl lg:text-3xl font-['Paris2024'] bg-gradient-to-r from-[#0075FF] to-[#f336f0] bg-clip-text text-transparent">
                                Le réseau tombe. Votre business, jamais.
                            </h2>
                        </div>
                    </motion.div>
                </div>

                {/* CALQUE WHITE-OUT INITIAL */}
                <motion.div
                    className="absolute inset-0 bg-white pointer-events-none z-[30]"
                    style={{ opacity: whiteOutOpacity }}
                />

                {/* MASQUE SÉRÉNITÉ GÉANT (Prend la place du fond à 0.45) 
                    Z-INDEX 40 pour être DERRIERE la Douchette */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-[40]"
                    style={{ opacity: sereniteVisibility }}
                >
                    <motion.div style={{ scale: sereniteScale, originX: 0.5, originY: 0.5 }} className="relative flex items-center justify-center">
                        {/* SÉRÉNITÉ BLANC (Masque principal) */}
                        <motion.h2
                            className="absolute font-['Paris2024'] tracking-tight text-5xl md:text-7xl lg:text-9xl text-white uppercase whitespace-nowrap z-[10]"
                            style={{ opacity: sereniteWhiteOpacity }}
                        >
                            <motion.span style={{ opacity: sereniteTextOpacity }}>SÉRÉNITÉ</motion.span>
                        </motion.h2>
                        {/* SÉRÉNITÉ GRADIENT */}
                        <motion.h2
                            className="absolute font-['Paris2024'] tracking-tight text-5xl md:text-7xl lg:text-9xl bg-gradient-to-r from-[#0075FF] to-[#f336f0] bg-clip-text text-transparent uppercase whitespace-nowrap z-[20]"
                            style={{ opacity: sereniteGradientOpacity }}
                        >
                            <motion.span style={{ opacity: sereniteTextOpacity }}>SÉRÉNITÉ</motion.span>
                        </motion.h2>

                        {/* LE MAGIC SWAP : POINT LUMINEUX (Z-[30]) */}
                        <motion.div
                            className="absolute w-1 h-1 bg-white rounded-full z-[30] shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                            style={{ opacity: pointSwapOpacity, scale: 1 / 0.01 }} // Annule le dézoom persistant du parent
                        />
                    </motion.div>
                </motion.div>

                {/* LA SCÈNE DOUCHETTE Z-[50] (Visible sur le White-out de 0.25 à 0.55) */}
                <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-[50]"
                    style={{ scale: douchetteSceneScale, opacity: douchetteSceneOpacity }}
                >
                    {/* L'icône est NOIRE */}
                    <motion.div
                        className="relative flex items-center justify-center mb-10 text-black"
                        style={{ opacity: phoneOpacity }}
                    >
                        {/* Halo "M1 Prism" - Émanation multicolore et rayons de lumière INTENSE */}
                        <div className="absolute inset-0 flex items-center justify-center -z-10">
                            {/* Fond diffus multicolore (Base M1) - Toujours présent */}
                            <motion.div 
                                style={{ opacity: haloOpacity }} 
                                className="absolute w-[32rem] h-[32rem] rounded-full blur-[110px]"
                                animate={{ 
                                    rotate: 360, 
                                    scale: [1, 1.05, 0.95, 1],
                                    opacity: [0.6, 0.9, 0.6] // Boosté pour être toujours intense
                                }}
                                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                style={{
                                    background: "conic-gradient(from 0deg, #ff4d4d, #f0932b, #f9cb28, #7bed9f, #2ed573, #1e90ff, #70a1ff, #a29bfe, #6c5ce7, #ff4757, #ff4d4d)"
                                }}
                            />

                            {/* Couches d'éclats colorés directionnels - Baselines plus hautes */}
                            <motion.div 
                                style={{ opacity: haloOpacity }}
                                className="absolute w-80 h-80 bg-red-500/30 blur-[80px] -translate-y-1/2" 
                                animate={{ opacity: [0.4, 0.7, 0.4] }}
                                transition={{ duration: 4, repeat: Infinity }}
                            />
                            <motion.div 
                                style={{ opacity: haloOpacity }}
                                className="absolute w-80 h-80 bg-blue-500/30 blur-[80px] translate-x-1/2" 
                                animate={{ opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                            />
                            <motion.div 
                                style={{ opacity: haloOpacity }}
                                className="absolute w-80 h-80 bg-purple-500/35 blur-[80px] translate-y-1/2" 
                                animate={{ opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 6, repeat: Infinity, delay: 0.5 }}
                            />

                            {/* Rayons de lumière (Maintien de la visibilité) */}
                            {[...Array(12)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    style={{ opacity: haloOpacity, rotate: i * 30 }}
                                    className="absolute w-[3px] h-[45vh] bg-gradient-to-t from-white/20 via-white/5 to-transparent blur-[10px] origin-bottom"
                                    animate={{ 
                                        opacity: [0.2, 0.6, 0.2], // Ne tombe jamais à 0
                                        scaleY: [0.9, 1.1, 0.9],
                                    }}
                                    transition={{ 
                                        duration: 4 + (i % 4), 
                                        repeat: Infinity, 
                                        ease: "easeInOut",
                                        delay: i * 0.3
                                    }}
                                />
                            ))}
                        </div>
                        <svg viewBox="0 0 100 200" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-48 md:w-32 md:h-64">
                            <rect x="10" y="10" width="80" height="180" rx="16" ry="16" />
                            <rect x="35" y="20" width="30" height="8" rx="4" ry="4" stroke="none" fill="black" />
                        </svg>
                    </motion.div>

                    {/* Le Texte NOIR */}
                    <motion.div
                        className="absolute text-center px-4 w-full"
                        style={{ scale: douchetteTextScale, opacity: douchetteTextOpacity }}
                    >
                        <h3 className="font-['Paris2024'] text-black text-3xl md:text-5xl lg:text-7xl">
                            Votre smartphone,<br />votre meilleure douchette.
                        </h3>
                    </motion.div>
                </motion.div>

                {/* HANDOFF TEXT */}
                <motion.div
                    className="absolute top-[8vh] md:top-[12vh] left-[5vw] md:left-[8vw] pointer-events-none z-[110]"
                    style={{ opacity: handoffTextOpacity, x: handoffTextX, y: handoffTextY, scale: handoffScale }}
                >
                    <h4 className="font-['Paris2024'] uppercase text-3xl md:text-5xl tracking-widest bg-gradient-to-r from-[#0075FF] to-[#f336f0] bg-clip-text text-transparent origin-top-left text-left drop-shadow-sm">
                        DÉVELOPPEMENT WEB
                    </h4>
                </motion.div>

                {/* LA CARTE NODE DETAIL */}
                {showCard && (
                    <NodeDetailCard
                        selectedNode="DÉVELOPPEMENT WEB"
                        onClose={() => {
                            setShowCard(false);
                            setCardDismissed(true);
                        }}
                    />
                )}

                {/* RETOUR EXPLORATION */}
                {cardDismissed && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="absolute bottom-12 flex flex-col items-center pointer-events-auto cursor-pointer z-[70] group"
                        onClick={() => document.getElementById('nexus-collection')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        <div className="w-10 h-10 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/10 transition-all duration-300">
                            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white flex-shrink-0 animate-bounce">
                                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                            </svg>
                        </div>
                    </motion.div>
                )}

            </div>
        </section>
    );
};

export default UnifiedHeryzeTransition;
