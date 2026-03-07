import React, { useState, useEffect } from 'react';
import { useCrypto } from '../Contexts/CryptoContext';

interface EncryptedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string; // This should be the path to the .enc file (e.g. '/encrypted_data/assets/berangere/films/xxx.jpg.enc')
    fallback?: string;
}

export const EncryptedImage: React.FC<EncryptedImageProps> = ({ src, fallback, ...props }) => {
    const { isUnlocked, decryptData } = useCrypto();
    const [objectUrl, setObjectUrl] = useState<string | undefined>(fallback);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let active = true;
        let url: string | undefined;

        const fetchAndDecrypt = async () => {
            if (!isUnlocked) return;

            try {
                setLoading(true);
                // 1. Fetch the encrypted .enc file
                const response = await fetch(src);
                if (!response.ok) throw new Error("Coudln't fetch enc file");

                const encryptedBuffer = await response.arrayBuffer();

                // 2. We need a specific decrypt method for binary data (images)
                // The decryptData in context returns string. We'll add one tailored for binary.
                // But since we can't easily modify the context return type mid-stream for string OR buffer without breaking JSONs,
                // We'll bring the decryption logic here for assets, using the stored password.

                const password = sessionStorage.getItem('berangere_key');
                if (!password) throw new Error("No key");

                const encoder = new TextEncoder();
                const pwData = encoder.encode(password);
                const hashBuffer = await crypto.subtle.digest('SHA-256', pwData);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashBase64 = btoa(String.fromCharCode.apply(null, hashArray)).substring(0, 32);

                const keyData = encoder.encode(hashBase64);

                const cryptoKey = await crypto.subtle.importKey(
                    'raw',
                    keyData,
                    { name: 'AES-GCM' },
                    false,
                    ['decrypt']
                );

                const bufferView = new Uint8Array(encryptedBuffer);
                const iv = bufferView.slice(0, 12);
                const authTag = bufferView.slice(12, 28);
                const encryptedData = bufferView.slice(28);

                const webCryptoCiphertext = new Uint8Array(encryptedData.length + authTag.length);
                webCryptoCiphertext.set(encryptedData, 0);
                webCryptoCiphertext.set(authTag, encryptedData.length);

                const decryptedBuffer = await crypto.subtle.decrypt(
                    { name: 'AES-GCM', iv: iv },
                    cryptoKey,
                    webCryptoCiphertext
                );

                // 3. Convert to Blob and an Object URL
                // We deduce the mime type from the original extension (removing .enc)
                let mimeType = 'image/jpeg';
                if (src.includes('.png.enc')) mimeType = 'image/png';
                else if (src.includes('.webp.enc')) mimeType = 'image/webp';

                const blob = new Blob([decryptedBuffer], { type: mimeType });

                if (active) {
                    url = URL.createObjectURL(blob);
                    setObjectUrl(url);
                    setLoading(false);
                }

            } catch (err) {
                console.error("Erreur de déchiffrement image", src);
                if (active) {
                    setError(true);
                    setLoading(false);
                }
            }
        };

        fetchAndDecrypt();

        return () => {
            active = false;
            if (url) {
                URL.revokeObjectURL(url); // Clean up memory
            }
        };
    }, [src, isUnlocked]);

    if (!isUnlocked) {
        return <div className={`bg-black/50 animate-pulse flex items-center justify-center ${props.className}`}>
            <span className="text-white/20 text-xs text-center px-4">🔒 Chiffré</span>
        </div>;
    }

    if (loading) {
        return <div className={`bg-gray-800 animate-pulse ${props.className}`}></div>;
    }

    if (error) {
        return <div className={`bg-red-900/20 text-red-500 flex items-center justify-center text-xs text-center px-4 ${props.className}`}>
            Erreur de clé
        </div>;
    }

    return <img src={objectUrl} {...props} />;
};
