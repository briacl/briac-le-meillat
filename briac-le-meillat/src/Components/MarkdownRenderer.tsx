import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
    content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    // Logic to strip emojis
    // This regex covers most common emoji ranges
    const stripEmojis = (text: string) => {
        return text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
    };

    const cleanContent = stripEmojis(content);

    return (
        <div className="prose prose-slate dark:prose-invert max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ node, ...props }) => <h1 className="font-['Paris2024'] text-4xl mb-8 mt-12 border-b border-gray-200 dark:border-gray-800 pb-4" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="font-['Paris2024'] text-3xl mb-6 mt-10 border-b border-gray-100 dark:border-gray-900 pb-2" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="font-['Paris2024'] text-2xl mb-4 mt-8" {...props} />,
                    h4: ({ node, ...props }) => <h4 className="font-['Paris2024'] text-xl mb-4 mt-6" {...props} />,
                    p: ({ node, ...props }) => <p className="font-['Baskerville'] text-lg leading-relaxed mb-6 text-gray-800 dark:text-gray-200" {...props} />,
                    ul: ({ node, ...props }) => <ul className="font-['Baskerville'] list-disc list-inside mb-6 space-y-2 text-gray-800 dark:text-gray-200" {...props} />,
                    ol: ({ node, ...props }) => <ol className="font-['Baskerville'] list-decimal list-inside mb-6 space-y-2 text-gray-800 dark:text-gray-200" {...props} />,
                    li: ({ node, ...props }) => <li className="font-['Baskerville'] text-lg" {...props} />,
                    code: ({ node, inline, className, children, ...props }: any) => {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline ? (
                            <pre className="font-['Roboto_Mono'] bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto my-6 border border-gray-200 dark:border-gray-800 text-sm">
                                <code className="font-['Roboto_Mono']" {...props}>
                                    {children}
                                </code>
                            </pre>
                        ) : (
                            <code className="font-['Roboto_Mono'] bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded text-sm" {...props}>
                                {children}
                            </code>
                        );
                    },
                    table: ({ node, ...props }) => (
                        <div className="my-8 overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-lg">
                            <table className="font-['Roboto_Mono'] w-full text-sm text-left border-collapse" {...props} />
                        </div>
                    ),
                    thead: ({ node, ...props }) => <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800" {...props} />,
                    tbody: ({ node, ...props }) => <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50" {...props} />,
                    th: ({ node, ...props }) => <th className="px-6 py-3 font-semibold uppercase tracking-wider" {...props} />,
                    td: ({ node, ...props }) => <td className="px-6 py-4" {...props} />,
                    blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-accent-primary pl-6 py-2 my-8 italic text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/30 rounded-r-lg" {...props} />
                    ),
                    hr: ({ node, ...props }) => <hr className="my-12 border-gray-200 dark:border-gray-800" {...props} />,
                    img: ({ node, ...props }) => (
                        <div className="my-10 flex flex-col items-center">
                            <img className="rounded-xl shadow-2xl max-w-full h-auto border border-gray-200 dark:border-gray-800" {...props} />
                            {props.alt && <p className="mt-4 text-sm text-gray-500 font-['Montserrat italic']">{props.alt}</p>}
                        </div>
                    ),
                    strong: ({ node, ...props }) => <strong className="font-bold text-gray-900 dark:text-white" {...props} />,
                    em: ({ node, ...props }) => <em className="italic" {...props} />,
                }}
            >
                {cleanContent}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;
