
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, FileText, FlaskConical, Lock, Search } from 'lucide-react';
import NeuralNetworkBackground from '../Components/NeuralNetworkBackground';
import Navbar from '../Components/Navbar';
import { useAuth } from '../Contexts/AuthContext';
import { useProjects, Project } from '../Contexts/ProjectContext';
import { useTextes } from '../Contexts/TexteContext';
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

// articles const removed — now from TexteContext

const AVAILABLE_SERIES = [
    "Destins d'Alpinisme",
    "Histoire de Rire",
    "j'raconte des histoires",
    "Affaires Alpines",
    "Artistes de l'Histoire",
    "L'Histoire et ses Fautes",
    "Légendes Martitimes"
];

const TEXTES_SERIES = ["Essais"];

export default function Research() {
    const { user, login, subscribe, hasAccessToReserved, requestReservedAccess } = useAuth();
    const { projects } = useProjects();
    const { textes } = useTextes();
    const location = useLocation();
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSeries, setSelectedSeries] = useState('ALL');
    const [texteSearch, setTexteSearch] = useState('');
    const [texteSeries, setTexteSeries] = useState('ALL');
    const [accessRequestLoading, setAccessRequestLoading] = useState(false);
    const [accessRequestMessage, setAccessRequestMessage] = useState<string | null>(null);

    // Get initial tab from URL query param
    const searchParams = new URLSearchParams(window.location.search);
    const rawTab = searchParams.get('tab');
    const initialTab = (['realisations', 'textes'] as string[]).includes(rawTab ?? '') ? rawTab as 'realisations' | 'textes' : 'recherches';
    const [activeTab, setActiveTab] = useState<'recherches' | 'textes' | 'realisations'>((initialTab as any));

    // Update URL when tab changes (optional but good for navigation)
    React.useEffect(() => {
        const url = new URL(window.location.href);
        if (activeTab === 'recherches') url.searchParams.delete('tab');
        else url.searchParams.set('tab', activeTab);
        window.history.pushState({}, '', url);
    }, [activeTab]);

    // Reset expanded item when switching tabs
    React.useEffect(() => {
        setExpandedId(null);
    }, [activeTab]);

    // Filter projects logic
    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesSeries = true;
        if (selectedSeries !== 'ALL') {
            matchesSeries = project.series?.includes(selectedSeries) || false;
        }

        return matchesSearch && matchesSeries;
    });

    // Filter textes
    const filteredTextes = textes.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(texteSearch.toLowerCase()) ||
            t.description.toLowerCase().includes(texteSearch.toLowerCase());
        const matchesSeries = texteSeries === 'ALL' || t.series?.includes(texteSeries);
        return matchesSearch && matchesSeries;
    });

    const isLocked = (activeTab === 'textes' || activeTab === 'realisations') && !hasAccessToReserved;

    const handleRequestAccess = async () => {
        if (accessRequestLoading) return;
        
        try {
            setAccessRequestLoading(true);
            setAccessRequestMessage(null);
            
            const result = await requestReservedAccess();
            setAccessRequestMessage("Demande envoyée ! Vous recevrez une réponse par email.");
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Erreur lors de la demande";
            setAccessRequestMessage(errorMessage);
        } finally {
            setAccessRequestLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-skin-base text-skin-text-main font-sans selection:bg-blue-500/30 relative overflow-hidden">
            <Navbar />
            <NeuralNetworkBackground />

            <div className="relative z-10 w-[95%] max-w-[1920px] mx-auto pt-32 pb-20">
                <GlassCard className="w-full !items-stretch !text-left !p-8 md:!p-12 border-white/10 bg-black/40 backdrop-blur-xl">
                    <header className="mb-12 text-center w-full">
                        <h1 className="font-['Paris2024'] text-5xl md:text-7xl bg-gradient-to-br from-[#00f2ff] to-[#0055ff] bg-clip-text text-transparent mb-6">
                            {activeTab === 'recherches' ? 'RECHERCHES' : activeTab === 'textes' ? 'TEXTES' : 'RÉALISATIONS'}
                        </h1>
                        <p className="font-['Baskerville'] text-xl max-w-2xl mx-auto text-skin-text-secondary italic">
                            {activeTab === 'recherches'
                                ? '"La recherche est ce que je fais quand je ne sais pas ce que je fais." - Wernher von Braun'
                                : activeTab === 'textes'
                                    ? '"Écrire, c\'est une façon de parler sans être interrompu." - Jules Renard'
                                    : '"La théorie, c\'est quand on sait tout et que rien ne fonctionne. La pratique, c\'est quand tout fonctionne et que personne ne sait pourquoi." - Einstein'}
                        </p>
                    </header>

                    {/* Tabs */}
                    <div className="flex justify-center mb-12 w-full">
                        <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-full p-2 flex items-center gap-2 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex-wrap justify-center">
                            <button
                                onClick={() => setActiveTab('recherches')}
                                className={`
                                    relative px-6 py-2 rounded-full font-['Paris2024'] transition-all duration-300 flex items-center gap-2
                                    ${activeTab === 'recherches'
                                        ? 'bg-[#00f2ff]/20 text-[#00f2ff] shadow-[0_0_15px_rgba(0,242,255,0.3)]'
                                        : 'text-skin-text-secondary hover:text-white hover:bg-white/5'
                                    }
`}
                            >
                                <FlaskConical className="w-4 h-4" />
                                RECHERCHES
                            </button>
                            <button
                                onClick={() => setActiveTab('textes')}
                                className={`
                                    relative px-6 py-2 rounded-full font-['Paris2024'] transition-all duration-300 flex items-center gap-2
                                    ${activeTab === 'textes'
                                        ? 'bg-[#00f2ff]/20 text-[#00f2ff] shadow-[0_0_15px_rgba(0,242,255,0.3)]'
                                        : 'text-skin-text-secondary hover:text-white hover:bg-white/5'
                                    }
`}
                            >
                                <FileText className="w-4 h-4" />
                                TEXTES
                            </button>
                            <button
                                onClick={() => setActiveTab('realisations')}
                                className={`
                                    relative px-6 py-2 rounded-full font-['Paris2024'] transition-all duration-300 flex items-center gap-2
                                    ${activeTab === 'realisations'
                                        ? 'bg-[#00f2ff]/20 text-[#00f2ff] shadow-[0_0_15px_rgba(0,242,255,0.3)]'
                                        : 'text-skin-text-secondary hover:text-white hover:bg-white/5'
                                    }
`}
                            >
                                <FlaskConical className="w-4 h-4" />
                                RÉALISATIONS
                            </button>
                        </div>
                    </div>

                    <div className="max-w-6xl mx-auto space-y-6 w-full">
                        {isLocked ? (
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
                                            Ce contenu est exclusif aux membres ayant souscrit à l'offre "Reserved".
                                        </p>

                                        {!user ? (
                                            <Link
                                                to="/login"
                                                state={{ from: location }}
                                                className="block w-full py-3 rounded-full bg-white text-black font-['Paris2024'] hover:bg-gray-200 transition-colors mb-4"
                                            >
                                                Se Connecter
                                            </Link>
                                        ) : (
                                            <div className="space-y-4">
                                                {accessRequestMessage ? (
                                                    <div className={`p-3 rounded-lg text-sm ${
                                                        accessRequestMessage.includes('Demande envoyée') 
                                                            ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                                                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                                    }`}>
                                                        {accessRequestMessage}
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={handleRequestAccess}
                                                        disabled={accessRequestLoading}
                                                        className="w-full py-3 rounded-full bg-[#00f2ff] text-black font-['Paris2024'] hover:bg-[#00c8d4] transition-colors shadow-[0_0_20px_rgba(0,242,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {accessRequestLoading ? 'Envoi en cours...' : 'Demander l\'accès à l\'offre Reserved'}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : activeTab === 'realisations' ? (
                            <div className="space-y-8">
                                {/* Filters */}
                                <div className="flex flex-col items-center gap-6 bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 w-full">
                                    {/* Search - Placed below tabs ("sections") */}
                                    <div className="relative w-full max-w-xl mb-4">
                                        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                                        <input
                                            type="text"
                                            placeholder="Rechercher..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full bg-black/30 border border-white/10 rounded-full pl-12 pr-4 py-3 text-base text-white focus:border-[#00f2ff]/50 outline-none transition-all shadow-inner focus:bg-black/50"
                                        />
                                    </div>

                                    {/* Series Filter - Placed below search */}
                                    <div className="flex flex-wrap gap-2 justify-center w-full">
                                        <button
                                            onClick={() => setSelectedSeries('ALL')}
                                            className={`
                                                px-4 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all
                                                ${selectedSeries === 'ALL'
                                                    ? 'bg-[#00f2ff] text-black shadow-[0_0_15px_rgba(0,242,255,0.4)]'
                                                    : 'bg-white/5 text-skin-text-secondary hover:bg-white/10 hover:text-white'
                                                }
`}
                                        >
                                            ALL
                                        </button>
                                        {AVAILABLE_SERIES.map(series => (
                                            <button
                                                key={series}
                                                onClick={() => setSelectedSeries(series)}
                                                className={`
                                                    px-4 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all
                                                    ${selectedSeries === series
                                                        ? 'bg-[#00f2ff] text-black shadow-[0_0_15px_rgba(0,242,255,0.4)]'
                                                        : 'bg-white/5 text-skin-text-secondary hover:bg-white/10 hover:text-white'
                                                    }
`}
                                            >
                                                {series}
                                            </button>
                                        ))}
                                    </div>


                                </div>

                                {/* REALISATIONS GRID */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    <AnimatePresence>
                                        {filteredProjects.map((project) => (
                                            <motion.div
                                                key={project.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.3 }}
                                                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-[#00f2ff]/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,242,255,0.15)] flex flex-col h-full"
                                            >
                                                {/* Image Container */}
                                                <div className="h-48 overflow-hidden relative">
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                                    <img
                                                        src={project.imageUrl}
                                                        alt={project.title}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300/000000/FFFFFF?text=No+Image';
                                                        }}
                                                    />
                                                    {/* Series Badges */}
                                                    <div className="absolute bottom-4 left-4 z-20 flex flex-wrap gap-2">
                                                        {project.series?.map((s, idx) => (
                                                            <span key={idx} className="text-[#00f2ff] text-[10px] font-bold tracking-wider uppercase bg-black/60 px-2 py-1 rounded border border-[#00f2ff]/30 backdrop-blur-sm">
                                                                {s}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="p-6 flex-1 flex flex-col">
                                                    <div className="mb-3">
                                                        <Link
                                                            to={`/realisations/${project.id}`}
                                                            className="group-hover:text-[#00f2ff] transition-colors inline-block"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <h3 className="text-xl font-['Paris2024'] line-clamp-1" title={project.title}>
                                                                {project.title}
                                                            </h3>
                                                        </Link>
                                                    </div>
                                                    <p className="text-skin-text-secondary text-sm mb-4 line-clamp-3">
                                                        {project.description}
                                                    </p>
                                                    {/* Video Link */}
                                                    <div className="mt-auto flex justify-end items-center">
                                                        {project.videoLink && project.videoLink !== '#' && (
                                                            <a
                                                                href={project.videoLink}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-[#00f2ff]/20 text-white hover:text-[#00f2ff] rounded-lg transition-all text-sm font-bold"
                                                            >
                                                                <span>Voir</span>
                                                                <ArrowRight className="w-4 h-4" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    {filteredProjects.length === 0 && (
                                        <div className="col-span-full text-center py-12 opacity-50">
                                            <p className="font-['Paris2024'] text-xl">Aucun projet trouvé</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : activeTab === 'textes' ? (
                            // TEXTES — search + filter + vertical book cover grid
                            <div className="space-y-8">
                                {/* Search + Filter bar */}
                                <div className="flex flex-col items-center gap-6 bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 w-full">
                                    <div className="relative w-full max-w-xl mb-4">
                                        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                                        <input
                                            type="text"
                                            placeholder="Rechercher un texte..."
                                            value={texteSearch}
                                            onChange={e => setTexteSearch(e.target.value)}
                                            className="w-full bg-black/30 border border-white/10 rounded-full pl-12 pr-4 py-3 text-base text-white focus:border-[#00f2ff]/50 outline-none transition-all shadow-inner focus:bg-black/50"
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-2 justify-center w-full">
                                        <button
                                            onClick={() => setTexteSeries('ALL')}
                                            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all ${texteSeries === 'ALL'
                                                    ? 'bg-[#00f2ff] text-black shadow-[0_0_15px_rgba(0,242,255,0.4)]'
                                                    : 'bg-white/5 text-skin-text-secondary hover:bg-white/10 hover:text-white'
                                                }`}
                                        >
                                            ALL
                                        </button>
                                        {TEXTES_SERIES.map(s => (
                                            <button
                                                key={s}
                                                onClick={() => setTexteSeries(s)}
                                                className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all ${texteSeries === s
                                                        ? 'bg-[#00f2ff] text-black shadow-[0_0_15px_rgba(0,242,255,0.4)]'
                                                        : 'bg-white/5 text-skin-text-secondary hover:bg-white/10 hover:text-white'
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Book cover grid */}
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                    <AnimatePresence>
                                        {filteredTextes.map((item) => (
                                            <motion.div
                                                key={item.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.3 }}
                                                className="group relative flex flex-col"
                                            >
                                                {/* Book cover */}
                                                <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden border border-white/10 group-hover:border-[#00f2ff]/50 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(0,242,255,0.2)] bg-gradient-to-br from-[#0a1628] to-[#0d2144]">
                                                    {item.imageUrl ? (
                                                        <img
                                                            src={item.imageUrl}
                                                            alt={item.title}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).style.display = 'none';
                                                            }}
                                                        />
                                                    ) : (
                                                        /* Placeholder style Stock – fond bleu avec titre */
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                                                            <div className="absolute inset-0 bg-gradient-to-b from-[#0d2144] via-[#1a3a6c] to-[#0d2144]" />
                                                            <div className="relative z-10 flex flex-col items-center gap-3">
                                                                <p className="text-[#a8c4e0] text-[10px] font-bold tracking-[0.25em] uppercase">
                                                                    {/* author placeholder */}
                                                                </p>
                                                                <p className="text-white font-['Baskerville'] text-sm italic leading-snug line-clamp-4">
                                                                    {item.title}
                                                                </p>
                                                                <span className="text-[#00f2ff]/60 text-[9px] tracking-widest uppercase mt-2">
                                                                    {item.date}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {/* Hover overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-end p-4">
                                                        <Link
                                                            to={item.link}
                                                            className="inline-flex items-center gap-1 text-[#00f2ff] font-['Paris2024'] text-xs uppercase tracking-wider hover:gap-2 transition-all"
                                                        >
                                                            Lire <ArrowRight className="w-3 h-3" />
                                                        </Link>
                                                    </div>
                                                </div>
                                                {/* Title below */}
                                                <div className="mt-3 px-1">
                                                    <h3 className="font-['Paris2024'] text-sm text-white group-hover:text-[#00f2ff] transition-colors line-clamp-2">
                                                        {item.title}
                                                    </h3>
                                                    <span className="text-xs text-skin-text-secondary font-mono">{item.date}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    {filteredTextes.length === 0 && (
                                        <div className="col-span-full text-center py-12 opacity-50">
                                            <p className="font-['Paris2024'] text-xl">Aucun texte disponible</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            // RECHERCHES LIST
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
                        )}
                    </div>
                </GlassCard>
            </div>

            {/* Admin Link (Only visible if unlocked, preferably check user role if available, but for now just check unlocked) */}
            {/* Admin link — textes */}
            {!isLocked && activeTab === 'textes' && (
                <div className="fixed bottom-16 right-4 z-50">
                    <Link to="/admin/textes" className="flex items-center gap-2 px-4 py-2 bg-[#00f2ff] text-black rounded-full font-bold hover:bg-[#00c8d4] shadow-lg shadow-cyan-500/30 transition-all">
                        <Lock className="w-4 h-4" />
                        <span>Admin</span>
                    </Link>
                </div>
            )}
            {/* Admin link — réalisations */}
            {!isLocked && activeTab === 'realisations' && (
                <div className="fixed bottom-4 right-4 z-50">
                    <Link to="/admin/realisations" className="flex items-center gap-2 px-4 py-2 bg-[#0055ff] text-white rounded-full font-bold hover:bg-[#0044cc] shadow-lg shadow-blue-500/30 transition-all">
                        <Lock className="w-4 h-4" />
                        <span>Admin</span>
                    </Link>
                </div>
            )}
        </div>
    );
}
