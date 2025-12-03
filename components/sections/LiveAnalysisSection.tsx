
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

        const systemPrompt = `**ROL Y OBJETIVO:** Eres el Motor Analítico Guardián del Oráculo Pampa. Tu misión es procesar la consulta del usuario utilizando Google Search para encontrar la información más RECIENTE y FÁCTICA posible (últimas 24-48 horas).

**PRIORIDAD:** Lo FÁCTICO mata lo TEÓRICO. Si hay noticias recientes que contradicen la teoría, prioriza las noticias.
No alucines fechas. Si la noticia es de hoy, dilo.

**FORMATO DE SALIDA OBLIGATORIO:** Estructura tu respuesta en los siguientes cuatro apartados:

**1. Estado de Situación (Últimas Noticias):**
Resumen fáctico de lo que está pasando AHORA MISMO según los resultados de búsqueda. Cita fuentes.

**2. Proyección Inmediata:**
¿Qué va a pasar en las próximas 72 horas basado en estos hechos?

**3. Análisis de Entropía:**
Aplica brevemente el marco del Oráculo (Económico, Social, Político) a estos hechos duros.

**4. Conclusión Operativa:**
Una sentencia clara sobre el riesgo o la oportunidad.

**REGLA CRÍTICA:** Si no encuentras noticias recientes, dilo explícitamente: "No se encontró información en las últimas 24hs".`;

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
                <p className="font-bold text-[#26c6da] mb-1">Análisis Estratégico en Tiempo Real</p>
                Este módulo conecta con la red para obtener noticias de último momento. Prioriza hechos recientes sobre teoría abstracta.
            </div>
            <Panel>
                <p className="mb-4 opacity-80">Introduzca un tema para escanear las últimas noticias y analizar su impacto.</p>
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAnalysis()}
                    placeholder="Ej: Últimas medidas económicas anunciadas hoy..."
                    className="w-full bg-[rgba(13,5,28,0.7)] border border-[rgba(240,171,252,0.2)] rounded-md text-[#e0e0e0] p-2.5 font-['Roboto_Mono']"
                />
                <button
                    onClick={handleAnalysis}
                    disabled={isLoading}
                    className="w-full mt-4 p-3 bg-transparent border border-[rgba(240,171,252,0.2)] rounded-md text-center transition-colors hover:bg-[rgba(240,171,252,0.1)] disabled:opacity-50"
                >
                    {isLoading ? 'Escaneando Red Global...' : 'Iniciar Análisis de Noticias'}
                </button>
                <div className="mt-5 min-h-[200px]">
                    {isLoading && <Spinner />}
                    {error && <p className="text-[#ef5350]">{error}</p>}
                    {result && (
                        <div className="text-sm leading-relaxed opacity-95">
                            <div dangerouslySetInnerHTML={{ __html: result.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n\n/g, '<br /><br />').replace(/\n/g, '<br />') }} />
                             {result.sources.length > 0 && (
                                <div className="mt-6 pt-4 border-t border-[rgba(240,171,252,0.2)]">
                                    <h4 className="font-['VT323'] text-xl text-[#26c6da] mb-2">Fuentes Verificadas</h4>
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
