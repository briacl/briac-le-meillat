import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface CryptoContextType {
    isUnlocked: boolean;
    unlock: (password: string) => Promise<boolean>;
    lock: () => void;
    decryptData: (encryptedBuffer: ArrayBuffer) => Promise<string | null>;
}

const CryptoContext = createContext<CryptoContextType | undefined>(undefined);

// Paramètres crypto
const ALGORITHM = 'AES-GCM';

export const CryptoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [cryptoKey, setCryptoKey] = useState<CryptoKey | null>(null);

    // Essayer de récupérer la clé si elle est dans le sessionStorage
    useEffect(() => {
        const storedPassword = sessionStorage.getItem('berangere_key');
        if (storedPassword) {
            unlock(storedPassword);
        }
    }, []);

    const deriveKey = async (password: string): Promise<CryptoKey> => {
        const encoder = new TextEncoder();
        const pwData = encoder.encode(password);

        // Simuler crypto.createHash('sha256').update(password) de Node.js
        const hashBuffer = await crypto.subtle.digest('SHA-256', pwData);
        // Prendre les 32 premiers octets en base64 (identique au script Nodejs)
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashBase64 = btoa(String.fromCharCode.apply(null, hashArray)).substring(0, 32);

        const keyData = encoder.encode(hashBase64);

        return await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: ALGORITHM },
            false,
            ['decrypt']
        );
    };

    const unlock = async (password: string): Promise<boolean> => {
        try {
            const key = await deriveKey(password);

            // Pour vérifier si le mot de passe est bon, on pourrait déchiffrer un petit fichier test.
            // Mais pour faire simple, on accepte la clé et on plantera au déchiffrement si elle est fausse.
            setCryptoKey(key);
            setIsUnlocked(true);
            sessionStorage.setItem('berangere_key', password);
            return true;
        } catch (error) {
            console.error("Erreur de dérivation de clé", error);
            return false;
        }
    };

    const lock = () => {
        setCryptoKey(null);
        setIsUnlocked(false);
        sessionStorage.removeItem('berangere_key');
    };

    const decryptData = async (encryptedBuffer: ArrayBuffer): Promise<string | null> => {
        if (!cryptoKey) return null;

        try {
            // Séparer l'IV, le tag (géré par AES-GCM web crypto) et les données.
            // Format Nodejs: [12 octets IV] + [16 octets AuthTag] + [Data]
            // Note: WebCrypto GCM attend [Data] + [16 octets AuthTag] en un seul buffer (ciphertext)

            const bufferView = new Uint8Array(encryptedBuffer);
            const iv = bufferView.slice(0, 12);
            const authTag = bufferView.slice(12, 28);
            const encryptedData = bufferView.slice(28);

            // Reconstruire le format attendu par WebCrypto: Data concaténé avec AuthTag
            const webCryptoCiphertext = new Uint8Array(encryptedData.length + authTag.length);
            webCryptoCiphertext.set(encryptedData, 0);
            webCryptoCiphertext.set(authTag, encryptedData.length);

            const decryptedBuffer = await crypto.subtle.decrypt(
                { name: ALGORITHM, iv: iv },
                cryptoKey,
                webCryptoCiphertext
            );

            const decoder = new TextDecoder();
            return decoder.decode(decryptedBuffer);
        } catch (error) {
            console.error("Échec du déchiffrement. Mot de passe invalide ?");
            // Ne pas logger l'erreur complète pour ne pas faire planter l'UI
            return null;
        }
    };

    return (
        <CryptoContext.Provider value={{ isUnlocked, unlock, lock, decryptData }}>
            {children}
        </CryptoContext.Provider>
    );
};

export const useCrypto = () => {
    const context = useContext(CryptoContext);
    if (!context) throw new Error("useCrypto doit être utilisé dans un CryptoProvider");
    return context;
};

export function useStealthData<T>(chunkName: string | null): T[] {
    const { isUnlocked, decryptData } = useCrypto();
    const [data, setData] = useState<T[]>([]);
    
    useEffect(() => {
        let active = true;
        if (!isUnlocked || !chunkName) return;
        
        const load = async () => {
            try {
                const basePath = import.meta.env.BASE_URL || '/';
                const url = basePath.endsWith('/') ? `${basePath}encrypted_data/chunks/${chunkName}` : `${basePath}/encrypted_data/chunks/${chunkName}`;
                const res = await fetch(url);
                if (!res.ok) return;
                const buffer = await res.arrayBuffer();
                const decryptedStr = await decryptData(buffer);
                if (active && decryptedStr) {
                    setData(JSON.parse(decryptedStr));
                }
            } catch (e) {
                console.error("Failed to load chunk");
            }
        };
        load();
        return () => { active = false; };
    }, [isUnlocked, chunkName, decryptData]);
    
    return data;
}

// --- Composant d'Interface Utilisateur ---

const PasswordPrompt: React.FC<{ onUnlock: (pw: string) => Promise<boolean> }> = ({ onUnlock }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [lockedUntil, setLockedUntil] = useState<number | null>(() => {
        const stored = localStorage.getItem('berangere_locked_until');
        return stored ? parseInt(stored, 10) : null;
    });
    const [timeRemaining, setTimeRemaining] = useState(0);

    useEffect(() => {
        if (!lockedUntil) return;
        
        const interval = setInterval(() => {
            const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
            if (remaining <= 0) {
                setLockedUntil(null);
                localStorage.removeItem('berangere_locked_until');
                setTimeRemaining(0);
                setError(false);
            } else {
                setTimeRemaining(remaining);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [lockedUntil]);

    const isLockedOut = lockedUntil !== null && Date.now() < lockedUntil;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLockedOut) return;

        const success = await onUnlock(password.trim());
        if (!success) {
            setError(true);
            const newLockTime = Date.now() + 60000; // Lock for 60 seconds
            setLockedUntil(newLockTime);
            localStorage.setItem('berangere_locked_until', newLockTime.toString());
        }
    };

    if (isLockedOut) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[99999] flex items-center justify-center bg-black backdrop-blur-3xl"
            >
                <div className="text-center">
                    <Lock className="w-16 h-16 text-red-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-red-500 mb-4 tracking-[0.2em] font-['NeutrafaceTextDemiSC']">
                        ACCÈS REFUSÉ
                    </h2>
                    <p className="text-gray-400 font-mono tracking-widest text-lg">
                        VERROUILLAGE SÉCURITÉ : {timeRemaining}s
                    </p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 backdrop-blur-xl"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white/5 p-8 rounded-2xl border border-white/10 shadow-2xl max-w-md w-full"
            >
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/30">
                        <Lock className="w-8 h-8 text-blue-400" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-white text-center mb-2 font-['NeutrafaceTextDemiSC'] tracking-widest">
                    ACCÈS CONFIDENTIEL
                </h2>
                <p className="text-gray-400 text-center text-sm mb-8">
                    Veuillez entrer la clé de déchiffrement pour accéder aux données sécurisées.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError(false);
                            }}
                            placeholder="Clé de chiffrement..."
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                        />
                        {error && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm mt-2">
                                Clé invalide ou erreur système.
                            </motion.p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-blue-500/30"
                    >
                        Déchiffrer
                    </button>

                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="w-full text-gray-400 hover:text-white text-sm py-2 transition-colors"
                    >
                        Retour en lieu sûr
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
};

// --- Composant Modal Conditionnel (doit être utilisé dans BrowserRouter) ---

export const CryptoModal: React.FC = () => {
    const location = useLocation();
    const { isUnlocked, unlock } = useCrypto();
    
    // Vérifier si on est sur une route nécessitant le déchiffrement
    const needsDecryption = location.pathname.startsWith('/berangere');

    return (
        <AnimatePresence>
            {needsDecryption && !isUnlocked && (
                <PasswordPrompt onUnlock={unlock} />
            )}
        </AnimatePresence>
    );
};
