import { useState, useRef, FormEvent } from 'react';
import { Sparkles, Search } from 'lucide-react';

const SYSTEM_PROMPT = `Tu es l'assistant IA du portfolio de Briac Le Meillat, intégré à la page Blog/Recherche.
Tu aides les visiteurs à explorer les travaux, projets et apprentissages de Briac.
RÈGLES STRICTES :
1. Réponds uniquement à partir du contexte fourni.
2. Guide vers le contenu concret : cite le titre exact, sa page ou section.
3. Pour les TPs → indique qu'ils sont consultables dans le Blog (/blog).
4. Pour les projets perso → indique qu'ils sont dans TheToolset ou le NeuralNetworkBackground (/).
5. Quand on demande les "derniers apprentissages" → cite les 3 TPs les plus récents avec module et date.
6. Si une info manque → dis-le clairement puis propose exactement : "voulez-vous envoyer cette suggestion au support ?"
7. Sois concis, en français. 2-3 éléments clés max par réponse.
`;

interface BlogSearchBarProps {
    onResult: (query: string, response: string) => void;
    isLoading: boolean;
    setIsLoading: (v: boolean) => void;
    compact?: boolean;
    initialValue?: string;
}

export default function BlogSearchBar({
    onResult,
    isLoading,
    setIsLoading,
    compact = false,
    initialValue = '',
}: BlogSearchBarProps) {
    const [query, setQuery] = useState(initialValue);
    const contextCacheRef = useRef<string | null>(null);

    const fetchContext = async () => {
        if (contextCacheRef.current) return contextCacheRef.current;
        try {
            const res = await fetch('/docs/context.md');
            if (!res.ok) throw new Error();
            const text = await res.text();
            contextCacheRef.current = text;
            return text;
        } catch {
            return '';
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!query.trim() || isLoading) return;

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            onResult(query, "Erreur : clé API Gemini non configurée.");
            return;
        }

        setIsLoading(true);
        const ctx = await fetchContext();

        const systemInstruction = {
            role: 'system',
            parts: [{ text: `${SYSTEM_PROMPT}\n\nCONTEXTE :\n${ctx}` }],
        };

        try {
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ role: 'user', parts: [{ text: query.trim() }] }],
                        systemInstruction,
                    }),
                }
            );
            const data = await res.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
            onResult(query.trim(), text);
        } catch {
            onResult(query.trim(), "Une erreur s'est produite. Réessayez.");
        } finally {
            setIsLoading(false);
        }
    };

    if (compact) {
        return (
            <form onSubmit={handleSubmit} className="w-full">
                <div
                    className="flex items-center bg-white shadow-sm"
                    style={{ borderRadius: '12px', border: 'none' }}
                >
                    <Search size={15} className={`ml-4 flex-shrink-0 ${isLoading ? 'text-[#0075FF] animate-pulse' : 'text-zinc-400'}`} />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Nouvelle recherche…"
                        disabled={isLoading}
                        style={{ border: 'none', outline: 'none', boxShadow: 'none', background: 'transparent' }}
                        className="flex-1 text-zinc-800 placeholder:text-zinc-400 font-sans px-3 py-2.5 text-sm"
                    />
                    <button
                        type="submit"
                        disabled={!query.trim() || isLoading}
                        className="mr-2 flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors font-mono uppercase tracking-widest px-3 py-1.5 text-[9px]"
                        style={{ borderRadius: '8px' }}
                    >
                        <Sparkles size={10} />
                        {isLoading ? 'Recherche…' : 'Go'}
                    </button>
                </div>
            </form>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="w-full">
            {/* Ombre portée douce comme Gemini, bords à 16px */}
            <div
                className="flex items-center bg-white"
                style={{
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 2px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
                }}
            >
                <Search
                    size={18}
                    className={`ml-5 flex-shrink-0 ${isLoading ? 'text-[#0075FF] animate-pulse' : 'text-zinc-400'}`}
                />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Recherchez parmi les travaux de Briac…"
                    disabled={isLoading}
                    style={{ border: 'none', outline: 'none', boxShadow: 'none', background: 'transparent' }}
                    className="flex-1 text-zinc-800 placeholder:text-zinc-400 font-sans px-4 py-3.5 text-base"
                />
                <button
                    type="submit"
                    disabled={!query.trim() || isLoading}
                    className="mr-4 flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Rechercher"
                >
                    <Sparkles
                        size={18}
                        className={isLoading ? 'text-[#f336f0] animate-spin' : 'text-zinc-400 hover:text-zinc-600'}
                    />
                </button>
            </div>
        </form>
    );
}
