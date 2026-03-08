import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import NeuralNetworkBackground from '../Components/NeuralNetworkBackground';
import Navbar from '../Components/Navbar';
import GlassCard from '../Components/GlassCard';

interface Item {
    id: string;
    title: string;
    description: string;
    date: string;
    link: string;
}

const researches: Item[] = [
    {
        id: '1',
        title: "L'optimisation des réseaux de neurones",
        description: "Une exploration approfondie des techniques modernes d'optimisation dans l'apprentissage profond, incluant les méthodes de descente de gradient stochastique et leurs variantes adaptatives.",
        date: "2024",
        link: "/recherches/optimisation-neurones"
    },
    {
        id: '2',
        title: "L'impact de l'IA sur la médecine prédictive",
        description: "Analyse des algorithmes de classification utilisés pour le diagnostic précoce des maladies chroniques à partir de données patient anonymisées.",
        date: "2023",
        link: "/recherches/ia-medecine"
    }
];

export default function Research() {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-skin-base text-skin-text-main font-sans selection:bg-blue-500/30 relative overflow-hidden">
            <Navbar />
            <NeuralNetworkBackground />

            <div className="relative z-10 w-[95%] max-w-[1920px] mx-auto pt-32 pb-20">
                <GlassCard className="w-full !items-stretch !text-left !p-8 md:!p-12 border-white/10 bg-black/40 backdrop-blur-xl">
                    <header className="mb-12 text-center w-full">
                        <h1 className="font-['Paris2024'] text-5xl md:text-7xl bg-gradient-to-br from-[#0075FF] to-[#f336f0] bg-clip-text text-transparent mb-6">
                            RECHERCHES
                        </h1>
                        <p className="font-['Baskerville'] text-xl max-w-2xl mx-auto text-skin-text-secondary italic">
                            "La recherche est ce que je fais quand je ne sais pas ce que je fais." - Wernher von Braun
                        </p>
                    </header>

                    <div className="max-w-6xl mx-auto space-y-6 w-full">
                        <AnimatePresence mode="wait">
                            {researches.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="group"
                                >
                                    <div
                                        className={`
                                            bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden
                                            transition-all duration-300 hover:border-[#00f2ff]/30 hover:shadow-[0_0_20px_rgba(0,242,255,0.1)]
                                            ${expandedId === item.id ? 'bg-white/10 border-[#00f2ff]/30' : ''}
                                        `}
                                    >
                                        <button
                                            onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                                            className="w-full px-8 py-6 flex items-center justify-between text-left"
                                        >
                                            <div>
                                                <h3 className="font-['Paris2024'] text-2xl mb-2 group-hover:text-[#00f2ff] transition-colors">
                                                    {item.title}
                                                </h3>
                                                <span className="text-sm text-skin-text-secondary font-mono">
                                                    {item.date}
                                                </span>
                                            </div>
                                            <ChevronDown
                                                className={`w-6 h-6 text-[#00f2ff] transition-transform duration-300 ${expandedId === item.id ? 'rotate-180' : ''}`}
                                            />
                                        </button>

                                        <AnimatePresence>
                                            {expandedId === item.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <div className="px-8 pb-8 pt-2 border-t border-white/5">
                                                        <p className="font-['Baskerville'] text-lg text-skin-text-secondary mb-6 leading-relaxed">
                                                            {item.description}
                                                        </p>
                                                        <Link
                                                            to={item.link}
                                                            className="inline-flex items-center gap-2 text-[#00f2ff] hover:text-[#0055ff] transition-colors font-['Paris2024'] uppercase tracking-wider text-sm group/link"
                                                        >
                                                            Lire la suite
                                                            <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                                                        </Link>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
