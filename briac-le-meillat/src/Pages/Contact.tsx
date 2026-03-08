import React, { useState } from 'react';
import { Mail, User, Send, CheckCircle, ArrowRight, MessageSquare, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../Components/Navbar';

export default function Contact() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const API_URL = 'http://localhost:8001/api';

    const handleSubmit = async (e: React.FormEvent | React.MouseEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
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
            description: "LinkedIn, Twitter, Github... Retrouvez-moi partout !"
        },
        {
            icon: MapPin,
            title: "Localisation",
            description: "Paris, France & Remote"
        }
    ];

    return (
        <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#020617] transition-colors duration-300 flex items-center justify-center p-4 relative overflow-hidden font-['Paris2024']">
            <Navbar />

            {/* Ambient Background Effects */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        x: [0, 100, -100, 0],
                        y: [0, -100, 100, 0],
                        scale: [1, 1.2, 0.9, 1]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                    }}
                    className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        x: [0, -150, 50, 0],
                        y: [0, 50, -100, 0],
                        scale: [1, 1.3, 0.8, 1]
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px]"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(2,6,23,0),rgba(2,6,23,0.8))]" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                {/* Left Side - Contact Info */}
                <div className="text-gray-900 dark:text-white pl-4 lg:pl-0 flex flex-col justify-center h-full transition-colors duration-300">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-16"
                    >
                        <h1 className="text-sm font-bold tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-[#0075FF] to-[#f336f0] mb-6 uppercase">
                            Contactez-moi
                        </h1>
                        <div className="relative inline-block">
                            <p className="font-['Baskerville'] text-2xl text-gray-600 dark:text-gray-300 italic leading-relaxed transition-colors duration-300">
                                "Une idée ? Un projet ? Discutons-en ensemble."
                            </p>
                            <div className="absolute -bottom-4 left-0 w-24 h-[2px] bg-gradient-to-r from-[#00f2ff] to-transparent" />
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
                                    <div className="w-12 h-12 rounded-2xl bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-lg shadow-purple-500/5 backdrop-blur-sm group hover:scale-105 transition-all duration-300">
                                        <feature.icon className="h-6 w-6 text-[#00f2ff]" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white tracking-wide transition-colors duration-300">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-500 dark:text-zinc-400 leading-relaxed text-sm lg:text-base max-w-md transition-colors duration-300">
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full max-w-[480px] mx-auto lg:mr-0">
                    <div className="bg-white/80 dark:bg-black/20 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-3xl p-8 lg:p-10 shadow-2xl transition-colors duration-300">
                        <div className="space-y-2 text-center mb-8">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white transition-colors duration-300">
                                Me Contacter
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-zinc-400 transition-colors duration-300">
                                Remplissez le formulaire ci-dessous pour m'envoyer un message directement.
                            </p>
                        </div>

                        {success ? (
                            <div className="text-center py-10 space-y-6 animate-scale-in">
                                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle className="h-10 w-10 text-green-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Message envoyé !</h3>
                                    <p className="text-gray-500 dark:text-zinc-400">Je vous répondrai dès que possible.</p>
                                </div>
                                <button
                                    onClick={() => setSuccess(false)}
                                    className="text-sm text-[#00f2ff] hover:underline mt-4"
                                >
                                    Envoyer un autre message
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-600 dark:text-zinc-300 ml-1">
                                        Nom complet
                                    </label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-[#00f2ff] transition-colors" />
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#00f2ff]/50 focus:border-[#00f2ff]/50 sm:text-sm transition-all shadow-sm"
                                            placeholder="Votre nom"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-zinc-300 ml-1">
                                        Email
                                    </label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-[#00f2ff] transition-colors" />
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#00f2ff]/50 focus:border-[#00f2ff]/50 sm:text-sm transition-all shadow-sm"
                                            placeholder="vous@exemple.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-600 dark:text-zinc-300 ml-1">
                                        Message
                                    </label>
                                    <div className="relative group">
                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            rows={4}
                                            className="block w-full p-3 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#00f2ff]/50 focus:border-[#00f2ff]/50 sm:text-sm transition-all shadow-sm resize-none"
                                            placeholder="Votre message..."
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-black bg-gradient-to-r from-white to-gray-200 hover:to-white hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {loading ? (
                                        <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Envoyer le message
                                            <Send className="h-4 w-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="absolute bottom-4 w-full text-center text-zinc-700 text-xs">
                &copy; {new Date().getFullYear()} briac-le-meillat. All rights reserved.
            </div>
        </div>
    );
}
