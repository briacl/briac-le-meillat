
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useEffect, useState } from 'react';
import { useProjects, Project } from '@/Contexts/ProjectContext';
import GlassCard from '@/Components/GlassCard';

export default function Devop() {
    const { projects, addProject, deleteProject, updateProject, domains } = useProjects();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: '',
        languages: '',
        link: '',
        domain: '',
        isBest: false,
        isRecent: true,
    });

    // Hardcoded domains to match NeuralNetworkBackground nodes exactly
    const PREDEFINED_DOMAINS = [
        "DÉVELOPPEMENT WEB",
        "RÉSEAUX INFORMATIQUES",
        "IA",
        "TÉLÉCOMMUNICATIONS"
    ];

    useEffect(() => {
        document.title = "Administration Projets - briac-le-meillat";
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addProject({
            title: formData.title,
            description: formData.description,
            imageUrl: formData.imageUrl,
            languages: formData.languages.split(',').map(l => l.trim()),
            link: formData.link,
            domain: formData.domain || 'Uncategorized',
            isBest: formData.isBest,
            isRecent: formData.isRecent,
        });
        // Reset form
        setFormData({
            title: '',
            description: '',
            imageUrl: '',
            languages: '',
            link: '',
            domain: '',
            isBest: false,
            isRecent: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Administration des Projets
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 flex flex-col gap-8">

                    {/* Add Project Form */}
                    <GlassCard className="p-6">
                        <h3 className="text-2xl font-bold mb-6 text-[#0055ff]">Ajouter un nouveau projet</h3>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Titre du projet</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-white/50"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Description courte</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-white/50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Domaine (Correspondance exacte requise)</label>
                                <select
                                    name="domain"
                                    value={formData.domain}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-white/50"
                                    required
                                >
                                    <option value="">-- Sélectionner un domaine --</option>
                                    {PREDEFINED_DOMAINS.map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                    {/* Include other existing domains if any, filtering out predefined ones to avoid dupes */}
                                    {domains
                                        .filter(d => !PREDEFINED_DOMAINS.includes(d))
                                        .map(d => <option key={d} value={d}>{d}</option>)
                                    }
                                </select>
                                <p className="text-xs text-gray-500 mt-1">Sélectionnez l'un des domaines du réseau de neurones pour que le projet apparaisse sur la page d'accueil.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Langages (séparés par virgule)</label>
                                <input
                                    type="text"
                                    name="languages"
                                    value={formData.languages}
                                    onChange={handleChange}
                                    placeholder="React, TypeScript, Node.js"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-white/50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">URL de l'image (Vignette)</label>
                                <input
                                    type="text"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-white/50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Lien vers le détail/site</label>
                                <input
                                    type="text"
                                    name="link"
                                    value={formData.link}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-white/50"
                                />
                            </div>

                            <div className="flex items-center gap-4 py-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isBest"
                                        checked={formData.isBest}
                                        onChange={handleChange}
                                        className="rounded text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Meilleur projet</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isRecent"
                                        checked={formData.isRecent}
                                        onChange={handleChange}
                                        className="rounded text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Projet récent</span>
                                </label>
                            </div>

                            <div className="col-span-1 md:col-span-2 mt-4">
                                <button
                                    type="submit"
                                    className="w-full py-3 px-6 rounded-md bg-gradient-to-r from-[#00f2ff] to-[#0055ff] text-white font-bold hover:shadow-lg hover:scale-[1.02] transition-all"
                                >
                                    AJOUTER LE PROJET
                                </button>
                            </div>
                        </form>
                    </GlassCard>

                    {/* Existing Projects List */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Projets Existants ({projects.length})</h3>
                        {projects.length === 0 ? (
                            <p className="text-gray-500">Aucun projet pour le moment.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projects.map(project => (
                                    <GlassCard key={project.id} className="relative p-4 flex flex-col gap-2">
                                        <button
                                            onClick={() => deleteProject(project.id)}
                                            className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                                            title="Supprimer"
                                        >
                                            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
                                        </button>

                                        {project.imageUrl && (
                                            <img src={project.imageUrl} alt={project.title} className="w-full h-32 object-cover rounded-md mb-2" />
                                        )}
                                        <h4 className="font-bold text-lg">{project.title}</h4>
                                        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{project.domain}</span>
                                        <p className="text-sm text-gray-600 line-clamp-3">{project.description}</p>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {project.languages.map(l => (
                                                <span key={l} className="text-xs bg-gray-100 px-2 py-1 rounded">{l}</span>
                                            ))}
                                        </div>
                                        <div className="flex gap-2 mt-4 text-xs font-semibold">
                                            {project.isBest && <span className="text-green-600 bg-green-100 px-2 py-1 rounded">BEST</span>}
                                            {project.isRecent && <span className="text-purple-600 bg-purple-100 px-2 py-1 rounded">RECENT</span>}
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
