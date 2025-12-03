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
}

const NODES: Node[] = [
    { id: 'tech', label: 'Tecnología/IA', cx: '50%', cy: '10%', prompt: 'Investiga las últimas noticias de IA y Tecnología en Argentina. Analiza cómo este vector está presionando o liberando tensión sobre la economía y el empleo HOY.' },
    { id: 'economic', label: 'Economía/Finanzas', cx: '85%', cy: '35%', prompt: 'Investiga los indicadores financieros de hoy (Dólar, Riesgo País, Bonos). ¿Cómo está afectando esto INMEDIATAMENTE a la estabilidad social y política?' },
    { id: 'geopolitical', label: 'Geopolítica', cx: '85%', cy: '65%', prompt: 'Busca noticias sobre la relación Argentina-China-EEUU-FMI de esta semana. ¿Qué riesgos sistémicos externos están activos ahora mismo?' },
    { id: 'social', label: 'Social/Cultural', cx: '50%', cy: '90%', prompt: 'Busca noticias sobre el clima social hoy en Argentina. ¿Cómo está reaccionando la población a las variables económicas actuales?' },
    { id: 'astro', label: 'Astro/Clima', cx: '15%', cy: '65%', prompt: 'Busca datos del clima y actividad solar hoy. ¿Hay algún factor ambiental agudo (tormenta, sequía) impactando la infraestructura?' },
    { id: 'agri', label: 'Agro/Recursos', cx: '15%', cy: '35%', prompt: 'Busca noticias del campo y cosecha hoy. ¿Cómo está fluyendo el ingreso de divisas y qué impacto tiene en la estabilidad del sistema?' },
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
            // Use Search enabled (true)
            const result = await generateContent(fullPrompt, true);
            setAnalysis(result);
        } catch (error) {
            console.error("Failed to generate systemic analysis", error);
            setAnalysis("Error al proyectar el análisis desde el glifo. La conexión entrópica es inestable.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const CentralGlyph = () => (
        <g transform="translate(250, 250) scale(1.2)" style={{ filter: 'drop-shadow(0 0 10px var(--color-glow-primary))' }}>
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <circle cx="0" cy="0" r="60" fill="none" stroke="var(--color-glow-primary)" strokeWidth="1" opacity="0.5" />
            <path d="M 0 -80 L 69.28 -40 L 69.28 40 L 0 80 L -69.28 40 L -69.28 -40 Z" fill="none" stroke="var(--color-glow-secondary)" strokeWidth="1.5" />
            <path d="M 0 -80 L 0 80 M -69.28 -40 L 69.28 40 M -69.28 40 L 69.28 -40" fill="none" stroke="var(--color-glow-secondary)" strokeWidth="0.5" />
            <text x="0" y="5" fontFamily="VT323" fontSize="24" fill="var(--color-glow-primary)" textAnchor="middle" style={{ filter: 'url(#glow)' }}>
                NEXUS
            </text>
        </g>
    );

    return (
        <div className="animate-[fadeIn_0.6s_ease-out]">
            <h2 className="font-['VT323'] text-4xl text-[#f0abfc] mb-6 pb-2">Mapa Sistémico Interactivo</h2>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Visual Map */}
                <div className="lg:col-span-8">
                    <Panel className="relative w-full aspect-square max-h-[70vh]">
                        <svg width="100%" height="100%" viewBox="0 0 500 500">
                           <CentralGlyph />
                            {NODES.map(node => (
                                <line 
                                    key={`line-${node.id}`}
                                    x1="250" y1="250" 
                                    x2={parseFloat(node.cx) / 100 * 500} 
                                    y2={parseFloat(node.cy) / 100 * 500}
                                    stroke="var(--color-glow-primary)" 
                                    strokeWidth="0.5"
                                    opacity={hoveredNodeId === node.id || selectedNode?.id === node.id ? '0.7' : '0.2'}
                                    style={{ transition: 'opacity 0.3s' }}
                                />
                            ))}
                           {NODES.map(node => (
                                <g 
                                    key={node.id} 
                                    className="cursor-pointer" 
                                    onClick={() => handleNodeClick(node)}
                                    onMouseEnter={() => setHoveredNodeId(node.id)}
                                    onMouseLeave={() => setHoveredNodeId(null)}
                                >
                                    <circle 
                                        cx={node.cx} 
                                        cy={node.cy}
                                        r="12" 
                                        fill={selectedNode?.id === node.id ? 'var(--color-glow-primary)' : 'var(--color-glow-secondary)'} 
                                        stroke={selectedNode?.id === node.id ? 'white' : 'var(--color-glow-primary)'}
                                        strokeWidth="1.5"
                                        style={{ transition: 'all 0.3s' }}
                                    >
                                        <animate attributeName="r" values="12;14;12" dur="2s" repeatCount="indefinite" />
                                    </circle>
                                    <text 
                                        x={node.cx}
                                        y={node.cy} 
                                        dy="-20"
                                        fill="var(--color-text)" 
                                        textAnchor="middle" 
                                        fontSize="12"
                                        className="font-primary pointer-events-none"
                                    >
                                        {node.label}
                                    </text>
                                </g>
                           ))}
                        </svg>
                    </Panel>
                </div>

                {/* Analysis & Guide Panel */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                    
                    {/* Concept Guide */}
                    <Panel className="bg-[rgba(38,198,218,0.05)] border-l-2 border-[#26c6da]">
                        <h3 className="text-lg text-[#26c6da] mb-2 font-['VT323']">¿CÓMO LEER ESTE MAPA?</h3>
                        <p className="text-xs leading-relaxed opacity-80 text-gray-300">
                            Este hexágono no es estático. Representa las <strong>tensiones dinámicas</strong> entre los 5 vectores entrópicos. 
                            <br/><br/>
                            El <strong>NEXUS</strong> central es el punto de equilibrio inestable de Argentina. Al hacer clic en un nodo periférico, 
                            el Oráculo consulta la red (Google Search) para revelar qué "hilo invisible" está tensando el sistema <strong>AHORA MISMO</strong>.
                        </p>
                    </Panel>

                    <Panel className="flex-grow">
                        <h3 className="text-xl text-[#f0abfc] mb-4 font-['VT323']">Proyección del Glifo</h3>
                        {selectedNode && (
                            <p className="mb-4 text-sm">
                                <span className="opacity-70">Vector seleccionado: </span> 
                                <span className="font-bold text-[#f0abfc]">{selectedNode.label}</span>
                            </p>
                        )}
                        <div className="min-h-[200px] text-sm leading-relaxed opacity-90">
                            {isLoading ? (
                                <div className="flex flex-col items-center mt-10">
                                    <Spinner />
                                    <span className="text-xs mt-3 animate-pulse text-[#26c6da]">Rastreando causalidades en la red...</span>
                                </div>
                            ) : analysis ? (
                                <div dangerouslySetInnerHTML={{ __html: analysis.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') }}/>
                            ) : (
                                <p className="text-gray-500 italic">Seleccione un nodo en el mapa para iniciar una consulta de resonancia sistémica en tiempo real.</p>
                            )}
                        </div>
                    </Panel>
                </div>
            </div>
        </div>
    );
};

export default MapaSistemicoSection;