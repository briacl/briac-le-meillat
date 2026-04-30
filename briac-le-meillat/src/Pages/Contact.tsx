import React, { useState } from 'react';
import { Mail, User, Send, CheckCircle, ArrowRight, MessageSquare, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../Components/Navbar';
import UnifiedFooter from '../Components/UnifiedFooter';

export default function Contact() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const API_URL = 'https://api-contact-berangere-development.briac-le-meillat.workers.dev';

    const handleSubmit = async (e: React.FormEvent | React.MouseEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'contact',
                    ...formData
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Failed to send message');
            }

            setSuccess(true);
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setSuccess(false), 5000);
        } catch (error) {
            console.error('Error sending message:', error);
            // alert("Erreur lors de l'envoi du message. Vérifiez la console.");
        } finally {
            setLoading(false);
        }
    };

    const features = [
        {
            icon: Mail,
            title: "Email",
            description: "briac.le.meillat@gmail.com"
        },
        {
            icon: MessageSquare,
            title: "Réseaux Sociaux",
            description: "Github... Retrouvez-moi partout !"
        },
        {
            icon: MapPin,
            title: "Localisation",
            description: "IUT de Béthune, France"
        }
    ];

    return (
        <div className="min-h-screen bg-[#f5f5f7] transition-colors duration-300 relative font-sans flex flex-col">
            <Navbar />

            {/* Content Container - Centered in the available space */}
            <div className="flex-grow flex items-center justify-center p-4 py-32 lg:py-20">
                <div className="relative z-10 w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Side - Contact Info */}
                    <div className="text-gray-900 pl-4 lg:pl-0 flex flex-col justify-center h-full transition-colors duration-300">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="mb-16"
                        >
                            <h1 className="text-xs font-bold tracking-[0.4em] text-blue-600 mb-6 uppercase font-mono">
                                The Architect's Office
                            </h1>
                            <div className="relative inline-block">
                                <p className="font-['Paris2024'] text-4xl md:text-5xl text-black leading-tight transition-colors duration-300 uppercase tracking-tighter">
                                    Commençons un <br /> nouveau projet ensemble.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="space-y-8"
                        >
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    className="flex gap-5"
                                >
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm group hover:border-blue-500 transition-all duration-300">
                                            <feature.icon className="h-5 w-5 text-blue-600" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest font-mono transition-colors duration-300">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-900 font-medium transition-colors duration-300">
                                            {feature.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="w-full max-w-[480px] mx-auto lg:mr-0">
                        <div className="bg-white border border-gray-200 rounded-[2rem] p-8 lg:p-12 shadow-xl shadow-gray-200/50 transition-colors duration-300">
                            {success ? (
                                <div className="text-center py-10 space-y-6 animate-scale-in">
                                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                                        <CheckCircle className="h-10 w-10 text-green-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-black mb-2">Message envoyé !</h3>
                                        <p className="text-gray-500">Je vous répondrai dès que possible.</p>
                                    </div>
                                    <button
                                        onClick={() => setSuccess(false)}
                                        className="text-sm text-blue-600 font-bold hover:underline mt-4"
                                    >
                                        Envoyer un autre message
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label htmlFor="name" className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-mono">
                                            Nom complet
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                            className="block w-full px-0 py-3 border-b border-gray-200 bg-transparent text-black placeholder-gray-300 focus:outline-none focus:border-blue-600 transition-all text-lg"
                                            placeholder="Votre nom"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label htmlFor="email" className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-mono">
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            className="block w-full px-0 py-3 border-b border-gray-200 bg-transparent text-black placeholder-gray-300 focus:outline-none focus:border-blue-600 transition-all text-lg"
                                            placeholder="vous@exemple.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label htmlFor="message" className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-mono">
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            rows={3}
                                            className="block w-full px-0 py-3 border-b border-gray-200 bg-transparent text-black placeholder-gray-300 focus:outline-none focus:border-blue-600 transition-all text-lg resize-none"
                                            placeholder="Votre projet en quelques mots..."
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="w-full flex justify-center items-center gap-2 py-4 px-4 rounded-full text-white bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-bold text-base disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                Envoyer le message
                                                <ArrowRight className="h-4 w-4" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <UnifiedFooter />
        </div>
    );
}
