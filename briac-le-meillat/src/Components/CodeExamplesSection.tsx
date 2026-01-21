import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';

const CODE_CARDS = [
    {
        title: "ProjectContext.tsx",
        language: "typescript",
        code: `export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  
  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject = { ...project, id: uuidv4() };
    setProjects(prev => [...prev, newProject]);
  };

  useEffect(() => {
    // Sync with backend
    api.sync(projects).then(console.log);
  }, [projects]);
  
  return (
    <ProjectContext.Provider value={{ projects }}>
      {children}
    </ProjectContext.Provider>
  );
};`
    },
    {
        title: "NeuralNetwork.css",
        language: "css",
        code: `.neuron-node {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, #00f2ff, #0055ff);
  box-shadow: 0 0 20px rgba(0, 242, 255, 0.6);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.neuron-node:hover {
  transform: scale(1.5);
  z-index: 100;
}

.connection-line {
  stroke: rgba(255, 255, 255, 0.2);
  stroke-width: 1px;
}`
    },
    {
        title: "ApiHandler.ts",
        language: "typescript",
        code: `async function fetchData(endpoint: string) {
  try {
    const response = await fetch(\`\${API_URL}/\${endpoint}\`);
    if (!response.ok) throw new Error('Network error');
    
    const data = await response.json();
    return data.map(item => ({
      ...item,
      processed: true,
      timestamp: new Date()
    }));
  } catch (error) {
    console.error('Fetch failed:', error);
    return null;
  }
}`
    }
];

export default function CodeExamplesSection() {
    return (
        <div className="w-full flex flex-col items-center justify-center">
            <GlassCard className="w-full overflow-hidden">
                <h2 className="text-[3rem] mb-12 text-[#0055ff] font-['Paris2024'] text-center">
                    QUELQUES EX DE CODES
                </h2>

                <div className="flex flex-col md:flex-row justify-between w-full gap-6 px-4">
                    {CODE_CARDS.map((card, index) => (
                        <div key={index} className="flex flex-col gap-4 w-full md:w-1/3 h-[400px]">
                            {/* Animated Container */}
                            <div className="relative w-full h-full overflow-hidden rounded-xl bg-[#0d1117]/80 backdrop-blur-sm border border-gray-700/50 shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent z-10 pointer-events-none" />

                                <motion.div
                                    animate={{ y: [0, -500] }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 25 + index * 5,
                                        ease: "linear"
                                    }}
                                    className="flex flex-col gap-4 p-4"
                                >
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="mb-4">
                                            {/* Window Header */}
                                            <div className="flex items-center px-3 py-2 bg-white/5 border-b border-white/5 gap-2 rounded-t-lg mb-2">
                                                <div className="flex gap-1.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                                                </div>
                                                <span className="text-[10px] text-gray-400 font-mono ml-2 opacity-50">{card.title}</span>
                                            </div>

                                            {/* Code Body */}
                                            <pre className="text-[10px] leading-relaxed font-mono text-gray-300 overflow-visible whitespace-pre-wrap break-all">
                                                <code className={card.language === 'typescript' ? 'text-blue-300' : 'text-purple-300'}>
                                                    {card.code}
                                                </code>
                                            </pre>
                                        </div>
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
}
