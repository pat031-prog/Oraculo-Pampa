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
    { id: 'tech', label: 'Tecnología/IA', cx: '50%', cy: '10%', prompt: 'Analiza la interconexión entre el vector Tecnológico (IA, computación) y la estabilidad sistémica general de Argentina. Describe 2 riesgos y 2 oportunidades clave.' },
    { id: 'economic', label: 'Economía/Finanzas', cx: '85%', cy: '35%', prompt: 'Analiza la interconexión entre el vector Económico (deuda, PBI) y la estabilidad sistémica general de Argentina. Describe 2 riesgos y 2 oportunidades clave.' },
    { id: 'geopolitical', label: 'Geopolítica', cx: '85%', cy: '65%', prompt: 'Analiza la interconexión entre el vector Geopolítico (cadena de suministros, litio) y la estabilidad sistémica general de Argentina. Describe 2 riesgos y 2 oportunidades clave.' },
    { id: 'social', label: 'Social/Cultural', cx: '50%', cy: '90%', prompt: 'Analiza la interconexión entre el vector Social (capital humano, cultura) y la estabilidad sistémica general de Argentina. Describe 2 riesgos y 2 oportunidades clave.' },
    { id: 'astro', label: 'Astro/Clima', cx: '15%', cy: '65%', prompt: 'Analiza la interconexión entre el vector Astrofísico (clima, ciclo solar) y la estabilidad sistémica general de Argentina. Describe 2 riesgos y 2 oportunidades clave.' },
    { id: 'agri', label: 'Agro/Recursos', cx: '15%', cy: '35%', prompt: 'Analiza la interconexión entre el vector Agro/Recursos (campo, cannabis, agua) y la estabilidad sistémica general de Argentina. Describe 2 riesgos y 2 oportunidades clave.' },
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
            const systemPrompt = `Como Oráculo Pampa, en un párrafo conciso y directo, `;
            const fullPrompt = systemPrompt + node.prompt;
            const result = await generateContent(fullPrompt);
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2">
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
                <div className="lg:col-span-1">
                    <Panel className="h-full">
                        <h3 className="text-xl text-[#26c6da] mb-4 font-['VT323']">Proyección del Glifo</h3>
                        {selectedNode && (
                            <p className="mb-4 text-sm">
                                <span className="opacity-70">Vector seleccionado: </span> 
                                <span className="font-bold text-[#f0abfc]">{selectedNode.label}</span>
                            </p>
                        )}
                        <div className="min-h-[200px] text-sm leading-relaxed opacity-90">
                            {isLoading ? (
                                <Spinner />
                            ) : analysis ? (
                                <div dangerouslySetInnerHTML={{ __html: analysis.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') }}/>
                            ) : (
                                <p>Seleccione un vector entrópico en el mapa para iniciar una proyección sistémica.</p>
                            )}
                        </div>
                    </Panel>
                </div>
            </div>
        </div>
    );
};

export default MapaSistemicoSection;