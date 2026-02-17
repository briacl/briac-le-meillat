import React, { createContext, useContext, useState, ReactNode } from 'react';

type SubscriptionLevel = 'free' | 'reserved';

interface User {
    name: string;
    email: string;
    subscription: SubscriptionLevel;
    is_email_verified?: boolean;
    is_2fa_enabled?: boolean;
}

interface AuthContextType {
    user: User | null;
    login: (email?: string, password?: string) => Promise<void>;
    signup: (name?: string, email?: string, password?: string) => Promise<void>;
    verifyEmail: (email: string, code: string) => Promise<void>;
    setup2FA: (email: string) => Promise<{ qr_code: string; secret: string }>;
    verify2FA: (email: string, code: string) => Promise<void>;
    logout: () => void;
    subscribe: () => Promise<void>;
    isAuthenticated: boolean;
    hasAccessToReserved: boolean;
    authConfig: {
        enable_email_verification: boolean;
        enable_2fa: boolean;
    };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:8001/api';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [authConfig, setAuthConfig] = useState({
        enable_email_verification: true,
        enable_2fa: true
    });

    React.useEffect(() => {
        fetch(`${API_URL}/config`)
            .then(res => res.json())
            .then(data => setAuthConfig(data))
            .catch(err => console.error("Failed to fetch auth config", err));
    }, []);

    const login = async (email?: string, password?: string) => {
        if (!email || !password) throw new Error("Email and password required");

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
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
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Signup failed');
            }

            const userData = await response.json();
            // We set the user, but they might not be fully verified yet
            setUser({ ...userData });
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const verifyEmail = async (email: string, code: string) => {
        try {
            const response = await fetch(`${API_URL}/auth/verify-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Email verification failed');
            }

            if (user) {
                setUser({ ...user, is_email_verified: true });
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const setup2FA = async (email: string) => {
        try {
            const response = await fetch(`${API_URL}/auth/setup-2fa`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || '2FA setup failed');
            }

            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const verify2FA = async (email: string, code: string) => {
        try {
            const response = await fetch(`${API_URL}/auth/verify-2fa`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || '2FA verification failed');
            }

            if (user) {
                setUser({ ...user, is_2fa_enabled: true });
            }
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
            const response = await fetch(`${API_URL}/subscribe`, {
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
        verifyEmail,
        setup2FA,
        verify2FA,
        logout,
        subscribe,
        isAuthenticated: !!user,
        hasAccessToReserved: user?.subscription === 'reserved',
        authConfig
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
