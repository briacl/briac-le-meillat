import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/Components/Navbar';
import NeuralNetworkBackground from '@/Components/NeuralNetworkBackground';
import GlassCard from '@/Components/GlassCard';
import CVSection from './CVSection';


export default function LandingPage() {
    useEffect(() => {
        document.title = "Synapseo - App Sécurisée";
    }, []);

    const scrollToNext = (e: React.MouseEvent) => {
        e.preventDefault();
        const nextSection = document.getElementById('vision-section');
        nextSection?.scrollIntoView({ behavior: 'smooth', block: 'center' }); // center content
    };

    return (
        <div className="relative w-full min-h-screen font-sans text-skin-text-main bg-skin-base transition-colors duration-500">
            <Navbar />

            {/* FIXED Background */}
            <div className="fixed top-0 left-0 w-full h-full z-0">
                <NeuralNetworkBackground />
            </div>

            {/* Scrollable Content Overlay */}
            <div className="relative z-10 flex flex-col items-center w-full pointer-events-none">

                {/* HERO SECTION */}
                <div className="min-h-screen flex flex-col items-center justify-center pointer-events-none">
                    <div className="flex flex-col items-center justify-center text-center pointer-events-auto">
                        <h1 className="font-['Paris2024'] text-[5rem] font-[200] tracking-[12px] m-0 uppercase bg-gradient-to-br from-[#00f2ff] to-[#0055ff] bg-clip-text text-transparent select-none drop-shadow-sm">
                            Briac Le Meillat
                        </h1>
                        <p className="font-['Paris2024'] text-[1.2rem] tracking-[4px] text-gray-700 mt-4 leading-normal text-center">
                            ÉTUDIANT EN <br />DÉVELOPPEMENT WEB, RÉSEAUX INFORMATIQUES, IA, ET TÉLÉCOMMUNICATIONS
                        </p>

                        <a
                            href="#vision-section"
                            onClick={scrollToNext}
                            className="mt-12 bg-transparent border-2 border-blue-400 rounded-full w-[50px] h-[50px] flex items-center justify-center cursor-pointer transition-all duration-300 animate-bounce hover:border-blue-600 hover:shadow-[0_0_15px_rgba(0,140,255,0.5)]"
                        >
                            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-blue-500">
                                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* SPACER for Background Interaction */}
                <div className="min-h-[100vh] w-full"></div>

                {/* SECTIONS Container */}
                <div className="w-full max-w-4xl px-4 pb-24 flex flex-col gap-32">

                    {/* VISION SECTION */}
                    <div id="vision-section" className="min-h-[50vh] flex items-center justify-center">
                        <GlassCard className="w-full">
                            <h2 className="text-[3rem] mb-8 text-[#0055ff] font-['Paris2024']">VISION</h2>
                            <p className="max-w-[800px] text-center leading-[1.6] text-[1.1rem] text-gray-800 font-['Montserrat_Alternates']">
                                Synapseo redéfinit la manière dont les informations de santé circulent. <br />
                                En connectant instantanément les acteurs clés du parcours de soin, nous créons un écosystème
                                où la donnée médicale est sécurisée, fluide et au service du patient.
                            </p>
                        </GlassCard>
                    </div>

                    {/* CV SECTION */}
                    <div id="cv-section" className="min-h-[50vh] flex items-center justify-center">
                        <CVSection />
                    </div>

                    {/* PROJECTS SECTION - Moved to NeuralNetworkBackground Interaction */}
                    {/* <DomainProjectsSection /> */}

                    {/* CONTACT SECTION */}
                    <div id="contact-section" className="min-h-[50vh] flex items-center justify-center">
                        <GlassCard className="w-full">
                            <h2 className="text-[3rem] mb-8 text-[#0055ff] font-['Paris2024']">Contact</h2>
                            <form className="w-full max-w-md flex flex-col gap-4">
                                <input
                                    type="text"
                                    placeholder="Nom"
                                    className="p-3 rounded-xl bg-white/40 border border-white/50 focus:outline-none focus:ring-2 focus:ring-[#00f2ff] placeholder-gray-600"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="p-3 rounded-xl bg-white/40 border border-white/50 focus:outline-none focus:ring-2 focus:ring-[#00f2ff] placeholder-gray-600"
                                />
                                <textarea
                                    placeholder="Votre message"
                                    rows={4}
                                    className="p-3 rounded-xl bg-white/40 border border-white/50 focus:outline-none focus:ring-2 focus:ring-[#00f2ff] placeholder-gray-600"
                                ></textarea>
                                <button className="mt-4 py-3 px-8 rounded-full bg-gradient-to-r from-[#00f2ff] to-[#0055ff] text-white font-bold tracking-wider hover:shadow-lg hover:scale-105 transition-all">
                                    ENVOYER
                                </button>
                            </form>
                        </GlassCard>
                    </div>

                </div>

            </div>

            {/* Footer */}
            <footer className="relative z-10 bg-[#050a14] text-white py-12 text-center border-t border-white/10 font-['Inter']">
                <Link to="/devop" className="text-gray-500 hover:text-[#00f2ff] transition-colors tracking-widest uppercase text-sm">
                    devop
                </Link>
            </footer>
        </div >
    );
}
