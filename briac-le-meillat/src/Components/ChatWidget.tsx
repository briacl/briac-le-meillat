import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Mail } from 'lucide-react';

const SYSTEM_PROMPT = `Tu es l'assistant intégré du portfolio de Briac Le Meillat.
Tu aides les utilisateurs à naviguer et utiliser l'interface.
RÈGLES STRICTES :
1. Réponds uniquement à partir du contexte fourni.
2. Si une fonctionnalité ou une information n'existe pas ou n'est pas dans le contexte, dis-le clairement et propose STRICTEMENT la phrase suivante (sans rien ajouter après) : "voulez-vous envoyer cette suggestion au support ?".
3. Sois concis.
4. Guide étape par étape.
5. Langue : français.
`;

interface Message {
    role: 'user' | 'model';
    text: string;
    showSupportAction?: boolean;
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [context, setContext] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Initial message
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                { role: 'model', text: 'Bonjour ! Je suis l\'assistant IA du portfolio. Comment puis-je vous aider à naviguer ?' }
            ]);
        }
    }, [isOpen, messages.length]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchContext = async () => {
        if (context) return context;
        try {
            const response = await fetch('/docs/context.md');
            if (!response.ok) throw new Error('Context non trouvé');
            const text = await response.text();
            setContext(text);
            return text;
        } catch (error) {
            console.error('Erreur lors du chargement du contexte:', error);
            return '';
        }
    };

    const callGeminiAPI = async (userMessage: string, currentHistory: Message[]) => {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            return "Erreur : La clé API Gemini n'est pas configurée dans le fichier .env";
        }

        const projectContext = await fetchContext();
        
        const systemInstruction = {
            role: "system",
            parts: [{ text: `${SYSTEM_PROMPT}\n\nCONTEXTE DU PROJET :\n${projectContext}` }]
        };

        const contents = currentHistory.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));
        
        contents.push({
            role: 'user',
            parts: [{ text: userMessage }]
        });

        try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents,
                    systemInstruction
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                console.error("Gemini API Error:", errData);
                throw new Error(errData.error?.message || 'Erreur API Gemini');
            }

            const data = await res.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error: any) {
            console.error(error);
            return `Une erreur s'est produite lors de la communication avec l'IA : ${error.message}`;
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userText = input.trim();
        const newMessages = [...messages, { role: 'user' as const, text: userText }];
        
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        const aiResponse = await callGeminiAPI(userText, messages);
        
        // Détection de support
        const supportTrigger = "voulez-vous envoyer cette suggestion au support ?";
        const showSupportAction = aiResponse.toLowerCase().includes(supportTrigger.toLowerCase());

        setMessages([...newMessages, { 
            role: 'model', 
            text: aiResponse,
            showSupportAction 
        }]);
        
        setIsLoading(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4 w-[350px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-6rem)] 
                                 bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden
                                 flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <div className="flex items-center gap-2 text-white">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                <span className="font-['Paris2024'] uppercase tracking-widest text-sm">Assistant IA</span>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="text-white/50 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div 
                                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                                            msg.role === 'user' 
                                            ? 'bg-blue-600 text-white rounded-br-sm' 
                                            : 'bg-white/10 text-white/90 rounded-bl-sm border border-white/5'
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                    
                                    {/* Action Support Button */}
                                    {msg.showSupportAction && (
                                        <motion.button
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            onClick={() => {
                                                // On récupère le dernier message de l'utilisateur pour le mettre dans la suggestion
                                                const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.text || '';
                                                const suggestion = `Bonjour Briac, je souhaiterais suggérer l'ajout de la fonctionnalité suivante :\n\n"${lastUserMsg}"`;
                                                
                                                setIsOpen(false);
                                                navigate('/contact', { state: { message: suggestion } });
                                            }}
                                            className="mt-2 inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 
                                                     text-white text-xs font-mono px-3 py-2 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <Mail size={14} />
                                            Envoyer une suggestion au support
                                        </motion.button>
                                    )}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-start">
                                    <div className="bg-white/10 border border-white/5 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '0.1s' }} />
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '0.2s' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/10 bg-black/40">
                            <form 
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex items-center gap-2"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Posez votre question..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 
                                             text-sm text-white placeholder:text-white/30 focus:outline-none 
                                             focus:border-blue-500/50 transition-colors"
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-colors
                                             disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border border-white/10
                          backdrop-blur-md transition-colors ${
                              isOpen ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-blue-600 text-white hover:bg-blue-500'
                          }`}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </motion.button>
        </div>
    );
}
