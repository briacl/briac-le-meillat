import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useEffect } from 'react';
import { useProjects } from '@/Contexts/ProjectContext';
import type { Project } from '@/Contexts/ProjectContext';

export default function Dashboard() {
    const { projects, addProject, deleteProject } = useProjects();
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [formData, setFormData] = React.useState({
        title: '',
        description: '',
        imageUrl: '',
        link: '',
        languages: '',
        domain: 'DÉVELOPPEMENT WEB',
        isBest: false,
        isRecent: true,
    });

    useEffect(() => {
        document.title = "Dashboard - briac-le-meillat";
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let processedImageUrl = formData.imageUrl.trim();
        if (processedImageUrl && !processedImageUrl.startsWith('http') && !processedImageUrl.startsWith('/')) {
            processedImageUrl = '/' + processedImageUrl;
        }

        addProject({
            ...formData,
            imageUrl: processedImageUrl,
            languages: formData.languages.split(',').map(l => l.trim()).filter(Boolean),
        });
        setIsFormOpen(false);
        setFormData({
            title: '',
            description: '',
            imageUrl: '',
            link: '',
            languages: '',
            domain: 'DÉVELOPPEMENT WEB',
            isBest: false,
            isRecent: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Gestion des Projets
                    </h2>
                    <button
                        onClick={() => setIsFormOpen(!isFormOpen)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        {isFormOpen ? 'Fermer' : 'Nouveau Projet'}
                    </button>
                </div>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    {/* Formulaire d'ajout */}
                    {isFormOpen && (
                        <div className="mb-8 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Ajouter un projet</h3>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titre</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Domaine</label>
                                    <select
                                        className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={formData.domain}
                                        onChange={e => setFormData({ ...formData, domain: e.target.value })}
                                    >
                                        <option value="DÉVELOPPEMENT WEB">DÉVELOPPEMENT WEB</option>
                                        <option value="RÉSEAUX INFORMATIQUES">RÉSEAUX INFORMATIQUES</option>
                                        <option value="INTELLIGENCE ARTIFICIELLE">INTELLIGENCE ARTIFICIELLE</option>
                                        <option value="TÉLÉCOMMUNICATIONS">TÉLÉCOMMUNICATIONS</option>
                                    </select>
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                    <textarea
                                        required
                                        rows={3}
                                        className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                                    <input
                                        type="text"
                                        placeholder="https://..."
                                        className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={formData.imageUrl}
                                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                    />
                                </div>

                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lien Projet</label>
                                    <input
                                        type="text"
                                        placeholder="https://..."
                                        className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={formData.link}
                                        onChange={e => setFormData({ ...formData, link: e.target.value })}
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Langages (séparés par des virgules)</label>
                                    <input
                                        type="text"
                                        placeholder="React, TypeScript, Python..."
                                        className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={formData.languages}
                                        onChange={e => setFormData({ ...formData, languages: e.target.value })}
                                    />
                                </div>

                                <div className="col-span-2 flex gap-6">
                                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            checked={formData.isBest}
                                            onChange={e => setFormData({ ...formData, isBest: e.target.checked })}
                                        />
                                        Meilleur Projet
                                    </label>
                                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            checked={formData.isRecent}
                                            onChange={e => setFormData({ ...formData, isRecent: e.target.checked })}
                                        />
                                        Projet Récent
                                    </label>
                                </div>

                                <div className="col-span-2 flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsFormOpen(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Enregistrer
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Liste des projets */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h3 className="text-lg font-medium mb-6">Projets Existants ({projects.length})</h3>

                            <div className="grid gap-6">
                                {projects.map((project) => (
                                    <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="font-bold text-lg">{project.title}</h4>
                                                <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full">
                                                    {project.domain}
                                                </span>
                                                {project.isBest && <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">★ Best</span>}
                                                {project.isRecent && <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Recent</span>}
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">{project.description}</p>
                                        </div>

                                        <button
                                            onClick={() => {
                                                if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
                                                    deleteProject(project.id);
                                                }
                                            }}
                                            className="ml-4 text-red-600 hover:text-red-800 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}

                                {projects.length === 0 && (
                                    <div className="text-center py-12 text-gray-500">
                                        Aucun projet pour le moment.
                                        <br />
                                        Cliquez sur "Nouveau Projet" pour commencer.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
