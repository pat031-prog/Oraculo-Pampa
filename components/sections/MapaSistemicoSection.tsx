import React, { useState } from 'react';
import Panel from '../ui/Panel';
import Spinner from '../ui/Spinner';
import { generateContent } from '../../services/geminiService';

interface Node {
    id: string;
    label: string;
    cx: string;
    cy: string;
    prompt: string;
    color: string;
}

const NODES: Node[] = [
    { id: 'tech', label: 'TECNO/IA', cx: '50%', cy: '15%', prompt: 'Investiga las últimas noticias de IA y Tecnología en Argentina. Analiza cómo este vector está presionando o liberando tensión sobre la economía y el empleo HOY.', color: '#26c6da' },
    { id: 'economic', label: 'ECON/FIN', cx: '85%', cy: '35%', prompt: 'Investiga los indicadores financieros de hoy (Dólar, Riesgo País, Bonos). ¿Cómo está afectando esto INMEDIATAMENTE a la estabilidad social y política?', color: '#ffee58' },
    { id: 'geopolitical', label: 'GEOPOL', cx: '85%', cy: '75%', prompt: 'Busca noticias sobre la relación Argentina-China-EEUU-FMI de esta semana. ¿Qué riesgos sistémicos externos están activos ahora mismo?', color: '#ef5350' },
    { id: 'social', label: 'SOCIAL', cx: '50%', cy: '95%', prompt: 'Busca noticias sobre el clima social hoy en Argentina. ¿Cómo está reaccionando la población a las variables económicas actuales?', color: '#f0abfc' },
    { id: 'astro', label: 'ASTRO', cx: '15%', cy: '75%', prompt: 'Busca datos del clima y actividad solar hoy. ¿Hay algún factor ambiental agudo (tormenta, sequía) impactando la infraestructura?', color: '#ab47bc' },
    { id: 'agri', label: 'AGRO/REC', cx: '15%', cy: '35%', prompt: 'Busca noticias del campo y cosecha hoy. ¿Cómo está fluyendo el ingreso de divisas y qué impacto tiene en la estabilidad del sistema?', color: '#66bb6a' },
];

const MapaSistemicoSection: React.FC = () => {
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [analysis, setAnalysis] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

    const handleNodeClick = async (node: Node) => {
        if (isLoading) return;
        setSelectedNode(node);
        setIsLoading(true);
        setAnalysis('');
        try {
            const systemPrompt = `Como Oráculo Pampa, usa Google Search para responder con DATOS REALES DE HOY. `;
            const fullPrompt = systemPrompt + node.prompt + " Sé conciso, directo y usa vocabulario de Teoría de Sistemas (feedback loops, cuellos de botella).";
            const result = await generateContent(fullPrompt, true);
            setAnalysis(result);
        } catch (error) {
            console.error("Failed to generate systemic analysis", error);
            setAnalysis("Error al proyectar el análisis desde el glifo. La conexión entrópica es inestable.");
        } finally {
            setIsLoading(false);
        }
    };
    
    // Complex Central Engine Glyph
    const CentralNexus = () => (
        <g transform="translate(250, 250)">
            {/* Outer Rotating Ring */}
            <circle r="60" fill="none" stroke="#26c6da" strokeWidth="1" strokeDasharray="5,5" opacity="0.3" className="animate-spin-slow" />
            
            {/* Inner Counter-Rotating Hexagon */}
            <g className="animate-spin-reverse-slow">
                <path d="M0 -40 L34.6 20 L0 80 L-34.6 20 Z" fill="none" stroke="#f0abfc" strokeWidth="1" opacity="0.5" transform="scale(0.8)" />
                <path d="M 0 -50 L 43.3 -25 L 43.3 25 L 0 50 L -43.3 25 L -43.3 -25 Z" fill="none" stroke="#f0abfc" strokeWidth="2" />
            </g>
            
            {/* Core Pulse */}
            <circle r="10" fill="#f0abfc" className="animate-pulse">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
            </circle>
            
            <text y="5" fontFamily="VT323" fontSize="14" fill="#fff" textAnchor="middle" dominantBaseline="middle" className="pointer-events-none select-none" style={{ textShadow: '0 0 5px #f0abfc' }}>
                NEXUS
            </text>
        </g>
    );

    // Background Polar Grid
    const PolarGrid = () => (
        <g transform="translate(250, 250)" opacity="0.1">
            <circle r="100" fill="none" stroke="#fff" strokeWidth="0.5" />
            <circle r="180" fill="none" stroke="#fff" strokeWidth="0.5" />
            <line x1="-250" y1="0" x2="250" y2="0" stroke="#fff" strokeWidth="0.5" />
            <line x1="0" y1="-250" x2="0" y2="250" stroke="#fff" strokeWidth="0.5" />
            <line x1="-176" y1="-176" x2="176" y2="176" stroke="#fff" strokeWidth="0.5" />
            <line x1="176" y1="-176" x2="-176" y2="176" stroke="#fff" strokeWidth="0.5" />
        </g>
    );

    return (
        <div className="animate-[fadeIn_0.6s_ease-out] h-full flex flex-col">
            <h2 className="font-['VT323'] text-2xl md:text-4xl text-[#f0abfc] mb-4 flex items-center gap-2">
                <span className="text-[#26c6da]">⌬</span> MAPA SISTÉMICO DE CAUSALIDAD
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">
                
                {/* INTERACTIVE HOLOGRAPHIC MAP */}
                <div className="lg:col-span-8 flex flex-col">
                    <Panel className="relative w-full aspect-square lg:aspect-video flex-grow overflow-hidden bg-[rgba(10,5,20,0.8)] border-[#26c6da] shadow-[0_0_30px_rgba(38,198,218,0.1)]">
                        <div className="absolute top-2 left-2 text-[10px] text-[#26c6da] font-mono opacity-70">
                            MODE: ORBITAL_VIEW<br/>
                            ZOOM: 1.0X<br/>
                            TRACKING: ACTIVE
                        </div>
                        
                        <svg width="100%" height="100%" viewBox="0 0 500 500" preserveAspectRatio="xMidYMid meet">
                            <defs>
                                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="3" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                                <linearGradient id="linkGradient" gradientUnits="userSpaceOnUse">
                                    <stop offset="0%" stopColor="#26c6da" stopOpacity="0" />
                                    <stop offset="50%" stopColor="#26c6da" stopOpacity="1" />
                                    <stop offset="100%" stopColor="#26c6da" stopOpacity="0" />
                                </linearGradient>
                            </defs>

                            <PolarGrid />
                            
                            {/* CONNECTIONS (Animated) */}
                            {NODES.map(node => (
                                <g key={`link-${node.id}`}>
                                    {/* Base Line */}
                                    <line 
                                        x1="250" y1="250" 
                                        x2={parseFloat(node.cx) / 100 * 500} 
                                        y2={parseFloat(node.cy) / 100 * 500}
                                        stroke={selectedNode?.id === node.id ? node.color : '#26c6da'} 
                                        strokeWidth="1"
                                        opacity="0.2"
                                    />
                                    {/* Data Packet Flow (Only visible on hover/select) */}
                                    {(hoveredNodeId === node.id || selectedNode?.id === node.id) && (
                                        <line 
                                            x1="250" y1="250" 
                                            x2={parseFloat(node.cx) / 100 * 500} 
                                            y2={parseFloat(node.cy) / 100 * 500}
                                            stroke={node.color}
                                            strokeWidth="2"
                                            strokeDasharray="10, 200"
                                            className="animate-[dash-flow_1s_linear_infinite]"
                                            style={{ filter: 'url(#glow)' }}
                                        />
                                    )}
                                </g>
                            ))}

                            <CentralNexus />

                            {/* NODES */}
                            {NODES.map(node => (
                                <g 
                                    key={node.id} 
                                    className="cursor-pointer transition-all duration-300" 
                                    onClick={() => handleNodeClick(node)}
                                    onMouseEnter={() => setHoveredNodeId(node.id)}
                                    onMouseLeave={() => setHoveredNodeId(null)}
                                    style={{ opacity: selectedNode && selectedNode.id !== node.id ? 0.4 : 1 }}
                                >
                                    {/* Node Orbital Ring */}
                                    <circle 
                                        cx={node.cx} cy={node.cy} r="25" 
                                        fill="transparent" 
                                        stroke={node.color} 
                                        strokeWidth="1" 
                                        strokeDasharray="4,2"
                                        opacity="0.5"
                                        className={hoveredNodeId === node.id ? "animate-spin-slow" : ""}
                                    />
                                    
                                    {/* Node Core */}
                                    <circle 
                                        cx={node.cx} cy={node.cy} r="6" 
                                        fill={selectedNode?.id === node.id ? '#fff' : '#0d051c'} 
                                        stroke={node.color}
                                        strokeWidth="2"
                                        filter={selectedNode?.id === node.id || hoveredNodeId === node.id ? 'url(#glow)' : ''}
                                    />

                                    {/* Label Background */}
                                    <rect 
                                        x={parseFloat(node.cx)/100*500 - 40} 
                                        y={parseFloat(node.cy)/100*500 + 15} 
                                        width="80" height="16" 
                                        fill="#000" fillOpacity="0.7" 
                                        rx="2"
                                    />
                                    
                                    {/* Text Label */}
                                    <text 
                                        x={node.cx} y={node.cy} dy="26"
                                        fill={node.color} 
                                        textAnchor="middle" 
                                        fontSize="10"
                                        className="font-mono tracking-widest font-bold pointer-events-none"
                                    >
                                        {node.label}
                                    </text>
                                </g>
                            ))}
                        </svg>
                    </Panel>
                </div>

                {/* SIDEBAR: GUIDE & ANALYSIS */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                    
                    {/* HOW-TO GUIDE (Always visible) */}
                    <div className="bg-[#0d051c] border-l-4 border-[#26c6da] p-4 bg-opacity-80">
                        <h3 className="text-[#26c6da] font-['VT323'] text-xl mb-1 flex items-center gap-2">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                             MANUAL DE OPERADOR
                        </h3>
                        <p className="text-xs text-gray-400 leading-relaxed font-mono">
                            Este <span className="text-white">Orrery Holográfico</span> representa las tensiones dinámicas de Argentina. 
                            El <span className="text-[#f0abfc]">NEXUS (Centro)</span> es el equilibrio del sistema.
                            <br/><br/>
                            <span className="text-[#26c6da]">&gt; INSTRUCCIÓN:</span> Haga clic en un <strong>Nodo Planetario</strong> para escanear la red (Google Search) y revelar qué eventos reales están tensando ese "hilo" específico hacia el centro.
                        </p>
                    </div>

                    {/* DYNAMIC ANALYSIS PANEL */}
                    <Panel className="flex-grow flex flex-col min-h-[300px] border-[#f0abfc]">
                        <div className="flex justify-between items-center mb-4 border-b border-[rgba(240,171,252,0.2)] pb-2">
                             <h3 className="text-xl text-[#f0abfc] font-['VT323']">
                                {selectedNode ? `ANÁLISIS DE VECTOR: ${selectedNode.label}` : 'SISTEMA EN ESPERA...'}
                            </h3>
                            {selectedNode && <span className="text-[10px] bg-[#f0abfc] text-black px-2 rounded font-bold animate-pulse">LIVE</span>}
                        </div>

                        <div className="flex-grow text-sm leading-relaxed opacity-90 font-mono">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-full gap-4">
                                    <Spinner />
                                    <div className="text-center space-y-1">
                                        <div className="text-[#26c6da] text-xs animate-pulse">ESTABLECIENDO ENLACE CUÁNTICO...</div>
                                        <div className="text-gray-500 text-[10px]">Rastreando causalidades en la red global</div>
                                    </div>
                                </div>
                            ) : analysis ? (
                                <div className="animate-[fadeIn_0.5s]">
                                     <div dangerouslySetInnerHTML={{ __html: analysis.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#f0abfc]">$1</strong>').replace(/\n/g, '<br />') }}/>
                                     <div className="mt-4 pt-4 border-t border-dashed border-gray-700 text-[10px] text-gray-500 text-right">
                                         DATA SOURCE: GOOGLE SEARCH GROUNDING
                                     </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-600 opacity-50">
                                    <svg className="w-16 h-16 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                                    <p>Seleccione un vector para iniciar simulación.</p>
                                </div>
                            )}
                        </div>
                    </Panel>
                </div>
            </div>
        </div>
    );
};

export default MapaSistemicoSection;