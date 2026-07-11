import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Code2, Plus, Trash } from 'lucide-react';

interface CustomTodoItem {
    id: string;
    text: string;
    checked: boolean;
}

const TODO_ITEMS = [
    "installer le server NAS (TrueNAS)",
    "installer le server asterisk pour permettre de s'appeler sur NetworkBriac (car le tp de téléphonie a été un enfer à vivre, mais c'est cool de pouvoir s'appeler via le réseau)",
    "tester (pour le fun et l'apprentissage) la création de mon propre proxy",
    "tester (pour le fun et l'apprentissage) la création de ma propre autorité de certification (avec openssl) pour faire du HTTPS en local proprement"
];

const LOCAL_STORAGE_KEY = 'briac_admin_todo_state';
const CUSTOM_ITEMS_KEY = 'briac_admin_todo_custom_items';

const APPLE_BEZIER: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98];

export default function AdminTodoList() {
    const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
    const [customItems, setCustomItems] = useState<CustomTodoItem[]>([]);
    const [newItemText, setNewItemText] = useState('');

    // N'afficher ce composant que si on est en mode développement
    if (!import.meta.env.DEV) {
        return null;
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
            try {
                setCheckedItems(JSON.parse(saved));
            } catch (e) {
                console.error("Erreur lors de la lecture de la todo list", e);
            }
        }

        const savedCustom = localStorage.getItem(CUSTOM_ITEMS_KEY);
        if (savedCustom) {
            try {
                setCustomItems(JSON.parse(savedCustom));
            } catch (e) {
                console.error("Erreur lors de la lecture des tâches personnalisées", e);
            }
        }
    }, []);

    const toggleItem = (index: number) => {
        setCheckedItems(prev => {
            const newState = { ...prev, [index]: !prev[index] };
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
            return newState;
        });
    };

    const toggleCustomItem = (id: string) => {
        setCustomItems(prev => {
            const newState = prev.map(item =>
                item.id === id ? { ...item, checked: !item.checked } : item
            );
            localStorage.setItem(CUSTOM_ITEMS_KEY, JSON.stringify(newState));
            return newState;
        });
    };

    const addCustomItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemText.trim()) return;

        const newItem: CustomTodoItem = {
            id: Date.now().toString(),
            text: newItemText.trim(),
            checked: false
        };

        setCustomItems(prev => {
            const newState = [...prev, newItem];
            localStorage.setItem(CUSTOM_ITEMS_KEY, JSON.stringify(newState));
            return newState;
        });
        setNewItemText('');
    };

    const deleteCustomItem = (id: string) => {
        setCustomItems(prev => {
            const newState = prev.filter(item => item.id !== id);
            localStorage.setItem(CUSTOM_ITEMS_KEY, JSON.stringify(newState));
            return newState;
        });
    };

    return (
        <section className="w-full bg-[#fbfbfd] flex flex-col items-center justify-center py-20 px-6 relative z-20 border-t border-b border-zinc-200/50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: APPLE_BEZIER }}
                className="w-full max-w-4xl bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100"
            >
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <Code2 size={24} />
                    </div>
                    <div>
                        <h2 className="font-['Paris2024'] text-2xl md:text-3xl text-zinc-900 leading-tight">
                            projets que j'aimerais réaliser quand jen aurais (et prendrais) le temps ;)
                        </h2>
                        <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400 mt-2">
                            Mode Développeur Uniquement
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    {/* Hardcoded items */}
                    {TODO_ITEMS.map((item, index) => {
                        const isChecked = checkedItems[index] || false;
                        return (
                            <motion.div
                                key={`hardcoded-${index}`}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className={`flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 cursor-pointer border ${
                                    isChecked 
                                        ? 'bg-zinc-50 border-zinc-200/50' 
                                        : 'bg-white border-zinc-100 hover:border-zinc-200 hover:shadow-sm'
                                }`}
                                onClick={() => toggleItem(index)}
                            >
                                <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center transition-colors duration-300 ${
                                    isChecked ? 'bg-blue-600 text-white' : 'bg-zinc-100 border border-zinc-200 text-transparent'
                                }`}>
                                    <Check size={14} strokeWidth={3} className={isChecked ? 'opacity-100' : 'opacity-0'} />
                                </div>
                                <p className={`text-sm md:text-base leading-relaxed transition-colors duration-300 ${
                                    isChecked ? 'text-zinc-400 line-through' : 'text-zinc-700'
                                }`}>
                                    {item}
                                </p>
                            </motion.div>
                        );
                    })}

                    {/* Custom dynamic items */}
                    {customItems.map((item, index) => {
                        const isChecked = item.checked;
                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: (TODO_ITEMS.length + index) * 0.1, duration: 0.5 }}
                                className={`flex items-start justify-between gap-4 p-4 rounded-2xl transition-all duration-300 border ${
                                    isChecked 
                                        ? 'bg-zinc-50 border-zinc-200/50' 
                                        : 'bg-white border-zinc-100 hover:border-zinc-200 hover:shadow-sm'
                                }`}
                            >
                                <div 
                                    className="flex items-start gap-4 flex-grow cursor-pointer"
                                    onClick={() => toggleCustomItem(item.id)}
                                >
                                    <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center transition-colors duration-300 ${
                                        isChecked ? 'bg-blue-600 text-white' : 'bg-zinc-100 border border-zinc-200 text-transparent'
                                    }`}>
                                        <Check size={14} strokeWidth={3} className={isChecked ? 'opacity-100' : 'opacity-0'} />
                                    </div>
                                    <p className={`text-sm md:text-base leading-relaxed transition-colors duration-300 ${
                                        isChecked ? 'text-zinc-400 line-through' : 'text-zinc-700'
                                    }`}>
                                        {item.text}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteCustomItem(item.id);
                                    }}
                                    className="text-zinc-400 hover:text-red-500 hover:bg-red-50/50 p-1.5 rounded-lg transition-all duration-200 flex-shrink-0"
                                    title="Supprimer la tâche"
                                >
                                    <Trash size={16} />
                                </button>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Add new item form */}
                <form onSubmit={addCustomItem} className="mt-8 flex gap-3">
                    <input
                        type="text"
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        placeholder="Ajouter une tâche personnalisée..."
                        className="flex-grow px-5 py-3 rounded-2xl border border-zinc-200 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 text-sm md:text-base transition-all duration-200 bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white text-zinc-800 placeholder-zinc-400"
                    />
                    <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 text-sm md:text-base shadow-sm hover:shadow active:scale-98"
                    >
                        <Plus size={18} strokeWidth={2.5} />
                        <span className="hidden sm:inline">Ajouter</span>
                    </button>
                </form>
            </motion.div>
        </section>
    );
}
