import React, { useEffect, useState } from 'react';
import { useProjects } from '@/Contexts/ProjectContext';
import NeuralNetworkBackground from '@/Components/NeuralNetworkBackground';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import { Search, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const AVAILABLE_SERIES = [
    "Destins d'Alpinisme",
    "Histoire de Rire",
    "j'raconte des histoires",
    "Affaires Alpines",
    "Artistes de l'Histoire",
    "L'Histoire et ses Fautes",
    "Légendes Martitimes"
];

export default function Realisations() {
    const { projects } = useProjects();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSeries, setSelectedSeries] = useState('ALL');

    useEffect(() => {
        document.title = "Réalisations | Briac Le Meillat";
    }, []);

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesSeries = true;
        if (selectedSeries !== 'ALL') {
            matchesSeries = project.series?.includes(selectedSeries) || false;
        }

        return matchesSearch && matchesSeries;
    });

    return (
        <div className="min-h-screen bg-skin-base text-skin-text-main font-sans selection:bg-blue-500/30 relative overflow-hidden">
            <Navbar />
            <NeuralNetworkBackground />

            <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
                <div className="w-11/12 max-w-[95vw] mx-auto">

                    {/* Header */}
                    <header className="mb-12 text-center">
                        <h1 className="font-['Paris2024'] text-5xl md:text-7xl bg-gradient-to-br from-[#0075FF] to-[#f336f0] bg-clip-text text-transparent mb-6">
                            RÉALISATIONS
                        </h1>
                        <p className="font-['Baskerville'] text-xl max-w-2xl mx-auto text-skin-text-secondary italic">
                            "La théorie, c'est quand on sait tout et que rien ne fonctionne. La pratique, c'est quand tout fonctionne et que personne ne sait pourquoi. Ici, nous réunissons la théorie et la pratique." - Einstein
                        </p>
                    </header>

                    {/* Filters */}
                    <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-6 bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10">

                        {/* Series Filter */}
                        <div className="flex flex-wrap gap-2 justify-center">
                            <button
                                onClick={() => setSelectedSeries('ALL')}
                                className={`
                                    px-4 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all
                                    ${selectedSeries === 'ALL'
                                        ? 'bg-[#00f2ff] text-black shadow-[0_0_15px_rgba(0,242,255,0.4)]'
                                        : 'bg-white/5 text-skin-text-secondary hover:bg-white/10 hover:text-white'}
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
                                            : 'bg-white/5 text-skin-text-secondary hover:bg-white/10 hover:text-white'}
                                    `}
                                >
                                    {series}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative w-full md:w-64">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-black/30 border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm text-white focus:border-[#00f2ff]/50 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* VisuBoard Grid */}
                    <motion.div
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8"
                    >
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
                                        <h3 className="text-xl font-['Paris2024'] mb-3 group-hover:text-[#00f2ff] transition-colors line-clamp-1" title={project.title}>
                                            {project.title}
                                        </h3>

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
                                                    title="Voir la vidéo"
                                                >
                                                    <span>Voir</span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {filteredProjects.length === 0 && (
                        <div className="text-center py-20 opacity-50">
                            <p className="font-['Paris2024'] text-xl">Aucun projet trouvé</p>
                        </div>
                    )}

                </div>
            </div>

            <div className="fixed bottom-4 right-4 z-50">
                <Link to="/admin/realisations" className="flex items-center gap-2 px-4 py-2 bg-[#0055ff] text-white rounded-full font-bold hover:bg-[#0044cc] shadow-lg shadow-blue-500/30 transition-all">
                    <Lock className="w-4 h-4" />
                    <span>Admin</span>
                </Link>
            </div>
        </div>
    );
}
