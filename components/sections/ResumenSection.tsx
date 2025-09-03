import React, { useEffect, useState } from 'react';
import Panel from '../ui/Panel';
import Spinner from '../ui/Spinner';
import { generateContent } from '../../services/geminiService';

const ResumenSection: React.FC = () => {
    const [alertText, setAlertText] = useState('');
    const [politicaText, setPoliticaText] = useState('');
    const [accionesText, setAccionesText] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const alertPrompt = `Eres el Oráculo Pampa. Analiza la convergencia actual de los cinco vectores de entropía para Argentina. Identifica la amenaza más crítica e inminente. Genera un único párrafo conciso para una pancarta de alerta.`;
                generateContent(alertPrompt).then(setAlertText).catch(() => setAlertText("Error al generar la alerta dinámica."));

                const politicaPrompt = `Como Oráculo Pampa, genera una síntesis política de 2 párrafos sobre Argentina, basándote en la convergencia de alta pobreza, fragilidad logística, riesgo de sequía y malestar cultural.`;
                generateContent(politicaPrompt).then(setPoliticaText).catch(() => setPoliticaText("Error al generar la síntesis."));
                
                const accionesPrompt = `Como Oráculo Pampa, sugiere 3 "micro-acciones de máximo rendimiento simbólico" para un individuo en Argentina, basadas en el contexto actual de alta entropía. Deben ser de bajo costo y alta opcionalidad. Formato: lista con negritas y sin título.`;
                generateContent(accionesPrompt).then(setAccionesText).catch(() => setAccionesText("Error al generar micro-acciones."));

            } catch (error) {
                console.error("Failed to fetch summary data", error);
            }
        };
        fetchData();
    }, []);

    const renderContent = (content: string) => {
        if (!content) return <Spinner className="w-6 h-6 my-4" />;
        return <div dangerouslySetInnerHTML={{ __html: content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') }} />;
    };

    return (
        <div className="animate-[fadeIn_0.6s_ease-out]">
            <h2 className="font-['VT323'] text-4xl text-[#f0abfc] mb-6 pb-2">Dashboard de Síntesis Convergente</h2>
            <div className="p-4 bg-[rgba(239,83,80,0.1)] border border-[#ef5350] rounded-md text-[#ffcdd2] mb-5 text-center min-h-[50px] flex items-center justify-center">
                {alertText ? alertText : <Spinner className="w-6 h-6 my-0"/>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Panel>
                    <h3 className="text-xl text-[#26c6da] mb-4 font-['VT323']">Síntesis Política Generativa</h3>
                    <div className="text-sm leading-relaxed opacity-90">{renderContent(politicaText)}</div>
                </Panel>
                <Panel>
                    <h3 className="text-xl text-[#26c6da] mb-4 font-['VT323']">Micro-Acciones de Máximo Rendimiento</h3>
                    <div className="text-sm leading-relaxed opacity-90">{renderContent(accionesText)}</div>
                </Panel>
            </div>
        </div>
    );
};

export default ResumenSection;