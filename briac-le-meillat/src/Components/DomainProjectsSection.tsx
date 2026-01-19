
import React from 'react';
import { useProjects, Project } from '@/Contexts/ProjectContext';
import GlassCard from '@/Components/GlassCard';

export default function DomainProjectsSection() {
    const { domains, getProjectsByDomain } = useProjects();

    const renderProjectCard = (project: Project) => (
        <div key={project.id} className="group relative">
            <GlassCard className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,242,255,0.3)] !p-0">
                {/* Image Section */}
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    {project.imageUrl ? (
                        <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                            No Image
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                    <div className="absolute bottom-4 left-4">
                        <h4 className="font-['Paris2024'] text-xl text-white tracking-widest">{project.title}</h4>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-1">
                    <p className="text-sm text-gray-700 font-['Montserrat_Alternates'] mb-4 line-clamp-3 flex-1">
                        {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {project.languages.map((lang, idx) => (
                            <span key={idx} className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-blue-50 text-blue-600 border border-blue-100">
                                {lang}
                            </span>
                        ))}
                    </div>

                    {project.link && (
                        <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center py-2 px-4 rounded-full bg-gradient-to-r from-[#00f2ff] to-[#0055ff] text-white text-xs font-bold tracking-widest uppercase hover:shadow-lg transition-all"
                        >
                            Voir le projet
                        </a>
                    )}
                </div>
            </GlassCard>
        </div>
    );

    if (domains.length === 0) return null;

    return (
        <div className="w-full flex flex-col gap-32">
            {domains.map(domain => {
                const domainProjects = getProjectsByDomain(domain);
                const bestProjects = domainProjects.filter(p => p.isBest);
                const recentProjects = domainProjects.filter(p => p.isRecent);

                if (domainProjects.length === 0) return null;

                return (
                    <div key={domain} className="w-full">
                        <div className="flex flex-col items-center mb-16">
                            <h2 className="text-[3rem] font-['Paris2024'] text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ff] to-[#0055ff] uppercase tracking-widest text-center">
                                {domain}
                            </h2>
                            <div className="h-1 w-24 bg-gradient-to-r from-[#00f2ff] to-[#0055ff] rounded-full mt-4"></div>
                        </div>

                        {/* Best Projects Section */}
                        {bestProjects.length > 0 && (
                            <div className="mb-20">
                                <h3 className="text-2xl font-['Paris2024'] text-gray-800 mb-8 pl-4 border-l-4 border-[#00f2ff]">
                                    MES MEILLEURS PROJETS
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {bestProjects.map(renderProjectCard)}
                                </div>
                            </div>
                        )}

                        {/* Recent Projects Section */}
                        {recentProjects.length > 0 && (
                            <div className="mb-12">
                                <h3 className="text-2xl font-['Paris2024'] text-gray-800 mb-8 pl-4 border-l-4 border-[#0055ff]">
                                    MES RÉCENTS PROJETS
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {recentProjects.map(renderProjectCard)}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
