
import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import projectsData from '../data/projects.json';

export interface WebProject {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    languages: string[];
    link: string;
    domain: string;
    isBest: boolean;
    isRecent: boolean;
    createdAt: number;
}

interface WebProjectContextType {
    projects: WebProject[];
    addProject: (project: Omit<WebProject, 'id' | 'createdAt'>) => void;
    updateProject: (id: string, updates: Partial<WebProject>) => void;
    deleteProject: (id: string) => void;
}

const WebProjectContext = createContext<WebProjectContextType | undefined>(undefined);

export function WebProjectProvider({ children }: { children: React.ReactNode }) {
    const [projects, setProjects] = useState<WebProject[]>(projectsData as WebProject[]);
    console.log('WebProjectProvider initialized. Projects:', projects);

    const saveProjects = async (newProjects: WebProject[]) => {
        try {
            await fetch('/api/web-projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProjects),
            });
        } catch (error) {
            console.error('Failed to save web projects:', error);
        }
    };

    const addProject = (projectData: Omit<WebProject, 'id' | 'createdAt'>) => {
        const newProject: WebProject = {
            ...projectData,
            id: uuidv4(),
            createdAt: Date.now(),
        };
        const updatedProjects = [newProject, ...projects];
        setProjects(updatedProjects);
        saveProjects(updatedProjects);
    };

    const updateProject = (id: string, updates: Partial<WebProject>) => {
        const updatedProjects = projects.map(p => p.id === id ? { ...p, ...updates } : p);
        setProjects(updatedProjects);
        saveProjects(updatedProjects);
    };

    const deleteProject = (id: string) => {
        const updatedProjects = projects.filter(p => p.id !== id);
        setProjects(updatedProjects);
        saveProjects(updatedProjects);
    };

    return (
        <WebProjectContext.Provider value={{ projects, addProject, updateProject, deleteProject }}>
            {children}
        </WebProjectContext.Provider>
    );
}

export const useWebProjects = () => {
    const context = useContext(WebProjectContext);
    if (context === undefined) {
        throw new Error('useWebProjects must be used within a WebProjectProvider');
    }
    return context;
};
