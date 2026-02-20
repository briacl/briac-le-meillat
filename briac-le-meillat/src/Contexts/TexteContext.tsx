
import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import articlesData from '../data/articles.json';

export interface Texte {
    id: string;
    title: string;
    description: string;
    date: string;
    link: string;
    contentPath: string | null;
    imageUrl?: string;
    series: string[];
    createdAt: number;
}

interface TexteContextType {
    textes: Texte[];
    addTexte: (texte: Omit<Texte, 'id' | 'createdAt'>) => void;
    updateTexte: (id: string, updates: Partial<Texte>) => void;
    deleteTexte: (id: string) => void;
    reorderTextes: (newOrder: Texte[]) => void;
}

const TexteContext = createContext<TexteContextType | undefined>(undefined);

export function TexteProvider({ children }: { children: React.ReactNode }) {
    const [textes, setTextes] = useState<Texte[]>(
        (articlesData as any[]).map(a => ({
            ...a,
            series: (a as any).series ?? [],
            createdAt: (a as any).createdAt ?? 0,
        })) as Texte[]
    );

    const saveTextes = async (newTextes: Texte[]) => {
        try {
            await fetch('/api/textes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTextes),
            });
        } catch (error) {
            console.error('Failed to save textes:', error);
        }
    };

    const addTexte = (texteData: Omit<Texte, 'id' | 'createdAt'>) => {
        const newTexte: Texte = {
            ...texteData,
            id: uuidv4(),
            createdAt: Date.now(),
        };
        const updated = [newTexte, ...textes];
        setTextes(updated);
        saveTextes(updated);
    };

    const updateTexte = (id: string, updates: Partial<Texte>) => {
        const updated = textes.map(t => t.id === id ? { ...t, ...updates } : t);
        setTextes(updated);
        saveTextes(updated);
    };

    const deleteTexte = (id: string) => {
        const updated = textes.filter(t => t.id !== id);
        setTextes(updated);
        saveTextes(updated);
    };

    const reorderTextes = (newOrder: Texte[]) => {
        setTextes(newOrder);
        saveTextes(newOrder);
    };

    return (
        <TexteContext.Provider value={{ textes, addTexte, updateTexte, deleteTexte, reorderTextes }}>
            {children}
        </TexteContext.Provider>
    );
}

export const useTextes = () => {
    const context = useContext(TexteContext);
    if (context === undefined) {
        throw new Error('useTextes must be used within a TexteProvider');
    }
    return context;
};
