
import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Project {
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

interface ProjectContextType {
    projects: Project[];
    addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
    updateProject: (id: string, updates: Partial<Project>) => void;
    deleteProject: (id: string) => void;
    getProjectsByDomain: (domain: string) => Project[];
    domains: string[];
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
    const [projects, setProjects] = useState<Project[]>(() => {
        const stored = localStorage.getItem('projects_data');
        return stored ? JSON.parse(stored) : [];
    });

    // Listen for changes in other tabs
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'projects_data' && e.newValue) {
                setProjects(JSON.parse(e.newValue));
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    useEffect(() => {
        localStorage.setItem('projects_data', JSON.stringify(projects));
    }, [projects]);

    const addProject = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
        const newProject: Project = {
            ...projectData,
            id: uuidv4(),
            createdAt: Date.now(),
        };
        setProjects(prev => [newProject, ...prev]);
    };

    const updateProject = (id: string, updates: Partial<Project>) => {
        setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const deleteProject = (id: string) => {
        setProjects(prev => prev.filter(p => p.id !== id));
    };

    const getProjectsByDomain = (domain: string) => {
        return projects.filter(p => p.domain === domain);
    };

    // Extract unique domains
    const domains = Array.from(new Set(projects.map(p => p.domain)));

    return (
        <ProjectContext.Provider value={{ projects, addProject, updateProject, deleteProject, getProjectsByDomain, domains }}>
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
