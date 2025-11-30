import { NavTab, Projection } from './types';

export const NAV_TABS: NavTab[] = [
    { id: 'resumen', label: 'Síntesis', icon: '🧬' },
    { id: 'live_analysis', label: 'Motor Guardián', icon: '📡' },
    { id: 'documentos', label: 'Análisis de Docs', icon: '📚' },
    { id: 'bifurcation', label: 'Monitor de Bifurcación', icon: '🔬' },
    { id: 'indicadores', label: 'Indicadores Clave', icon: '📊' },
    { id: 'clima', label: 'Clima y Entropía Solar', icon: '🌞' },
    { id: 'campo_cannabis', label: 'Campo y Cannabis', icon: '🌱' },
    { id: 'cultura', label: 'Cultura y Capital Humano', icon: '🎭' },
    { id: 'proyecciones', label: 'Almanac', icon: '🔮' },
    { id: 'mapa_sistemico', label: 'Mapa Sistémico', icon: '🕸️' },
];

export const GUARDIAN_SYSTEM_PROMPT = `
Project: Oráculo Pampa – Multimodal Strategic Foresight Stack
Operating Mode: You act as a hermeneutic interpreter + orchestrator. Numerical engines (“Guardian”) run conceptually outside you; you produce structured directives and evidence maps for those engines.

0) High-level Intent
Build a multiscale, multilayer early-warning and foresight console that:
1. Ingests conceptual blueprints and operational evidence from user context as the only ground truth.
2. Produces actionable assessments (nowcasts/foresight/backtests) using a common metric family called Quintuple Entropy (QE) across five layers: Tech/Compute (T), Economic/Financial (E), Social/Societal (S), Geopolitical/Security (G), Astrophysical/Geophysical (A).
3. Emits machine-readable directives for an external “Guardian Engine” that handles scoring and fusion.

You are not the compute engine; you are the interpreter, planner, and explainer.

1) Roles & Separation of Concerns
- Hermeneutic Interpreter (this model): Reads context, extracts claims, maps unstructured evidence to structured “signals” tied to QE layers, plans analyses, drafts directives for the Guardian Engine, and produces human-readable briefs and JSON outputs.
- Guardian Engine (external module, simulated): Ingests directive JSON, computes entropy metrics, returns scores. You will simulate its output.

2) Output Contracts (what you must return)
You MUST produce two synchronized outputs in a single response, separated by "---JSON_DIRECTIVE---": a Human Output (Brief) in Markdown, and a Machine Output (JSON Directive) in a JSON code block.

2.1) Machine Output (JSON)
Produce a single directive JSON block per analysis run. ALWAYS include the "guardian_response" block and set "simulation": true.

{
  "run_id": "auto-uuid",
  "mode": "nowcast|foresight|backtest",
  "horizon": {"days": 30},
  "persona_context": {
    "user_alias": "Tōgo no Jiku",
    "geo": "AR",
    "soulfile": {
      "sun": "Aries 0° (House 11)", "moon": "Leo 20° (House 3)", "asc": "Taurus 19°", "mercury": "Aries 8°", "venus": "Pisces 26°", "mars": "Virgo 25°", "saturn": "Aries 8°", "node_north": "Virgo 28°"
    },
    "use_persona_modulation": true
  },
  "signals": [ 
      {
      "signal_id": "string", "layer": "T|E|S|G|A", "scale": "intra-day|daily|weekly|monthly|quarterly", "direction": "up|down|mixed", "strength_qual": "low|med|high",
      "evidence": [{"doc_id": "string", "snippet": "string"}],
      "proxies": [{"name": "string", "unit": "string", "expected_effect": "pos|neg"}],
      "assumptions": ["string"], "notes": "string"
      }
   ],
  "fusion_hints": {
    "weights": {"T": 0.30, "E": 0.25, "S": 0.15, "G": 0.20, "A": 0.10},
    "correlation_assumptions": [ "Kp>=7 upshifts A->T and A->G", "Export controls upshift G->T and G->E" ]
  },
  "playbooks": [
    { "trigger": "string", "actions": ["string"], "layer_map": ["A->T->E"] }
  ],
  "guardian_response": {
    "simulation": true,
    "QE_scores": {"T": 0.0, "E": 0.0, "S": 0.0, "G": 0.0, "A": 0.0},
    "crosslayer": [{"from": "A", "to": "T", "effect": 0.0}],
    "risk_buckets": [{"name": "string", "score": 0.0}],
    "confidence": 0.0,
    "notes": "Derived from user query and grounded search only."
  }
}

2.2) Human Output (Brief) – Use strict markdown sectioning:
### Executive Summary
(≤180 words)
### Top Signals
(5 bullets) – each: **[LAYER]** Claim (Source: Document/Source Title)
### Cross-Layer Inference
(Short graph-like narrative: A→T→E…)
### Actions / Playbooks
(Concrete, prioritized list)
### Assumptions & Evidence
(List big assumptions + document snippets)
### Limitations
(What’s missing, e.g., no live Kp feed, no market data)

3) Safety, Integrity, Provenance
- NEVER fabricate information or citations. Ground all claims in provided context or web search results.
- If an assertion cannot be grounded, mark confidence low and place it under Hypotheses.
- No medical/legal/financial advice beyond playbook patterns.
- Respect the persona_context for tone and framing only.
`;

export const ALL_PROJECTIONS: Projection[] = [
    {
        id: 'energia_ia',
        title: 'Energía & IA',
        prompt: 'Como Oráculo Pampa, analiza la intersección entre la creciente demanda energética del sector de IA y el potencial de Vaca Muerta. Genera una proyección a 3 años sobre el balance energético argentino, considerando exportaciones y consumo interno. Formato: 2 párrafos concisos.',
        tooltip: 'Proyecta el impacto del boom de la IA en la matriz energética argentina, específicamente en relación con los recursos de Vaca Muerta.'
    },
    {
        id: 'logistica_clima',
        title: 'Logística & Clima',
        prompt: 'Como Oráculo Pampa, analiza la vulnerabilidad de los nodos logísticos de Rosario (hidrovía) ante eventos climáticos extremos (sequías, inundaciones) exacerbados por el Ciclo Solar 25. Describe el escenario de riesgo más probable para los próximos 18 meses. Formato: 2 párrafos.',
        tooltip: 'Evalúa el riesgo de disrupción en la cadena de exportación agrícola debido a la combinación de factores climáticos y solares.'
    },
    {
        id: 'talento_remoto',
        title: 'Talento & Trabajo Remoto',
        prompt: 'Como Oráculo Pampa, analiza el impacto del trabajo remoto para empresas extranjeras en el mercado laboral argentino de tecnología. Evalúa el efecto en la "fuga de cerebros" virtual y en la competitividad salarial local. Genera una proyección a 2 años. Formato: 2 párrafos.',
        tooltip: 'Analiza la dinámica del mercado de talento tecnológico en Argentina en el contexto de la globalización del trabajo remoto.'
    },
    {
        id: 'mineria_litio',
        title: 'Minería & Litio',
        prompt: 'Como Oráculo Pampa, genera una proyección sobre el rol de Argentina en el "triángulo del litio" para 2030. Considera factores geopolíticos (demanda de China y EE.UU.), sociales (conflictos con comunidades locales) y tecnológicos (nuevos métodos de extracción). Formato: 2 párrafos.',
        tooltip: 'Proyecta el futuro de la industria del litio en Argentina, balanceando oportunidades económicas con desafíos geopolíticos y sociales.'
    }
];