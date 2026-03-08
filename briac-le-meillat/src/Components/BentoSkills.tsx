import React from 'react';
import { motion } from 'framer-motion';

export default function BentoSkills() {
    return (
        <section id="maitrise-section" className="w-[95%] max-w-7xl mx-auto py-32 z-10 relative">
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-6xl text-[#0055ff] font-['Paris2024'] tracking-widest text-center mb-24 drop-shadow-lg"
            >
                LA MAÎTRISE
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
                
                {/* Card 1: Large (Span 2 cols, 1 row) */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="md:col-span-2 bg-[#0a0a0a] rounded-3xl border border-white/10 p-8 overflow-hidden relative group"
                >
                    {/* Background Code Snippet */}
                    <pre className="absolute inset-0 opacity-5 font-mono text-xs text-[#00f2ff] p-8 -z-10 group-hover:opacity-10 transition-opacity duration-700 select-none overflow-hidden">
{`def optimize_network_flow(nodes, edges):
    graph = create_adjacency_matrix(nodes, edges)
    while True:
        path = find_shortest_path(graph)
        if not path: break
        bottleneck = get_bottleneck(path)
        augment_flow(path, bottleneck)
        update_residual(graph, path, bottleneck)
    return calculate_max_flow(graph)`}
                    </pre>

                    <h3 className="text-2xl font-['Montserrat_Alternates'] font-bold text-white mb-4">L'instinct du Code</h3>
                    <p className="text-gray-400 font-serif font-['Baskerville'] italic mb-6 max-w-md">
                        Python au quotidien, immersion en C. La logique derrière l'outil.
                    </p>
                    <div className="flex gap-3 flex-wrap mt-auto absolute bottom-8">
                        <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-mono text-[#00f2ff]">Python</span>
                        <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-mono text-[#00f2ff]">C</span>
                        <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-mono text-[#00f2ff]">Bash</span>
                    </div>
                </motion.div>

                {/* Card 2: Vertical (Span 1 col, 2 rows) */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="md:row-span-2 bg-gradient-to-b from-[#0e0e0e] to-black rounded-3xl border border-white/10 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group"
                >
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    
                    <div className="w-20 h-20 rounded-full border border-white/20 flex flex-col items-center justify-center mb-8 shrink-0 group-hover:border-[#00f2ff]/50 transition-colors duration-500">
                        <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#00f2ff]/20 transition-colors duration-500" />
                    </div>

                    <h3 className="text-2xl font-['Montserrat_Alternates'] font-bold text-white mb-4">L'harmonie visuelle</h3>
                    <p className="text-gray-400 font-serif font-['Baskerville'] italic leading-relaxed">
                        L'art de simplifier l'interaction. Réduire la complexité à son essence visuelle la plus pure.
                    </p>
                    <div className="flex gap-3 flex-wrap justify-center mt-12 w-full">
                        <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/80">React</span>
                        <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/80">Tailwind css</span>
                        <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/80">HeroUI</span>
                    </div>
                </motion.div>

                {/* Card 3: Square (Span 2 cols, 1 row... wait, to form a true bento of 3 columns, the first card was 2 cols, meaning second row needs 2 cols. So Card 3 spans 2 cols on the bottom) */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="md:col-span-2 bg-black rounded-3xl border border-white/10 p-8 relative overflow-hidden flex flex-col"
                >
                    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-red-500/5 blur-[100px] rounded-full pointer-events-none" />
                    
                    <h3 className="text-2xl font-['Montserrat_Alternates'] font-bold text-white mb-4">La sécurité par défaut</h3>
                    <p className="text-gray-400 font-serif font-['Baskerville'] italic mb-6 max-w-md">
                        Assurer l'intégrité avant même d'écrire la première ligne.
                    </p>
                    
                    <div className="flex gap-4 mt-auto">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs uppercase tracking-widest text-[#00f2ff]">Implication</span>
                            <span className="font-mono text-sm text-white/80">Line 42</span>
                        </div>
                        <div className="w-[1px] h-full bg-white/10" />
                        <div className="flex flex-col gap-1">
                            <span className="text-xs uppercase tracking-widest text-[#00f2ff]">Pratique</span>
                            <span className="font-mono text-sm text-white/80">Pentesting Éthique</span>
                        </div>
                        <div className="w-[1px] h-full bg-white/10 hidden sm:block" />
                        <div className="flex flex-col gap-1 hidden sm:flex">
                            <span className="text-xs uppercase tracking-widest text-[#00f2ff]">Philosophie</span>
                            <span className="font-mono text-sm text-white/80">Zero Trust</span>
                        </div>
                    </div>
                </motion.div>
                
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-24 text-center"
            >
                <p className="text-xl md:text-2xl text-gray-400 font-serif font-['Baskerville'] italic">
                    "Une infrastructure solide ne sert à rien sans une expérience fluide."
                </p>
            </motion.div>
        </section>
    );
}
