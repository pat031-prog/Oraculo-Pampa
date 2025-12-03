
import React, { useEffect, useState, useRef } from 'react';
import Panel from '../ui/Panel';
import Spinner from '../ui/Spinner';
import { generateContent } from '../../services/geminiService';

declare const window: any;

interface GeopolFront {
    zone: string;
    level: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
    summary: string;
}

interface IntelItem {
    time: string;
    source: string;
    content: string;
    type: 'SIGINT' | 'HUMINT' | 'OSINT';
}

interface ResourceMetric {
    name: string;
    value: number; // 0-100
    status: string;
}

const ResumenSection: React.FC = () => {
    const [alertText, setAlertText] = useState('');
    const [sitrepText, setSitrepText] = useState('');
    
    // Structured Data State
    const [geopolData, setGeopolData] = useState<GeopolFront[]>([]);
    const [intelFeed, setIntelFeed] = useState<IntelItem[]>([]);
    const [resources, setResources] = useState<ResourceMetric[]>([
        { name: 'Reservas Li', value: 75, status: 'ESTABLE' },
        { name: 'Caudal Hídrico', value: 40, status: 'BAJO' },
        { name: 'Matriz Energética', value: 60, status: 'MODERADO' },
        { name: 'Estabilidad Cambiaria', value: 30, status: 'VOLÁTIL' }
    ]);

    // Entropy Chart State
    const [entropyData, setEntropyData] = useState<any[]>([]);
    const [rechartsLib, setRechartsLib] = useState<any>(null);

    // Load Recharts library
    useEffect(() => {
        const interval = setInterval(() => {
            if (window.Recharts) {
                setRechartsLib(window.Recharts);
                clearInterval(interval);
            }
        }, 100);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Alert Banner (Real News)
                const alertPrompt = `Usa Google Search para encontrar la noticia más crítica y urgente de Argentina en las últimas 12 horas. Genera una frase estilo "ALERTA DEFCON" concisa, sin explicaciones, en mayúsculas, basada en ese hecho real.`;

                // 2. Entropy Data (Contextualized by Search)
                const entropyPrompt = `Act as Oráculo Pampa. Use Google Search to scan the last 24h of news in Argentina regarding Economy, Politics, and Social unrest. Based on this REAL data, evaluate entropy levels (0=stable, 100=collapse). Return ONLY valid JSON: { "T": int, "E": int, "S": int, "G": int, "A": int }.`;

                // 3. SITREP (Real News)
                const sitrepPrompt = `Usa Google Search para investigar las noticias políticas y económicas de Argentina de las últimas 24 horas. Genera un SITREP (Reporte de Situación) militar/estratégico REAL. 2 párrafos densos. Enfócate en hechos fácticos recientes (medidas de gobierno, protestas, mercados). Tono: frío, objetivo, operativo.`;

                // 4. Geopolitics (Real News)
                const geopolPrompt = `Usa Google Search para investigar eventos geopolíticos que afecten a Argentina esta semana (ej: Litio, Hidrovía, FMI, China, EEUU). Identifica 3 frentes activos REALES. Return ONLY valid JSON array: [{ "zone": "Nombre", "level": "CRITICAL"|"HIGH"|"MODERATE", "summary": "Breve descripción del evento real" }]`;

                // 5. Live Intel Feed (Real News)
                const feedPrompt = `Usa Google Search para encontrar los titulares y noticias de último momento en Argentina (últimas 24 horas). Genera 6 items de "intel feed" basados en estas noticias REALES. Return ONLY valid JSON array: [{ "time": "HH:MM", "source": "INFOBAE/CLARIN/REUTERS", "type": "OSINT", "content": "Titular real resumido estilo teletipo" }]`;

                const results = await Promise.allSettled([
                    generateContent(alertPrompt, true),
                    generateContent(entropyPrompt, true),
                    generateContent(sitrepPrompt, true),
                    generateContent(geopolPrompt, true),
                    generateContent(feedPrompt, true)
                ]);

                // --- Process Results ---

                // Alert
                if (results[0].status === 'fulfilled') setAlertText(results[0].value.replace(/"/g, ''));

                // Entropy
                if (results[1].status === 'fulfilled') {
                    try {
                        const json = JSON.parse(results[1].value.match(/\{[\s\S]*\}/)?.[0] || '{}');
                        setEntropyData([
                            { subject: 'TECH (T)', A: json.T || 50, fullMark: 100 },
                            { subject: 'ECON (E)', A: json.E || 85, fullMark: 100 },
                            { subject: 'SOC (S)', A: json.S || 70, fullMark: 100 },
                            { subject: 'GEO (G)', A: json.G || 60, fullMark: 100 },
                            { subject: 'ASTRO (A)', A: json.A || 30, fullMark: 100 },
                        ]);
                    } catch (e) { console.error("Entropy Parse Error"); }
                }

                // SITREP
                if (results[2].status === 'fulfilled') setSitrepText(results[2].value);

                // Geopolitics
                if (results[3].status === 'fulfilled') {
                    try {
                        const match = results[3].value.match(/\[[\s\S]*\]/);
                        if (match) setGeopolData(JSON.parse(match[0]));
                    } catch (e) { console.error("Geopol Parse Error"); }
                }

                // Intel Feed
                if (results[4].status === 'fulfilled') {
                    try {
                        const match = results[4].value.match(/\[[\s\S]*\]/);
                        if (match) setIntelFeed(JSON.parse(match[0]));
                    } catch (e) { console.error("Feed Parse Error"); }
                }

            } catch (error) {
                console.error("Dashboard Sync Failed", error);
            }
        };
        fetchData();
    }, []);

    const renderEntropyChart = () => {
        if (!rechartsLib || entropyData.length === 0) return <Spinner className="w-8 h-8 my-10" />;
        const { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } = rechartsLib;
        return (
            <div className="h-[220px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={entropyData}>
                        <PolarGrid stroke="rgba(38,198,218,0.2)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#26c6da', fontSize: 10, fontFamily: 'Roboto Mono' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name="Entropy" dataKey="A" stroke="#f0abfc" strokeWidth={2} fill="#f0abfc" fillOpacity={0.3} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        );
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'CRITICAL': return 'text-[#ef5350] border-[#ef5350]';
            case 'HIGH': return 'text-[#ffee58] border-[#ffee58]';
            default: return 'text-[#26c6da] border-[#26c6da]';
        }
    };

    return (
        <div className="animate-[fadeIn_0.6s_ease-out] h-full flex flex-col">
            <h2 className="font-['VT323'] text-4xl text-[#f0abfc] mb-4 flex items-center gap-3">
                <span className="inline-block w-3 h-3 bg-[#f0abfc] animate-pulse rounded-full"></span>
                DASHBOARD OPERATIVO INTEGRADO (LIVE DATA)
            </h2>
            
            {/* ALERT BANNER */}
            <div className="bg-[rgba(239,83,80,0.15)] border-l-4 border-[#ef5350] p-3 mb-6 shadow-[0_0_20px_rgba(239,83,80,0.1)] flex items-center gap-4">
                <span className="font-bold text-[#ef5350] font-mono text-xl blink">ALERTA PRIOV 1:</span>
                <span className="text-white font-mono tracking-wide text-sm md:text-base uppercase">{alertText || "ESCANEANDO SEÑALES EN TIEMPO REAL..."}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">
                
                {/* COL 1: METRICS & RESOURCES (3 Cols wide) */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <Panel className="flex-grow flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg text-[#f0abfc] mb-1 font-['VT323'] border-b border-[rgba(240,171,252,0.2)] pb-1">RADAR ENTRÓPICO</h3>
                            {renderEntropyChart()}
                            <div className="text-center text-[10px] text-gray-500 font-mono mt-[-10px]">DATA SOURCE: LIVE WEB SEARCH</div>
                        </div>
                        <div className="mt-4">
                             <h3 className="text-lg text-[#26c6da] mb-3 font-['VT323'] border-b border-[rgba(38,198,218,0.2)] pb-1">RECURSOS CRÍTICOS</h3>
                             <div className="space-y-3">
                                {resources.map((res, idx) => (
                                    <div key={idx} className="text-xs font-mono">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-300">{res.name}</span>
                                            <span className={res.value < 50 ? 'text-[#ef5350]' : 'text-[#26c6da]'}>{res.status}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-[#0d051c] rounded-full overflow-hidden border border-gray-800">
                                            <div 
                                                className={`h-full ${res.value < 50 ? 'bg-[#ef5350]' : 'bg-[#26c6da]'}`} 
                                                style={{ width: `${res.value}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </Panel>
                </div>

                {/* COL 2: STRATEGIC THEATRE (5 Cols wide) */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                     <Panel className="min-h-[200px]">
                        <h3 className="text-xl text-[#26c6da] mb-3 font-['VT323'] flex justify-between items-center">
                            SITREP: EJECUTIVO
                            <span className="text-xs font-mono text-gray-500 bg-black px-2 py-0.5 rounded">CLASSIFIED</span>
                        </h3>
                        <div className="text-sm leading-relaxed text-gray-200 font-light border-l-2 border-[rgba(240,171,252,0.3)] pl-3">
                            {sitrepText ? 
                                <div dangerouslySetInnerHTML={{ __html: sitrepText.replace(/\n/g, '<br />') }} /> 
                                : <Spinner className="w-6 h-6 my-2" />
                            }
                        </div>
                    </Panel>

                    <Panel className="flex-grow">
                        <h3 className="text-xl text-[#f0abfc] mb-4 font-['VT323']">TEATRO DE OPERACIONES GEOPOLÍTICAS</h3>
                        <div className="space-y-3">
                            {geopolData.length > 0 ? geopolData.map((front, idx) => (
                                <div key={idx} className={`bg-[rgba(0,0,0,0.4)] border-l-2 p-3 ${getLevelColor(front.level)}`}>
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-bold font-mono text-sm uppercase">{front.zone}</span>
                                        <span className={`text-[10px] px-1.5 py-0.5 bg-[rgba(255,255,255,0.05)] rounded ${getLevelColor(front.level)}`}>{front.level}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 leading-tight">{front.summary}</p>
                                </div>
                            )) : <div className="text-xs text-gray-500">Escaneando red global...</div>}
                        </div>
                    </Panel>
                </div>

                {/* COL 3: LIVE INTEL FEED (4 Cols wide) */}
                <div className="lg:col-span-4">
                    <Panel className="h-full flex flex-col max-h-[calc(100vh-200px)] lg:max-h-none overflow-hidden">
                        <h3 className="text-xl text-[#26c6da] mb-4 font-['VT323'] flex items-center gap-2">
                            <span className="animate-spin text-xs">↻</span> LIVE INTEL WIRE
                        </h3>
                        <div className="flex-grow overflow-y-auto space-y-2 pr-2 font-mono text-xs scrollbar-hide">
                            {intelFeed.length > 0 ? intelFeed.map((item, idx) => (
                                <div key={idx} className="mb-3 border-b border-gray-800 pb-2 last:border-0 hover:bg-[rgba(255,255,255,0.02)] p-1 transition-colors">
                                    <div className="flex gap-2 mb-1 opacity-60">
                                        <span className="text-[#f0abfc]">{item.time}</span>
                                        <span className="text-[#26c6da]">[{item.source}]</span>
                                        <span className="text-gray-500">{item.type}</span>
                                    </div>
                                    <div className="text-gray-300 leading-snug">
                                        &gt; {item.content}
                                    </div>
                                </div>
                            )) : (
                                <div className="space-y-2 opacity-30">
                                    {[1,2,3,4,5].map(i => (
                                        <div key={i} className="h-12 bg-gray-700 animate-pulse rounded"></div>
                                    ))}
                                </div>
                            )}
                            <div className="text-[10px] text-[#26c6da] animate-pulse mt-4">
                                _ ESTABLECIENDO ENLACE SATELITAL...
                            </div>
                        </div>
                    </Panel>
                </div>
            </div>
        </div>
    );
};

export default ResumenSection;
