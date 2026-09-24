import { Proof } from '@/utils/tpsProvider';

export interface SearchResult {
    response: string;
    filtered: Proof[] | null;
}

const TECH_MAP: Record<string, string[]> = {
    flask: ['flask', 'jinja', 'python'],
    linux: ['linux', 'netfilter', 'iptables', 'nftables'],
    cisco: ['cisco', 'acl', 'routage', 'nat', 'pat', 'packet tracer'],
    postgresql: ['postgresql', 'postgres', 'sql', 'r207'],
    réseau: ['réseau', 'tcp', 'udp', 'wireshark', 'ip', 'icmp', 'network'],
    docker: ['docker', 'conteneur'],
    web: ['apache', 'nginx', 'http', 'web'],
    pxe: ['pxe', 'dhcp', 'tftp', 'bootp'],
    nat: ['nat', 'pat', 'cisco'],
    wireshark: ['wireshark', 'tcp', 'udp'],
};

function formatDate(proof: Proof): string {
    return new Date(proof.date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
}

export function searchEngine(query: string, proofs: Proof[]): SearchResult {
    const q = query.trim();

    if (/derniers?\s*(travaux|apprentissages?|tp|comptes?[- ]?rendus?)|récents?|nouveaux?\s*(tp|travaux)|last\s*(tp|work)/i.test(q)) {
        const filtered = proofs.slice(0, 5);
        return {
            response: "Voici les 5 derniers travaux enregistrés, du plus récent au plus ancien. Clique sur l'un d'eux pour lire le compte-rendu complet.",
            filtered,
        };
    }

    if (/dernier\s*projet\s*(perso|personnel)?|notgoogle|lyrae\s*shared|dernier\s*projet\s*perso/i.test(q)) {
        const found = proofs.find(p => /dev-web|flask/i.test(p.path)) ?? proofs[0];
        if (!found) {
            return { response: "Aucun projet trouvé.", filtered: [] };
        }
        return {
            response: `Le dernier projet personnel référencé est **${found.title}** (${found.module}, ${formatDate(found)}). Clique pour ouvrir le compte-rendu.`,
            filtered: [found],
        };
    }

    if (/comment.*(accéd|trouv|voir|aller)|où\s*(trouver|voir|accéder|aller|est)|comment\s+(puis|faire|access)|accès\s+au?\s*blog/i.test(q)) {
        return {
            response: "Tu es déjà sur le blog ! Chaque ligne de la liste ci-dessous est un travail pratique ou un compte-rendu. Clique dessus pour le lire directement dans le navigateur, ou utilise l'icône ↓ pour le télécharger.",
            filtered: null,
        };
    }

    const moduleMatch = q.match(/\b(R\d{3})\b/i);
    if (moduleMatch) {
        const mod = moduleMatch[1].toUpperCase();
        const found = proofs.filter(p => p.module.toUpperCase() === mod);
        if (found.length === 0) {
            return { response: `Aucun travail trouvé pour le module ${mod}.`, filtered: [] };
        }
        const sliced = found;
        return {
            response: `${found.length} résultat(s) pour le module ${mod}. Clique sur un travail pour l'ouvrir.`,
            filtered: sliced,
        };
    }

    const ql = q.toLowerCase();
    for (const [key, terms] of Object.entries(TECH_MAP)) {
        const matched = ql === key || terms.some(t => ql.includes(t)) || ql.includes(key);
        if (matched) {
            const found = proofs.filter(p =>
                terms.some(t =>
                    p.techs.some(tech => tech.toLowerCase().includes(t)) ||
                    p.title.toLowerCase().includes(t)
                )
            );
            if (found.length === 0) {
                return {
                    response: `Aucun résultat trouvé pour « ${q} ». Essaie : derniers travaux, flask, linux, cisco, R201…`,
                    filtered: [],
                };
            }
            return {
                response: `${found.length} résultat(s) trouvé(s) pour « ${q} ». Clique pour ouvrir.`,
                filtered: found,
            };
        }
    }

    const words = ql.split(/\s+/).filter(Boolean);
    const found = proofs.filter(p =>
        words.some(w =>
            p.title.toLowerCase().includes(w) ||
            p.module.toLowerCase().includes(w) ||
            p.techs.some(t => t.toLowerCase().includes(w))
        )
    );
    if (found.length === 0) {
        return {
            response: `Aucun résultat pour « ${q} ». Essaie : derniers travaux, flask, linux, cisco, R201…`,
            filtered: [],
        };
    }
    return {
        response: `${found.length} résultat(s) correspondant à « ${q} ».`,
        filtered: found,
    };
}
