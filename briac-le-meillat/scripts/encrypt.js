import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Chargement manuel facile du fichier .env pour ne pas dépendre de la librairie dotenv
const envPath = path.resolve(PROJECT_ROOT, '.env');
if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        const match = line.match(/^\s*(BERANGERE_PASSPHRASE)\s*=\s*(.*)?\s*$/);
        if (match) {
            let val = match[2] || '';
            // Retirer les guillemets potentiels
            val = val.replace(/^['"](.*)['"]$/, '$1');
            process.env[match[1]] = val;
        }
    });
}

// Récupération de la clé depuis l'environnement
const SECRET_KEY = process.env.BERANGERE_PASSPHRASE;

if (!SECRET_KEY || SECRET_KEY.trim() === '') {
    console.error("❌ ERREUR FATALE: Aucune clé de chiffrement trouvée.");
    console.error("Veuillez créer un fichier .env à la racine de votre projet avec :");
    console.error("BERANGERE_PASSPHRASE=VotreClefUltraSecrete");
    process.exit(1);
}

// Algorithme et paramètres
const ALGORITHM = 'aes-256-gcm';

// Chemins des dossiers
const SRC_DATA_DIR = path.resolve(PROJECT_ROOT, 'src/data');
const PUBLIC_ASSETS_DIR = path.resolve(PROJECT_ROOT, 'public/assets/berangere');

const DEST_DATA_DIR = path.resolve(PROJECT_ROOT, 'public/encrypted_data/data');
const DEST_ASSETS_DIR = path.resolve(PROJECT_ROOT, 'public/encrypted_data/assets/berangere');

/**
 * Fonction de chiffrement d'un fichier source vers une destination `.enc`
 */
function encryptFile(sourcePath, destPath) {
    if (!fs.existsSync(sourcePath)) {
        console.warn(`[WARNING] Fichier non trouvé : ${sourcePath}`);
        return;
    }

    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    // Le sel pour dériver la clé - on gère ça simplement pour le frontend
    // On hache le mot de passe pour être sûr d'avoir 32 octets pour l'AES-256
    const key = crypto.createHash('sha256').update(String(SECRET_KEY)).digest('base64').substring(0, 32);

    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    const inputBuffer = fs.readFileSync(sourcePath);

    // Pour des fichiers pas trop gros, on peut tout faire en mémoire
    const encryptedBuffer = Buffer.concat([cipher.update(inputBuffer), cipher.final()]);
    const authTag = cipher.getAuthTag();

    // Format du fichier `.enc` :
    // [12 octets IV] + [16 octets AuthTag] + [Données chiffrées]
    const finalBuffer = Buffer.concat([iv, authTag, encryptedBuffer]);

    fs.writeFileSync(destPath, finalBuffer);
    console.log(`[SUCCESS] 🔒 Chiffré : ${path.basename(sourcePath)} -> ${destPath.replace(PROJECT_ROOT, '')}`);
}

/**
 * Parcours récursif d'un dossier pour chiffrer son contenu
 */
function encryptDirectory(sourceDir, destDir) {
    if (!fs.existsSync(sourceDir)) return;

    const files = fs.readdirSync(sourceDir);

    for (const file of files) {
        const sourcePath = path.join(sourceDir, file);
        const destPath = path.join(destDir, file + '.enc');

        const stat = fs.statSync(sourcePath);

        if (stat.isDirectory()) {
            encryptDirectory(sourcePath, destPath.replace('.enc', '')); // on enlève le .enc sur les dossiers
        } else {
            // Options pour ne chiffrer que certains formats :
            if (['.json', '.png', '.jpg', '.jpeg', '.webp', '.mp4'].includes(path.extname(sourcePath).toLowerCase())) {
                encryptFile(sourcePath, destPath);
            }
        }
    }
}

console.log('--- DÉBUT DU CHIFFREMENT ---');
console.log(`Clé utilisée pour le déchiffrement (À RETENIR) : ${SECRET_KEY}`);

// 1. Chiffrement des données JSON
console.log('\n--- Chiffrement des données (JSON) ---');
encryptFile(path.resolve(SRC_DATA_DIR, 'berangere-films.json'), path.resolve(DEST_DATA_DIR, 'berangere-films.json.enc'));
encryptFile(path.resolve(SRC_DATA_DIR, 'berangere-series.json'), path.resolve(DEST_DATA_DIR, 'berangere-series.json.enc'));
encryptFile(path.resolve(SRC_DATA_DIR, 'realisations-projects.json'), path.resolve(DEST_DATA_DIR, 'realisations-projects.json.enc'));
if (fs.existsSync(path.resolve(SRC_DATA_DIR, 'articles.json'))) { // Si Textes existe ainsi
    encryptFile(path.resolve(SRC_DATA_DIR, 'articles.json'), path.resolve(DEST_DATA_DIR, 'articles.json.enc'));
}

// 2. Chiffrement des assets Bérangère
console.log('\n--- Chiffrement des médias (Images/Vidéos) ---');
encryptDirectory(PUBLIC_ASSETS_DIR, DEST_ASSETS_DIR);

console.log('\n--- TERMINÉ ---');
console.log(`Vous pouvez maintenant vérifier le dossier : ${DEST_DATA_DIR.replace(PROJECT_ROOT, '')}`);
