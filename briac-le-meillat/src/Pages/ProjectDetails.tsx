import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProjects } from '@/Contexts/ProjectContext';
import Navbar from '@/Components/Navbar';
import NeuralNetworkBackground from '@/Components/NeuralNetworkBackground';
import GlassCard from '@/Components/GlassCard';
import { ArrowLeft, Play, Tag, Calendar, Plus, ThumbsUp, X } from 'lucide-react';

export default function ProjectDetails() {
    const { id } = useParams<{ id: string }>();
    const { projects } = useProjects();
    const navigate = useNavigate();
    const [isPlayerMode, setIsPlayerMode] = useState(false);

    const project = projects.find(p => p.id === id);

    useEffect(() => {
        if (project) {
            document.title = `${project.title} | Briac Le Meillat`;
        }
    }, [project]);

    if (!project) {
        return (
            <div className="min-h-screen bg-skin-base text-skin-text-main font-sans flex items-center justify-center">
                <NeuralNetworkBackground />
                <div className="z-10 text-center">
                    <h1 className="text-4xl font-['Paris2024'] text-white mb-4">Projet introuvable</h1>
                    <Link to="/recherches?tab=realisations" className="text-[#00f2ff] hover:underline">
                        Retour aux réalisations
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-skin-base text-skin-text-main font-sans selection:bg-blue-500/30 relative overflow-x-hidden">
            <Navbar />
            <NeuralNetworkBackground />

            <main className="relative z-10 container mx-auto px-4 pt-32 pb-20">
                <Link
                    to="/recherches?tab=realisations"
                    className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>Retour aux réalisations</span>
                </Link>

                <GlassCard className="w-full !p-0 overflow-hidden !items-stretch !text-left bg-black/40 backdrop-blur-xl border-white/10">

                    {/* --- PLAYER MODE (CENTERED LAYOUT) --- */}
                    {isPlayerMode ? (
                        <div className="relative animate-in fade-in zoom-in-95 duration-300">
                            {/* Media Section */}
                            <div className="relative w-full aspect-video md:aspect-[21/9] bg-black group">
                                {project.videoLink && project.videoLink !== '#' ? (
                                    <iframe
                                        src={project.videoLink.replace('watch?v=', 'embed/')}
                                        title={project.title}
                                        className="absolute inset-0 w-full h-full"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : (
                                    <img
                                        src={project.imageUrl}
                                        alt={project.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1200x600?text=No+Preview'; }}
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20 pointer-events-none">
                                    <h1 className="text-3xl md:text-5xl font-['Paris2024'] text-white mb-4 drop-shadow-lg">
                                        {project.title}
                                    </h1>
                                    <div className="flex flex-wrap gap-3 pointer-events-auto">
                                        {project.series && project.series.map(series => (
                                            <span
                                                key={series}
                                                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00f2ff]/20 text-[#00f2ff] border border-[#00f2ff]/30 text-sm font-bold tracking-wide backdrop-blur-sm"
                                            >
                                                <Tag className="w-3 h-3" />
                                                {series}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsPlayerMode(false)}
                                    className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full border border-white/20 transition-all z-30 opacity-0 group-hover:opacity-100"
                                    title="Fermer le lecteur"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content Section */}
                            <div className="p-8 md:p-12">
                                <div className="max-w-4xl">
                                    <h2 className="text-xl font-bold text-[#00f2ff] mb-4 uppercase tracking-widest border-b border-white/10 pb-2 inline-block">
                                        À propos de ce projet
                                    </h2>
                                    <div className="prose prose-invert prose-lg max-w-none">
                                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                            {project.description || "Aucune description disponible pour ce projet."}
                                        </p>
                                    </div>

                                    {project.videoLink && project.videoLink !== '#' && (
                                        <a
                                            href={project.videoLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-3 mt-8 px-6 py-3 rounded-full bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold transition-all shadow-lg hover:shadow-red-900/40 hover:-translate-y-1"
                                        >
                                            <Play className="w-5 h-5 fill-current" />
                                            Regarder sur YouTube
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* --- STREAMING SERVICE MODE (SPLIT LAYOUT) --- */
                        <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[60vh] animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Left Column: Media (Clickable) - 60% width */}
                            <div
                                className="lg:col-span-3 relative flex items-center justify-center group cursor-pointer p-6 bg-black/10"
                                onClick={() => setIsPlayerMode(true)}
                            >
                                <div className="w-full aspect-video relative rounded-2xl overflow-hidden shadow-2xl">
                                    <img
                                        src={project.imageUrl}
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1200x600?text=No+Preview'; }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                                    {/* Play Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                            <Play className="w-8 h-8 text-white fill-white ml-1" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Info - 40% width */}
                            <div className="lg:col-span-2 p-8 lg:p-10 flex flex-col gap-6 bg-black/20 border-l border-white/5 relative">
                                {/* Background blur element */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#00f2ff]/5 to-purple-500/5 pointer-events-none" />

                                <div className="relative z-10 space-y-4">

                                    {/* 1. Series Name (Uppercase, Custom Font) */}
                                    {project.series && project.series.length > 0 && (
                                        <div className="text-[#00f2ff] font-['Paris2024'] tracking-widest text-sm uppercase font-bold flex items-center gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#00f2ff]"></span>
                                            <span>
                                                {project.series[0]}
                                                <span className="text-white/60 font-light normal-case tracking-normal mx-3">|</span>
                                                <span className="text-white/60 font-light normal-case tracking-normal">série documentaire</span>
                                            </span>
                                        </div>
                                    )}

                                    {/* 2. Season / Episode */}
                                    {(project.season || project.episode) && (
                                        <div className="text-white font-['Paris2024'] text-lg md:text-xl font-bold">
                                            - {project.season && `Saison ${project.season}`}
                                            {project.season && project.episode && ` `}
                                            {project.episode && `Episode ${project.episode}`} -
                                        </div>
                                    )}

                                    {/* 3. Episode Title (Project Title) */}
                                    <h1 className="text-3xl md:text-5xl font-['Paris2024'] text-white leading-tight drop-shadow-md">
                                        {project.title}
                                    </h1>

                                    {/* 4. Logo | Category | Duration */}
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 font-medium">
                                        <span className="text-white font-['Paris2024'] tracking-wider font-bold">briac.le-meillat</span>
                                        <span className="text-white/30">|</span>
                                        <span className="text-gray-300">{project.category || "Série documentaire"}</span>

                                        {/* 5. Duration (integrated in same line as requested 'Logo | Cat | Duration') */}
                                        {project.duration && (
                                            <>
                                                <span className="text-white/30">•</span>
                                                <span className="text-gray-300">{project.duration}</span>
                                            </>
                                        )}
                                    </div>

                                    {/* 6. Rating / All Audiences */}
                                    <div className="flex items-center gap-2 pt-1">
                                        <span className="px-2 py-0.5 border border-white/40 rounded text-[10px] text-gray-300 uppercase tracking-widest font-bold">
                                            Tous publics
                                        </span>
                                    </div>
                                </div>

                                {/* 7. Description */}
                                <div className="flex-1 relative z-10 mt-2">
                                    <p className="text-gray-300 leading-relaxed text-sm line-clamp-[6] group-hover:line-clamp-none transition-all cursor-pointer">
                                        {project.description || "Aucune description disponible pour ce projet."}
                                    </p>
                                    <button className="text-xs text-gray-500 underline mt-2 hover:text-[#00f2ff] transition-colors">En savoir plus</button>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-6 mt-auto pt-6 border-t border-white/10 relative z-10">
                                    <button className="flex flex-col items-center gap-2 group/btn">
                                        <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-all bg-black/40">
                                            <Plus className="w-4 h-4" />
                                        </div>
                                        <span className="text-[10px] text-gray-400 group-hover/btn:text-white uppercase tracking-wider font-bold">Ma liste</span>
                                    </button>
                                    <button className="flex flex-col items-center gap-2 group/btn">
                                        <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-all bg-black/40">
                                            <ThumbsUp className="w-4 h-4" />
                                        </div>
                                        <span className="text-[10px] text-gray-400 group-hover/btn:text-white uppercase tracking-wider font-bold">J'aime</span>
                                    </button>
                                    <button
                                        onClick={() => setIsPlayerMode(true)}
                                        className="flex flex-col items-center gap-2 group/btn ml-auto"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-[#ff0000] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-red-900/50">
                                            <Play className="w-4 h-4 fill-current ml-0.5" />
                                        </div>
                                        <span className="text-[10px] text-gray-400 group-hover/btn:text-white uppercase tracking-wider font-bold">Regarder</span>
                                    </button>
                                </div>

                                {/* Recommendation Box */}
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-4 relative z-10">
                                    <h3 className="text-xs font-bold text-white mb-1 uppercase tracking-wider">Recommandations</h3>
                                    <p className="text-[10px] text-gray-400 leading-snug">Connectez-vous pour voir plus de contenu similaire.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </GlassCard>
            </main>
        </div>
    );
}
