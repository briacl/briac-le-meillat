import React from 'react';
import { motion } from 'framer-motion';
import staticProjects from '@/data/projects.json';

const MAJOR_NODES = [
    {
        id: "dev-web",
        text: "DÉVELOPPEMENT WEB",
        description: "Passionné par la création d'expériences utilisateurs fluides et interactives, je maîtrise l'écosystème moderne (React, TypeScript, Node.js) pour concevoir des applications web performantes et esthétiques."
    },
    {
        id: "reseaux",
        text: "RÉSEAUX INFORMATIQUES",
        description: "Les réseaux constituent le cœur de ma formation. J’y développe une compréhension approfondie des protocoles, de l’adressage IPv4, des outils de diagnostic comme le ping, ainsi que des principes fondamentaux de communication entre machines."
    },
    {
        id: "ia",
        text: "INTELLIGENCE ARTIFICIELLE",
        description: "L’intelligence artificielle est un domaine qui me passionne par sa capacité à transformer des données en décisions intelligentes. Je m’intéresse particulièrement au machine learning, au deep learning et aux LLM, avec une approche orientée compréhension des modèles, expérimentation et applications concrètes."
    },
    {
        id: "telecom",
        text: "TÉLÉCOMMUNICATIONS",
        description: "Les télécommunications relient le monde. Je m'intéresse aux fondamentaux du traitement du signal, aux réseaux mobiles (4G/5G) et aux technologies de transmission moderne."
    },
    {
        id: "programmation",
        text: "PROGRAMMATION",
        description: "La programmation, notamment en Python, est pour moi un outil essentiel pour automatiser, analyser et concevoir des solutions efficaces. J’accorde une grande importance à la clarté du code, à la logique et à la résolution de problèmes."
    }
];

const resolveImageUrl = (url: string) => {
    if (!url) return url;
    const cleaned = url.replace(/^\/briac-le-meillat\//, '').replace(/^\//, '');
    return `${import.meta.env.BASE_URL}${cleaned}`;
};

export interface NodeDetailCardProps {
    selectedNode: string;
    onClose: () => void;
}

export const NodeDetailCard: React.FC<NodeDetailCardProps> = ({ selectedNode, onClose }) => {
    return (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    bg-black/5 dark:bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden
                    border border-black/10 dark:border-white/20 shadow-xl shadow-blue-900/10 z-[100] animate-in fade-in zoom-in duration-300
                    max-w-6xl max-w-[95vw] w-[95vw] h-[85vh] flex relative"
            style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>

            {/* CONTENT CONTAINER - Full width but z-10 above animation */}
            <div className="relative z-10 w-full h-full flex flex-col p-8 md:p-12 overflow-hidden">

                <button
                    onClick={onClose}
                    className="absolute top-6 right-8 text-[#0055ff]/50 hover:text-[#0055ff] transition-colors z-[60] text-4xl font-light"
                >
                    ✕
                </button>

                {/* HEADERS - Left Aligned */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-10 text-left border-b border-white/10 pb-6 w-full"
                >
                    <h3 className="text-3xl md:text-5xl mb-2 bg-gradient-to-br from-[#0075FF] to-[#f336f0] bg-clip-text text-transparent drop-shadow-sm font-['Paris2024'] tracking-widest uppercase">
                        {selectedNode}
                    </h3>
                     <p className="text-white font-['Paris2024'] text-base md:text-lg tracking-widest leading-relaxed mt-4">
                        {(() => {
                            const node = MAJOR_NODES.find(n => n.text === selectedNode.toUpperCase());
                            return node?.description || "Ce domaine occupe une place importante dans mon parcours. Il me permet de développer des compétences variées.";
                        })()}
                    </p>
                </motion.div>


                {/* SCROLLABLE PROJECTS AREA */}
                <div className="flex-1 overflow-y-auto w-full custom-scrollbar pr-4">
                    <div className="w-full flex flex-col gap-16 text-left pb-12">
                        {(() => {
                            const normalize = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                            const DOMAIN_MAP: Record<string, string[]> = {
                                "DÉVELOPPEMENT WEB": ["DÉVELOPPEMENT WEB", "DÉVELOPPEMENT"],
                                "RÉSEAUX INFORMATIQUES": ["RÉSEAU", "ADMINISTRATION RÉSEAU", "ADMINISTRATION"],
                                "INTELLIGENCE ARTIFICIELLE": ["INTELLIGENCE ARTIFICIELLE"],
                                "TÉLÉCOMMUNICATIONS": ["TÉLÉCOMMUNICATION", "TÉLÉCOMMUNICATIONS"],
                                "PROGRAMMATION": ["PROGRAMMATION"],
                            };
                            const domainList = DOMAIN_MAP[selectedNode.toUpperCase() || ''] ?? [selectedNode.toUpperCase() || ''];
                            const domainProjects = staticProjects.filter((p: { domain?: string }) =>
                                domainList.some(d => normalize(d) === normalize(p.domain ?? ''))
                            );

                            const bestProjects = domainProjects.filter(p => p.isBest);
                            const recentProjects = domainProjects.filter(p => p.isRecent);

                            if (domainProjects.length === 0) {
                                return (
                                    <div className="flex flex-col items-center justify-center p-12 opacity-50">
                                        <i className="fa-solid fa-code text-4xl mb-4 text-[#0055ff]"></i>
                                        <p className="font-['Montserrat_Alternates'] text-xl italic text-white/80">
                                            Projets à venir dans ce secteur...
                                        </p>
                                    </div>
                                );
                            }

                            return (
                                <>
                                    {/* RECENT PROJECTS */}
                                    {recentProjects.length > 0 && (
                                        <div className="relative">
                                            <h4 className="font-['Paris2024'] text-3xl mb-4 bg-gradient-to-br from-[#0075FF] to-[#f336f0] bg-clip-text text-transparent drop-shadow-sm tracking-widest">
                                                Mes récents projets
                                            </h4>
                                            <p className="font-['Roboto_Mono'] text-xs md:text-sm text-white/80 tracking-wide mb-8 leading-relaxed opacity-90">
                                                &gt; Découvrez mes toutes dernières créations. Cette section regroupe mes travaux les plus récents, là où j'expérimente de nouvelles technos et où je perfectionne mes méthodes de travail. C'est ici que bat le cœur de ma veille technologique et de ma progression au quotidien.
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                {recentProjects.map(project => (
                                                    <div key={project.id} className="group relative bg-black/5 dark:bg-white/10 rounded-2xl overflow-hidden border border-black/10 dark:border-white/20 hover:shadow-2xl hover:shadow-[#0075FF]/20 transition-all duration-300 flex flex-col h-full">
                                                        <div className="h-40 w-full overflow-hidden relative bg-zinc-800/50">
                                                            {project.imageUrl ? (
                                                                <img src={resolveImageUrl(project.imageUrl)} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-white/60 bg-zinc-800/50">
                                                                    <span className="text-3xl opacity-20"><i className="fa-solid fa-image"></i></span>
                                                                </div>
                                                            )}
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-0 transition-opacity duration-300"></div>
                                                            <div className="absolute bottom-4 left-4 right-4 transition-opacity duration-300 group-hover:opacity-0">
                                                                <div className="flex gap-2 mb-2 flex-wrap">
                                                                    <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#0075FF]/30 text-white backdrop-blur-sm border border-[#0075FF]/30">RÉCENT</span>
                                                                </div>
                                                                <h3 className="text-white font-['Paris2024'] text-xl tracking-wider leading-tight">{project.title}</h3>
                                                            </div>
                                                            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center items-center p-4 text-center">
                                                                <h3 className="text-white font-['Paris2024'] text-lg mb-2 tracking-wider">{project.title}</h3>
                                                                <p className="text-sm text-white/90 line-clamp-3 mb-4 font-['Montserrat_Alternates'] leading-relaxed">{project.description}</p>
                                                                {project.link && project.link !== '#' && (
                                                                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[10px] uppercase font-bold text-[#0075FF] hover:text-[#f336f0] transition-colors group/link border border-[#0075FF] hover:border-[#f336f0] px-3 py-1.5 rounded-full bg-[#0075FF]/10 hover:bg-[#f336f0]/10">
                                                                        Voir le projet <span className="transform group-hover/link:translate-x-1 transition-transform">→</span>
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* BEST PROJECTS */}
                                    {bestProjects.length > 0 && (
                                        <div className="relative mt-8">
                                            <h4 className="font-['Paris2024'] text-3xl mb-8 bg-gradient-to-br from-[#0075FF] to-[#f336f0] bg-clip-text text-transparent drop-shadow-sm tracking-widest">
                                                Mes meilleurs projets
                                            </h4>
                                            <p className="text-white/90 font-['Roboto_Mono'] text-base tracking-widest mb-12 leading-relaxed">
                                                &gt; Vous trouverez ici une sélection de mes projets les plus aboutis, ceux qui reflètent le mieux mon niveau actuel, ma rigueur et mon investissement.
                                                Ils mettent en avant ma capacité à mener un projet de bout en bout, de la conception à la réalisation.
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                {bestProjects.map(project => (
                                                    <div key={project.id} className="group relative bg-black/5 dark:bg-white/10 rounded-2xl overflow-hidden border border-black/10 dark:border-white/20 hover:shadow-2xl hover:shadow-[#00f2ff]/20 transition-all duration-300 flex flex-col h-full">
                                                        <div className="h-40 w-full overflow-hidden relative bg-zinc-800/50">
                                                            {project.imageUrl ? (
                                                                <img src={resolveImageUrl(project.imageUrl)} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-white/60 bg-zinc-800/50">
                                                                    <span className="text-3xl opacity-20"><i className="fa-solid fa-image"></i></span>
                                                                </div>
                                                            )}
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-0 transition-opacity duration-300"></div>
                                                            <div className="absolute bottom-4 left-4 right-4 transition-opacity duration-300 group-hover:opacity-0">
                                                                <div className="flex gap-2 mb-2 flex-wrap">
                                                                    {(project.languages ?? []).slice(0, 3).map((l, idx) => (
                                                                        <span key={idx} className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/10">
                                                                            {l}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                                <h3 className="text-white font-['Paris2024'] text-xl tracking-wider leading-tight">{project.title}</h3>
                                                            </div>
                                                            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center items-center p-4 text-center">
                                                                <h3 className="text-white font-['Paris2024'] text-lg mb-2 tracking-wider">{project.title}</h3>
                                                                <p className="text-sm text-white/90 line-clamp-3 mb-4 font-['Montserrat_Alternates'] leading-relaxed">{project.description}</p>
                                                                {project.link && (
                                                                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[10px] uppercase font-bold text-[#00f2ff] hover:text-[#80fbff] transition-colors group/link border border-[#00f2ff] hover:border-[#80fbff] px-3 py-1.5 rounded-full bg-[#00f2ff]/10 hover:bg-[#00f2ff]/20">
                                                                        Voir le projet <span className="transform group-hover/link:translate-x-1 transition-transform">→</span>
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* OTHER PROJECTS */}
                                    {(() => {
                                        const otherProjects = domainProjects.filter(p => !p.isBest && !p.isRecent);
                                        if (otherProjects.length === 0) return null;
                                        return (
                                            <div className="relative mt-16">
                                                <h4 className="font-['Paris2024'] text-3xl mb-4 bg-gradient-to-br from-[#0075FF] to-[#f336f0] bg-clip-text text-transparent drop-shadow-sm tracking-widest">
                                                    Autres Réalisations
                                                </h4>
                                                <p className="font-['Roboto_Mono'] text-xs md:text-sm text-white/80 tracking-wide mb-8 leading-relaxed opacity-90">
                                                    &gt; Au-delà des projets phares, voici un aperçu de mon parcours à travers diverses réalisations. Qu'il s'agisse de collaborations ponctuelles, de prototypes ou de défis personnels, ces travaux illustrent ma polyvalence et mon envie constante de relever de nouveaux challenges techniques.
                                                </p>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                    {otherProjects.map(project => (
                                                        <div key={project.id} className="group relative bg-black/5 dark:bg-white/10 rounded-2xl overflow-hidden border border-black/10 dark:border-white/20 hover:shadow-2xl hover:shadow-[#00f2ff]/20 transition-all duration-300 flex flex-col h-full">
                                                            <div className="h-40 w-full overflow-hidden relative bg-zinc-800/50">
                                                                {project.imageUrl ? (
                                                                    <img src={resolveImageUrl(project.imageUrl)} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-white/60 bg-zinc-800/50">
                                                                        <span className="text-3xl opacity-20"><i className="fa-solid fa-image"></i></span>
                                                                    </div>
                                                                )}
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-0 transition-opacity duration-300"></div>
                                                                <div className="absolute bottom-4 left-4 right-4 transition-opacity duration-300 group-hover:opacity-0">
                                                                    <div className="flex gap-2 mb-2 flex-wrap">
                                                                        {(project.languages ?? []).slice(0, 3).map((l, idx) => (
                                                                            <span key={idx} className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/10">
                                                                                {l}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                    <h3 className="text-white font-['Paris2024'] text-xl tracking-wider leading-tight">{project.title}</h3>
                                                                </div>
                                                                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center items-center p-4 text-center">
                                                                    <h3 className="text-white font-['Paris2024'] text-lg mb-2 tracking-wider">{project.title}</h3>
                                                                    <p className="text-sm text-white/90 line-clamp-3 mb-4 font-['Montserrat_Alternates'] leading-relaxed">{project.description}</p>
                                                                    {project.link && (
                                                                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[10px] uppercase font-bold text-[#00f2ff] hover:text-[#80fbff] transition-colors group/link border border-[#00f2ff] hover:border-[#80fbff] px-3 py-1.5 rounded-full bg-[#00f2ff]/10 hover:bg-[#00f2ff]/20">
                                                                            Voir le projet <span className="transform group-hover/link:translate-x-1 transition-transform">→</span>
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <p className="text-white/90 font-['Baskerville'] text-sm tracking-widest mt-16 mb-8 leading-loose">
                                                    Pour plus d’informations, veuillez cliquer sur les vignettes afin d’accéder aux pages détaillées des projets, consulter les liens associés et explorer le reste du site.
                                                    Pour toute information complémentaire ou prise de contact, la section Contact est à votre disposition.
                                                </p>
                                            </div>
                                        );
                                    })()}
                                </>
                            );
                        })()}
                    </div>
                </div>

            </div>
        </div >
    );
};

export default NodeDetailCard;
