import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const BlueprintTransition = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: "-20% 0px -20% 0px" });

    return (
        <section
            id="blueprint-transition"
            ref={ref}
            className="w-full min-h-screen flex items-center justify-center bg-white overflow-hidden relative z-20"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
                animate={isInView ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
                transition={{ duration: 1.5, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="text-center px-6"
            >
                <h2 className="text-6xl md:text-8xl lg:text-[12rem] font-normal tracking-tighter leading-none font-['Paris2024']">
                    <span
                        className="bg-gradient-to-r from-[#00D2FF] to-[#3a7bd5] bg-clip-text text-transparent select-none"
                        style={{ textShadow: '0 8px 30px rgba(0, 0, 0, 0.22)' }}
                    >
                        Blueprint.
                    </span>
                </h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 0.4, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="mt-8 text-black font-['Baskerville'] tracking-[0.5em] text-2xl md:text-3xl"
                    style={{ textShadow: '0 8px 30px rgba(0, 0, 0, 0.52)' }}
                >
                    From Vision to Performance.
                </motion.p>
            </motion.div>

            {/* Navigation Button to Pure Structure */}
            <div className="absolute bottom-12 left-0 w-full flex justify-center z-30">
                <motion.a
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    href="#pure-structure"
                    onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('pure-structure')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="border border-white/10 rounded-full w-[60px] h-[60px] flex items-center justify-center cursor-pointer transition-all duration-300 animate-bounce hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] group"
                >
                    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-blue-500 transition-transform group-hover:scale-110">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                    </svg>
                </motion.a>
            </div>

            {/* Refined architectural technical grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.42]">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, rgba(0, 210, 255, 0.2) 2px, transparent 2px),
                            linear-gradient(to bottom, rgba(0, 210, 255, 0.2) 2px, transparent 2px),
                            linear-gradient(to right, rgba(0, 210, 255, 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0, 210, 255, 0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px'
                    }}
                />
            </div>
        </section>
    );
};

export default BlueprintTransition;
