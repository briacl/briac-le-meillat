import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const TimelineNode = ({ title, subtitle }: { title: string, subtitle: string }) => {
    return (
        <div className="flex flex-col items-center justify-center w-screen h-full shrink-0 relative">
            {/* The dot on the horizontal line */}
            <motion.div 
                className="w-4 h-4 bg-[#00f2ff] rounded-full shadow-[0_0_15px_#00f2ff] mb-12 relative z-10"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ amount: 0.5 }}
                transition={{ type: "spring", bounce: 0.5, duration: 1 }}
            />
            
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.5 }}
                transition={{ type: "spring", bounce: 0.4, duration: 1.2, delay: 0.2 }}
                className="flex flex-col items-center"
            >
                <h3 className="text-3xl md:text-5xl font-['Paris2024'] text-white tracking-widest mb-6 px-4 text-center">
                    {title}
                </h3>
                <p className="text-xl md:text-2xl text-gray-400 font-serif italic font-['Baskerville'] drop-shadow-md text-center px-4 max-w-2xl leading-relaxed">
                    {subtitle}
                </p>
            </motion.div>
        </div>
    );
};

export default function HorizontalTimeline() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    // 4 panels = 400vw width total. We need to translate by -75% to show the last panel.
    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]); 

    return (
        <section id="fondation-section" ref={targetRef} className="relative h-[400vh] bg-transparent pointer-events-none mb-32 z-10">
            {/* Sticky container */}
            <div className="sticky top-0 h-screen flex items-center overflow-hidden pointer-events-auto bg-black/40 backdrop-blur-md border-t border-b border-white/5 shadow-2xl">
                
                {/* Horizontal straight line (optic fiber) */}
                <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00f2ff]/80 to-transparent shadow-[0_0_10px_#00f2ff] top-[calc(50%-1.5rem)]" />
                
                {/* Scrolling content */}
                <motion.div style={{ x }} className="flex h-full items-center">
                    
                    {/* Intro Panel */}
                    <div className="flex flex-col items-center justify-center w-screen h-full shrink-0">
                        <motion.h2 
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="text-5xl md:text-7xl text-[#0055ff] font-['Paris2024'] tracking-widest text-center px-4 drop-shadow-lg"
                        >
                            LA FONDATION
                        </motion.h2>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="mt-12 text-white/50 font-['Montserrat_Alternates'] tracking-widest uppercase text-sm flex items-center gap-4"
                        >
                            <span>Scrollez pour explorer</span>
                            <span className="animate-bounce-horizontal">→</span>
                        </motion.div>
                    </div>

                    <TimelineNode 
                        title="IUT de Béthune" 
                        subtitle="« Apprivoiser la couche physique pour libérer la création. »" 
                    />

                    <TimelineNode 
                        title="Architecture Net" 
                        subtitle="Focus sur les VLAN, le Routage et la commutation. La Solidité." 
                    />

                    <TimelineNode 
                        title="Services & Cyber" 
                        subtitle="DNS, DHCP, SSH et certification ANSSI. La Sécurité." 
                    />

                </motion.div>
            </div>
            
            <style>
                {`
                @keyframes bounceHorizontal {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(10px); }
                }
                .animate-bounce-horizontal {
                    animation: bounceHorizontal 2s infinite;
                }
                `}
            </style>
        </section>
    );
}
