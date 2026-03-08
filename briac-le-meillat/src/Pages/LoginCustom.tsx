import React, { useState, useEffect } from 'react';
import Navbar from '@/Components/Navbar';
import NeuralNetworkBackground from '@/Components/NeuralNetworkBackground';
import { useNavigate } from 'react-router-dom';

export default function LoginCustom() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Connexion - briac-le-meillat";
    }, []);

    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Mock login
        console.log("Login with:", { name, password });
        // In a real app, this would hit an API.
        // For static demo, we just navigate to the dashboard.
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative font-sans text-gray-900 bg-[#f8f9fa] overflow-hidden">
            <div className="absolute inset-0 z-0">
                <NeuralNetworkBackground />
            </div>

            <div className="w-full max-w-[500px] bg-white/5 border border-white/10 rounded-2xl p-10 shadow-2xl relative z-10 animate-fade-in backdrop-blur-[10px]">
                <div className="flex justify-center items-end gap-3 mb-8">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#0075FF] to-[#f336f0] text-white text-xl shadow-lg">
                        <i className="fa-solid fa-brain"></i>
                    </div>
                    <div className="font-['Plus_Jakarta_Sans'] font-bold text-2xl text-gray-900 uppercase tracking-wide">
                        briac-le-meillat <span className="text-sm font-normal text-[#0055ff] ml-1">Connect</span>
                    </div>
                </div>

                <div className="flex justify-between mb-8 relative">
                    <div className="absolute top-[14px] left-0 w-full h-[2px] bg-gray-200 z-0"></div>
                    {[1, 2].map((s) => (
                        <div
                            key={s}
                            className={`w-8 h-8 rounded-full border-2 z-10 flex items-center justify-center font-semibold text-sm transition-all duration-300 ${step >= s ? 'border-[#0055ff] bg-white text-[#0055ff]' : 'border-gray-200 bg-white text-gray-400'
                                } ${step > s ? '!bg-[#0055ff] !text-white' : ''} ${step === s ? 'shadow-[0_0_10px_rgba(0,85,255,0.4)]' : ''}`}
                        >
                            {step > s ? <i className="fa-solid fa-check"></i> : s}
                        </div>
                    ))}
                </div>

                {step === 1 && (
                    <div className="animate-slide-in">
                        <h3 className="text-xl font-semibold mb-6 text-center text-gray-900">Identité</h3>
                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-500">Nom complet</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-[#0055ff] focus:ring-2 focus:ring-[#0055ff]/10 transition-all"
                                placeholder="ex: Jean Dupon"
                            />
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
                        <h3 className="text-xl font-semibold mb-2 text-center text-gray-900">Sécurité</h3>
                        <p className="text-center text-gray-500 mb-6 text-sm">Entrez votre mot de passe.</p>

                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-500">Mot de passe</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-[#0055ff] focus:ring-2 focus:ring-[#0055ff]/10 transition-all"
                            />
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button className="flex-1 py-3 px-6 bg-transparent border border-gray-300 text-gray-700 rounded-lg font-medium hover:border-[#0055ff] hover:text-[#0055ff] hover:bg-blue-50 transition-all" onClick={() => setStep(1)}>Retour</button>
                            <button
                                className="flex-1 py-3 px-6 bg-[#0055ff] text-white rounded-lg font-semibold shadow-lg shadow-blue-500/30 hover:bg-[#0044cc] hover:-translate-y-px transition-all"
                                onClick={handleLogin}
                            >
                                Se connecter
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
