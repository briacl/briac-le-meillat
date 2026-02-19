import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, FileText, FlaskConical, Lock } from 'lucide-react';
import NeuralNetworkBackground from '../Components/NeuralNetworkBackground';
import Navbar from '../Components/Navbar';
import { useAuth } from '../Contexts/AuthContext';
import articlesData from '../data/articles.json';

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

const articles: Item[] = articlesData as Item[];

export default function Research() {
    const { user, login, subscribe, hasAccessToReserved } = useAuth();
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'recherches' | 'articles'>('recherches');

    const currentItems = activeTab === 'recherches' ? researches : articles;

    // Reset expanded item when switching tabs
    React.useEffect(() => {
        setExpandedId(null);
    }, [activeTab]);

    return (
        <div className="min-h-screen bg-skin-base text-skin-text-main font-sans selection:bg-blue-500/30 relative overflow-hidden">
            <Navbar />
            <NeuralNetworkBackground />

            <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
                <div className="w-11/12 max-w-[90vw] mx-auto bg-black/30 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
                    <header className="mb-12 text-center">
                        <h1 className="font-['Paris2024'] text-5xl md:text-7xl bg-gradient-to-br from-[#00f2ff] to-[#0055ff] bg-clip-text text-transparent mb-6">
                            {activeTab === 'recherches' ? 'RECHERCHES' : 'ARTICLES'}
                        </h1>
                        <p className="font-['Baskerville'] text-xl max-w-2xl mx-auto text-skin-text-secondary italic">
                            {activeTab === 'recherches'
                                ? '"La recherche est ce que je fais quand je ne sais pas ce que je fais." - Wernher von Braun'
                                : '"Écrire, c\'est une façon de parler sans être interrompu." - Jules Renard'}
                        </p>
                    </header>

                    {/* Tabs */}
                    <div className="flex justify-center mb-12">
                        <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-full p-2 flex items-center gap-2 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
                            <button
                                onClick={() => setActiveTab('recherches')}
                                className={`
                                    relative px-6 py-2 rounded-full font-['Paris2024'] transition-all duration-300 flex items-center gap-2
                                    ${activeTab === 'recherches'
                                        ? 'bg-[#00f2ff]/20 text-[#00f2ff] shadow-[0_0_15px_rgba(0,242,255,0.3)]'
                                        : 'text-skin-text-secondary hover:text-white hover:bg-white/5'}
                                `}
                            >
                                <FlaskConical className="w-4 h-4" />
                                RECHERCHES
                            </button>
                            <button
                                onClick={() => setActiveTab('articles')}
                                className={`
                                    relative px-6 py-2 rounded-full font-['Paris2024'] transition-all duration-300 flex items-center gap-2
                                    ${activeTab === 'articles'
                                        ? 'bg-[#00f2ff]/20 text-[#00f2ff] shadow-[0_0_15px_rgba(0,242,255,0.3)]'
                                        : 'text-skin-text-secondary hover:text-white hover:bg-white/5'}
                                `}
                            >
                                <FileText className="w-4 h-4" />
                                ARTICLES
                            </button>
                            <Link
                                to="/realisations"
                                className="relative px-6 py-2 rounded-full font-['Paris2024'] transition-all duration-300 flex items-center gap-2 text-skin-text-secondary hover:text-white hover:bg-white/5"
                            >
                                <FlaskConical className="w-4 h-4" />
                                RÉALISATIONS
                            </Link>
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-6">
                        {activeTab === 'articles' && !hasAccessToReserved ? (
                            <div className="relative">
                                {/* Blurred Content Placeholder */}
                                <div className="opacity-50 blur-sm pointer-events-none select-none space-y-6" aria-hidden="true">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-8">
                                            <div className="h-8 bg-white/10 rounded w-3/4 mb-4"></div>
                                            <div className="h-4 bg-white/10 rounded w-1/2"></div>
                                        </div>
                                    ))}
                                </div>

                                {/* Locked Overlay */}
                                <div className="absolute inset-0 flex items-start justify-center pt-20 z-10">
                                    <div className="bg-black/80 backdrop-blur-xl border border-[#00f2ff]/30 p-8 rounded-3xl text-center max-w-md shadow-[0_0_50px_rgba(0,242,255,0.2)]">
                                        <div className="w-16 h-16 bg-[#00f2ff]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Lock className="w-8 h-8 text-[#00f2ff]" />
                                        </div>
                                        <h3 className="font-['Paris2024'] text-2xl text-white mb-4">
                                            Contenu Réservé
                                        </h3>
                                        <p className="font-['Baskerville'] text-skin-text-secondary mb-8">
                                            Ces articles sont exclusifs aux membres ayant souscrit à l'offre "Reserved".
                                        </p>

                                        {!user ? (
                                            <Link
                                                to="/login"
                                                className="block w-full py-3 rounded-full bg-white text-black font-['Paris2024'] hover:bg-gray-200 transition-colors mb-4"
                                            >
                                                Se Connecter
                                            </Link>
                                        ) : (
                                            <button
                                                onClick={subscribe}
                                                className="w-full py-3 rounded-full bg-[#00f2ff] text-black font-['Paris2024'] hover:bg-[#00c8d4] transition-colors shadow-[0_0_20px_rgba(0,242,255,0.4)]"
                                            >
                                                Souscrire à l'offre Reserved
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <AnimatePresence mode="wait">
                                {currentItems.map((item) => (
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
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
