import React, { useEffect, useState } from 'react';
import { useProjects } from '@/Contexts/ProjectContext';
import type { Project } from '@/Contexts/ProjectContext';
import NeuralNetworkBackground from '@/Components/NeuralNetworkBackground';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Eye,
    LogOut,
    Plus,
    Edit2,
    Trash2,
    X,
    Save,
    Search,
    ChevronDown,
    ArrowRight
} from 'lucide-react';

export default function Devop() {
    const { projects, addProject, updateProject, deleteProject } = useProjects();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'visuboard'>('dashboard');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
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
        document.title = "Admin Dashboard | Briac";
    }, []);

    const resetForm = () => {
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
        setEditingId(null);
        setIsFormOpen(false);
    };

    const handleEdit = (project: Project) => {
        setFormData({
            title: project.title,
            description: project.description,
            imageUrl: project.imageUrl,
            link: project.link,
            languages: project.languages.join(', '),
            domain: project.domain,
            isBest: project.isBest,
            isRecent: project.isRecent,
        });
        setEditingId(project.id);
        setIsFormOpen(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let processedImageUrl = formData.imageUrl.trim();
        if (processedImageUrl && !processedImageUrl.startsWith('http') && !processedImageUrl.startsWith('/')) {
            processedImageUrl = '/' + processedImageUrl;
        }

        const projectData = {
            ...formData,
            imageUrl: processedImageUrl,
            languages: formData.languages.split(',').map(l => l.trim()).filter(Boolean),
        };

        if (editingId) {
            updateProject(editingId, projectData);
        } else {
            addProject(projectData);
        }
        resetForm();
    };

    // Shared "Add Project" Button for convenience
    const AddProjectButton = () => {
        if (!import.meta.env.DEV) return null;

        return (
            <button
                onClick={() => {
                    if (isFormOpen && editingId) resetForm();
                    else {
                        setIsFormOpen(!isFormOpen);
                        if (!isFormOpen) resetForm();
                    }
                }}
                className="group relative px-6 py-2 rounded-full font-['Paris2024'] flex items-center gap-2 overflow-hidden transition-all duration-300"
            >
                <div className={`absolute inset-0 bg-gradient-to-r from-[#00f2ff] to-[#0055ff] opacity-80 group-hover:opacity-100 transition-opacity`}></div>
                <span className="relative z-10 text-white font-bold tracking-wider flex items-center gap-2">
                    {isFormOpen ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {isFormOpen ? 'FERMER' : 'NOUVEAU PROJET'}
                </span>
            </button>
        );
    };

    return (
        <div className="min-h-screen bg-skin-base text-skin-text-main font-sans selection:bg-blue-500/30 relative overflow-x-hidden dark">
            <NeuralNetworkBackground />

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-skin-base/80 backdrop-blur-md border-b border-white/10">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="text-2xl font-['Paris2024'] bg-gradient-to-r from-[#00f2ff] to-[#0055ff] bg-clip-text text-transparent">
                        BRIAC.ADMIN
                    </Link>

                    <div className="flex items-center gap-6">
                        {import.meta.env.DEV && (
                            <div className="hidden md:flex text-sm text-skin-text-secondary">
                                Connecté en tant que <span className="text-[#00f2ff] ml-1">Admin</span>
                            </div>
                        )}
                        <Link
                            to="/logout"
                            className="flex items-center gap-2 text-skin-text-secondary hover:text-red-400 transition-colors"
                            onClick={() => alert('Logout clicked simulated')}
                        >
                            <LogOut className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 container mx-auto px-4 pt-32 pb-20">

                {/* Header & Tabs */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-['Paris2024'] mb-2">TABLEAU DE BORD</h1>
                        <p className="text-skin-text-secondary font-['Baskerville'] italic">
                            Gérez vos projets et visualisez votre portfolio.
                        </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-full p-1 flex items-center gap-1">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`
                                px-6 py-2 rounded-full font-['Paris2024'] transition-all duration-300 flex items-center gap-2
                                ${activeTab === 'dashboard'
                                    ? 'bg-[#00f2ff]/20 text-[#00f2ff] shadow-[0_0_15px_rgba(0,242,255,0.3)]'
                                    : 'text-skin-text-secondary hover:text-white hover:bg-white/5'}
                            `}
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            DASHBOARD
                        </button>
                        <button
                            onClick={() => setActiveTab('visuboard')}
                            className={`
                                px-6 py-2 rounded-full font-['Paris2024'] transition-all duration-300 flex items-center gap-2
                                ${activeTab === 'visuboard'
                                    ? 'bg-[#00f2ff]/20 text-[#00f2ff] shadow-[0_0_15px_rgba(0,242,255,0.3)]'
                                    : 'text-skin-text-secondary hover:text-white hover:bg-white/5'}
                            `}
                        >
                            <Eye className="w-4 h-4" />
                            VISUBOARD
                        </button>
                    </div>
                </div>

                {/* Main Action Bar */}
                <div className="flex justify-end mb-8">
                    <AddProjectButton />
                </div>

                {/* Form Modal / Panel */}
                <AnimatePresence>
                    {isFormOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mb-12"
                        >
                            <div className="bg-white/5 backdrop-blur-md border border-[#00f2ff]/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(0,242,255,0.05)]">
                                <h2 className="text-2xl font-['Paris2024'] text-[#00f2ff] mb-6 border-b border-white/10 pb-4">
                                    {editingId ? 'MODIFIER LE PROJET' : 'NOUVEAU PROJET'}
                                </h2>
                                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-skin-text-secondary uppercase tracking-wider">Titre</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#00f2ff] focus:ring-1 focus:ring-[#00f2ff] outline-none transition-all"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-skin-text-secondary uppercase tracking-wider">Domaine</label>
                                        <select
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#00f2ff] focus:ring-1 focus:ring-[#00f2ff] outline-none transition-all"
                                            value={formData.domain}
                                            onChange={e => setFormData({ ...formData, domain: e.target.value })}
                                        >
                                            <option value="DÉVELOPPEMENT WEB">DÉVELOPPEMENT WEB</option>
                                            <option value="RÉSEAUX INFORMATIQUES">RÉSEAUX INFORMATIQUES</option>
                                            <option value="INTELLIGENCE ARTIFICIELLE">INTELLIGENCE ARTIFICIELLE</option>
                                            <option value="TÉLÉCOMMUNICATIONS">TÉLÉCOMMUNICATIONS</option>
                                            <option value="PROGRAMMATION">PROGRAMMATION</option>
                                            <option value="ADMINISTRATION">ADMINISTRATION</option>
                                            <option value="ADMINISTRATION RÉSEAU">ADMINISTRATION RÉSEAU</option>
                                        </select>
                                    </div>

                                    <div className="col-span-2 space-y-2">
                                        <label className="text-sm font-bold text-skin-text-secondary uppercase tracking-wider">Description</label>
                                        <textarea
                                            required
                                            rows={3}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#00f2ff] focus:ring-1 focus:ring-[#00f2ff] outline-none transition-all"
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-skin-text-secondary uppercase tracking-wider">Image URL</label>
                                        <input
                                            type="text"
                                            placeholder="/assets/..."
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#00f2ff] focus:ring-1 focus:ring-[#00f2ff] outline-none transition-all"
                                            value={formData.imageUrl}
                                            onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-skin-text-secondary uppercase tracking-wider">Lien Projet</label>
                                        <input
                                            type="text"
                                            placeholder="https://..."
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#00f2ff] focus:ring-1 focus:ring-[#00f2ff] outline-none transition-all"
                                            value={formData.link}
                                            onChange={e => setFormData({ ...formData, link: e.target.value })}
                                        />
                                    </div>

                                    <div className="col-span-2 space-y-2">
                                        <label className="text-sm font-bold text-skin-text-secondary uppercase tracking-wider">Langages (séparés par des virgules)</label>
                                        <input
                                            type="text"
                                            placeholder="React, Python, ..."
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#00f2ff] focus:ring-1 focus:ring-[#00f2ff] outline-none transition-all"
                                            value={formData.languages}
                                            onChange={e => setFormData({ ...formData, languages: e.target.value })}
                                        />
                                    </div>

                                    <div className="col-span-2 flex gap-8 pt-4 border-t border-white/5">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.isBest ? 'bg-[#00f2ff] border-[#00f2ff]' : 'border-white/30'}`}>
                                                {formData.isBest && <div className="w-3 h-3 bg-black rounded-sm" />}
                                            </div>
                                            <input type="checkbox" className="hidden" checked={formData.isBest} onChange={e => setFormData({ ...formData, isBest: e.target.checked })} />
                                            <span className="text-sm font-medium group-hover:text-white transition-colors">Meilleur Projet (Best)</span>
                                        </label>

                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.isRecent ? 'bg-[#00f2ff] border-[#00f2ff]' : 'border-white/30'}`}>
                                                {formData.isRecent && <div className="w-3 h-3 bg-black rounded-sm" />}
                                            </div>
                                            <input type="checkbox" className="hidden" checked={formData.isRecent} onChange={e => setFormData({ ...formData, isRecent: e.target.checked })} />
                                            <span className="text-sm font-medium group-hover:text-white transition-colors">Projet Récent</span>
                                        </label>
                                    </div>

                                    <div className="col-span-2 flex justify-end gap-4 mt-4">
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="px-6 py-3 rounded-lg border border-white/20 hover:bg-white/5 text-skin-text-secondary hover:text-white transition-colors font-bold tracking-wide text-sm"
                                        >
                                            ANNULER
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#00f2ff] to-[#0055ff] text-white font-bold tracking-wide text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all transform hover:-translate-y-0.5"
                                        >
                                            {editingId ? 'METTRE À JOUR' : 'ENREGISTRER'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* --- DASHBOARD VIEW (LIST) --- */}
                {activeTab === 'dashboard' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/10 bg-black/20 flex justify-between items-center">
                                <h3 className="font-['Paris2024'] text-xl">PROJETS EXISTANTS ({projects.length})</h3>
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher..."
                                        className="bg-black/30 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm outline-none focus:border-[#00f2ff]/50 w-64"
                                    />
                                </div>
                            </div>

                            <div className="divide-y divide-white/5">
                                {projects.map((project) => (
                                    <div key={project.id} className="p-6 hover:bg-white/5 transition-colors flex items-center justify-between group">
                                        <div className="flex-1 pr-8">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="font-bold text-lg text-white">{project.title}</h4>
                                                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/20">
                                                    {project.domain}
                                                </span>
                                                {project.isBest && <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">★ BEST</span>}
                                                {project.isRecent && <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">RECENT</span>}
                                            </div>

                                            {/* Tag Visibility Fix: Explicit high contrast colors */}
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {project.languages.map((lang, idx) => (
                                                    <span key={idx} className="text-xs font-mono px-2 py-1 rounded bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/20">
                                                        {lang}
                                                    </span>
                                                ))}
                                            </div>

                                            <p className="text-sm text-skin-text-secondary line-clamp-1">{project.description}</p>
                                        </div>

                                        <div className="flex items-center gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(project)}
                                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 transition-colors text-sm font-medium"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                <span className="hidden sm:inline">Modifier</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
                                                        deleteProject(project.id);
                                                    }
                                                }}
                                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 transition-colors text-sm font-medium"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                <span className="hidden sm:inline">Supprimer</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* --- VISUBOARD VIEW (CARDS) --- */}
                {activeTab === 'visuboard' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {projects.map((project) => (
                            <motion.div
                                key={project.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-[#00f2ff]/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,242,255,0.15)] flex flex-col h-full"
                            >
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
                                    <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                                        {project.isBest && <span className="bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 rounded shadow-lg">★ BEST</span>}
                                        {project.isRecent && <span className="bg-green-500 text-black text-[10px] font-bold px-2 py-1 rounded shadow-lg">NEW</span>}
                                    </div>
                                    <div className="absolute bottom-4 left-4 z-20">
                                        <span className="text-[#00f2ff] text-xs font-bold tracking-wider uppercase bg-black/50 px-2 py-1 rounded border border-[#00f2ff]/30">
                                            {project.domain}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-['Paris2024'] mb-3 group-hover:text-[#00f2ff] transition-colors line-clamp-1" title={project.title}>
                                        {project.title}
                                    </h3>

                                    <p className="text-skin-text-secondary text-sm mb-4 line-clamp-3">
                                        {project.description}
                                    </p>

                                    {/* Tag Visibility Fix: Explicit high contrast colors */}
                                    <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                                        {project.languages.slice(0, 3).map((lang, idx) => (
                                            <span key={idx} className="text-[10px] bg-[#00f2ff]/10 border border-[#00f2ff]/20 rounded px-2 py-1 text-[#00f2ff]">
                                                {lang}
                                            </span>
                                        ))}
                                        {project.languages.length > 3 && (
                                            <span className="text-[10px] text-gray-500 self-center">+{project.languages.length - 3}</span>
                                        )}
                                    </div>

                                    {import.meta.env.DEV && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(project)}
                                                className="flex-1 py-2 rounded-lg border border-white/10 hover:bg-white/10 text-xs font-bold tracking-wider transition-colors"
                                            >
                                                EDITER
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </main>
        </div>
    );
}
