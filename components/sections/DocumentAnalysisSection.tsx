import React, { useState, useCallback } from 'react';
import Panel from '../ui/Panel';
import Spinner from '../ui/Spinner';
import { generateContentWithSearch } from '../../services/geminiService';
import { SearchResult } from '../../types';

// Let TypeScript know about pdf.js on the window object
declare const window: any;

const DocumentAnalysisSection: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [userQuery, setUserQuery] = useState('');
    const [analysisResult, setAnalysisResult] = useState<SearchResult | null>(null);
    const [status, setStatus] = useState<'idle' | 'extracting' | 'analyzing' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFiles(prevFiles => [...prevFiles, ...Array.from(event.target.files!)]);
        }
    };

    const removeFile = (fileName: string) => {
        setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
    };

    const extractTextFromPdfs = useCallback(async (pdfFiles: File[]): Promise<string> => {
        if (!window.pdfjsLib) {
            throw new Error("PDF processing library not loaded.");
        }

        let combinedText = '';
        for (const file of pdfFiles) {
            setStatusMessage(`Extrayendo texto de: ${file.name}`);
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
            let fileText = `\n--- START DOCUMENT: ${file.name} ---\n`;

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(' ');
                fileText += pageText + '\n';
            }
            
            fileText += `--- END DOCUMENT: ${file.name} ---\n`;
            combinedText += fileText;
        }
        return combinedText;
    }, []);

    const handleAnalysis = async () => {
        if (files.length === 0 || !userQuery.trim()) {
            setError("Por favor, sube al menos un archivo PDF y escribe una consulta.");
            return;
        }
        
        setError(null);
        setAnalysisResult(null);
        setStatus('extracting');
        setStatusMessage('Iniciando extracción de texto de los PDFs...');

        try {
            const documentText = await extractTextFromPdfs(files);
            
            setStatus('analyzing');
            setStatusMessage('Contexto extraído. Enviando al Motor Guardián para análisis...');

            const systemPrompt = `**ROL Y OBJETIVO:** Eres el Motor Analítico Guardián del Oráculo Pampa. Tu misión es sintetizar y analizar los documentos PDF proporcionados por el usuario, contextualizándolos con información actual y confiable de la web. Debes generar predicciones y análisis estratégicos basados en el marco de la Quíntuple Entropía (Tecnológica, Económica, Social, Geopolítica, Astrofísica).

**CONTEXTO PRIMARIO:** La verdad fundamental para tu análisis se encuentra en el contenido de los documentos subidos. La información externa debe usarse para complementar, validar y proyectar las ideas presentes en los textos, no para contradecirlas sin justificación.

**IDIOMA DE SALIDA:** Español.

**FORMATO DE SALIDA OBLIGATORIO:** Estructura tu respuesta en los siguientes apartados, usando exactamente estos títulos en negrita:

**1. Síntesis Ejecutiva de Documentos:**
Un resumen conciso de los puntos clave extraídos de los documentos proporcionados.

**2. Análisis de Convergencia Entrópica:**
Identifica cómo los temas de los documentos se mapean a los cinco vectores de la Quíntuple Entropía. Analiza las interacciones y tensiones entre estos vectores basándote en la información.

**3. Proyecciones y Escenarios Futuros:**
Genera 2 o 3 escenarios probables a futuro, basados en la síntesis de los documentos y enriquecidos con datos actuales de la web. Indica los supuestos clave para cada escenario.

**4. Insights Accionables y Puntos Ciegos:**
Presenta una lista de 2-3 conclusiones críticas y accionables. Menciona también posibles "puntos ciegos" o riesgos que los documentos podrían no estar considerando, según tu análisis ampliado.

**REGLA CRÍTICA:** Cita explícitamente ideas de los documentos cuando los uses. Si la información es insuficiente, decláralo y formula las preguntas clave que necesitarías responder para completar el análisis.`;
            
            const fullUserPrompt = `CONTEXTO DE DOCUMENTOS:\n${documentText}\n\nCONSULTA DEL USUARIO:\n"${userQuery}"\n\nPor favor, genera el análisis siguiendo tus instrucciones.`;

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
            <h2 className="font-['VT323'] text-4xl text-[#f0abfc] mb-6 pb-2">Análisis de Documentos con Guardián</h2>
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
                             <p className="text-gray-400">Arrastra y suelta tus archivos PDF aquí, o haz clic para seleccionar.</p>
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
                            placeholder="Ej: Basado en estos reportes, ¿cuál es el principal riesgo para la cadena de suministro de litio en los próximos 5 años?"
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
                        {isLoading ? 'Procesando...' : 'Iniciar Análisis Guardián'}
                    </button>
                </Panel>
                
                <Panel>
                     <h3 className="text-xl text-[#26c6da] mb-4 font-['VT323']">Análisis Generativo</h3>
                     <div className="min-h-[400px] overflow-y-auto pr-2">
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
