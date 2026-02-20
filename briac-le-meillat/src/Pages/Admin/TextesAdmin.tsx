import React, { useState, useEffect } from 'react';
import Navbar from '@/Components/Navbar';
import NeuralNetworkBackground from '@/Components/NeuralNetworkBackground';
import GlassCard from '@/Components/GlassCard';
import { useTextes, Texte } from '@/Contexts/TexteContext';
import { Reorder } from 'framer-motion';
import { Plus, Edit, Trash, Save, ArrowLeft, GripVertical } from 'lucide-react';
import { Link } from 'react-router-dom';

const AVAILABLE_SERIES = ["Essais"];

export default function TextesAdmin() {
    const { textes, addTexte, updateTexte, deleteTexte, reorderTextes } = useTextes();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Texte>>({});
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        document.title = "Admin Textes | Briac Le Meillat";
    }, []);

    const startEdit = (texte: Texte) => {
        setEditingId(texte.id);
        setFormData({ ...texte });
        setIsCreating(false);
    };

    const startCreate = () => {
        setEditingId('new');
        setFormData({
            title: '',
            description: '',
            date: new Date().toISOString().split('T')[0],
            link: '#',
            contentPath: null,
            imageUrl: '',
            series: [],
        });
        setIsCreating(true);
    };

    const handleSave = () => {
        if (isCreating) {
            addTexte(formData as Omit<Texte, 'id' | 'createdAt'>);
        } else if (editingId) {
            updateTexte(editingId, formData);
        }
        setEditingId(null);
        setIsCreating(false);
    };

    const handleCancel = () => {
        setEditingId(null);
        setIsCreating(false);
    };

    const toggleSeries = (seriesName: string) => {
        const current = formData.series || [];
        setFormData({
            ...formData,
            series: current.includes(seriesName)
                ? current.filter(s => s !== seriesName)
                : [...current, seriesName],
        });
    };

    return (
        <div className="min-h-screen bg-skin-base text-skin-text-main font-sans selection:bg-blue-500/30 relative overflow-hidden">
            <Navbar />
            <NeuralNetworkBackground />

            <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/recherches?tab=textes"
                            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                            title="Retour au site"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <h1 className="font-['Paris2024'] text-3xl md:text-4xl text-white">
                            Admin <span className="text-[#00f2ff]">Textes</span>
                        </h1>
                    </div>
                    <button
                        onClick={startCreate}
                        disabled={!!editingId}
                        className="flex items-center gap-2 bg-[#00f2ff] text-black px-4 py-2 rounded-xl font-bold hover:bg-[#00c8d4] disabled:opacity-50 transition-all shadow-lg shadow-cyan-500/30"
                    >
                        <Plus className="w-5 h-5" /> Nouveau Texte
                    </button>
                </div>

                {/* EDIT/CREATE FORM MODAL */}
                {editingId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <GlassCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto !items-stretch text-left">
                            <h2 className="text-2xl font-bold text-white mb-6 text-center">
                                {isCreating ? 'Ajouter un texte' : 'Modifier le texte'}
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Titre</label>
                                    <input
                                        type="text"
                                        value={formData.title || ''}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:border-[#00f2ff] outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Description</label>
                                    <textarea
                                        rows={3}
                                        value={formData.description || ''}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:border-[#00f2ff] outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Date</label>
                                        <input
                                            type="date"
                                            value={formData.date || ''}
                                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:border-[#00f2ff] outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Lien</label>
                                        <input
                                            type="text"
                                            value={formData.link || ''}
                                            onChange={e => setFormData({ ...formData, link: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:border-[#00f2ff] outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Image URL (couverture, optionnel)</label>
                                    <input
                                        type="text"
                                        value={formData.imageUrl || ''}
                                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                        placeholder="https://... ou chemin relatif"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:border-[#00f2ff] outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Séries</label>
                                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                        {AVAILABLE_SERIES.map(series => (
                                            <label key={series} className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.series?.includes(series) || false}
                                                    onChange={() => toggleSeries(series)}
                                                    className="w-4 h-4 accent-[#00f2ff] rounded"
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
                                        className="flex items-center gap-2 px-6 py-2 bg-[#00f2ff] text-black rounded-lg font-bold hover:bg-[#00c8d4] shadow-lg shadow-cyan-500/20"
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
                    <Reorder.Group axis="y" values={textes} onReorder={reorderTextes} className="space-y-4">
                        {textes.map(texte => (
                            <Reorder.Item
                                key={texte.id}
                                value={texte}
                                className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center cursor-move"
                            >
                                <div className="text-white/30 hover:text-white/80 transition-colors">
                                    <GripVertical className="w-6 h-6" />
                                </div>

                                {/* Cover thumbnail */}
                                <div className="w-20 h-28 rounded-lg overflow-hidden bg-gradient-to-b from-[#0d2144] to-[#1a3a6c] flex-shrink-0 flex items-center justify-center text-white/20 text-xs text-center p-1">
                                    {texte.imageUrl ? (
                                        <img
                                            src={texte.imageUrl}
                                            alt={texte.title}
                                            className="w-full h-full object-cover"
                                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                        />
                                    ) : (
                                        <span className="font-['Baskerville'] italic text-[9px] leading-tight text-white/50 text-center line-clamp-4">
                                            {texte.title}
                                        </span>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0 text-center md:text-left">
                                    <h3 className="text-xl font-bold text-white truncate">{texte.title}</h3>
                                    <span className="text-xs text-[#00f2ff]/70 font-mono">{texte.date}</span>
                                    {texte.series && texte.series.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1 justify-center md:justify-start">
                                            {texte.series.map(s => (
                                                <span key={s} className="text-[10px] bg-[#00f2ff]/10 text-[#00f2ff] px-2 py-0.5 rounded border border-[#00f2ff]/20">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <p className="text-sm text-gray-400 truncate mt-1">{texte.description}</p>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => startEdit(texte)}
                                        className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"
                                        title="Modifier"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm('Supprimer ce texte ?')) {
                                                deleteTexte(texte.id);
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
                    {textes.length === 0 && (
                        <p className="text-center text-gray-500 py-12 font-['Paris2024']">Aucun texte. Créez le premier !</p>
                    )}
                </GlassCard>
            </div>
        </div>
    );
}
