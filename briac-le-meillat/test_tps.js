const fs = require('fs');
const path = require('path');

function parseYamlList(lines, startIndex) {
    const list = [];
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

function parseFrontmatter(rawContent) {
    const match = rawContent.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return {};
    
    const yamlStr = match[1];
    const lines = yamlStr.split('\n');
    const result = { ac_lies: [], techs: [] };
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        const inlineArrayMatch = line.match(/^(\w+):\s*\[(.*)\]\s*$/);
        if (inlineArrayMatch) {
            const key = inlineArrayMatch[1];
            if (key === 'ac_lies' || key === 'techs') {
                const rawValues = inlineArrayMatch[2].trim() ? inlineArrayMatch[2].split(',') : [];
                result[key] = rawValues.map(s => s.trim().replace(/^["'](.*)["']$/, '$1'));
                continue;
            }
        }

        const kvMatch = line.match(/^(\w+):\s*["']?(.*?)["']?\s*$/);
        if (kvMatch && kvMatch[1] !== 'ac_lies' && kvMatch[1] !== 'techs') {
            result[kvMatch[1]] = kvMatch[2];
        } 
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

const dir = '/home/briacl/Development/briac-le-meillat/briac-le-meillat/public/assets/documents/apprentissage';
const globFiles = [];

function walk(dirPath) {
    const files = fs.readdirSync(dirPath);
    for (const f of files) {
        const full = path.join(dirPath, f);
        if (fs.statSync(full).isDirectory()) walk(full);
        else if (full.endsWith('.md')) globFiles.push(full);
    }
}
walk(dir);

const proofs = [];
for (const p of globFiles) {
    if (p.includes('/research-thinking/') || p.includes('/waiting/')) continue;
    const content = fs.readFileSync(p, 'utf8');
    const metadata = parseFrontmatter(content);
    if (metadata.module || metadata.title) {
        proofs.push({
            title: metadata.title,
            image: metadata.image,
            date: metadata.date,
            path: p.replace('/home/briacl/Development/briac-le-meillat/briac-le-meillat/public/', '')
        });
    }
}
proofs.sort((a, b) => new Date(b.date || '1970-01-01').getTime() - new Date(a.date || '1970-01-01').getTime());
const validProofs = proofs.filter(p => p.path && p.image);
console.log("Top 5 images:", validProofs.slice(0, 5).map(p => p.image));
