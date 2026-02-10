import React, { createContext, useContext, useState, ReactNode } from 'react';

type SubscriptionLevel = 'free' | 'reserved';

interface User {
    name: string;
    email: string;
    subscription: SubscriptionLevel;
}

interface AuthContextType {
    user: User | null;
    login: (email?: string, password?: string) => Promise<void>;
    signup: (name?: string, email?: string, password?: string) => Promise<void>;
    logout: () => void;
    subscribe: () => Promise<void>;
    isAuthenticated: boolean;
    hasAccessToReserved: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    // Mock actions
    const login = async (email?: string, password?: string) => {
        if (!email || !password) throw new Error("Email and password required");

        try {
            const response = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Login failed');
            }

            const userData = await response.json();
            setUser(userData);
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const signup = async (name?: string, email?: string, password?: string) => {
        if (!name || !email || !password) throw new Error("All fields required");

        try {
            const response = await fetch('http://localhost:8000/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Signup failed');
            }

            // Auto login after signup
            // But the endpoint returns the user object, so we can just set it
            const userData = await response.json();
            setUser({ ...userData, subscription: 'free' }); // Ensure subscription is set
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
    };

    const subscribe = async () => {
        if (!user) return;

        try {
            const response = await fetch('http://localhost:8000/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email })
            });

            if (!response.ok) {
                throw new Error('Subscription failed');
            }

            const updatedUser = await response.json();
            setUser(updatedUser);
        } catch (error) {
            console.error(error);
        }
    };

    const value = {
        user,
        login,
        signup,
        logout,
        subscribe,
        isAuthenticated: !!user,
        hasAccessToReserved: user?.subscription === 'reserved'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
