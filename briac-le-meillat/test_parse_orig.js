const fs = require('fs');

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

const content = fs.readFileSync('/home/briacl/Development/briac-le-meillat/briac-le-meillat/public/assets/documents/apprentissage/sae102/sae102.md', 'utf8');
console.log(parseFrontmatter(content));
