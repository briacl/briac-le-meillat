
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useCrypto } from './CryptoContext';

export interface Project {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    videoLink: string;
    series: string[];
    createdAt: number;
    type?: 'film' | 'serie';
    season?: number;
    episode?: number;
    duration?: string;
    category?: string;
    // Champs utilisés par DomainProjectsSection et NeuralNetworkBackground
    link?: string;
    languages?: string[];
    isBest?: boolean;
    isRecent?: boolean;
    domain?: string;
    // Bérangère specific fields
    director?: string;
    cast?: string;
    production?: string;
}

interface ProjectContextType {
    projects: Project[];
    domains: string[];
    getProjectsByDomain: (domain: string) => Project[];
    addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
    updateProject: (id: string, updates: Partial<Project>) => void;
    deleteProject: (id: string) => void;
    reorderProjects: (newOrder: Project[]) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
    const { isUnlocked, decryptData } = useCrypto();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const loadData = async () => {
            if (!isUnlocked) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await fetch('/briac-le-meillat/encrypted_data/chunks/vendor-r4d2.enc');
                if (!response.ok) throw new Error("Fichier introuvable");

                const buffer = await response.arrayBuffer();
                const decryptedStr = await decryptData(buffer);

                if (decryptedStr && active) {
                    const parsed = JSON.parse(decryptedStr) as Project[];
                    setProjects(parsed);
                }
            } catch (err) {
                console.error("Erreur chargement Projets chiffrés", err);
            } finally {
                if (active) setLoading(false);
            }
        };

        loadData();

        return () => { active = false; };
    }, [isUnlocked, decryptData]);

    const saveProjects = async (newProjects: Project[]) => {
        try {
            await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProjects),
            });
        } catch (error) {
            console.error('Failed to save projects:', error);
        }
    };

    // Removed useEffect that fetches from /api/projects since we use static data now

    const addProject = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
        const newProject: Project = {
            ...projectData,
            id: uuidv4(),
            createdAt: Date.now(),
        };
        const updatedProjects = [newProject, ...projects];
        setProjects(updatedProjects);
        saveProjects(updatedProjects);
    };

    const updateProject = (id: string, updates: Partial<Project>) => {
        const updatedProjects = projects.map(p => p.id === id ? { ...p, ...updates } : p);
        setProjects(updatedProjects);
        saveProjects(updatedProjects);
    };

    const deleteProject = (id: string) => {
        const updatedProjects = projects.filter(p => p.id !== id);
        setProjects(updatedProjects);
        saveProjects(updatedProjects);
    };

    const reorderProjects = (newOrder: Project[]) => {
        setProjects(newOrder);
        saveProjects(newOrder);
    };

    // Calcul des domaines uniques à partir des projets
    const domains = [...new Set(projects.map(p => p.domain).filter((d): d is string => !!d))];

    const getProjectsByDomain = (domain: string) =>
        projects.filter(p => p.domain === domain);

    return (
        <ProjectContext.Provider value={{ projects, domains, getProjectsByDomain, addProject, updateProject, deleteProject, reorderProjects }}>
            {children}
        </ProjectContext.Provider>
    );
}

export const useProjects = () => {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error('useProjects must be used within a ProjectProvider');
    }
    return context;
};
