import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import { Lock, User, Mail, Eye, EyeOff, Settings, Shield, ThumbsUp, Zap, CheckCircle, Smartphone, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type AuthStep = 'LOGIN' | 'SIGNUP' | 'VERIFY_EMAIL' | 'SETUP_2FA' | 'SUCCESS';

import Navbar from '../Components/Navbar';

export default function SignInSide() {
    const { login, signup, verifyEmail, setup2FA, verify2FA, authConfig } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname
        ? `${location.state.from.pathname}${location.state.from.search || ''}`
        : '/';

    const [step, setStep] = useState<AuthStep>('LOGIN');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form Data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        verificationCode: '',
        totpCode: ''
    });

    // 2FA Data
    const [qrCodeData, setQrCodeData] = useState<{ qr_code: string; secret: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            switch (step) {
                case 'LOGIN':
                    await login(formData.email, formData.password);
                    navigate(from);
                    break;

                case 'SIGNUP':
                    await signup(formData.name, formData.email, formData.password);

                    if (!authConfig.enable_email_verification) {
                        if (!authConfig.enable_2fa) {
                            setStep('SUCCESS');
                            setTimeout(() => {
                                navigate(from);
                            }, 2000);
                        } else {
                            // Email skipped, go to 2FA setup
                            const data = await setup2FA(formData.email);
                            setQrCodeData(data);
                            setStep('SETUP_2FA');
                        }
                    } else {
                        setStep('VERIFY_EMAIL');
                    }
                    break;

                case 'VERIFY_EMAIL':
                    await verifyEmail(formData.email, formData.verificationCode);

                    if (!authConfig.enable_2fa) {
                        setStep('SUCCESS');
                        setTimeout(() => {
                            navigate(from);
                        }, 2000);
                    } else {
                        // Fetch 2FA Setup data immediately after email verification
                        const data = await setup2FA(formData.email);
                        setQrCodeData(data);
                        setStep('SETUP_2FA');
                    }
                    break;

                case 'SETUP_2FA':
                    await verify2FA(formData.email, formData.totpCode);
                    setStep('SUCCESS');
                    setTimeout(() => {
                        navigate(from);
                    }, 2000);
                    break;
            }
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
            title: "Sécurité Maximale",
            description: "Authentification forte avec vérification d'email et double facteur (2FA)."
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

    const renderFormContent = () => {
        switch (step) {
            case 'VERIFY_EMAIL':
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="mx-auto w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                                <Mail className="h-6 w-6 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Vérifiez votre email</h3>
                            <p className="text-zinc-400 text-sm">
                                Un code à 6 caractères a été envoyé à <span className="text-white font-medium">{formData.email}</span>.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-zinc-300 ml-1">Code de vérification</label>
                            <input
                                type="text"
                                required
                                maxLength={6}
                                className="block w-full text-center tracking-[0.5em] text-2xl font-mono py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#00f2ff]/50 focus:border-[#00f2ff]/50 transition-all uppercase"
                                placeholder="------"
                                value={formData.verificationCode}
                                onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value.toUpperCase() })}
                            />
                        </div>
                    </div>
                );

            case 'SETUP_2FA':
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="mx-auto w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                                <Smartphone className="h-6 w-6 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Sécurisez votre compte</h3>
                            <p className="text-zinc-400 text-sm mb-4">
                                Scannez ce QR Code avec Google Authenticator ou Authy.
                            </p>

                            {qrCodeData && (
                                <div className="bg-white p-2 rounded-xl inline-block mb-4 shadow-lg shadow-white/10">
                                    <img
                                        src={`data:image/png;base64,${qrCodeData.qr_code}`}
                                        alt="QR Code 2FA"
                                        className="w-48 h-48 object-contain"
                                    />
                                </div>
                            )}

                            <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-lg border border-gray-200 dark:border-white/10 mb-4">
                                <p className="text-xs text-zinc-500 mb-1">Clé secrète (si scan impossible)</p>
                                <code className="text-[#00f2ff] font-mono text-sm select-all">
                                    {qrCodeData?.secret}
                                </code>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-zinc-300 ml-1">Code Authenticator (6 chiffres)</label>
                            <input
                                type="text"
                                required
                                maxLength={6}
                                inputMode="numeric"
                                className="block w-full text-center tracking-[0.5em] text-2xl font-mono py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#00f2ff]/50 focus:border-[#00f2ff]/50 transition-all"
                                placeholder="000000"
                                value={formData.totpCode}
                                onChange={(e) => setFormData({ ...formData, totpCode: e.target.value.replace(/[^0-9]/g, '') })}
                            />
                        </div>
                    </div>
                );

            case 'SUCCESS':
                return (
                    <div className="text-center py-10 space-y-6 animate-scale-in">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="h-10 w-10 text-green-400" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Félicitations !</h3>
                            <p className="text-gray-500 dark:text-zinc-400">Votre compte est sécurisé et prêt.</p>
                        </div>
                        <p className="text-sm text-zinc-500 animate-pulse">Redirection vers le dashboard...</p>
                    </div>
                );

            default: // LOGIN or SIGNUP
                return (
                    <>
                        <AnimatePresence>
                            {step === 'SIGNUP' && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
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
                                                required={step === 'SIGNUP'}
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#00f2ff]/50 focus:border-[#00f2ff]/50 sm:text-sm transition-all shadow-sm"
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
                            <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-zinc-300 ml-1">
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
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#00f2ff]/50 focus:border-[#00f2ff]/50 sm:text-sm transition-all shadow-sm"
                                    placeholder="vous@exemple.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-600 dark:text-zinc-300">
                                    Mot de passe
                                </label>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-[#00f2ff] transition-colors" />
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete={step === 'LOGIN' ? "current-password" : "new-password"}
                                    required
                                    className="block w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#00f2ff]/50 focus:border-[#00f2ff]/50 sm:text-sm transition-all shadow-sm"
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
                            {step === 'LOGIN' && (
                                <div className="flex justify-end">
                                    <button type="button" className="text-xs font-medium text-[#00f2ff] hover:text-[#00c9d4] hover:underline transition-all">
                                        Mot de passe oublié ?
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#020617] transition-colors duration-300 flex items-center justify-center p-4 relative overflow-hidden font-['Paris2024']">
            <Navbar />
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
                <div className="text-gray-900 dark:text-white pl-4 lg:pl-0 flex flex-col justify-center h-full transition-colors duration-300">
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
                            <p className="font-['Baskerville'] text-2xl text-gray-600 dark:text-gray-300 italic leading-relaxed transition-colors duration-300">
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
                                {step === 'LOGIN' ? 'Connexion' :
                                    step === 'SIGNUP' ? 'Inscription' :
                                        step === 'VERIFY_EMAIL' ? 'Vérification' :
                                            step === 'SETUP_2FA' ? '2FA' : 'Succès'}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-zinc-400 transition-colors duration-300">
                                {step === 'LOGIN' ? 'Ravi de vous revoir sur briac-le-meillat' :
                                    step === 'SIGNUP' ? 'Créez un compte pour commencer' :
                                        'Sécurisez votre compte'}
                            </p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>

                            {renderFormContent()}

                            {error && (
                                <div className="text-red-400 text-sm text-center bg-red-500/10 p-3 rounded-lg border border-red-500/20 animate-shake">
                                    {error}
                                </div>
                            )}

                            {step !== 'SUCCESS' && (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-black bg-gradient-to-r from-white to-gray-200 hover:to-white hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {loading ? (
                                        <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            {step === 'LOGIN' ? 'Se connecter' :
                                                step === 'SIGNUP' ? "S'inscrire" :
                                                    step === 'VERIFY_EMAIL' ? 'Vérifier Email' :
                                                        'Activer 2FA'}
                                            {(step === 'VERIFY_EMAIL' || step === 'SETUP_2FA') && <ArrowRight className="h-4 w-4" />}
                                        </>
                                    )}
                                </button>
                            )}

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="px-4 bg-gray-100 dark:bg-[#050b1d] text-gray-500 dark:text-zinc-500 rounded-full border border-gray-200 dark:border-white/5 transition-colors duration-300">ou</span>
                                </div>
                            </div>

                            <div className="text-center text-sm">
                                <div className="text-gray-500 dark:text-zinc-400 mb-2 transition-colors duration-300">
                                    {step === 'LOGIN' ? "Pas encore de compte ?" : "Vous avez déjà un compte ?"}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep(step === 'LOGIN' ? 'SIGNUP' : 'LOGIN');
                                        setError(null);
                                        setFormData({ name: '', email: '', password: '', verificationCode: '', totpCode: '' });
                                    }}
                                    className="font-semibold text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 py-2 px-6 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all"
                                >
                                    {step === 'LOGIN' ? "Créer un compte" : "Se connecter"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* Footer Style Copyright */}
            <div className="absolute bottom-4 w-full text-center text-zinc-700 text-xs">
                &copy; {new Date().getFullYear()} briac-le-meillat. All rights reserved.
            </div>
        </div>
    );
}
