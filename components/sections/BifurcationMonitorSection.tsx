import React, { useState, useEffect, useRef } from 'react';
import { BifurcationMonitor, BifurcationEvent, GraphState } from '../../services/bifurcationService';
import { getApiConfigs, ApiProvider } from '../../services/multiApiService';

const BifurcationMonitorSection: React.FC = () => {
    const [monitor] = useState(() => new BifurcationMonitor(10, 2.5));
    const [events, setEvents] = useState<BifurcationEvent[]>([]);
    const [graphState, setGraphState] = useState<GraphState | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<ApiProvider>('gemini');
    const [textInput, setTextInput] = useState('');
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Check for available API providers
    const [availableProviders, setAvailableProviders] = useState<ApiProvider[]>([]);

    useEffect(() => {
        const configs = getApiConfigs();
        const providers = configs.map(c => c.provider);
        setAvailableProviders(providers);
        if (providers.length > 0 && !providers.includes(selectedProvider)) {
            setSelectedProvider(providers[0]);
        }
    }, []);

    /**
     * Handle PDF file upload
     */
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);

        if (file.type === 'application/pdf') {
            await extractPdfText(file);
        } else if (file.type === 'text/plain') {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setFileContent(ev.target?.result as string);
            };
            reader.readAsText(file);
        } else {
            alert('Solo se soportan archivos PDF y TXT');
        }
    };

    /**
     * Extract text from PDF using pdf.js
     */
    const extractPdfText = async (file: File) => {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await (window as any).pdfjsLib.getDocument({ data: arrayBuffer }).promise;

            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(' ');
                fullText += pageText + '\n';
            }

            setFileContent(fullText);
        } catch (error) {
            console.error('PDF extraction failed:', error);
            alert('Error al procesar el PDF');
        }
    };

    /**
     * Process document through bifurcation monitor
     */
    const processDocument = async () => {
        const content = fileContent || textInput;
        if (!content || content.trim().length === 0) {
            alert('Por favor ingresa texto o carga un archivo');
            return;
        }

        if (availableProviders.length === 0) {
            alert('No hay proveedores de API configurados. Usa configureApis() en la consola.');
            return;
        }

        setIsProcessing(true);

        try {
            const source = fileName || 'Texto Manual';
            const event = await monitor.processDocument(source, content, selectedProvider);

            setEvents(monitor.getEventHistory());
            setGraphState(monitor.getGraphState());

            // Clear inputs
            setTextInput('');
            setFileContent(null);
            setFileName(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Processing failed:', error);
            alert(`Error: ${(error as Error).message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    /**
     * Clear all data
     */
    const clearData = () => {
        if (confirm('¿Eliminar todo el historial y el grafo simbólico?')) {
            monitor.clear();
            setEvents([]);
            setGraphState(null);
        }
    };

    /**
     * Get severity color
     */
    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-500/20 border-red-500 text-red-300';
            case 'warning': return 'bg-yellow-500/20 border-yellow-500 text-yellow-300';
            default: return 'bg-green-500/20 border-green-500 text-green-300';
        }
    };

    /**
     * Get severity icon
     */
    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'critical': return '⚠️';
            case 'warning': return '⚡';
            default: return '✓';
        }
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="border-2 border-cyan-400/60 bg-black/40 p-4">
                <h2 className="text-2xl font-['VT323'] text-fuchsia-300 mb-2">
                    🔬 BIFURCATION MONITOR
                </h2>
                <p className="text-sm text-cyan-300/80 mb-4">
                    Monitor de Puntos Críticos basado en Teoría de la Información Algorítmica.
                    Detecta transiciones de fase en sistemas complejos mediante análisis de compresión
                    y arquitectura simbólica.
                </p>

                {/* API Provider Selection */}
                {availableProviders.length > 0 ? (
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-cyan-300">Proveedor de IA:</span>
                        <select
                            value={selectedProvider}
                            onChange={(e) => setSelectedProvider(e.target.value as ApiProvider)}
                            className="bg-black/60 border border-cyan-400/40 text-cyan-300 px-2 py-1 rounded"
                        >
                            {availableProviders.map(provider => (
                                <option key={provider} value={provider}>
                                    {provider.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <div className="bg-yellow-500/20 border border-yellow-500 p-3 rounded text-yellow-300 text-sm">
                        ⚠️ No hay proveedores de API configurados.
                        <br />
                        Ejecuta <code className="bg-black/40 px-1">configureApis()</code> en la consola.
                    </div>
                )}
            </div>

            {/* Input Section */}
            <div className="border-2 border-fuchsia-400/60 bg-black/40 p-4 space-y-4">
                <h3 className="text-xl font-['VT323'] text-fuchsia-300">Ingesta de Datos</h3>

                {/* Text Input */}
                <div>
                    <label className="block text-sm text-cyan-300 mb-2">Texto Manual</label>
                    <textarea
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Pega aquí un artículo, reporte, o cualquier texto para análisis..."
                        className="w-full h-32 bg-black/60 border border-cyan-400/40 text-cyan-300 p-3 rounded font-mono text-sm"
                        disabled={!!fileContent}
                    />
                </div>

                {/* File Upload */}
                <div>
                    <label className="block text-sm text-cyan-300 mb-2">O carga un archivo (PDF/TXT)</label>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.txt"
                        onChange={handleFileUpload}
                        className="block w-full text-sm text-cyan-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-fuchsia-500/20 file:text-fuchsia-300 hover:file:bg-fuchsia-500/30"
                    />
                    {fileContent && (
                        <div className="mt-2 p-2 bg-green-500/20 border border-green-500 rounded text-green-300 text-sm">
                            ✓ {fileName} cargado ({fileContent.length} caracteres)
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={processDocument}
                        disabled={isProcessing || (!textInput && !fileContent) || availableProviders.length === 0}
                        className="px-4 py-2 bg-fuchsia-500/20 border border-fuchsia-400 text-fuchsia-300 rounded hover:bg-fuchsia-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? 'Procesando...' : 'Analizar Documento'}
                    </button>
                    <button
                        onClick={clearData}
                        disabled={events.length === 0}
                        className="px-4 py-2 bg-red-500/20 border border-red-400 text-red-300 rounded hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Limpiar Historial
                    </button>
                </div>
            </div>

            {/* Events History */}
            {events.length > 0 && (
                <div className="border-2 border-cyan-400/60 bg-black/40 p-4">
                    <h3 className="text-xl font-['VT323'] text-cyan-300 mb-4">
                        Historial de Eventos ({events.length})
                    </h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {events.slice().reverse().map((event, idx) => (
                            <div
                                key={idx}
                                className={`border-2 p-3 rounded ${getSeverityColor(event.severity)}`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">{getSeverityIcon(event.severity)}</span>
                                        <div>
                                            <div className="font-bold">{event.source}</div>
                                            <div className="text-xs opacity-70">
                                                {new Date(event.timestamp).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right text-sm">
                                        <div>Entropy: {event.entropyIndex.toFixed(4)}</div>
                                        <div>Z-Score: {event.zScore.toFixed(2)}</div>
                                    </div>
                                </div>
                                <div className="text-sm mb-2">{event.description}</div>
                                <details className="text-xs opacity-80">
                                    <summary className="cursor-pointer hover:opacity-100">
                                        Entidades Extraídas ({event.extractedEntities.length})
                                    </summary>
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {event.extractedEntities.slice(0, 15).map((entity, i) => (
                                            <span
                                                key={i}
                                                className="bg-black/40 px-2 py-1 rounded border border-current"
                                            >
                                                {entity}
                                            </span>
                                        ))}
                                    </div>
                                </details>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Graph State */}
            {graphState && (
                <div className="border-2 border-fuchsia-400/60 bg-black/40 p-4">
                    <h3 className="text-xl font-['VT323'] text-fuchsia-300 mb-4">
                        Grafo Simbólico
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-center mb-4">
                        <div className="bg-cyan-500/10 border border-cyan-400 p-3 rounded">
                            <div className="text-2xl font-bold text-cyan-300">{graphState.nodes.length}</div>
                            <div className="text-sm text-cyan-300/80">Nodos (Conceptos)</div>
                        </div>
                        <div className="bg-fuchsia-500/10 border border-fuchsia-400 p-3 rounded">
                            <div className="text-2xl font-bold text-fuchsia-300">{graphState.edges.length}</div>
                            <div className="text-sm text-fuchsia-300/80">Edges (Relaciones)</div>
                        </div>
                        <div className="bg-yellow-500/10 border border-yellow-400 p-3 rounded">
                            <div className="text-2xl font-bold text-yellow-300">
                                {graphState.complexity.toFixed(3)}
                            </div>
                            <div className="text-sm text-yellow-300/80">Complejidad</div>
                        </div>
                    </div>

                    {/* Top Nodes */}
                    <details className="mb-4">
                        <summary className="cursor-pointer text-sm text-cyan-300 hover:text-cyan-200 mb-2">
                            Conceptos Principales (top 20)
                        </summary>
                        <div className="grid grid-cols-4 gap-2">
                            {graphState.nodes
                                .sort((a, b) => b.weight - a.weight)
                                .slice(0, 20)
                                .map((node, i) => (
                                    <div
                                        key={node.id}
                                        className="bg-cyan-500/10 border border-cyan-400/40 p-2 rounded text-xs text-cyan-300"
                                    >
                                        <div className="font-bold truncate" title={node.label}>
                                            {node.label}
                                        </div>
                                        <div className="text-xs opacity-70">peso: {node.weight}</div>
                                    </div>
                                ))}
                        </div>
                    </details>

                    <div className="text-xs text-cyan-300/60 italic">
                        💡 El grafo representa la estructura simbólica del conocimiento procesado.
                        Un aumento repentino en nodos y complejidad indica nueva información que no
                        encaja con el paradigma actual (posible bifurcación).
                    </div>
                </div>
            )}

            {/* Info Panel */}
            <div className="border-2 border-yellow-400/60 bg-yellow-500/5 p-4">
                <h3 className="text-lg font-['VT323'] text-yellow-300 mb-2">
                    ℹ️ ¿Cómo Funciona?
                </h3>
                <div className="text-sm text-yellow-200/80 space-y-2">
                    <p>
                        <strong>Compresión Entrópica:</strong> Medimos cuánto se puede comprimir un texto.
                        Información redundante (estable) se comprime bien. Información nueva/caótica es incompresible.
                    </p>
                    <p>
                        <strong>Grafo Simbólico:</strong> Extraemos conceptos clave y sus relaciones.
                        Si un documento introduce muchos conceptos nuevos, fuerza una reestructuración del grafo.
                    </p>
                    <p>
                        <strong>Índice de Bifurcación:</strong> Combinamos entropía × tensión estructural.
                        Un pico indica que el sistema ha encontrado información que rompe su estructura actual.
                    </p>
                    <p>
                        <strong>Z-Score:</strong> Comparamos el índice con el historial. {">"} 2.5 desviaciones = WARNING.
                        {">"} 3.75 desviaciones = CRITICAL (Cisne Negro detectado).
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BifurcationMonitorSection;
