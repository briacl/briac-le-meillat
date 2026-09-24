import React from 'react';
import Navbar from '@/Components/Navbar';
import UnifiedFooter from '@/Components/UnifiedFooter';
import AdminTodoList from '@/Components/AdminTodoList';

export default function DevTodoListPage() {
    if (!import.meta.env.DEV) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 font-sans">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-zinc-300 mb-2">403</h1>
                    <p className="text-zinc-500">Accès non autorisé en production.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />
            <div className="flex-grow pt-24 pb-12 flex flex-col">
                <div className="max-w-4xl mx-auto w-full px-6 mb-8 text-center mt-8">
                    <h1 className="text-3xl md:text-5xl font-['Paris2024'] text-zinc-900 tracking-tight">
                        Espace Développeur
                    </h1>
                    <p className="text-zinc-500 font-mono text-sm mt-3 uppercase tracking-widest">
                        To-Do List Administrative
                    </p>
                </div>
                <div className="flex-grow flex items-start justify-center">
                    <AdminTodoList />
                </div>
            </div>
            <UnifiedFooter />
        </div>
    );
}
