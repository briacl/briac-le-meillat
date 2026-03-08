import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/Contexts/AuthContext';
import { CheckCircle, XCircle, Clock, User, Mail } from 'lucide-react';
import GlassCard from '@/Components/GlassCard';
import Navbar from '@/Components/Navbar';
import NeuralNetworkBackground from '@/Components/NeuralNetworkBackground';

interface AccessRequest {
    name: string;
    email: string;
    date: string;
    status: 'pending' | 'approved' | 'rejected';
    processed_date?: string;
}

const AdminPanel: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const [requests, setRequests] = useState<AccessRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Simple admin check - in production, use proper role-based authentication
    const isAdmin = user?.email === 'briac.le.meillat@gmail.com' || 
                    import.meta.env.DEV || 
                    import.meta.env.MODE === 'development';

    useEffect(() => {
        if (!isAuthenticated || !isAdmin) {
            return;
        }
        loadRequests();
    }, [isAuthenticated, isAdmin]);

    const loadRequests = async () => {
        try {
            setLoading(true);
            const API_URL = import.meta.env.VITE_API_URL as string;
            const response = await fetch(`${API_URL}/admin/requests`);
            
            if (!response.ok) {
                throw new Error('Erreur lors du chargement des demandes');
            }
            
            const data = await response.json();
            setRequests(data.sort((a: AccessRequest, b: AccessRequest) => 
                new Date(b.date).getTime() - new Date(a.date).getTime()
            ));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (email: string) => {
        if (!confirm(`Approuver la demande de ${email} ?`)) return;
        
        try {
            const API_URL = import.meta.env.VITE_API_URL as string;
            const response = await fetch(`${API_URL}/admin/requests/${email}/approve`, {
                method: 'POST',
            });
            
            if (!response.ok) {
                throw new Error("Erreur lors de l'approbation");
            }
            
            await loadRequests(); // Reload the requests
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Erreur inconnue');
        }
    };

    const handleReject = async (email: string) => {
        if (!confirm(`Rejeter la demande de ${email} ?`)) return;
        
        try {
            const API_URL = import.meta.env.VITE_API_URL as string;
            const response = await fetch(`${API_URL}/admin/requests/${email}/reject`, {
                method: 'POST',
            });
            
            if (!response.ok) {
                throw new Error('Erreur lors du rejet');
            }
            
            await loadRequests(); // Reload the requests
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Erreur inconnue');
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'approved':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'rejected':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return null;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending':
                return 'En attente';
            case 'approved':
                return 'Approuvée';
            case 'rejected':
                return 'Rejetée';
            default:
                return status;
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-skin-base text-skin-text-main font-sans selection:bg-blue-500/30 relative overflow-hidden">
                <Navbar />
                <NeuralNetworkBackground />
                <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
                    <GlassCard className="max-w-md text-center">
                        <h1 className="text-2xl font-['Paris2024'] text-[#0055ff] mb-4">Accès refusé</h1>
                        <p className="text-skin-text-secondary">Vous devez être connecté pour accéder à cette page.</p>
                    </GlassCard>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-skin-base text-skin-text-main font-sans selection:bg-blue-500/30 relative overflow-hidden">
                <Navbar />
                <NeuralNetworkBackground />
                <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
                    <GlassCard className="max-w-md text-center">
                        <h1 className="text-2xl font-['Paris2024'] text-[#0055ff] mb-4">Accès refusé</h1>
                        <p className="text-skin-text-secondary">Vous n'avez pas les permissions administrateur.</p>
                    </GlassCard>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-skin-base text-skin-text-main font-sans selection:bg-blue-500/30 relative overflow-hidden">
            <Navbar />
            <NeuralNetworkBackground />
            
            <div className="relative z-10 w-[95%] max-w-[1920px] mx-auto pt-32 pb-20">
                <GlassCard className="w-full !items-stretch !text-left !p-8 md:!p-12 border-white/10 bg-black/40 backdrop-blur-xl">
                    <header className="mb-12 text-center w-full">
                        <h1 className="font-['Paris2024'] text-5xl md:text-7xl bg-gradient-to-br from-[#0075FF] to-[#f336f0] bg-clip-text text-transparent mb-6">
                            PANEL ADMIN
                        </h1>
                        <p className="font-['Baskerville'] text-xl max-w-2xl mx-auto text-skin-text-secondary italic">
                            Gestion des demandes d'accès Reserved
                        </p>
                    </header>

                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00f2ff]"></div>
                            <p className="mt-4 text-skin-text-secondary">Chargement des demandes...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20">
                            <p className="text-red-500">{error}</p>
                            <button 
                                onClick={loadRequests}
                                className="mt-4 px-4 py-2 bg-[#0055ff] text-white rounded-lg hover:bg-[#0044cc] transition-colors"
                            >
                                Réessayer
                            </button>
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-skin-text-secondary">Aucune demande d'accès pour le moment.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {requests.map((request, index) => (
                                <motion.div
                                    key={request.email}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white/5 rounded-xl border border-white/10 p-6 hover:border-[#00f2ff]/30 transition-colors"
                                >
                                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
                                        {/* User Info */}
                                        <div className="lg:col-span-2 space-y-2">
                                            <div className="flex items-center gap-3">
                                                <User className="w-4 h-4 text-[#00f2ff]" />
                                                <span className="font-semibold text-white">{request.name}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-300">{request.email}</span>
                                            </div>
                                            <p className="text-sm text-gray-400">
                                                Demandé le {new Date(request.date).toLocaleDateString('fr-FR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                            {request.processed_date && (
                                                <p className="text-sm text-gray-400">
                                                    Traité le {new Date(request.processed_date).toLocaleDateString('fr-FR', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            )}
                                        </div>

                                        {/* Status */}
                                        <div className="flex items-center gap-3">
                                            {getStatusIcon(request.status)}
                                            <span className={`font-semibold ${
                                                request.status === 'pending' ? 'text-yellow-400' :
                                                request.status === 'approved' ? 'text-green-400' :
                                                'text-red-400'
                                            }`}>
                                                {getStatusText(request.status)}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            {request.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(request.email)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                        Approuver
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(request.email)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                        Rejeter
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </GlassCard>
            </div>
        </div>
    );
};

export default AdminPanel;