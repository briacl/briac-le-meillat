
import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import projectsData from '../data/realisations-projects.json';

export interface Project {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    videoLink: string;
    series: string[];
    createdAt: number;
    season?: number;
    episode?: number;
    duration?: string;
    category?: string;
}

interface ProjectContextType {
    projects: Project[];
    addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
    updateProject: (id: string, updates: Partial<Project>) => void;
    deleteProject: (id: string) => void;
    reorderProjects: (newOrder: Project[]) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
    // Initialize directly with the data from the JSON file
    // We cast it to Project[] to ensure type safety if the JSON structure matches
    const [projects, setProjects] = useState<Project[]>(projectsData as Project[]);

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

    return (
        <ProjectContext.Provider value={{ projects, addProject, updateProject, deleteProject, reorderProjects }}>
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
