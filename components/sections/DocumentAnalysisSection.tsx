
import React, { useState, useCallback, useRef } from 'react';
import Panel from '../ui/Panel';
import Spinner from '../ui/Spinner';
import { generateContentWithSearch } from '../../services/geminiService';
import { SearchResult } from '../../types';
import { OraculoCognitiveFramework, AnalysisLog } from '../../services/entropicMonitor';

// Let TypeScript know about pdf.js on the window object
declare const window: any;

const DocumentAnalysisSection: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [userQuery, setUserQuery] = useState('');
    const [analysisResult, setAnalysisResult] = useState<SearchResult | null>(null);
    const [status, setStatus] = useState<'idle' | 'extracting' | 'analyzing' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    
    // Cognitive Framework State
    const [monitorLogs, setMonitorLogs] = useState<AnalysisLog[]>([]);
    const monitorRef = useRef<OraculoCognitiveFramework>(new OraculoCognitiveFramework());

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFiles(prevFiles => [...prevFiles, ...Array.from(event.target.files!)]);
        }
    };

    const removeFile = (fileName: string) => {
        setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
    };

    const extractTextFromPdfs = useCallback(async (pdfFiles: File[]): Promise<{ text: string, logs: AnalysisLog[] }> => {
        if (!window.pdfjsLib) {
            throw new Error("PDF processing library not loaded.");
        }

        let combinedText = '';
        const logs: AnalysisLog[] = [];
        
        // Reset monitor for new batch analysis if desired, or keep history. 
        // Keeping history allows detecting anomalies relative to previous docs in the session.
        // monitorRef.current.reset(); 

        for (const file of pdfFiles) {
            setStatusMessage(`Extrayendo texto de: ${file.name}`);
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
            let fileText = ''; // Raw text for this file

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(' ');
                fileText += pageText + '\n';
            }
            
            // --- COGNITIVE FRAMEWORK PROCESSING ---
            setStatusMessage(`Calculando Entropía de Kolmogorov y Bifurcación para: ${file.name}`);
            const analysisLog = await monitorRef.current.processInput(file.name, fileText);
            logs.push(analysisLog);
            setMonitorLogs(prev => [...prev, analysisLog]);
            // --------------------------------------

            combinedText += `\n--- START DOCUMENT: ${file.name} ---\n`;
            combinedText += `[METADATA: BifurcationIndex=${analysisLog.bifurcationIndex.toFixed(4)}, Z-Score=${analysisLog.zScore.toFixed(2)}]\n`;
            combinedText += fileText;
            combinedText += `--- END DOCUMENT: ${file.name} ---\n`;
        }
        return { text: combinedText, logs };
    }, []);

    const handleAnalysis = async () => {
        if (files.length === 0 || !userQuery.trim()) {
            setError("Por favor, sube al menos un archivo PDF y escribe una consulta.");
            return;
        }
        
        setError(null);
        setAnalysisResult(null);
        setMonitorLogs([]); // Clear visual logs for new run
        monitorRef.current.reset(); // Reset statistical baseline for new run
        
        setStatus('extracting');
        setStatusMessage('Iniciando extracción de texto de los PDFs...');

        try {
            const { text: documentText, logs } = await extractTextFromPdfs(files);
            
            setStatus('analyzing');
            setStatusMessage('Contexto extraído. Enviando al Motor Guardián para análisis...');

            // Constructing a summary of the mathematical findings to guide the LLM
            const metricSummary = logs.map(l => 
                `- ${l.source}: Indice Bifurcación=${l.bifurcationIndex.toFixed(3)} (Z=${l.zScore.toFixed(2)}) -> ${l.isAnomaly ? 'ANOMALÍA DETECTADA' : 'Estable'}`
            ).join('\n');

            const systemPrompt = `**ROL Y OBJETIVO:** Eres el Motor Analítico Guardián del Oráculo Pampa. Estás equipado con un "Monitor Entrópico" (Framework Cognitivo) que mide matemáticamente la complejidad de Kolmogorov y la deformación estructural de la información.

**FRAMEWORK COGNITIVO (DATOS DUROS):**
El sistema ha pre-procesado los documentos y calculado las siguientes métricas de bifurcación:
${metricSummary}

**INSTRUCCIÓN:** Utiliza estas métricas matemáticas como guía. 
- Si el Z-Score es alto (>2.0), trata ese documento como un "Cisne Negro" o una señal de ruptura sistémica.
- Si la entropía es baja, trátalo como información lineal/continuista.
- Tu misión es sintetizar la información y generar proyecciones basadas en la Teoría de la Quíntuple Entropía.

**FORMATO DE SALIDA OBLIGATORIO:** Estructura tu respuesta en los siguientes apartados, utilizando exactamente estos títulos en negrita:

**1. Lectura del Monitor Entrópico:**
Interpreta los valores Z-Score y de bifurcación proporcionados arriba. ¿Qué documento introduce mayor caos o novedad al sistema?

**2. Síntesis Ejecutiva:**
Resumen de los puntos clave, ponderando más aquellos provenientes de fuentes con alta "densidad entrópica" (novedad).

**3. Análisis de Convergencia (5 Vectores):**
Mapea la información a Tecnología, Economía, Social, Geopolítica, Astrofísica.

**4. Proyecciones y Cisnes Negros:**
Basado en las anomalías detectadas por el monitor, ¿qué escenario disruptivo es más probable?

**REGLA CRÍTICA:** No inventes las métricas, usa las proporcionadas en este prompt.`;
            
            const fullUserPrompt = `CONTEXTO DE DOCUMENTOS PROCESADOS:\n${documentText}\n\nCONSULTA DEL USUARIO:\n"${userQuery}"`;

            const response = await generateContentWithSearch(systemPrompt, fullUserPrompt);
            setAnalysisResult(response);
            setStatus('idle');
            setStatusMessage('');

        } catch (e: any) {
            console.error(e);
            setError(e.message || "Ocurrió un error desconocido durante el análisis.");
            setStatus('error');
            setStatusMessage('');
        }
    };
    
    const isLoading = status === 'extracting' || status === 'analyzing';

    return (
        <div className="animate-[fadeIn_0.6s_ease-out]">
            <h2 className="font-['VT323'] text-4xl text-[#f0abfc] mb-6 pb-2">Análisis de Documentos con Framework Cognitivo</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <Panel className="flex flex-col gap-4">
                    <div>
                        <h3 className="text-xl text-[#26c6da] mb-2 font-['VT323']">1. Cargar Documentos (PDF)</h3>
                        <div className="relative border-2 border-dashed border-[rgba(240,171,252,0.3)] rounded-lg p-6 text-center">
                             <input 
                                type="file" 
                                multiple 
                                accept=".pdf" 
                                onChange={handleFileChange} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                aria-label="Cargar archivos PDF"
                             />
                             <p className="text-gray-400">Arrastra y suelta tus archivos PDF aquí.</p>
                        </div>
                    </div>

                    {files.length > 0 && (
                        <div>
                            <h4 className="font-bold text-lg mb-2">Archivos Cargados:</h4>
                            <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                {files.map((file, index) => (
                                    <li key={index} className="flex justify-between items-center bg-[rgba(13,5,28,0.7)] p-2 rounded-md text-sm">
                                        <span>{file.name}</span>
                                        <button onClick={() => removeFile(file.name)} className="text-red-500 hover:text-red-400 font-bold px-2" aria-label={`Quitar ${file.name}`}>
                                            &times;
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    <div>
                        <h3 className="text-xl text-[#26c6da] mb-2 font-['VT323']">2. Especificar Consulta</h3>
                        <textarea
                            value={userQuery}
                            onChange={(e) => setUserQuery(e.target.value)}
                            placeholder="Ej: Detectar anomalías sistémicas en estos reportes..."
                            rows={4}
                            className="w-full bg-[rgba(13,5,28,0.7)] border border-[rgba(240,171,252,0.2)] rounded-md text-[#e0e0e0] p-2.5 font-['Roboto_Mono']"
                            aria-label="Consulta de análisis"
                        />
                    </div>
                    
                    <button
                        onClick={handleAnalysis}
                        disabled={isLoading || files.length === 0 || !userQuery.trim()}
                        className="w-full p-3 bg-transparent border border-[rgba(240,171,252,0.2)] rounded-md text-center transition-colors hover:bg-[rgba(240,171,252,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Ejecutando Framework Cognitivo...' : 'Iniciar Análisis Entrópico'}
                    </button>
                </Panel>
                
                <Panel className="flex flex-col">
                     <h3 className="text-xl text-[#26c6da] mb-4 font-['VT323']">Monitor Entrópico (Salida de Consola)</h3>
                     
                     {/* Console Output Visualization */}
                     <div className="bg-black p-4 rounded-md font-mono text-xs mb-4 border border-[rgba(240,171,252,0.2)] min-h-[150px] max-h-[200px] overflow-y-auto">
                        <div className="text-gray-500 border-b border-gray-800 pb-1 mb-2">root@oraculo-pampa:~/cognitive-framework# ./monitor.py</div>
                        {monitorLogs.length === 0 && <div className="text-gray-600 italic">Esperando entrada de datos...</div>}
                        {monitorLogs.map((log, i) => (
                            <div key={i} className="mb-1">
                                <span className="text-green-500">[{log.source}]</span> 
                                <span className="text-[#26c6da]"> K-Ratio: {log.kRatio.toFixed(3)}</span>
                                <span className="text-[#f0abfc]"> Bifurc: {log.bifurcationIndex.toFixed(3)}</span>
                                <br/>
                                <span className={`${log.isAnomaly ? 'text-[#ef5350] font-bold animate-pulse' : 'text-gray-400'}`}>
                                    &gt;&gt; {log.status}
                                </span>
                            </div>
                        ))}
                        {isLoading && <div className="animate-pulse text-[#26c6da] mt-2">_ Procesando flujo de datos...</div>}
                     </div>

                     <h3 className="text-xl text-[#26c6da] mb-4 font-['VT323']">Síntesis Generativa</h3>
                     <div className="flex-grow overflow-y-auto pr-2 min-h-[200px]">
                        {isLoading && (
                            <div className="text-center">
                                <Spinner />
                                <p className="mt-4 text-sm text-[#26c6da]">{statusMessage}</p>
                            </div>
                        )}
                        {error && <p className="text-[#ef5350]">{error}</p>}
                        
                        {analysisResult ? (
                            <div className="text-sm leading-relaxed opacity-95">
                                <div dangerouslySetInnerHTML={{ __html: analysisResult.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n\n/g, '<br /><br />').replace(/\n/g, '<br />') }} />
                                {analysisResult.sources.length > 0 && (
                                    <div className="mt-6 pt-4 border-t border-[rgba(240,171,252,0.2)]">
                                        <h4 className="font-['VT323'] text-xl text-[#26c6da] mb-2">Fuentes Web Consultadas</h4>
                                        <ul className="list-disc list-inside">
                                            {analysisResult.sources.map((source, index) => (
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
                        ) : (
                            !isLoading && <p className="text-gray-400">El resultado del análisis aparecerá aquí.</p>
                        )}
                     </div>
                </Panel>
            </div>
        </div>
    );
};

export default DocumentAnalysisSection;
