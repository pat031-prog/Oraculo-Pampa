import React, { useState, useEffect, useCallback } from 'react';
import Panel from '../ui/Panel';
import Spinner from '../ui/Spinner';
import { Markdown } from '../../utils/markdown';
import { cacheService } from '../../utils/cache';
import {
    convergenceAnalyzer,
    DomainEntropy,
    ConvergenceAnalysis,
    AlertLevel,
    DomainType
} from '../../services/convergenceAnalyzer';

const ConvergenceAnalysisSection: React.FC = () => {
    const [domains, setDomains] = useState<DomainEntropy[]>([]);
    const [analysis, setAnalysis] = useState<ConvergenceAnalysis | null>(null);
    const [loading, setLoading] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [expandedDomains, setExpandedDomains] = useState<Set<DomainType>>(new Set());

    const toggleDomain = (domainId: DomainType) => {
        setExpandedDomains(prev => {
            const newSet = new Set(prev);
            if (newSet.has(domainId)) {
                newSet.delete(domainId);
            } else {
                newSet.add(domainId);
            }
            return newSet;
        });
    };

    const fetchAnalysis = useCallback(() => {
        setLoading(true);

        // Try to get from cache first
        const cachedDomains = cacheService.get<DomainEntropy[]>('convergence_domains');
        const cachedAnalysis = cacheService.get<ConvergenceAnalysis>('convergence_analysis');

        if (cachedDomains && cachedAnalysis) {
            setDomains(cachedDomains);
            setAnalysis(cachedAnalysis);
            setLoading(false);
            return;
        }

        // Simulate async data fetch
        setTimeout(() => {
            const currentDomains = convergenceAnalyzer.getCurrentDomainStates();
            const currentAnalysis = convergenceAnalyzer.analyzeConvergence(currentDomains);

            // Cache for 5 minutes
            cacheService.set('convergence_domains', currentDomains, 5 * 60 * 1000);
            cacheService.set('convergence_analysis', currentAnalysis, 5 * 60 * 1000);

            setDomains(currentDomains);
            setAnalysis(currentAnalysis);
            setLoading(false);
        }, 500);
    }, []);

    useEffect(() => {
        fetchAnalysis();
    }, [fetchAnalysis]);

    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(() => {
            fetchAnalysis();
        }, 30000); // Refresh every 30 seconds

        return () => clearInterval(interval);
    }, [autoRefresh, fetchAnalysis]);

    const getAlertColor = (level: AlertLevel) => {
        switch (level) {
            case 'ROJA': return '#ff3366';
            case 'AMBER': return '#ffcc00';
            default: return '#00ff88';
        }
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'ascending': return '↗️';
            case 'descending': return '↘️';
            default: return '→';
        }
    };

    const getEntropyColorClass = (entropy: number) => {
        if (entropy >= 75) return 'text-[#ff3366]';
        if (entropy >= 60) return 'text-[#ffcc00]';
        return 'text-[#00ff88]';
    };

    if (loading && !analysis) {
        return (
            <Panel>
                <Spinner />
            </Panel>
        );
    }

    return (
        <div className="space-y-3 sm:space-y-4">
            {/* Header */}
            <Panel>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-['VT323'] text-[#00ff88] [text-shadow:0_0_10px_#00ff88]">
                            ANÁLISIS DE CONVERGENCIA MULTIDIMENSIONAL
                        </h2>
                        <p className="text-xs sm:text-sm text-[#00d9ff] mt-1">
                            Framework de Entropía en 5 Dominios • Lead-Time: 3-12 meses
                        </p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button
                            onClick={() => setAutoRefresh(!autoRefresh)}
                            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm border-2 rounded-sm transition-all flex-1 sm:flex-none ${
                                autoRefresh
                                    ? 'bg-[rgba(0,255,136,0.15)] text-[#00ff88] border-[#00ff88]'
                                    : 'text-[#e8ffe8] border-[rgba(0,217,255,0.3)] hover:border-[#00d9ff]'
                            }`}
                        >
                            {autoRefresh ? '⏸️ Auto' : '▶️ Manual'}
                        </button>
                        <button
                            onClick={fetchAnalysis}
                            className="px-3 sm:px-4 py-2 text-xs sm:text-sm border-2 border-[rgba(0,217,255,0.3)] text-[#00d9ff] hover:bg-[rgba(0,217,255,0.1)] hover:border-[#00d9ff] rounded-sm transition-all flex-1 sm:flex-none"
                        >
                            🔄 Actualizar
                        </button>
                    </div>
                </div>

                {/* Alert Banner */}
                {analysis && (
                    <div
                        className="p-3 sm:p-4 rounded-sm border-2 mb-4"
                        style={{
                            backgroundColor: `${getAlertColor(analysis.alertLevel)}15`,
                            borderColor: getAlertColor(analysis.alertLevel)
                        }}
                    >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-2">
                            <div className="text-base sm:text-lg md:text-xl font-bold" style={{ color: getAlertColor(analysis.alertLevel) }}>
                                NIVEL DE ALERTA: {analysis.alertLevel}
                            </div>
                            <div className="text-xs sm:text-sm text-[#00d9ff]">
                                Lead-Time: <span className="font-bold">{analysis.leadTime}</span>
                            </div>
                        </div>
                        <p className="text-xs sm:text-sm text-[#e8ffe8] leading-relaxed">
                            {analysis.narrative}
                        </p>
                    </div>
                )}
            </Panel>

            {/* Metrics Grid */}
            {analysis && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                    <Panel>
                        <div className="text-center">
                            <div className="text-xs sm:text-sm text-[#ffcc00] mb-1">ÍNDICE CONVERGENCIA</div>
                            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#00d9ff] [text-shadow:0_0_10px_#00d9ff]">
                                {analysis.convergenceIndex.toFixed(1)}%
                            </div>
                        </div>
                    </Panel>
                    <Panel>
                        <div className="text-center">
                            <div className="text-xs sm:text-sm text-[#ffcc00] mb-1">RESONANCIA SISTÉMICA</div>
                            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#00ff88] [text-shadow:0_0_10px_#00ff88]">
                                {analysis.resonancia.toFixed(1)}%
                            </div>
                        </div>
                    </Panel>
                    <Panel>
                        <div className="text-center">
                            <div className="text-xs sm:text-sm text-[#ffcc00] mb-1">DOMINIOS EN ALERTA</div>
                            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#ff6600]">
                                {analysis.dominiosAlerta.length}/5
                            </div>
                        </div>
                    </Panel>
                    <Panel>
                        <div className="text-center">
                            <div className="text-xs sm:text-sm text-[#ffcc00] mb-1">CRITICAL SLOWING</div>
                            <div className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ color: analysis.criticalSlowingDown ? '#ff3366' : '#00ff88' }}>
                                {analysis.criticalSlowingDown ? '⚠️ SÍ' : '✓ NO'}
                            </div>
                        </div>
                    </Panel>
                </div>
            )}

            {/* Domain Entropy Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                {domains.map((domain) => {
                    const isExpanded = expandedDomains.has(domain.domain);
                    return (
                        <Panel key={domain.domain}>
                            <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#00ff88] [text-shadow:0_0_8px_#00ff88]">
                                            {domain.label}
                                        </h3>
                                        <div className="text-xs sm:text-sm text-[#00d9ff] mt-1">
                                            {getTrendIcon(domain.trend)} Tendencia: {domain.trend}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-2xl sm:text-3xl md:text-4xl font-bold ${getEntropyColorClass(domain.entropy)}`}>
                                            {domain.entropy.toFixed(1)}%
                                        </div>
                                        <div className="text-xs text-[#ffcc00]">
                                            Δ {domain.velocity >= 0 ? '+' : ''}{domain.velocity.toFixed(2)}
                                        </div>
                                    </div>
                                </div>

                                {/* Entropy Bar */}
                                <div className="w-full bg-[rgba(10,30,50,0.5)] rounded-sm overflow-hidden h-3 sm:h-4 border border-[rgba(0,255,136,0.3)]">
                                    <div
                                        className="h-full transition-all duration-500"
                                        style={{
                                            width: `${domain.entropy}%`,
                                            backgroundColor: domain.entropy >= 75 ? '#ff3366' : domain.entropy >= 60 ? '#ffcc00' : '#00ff88',
                                            boxShadow: `0 0 10px ${domain.entropy >= 75 ? '#ff3366' : domain.entropy >= 60 ? '#ffcc00' : '#00ff88'}`
                                        }}
                                    />
                                </div>

                                {/* Indicators */}
                                <div className="flex flex-wrap gap-1 sm:gap-2">
                                    {domain.indicators.map((indicator, idx) => (
                                        <span
                                            key={idx}
                                            className="text-xs px-2 py-1 bg-[rgba(0,217,255,0.1)] border border-[rgba(0,217,255,0.3)] text-[#00d9ff] rounded-sm"
                                        >
                                            {indicator}
                                        </span>
                                    ))}
                                </div>

                                {/* Toggle Analysis Button */}
                                <button
                                    onClick={() => toggleDomain(domain.domain)}
                                    className="w-full px-3 py-2 text-xs sm:text-sm border-2 border-[rgba(0,217,255,0.3)] text-[#00d9ff] hover:bg-[rgba(0,217,255,0.1)] hover:border-[#00d9ff] rounded-sm transition-all flex items-center justify-center gap-2"
                                >
                                    {isExpanded ? '▲ Ocultar Análisis' : '▼ Ver Análisis Detallado'}
                                </button>

                                {/* Detailed Analysis (Expandable) */}
                                {isExpanded && (
                                    <div className="border-t-2 border-[rgba(0,255,136,0.2)] pt-3 space-y-3">
                                        <div>
                                            <h4 className="text-sm font-bold text-[#ffcc00] mb-2">📊 Qué Mide</h4>
                                            <Markdown className="text-xs sm:text-sm">{domain.analysis.whatItMeasures}</Markdown>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-[#ffcc00] mb-2">⚡ Cómo se Manifiesta</h4>
                                            <Markdown className="text-xs sm:text-sm">{domain.analysis.howItManifests}</Markdown>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-[#ffcc00] mb-2">🔍 Estado Actual</h4>
                                            <Markdown className="text-xs sm:text-sm">{domain.analysis.currentState}</Markdown>
                                        </div>
                                    </div>
                                )}

                                <div className="text-xs text-[rgba(255,255,255,0.5)]">
                                    Última actualización: {new Date(domain.lastUpdated).toLocaleTimeString('es-AR')}
                                </div>
                            </div>
                        </Panel>
                    );
                })}
            </div>

            {/* Methodology Note */}
            <Panel>
                <div className="text-xs sm:text-sm text-[rgba(255,255,255,0.7)] space-y-2">
                    <p className="font-bold text-[#00d9ff]">
                        📊 Metodología: Framework de Análisis Estratégico Multidimensional
                    </p>
                    <p>
                        <strong className="text-[#ffcc00]">Entropía de Shannon:</strong> Medida cuantificable del desorden y variabilidad en cada dominio.
                    </p>
                    <p>
                        <strong className="text-[#ffcc00]">Convergencia:</strong> Las crisis sistémicas surgen cuando la entropía aumenta de forma correlacionada en múltiples dominios, creando "resonancia".
                    </p>
                    <p>
                        <strong className="text-[#ffcc00]">Critical Slowing Down:</strong> Señal de alerta temprana basada en Scheffer et al. (2009) - sistemas cerca de puntos de inflexión muestran mayor autocorrelación.
                    </p>
                    <p>
                        <strong className="text-[#ffcc00]">Umbrales:</strong> ÁMBAR ≥60% convergencia + 2 dominios | ROJA ≥80% convergencia + 3 dominios
                    </p>
                </div>
            </Panel>
        </div>
    );
};

export default ConvergenceAnalysisSection;
