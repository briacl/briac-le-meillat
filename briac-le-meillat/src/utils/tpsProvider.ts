export interface Proof {
  title: string;
  module: string;
  competence: string | string[];
  ac_lies?: string[];
  techs: string[];
  date: string;
  status: string;
  image: string;
  path: string;
  content: string;
  link?: string;
  isPDF?: boolean;
  project_type?: string;
}

// Load all markdown files at build time
const rawFilesRT = import.meta.glob('/src/content/rt/**/*.md', { query: '?raw', eager: true });
const urlFilesRT = import.meta.glob('/src/content/rt/**/*.md', { query: '?url', eager: true });

const rawFilesNB = import.meta.glob('/src/content/NetworkBriac/**/*.md', { query: '?raw', eager: true });
const urlFilesNB = import.meta.glob('/src/content/NetworkBriac/**/*.md', { query: '?url', eager: true });

const rawFiles = { ...rawFilesRT, ...rawFilesNB };
const urlFiles = { ...urlFilesRT, ...urlFilesNB };

// Load all project images to map their hashed URLs
const projectImages = import.meta.glob('/src/assets/**/*.{png,jpg,jpeg,svg,webp,gif}', { query: '?url', eager: true });

function parseYamlList(lines: string[], startIndex: number): { list: string[], nextIndex: number } {
    const list: string[] = [];
    let i = startIndex;
    while (i < lines.length) {
        const line = lines[i];
        const match = line.match(/^\s*-\s*["']?(.*?)["']?\s*$/);
        if (match) {
            list.push(match[1]);
            i++;
        } else if (line.trim() === '' || line.startsWith(' ')) {
            if (line.trim() !== '' && !line.match(/^\s*-/)) break;
            i++;
        } else {
            break;
        }
    }
    return { list, nextIndex: i };
}

function parseFrontmatter(rawContent: string): Partial<Proof> {
    const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return {};
    
    const yamlStr = match[1];
    const lines = yamlStr.split('\n');
    const result: any = { ac_lies: [], techs: [] };
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Parse inline arrays like `ac_lies: ["AC11.01", "AC11.02"]`
        const inlineArrayMatch = line.match(/^(\w+):\s*\[(.*)\]\s*$/);
        if (inlineArrayMatch) {
            const key = inlineArrayMatch[1];
            if (key === 'ac_lies' || key === 'techs') {
                // If it's an empty array `[]`, values will be [''], so filter out empty strings
                const rawValues = inlineArrayMatch[2].trim() ? inlineArrayMatch[2].split(',') : [];
                result[key] = rawValues.map(s => s.trim().replace(/^["'](.*)["']$/, '$1'));
                continue;
            }
        }

        // Parse simple key: value (excluding arrays)
        const kvMatch = line.match(/^(\w+):\s*["']?(.*?)["']?\s*$/);
        if (kvMatch && kvMatch[1] !== 'ac_lies' && kvMatch[1] !== 'techs') {
            result[kvMatch[1]] = kvMatch[2];
        } 
        // Parse multiline arrays
        else if (line.startsWith('ac_lies:')) {
            const parsed = parseYamlList(lines, i + 1);
            result.ac_lies = parsed.list;
            i = parsed.nextIndex - 1;
        }
        else if (line.startsWith('techs:')) {
            const parsed = parseYamlList(lines, i + 1);
            result.techs = parsed.list;
            i = parsed.nextIndex - 1;
        }
    }
    
    return result;
}

function resolveImageUrl(rawImagePath: string | undefined): string | undefined {
    if (!rawImagePath) return undefined;
    
    // Extract the filename (e.g. from "/assets/projects/img.png" -> "img.png")
    const parts = rawImagePath.split('/');
    const filename = parts[parts.length - 1];
    
    // Search in projectImages dict
    const matchingKey = Object.keys(projectImages).find(k => k.endsWith(`/${filename}`));
    
    if (matchingKey) {
        return (projectImages as any)[matchingKey].default;
    }
    
    return rawImagePath; // Fallback to raw string if not found
}

export function getAllTps(): Proof[] {
    const proofs: Proof[] = [];
    
    for (const [path, moduleExports] of Object.entries(rawFiles)) {
        // EXCLUSION RULE: Hide anything in research-thinking or waiting, and hide standard tp2/tp3 to show perso versions instead
        if (
            path.includes('/research-thinking/') || 
            path.includes('/waiting/') ||
            path.includes('/tp2-flask.md') ||
            path.includes('/tp3-flask.md')
        ) {
            continue;
        }
        
        // Get the real generated URL for the markdown file
        const finalUrl = (urlFiles as any)[path]?.default || path;
        
        const rawContent = (moduleExports as any).default || moduleExports;
        const contentStr = typeof rawContent === 'string' ? rawContent : '';
        const metadata = parseFrontmatter(contentStr);
        
        // Only include if it has at least a module or a title
        if (metadata.module || metadata.title) {
            proofs.push({
                title: metadata.title || '',
                module: metadata.module || '',
                competence: metadata.competence || '',
                ac_lies: metadata.ac_lies || [],
                techs: metadata.techs || [],
                date: metadata.date || '1970-01-01',
                status: metadata.status || 'En cours',
                path: finalUrl,
                image: resolveImageUrl(metadata.image) || '',
                content: contentStr,
                project_type: metadata.project_type || 'iut',
            });
        }
    }
    
    // Sort by date descending
    return proofs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
