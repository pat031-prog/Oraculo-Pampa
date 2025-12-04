export type SectionId = 'resumen' | 'live_analysis' | 'indicadores' | 'clima' | 'campo_cannabis' | 'cultura' | 'proyecciones' | 'mapa_sistemico' | 'documentos';

export type AnalysisMode = 'nowcast' | 'foresight' | 'backtest';

export interface NavTab {
    id: SectionId;
    label: string;
    icon: string;
}

export interface GuardianAnalysisResult {
    brief: string;
    json: string;
}

export type ModalTopic = 'pbi' | 'deuda' | 'estres_hidrico' | 'capital_humano';

export interface SearchResult {
    text: string;
    sources: {
        uri: string;
        title: string;
    }[];
}

export interface Projection {
    id: string;
    title: string;
    prompt: string;
    tooltip: string;
}

export interface GlobalAlert {
    message: string;
    level: 'CRITICAL' | 'HIGH' | 'MODERATE';
    source: string;
}