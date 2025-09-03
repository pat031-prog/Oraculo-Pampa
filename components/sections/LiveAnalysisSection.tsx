import React, { useState } from 'react';
import Panel from '../ui/Panel';
import Spinner from '../ui/Spinner';
import { generateContentWithSearch } from '../../services/geminiService';
import { SearchResult } from '../../types';

const LiveAnalysisSection: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState<SearchResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalysis = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setError(null);
        setResult(null);

        const systemPrompt = `**ROL Y OBJETIVO:** Eres el Motor Analítico Guardián del Oráculo Pampa. Tu única misión es procesar la consulta del usuario y la información de las fuentes para generar un análisis estratégico profundo. No debes dar opiniones, consejos ni predicciones no fundamentadas. Tu análisis debe basarse estrictamente en los conceptos del Oráculo Pampa (Echo Agents, Symbolic Intelligence, GYOA Reflex Stack, etc.) y los datos encontrados.

**IDIOMA DE SALIDA:** Español.

**FORMATO DE SALIDA OBLIGATORIO:** Debes estructurar tu respuesta en los siguientes cuatro apartados, utilizando exactamente estos títulos en negrita y párrafos bien separados:

**1. Lectura Actual:**
Un resumen de la situación presente basado en los hechos de las fuentes.

**2. Proyecciones a Corto y Mediano Plazo:**
Predicciones futuras basadas en las tendencias identificadas, aplicando los modelos conceptuales del Oráculo.

**3. Insights Clave:**
Una lista de 2-3 puntos o conclusiones cruciales que se desprenden del análisis.

**4. Implicaciones de Primer y Segundo Orden:**
Un análisis de las consecuencias directas (primer orden) y los efectos sistémicos o en cascada (segundo orden).

**REGLA CRÍTICA:** Si la información es insuficiente para realizar un análisis completo, debes declararlo explícitamente en lugar de inventar información.`;

        try {
            const response = await generateContentWithSearch(systemPrompt, prompt);
            setResult(response);
        } catch (e: any) {
            setError(e.message || "Ocurrió un error al realizar el análisis.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="animate-[fadeIn_0.6s_ease-out]">
            <h2 className="font-['VT323'] text-4xl text-[#f0abfc] mb-6 pb-2">Motor Analítico Guardián</h2>
            <div className="p-4 bg-[rgba(38,198,218,0.1)] border border-[#26c6da] rounded-md mb-5 text-sm">
                <p className="font-bold text-[#26c6da] mb-1">Análisis Estratégico Activado</p>
                Este módulo integra información de fuentes externas con el marco conceptual del Motor Guardián. Genera un análisis estratégico basado en los conceptos de Echo Agents, Symbolic Intelligence y Reflex Loops.
            </div>
            <Panel>
                <p className="mb-4 opacity-80">Introduzca un tema para el análisis estratégico.</p>
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAnalysis()}
                    placeholder="Ej: Impacto de la IA en el sector energético argentino"
                    className="w-full bg-[rgba(13,5,28,0.7)] border border-[rgba(240,171,252,0.2)] rounded-md text-[#e0e0e0] p-2.5 font-['Roboto_Mono']"
                />
                <button
                    onClick={handleAnalysis}
                    disabled={isLoading}
                    className="w-full mt-4 p-3 bg-transparent border border-[rgba(240,171,252,0.2)] rounded-md text-center transition-colors hover:bg-[rgba(240,171,252,0.1)] disabled:opacity-50"
                >
                    {isLoading ? 'Analizando...' : 'Iniciar Análisis Guardián'}
                </button>
                <div className="mt-5 min-h-[200px]">
                    {isLoading && <Spinner />}
                    {error && <p className="text-[#ef5350]">{error}</p>}
                    {result && (
                        <div className="text-sm leading-relaxed opacity-95">
                            <div dangerouslySetInnerHTML={{ __html: result.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n\n/g, '<br /><br />').replace(/\n/g, '<br />') }} />
                             {result.sources.length > 0 && (
                                <div className="mt-6 pt-4 border-t border-[rgba(240,171,252,0.2)]">
                                    <h4 className="font-['VT323'] text-xl text-[#26c6da] mb-2">Fuentes Consultadas</h4>
                                    <ul className="list-disc list-inside">
                                        {result.sources.map((source, index) => (
                                            <li key={index} className="mb-1 truncate">
                                                <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-[#a5b4fc] hover:underline" title={source.title}>
                                                    {source.title}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Panel>
        </div>
    );
};

export default LiveAnalysisSection;