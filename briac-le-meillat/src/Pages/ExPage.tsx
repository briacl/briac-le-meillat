import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import UnifiedFooter from '../Components/UnifiedFooter';
import { motion } from 'framer-motion';
import { Book, Download } from 'lucide-react';
import { exportToPDF } from '../Utils/DocumentExporter';

const PRINT_STYLES = `
@media print {
    @page {
        margin: 2cm;
        size: A4;
    }
    body {
        background: white !important;
        color: black !important;
    }
    .no-print {
        display: none !important;
    }
    .print-only {
        display: block !important;
    }
    .prose-container {
        box-shadow: none !important;
        border: none !important;
        padding: 0 !important;
        margin: 0 !important;
    }
    h1 {
        font-size: 28pt !important;
        margin-bottom: 20pt !important;
        color: black !important;
    }
    p, li {
        font-size: 11pt !important;
        line-height: 1.6 !important;
    }
    pre, code {
        background: #f5f5f5 !important;
        border: 1px solid #ddd !important;
        page-break-inside: avoid;
    }
    .border-b {
        border-color: #eee !important;
    }
}
`;

interface ExPageProps {
    embedded?: boolean;
    file?: string;
    title?: string;
}

const ExPage: React.FC<ExPageProps> = ({ embedded = false, file, title }) => {
    const [searchParams] = useSearchParams();
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    
    // Use props if embedded, otherwise use searchParams
    const fileParam = embedded ? file : searchParams.get('file');
    const titleParam = (embedded ? title : searchParams.get('title')) || "Révisions : Signaux et Systèmes (R205)";

    useEffect(() => {
        const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
        const defaultFile = "assets/documents/apprentissage/revisions.md";
        const targetFile = fileParam || defaultFile;
        
        // Clean path to avoid double slashes
        const cleanPath = targetFile.startsWith('/') ? targetFile.slice(1) : targetFile;

        fetch(`${baseUrl}${cleanPath}?v=${Date.now()}`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.text();
            })
            .then(text => {
                setContent(text);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching markdown:', err);
                setContent('# Erreur\nImpossible de charger le document spécifié.');
                setLoading(false);
            });
    }, [fileParam]);

    const contentArea = (
        <main className={`${embedded ? 'py-0' : 'pt-24 pb-20'} px-4 md:px-8`}>
            <style>{PRINT_STYLES}</style>
            <div className="max-w-4xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: embedded ? 0 : 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`${embedded ? 'bg-transparent border-none shadow-none p-0' : 'bg-white dark:bg-slate-900/40 rounded-3xl p-8 md:p-12 border border-slate-100 dark:border-slate-800/50 shadow-xl backdrop-blur-sm'}`}
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-8 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary no-print">
                                <Book className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-['Roboto_Mono'] text-[11px] uppercase tracking-[0.2em] text-accent-primary font-bold">Rapport Académique</p>
                                <h1 className="font-['Paris2024'] text-3xl md:text-5xl text-slate-900 dark:text-white mt-1 uppercase break-words leading-tight">{titleParam}</h1>
                            </div>
                        </div>

                        <button 
                            onClick={() => exportToPDF(titleParam, fileParam || '')}
                            className="no-print flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                        >
                            <Download size={18} />
                            <span>Télécharger PDF</span>
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-12 h-12 border-4 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin" />
                            <p className="font-['Roboto_Mono'] text-slate-400 text-sm animate-pulse tracking-widest uppercase">Chargement...</p>
                        </div>
                    ) : (
                        <div className="prose-container">
                            <div className="whitespace-pre-wrap font-sans text-slate-700 dark:text-slate-300 leading-relaxed">
                                {content}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </main>
    );

    if (embedded) {
        return contentArea;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] transition-colors duration-300">
            <Navbar />
            {contentArea}
            <UnifiedFooter />
        </div>
    );
};

export default ExPage;
