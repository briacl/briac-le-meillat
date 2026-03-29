import{j as e,G as o,m as a}from"./index-BR3cQis7.js";const n=[{title:"ProjectContext.tsx",language:"typescript",code:`export const ProjectProvider = ({ children }) => {
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
};`},{title:"NeuralNetwork.css",language:"css",code:`.neuron-node {
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
}`},{title:"ApiHandler.ts",language:"typescript",code:`async function fetchData(endpoint: string) {
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
}`}];function c(){return e.jsx("div",{className:"w-full flex flex-col items-center justify-center",children:e.jsxs(o,{className:"w-full overflow-hidden",children:[e.jsx("h2",{className:"text-[3rem] mb-12 text-[#0055ff] font-['Paris2024'] text-center",children:"QUELQUES EX DE CODES"}),e.jsx("div",{className:"flex flex-col md:flex-row justify-between w-full gap-6 px-4",children:n.map((t,r)=>e.jsx("div",{className:"flex flex-col gap-4 w-full md:w-1/3 h-[400px]",children:e.jsxs("div",{className:"relative w-full h-full overflow-hidden rounded-xl bg-[#0d1117]/80 backdrop-blur-sm border border-gray-700/50 shadow-2xl",children:[e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent z-10 pointer-events-none"}),e.jsx(a.div,{animate:{y:[0,-500]},transition:{repeat:1/0,duration:25+r*5,ease:"linear"},className:"flex flex-col gap-4 p-4",children:[1,2,3].map(s=>e.jsxs("div",{className:"mb-4",children:[e.jsxs("div",{className:"flex items-center px-3 py-2 bg-white/5 border-b border-white/5 gap-2 rounded-t-lg mb-2",children:[e.jsxs("div",{className:"flex gap-1.5",children:[e.jsx("div",{className:"w-2.5 h-2.5 rounded-full bg-[#ff5f56]"}),e.jsx("div",{className:"w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"}),e.jsx("div",{className:"w-2.5 h-2.5 rounded-full bg-[#27c93f]"})]}),e.jsx("span",{className:"text-[10px] text-gray-400 font-mono ml-2 opacity-50",children:t.title})]}),e.jsx("pre",{className:"text-[10px] leading-relaxed font-mono text-gray-300 overflow-visible whitespace-pre-wrap break-all",children:e.jsx("code",{className:t.language==="typescript"?"text-blue-300":"text-purple-300",children:t.code})})]},s))})]})},r))})]})})}export{c as default};
