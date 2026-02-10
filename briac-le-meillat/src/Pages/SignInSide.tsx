import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import { Lock, User, Mail, Eye, EyeOff, Settings, Shield, ThumbsUp, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SignInSide() {
    const { login, signup } = useAuth();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await signup(formData.name, formData.email, formData.password);
            }
            navigate('/recherches');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    const features = [
        {
            icon: Settings,
            title: "Adaptable performance",
            description: "Our product effortlessly adjusts to your needs, boosting efficiency and simplifying your tasks."
        },
        {
            icon: Shield,
            title: "Built to last",
            description: "Experience unmatched durability that goes above and beyond with lasting investment."
        },
        {
            icon: ThumbsUp,
            title: "Great user experience",
            description: "Integrate our product into your routine with an intuitive and easy-to-use interface."
        },
        {
            icon: Zap,
            title: "Innovative functionality",
            description: "Stay ahead with features that set new standards, addressing your evolving needs better than the rest."
        }
    ];

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-['Paris2024']">
            {/* Ambient Background Effects - Global for the page */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Moving Blobs */}
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
                <motion.div
                    animate={{
                        x: [0, 100, -50, 0],
                        y: [0, 100, -50, 0],
                        scale: [1, 1.5, 0.8, 1]
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: 5
                    }}
                    className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-cyan-500/10 rounded-full blur-[100px]"
                />

                {/* Overlay for depth */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(2,6,23,0),rgba(2,6,23,0.8))]" />
            </div>

            {/* Content Container - No Card Style */}
            <div className="relative z-10 w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                {/* Left Side - Feature List */}
                <div className="text-white pl-4 lg:pl-0 flex flex-col justify-center h-full">
                    {/* Brand Header & Quote */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-16"
                    >
                        <h1 className="text-sm font-bold tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ff] to-[#0055ff] mb-6 uppercase">
                            Briac Le Meillat
                        </h1>
                        <div className="relative inline-block">
                            <p className="font-['Baskerville'] text-2xl text-gray-300 italic leading-relaxed">
                                "L'intelligence artificielle n'est pas une fin en soi, mais un moyen d'augmenter l'intelligence humaine."
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
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg shadow-purple-500/5 backdrop-blur-sm group hover:scale-105 transition-transform duration-300">
                                        <feature.icon className="h-6 w-6 text-[#00f2ff]" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold text-white tracking-wide">
                                        {feature.title}
                                    </h3>
                                    <p className="text-zinc-400 leading-relaxed text-sm lg:text-base max-w-md">
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full max-w-[480px] mx-auto lg:mr-0">
                    <div className="bg-black/20 backdrop-blur-xl border border-white/5 rounded-3xl p-8 lg:p-10 shadow-2xl">
                        <div className="space-y-2 text-center mb-8">
                            <h2 className="text-3xl font-bold tracking-tight text-white">
                                {isLogin ? 'Connexion' : 'Inscription'}
                            </h2>
                            <p className="text-sm text-zinc-400">
                                {isLogin ? 'Ravi de vous revoir sur Synapseo' : 'Créez un compte pour commencer'}
                            </p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <AnimatePresence>
                                {!isLogin && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="block text-sm font-medium text-zinc-300 ml-1">
                                                Nom complet
                                            </label>
                                            <div className="relative group">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-[#00f2ff] transition-colors" />
                                                <input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    required={!isLogin}
                                                    className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#00f2ff]/50 focus:border-[#00f2ff]/50 sm:text-sm transition-all shadow-sm"
                                                    placeholder="Votre nom"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-zinc-300 ml-1">
                                    Email
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-[#00f2ff] transition-colors" />
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#00f2ff]/50 focus:border-[#00f2ff]/50 sm:text-sm transition-all shadow-sm"
                                        placeholder="vous@exemple.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
                                        Mot de passe
                                    </label>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-[#00f2ff] transition-colors" />
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete={isLogin ? "current-password" : "new-password"}
                                        required
                                        className="block w-full pl-10 pr-10 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#00f2ff]/50 focus:border-[#00f2ff]/50 sm:text-sm transition-all shadow-sm"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {isLogin && (
                                    <div className="flex justify-end">
                                        <button type="button" className="text-xs font-medium text-[#00f2ff] hover:text-[#00c9d4] hover:underline transition-all">
                                            Mot de passe oublié ?
                                        </button>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="text-red-400 text-sm text-center bg-red-500/10 p-3 rounded-lg border border-red-500/20 animate-shake">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-black bg-gradient-to-r from-white to-gray-200 hover:to-white hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {loading ? (
                                    <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                ) : (
                                    isLogin ? 'Se connecter' : "S'inscrire"
                                )}
                            </button>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="px-4 bg-[#050b1d] text-zinc-500 rounded-full border border-white/5">ou</span>
                                </div>
                            </div>

                            <div className="text-center text-sm">
                                <div className="text-zinc-400 mb-2">
                                    {isLogin ? "Pas encore de compte ?" : "Vous avez déjà un compte ?"}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setError(null);
                                        setFormData({ name: '', email: '', password: '' });
                                    }}
                                    className="font-semibold text-white border border-white/10 bg-white/5 py-2 px-6 rounded-lg hover:bg-white/10 hover:border-white/20 transition-all"
                                >
                                    {isLogin ? "Créer un compte" : "Se connecter"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* Footer Style Copyright */}
            <div className="absolute bottom-4 w-full text-center text-zinc-700 text-xs">
                &copy; {new Date().getFullYear()} Synapseo. All rights reserved.
            </div>
        </div>
    );
}
