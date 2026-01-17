import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/Components/Navbar';
import NeuralNetworkBackground from '@/Components/NeuralNetworkBackground';

export default function LandingPage() {
    useEffect(() => {
        document.title = "Synapseo - App Sécurisée";
    }, []);

    const scrollToNext = (e: React.MouseEvent) => {
        e.preventDefault();
        const nextSection = document.getElementById('next-section');
        nextSection?.scrollIntoView({ behavior: 'smooth' });
    };

    const [bgColor, setBgColor] = useState('#f8f9fa'); // Customizable white

    return (
        <div className="relative w-full min-h-screen overflow-x-hidden font-sans text-gray-900" style={{ backgroundColor: bgColor }}>
            <Navbar />

            {/* Container for the Neural Network Background */}
            <div className="fixed top-0 left-0 w-full h-full z-[0]">
                <NeuralNetworkBackground theme="light" />
            </div>

            {/* Overlay Content */}
            <div className="relative h-screen flex flex-col items-center justify-center z-[2] pointer-events-none content-overlay">
                <div className="flex flex-col items-center justify-center text-center">
                    <h1 className="font-['Paris2024'] text-[5rem] font-[200] tracking-[12px] m-0 uppercase bg-gradient-to-br from-[#00f2ff] to-[#0055ff] bg-clip-text text-transparent select-none drop-shadow-sm">
                        Briac Le Meillat
                    </h1>
                    <p className="font-['Paris2024'] text-[1.2rem] tracking-[4px] text-gray-700 mt-4 leading-normal text-center">
                        ÉTUDIANT EN <br />DÉVELOPPEMENT WEB, RÉSEAUX INFORMATIQUES, IA, ET TÉLÉCOMMUNICATIONS
                    </p>

                    <a
                        href="#next-section"
                        onClick={scrollToNext}
                        className="scroll-btn pointer-events-auto mt-12 bg-transparent border-2 border-blue-400 rounded-full w-[50px] h-[50px] flex items-center justify-center cursor-pointer transition-all duration-300 animate-bounce hover:border-blue-600 hover:shadow-[0_0_15px_rgba(0,140,255,0.5)]"
                    >
                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-blue-500">
                            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* Clear View Section --> Allows clicking on the background canvas */}
            <div className="min-h-[150vh] w-full relative z-[1] pointer-events-none">
                <div className="sticky top-0 h-screen flex items-center justify-center">
                    {/* This section is transparent and passes clicks through to the fixed background */}

                </div>
            </div>

            <div id="next-section" className="min-h-screen bg-white relative z-[2] shadow-xl flex flex-col items-center justify-center text-gray-900 p-8 overflow-hidden">
                {/* The Old Animation Background - Light Mode */}
                <NeuralNetworkBackground theme="light" className="opacity-40" />

                <div className="relative z-10 flex flex-col items-center">
                    <h2 className="text-[3rem] mb-8 text-[#0055ff]">Notre Vision</h2>
                    <p className="max-w-[800px] text-center leading-[1.6] text-[1.1rem] lowercase font-['Montserrat_Alternates'] text-gray-700">
                        Synapseo redéfinit la manière dont les informations de santé circulent. <br />
                        En connectant instantanément les acteurs clés du parcours de soin, nous créons un écosystème
                        où la donnée médicale est sécurisée, fluide et au service du patient.
                    </p>
                </div>
            </div>

            <div id="font-tests" className="min-h-screen bg-[#050a14] relative z-[2] py-16 px-8 text-white flex flex-col items-center gap-8">
                <h2 className="font-['Inter'] font-[200] mb-12">Propositions Finales</h2>

                <div className="w-full max-w-[1000px] grid grid-cols-2 gap-6 items-center text-center border-b border-[rgba(255,255,255,0.1)] pb-8">
                    <div className="col-span-full text-[0.9rem] text-[#00f2ff] opacity-80 mb-4 font-['Inter'] uppercase tracking-[2px] border-b border-dashed border-[rgba(0,242,255,0.3)] pb-2">
                        Option 1 : Paris2024 (MAJ) + Montserrat Alt (min)
                    </div>
                    <div className="text-[3.5rem] leading-[1.2] uppercase font-['Paris2024']">Synapseo</div>
                    <div className="text-[1.2rem] opacity-80 leading-[1.4] font-['Montserrat_Alternates']">
                        La connexion fluide entre médecins, pharmaciens et patients
                    </div>
                </div>

                <div className="w-full max-w-[1000px] grid grid-cols-2 gap-6 items-center text-center border-b border-[rgba(255,255,255,0.1)] pb-8">
                    <div className="col-span-full text-[0.9rem] text-[#00f2ff] opacity-80 mb-4 font-['Inter'] uppercase tracking-[2px] border-b border-dashed border-[rgba(0,242,255,0.3)] pb-2">
                        Option 2 : Paris2024 (min) + Montserrat Alt (min)
                    </div>
                    <div className="text-[3.5rem] leading-[1.2] font-['Paris2024']">Synapseo</div>
                    <div className="text-[1.2rem] opacity-80 leading-[1.4] font-['Montserrat_Alternates']">
                        La connexion fluide entre médecins, pharmaciens et patients
                    </div>
                </div>

                <div className="w-full max-w-[1000px] grid grid-cols-2 gap-6 items-center text-center">
                    <div className="col-span-full text-[0.9rem] text-[#00f2ff] opacity-80 mb-4 font-['Inter'] uppercase tracking-[2px] border-b border-dashed border-[rgba(0,242,255,0.3)] pb-2">
                        Option 3 : Monad (MAJ) + Montserrat Alt (min)
                    </div>
                    <div className="text-[3.5rem] leading-[1.2] uppercase font-['Monad']">Synapseo</div>
                    <div className="text-[1.2rem] opacity-80 leading-[1.4] font-['Montserrat_Alternates']">
                        La connexion fluide entre médecins, pharmaciens et patients
                    </div>
                </div>

            </div>

            {/* DUPLICATE FOR VISUALIZATION */}
            <div id="font-tests-2" className="min-h-screen bg-[#050a14] relative z-[2] py-16 px-8 text-white flex flex-col items-center gap-8 border-t border-white/10">
                <h2 className="font-['Inter'] font-[200] mb-12">Visualisation (Scroll Test)</h2>

                <div className="w-full max-w-[1000px] grid grid-cols-2 gap-6 items-center text-center border-b border-[rgba(255,255,255,0.1)] pb-8">
                    <div className="col-span-full text-[0.9rem] text-[#00f2ff] opacity-80 mb-4 font-['Inter'] uppercase tracking-[2px] border-b border-dashed border-[rgba(0,242,255,0.3)] pb-2">
                        Option 1 : Paris2024 (MAJ) + Montserrat Alt (min)
                    </div>
                    <div className="text-[3.5rem] leading-[1.2] uppercase font-['Paris2024']">Synapseo</div>
                    <div className="text-[1.2rem] opacity-80 leading-[1.4] font-['Montserrat_Alternates']">
                        La connexion fluide entre médecins, pharmaciens et patients
                    </div>
                </div>

                <div className="w-full max-w-[1000px] grid grid-cols-2 gap-6 items-center text-center border-b border-[rgba(255,255,255,0.1)] pb-8">
                    <div className="col-span-full text-[0.9rem] text-[#00f2ff] opacity-80 mb-4 font-['Inter'] uppercase tracking-[2px] border-b border-dashed border-[rgba(0,242,255,0.3)] pb-2">
                        Option 2 : Paris2024 (min) + Montserrat Alt (min)
                    </div>
                    <div className="text-[3.5rem] leading-[1.2] font-['Paris2024']">Synapseo</div>
                    <div className="text-[1.2rem] opacity-80 leading-[1.4] font-['Montserrat_Alternates']">
                        La connexion fluide entre médecins, pharmaciens et patients
                    </div>
                </div>

                <div className="w-full max-w-[1000px] grid grid-cols-2 gap-6 items-center text-center">
                    <div className="col-span-full text-[0.9rem] text-[#00f2ff] opacity-80 mb-4 font-['Inter'] uppercase tracking-[2px] border-b border-dashed border-[rgba(0,242,255,0.3)] pb-2">
                        Option 3 : Monad (MAJ) + Montserrat Alt (min)
                    </div>
                    <div className="text-[3.5rem] leading-[1.2] uppercase font-['Monad']">Synapseo</div>
                    <div className="text-[1.2rem] opacity-80 leading-[1.4] font-['Montserrat_Alternates']">
                        La connexion fluide entre médecins, pharmaciens et patients
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="relative z-[2] bg-[#050a14] text-white py-12 text-center border-t border-white/10 font-['Inter']">
                <Link to="/devop" className="text-gray-500 hover:text-[#00f2ff] transition-colors tracking-widest uppercase text-sm">
                    devop
                </Link>
            </footer>
        </div >
    );
}
