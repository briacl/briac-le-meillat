import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
    isAuthenticated: boolean;
    isLoading: boolean;
    hasAccessToReserved: boolean;
    authConfig: {
        enable_email_verification: boolean;
        enable_2fa: boolean;
    };
    login: (email?: string, password?: string) => Promise<void>;
    signup: (name?: string, email?: string, password?: string) => Promise<void>;
    verifyEmail: (email: string, code: string) => Promise<void>;
    setup2FA: (email: string) => Promise<{ qr_code: string; secret: string }>;
    verify2FA: (email: string, code: string) => Promise<void>;
    logout: () => void;
    subscribe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// L'URL de l'API est lue depuis les variables Vite (définies dans .env.local)
// En dev  : VITE_API_URL=http://localhost:8001/api
// En prod : VITE_API_URL=https://ton-domaine.fr/api
const API_URL = import.meta.env.VITE_API_URL as string;

const TOKEN_KEY = 'auth_token';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true); // true au démarrage : on ne sait pas encore si l'utilisateur est connecté
    const [authConfig, setAuthConfig] = useState({
        enable_email_verification: true,
        enable_2fa: true,
    });

    // ─── Chargement initial : config API + restauration de session ─────────────
    useEffect(() => {
        // Récupération de la configuration du serveur
        fetch(`${API_URL}/config`)
            .then(res => res.json())
            .then(data => setAuthConfig(data))
            .catch(err => console.error('Failed to fetch auth config', err));

        // Restauration de la session depuis le token JWT stocké localement
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
            // Pas de token → on n'est pas connecté, mais le chargement est terminé
            setIsLoading(false);
            return;
        }

        // On vérifie le token auprès du backend
        fetch(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                if (!res.ok) throw new Error('Token invalide ou expiré');
                return res.json();
            })
            .then((userData: User) => {
                setUser(userData);
            })
            .catch(() => {
                // Token invalide ou expiré → on nettoie et on reste déconnecté
                localStorage.removeItem(TOKEN_KEY);
                setUser(null);
            })
            .finally(() => {
                // Dans tous les cas, le chargement est terminé
                setIsLoading(false);
            });
    }, []);

    // ─── Login ─────────────────────────────────────────────────────────────────
    const login = async (email?: string, password?: string) => {
        if (!email || !password) throw new Error('Email et mot de passe requis');

        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Connexion échouée');
        }

        const data = await response.json();

        // Stockage du JWT pour les futurs rechargements de page
        localStorage.setItem(TOKEN_KEY, data.token);

        setUser({
            name: data.name,
            email: data.email,
            subscription: data.subscription,
            is_email_verified: data.is_email_verified,
            is_2fa_enabled: data.is_2fa_enabled,
        });
    };

    // ─── Signup ────────────────────────────────────────────────────────────────
    const signup = async (name?: string, email?: string, password?: string) => {
        if (!name || !email || !password) throw new Error('Tous les champs sont requis');

        const response = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Inscription échouée');
        }

        const userData = await response.json();
        setUser({
            name: userData.name,
            email: userData.email,
            subscription: userData.subscription,
            is_email_verified: false,
            is_2fa_enabled: false,
        });
    };

    // ─── Verify Email ──────────────────────────────────────────────────────────
    const verifyEmail = async (email: string, code: string) => {
        const response = await fetch(`${API_URL}/auth/verify-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Vérification email échouée');
        }

        if (user) {
            setUser({ ...user, is_email_verified: true });
        }
    };

    // ─── Setup 2FA ─────────────────────────────────────────────────────────────
    const setup2FA = async (email: string) => {
        const response = await fetch(`${API_URL}/auth/setup-2fa`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Configuration 2FA échouée');
        }

        return response.json();
    };

    // ─── Verify 2FA ────────────────────────────────────────────────────────────
    const verify2FA = async (email: string, code: string) => {
        const response = await fetch(`${API_URL}/auth/verify-2fa`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Vérification 2FA échouée');
        }

        if (user) {
            setUser({ ...user, is_2fa_enabled: true });
        }
    };

    // ─── Logout ────────────────────────────────────────────────────────────────
    const logout = () => {
        // Suppression du token JWT persisté → la session ne sera plus restaurée au prochain chargement
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
    };

    // ─── Subscribe ─────────────────────────────────────────────────────────────
    const subscribe = async () => {
        if (!user) return;

        const response = await fetch(`${API_URL}/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email }),
        });

        if (!response.ok) {
            throw new Error('Abonnement échoué');
        }

        const updatedUser = await response.json();
        setUser(prev => prev ? { ...prev, subscription: updatedUser.subscription } : null);
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        hasAccessToReserved: user?.subscription === 'reserved',
        authConfig,
        login,
        signup,
        verifyEmail,
        setup2FA,
        verify2FA,
        logout,
        subscribe,
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
