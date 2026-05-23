import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import UnifiedFooter from '../Components/UnifiedFooter';
import { motion } from 'framer-motion';
import { Book, Download } from 'lucide-react';
import { exportToPDF } from '../Utils/DocumentExporter';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

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

const stripFrontmatter = (md: string): string => {
    return md.replace(/^---\s*\n[\s\S]*?\n---\s*(\n|$)/, '');
};

const parseFrontmatter = (content: string): Record<string, string> | null => {
    const regex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
    const match = content.match(regex);
    if (!match) return null;

    const yamlContent = match[1];
    const data: Record<string, string> = {};

    yamlContent.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
            let value = valueParts.join(':').trim();
            value = value.replace(/^["']|["']$/g, '');
            // Clean YAML arrays like ["Linux", "Netfilter"] into "Linux, Netfilter"
            if (value.startsWith('[') && value.endsWith(']')) {
                value = value.replace(/[\[\]'"]/g, '').split(',').map(s => s.trim()).join(', ');
            }
            data[key.trim()] = value;
        }
    });
    return data;
};

const cleanMarkdownBody = (md: string): string => {
    let clean = stripFrontmatter(md);

    const lines = clean.split('\n');
    let h1Index = -1;
    let blockquoteIndex = -1;

    for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (trimmed.startsWith('# ')) {
            h1Index = i;
            break;
        }
    }

    if (h1Index !== -1) {
        lines.splice(h1Index, 1);

        for (let i = h1Index; i < lines.length; i++) {
            const trimmed = lines[i].trim();
            if (trimmed.startsWith('>') || (trimmed.startsWith('*') && trimmed.endsWith('*')) || (trimmed.startsWith('_') && trimmed.endsWith('_'))) {
                blockquoteIndex = i;
                lines.splice(blockquoteIndex, 1);
                break;
            }
            if (trimmed && !trimmed.startsWith('#')) {
                break;
            }
        }
    }

    // Also remove the first paragraph that serves as the objective
    let firstParaIndex = -1;
    for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('>') && !trimmed.startsWith('!') && !trimmed.startsWith('-') && !trimmed.startsWith('*') && !trimmed.startsWith('`')) {
            firstParaIndex = i;
            break;
        }
    }

    if (firstParaIndex !== -1) {
        lines.splice(firstParaIndex, 1);
    }

    return lines.join('\n');
};

const getObjectiveFromMarkdown = (md: string): string => {
    const cleanMd = stripFrontmatter(md);
    const lines = cleanMd.split('\n');
    for (let line of lines) {
        line = line.trim();
        if (line && !line.startsWith('#') && !line.startsWith('>') && !line.startsWith('!') && !line.startsWith('-') && !line.startsWith('*') && !line.startsWith('`')) {
            return line;
        }
    }
    return 'Configuration et mise en œuvre technique.';
};

const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        const year = parts[0];
        const monthNum = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);
        const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        if (monthNum >= 1 && monthNum <= 12) {
            return `${day} ${months[monthNum - 1]} ${year}`;
        }
    }
    return dateStr;
};

const getTextFromChildren = (children: any): string => {
    if (typeof children === 'string') return children;
    if (Array.isArray(children)) {
        return children.map(child => getTextFromChildren(child)).join('');
    }
    if (children && children.props && children.props.children) {
        return getTextFromChildren(children.props.children);
    }
    return '';
};

const cleanAlertText = (children: any, fullText: string): any => {
    const markerRegex = /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n?/;

    if (typeof children === 'string') {
        return children.replace(markerRegex, '');
    }

    if (Array.isArray(children)) {
        return children.map((child) => cleanAlertText(child, fullText));
    }

    if (children && children.props && children.props.children) {
        return React.cloneElement(children, {
            children: cleanAlertText(children.props.children, fullText)
        });
    }

    return children;
};

const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = React.useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button onClick={handleCopy} className="text-slate-400 hover:text-slate-600 transition-colors bg-white/50 hover:bg-white p-1 rounded-md border border-slate-200/60 shadow-sm" title="Copier">
            {copied ? (
                <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
            ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            )}
        </button>
    );
};

const CodeBlock = ({ node, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const isInline = !match && !children?.toString().includes('\n');
    
    if (isInline) {
        return (
            <code className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-mono text-[13px] font-semibold border border-blue-100/50" {...props}>
                {children}
            </code>
        );
    }
    
    const metaString = node?.data?.meta || (typeof node?.meta === 'string' ? node.meta : '');
    let title = '';
    const titleMatch = metaString.match(/title="([^"]+)"/) || metaString.match(/title=([^\s]+)/);
    if (titleMatch) {
        title = titleMatch[1];
    } else if (metaString && !metaString.includes('=')) {
        title = metaString.trim();
    }
    
    const language = match ? match[1] : '';
    const isTerminal = !title && ['bash', 'sh', 'shell', 'console'].includes(language);
    
    const rawText = getTextFromChildren(children);

    if (isTerminal) {
        return (
            <div className="relative group my-6 bg-slate-100 border border-slate-200/80 rounded-xl p-2 shadow-sm font-mono">
                {/* Terminal Header */}
                <div className="px-2 pb-2 pt-1 text-[12.5px] font-semibold text-slate-500 flex justify-between items-center font-sans">
                    <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Terminal
                    </span>
                    <CopyButton text={rawText} />
                </div>
                {/* Terminal Content (Inner Box) */}
                <div className="bg-white rounded-lg border border-slate-200/60 overflow-hidden">
                    <pre className="p-4 overflow-auto font-mono text-[13.5px] leading-relaxed text-slate-700">
                        <code>{children}</code>
                    </pre>
                </div>
            </div>
        );
    }

    // File Design
    const displayTitle = title || (language ? `${language} file` : 'Code');
    return (
        <div className="relative group my-6 bg-slate-100 border border-slate-200/80 rounded-xl p-2 shadow-sm font-mono">
            {/* File Header */}
            <div className="px-2 pb-2 pt-1 text-[12.5px] font-semibold text-slate-600 flex justify-between items-center font-sans">
                <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {displayTitle}
                </span>
                <CopyButton text={rawText} />
            </div>
            {/* File Content (Inner Box) without blue border */}
            <div className="bg-white rounded-lg border border-slate-200/60 overflow-hidden">
                <pre className="p-4 overflow-auto font-mono text-[13.5px] leading-relaxed text-slate-700">
                    <code>{children}</code>
                </pre>
            </div>
        </div>
    );
};

interface ExPageProps {
    embedded?: boolean;
    file?: string;
    title?: string;
}

const ExPage: React.FC<ExPageProps> = ({ embedded = false, file, title }) => {
    const [searchParams] = useSearchParams();
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [metadata, setMetadata] = useState<any>(null);

    // Use props if embedded, otherwise use searchParams
    const fileParam = embedded ? file : searchParams.get('file');
    const titleParam = (embedded ? title : searchParams.get('title')) || "Filtrage et Pare-feu sous Linux (iptables & nftables)";

    useEffect(() => {
        const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
        const defaultFile = "assets/documents/apprentissage/tech-internet/tp9-filtrage-linux.md";
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
                const parsedMeta = parseFrontmatter(text);
                setMetadata(parsedMeta);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching markdown:', err);
                setContent('# Erreur\\nImpossible de charger le document spécifié.');
                setMetadata(null);
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
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-12 h-12 border-4 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin" />
                            <p className="font-['Roboto_Mono'] text-slate-400 text-sm animate-pulse tracking-widest uppercase">Chargement...</p>
                        </div>
                    ) : (
                        <div className="prose-container bg-white text-slate-900 border border-slate-200/60 shadow-sm rounded-3xl p-6 md:p-12 my-2">
                            {/* Academic Cover Header */}
                            <div className="w-full border-b border-slate-200 pb-6 mb-8 font-sans">
                                {/* Top row: Module (resource) in small at top-left, Date in small at top-right with icon-only download button below it */}
                                <div className="flex justify-between items-start text-xs font-semibold text-slate-500 uppercase tracking-widest mb-6">
                                    <div className="px-2.5 py-1 rounded bg-slate-100/85 text-slate-650 text-[10.5px] font-bold">
                                        {metadata?.module || 'R201'}
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        {metadata?.date && (
                                            <div className="text-[11px] text-slate-500 font-medium italic font-mono lowercase tracking-normal">
                                                {formatDate(metadata.date)}
                                            </div>
                                        )}
                                        <button
                                            onClick={() => exportToPDF(metadata?.title || titleParam, fileParam || '')}
                                            className="no-print flex items-center justify-center w-8 h-8 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-600 rounded-lg transition-all border border-slate-200/40 shadow-sm"
                                            title="Télécharger en PDF"
                                        >
                                            <Download size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Centered Title formatted as - {title} - */}
                                <div className="text-center my-6 py-2">
                                    <h1 className="text-2xl md:text-3xl font-normal tracking-tight text-slate-900 font-['Paris2024'] uppercase">
                                        - {metadata?.title || titleParam} -
                                    </h1>
                                </div>

                                {/* Left-Aligned Metadata Block: Author, Competence & Techs */}
                                <div className="space-y-2 text-xs md:text-sm text-slate-700 font-['Baskerville'] mt-8 pt-4 border-t border-slate-100">
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-bold text-slate-905 min-w-[100px] text-[15px]">Auteur :</span>
                                        <span className="text-slate-800 font-semibold text-[15px]">Briac Le Meillat</span>
                                    </div>
                                    {metadata?.competence && (
                                        <div className="flex items-baseline gap-2">
                                            <span className="font-bold text-slate-905 min-w-[100px] text-[15px]">Compétence :</span>
                                            <span className="text-slate-800 text-[15px]">{metadata.competence}</span>
                                        </div>
                                    )}
                                    {metadata?.techs && (
                                        <div className="flex items-baseline gap-2 leading-relaxed flex-wrap">
                                            <span className="font-bold text-slate-905 min-w-[100px] text-[15px]">Technologies :</span>
                                            <div className="flex flex-wrap gap-1.5 items-center mt-1">
                                                {metadata.techs.split(',').map((tech: string, i: number) => (
                                                    <code key={i} className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-mono text-[12px] font-semibold border border-blue-100/50">
                                                        {tech.trim()}
                                                    </code>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Objectif Section: placing "Objectif :" just above and to the left of the objective text paragraph */}
                            {content && (
                                <div className="mb-8 font-['Baskerville'] text-[15px] leading-relaxed border-b border-slate-200/50 pb-6 mt-2">
                                    <span className="font-bold text-slate-950 block mb-1.5 text-[16px]">Objectif :</span>
                                    <div className="text-slate-750 font-['Baskerville'] text-[15.5px]">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                p: ({ node, ...props }) => <p className="leading-relaxed font-['Baskerville']" {...props} />,
                                                code: ({ node, className, children, ...props }: any) => (
                                                    <code className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-mono text-[13px] font-semibold border border-blue-100/50" {...props}>
                                                        {children}
                                                    </code>
                                                )
                                            }}
                                        >
                                            {getObjectiveFromMarkdown(content)}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            )}

                            {/* Markdown Render Body */}
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                                components={{
                                    h1: ({ node, ...props }) => <h1 className="text-2xl font-normal mt-10 mb-4 border-b border-slate-900 pb-1.5 text-slate-900 font-['Paris2024'] tracking-tight" {...props} />,
                                    h2: ({ node, ...props }) => <h2 className="text-xl font-normal mt-8 mb-3.5 text-slate-850 border-b border-slate-200 pb-1 font-['Paris2024'] tracking-tight" {...props} />,
                                    h3: ({ node, ...props }) => <h3 className="text-lg font-normal mt-6 mb-2 text-slate-800 font-['Paris2024']" {...props} />,
                                    h4: ({ node, ...props }) => {
                                        const childrenText = getTextFromChildren(props.children) || '';
                                        const match = childrenText.match(/^[EÉeé]tape\s+(\d+)\s*[:-]?\s*(.*)/i);
                                        if (match) {
                                            const stepNum = match[1].padStart(2, '0');
                                            return (
                                                <div className="flex items-start gap-4 mt-8 mb-4">
                                                    <div className="flex items-center text-lg font-mono font-normal text-slate-800 mt-0 shrink-0 tracking-widest">
                                                        <span className="text-slate-300 font-light mr-1.5">[</span>
                                                        {stepNum}
                                                        <span className="text-slate-300 font-light ml-1.5">]</span>
                                                    </div>
                                                    <h4 className="text-base font-normal text-slate-800 font-['Paris2024'] flex-1 pt-1" {...props} />
                                                </div>
                                            );
                                        }
                                        return <h4 className="text-base font-normal mt-5 mb-2.5 text-slate-800 font-['Paris2024']" {...props} />;
                                    },
                                    h5: ({ node, ...props }) => <h5 className="text-sm font-normal mt-4 mb-2 text-slate-800 font-['Paris2024']" {...props} />,
                                    p: ({ node, ...props }) => <p className="my-4 text-slate-800 leading-relaxed text-[15px] font-serif" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-4 text-slate-800 space-y-2 font-serif text-[15px]" {...props} />,
                                    ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-4 text-slate-800 space-y-2 font-serif text-[15px]" {...props} />,
                                    li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                                    a: ({ node, ...props }) => <a className="text-blue-650 hover:text-blue-700 underline font-semibold transition-colors font-serif" {...props} />,
                                    blockquote: ({ node, ...props }) => {
                                          const childrenText = getTextFromChildren(props.children);
                                          const trimmedText = childrenText.trim();
                                          let icon = "💡";
                                          let typeTitle = "Note";
                                          let textColor = "text-slate-600";
 
                                          if (trimmedText.startsWith('[!NOTE]')) {
                                              icon = "ℹ️";
                                              typeTitle = "Note";
                                              textColor = "text-blue-600";
                                          } else if (trimmedText.startsWith('[!TIP]')) {
                                              icon = "💡";
                                              typeTitle = "Conseil";
                                              textColor = "text-emerald-600";
                                          } else if (trimmedText.startsWith('[!IMPORTANT]')) {
                                              icon = "❗";
                                              typeTitle = "Important";
                                              textColor = "text-indigo-600";
                                          } else if (trimmedText.startsWith('[!WARNING]')) {
                                              icon = "⚠️";
                                              typeTitle = "Attention";
                                              textColor = "text-amber-650";
                                          } else if (trimmedText.startsWith('[!CAUTION]')) {
                                              icon = "🚨";
                                              typeTitle = "Danger";
                                              textColor = "text-red-650";
                                          }
 
                                          const cleanChildren = cleanAlertText(props.children, childrenText);
 
                                          return (
                                              <div className="relative group my-6 bg-slate-100 border border-slate-200/80 rounded-xl p-2 shadow-sm font-sans">
                                                  {/* Note Header */}
                                                  <div className={`px-2 pb-2 pt-1 text-[12.5px] font-bold uppercase tracking-wider flex items-center gap-2 ${textColor}`}>
                                                      <span>{icon}</span>
                                                      <span>{typeTitle}</span>
                                                  </div>
                                                  {/* Note Content (Inner Box) */}
                                                  <div className="bg-white rounded-lg border border-slate-200/60 p-4 text-slate-800 font-serif leading-relaxed text-[15px]">
                                                      {cleanChildren}
                                                  </div>
                                              </div>
                                          );
                                      },
                                     code: CodeBlock,
                                    table: ({ node, ...props }) => (
                                        <div className="overflow-x-auto my-8 border border-slate-200 rounded-2xl shadow-sm">
                                            <table className="min-w-full divide-y divide-slate-200" {...props} />
                                        </div>
                                    ),
                                    thead: ({ node, ...props }) => <thead className="bg-slate-50/80 font-sans" {...props} />,
                                    tbody: ({ node, ...props }) => <tbody className="divide-y divide-slate-100 bg-white font-serif" {...props} />,
                                    tr: ({ node, ...props }) => <tr className="hover:bg-slate-50/40 transition-colors" {...props} />,
                                    th: ({ node, ...props }) => <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider font-sans" {...props} />,
                                    td: ({ node, ...props }) => <td className="px-6 py-4 text-sm text-slate-600 font-medium" {...props} />,
                                    hr: ({ node, ...props }) => <hr className="my-10 border-slate-200" {...props} />,
                                }}
                            >
                                {cleanMarkdownBody(content)}
                            </ReactMarkdown>
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
