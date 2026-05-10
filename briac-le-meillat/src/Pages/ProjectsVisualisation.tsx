import React, { useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Newsbar from '../Components/Newsbar';
import UnifiedFooter from '../Components/UnifiedFooter';

const projects = [
    {
        name: "Heryze",
        logo: "/briac-le-meillat/assets/projects/heryze-logo.jpg",
        description: "La solution d'encaissement (POS) nouvelle génération. Offline-first, zéro matériel propriétaire, UX 'haute couture'."
    },
    {
        name: "Arcus",
        logo: "/briac-le-meillat/assets/projects/arcus-logo.png",
        description: "L'annuaire de référence des serveurs MCP (Model Context Protocol). Objectif : devenir le point de passage obligé de la communauté IA."
    },
    {
        name: "Cortex",
        logo: "/briac-le-meillat/assets/projects/cortex-logo.jpg",
        description: "L'interface de chat arborescente (Tree-Chat). Résout la saturation du contexte en organisant la pensée IA en branches."
    },
    {
        name: "Folyo",
        logo: "/briac-le-meillat/assets/projects/folyo-blue.svg",
        description: "Collecte intelligente de documents pour courtiers. Transforme le chaos des mails en un dossier propre et renommé automatiquement."
    },
    {
        name: "Echo",
        logo: "/briac-le-meillat/assets/projects/echo-logo.jpg",
        description: "Monitoring de sites web pour non-techniciens. La sérénité par SMS en français, avec un rapport de santé mensuel."
    },
    {
        name: "NetGuardian",
        logo: "/briac-le-meillat/assets/projects/netguardian-logo.webp",
        description: "Sentinelle réseau silencieuse qui traduit les anomalies techniques (NAS plein, imprimante hors-ligne, panne internet) en alertes humaines et en rapports de santé mensuels pour garantir la continuité d'activité des TPE sans qu'elles n'aient à gérer la technique."
    },
    {
        name: "Caducée",
        logo: null,
        textLogo: "Caducée",
        description: "Le 'gros projet' futur (nom de code), encore confidentiel."
    },
    {
        name: "/tardis.ai",
        logo: null,
        textLogo: "/tardis.ai",
        fontFamily: "'Director', sans-serif",
        fontSize: "1.5rem",
        description: ""
    },
    {
        name: ".lyrae-shared",
        logo: null,
        textLogo: ".lyrae-shared",
        fontFamily: "'Director', sans-serif",
        fontSize: "1rem",
        description: ""
    },
    {
        name: "Prism",
        logo: null,
        textLogo: "Prism",
        fontFamily: "'LTRemark', sans-serif",
        fontSize: "3.5rem",
        description: ""
    }
];

export default function ProjectsVisualisation() {
    useEffect(() => {
        document.title = "Visualisation des Projets - Briac Le Meillat";
    }, []);

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-blue-100">
            {/* Navbar */}
            <div className="fixed top-0 left-0 w-full flex justify-center z-[100] pointer-events-none">
                <div className="pointer-events-auto w-full flex justify-center">
                    <Navbar />
                </div>
            </div>

            {/* Newsbar */}
            <div className="fixed top-28 left-0 w-full pointer-events-auto z-[50]">
                <Newsbar />
            </div>

            <main className="pt-48 pb-20 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {projects.map((project, index) => (
                        <div key={index} className="flex flex-col items-center text-center space-y-6 p-8 rounded-3xl transition-all duration-300 hover:bg-gray-50 group">
                            {/* Logo Container */}
                            <div className="w-48 h-48 flex items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 transition-transform duration-500 group-hover:scale-105">
                                {project.logo ? (
                                    <img
                                        src={project.logo}
                                        alt={project.name}
                                        className="max-w-[80%] max-h-[80%] object-contain"
                                        onError={(e) => {
                                            // Fallback if image not found
                                            (e.target as HTMLImageElement).style.display = 'none';
                                            const parent = (e.target as HTMLElement).parentElement;
                                            if (parent) {
                                                const span = document.createElement('span');
                                                span.className = "text-2xl font-bold text-gray-400";
                                                span.innerText = project.name;
                                                parent.appendChild(span);
                                            }
                                        }}
                                    />
                                ) : (
                                    <span
                                        className="font-bold tracking-tight text-gray-900"
                                        style={{
                                            fontFamily: project.fontFamily || 'inherit',
                                            fontSize: (project as any).fontSize || '2.5rem'
                                        }}
                                    >
                                        {project.textLogo}
                                    </span>
                                )}
                            </div>

                            {/* Info */}
                            <div className="space-y-3">
                                <h2 className="text-xl font-bold tracking-tight text-gray-900">
                                    {project.name}
                                </h2>
                                {project.description && (
                                    <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                                        {project.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <UnifiedFooter />
        </div>
    );
}
