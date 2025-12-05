/**
 * Convergence Analyzer Service
 *
 * Basado en el framework teórico del Oráculo Pampa:
 * - Análisis de entropía en 5 dominios
 * - Detección de convergencia de señales
 * - Sistema de alertas Ámbar/Roja
 * - Lead-time de 3-12 meses
 */

export type DomainType = 'tecnologico' | 'economico' | 'social' | 'geopolitico' | 'climatico';

export type AlertLevel = 'ESTABLE' | 'AMBER' | 'ROJA';

export interface DomainEntropy {
    domain: DomainType;
    label: string;
    entropy: number; // 0-100 normalized
    trend: 'ascending' | 'descending' | 'stable';
    velocity: number; // Rate of change
    lastUpdated: Date;
    indicators: string[];
}

export interface ConvergenceAnalysis {
    alertLevel: AlertLevel;
    convergenceIndex: number; // 0-100
    leadTime: string; // "3-6 meses", "6-12 meses", etc.
    dominiosAlerta: DomainType[];
    resonancia: number; // Measure of synchronized entropy
    criticalSlowingDown: boolean;
    timestamp: Date;
    narrative: string;
}

export interface EntropySnapshot {
    timestamp: Date;
    domains: Map<DomainType, number>;
}

export class ConvergenceAnalyzer {
    private entropyHistory: EntropySnapshot[] = [];
    private readonly HISTORY_WINDOW = 10; // Keep last 10 snapshots
    private readonly AMBER_THRESHOLD = 0.60; // 60% convergence
    private readonly RED_THRESHOLD = 0.80; // 80% convergence
    private readonly CRITICAL_DOMAINS = 3; // Need 3+ domains elevated for alert

    constructor() {
        // Initialize with baseline data
        this.initializeBaseline();
    }

    private initializeBaseline() {
        // Simulated baseline entropy values
        const baseline: Map<DomainType, number> = new Map([
            ['tecnologico', 45],
            ['economico', 52],
            ['social', 38],
            ['geopolitico', 48],
            ['climatico', 55]
        ]);

        this.entropyHistory.push({
            timestamp: new Date(),
            domains: baseline
        });
    }

    /**
     * Calculate Shannon Entropy for a domain
     * In real implementation, this would process actual data streams
     */
    private calculateShannonEntropy(domainData: number[]): number {
        if (domainData.length === 0) return 0;

        const total = domainData.reduce((sum, val) => sum + val, 0);
        const probabilities = domainData.map(val => val / total);

        const entropy = -probabilities.reduce((sum, p) => {
            return p > 0 ? sum + p * Math.log2(p) : sum;
        }, 0);

        // Normalize to 0-100 scale
        const maxEntropy = Math.log2(domainData.length);
        return (entropy / maxEntropy) * 100;
    }

    /**
     * Calculate velocity (rate of change) for a domain
     */
    private calculateVelocity(domain: DomainType): number {
        if (this.entropyHistory.length < 2) return 0;

        const recent = this.entropyHistory.slice(-3);
        const deltas = [];

        for (let i = 1; i < recent.length; i++) {
            const prev = recent[i - 1].domains.get(domain) || 0;
            const curr = recent[i].domains.get(domain) || 0;
            deltas.push(curr - prev);
        }

        return deltas.reduce((sum, d) => sum + d, 0) / deltas.length;
    }

    /**
     * Detect Critical Slowing Down
     * Based on Scheffer et al. (2009) - systems near tipping points show increased autocorrelation
     */
    private detectCriticalSlowingDown(domain: DomainType): boolean {
        if (this.entropyHistory.length < 5) return false;

        const recentValues = this.entropyHistory
            .slice(-5)
            .map(snapshot => snapshot.domains.get(domain) || 0);

        // Calculate lag-1 autocorrelation
        const mean = recentValues.reduce((s, v) => s + v, 0) / recentValues.length;
        const deviations = recentValues.map(v => v - mean);

        let numerator = 0;
        for (let i = 0; i < deviations.length - 1; i++) {
            numerator += deviations[i] * deviations[i + 1];
        }

        const denominator = deviations.reduce((s, d) => s + d * d, 0);

        const autocorr = denominator > 0 ? numerator / denominator : 0;

        // High autocorrelation (>0.7) indicates critical slowing down
        return autocorr > 0.7;
    }

    /**
     * Calculate resonance - synchronized increase in entropy across domains
     */
    private calculateResonance(domains: DomainEntropy[]): number {
        const elevated = domains.filter(d => d.entropy > 60);
        if (elevated.length < 2) return 0;

        // Calculate correlation in trend directions
        const uptrends = elevated.filter(d => d.trend === 'ascending').length;
        const resonance = (uptrends / elevated.length) * (elevated.length / domains.length);

        return resonance * 100;
    }

    /**
     * Generate current domain states with simulated real-time data
     */
    public getCurrentDomainStates(): DomainEntropy[] {
        const now = new Date();

        // In real implementation, this would fetch from actual data sources
        // For now, simulating with noise around baseline + trend
        const domains: DomainEntropy[] = [
            {
                domain: 'tecnologico',
                label: 'Tecnológico',
                entropy: 45 + Math.random() * 20,
                trend: 'ascending',
                velocity: this.calculateVelocity('tecnologico'),
                lastUpdated: now,
                indicators: ['IA Generativa', 'Quantum Computing', 'Biotech']
            },
            {
                domain: 'economico',
                label: 'Económico',
                entropy: 52 + Math.random() * 25,
                trend: 'ascending',
                velocity: this.calculateVelocity('economico'),
                lastUpdated: now,
                indicators: ['Inflación Global', 'Deuda Soberana', 'Cripto Volatility']
            },
            {
                domain: 'social',
                label: 'Social',
                entropy: 38 + Math.random() * 30,
                trend: 'stable',
                velocity: this.calculateVelocity('social'),
                lastUpdated: now,
                indicators: ['Polarización', 'Migración', 'Desigualdad']
            },
            {
                domain: 'geopolitico',
                label: 'Geopolítico',
                entropy: 48 + Math.random() * 28,
                trend: 'ascending',
                velocity: this.calculateVelocity('geopolitico'),
                lastUpdated: now,
                indicators: ['Multipolaridad', 'Conflictos Regionales', 'Supply Chain']
            },
            {
                domain: 'climatico',
                label: 'Climático/Exógeno',
                entropy: 55 + Math.random() * 22,
                trend: 'ascending',
                velocity: this.calculateVelocity('climatico'),
                lastUpdated: now,
                indicators: ['Eventos Extremos', 'Sequías', 'Temperatura Global']
            }
        ];

        // Update history
        const snapshot: EntropySnapshot = {
            timestamp: now,
            domains: new Map(domains.map(d => [d.domain, d.entropy]))
        };

        this.entropyHistory.push(snapshot);
        if (this.entropyHistory.length > this.HISTORY_WINDOW) {
            this.entropyHistory.shift();
        }

        return domains;
    }

    /**
     * Analyze convergence and generate alert
     */
    public analyzeConvergence(domains: DomainEntropy[]): ConvergenceAnalysis {
        // Count elevated domains (>60% entropy)
        const elevatedDomains = domains.filter(d => d.entropy > 60);
        const criticalDomains = domains.filter(d => d.entropy > 75);

        // Calculate convergence index
        const avgEntropy = domains.reduce((sum, d) => sum + d.entropy, 0) / domains.length;
        const entropyVariance = domains.reduce((sum, d) => sum + Math.pow(d.entropy - avgEntropy, 2), 0) / domains.length;
        const stdDev = Math.sqrt(entropyVariance);

        // Low variance + high average = high convergence
        const normalizedVariance = 1 - (stdDev / 50); // Normalize
        const convergenceIndex = (avgEntropy / 100) * normalizedVariance * 100;

        // Calculate resonance
        const resonancia = this.calculateResonance(domains);

        // Check for critical slowing down
        const criticalSlowingDown = domains.some(d => this.detectCriticalSlowingDown(d.domain));

        // Determine alert level
        let alertLevel: AlertLevel = 'ESTABLE';
        let leadTime = "N/A";

        if (elevatedDomains.length >= this.CRITICAL_DOMAINS && convergenceIndex > this.RED_THRESHOLD * 100) {
            alertLevel = 'ROJA';
            leadTime = "3-6 meses";
        } else if (elevatedDomains.length >= 2 && convergenceIndex > this.AMBER_THRESHOLD * 100) {
            alertLevel = 'AMBER';
            leadTime = "6-12 meses";
        }

        // Generate narrative
        const narrative = this.generateNarrative(alertLevel, elevatedDomains, resonancia, criticalSlowingDown);

        return {
            alertLevel,
            convergenceIndex,
            leadTime,
            dominiosAlerta: elevatedDomains.map(d => d.domain),
            resonancia,
            criticalSlowingDown,
            timestamp: new Date(),
            narrative
        };
    }

    private generateNarrative(
        level: AlertLevel,
        elevated: DomainEntropy[],
        resonancia: number,
        csd: boolean
    ): string {
        if (level === 'ROJA') {
            return `🔴 ALERTA ROJA: Convergencia crítica detectada en ${elevated.length} dominios (${elevated.map(d => d.label).join(', ')}). Resonancia sistémica: ${resonancia.toFixed(0)}%. ${csd ? 'Señales de ralentización crítica detectadas - el sistema se aproxima a un punto de inflexión.' : ''} Lead-time estimado: 3-6 meses para posible transición de fase.`;
        } else if (level === 'AMBER') {
            return `🟡 ALERTA ÁMBAR: Aumento de entropía en ${elevated.length} dominios (${elevated.map(d => d.label).join(', ')}). Monitorear convergencia. Resonancia: ${resonancia.toFixed(0)}%. ${csd ? 'Indicios tempranos de ralentización crítica.' : ''} Lead-time: 6-12 meses.`;
        } else {
            return `🟢 SISTEMA ESTABLE: Los dominios operan dentro de rangos normales. Continuar monitoreo de rutina.`;
        }
    }

    public getEntropyHistory(): EntropySnapshot[] {
        return [...this.entropyHistory];
    }

    public reset() {
        this.entropyHistory = [];
        this.initializeBaseline();
    }
}

// Singleton instance
export const convergenceAnalyzer = new ConvergenceAnalyzer();
