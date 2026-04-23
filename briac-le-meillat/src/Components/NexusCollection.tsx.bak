import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Activity, Eye, ArrowUpRight } from 'lucide-react';

const APPLE_BEZIER = [0.21, 0.47, 0.32, 0.98];

const projects = [
    {
        id: 'synapseo',
        title: 'Synapseo',
        tagline: 'Santé Humaine',
        description: 'Optimisation des flux neuronaux et monitoring biométrique avancé pour la santé connectée.',
        icon: <Activity className="text-blue-500" size={24} />,
        accent: 'rgba(0, 117, 255, 0.1)'
    },
    {
        id: 'netguardian',
        title: 'NetGuardian',
        tagline: 'Intelligence Préventive',
        description: 'Sentinelle réseau autonome capable de détecter et neutraliser les menaces avant impact.',
        icon: <Shield className="text-purple-500" size={24} />,
        accent: 'rgba(243, 54, 240, 0.1)'
    },
    {
        id: 'prism',
        title: 'Prism',
        tagline: 'Vision Universelle',
        description: 'Interface de visualisation de données multi-dimensionnelles pour une clarté absolue.',
        icon: <Eye className="text-cyan-500" size={24} />,
        accent: 'rgba(0, 204, 255, 0.1)'
    }
];

export default function NexusCollection() {
    return (
        <section id="nexus-collection" className="w-full py-32 bg-black relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                
                <div className="mb-20 space-y-4">
                    <h2 className="text-[10px] font-mono uppercase tracking-[0.5em] text-white/30">The Nexus Collection</h2>
                    <h3 className="text-4xl md:text-5xl font-['Paris2024'] text-white uppercase tracking-tight">
                        La Famille <span className="opacity-40">Nexus</span>
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: index * 0.1, ease: APPLE_BEZIER as any }}
                            viewport={{ once: true }}
                            className="group relative h-[450px] p-10 rounded-[2.5rem] bg-zinc-900/20 border border-white/5 hover:border-white/10 transition-all duration-500 flex flex-col justify-between overflow-hidden"
                            style={{ 
                                boxShadow: `0 20px 40px ${project.accent}`
                            }}
                        >
                            {/* Decorative background pulse */}
                            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] transition-opacity duration-700 opacity-20 group-hover:opacity-40" 
                                 style={{ backgroundColor: project.accent.replace('0.1', '0.4') }} />

                            <div className="space-y-6">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500">
                                    {project.icon}
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-3xl font-['Paris2024'] text-white uppercase tracking-wider">
                                        {project.title}
                                    </h4>
                                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                                        {project.tagline}
                                    </p>
                                </div>
                                <p className="text-white/60 font-['Baskerville'] italic leading-relaxed">
                                    {project.description}
                                </p>
                            </div>

                            <div className="pt-8 border-t border-white/5">
                                <button className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 group-hover:text-white transition-colors">
                                    Explorer l'unité <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
