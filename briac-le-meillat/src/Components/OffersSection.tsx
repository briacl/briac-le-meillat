import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/Contexts/AuthContext';
import GlassCard from './GlassCard';

const OffersSection: React.FC = () => {
    const { user, isAuthenticated, hasAccessToReserved, requestReservedAccess } = useAuth();
    const location = useLocation();
    const [accessRequestLoading, setAccessRequestLoading] = useState(false);
    const [accessRequestMessage, setAccessRequestMessage] = useState<string | null>(null);

    const handleRequestAccess = async () => {
        if (!isAuthenticated) {
            // Redirect to login if not authenticated
            return;
        }
        
        if (hasAccessToReserved) {
            setAccessRequestMessage("Vous avez déjà accès au contenu Reserved !");
            return;
        }
        
        if (accessRequestLoading) return;
        
        try {
            setAccessRequestLoading(true);
            setAccessRequestMessage(null);
            
            const result = await requestReservedAccess();
            setAccessRequestMessage("Demande envoyée ! Vous recevrez une réponse par email.");
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Erreur lors de la demande";
            setAccessRequestMessage(errorMessage);
        } finally {
            setAccessRequestLoading(false);
        }
    };

    return (
        <section className="w-full flex items-center justify-center py-20 pointer-events-auto">
            <GlassCard className="w-full">
                <h2 className="text-[3rem] mb-12 text-[#0055ff] font-['Paris2024'] text-center tracking-wider">
                    MES OFFRES
                </h2>

                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 max-w-6xl mx-auto">
                    {/* FREE OFFER */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <GlassCard className="h-full flex flex-col p-8 bg-white/5 border-white/10">
                            <div className="text-center mb-6">
                                <h3 className="text-3xl font-bold text-white mb-2">Gratuit</h3>
                                <p className="text-lg text-gray-300">Accès public</p>
                            </div>
                            
                            <div className="flex-1 space-y-4 mb-8">
                                <div className="flex items-center gap-3">
                                    <span className="text-green-400">✓</span>
                                    <span className="text-gray-200">Accès à tous les projets publics</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-green-400">✓</span>
                                    <span className="text-gray-200">Recherches et analyses</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-green-400">✓</span>
                                    <span className="text-gray-200">Consultation du CV</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-green-400">✓</span>
                                    <span className="text-gray-200">Formulaire de contact</span>
                                </div>
                            </div>

                            <button className="w-full py-3 px-6 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-colors">
                                Accès libre
                            </button>
                        </GlassCard>
                    </motion.div>

                    {/* RESERVED OFFER */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <GlassCard className="h-full flex flex-col p-8 bg-gradient-to-br from-[#0055ff]/20 to-[#00f2ff]/20 border-[#00f2ff]/30">
                            <div className="text-center mb-6">
                                <h3 className="text-3xl font-bold bg-gradient-to-r from-[#00f2ff] to-[#0055ff] bg-clip-text text-transparent mb-2">
                                    Reserved
                                </h3>
                                <p className="text-lg text-gray-300">Contenu exclusif</p>
                            </div>
                            
                            <div className="flex-1 space-y-4 mb-8">
                                <div className="flex items-center gap-3">
                                    <span className="text-[#00f2ff]">★</span>
                                    <span className="text-gray-200">Tout l'accès gratuit</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[#00f2ff]">★</span>
                                    <span className="text-gray-200">Accès section "Textes"</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[#00f2ff]">★</span>
                                    <span className="text-gray-200">Accès section "Réalisations"</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[#00f2ff]">★</span>
                                    <span className="text-gray-200">Contenu exclusif non public</span>
                                </div>
                            </div>

                            {!isAuthenticated ? (
                                <Link 
                                    to="/login" 
                                    state={{ from: location }}
                                    className="w-full py-3 px-6 bg-gradient-to-r from-[#0055ff] to-[#00f2ff] text-white rounded-xl hover:opacity-90 transition-opacity font-semibold text-center block"
                                >
                                    Se connecter pour demander l'accès
                                </Link>
                            ) : hasAccessToReserved ? (
                                <button className="w-full py-3 px-6 bg-green-600 text-white rounded-xl font-semibold cursor-default">
                                    ✓ Accès accordé
                                </button>
                            ) : (
                                <div className="space-y-3">
                                    {accessRequestMessage ? (
                                        <div className={`p-3 rounded-lg text-sm text-center ${
                                            accessRequestMessage.includes('Demande envoyée') 
                                                ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                                                : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                        }`}>
                                            {accessRequestMessage}
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={handleRequestAccess}
                                            disabled={accessRequestLoading}
                                            className="w-full py-3 px-6 bg-gradient-to-r from-[#0055ff] to-[#00f2ff] text-white rounded-xl hover:opacity-90 transition-opacity font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {accessRequestLoading ? 'Envoi en cours...' : 'Demander l\'accès'}
                                        </button>
                                    )}
                                </div>
                            )}
                        </GlassCard>
                    </motion.div>
                </div>
            </GlassCard>
        </section>
    );
};

export default OffersSection;