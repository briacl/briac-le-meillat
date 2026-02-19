import React, { useState, useEffect } from 'react';
import Navbar from '@/Components/Navbar';
import NeuralNetworkBackground from '@/Components/NeuralNetworkBackground';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Inscription - briac-le-meillat";
    }, []);

    const [step, setStep] = useState(1);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordFeedback, setPasswordFeedback] = useState("Au moins 8 caractères, 1 majuscule, 1 chiffre.");
    const [recoveryKey, setRecoveryKey] = useState('');
    const [showEmergencyModal, setShowEmergencyModal] = useState(false);
    const [emergencyConfirmed, setEmergencyConfirmed] = useState(false);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const password = e.target.value;
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;

        setPasswordStrength(strength);

        if (password.length === 0) {
            setPasswordFeedback("Au moins 8 caractères, 1 majuscule, 1 chiffre.");
        } else if (strength === 1) {
            setPasswordFeedback("Faible : Ajoutez des chiffres et majuscules");
        } else if (strength === 2) {
            setPasswordFeedback("Moyen : 8 caractères minimum requis");
        } else if (strength >= 3) {
            setPasswordFeedback("Fort : Mot de passe sécurisé");
        }
    };

    const generateEmergencyKit = () => {
        const key = "MED-" + Math.random().toString(36).substr(2, 4).toUpperCase() + "-" + Math.random().toString(36).substr(2, 4).toUpperCase() + "-SECURE";
        setRecoveryKey(key);
        setShowEmergencyModal(true);
    };

    const copyKey = () => {
        navigator.clipboard.writeText(recoveryKey);
        // Toast logic would go here
        alert("Clé copiée !");
    };

    const completeRegistration = () => {
        console.log("Registration complete");
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative font-sans text-gray-900 dark:text-skin-text-main bg-[#f8f9fa] dark:bg-skin-base overflow-hidden transition-colors duration-300">
            <Navbar />
            <div className="absolute inset-0 z-0">
                <NeuralNetworkBackground />
            </div>

            <div className="w-full max-w-[500px] bg-white/80 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl p-10 shadow-2xl relative z-10 animate-fade-in backdrop-blur-[10px] transition-colors duration-300">
                <div className="flex justify-center items-end gap-3 mb-8">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#00f2ff] to-[#0055ff] text-white text-xl shadow-lg">
                        <i className="fa-solid fa-brain"></i>
                    </div>
                    <div className="font-['Plus_Jakarta_Sans'] font-bold text-2xl text-gray-900 dark:text-white uppercase tracking-wide">
                        briac-le-meillat <span className="text-sm font-normal text-[#0055ff] ml-1">Secure</span>
                    </div>
                </div>

                <div className="flex justify-between mb-8 relative">
                    <div className="absolute top-[14px] left-0 w-full h-[2px] bg-gray-200 z-0"></div>
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`w-8 h-8 rounded-full border-2 z-10 flex items-center justify-center font-semibold text-sm transition-all duration-300 ${step >= s ? 'border-[#0055ff] bg-white text-[#0055ff]' : 'border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-400 dark:text-gray-500'
                                } ${step > s ? '!bg-[#0055ff] !text-white' : ''} ${step === s ? 'shadow-[0_0_10px_rgba(0,85,255,0.4)]' : ''}`}
                        >
                            {step > s ? <i className="fa-solid fa-check"></i> : s}
                        </div>
                    ))}
                </div>

                {step === 1 && (
                    <div className="animate-slide-in">
                        <h3 className="text-xl font-semibold mb-6 text-center text-gray-900 dark:text-white">Identité</h3>
                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-500">Nom complet</label>
                            <input type="text" className="w-full p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#0055ff] focus:ring-2 focus:ring-[#0055ff]/10 transition-all" placeholder="ex: Jean Dupont" />
                        </div>
                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-500">Email professionnel</label>
                            <input type="email" className="w-full p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#0055ff] focus:ring-2 focus:ring-[#0055ff]/10 transition-all" placeholder="jean@hopital.fr" />
                        </div>

                        <button
                            className="w-full mt-8 py-3 px-6 bg-[#0055ff] text-white rounded-lg font-semibold shadow-lg shadow-blue-500/30 hover:bg-[#0044cc] hover:-translate-y-px transition-all"
                            onClick={() => setStep(2)}
                        >
                            Continuer
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-slide-in">
                        <h3 className="text-xl font-semibold mb-2 text-center text-gray-900 dark:text-white">Sécurité</h3>
                        <p className="text-center text-gray-500 dark:text-gray-400 mb-6 text-sm">Créez un mot de passe maître fort.</p>

                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-500">Mot de passe maître</label>
                            <input type="password" onChange={handlePasswordChange} className="w-full p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-[#0055ff] focus:ring-2 focus:ring-[#0055ff]/10 transition-all" />
                            <div className="flex h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
                                <div className={`flex-1 transition-colors duration-300 border-r border-white ${passwordStrength >= 1 ? (passwordStrength === 1 ? 'bg-red-500' : passwordStrength === 2 ? 'bg-orange-400' : 'bg-green-500') : 'bg-transparent'}`}></div>
                                <div className={`flex-1 transition-colors duration-300 border-r border-white ${passwordStrength >= 2 ? (passwordStrength === 2 ? 'bg-orange-400' : 'bg-green-500') : 'bg-transparent'}`}></div>
                                <div className={`flex-1 transition-colors duration-300 ${passwordStrength >= 3 ? 'bg-green-500' : 'bg-transparent'}`}></div>
                            </div>
                            <p className="text-xs mt-2 text-gray-500">{passwordFeedback}</p>
                        </div>
                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-500">Confirmer le mot de passe</label>
                            <input type="password" className="w-full p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-[#0055ff] focus:ring-2 focus:ring-[#0055ff]/10 transition-all" />
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button className="flex-1 py-3 px-6 bg-transparent border border-gray-300 text-gray-700 rounded-lg font-medium hover:border-[#0055ff] hover:text-[#0055ff] hover:bg-blue-50 transition-all" onClick={() => setStep(1)}>Retour</button>
                            <button
                                className="flex-1 py-3 px-6 bg-[#0055ff] text-white rounded-lg font-semibold shadow-lg shadow-blue-500/30 hover:bg-[#0044cc] hover:-translate-y-px transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={passwordStrength < 3}
                                onClick={() => setStep(3)}
                            >
                                Continuer
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-slide-in text-center">
                        <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 shadow-sm border border-green-100">
                            <i className="fa-solid fa-check"></i>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Compte créé !</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">Dernière étape : votre kit de secours.</p>

                        <button
                            className="w-full py-3 px-6 bg-red-500 text-white rounded-lg font-semibold shadow-lg shadow-red-500/30 hover:bg-red-600 hover:-translate-y-px transition-all border-none"
                            onClick={generateEmergencyKit}
                        >
                            Générer mon Kit de Secours
                        </button>
                    </div>
                )}
            </div>

            {/* Emergency Modal */}
            {showEmergencyModal && (
                <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-[480px] shadow-2xl border border-red-100 text-center animate-scale-in">
                        <i className="fa-solid fa-life-ring text-4xl text-red-500 mb-4 block"></i>
                        <h3 className="text-2xl font-semibold mb-2 text-gray-900">Kit de Secours</h3>
                        <p className="text-gray-500 mb-6 leading-relaxed">ATTENTION : Cette clé est le SEUL moyen de récupérer votre compte si vous perdez votre mot de passe.</p>

                        <div className="bg-gray-900 text-[#00f2ff] font-mono p-6 rounded-lg text-xl tracking-widest mb-6 border border-blue-900/50 shadow-inner select-all relative overflow-hidden group">
                            {recoveryKey}
                            <div className="absolute inset-0 bg-blue-500/5 pointer-events-none group-hover:bg-blue-500/10 transition-colors"></div>
                        </div>

                        <div className="flex gap-4 mb-6">
                            <button className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 text-sm font-medium" onClick={copyKey}>
                                <i className="fa-regular fa-copy"></i> Copier
                            </button>
                            <button className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 text-sm font-medium">
                                <i className="fa-solid fa-download"></i> PDF
                            </button>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg border border-red-100 mb-6 text-left">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input type="checkbox" className="mt-1 accent-red-500" checked={emergencyConfirmed} onChange={(e) => setEmergencyConfirmed(e.target.checked)} />
                                <span className="text-sm text-red-700 font-medium">Je confirme avoir sauvegardé cette clé en lieu sûr. Je comprends qu'elle ne pourra plus jamais être affichée.</span>
                            </label>
                        </div>

                        <button
                            className="w-full py-3 px-6 bg-[#0055ff] text-white rounded-lg font-semibold shadow-lg shadow-blue-500/30 hover:bg-[#0044cc] hover:-translate-y-px transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!emergencyConfirmed}
                            onClick={completeRegistration}
                        >
                            Accéder à l'application
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
