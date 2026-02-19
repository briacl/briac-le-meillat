import React, { useState, useEffect } from 'react';
import Navbar from '@/Components/Navbar';
import NeuralNetworkBackground from '@/Components/NeuralNetworkBackground';
import GlassCard from '@/Components/GlassCard';
import { useProjects, Project } from '@/Contexts/ProjectContext';
import { Reorder } from 'framer-motion';
import { Plus, Edit, Trash, Save, ArrowLeft, GripVertical } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const AVAILABLE_SERIES = [
    "Destins d'Alpinisme",
    "Histoire de Rire",
    "j'raconte des histoires",
    "Affaires Alpines",
    "Artistes de l'Histoire",
    "L'Histoire et ses Fautes",
    "Légendes Martitimes"
];

export default function RealisationsAdmin() {
    const { projects, addProject, updateProject, deleteProject, reorderProjects } = useProjects();
    const navigate = useNavigate();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Project>>({});
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        document.title = "Admin Réalisations | Briac Le Meillat";
    }, []);

    const startEdit = (project: Project) => {
        setEditingId(project.id);
        setFormData({ ...project });
        setIsCreating(false);
    };

    const startCreate = () => {
        setEditingId('new');
        setFormData({
            title: '',
            description: '',
            imageUrl: '/briac-le-meillat/assets/projects/387.png',
            videoLink: '#',
            series: []
        });
        setIsCreating(true);
    };

    const handleSave = () => {
        if (isCreating) {
            addProject(formData as Omit<Project, 'id' | 'createdAt'>);
        } else if (editingId) {
            updateProject(editingId, formData);
        }
        setEditingId(null);
        setIsCreating(false);
    };

    const handleCancel = () => {
        setEditingId(null);
        setIsCreating(false);
    };

    const toggleSeries = (seriesName: string) => {
        const currentSeries = formData.series || [];
        if (currentSeries.includes(seriesName)) {
            setFormData({ ...formData, series: currentSeries.filter(s => s !== seriesName) });
        } else {
            setFormData({ ...formData, series: [...currentSeries, seriesName] });
        }
    };

    return (
        <div className="min-h-screen bg-skin-base text-skin-text-main font-sans selection:bg-blue-500/30 relative overflow-hidden">
            <Navbar />
            <NeuralNetworkBackground />

            <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <Link to="/recherches?tab=realisations" className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors" title="Retour au site">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <h1 className="font-['Paris2024'] text-3xl md:text-4xl text-white">
                            Admin <span className="text-[#0055ff]">Réalisations</span>
                        </h1>
                    </div>
                    <button
                        onClick={startCreate}
                        disabled={!!editingId}
                        className="flex items-center gap-2 bg-[#0055ff] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#0044cc] disabled:opacity-50 transition-all shadow-lg shadow-blue-500/30"
                    >
                        <Plus className="w-5 h-5" /> Nouveau Projet
                    </button>
                </div>

                {/* EDIT/CREATE FORM MODAL/CARD */}
                {editingId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <GlassCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto !items-stretch text-left">
                            <h2 className="text-2xl font-bold text-white mb-6 text-center">
                                {isCreating ? 'Ajouter un projet' : 'Modifier le projet'}
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Titre</label>
                                    <input
                                        type="text"
                                        value={formData.title || ''}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:border-[#0055ff] outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Description</label>
                                    <textarea
                                        rows={3}
                                        value={formData.description || ''}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:border-[#0055ff] outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Image URL</label>
                                        <input
                                            type="text"
                                            value={formData.imageUrl || ''}
                                            onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:border-[#0055ff] outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Lien Vidéo</label>
                                        <input
                                            type="text"
                                            value={formData.videoLink || ''}
                                            onChange={e => setFormData({ ...formData, videoLink: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:border-[#0055ff] outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Séries</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-white/5 p-4 rounded-lg border border-white/10 max-h-48 overflow-y-auto">
                                        {AVAILABLE_SERIES.map(series => (
                                            <label key={series} className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.series?.includes(series) || false}
                                                    onChange={() => toggleSeries(series)}
                                                    className="w-4 h-4 accent-[#0055ff] rounded"
                                                />
                                                <span className="text-sm text-white">{series}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        onClick={handleCancel}
                                        className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="flex items-center gap-2 px-6 py-2 bg-[#0055ff] text-white rounded-lg font-bold hover:bg-[#0044cc] shadow-lg shadow-blue-500/20"
                                    >
                                        <Save className="w-4 h-4" /> Enregistrer
                                    </button>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                )}

                {/* LIST */}
                <GlassCard className="w-full !p-8 !items-stretch bg-black/40 backdrop-blur-xl border-white/10">
                    <Reorder.Group axis="y" values={projects} onReorder={reorderProjects} className="space-y-4">
                        {projects.map(project => (
                            <Reorder.Item
                                key={project.id}
                                value={project}
                                className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center cursor-move"
                            >
                                {/* Drag Handle Icon */}
                                <div className="text-white/30 hover:text-white/80 transition-colors">
                                    <GripVertical className="w-6 h-6" />
                                </div>

                                <img
                                    src={project.imageUrl}
                                    alt={project.title}
                                    className="w-40 h-24 object-cover rounded-lg bg-black/50"
                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Img'; }}
                                />

                                <div className="flex-1 min-w-0 text-center md:text-left">
                                    <h3 className="text-xl font-bold text-white truncate">{project.title}</h3>
                                    {project.series && project.series.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1 justify-center md:justify-start">
                                            {project.series.map(s => (
                                                <span key={s} className="text-[10px] bg-[#00f2ff]/10 text-[#00f2ff] px-2 py-0.5 rounded border border-[#00f2ff]/20">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <p className="text-sm text-gray-400 truncate mt-1">{project.description}</p>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => startEdit(project)}
                                        className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                                        title="Modifier"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
                                                deleteProject(project.id);
                                            }
                                        }}
                                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                                        title="Supprimer"
                                    >
                                        <Trash className="w-5 h-5" />
                                    </button>
                                </div>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>
                </GlassCard>
            </div>
        </div>
    );
}
