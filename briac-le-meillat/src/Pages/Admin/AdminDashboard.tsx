import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Input,
    Button,
    Select,
    SelectItem,
    Divider
} from "@heroui/react";
import { Upload, Lock, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import Navbar from '@/Components/Navbar';
import NeuralNetworkBackground from '@/Components/NeuralNetworkBackground';
import GlassCard from '@/Components/GlassCard';

interface Course {
    titre: string;
    ue: string[];
    semestre: number;
}

interface CoursesData {
    [key: string]: Course;
}

const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function AdminDashboard() {
    const [password, setPassword] = useState('');
    const [title, setTitle] = useState('');
    const [selectedResource, setSelectedResource] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [courses, setCourses] = useState<CoursesData>({});

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/courses.json`)
            .then(res => res.json())
            .then(data => setCourses(data))
            .catch(err => console.error("Erreur chargement courses:", err));
    }, []);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !title || !selectedResource || !password) {
            setMessage({ type: 'error', text: 'Tous les champs sont obligatoires' });
            return;
        }

        setLoading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('resourceId', selectedResource);

        try {
            const WORKER_URL = "https://odd-wood-3b09.briac-le-meillat.workers.dev/"; // URL à adapter
            const response = await fetch(WORKER_URL, {
                method: 'POST',
                headers: {
                    'X-Admin-Password': password
                },
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'TP mis en ligne avec succès !' });
                setTitle('');
                setFile(null);
            } else {
                setMessage({ type: 'error', text: result.error || 'Erreur lors de l\'upload' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur technique de connexion au Worker' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 relative overflow-hidden">
            <Navbar />
            <NeuralNetworkBackground />

            <div className="relative z-10 max-w-4xl mx-auto pt-40 pb-20 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <GlassCard className="!p-0 overflow-hidden border-white/10 bg-zinc-900/40 backdrop-blur-3xl shadow-2xl">
                        <div className="p-8 md:p-12 border-b border-white/5 bg-gradient-to-br from-blue-600/10 to-purple-600/10">
                            <h1 className="text-4xl md:text-5xl font-['Paris2024'] uppercase tracking-tight mb-4">
                                Admin <span className="text-blue-500">Dashboard</span>
                            </h1>
                            <p className="text-zinc-400 font-['Baskerville'] italic text-lg">
                                Gestion du référentiel de compétences et des travaux pratiques.
                            </p>
                        </div>

                        <div className="p-8 md:p-12 space-y-10">
                            {/* Section Mot de passe */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <Lock size={18} />
                                    <span className="text-xs uppercase tracking-[0.2em] font-bold">Authentification</span>
                                </div>
                                <Input
                                    type="password"
                                    label="Mot de passe administrateur"
                                    placeholder="Entrez votre secret"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    variant="bordered"
                                    labelPlacement="outside"
                                    classNames={{
                                        input: "!text-white",
                                        label: "!text-white font-bold"
                                    }}
                                />
                            </div>

                            <Divider className="bg-white/5" />

                            {/* Section Upload */}
                            <form onSubmit={handleUpload} className="space-y-8">
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <Upload size={18} />
                                    <span className="text-xs uppercase tracking-[0.2em] font-bold">Nouveau Travail Pratique</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Titre du TP"
                                        placeholder="ex: TP 1 - Routage Statique"
                                        labelPlacement="outside"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        variant="bordered"
                                        classNames={{
                                            input: "!text-white",
                                            label: "!text-white font-bold"
                                        }}
                                    />

                                    <Select
                                        label="Ressource associée"
                                        placeholder="Sélectionnez une ressource"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        selectedKeys={selectedResource ? [selectedResource] : []}
                                        onSelectionChange={(keys) => setSelectedResource(Array.from(keys)[0] as string)}
                                        classNames={{
                                            value: "!text-white",
                                            label: "!text-white font-bold"
                                        }}
                                    >
                                        {Object.entries(courses).map(([id, course]) => (
                                            <SelectItem key={id} textValue={`${id} - ${course.titre}`}>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold">{id}</span>
                                                    <span className="text-xs text-zinc-500">{course.titre}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>

                                <div className="relative group">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 text-center group-hover:border-blue-500/50 transition-all duration-300 bg-white/5">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                                <FileText size={24} />
                                            </div>
                                            {file ? (
                                                <div className="space-y-1">
                                                    <p className="text-blue-400 font-bold">{file.name}</p>
                                                    <p className="text-xs text-zinc-500">{formatFileSize(file.size)}</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-1">
                                                    <p className="text-white font-bold">Cliquez ou glissez votre PDF</p>
                                                    <p className="text-xs text-zinc-500">Format PDF uniquement, max 10MB</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {message && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={`flex items-start gap-4 p-5 rounded-2xl border ${message.type === 'success'
                                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                                : 'bg-red-500/10 border-red-500/20 text-red-400'
                                            }`}
                                    >
                                        <div className="mt-0.5">
                                            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-bold text-sm uppercase tracking-wider">
                                                {message.type === 'success' ? 'Succès' : 'Erreur'}
                                            </p>
                                            <p className="text-sm opacity-90">{message.text}</p>
                                        </div>
                                    </motion.div>
                                )}

                                <Button
                                    type="submit"
                                    color="primary"
                                    size="lg"
                                    className="w-full h-16 rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20"
                                    isLoading={loading}
                                    startContent={!loading && <Upload size={20} />}
                                >
                                    Mettre en ligne sur GitHub
                                </Button>
                            </form>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </div>
    );
}
