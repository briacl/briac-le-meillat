const rawContent = `---
title: "Introduction à QoS"
module: "Réseaux"
competence: ["Administrer", "Connecter"]
ac_lies: ["AC21.01"]
techs: ["Cisco", "QoS", "OSPF", "NAT", "DSCP", "IPP", "Wi-Fi"]
date: "2026-09-15"
status: "Terminé"
image: "/assets/projects/tp-qos-visu.jpg"
schema_image: "/assets/projects/tp-qos-schemas-packttracer.png"
---`;

function parseFrontmatter(rawContent) {
    const match = rawContent.match(/^\s*---\r?\n([\s\S]*?)\r?\n---/);
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
    }
    return result;
}
console.log(parseFrontmatter(rawContent));
