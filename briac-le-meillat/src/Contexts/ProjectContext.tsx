
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
    const [projects, setProjects] = useState<Project[]>([]);

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

    useEffect(() => {
        fetch('/api/projects')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setProjects(data);
            })
            .catch(console.error);
    }, []);

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
