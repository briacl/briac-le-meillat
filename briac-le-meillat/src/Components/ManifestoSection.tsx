import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

const Word = ({
    children,
    progress,
    range,
    isGradient = false,
    gradientIndex = 0,
    totalGradientWords = 0
}: {
    children: React.ReactNode,
    progress: MotionValue<number>,
    range: [number, number],
    isGradient?: boolean,
    gradientIndex?: number,
    totalGradientWords?: number
}) => {
    const opacityValue = useTransform(progress, range, [0.1, 1]);

    // Restoration of the continuous gradient logic
    const gradientStyle = isGradient ? {
        backgroundImage: 'linear-gradient(to right, #0075FF, #f336f0)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        color: 'transparent',
        backgroundSize: `${totalGradientWords * 100}% 100%`,
        backgroundPosition: `${totalGradientWords > 1 ? (gradientIndex * (100 / (totalGradientWords - 1))) : 0}% 0%`
    } : {};

    return (
        <span className="relative mr-3 mt-3 inline-block">
            <span className="absolute opacity-10 text-gray-500 select-none">{children}</span>
            <motion.span
                style={{ opacity: opacityValue, ...gradientStyle }}
                className={`inline-block drop-shadow-sm ${!isGradient ? "text-black" : ""}`}
            >
                {children}
            </motion.span>
        </span>
    );
};

export default function ManifestoSection() {
    const container = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: container,
        // "start 95%" = animation débute dès que le haut du bloc touche 95% du viewport (quasi hors écran)
        // "start 20%" = animation FINIE quand le haut du bloc est à 20% du viewport (bien avant le centre)
        offset: ["start 95%", "start 20%"]
    });

    const wordsPart1 = "Pour certains, un clavier n'est qu'un outil de saisie.".split(" ");
    const wordsPart2 = "Pour moi, c'est un instrument.".split(" ");
    const allWords = [...wordsPart1, ...wordsPart2];

    return (
        <div id="manifesto-section" ref={container} className="min-h-[100vh] w-full flex flex-col items-center justify-center relative px-4 z-10 bg-white">
            <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center">

                {/* Header Tagline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="mb-8 text-center space-y-4"
                >
                    <h2 className="text-[#0075FF]/70 font-['Paris2024'] tracking-[0.4em] uppercase text-xs font-bold">Manifeste</h2>
                    <div className="w-12 h-[1px] bg-gradient-to-r from-blue-500 to-transparent mx-auto" />
                </motion.div>

                <h2 className="text-4xl md:text-6xl lg:text-7xl font-normal flex flex-wrap justify-center text-center leading-tight font-['Paris2024'] tracking-tight">
                    {allWords.map((word, i) => {
                        const start = i / allWords.length;
                        const end = start + (1 / allWords.length);
                        const isGradient = i >= wordsPart1.length;
                        const gradientIndex = isGradient ? i - wordsPart1.length : 0;

                        return (
                            <Word
                                key={i}
                                progress={scrollYProgress}
                                range={[start, end]}
                                isGradient={isGradient}
                                gradientIndex={gradientIndex}
                                totalGradientWords={wordsPart2.length}
                            >
                                {word}
                            </Word>
                        );
                    })}
                </h2>

                <motion.p
                    className="mt-12 text-2xl md:text-3xl lg:text-4xl font-serif italic text-gray-400 text-center max-w-4xl font-['Baskerville']"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1.2 }}
                >
                    "Chaque ligne de code est une note, chaque projet une partition."
                </motion.p>

                <motion.a
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 1.0, duration: 1 }}
                    href="#flux-lab-section"
                    onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('flux-lab-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="mt-16 border border-white/10 rounded-full w-[60px] h-[60px] flex items-center justify-center cursor-pointer transition-all duration-300 animate-bounce hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] group"
                >
                    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-blue-500 transition-transform group-hover:scale-110">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                    </svg>
                </motion.a>
            </div>
        </div>
    );
}
