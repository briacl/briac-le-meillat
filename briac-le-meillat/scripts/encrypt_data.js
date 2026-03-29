import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const password = process.argv[2];
if (!password) {
    console.error("ERREUR : Vous devez fournir la clé de chiffrement en argument.");
    console.log("Usage: node scripts/encrypt_data.js \"votre_mot_de_passe\"");
    process.exit(1);
}

// 1. Dérivation de la clé (Identique au composant React EncryptedImage)
const hashBuffer = crypto.createHash('sha256').update(password).digest();
const hashBase64 = hashBuffer.toString('base64').substring(0, 32);
const keyBuffer = Buffer.from(hashBase64, 'utf-8'); // Clé de 32 octets pour AES-256

const FONT_KNOX_MAPPINGS = [
    { src: 'private_assets/berangere-films.json', dest: 'public/encrypted_data/chunks/vendor-f8a0.enc' },
    { src: 'private_assets/berangere-series.json', dest: 'public/encrypted_data/chunks/vendor-s2f1.enc' },
    { src: 'private_assets/books-projects.json', dest: 'public/encrypted_data/chunks/vendor-b9c3.enc' },
    { src: 'private_assets/realisations-projects.json', dest: 'public/encrypted_data/chunks/vendor-r4d2.enc' },
    { src: 'private_assets/images/écrivant_mon_silence_custom.png', dest: 'public/encrypted_data/chunks/m_assets/asset-ems-0x9.enc' }
];

console.log("🔒 Lancement du chiffrement Fort-Knox...");

FONT_KNOX_MAPPINGS.forEach(({src, dest}) => {
    const srcPath = path.resolve(__dirname, '..', src);
    const destPath = path.resolve(__dirname, '..', dest);

    if (!fs.existsSync(srcPath)) {
        console.warn(`[SKIP] Fichier source introuvable : ${src}`);
        return;
    }

    const data = fs.readFileSync(srcPath);
    
    // Génération de l'IV (Vecteur d'Initialisation)
    const iv = crypto.randomBytes(12);
    
    // Chiffrement AES-GCM
    const cipher = crypto.createCipheriv('aes-256-gcm', keyBuffer, iv);
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    
    // Tag d'Authentification (16 octets)
    const authTag = cipher.getAuthTag();
    
    // Assemblage final exigé par Web Crypto API : IV + AuthTag + CipherText
    const finalBuffer = Buffer.concat([iv, authTag, encrypted]);
    
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, finalBuffer);
    console.log(`[OK]   ${src} -> ${dest}`);
});

console.log("✅ Chiffrement terminé avec succès.");
