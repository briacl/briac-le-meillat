import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

const Word = ({ 
    children, 
    progress, 
    range, 
    isGradient = false,
    gradientIndex = 0,
    totalGradientWords = 1
}: { 
    children: React.ReactNode, 
    progress: MotionValue<number>, 
    range: [number, number], 
    isGradient?: boolean,
    gradientIndex?: number,
    totalGradientWords?: number 
}) => {
    const opacity = useTransform(progress, range, [0.2, 1]);
    
    // Simulate continuous gradient across all words in the sentence
    const gradientStyle = isGradient ? {
        backgroundImage: 'linear-gradient(to bottom right, #0075FF, #f336f0)',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        backgroundSize: `${totalGradientWords * 100}% 100%`,
        backgroundPosition: `${totalGradientWords > 1 ? (gradientIndex * (100 / (totalGradientWords - 1))) : 0}% 0%`
    } : {};

    return (
        <span className="relative mr-3 mt-3 inline-block">
            <span className="absolute opacity-20 text-gray-500">{children}</span>
            <motion.span 
                style={{ opacity, ...gradientStyle }} 
                className={`drop-shadow-md ${!isGradient ? "text-black dark:text-white" : ""}`}
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
        offset: ["start 80%", "center center"] // Defines when the progress starts and ends
    });

    const wordsPart1 = "Pour certains, un clavier n'est qu'un outil de saisie.".split(" ");
    const wordsPart2 = "Pour moi, c'est un instrument.".split(" ");
    const allWords = [...wordsPart1, ...wordsPart2];

    return (
        <div id="manifesto-section" ref={container} className="min-h-[100vh] w-full flex flex-col items-center justify-center relative px-4 z-10">
            <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center">
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
                    transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
                    viewport={{ once: true, margin: "-20%" }}
                >
                    "Chaque ligne de code est une note, chaque projet une partition."
                </motion.p>

                <motion.p
                    className="mt-6 text-xl md:text-2xl font-serif italic text-gray-400 text-center max-w-2xl font-['Baskerville']"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0, duration: 1.2, ease: "easeOut" }}
                    viewport={{ once: true, margin: "-20%" }}
                >
                    Explorez les neurones pour découvrir mes domaines d'expérimentation, en cliquant dessus...
                </motion.p>

                <motion.a
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    viewport={{ once: true }}
                    href="#exploration-section"
                    onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('exploration-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="mt-8 bg-transparent border border-[#0075FF]/50 rounded-full w-[50px] h-[50px] flex items-center justify-center cursor-pointer transition-all duration-300 animate-bounce hover:border-[#0075FF] hover:bg-[#0075FF]/10 hover:shadow-[0_0_15px_rgba(0,117,255,0.3)]"
                >
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#0075FF]">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                    </svg>
                </motion.a>
            </div>
        </div>
    );
}
