import React from 'react';
import GlassCard from './GlassCard';

interface Collaborator {
    id: number;
    name: string;
    role: string;
    image: string;
}

const collaborators: Collaborator[] = [
    {
        id: 1,
        name: "Ronan Le Meillat",
        role: "Ingénieur Informatique",
        image: "https://ui-avatars.com/api/?name=Collaborateur+1&background=0D8ABC&color=fff&size=200" // Placeholder
    },
    {
        id: 2,
        name: "Yanni Delattre-Balcer",
        role: "Étudiant en R&T",
        image: "https://ui-avatars.com/api/?name=Collaborateur+2&background=0D8ABC&color=fff&size=200" // Placeholder
    },
    {
        id: 3,
        name: "Alex Jovéniaux",
        role: "Étudiant en R&T",
        image: "https://ui-avatars.com/api/?name=Collaborateur+3&background=0D8ABC&color=fff&size=200" // Placeholder
    },
    {
        id: 4,
        name: "Lucas Lemaître",
        role: "Étudiant en R&T",
        image: "https://ui-avatars.com/api/?name=Collaborateur+4&background=0D8ABC&color=fff&size=200" // Placeholder
    },
    {
        id: 5,
        name: "Arthur Huyghe",
        role: "Étudiant en R&T",
        image: "https://ui-avatars.com/api/?name=Collaborateur+5&background=0D8ABC&color=fff&size=200" // Placeholder
    },
    {
        id: 5,
        name: "Aicha Soulef Belgour",
        role: "Étudiante en R&T",
        image: "https://ui-avatars.com/api/?name=Collaborateur+5&background=0D8ABC&color=fff&size=200" // Placeholder
    },
    {
        id: 6,
        name: "David Mercier",
        role: "Docteur en IA\nProfesseur à l'IUT de Béthune",
        image: "https://ui-avatars.com/api/?name=Collaborateur+6&background=0D8ABC&color=fff&size=200" // Placeholder
    },
    {
        id: 7,
        name: "François Bricout",
        role: "Professeur à l'IUT de Béthune",
        image: "https://ui-avatars.com/api/?name=Collaborateur+7&background=0D8ABC&color=fff&size=200" // Placeholder
    }
];

export default function CollaboratorsSection() {
    return (
        <div className="w-full flex flex-col items-center justify-center">
            <GlassCard className="w-full">
                <h2 className="text-[3rem] mb-12 text-[#0055ff] font-['Paris2024'] text-center">MES COLLABORATEURS</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                    {collaborators.map((collab) => (
                        <div key={collab.id} className="w-full max-w-sm flex flex-col items-center justify-center p-6 relative group">

                            {/* Inner Card Styling - mimic ProfileCard but slightly lighter/integrated */}
                            <div className="relative mb-6">
                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#0075FF] to-[#f336f0] rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>

                                {/* Profile Image container */}
                                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-xl">
                                    <img
                                        src={collab.image}
                                        alt={collab.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                            </div>

                            <h3 className="font-['Paris2024'] text-xl font-bold bg-gradient-to-r from-[#0075FF] to-[#f336f0] bg-clip-text text-transparent mb-2 text-center">
                                {collab.name.toUpperCase()}
                            </h3>

                            <p className="font-['Paris2024'] text-xs text-skin-text-secondary text-center uppercase tracking-widest">
                                {collab.role}
                            </p>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
}
