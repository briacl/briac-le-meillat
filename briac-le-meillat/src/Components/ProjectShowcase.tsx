import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Github } from 'lucide-react';

export default function ProjectShowcase() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Parallax effect for the image background
    const yImage = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

    return (
        <section id="atelier-section" ref={containerRef} className="w-full py-32 flex flex-col items-center justify-center relative z-10 bg-black/50 backdrop-blur-sm">
            
            <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-6xl text-[#0055ff] font-['Paris2024'] tracking-widest text-center mb-24 drop-shadow-lg"
            >
                L'ATELIER
            </motion.h2>

            <div className="w-[85vw] max-w-7xl h-[60vh] md:h-[70vh] rounded-3xl overflow-hidden relative group border border-white/10 shadow-[0_0_40px_rgba(0,85,255,0.1)]">
                {/* Background Image with Parallax */}
                <motion.div 
                    style={{ y: yImage }}
                    className="absolute inset-[calc(-20%)] -z-10 bg-[#0a0a0a]"
                >
                    {/* Placeholder for the mockup since we don't have the explicit image path, using a stylized placeholder */}
                    <div className="w-full h-full flex items-center justify-center opacity-30">
                        <pre className="text-[#00f2ff] font-mono text-sm md:text-xl p-8 transform -rotate-12 select-none leading-relaxed tracking-widest">
{`[ FRAME BEGIN ]
01000101 01110100 01101000
    [ ETHERNET HEADER ]
      [ IP HEADER ]
        [ TCP HEADER ]
          [ DATA PAYLOAD ]
          > ANALYZING PACKET...
          > ENCAPSULATION REVEALED
[ FRAME END ]`}
                        </pre>
                    </div>
                </motion.div>

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-8 md:p-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="max-w-4xl"
                    >
                        <h3 className="text-3xl md:text-5xl font-['Montserrat_Alternates'] font-bold text-white mb-6 tracking-tight">
                            L'Analyseur d'Encapsulation
                        </h3>
                        <p className="text-xl md:text-2xl text-gray-300 font-serif font-['Baskerville'] italic mb-10 leading-relaxed">
                            "Donner un visage à la donnée. Visualiser le voyage d'un paquet à travers les couches OSI."
                        </p>
                        
                        <a 
                            href="https://github.com/briacl/reseau" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-black border border-white/30 text-white font-mono text-sm uppercase tracking-widest hover:bg-white hover:text-black hover:border-white transition-all duration-300 group/btn"
                        >
                            <Github className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                            <span>Voir sur GitHub</span>
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
