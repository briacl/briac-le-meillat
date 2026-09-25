import React from 'react';
import { motion } from 'framer-motion';
import { Network } from 'lucide-react';

export default function DeepNetworkProjects() {
    return (
        <section className="w-full bg-black py-24 px-6 flex justify-center border-b border-white/10">
            <div className="w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-12">
                
                {/* Colonne 1 : NotGoogle */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center group"
                >
                    {/* Image principale avec coins arrondis */}
                    <div className="w-full aspect-[4/3] rounded-[2rem] overflow-hidden bg-zinc-900 mb-8 relative border border-white/5 transition-transform duration-700 group-hover:scale-[1.02]">
                        <img 
                            src={`${import.meta.env.BASE_URL}src/assets/projects/notgoogle-visu.png`} 
                            alt="NotGoogle Interface" 
                            className="w-full h-full object-cover object-top"
                        />
                    </div>
                    
                    {/* Contenu Texte en dessous */}
                    <div className="flex flex-col items-center text-center px-4 w-full">
                        <h2 className="text-3xl md:text-4xl font-['Paris2024'] text-white mb-2 uppercase tracking-wide">
                            NOTGOOGLE
                        </h2>
                        <p className="text-lg md:text-xl text-white/70 font-['Baskerville'] italic mb-8">
                            Le navigateur, reconstruit de zéro.
                        </p>
                        
                        {/* Bouton style Contact Nexus */}
                        <div className="relative group/btn flex items-center justify-center w-fit mx-auto">
                            <div className="absolute -inset-1 bg-blue-500/40 rounded-full blur-md opacity-20 group-hover/btn:opacity-100 transition-opacity duration-500 will-change-[opacity,filter]"></div>
                            <motion.a
                                whileHover={{ y: -2 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                href="https://github.com/briacl/notgoogle"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative px-8 py-3 rounded-full font-black text-xs md:text-sm border border-[#0075FF] text-[#0075FF] bg-transparent hover:bg-[#0075FF] hover:text-white transition-colors duration-300 flex items-center justify-center min-w-[180px] z-10 uppercase tracking-widest"
                            >
                                Code source
                            </motion.a>
                        </div>
                    </div>
                </motion.div>

                {/* Colonne 2 : Visualisation réseau */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex flex-col items-center group"
                >
                    {/* Bloc "Image" avec coins arrondis et icône */}
                    <div className="w-full aspect-[4/3] rounded-[2rem] bg-zinc-900 mb-8 relative border border-white/5 flex items-center justify-center overflow-hidden transition-transform duration-700 group-hover:scale-[1.02]">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-transparent pointer-events-none" />
                        <Network size={120} className="text-[#0075FF] opacity-40 group-hover:opacity-60 transition-opacity duration-500" strokeWidth={1} />
                    </div>
                    
                    {/* Contenu Texte en dessous */}
                    <div className="flex flex-col items-center text-center px-4 w-full">
                        <h2 className="text-3xl md:text-4xl font-['Paris2024'] text-white mb-2 uppercase tracking-wide">
                            Visualisation
                        </h2>
                        <p className="text-lg md:text-xl text-white/70 font-['Baskerville'] italic mb-8">
                            L'encapsulation réseau démystifiée.
                        </p>
                        
                        {/* Bouton style Contact Nexus */}
                        <div className="relative group/btn flex items-center justify-center w-fit mx-auto">
                            <div className="absolute -inset-1 bg-blue-500/40 rounded-full blur-md opacity-20 group-hover/btn:opacity-100 transition-opacity duration-500 will-change-[opacity,filter]"></div>
                            <motion.a
                                whileHover={{ y: -2 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                href="https://github.com/briacl/reseau"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative px-8 py-3 rounded-full font-black text-xs md:text-sm border border-[#0075FF] text-[#0075FF] bg-transparent hover:bg-[#0075FF] hover:text-white transition-colors duration-300 flex items-center justify-center min-w-[180px] z-10 uppercase tracking-widest"
                            >
                                Code source
                            </motion.a>
                        </div>
                    </div>
                </motion.div>
                
            </div>
        </section>
    );
}
