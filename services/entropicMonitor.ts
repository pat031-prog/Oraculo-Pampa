
export interface AnalysisLog {
    source: string;
    kRatio: number;
    bifurcationIndex: number;
    zScore: number;
    status: string;
    isAnomaly: boolean;
}

export class OraculoCognitiveFramework {
    private graphNodes: Set<string>;
    private entropyHistory: number[];
    private criticalThreshold: number;

    constructor(windowSize: number = 5) {
        // El Grafo Simbólico representa la estructura actual del sistema (status quo)
        this.graphNodes = new Set();
        
        // Historial de métricas para detectar cambios de fase
        this.entropyHistory = [];
        this.criticalThreshold = 2.0; // Adjusted slightly for sensitivity
    }

    private async calculateKolmogorovComplexity(text: string): Promise<number> {
        if (!text) return 0;
        const encoder = new TextEncoder();
        const inputBytes = encoder.encode(text);
        
        // Use browser native CompressionStream (GZIP)
        const stream = new Blob([inputBytes]).stream().pipeThrough(new CompressionStream('gzip'));
        const response = new Response(stream);
        const blob = await response.blob();
        const compressedSize = blob.size;
        
        // Ratio de entropía: Cuanto mayor, más irreducible (caótico/novedoso) es el dato.
        // K ~ compressed / original
        return compressedSize / inputBytes.length;
    }

    private updateSymbolicArchitecture(entities: string[]): number {
        const previousNodeCount = this.graphNodes.size;
        
        // Simulate graph updates
        entities.forEach(entity => {
            this.graphNodes.add(entity);
            // In a full graph lib we would add edges here.
            // For the metric calculation, we only need the delta in structural complexity/size.
        });

        // Retornamos el cambio estructural (energía de deformación del grafo)
        const deltaNodes = this.graphNodes.size - previousNodeCount;
        return deltaNodes;
    }

    private calculateMean(data: number[]): number {
        if (data.length === 0) return 0;
        return data.reduce((a, b) => a + b, 0) / data.length;
    }

    private calculateStdDev(data: number[]): number {
        if (data.length === 0) return 0;
        const mean = this.calculateMean(data);
        const squareDiffs = data.map(value => Math.pow(value - mean, 2));
        const avgSquareDiff = this.calculateMean(squareDiffs);
        return Math.sqrt(avgSquareDiff);
    }

    private detectAnomaly(source: string, currentValue: number): AnalysisLog {
        let zScore = 0;
        let status = "Calibrando...";
        let isAnomaly = false;

        // Need a few data points to establish a baseline
        if (this.entropyHistory.length >= 3) {
            // Calculate stats based on history EXCLUDING the current new value to verify deviation
            const historyWindow = this.entropyHistory.slice(0, -1); 
            const mean = this.calculateMean(historyWindow);
            const std = this.calculateStdDev(historyWindow);

            if (std > 0) {
                zScore = (currentValue - mean) / std;
            }

            if (zScore > this.criticalThreshold) {
                status = `⚠️ BIFURCACIÓN DETECTADA: Ruptura de simetría (Z=${zScore.toFixed(2)})`;
                isAnomaly = true;
            } else {
                status = `Sistema Estable. (Z=${zScore.toFixed(2)})`;
            }
        } else {
             status = `Calibrando linea base... (${this.entropyHistory.length}/3)`;
        }

        return {
            source,
            kRatio: 0, // Filled later
            bifurcationIndex: currentValue,
            zScore,
            status,
            isAnomaly
        };
    }

    public async processInput(source: string, contentText: string): Promise<AnalysisLog> {
        // 1. Análisis de Compresión (Nivel de Señal)
        const kRatio = await this.calculateKolmogorovComplexity(contentText);

        // 2. Análisis Simbólico (Nivel Estructural)
        // Simulación: extraemos "palabras clave" como entidades simbólicas (tokenizado simple)
        // Taking first 50 words to represent the conceptual core
        const entities = contentText.split(/\s+/).slice(0, 50).map(s => s.replace(/[^a-zA-Z]/g, '').toLowerCase()).filter(s => s.length > 3);
        const deltaStructural = this.updateSymbolicArchitecture(entities);

        // 3. Cálculo de la Métrica de Bifurcación Combinada
        // La bifurcación ocurre cuando hay alta entropía Y cambio estructural forzado
        // index = K * (1 + log(1 + delta))
        const bifurcationIndex = kRatio * (1 + Math.log1p(deltaStructural));

        this.entropyHistory.push(bifurcationIndex);

        const result = this.detectAnomaly(source, bifurcationIndex);
        result.kRatio = kRatio;
        
        return result;
    }
    
    public getHistory(): number[] {
        return this.entropyHistory;
    }
    
    public reset(): void {
        this.entropyHistory = [];
        this.graphNodes.clear();
    }
}
