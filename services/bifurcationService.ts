/**
 * Bifurcation Monitor Service
 *
 * Implements Algorithmic Information Theory (AIT) based monitoring
 * to detect critical phase transitions in complex systems.
 *
 * Core Concepts:
 * 1. Kolmogorov Complexity Approximation via compression
 * 2. Symbolic Graph Architecture for knowledge structure
 * 3. Entropy Rate Analysis for bifurcation detection
 */

import { callAIWithFallback, ApiMessage, ApiProvider } from './multiApiService';

declare const window: any;

/**
 * Symbolic Graph Node
 */
export interface GraphNode {
    id: string;
    label: string;
    weight: number;
    timestamp: number;
}

/**
 * Symbolic Graph Edge
 */
export interface GraphEdge {
    from: string;
    to: string;
    weight: number;
    type: string;
}

/**
 * Bifurcation Event
 */
export interface BifurcationEvent {
    timestamp: number;
    source: string;
    entropyIndex: number;
    zScore: number;
    severity: 'stable' | 'warning' | 'critical';
    description: string;
    extractedEntities: string[];
}

/**
 * Graph State
 */
export interface GraphState {
    nodes: GraphNode[];
    edges: GraphEdge[];
    complexity: number;
}

/**
 * Simple Symbolic Graph implementation
 */
class SymbolicGraph {
    private nodes: Map<string, GraphNode> = new Map();
    private edges: GraphEdge[] = [];

    addNode(id: string, label: string, weight: number = 1): void {
        if (!this.nodes.has(id)) {
            this.nodes.set(id, {
                id,
                label,
                weight,
                timestamp: Date.now()
            });
        } else {
            // Update weight
            const node = this.nodes.get(id)!;
            node.weight += weight;
        }
    }

    addEdge(from: string, to: string, type: string = 'relates_to', weight: number = 1): void {
        // Ensure both nodes exist
        if (!this.nodes.has(from) || !this.nodes.has(to)) {
            return;
        }

        // Check if edge already exists
        const existingEdge = this.edges.find(e => e.from === from && e.to === to);
        if (existingEdge) {
            existingEdge.weight += weight;
        } else {
            this.edges.push({ from, to, type, weight });
        }
    }

    getNodeCount(): number {
        return this.nodes.size;
    }

    getEdgeCount(): number {
        return this.edges.length;
    }

    getState(): GraphState {
        return {
            nodes: Array.from(this.nodes.values()),
            edges: [...this.edges],
            complexity: this.calculateComplexity()
        };
    }

    private calculateComplexity(): number {
        // Graph complexity based on nodes, edges, and connectivity
        const nodeCount = this.nodes.size;
        const edgeCount = this.edges.length;

        if (nodeCount === 0) return 0;

        // Complexity = edge density × log(nodes)
        const edgeDensity = edgeCount / (nodeCount * (nodeCount - 1) || 1);
        const complexity = edgeDensity * Math.log2(nodeCount + 1);

        return complexity;
    }

    clear(): void {
        this.nodes.clear();
        this.edges = [];
    }
}

/**
 * Bifurcation Monitor
 */
export class BifurcationMonitor {
    private graph: SymbolicGraph;
    private entropyHistory: number[] = [];
    private eventHistory: BifurcationEvent[] = [];
    private windowSize: number;
    private criticalThreshold: number;

    constructor(windowSize: number = 10, criticalThreshold: number = 2.5) {
        this.graph = new SymbolicGraph();
        this.windowSize = windowSize;
        this.criticalThreshold = criticalThreshold;
    }

    /**
     * Calculate Kolmogorov Complexity approximation using compression
     * Uses pako library (loaded from CDN)
     */
    private calculateKolmogorovComplexity(text: string): number {
        if (!text || text.length === 0) return 0;

        try {
            // Check if pako is loaded
            if (typeof window !== 'undefined' && (window as any).pako) {
                const pako = (window as any).pako;
                const textBytes = new TextEncoder().encode(text);
                const compressed = pako.deflate(textBytes);

                // K-ratio: compressed size / original size
                const kRatio = compressed.length / textBytes.length;
                return kRatio;
            } else {
                // Fallback: simple entropy estimation
                return this.calculateShannomEntropy(text);
            }
        } catch (error) {
            console.error('Compression failed:', error);
            return this.calculateShannomEntropy(text);
        }
    }

    /**
     * Calculate Shannon Entropy as fallback
     */
    private calculateShannomEntropy(text: string): number {
        if (!text) return 0;

        const freq: { [key: string]: number } = {};
        for (const char of text) {
            freq[char] = (freq[char] || 0) + 1;
        }

        const len = text.length;
        let entropy = 0;

        for (const char in freq) {
            const p = freq[char] / len;
            entropy -= p * Math.log2(p);
        }

        // Normalize to 0-1 range
        return entropy / Math.log2(256);
    }

    /**
     * Extract entities from text using AI
     */
    private async extractEntities(text: string, provider?: ApiProvider): Promise<string[]> {
        try {
            const messages: ApiMessage[] = [
                {
                    role: 'system',
                    content: `You are an entity extraction system. Extract key concepts, entities, and important terms from the text.
Return ONLY a JSON array of strings, nothing else. Maximum 20 entities.
Example: ["entity1", "entity2", "entity3"]`
                },
                {
                    role: 'user',
                    content: text
                }
            ];

            const response = await callAIWithFallback(messages, provider);

            // Parse JSON response
            const jsonMatch = response.text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                const entities = JSON.parse(jsonMatch[0]);
                return entities.slice(0, 20); // Limit to 20
            }

            // Fallback: simple keyword extraction
            return this.simpleEntityExtraction(text);
        } catch (error) {
            console.error('Entity extraction failed:', error);
            return this.simpleEntityExtraction(text);
        }
    }

    /**
     * Simple entity extraction fallback
     */
    private simpleEntityExtraction(text: string): string[] {
        // Remove common words and extract significant terms
        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 4); // Filter short words

        // Get unique words and return top 20 by frequency
        const freq: { [key: string]: number } = {};
        for (const word of words) {
            freq[word] = (freq[word] || 0) + 1;
        }

        return Object.entries(freq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20)
            .map(([word]) => word);
    }

    /**
     * Update symbolic graph with new entities
     */
    private updateSymbolicGraph(entities: string[]): number {
        const initialNodeCount = this.graph.getNodeCount();

        // Add entities as nodes
        for (const entity of entities) {
            this.graph.addNode(entity, entity, 1);
        }

        // Create edges between consecutive entities (simple co-occurrence)
        for (let i = 0; i < entities.length - 1; i++) {
            this.graph.addEdge(entities[i], entities[i + 1], 'co_occurs');
        }

        const finalNodeCount = this.graph.getNodeCount();
        const deltaNodes = finalNodeCount - initialNodeCount;

        return deltaNodes;
    }

    /**
     * Calculate bifurcation index
     */
    private calculateBifurcationIndex(kRatio: number, deltaStructural: number): number {
        // Bifurcation occurs when:
        // - High entropy (kRatio close to 1 = incompressible)
        // - Forced structural change (many new nodes)
        const structuralFactor = 1 + Math.log1p(Math.abs(deltaStructural));
        const bifurcationIndex = kRatio * structuralFactor;

        return bifurcationIndex;
    }

    /**
     * Detect anomaly using Z-score
     */
    private detectAnomaly(value: number): { zScore: number; severity: 'stable' | 'warning' | 'critical' } {
        if (this.entropyHistory.length < 3) {
            return { zScore: 0, severity: 'stable' };
        }

        const history = this.entropyHistory.slice(0, -1); // Exclude current value
        const mean = history.reduce((a, b) => a + b, 0) / history.length;
        const variance = history.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / history.length;
        const std = Math.sqrt(variance);

        const zScore = std > 0 ? (value - mean) / std : 0;

        let severity: 'stable' | 'warning' | 'critical' = 'stable';
        if (zScore > this.criticalThreshold * 1.5) {
            severity = 'critical';
        } else if (zScore > this.criticalThreshold) {
            severity = 'warning';
        }

        return { zScore, severity };
    }

    /**
     * Process input document
     */
    async processDocument(
        source: string,
        content: string,
        provider?: ApiProvider
    ): Promise<BifurcationEvent> {
        // 1. Calculate compression-based complexity
        const kRatio = this.calculateKolmogorovComplexity(content);

        // 2. Extract entities using AI
        const entities = await this.extractEntities(content, provider);

        // 3. Update symbolic graph
        const deltaStructural = this.updateSymbolicGraph(entities);

        // 4. Calculate bifurcation index
        const bifurcationIndex = this.calculateBifurcationIndex(kRatio, deltaStructural);

        // 5. Add to history
        this.entropyHistory.push(bifurcationIndex);
        if (this.entropyHistory.length > this.windowSize) {
            this.entropyHistory.shift();
        }

        // 6. Detect anomaly
        const { zScore, severity } = this.detectAnomaly(bifurcationIndex);

        // 7. Create event
        const event: BifurcationEvent = {
            timestamp: Date.now(),
            source,
            entropyIndex: bifurcationIndex,
            zScore,
            severity,
            description: this.generateDescription(severity, zScore, source),
            extractedEntities: entities
        };

        this.eventHistory.push(event);

        return event;
    }

    /**
     * Generate human-readable description
     */
    private generateDescription(severity: string, zScore: number, source: string): string {
        if (severity === 'critical') {
            return `⚠️ BIFURCATION DETECTED in ${source}: Critical phase transition (Z=${zScore.toFixed(2)})`;
        } else if (severity === 'warning') {
            return `⚡ WARNING in ${source}: System instability detected (Z=${zScore.toFixed(2)})`;
        } else {
            return `✓ System stable: ${source} (Z=${zScore.toFixed(2)})`;
        }
    }

    /**
     * Get current graph state
     */
    getGraphState(): GraphState {
        return this.graph.getState();
    }

    /**
     * Get event history
     */
    getEventHistory(): BifurcationEvent[] {
        return [...this.eventHistory];
    }

    /**
     * Get entropy history
     */
    getEntropyHistory(): number[] {
        return [...this.entropyHistory];
    }

    /**
     * Clear all data
     */
    clear(): void {
        this.graph.clear();
        this.entropyHistory = [];
        this.eventHistory = [];
    }
}
