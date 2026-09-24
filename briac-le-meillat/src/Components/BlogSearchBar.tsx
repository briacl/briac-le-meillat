import { useState, FormEvent } from 'react';
import { Sparkles, Search } from 'lucide-react';
import { searchEngine } from '@/Utils/searchEngine';
import { Proof } from '@/utils/tpsProvider';

interface BlogSearchBarProps {
    onResult: (query: string, response: string, filtered: Proof[] | null) => void;
    proofs: Proof[];
    isLoading: boolean;
    setIsLoading: (v: boolean) => void;
    compact?: boolean;
    initialValue?: string;
}

export default function BlogSearchBar({
    onResult,
    proofs,
    isLoading,
    setIsLoading,
    compact = false,
    initialValue = '',
}: BlogSearchBarProps) {
    const [query, setQuery] = useState(initialValue);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!query.trim() || isLoading) return;
        const result = searchEngine(query.trim(), proofs);
        onResult(query.trim(), result.response, result.filtered);
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
                        Go
                    </button>
                </div>
            </form>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="w-full">
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
                        className="text-zinc-400 hover:text-zinc-600"
                    />
                </button>
            </div>
        </form>
    );
}
