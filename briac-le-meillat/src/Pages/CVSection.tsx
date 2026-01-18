import React, { useState } from 'react';
import GlassCard from '@/Components/GlassCard';
import ProfileCard from '@/Components/ProfileCard';
import Timeline from '@/Components/Timeline';

const cvData = [
    {
        year: '2021',
        title: 'Classes Préparatoires',
        description: 'Admission en Classes Préparatoires aux Grandes Écoles (MPSI/MP). Deux années intensives de mathématiques et physique.',
        location: 'Lycée Chateaubriand, Rennes' // Example
    },
    {
        year: '2023',
        title: 'IMT Nord Europe',
        description: 'Entrée en école d\'ingénieur. Début de la spécialisation en numérique, développement et réseaux.',
        location: 'Douai / Lille'
    },
    {
        year: '2024',
        title: 'Spécialisation IA',
        description: 'Approfondissement des connaissances en Intelligence Artificielle et Data Science. Projets de machine learning.',
        location: 'IMT Nord Europe'
    },
    {
        year: '2025',
        title: 'Futur Ingénieur',
        description: 'Stage de fin d\'études et diplomation à venir. Prêt à relever de nouveaux défis technologiques.',
        location: 'À venir'
    }
];

export default function CVSection() {
    const [activeStep, setActiveStep] = useState(1); // Default to second step as active for demo

    return (
        <div className="w-full flex flex-col lg:flex-row gap-8 items-stretch justify-center max-w-6xl mx-auto min-h-[500px]">

            {/* LEFT: Profile Card */}
            <div className="w-full lg:w-1/3 flex-shrink-0">
                <ProfileCard />
            </div>

            {/* RIGHT: Timeline & Content */}
            <div className="w-full lg:w-2/3 flex flex-col">
                <GlassCard className="h-full flex flex-col justify-start !p-0 overflow-hidden">

                    {/* Top: Timeline */}
                    <div className="w-full p-8 pb-4 bg-white/30 border-b border-white/20">
                        <Timeline
                            steps={cvData.map(d => ({ year: d.year, title: d.title }))}
                            activeStep={activeStep}
                            onStepClick={setActiveStep}
                        />
                    </div>

                    {/* Bottom: Dynamic Content */}
                    <div className="flex-1 w-full p-12 flex flex-col items-center justify-center text-center transition-all duration-500">

                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" key={activeStep}>
                            <h3 className="font-['Paris2024'] text-4xl mb-2 text-[#0055ff]">
                                {cvData[activeStep].title}
                            </h3>
                            <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-bold mb-6 font-['Montserrat_Alternates']">
                                {cvData[activeStep].location}
                            </span>
                            <p className="text-xl text-gray-700 font-['Montserrat_Alternates'] leading-relaxed max-w-lg mx-auto">
                                {cvData[activeStep].description}
                            </p>
                        </div>

                    </div>

                </GlassCard>
            </div>

        </div>
    );
}
