import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCUMENTS_DIR = path.join(__dirname, 'public/assets/documents/apprentissage');
const OUTPUT_FILE = path.join(__dirname, 'public/assets/data/registry.json');

/**
 * Extrait le frontmatter d'un fichier Markdown via Regex
 * Évite l'ajout de dépendances comme gray-matter
 */
function parseFrontmatter(content) {
    const regex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
    const match = content.match(regex);
    
    if (!match) return null;
    
    const yamlContent = match[1];
    const data = {};
    
    // Parsing ultra-simple du YAML (clé: valeur/tableau)
    yamlContent.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
            let value = valueParts.join(':').trim();
            
            // Nettoyage des guillemets
            value = value.replace(/^["']|["']$/g, '');
            
            // Parsing des tableaux basiques [A, B]
            if (value.startsWith('[') && value.endsWith(']')) {
                data[key.trim()] = value
                    .slice(1, -1)
                    .split(',')
                    .map(item => item.trim().replace(/^["']|["']$/g, ''));
            } else {
                data[key.trim()] = value;
            }
        }
    });
    
    return data;
}

/**
 * Parcourt récursivement les dossiers pour trouver les .md
 */
function getMarkdownFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            getMarkdownFiles(filePath, fileList);
        } else if (file.endsWith('.md') && file !== 'data.json') {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

function generateIndex() {
    console.log('🚀 Démarrage de l\'indexation des preuves...');
    
    if (!fs.existsSync(DOCUMENTS_DIR)) {
        console.error('❌ Dossier documents/apprentissage introuvable.');
        return;
    }

    const files = getMarkdownFiles(DOCUMENTS_DIR);
    const proofs = [];

    files.forEach(filePath => {
        const content = fs.readFileSync(filePath, 'utf8');
        const metadata = parseFrontmatter(content);
        
        if (metadata && metadata.title) {
            // Calcul du chemin relatif pour le frontend
            const relativePath = path.relative(path.join(__dirname, 'public'), filePath);
            
            proofs.push({
                ...metadata,
                path: relativePath
            });
        }
    });

    // Tri par date décroissante
    proofs.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

    const registry = {
        lastUpdated: new Date().toISOString(),
        total: proofs.length,
        proofs: proofs
    };

    // Création du dossier data si inexistant
    const dataDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(registry, null, 2));
    console.log(`✅ Indexation terminée : ${proofs.length} preuves trouvées.`);
    console.log(`📂 Registre généré : public/assets/data/registry.json`);
}

generateIndex();
