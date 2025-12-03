import React, { useEffect, useState } from 'react';
import Panel from '../ui/Panel';
import Spinner from '../ui/Spinner';
import { generateContent } from '../../services/geminiService';
import { ModalTopic } from '../../types';

interface ClimaSectionProps {
    onOpenModal: (topic: ModalTopic) => void;
}

const ClimaSection: React.FC<ClimaSectionProps> = ({ onOpenModal }) => {
    const [solarData, setSolarData] = useState('');
    const [waterData, setWaterData] = useState('');

    useEffect(() => {
        const fetchClimateData = async () => {
            const solarPrompt = "Usa Google Search para obtener el estado actual (HOY) de la actividad solar, manchas solares y el índice Kp. Analiza brevemente cómo esto afecta hoy a las telecomunicaciones y redes eléctricas (Entropía Astrofísica).";
            const waterPrompt = "Usa Google Search para obtener el nivel actual de los ríos Paraná y Uruguay, y el estado de humedad de suelos en zona núcleo argentina. Analiza brevemente el riesgo logístico y productivo actual (Entropía de Recursos).";

            try {
                // Fire both requests in parallel using search
                const [solarRes, waterRes] = await Promise.all([
                    generateContent(solarPrompt, true),
                    generateContent(waterPrompt, true)
                ]);
                setSolarData(solarRes);
                setWaterData(waterRes);
            } catch (e) {
                console.error(e);
            }
        };
        fetchClimateData();
    }, []);

    return (
        <div className="animate-[fadeIn_0.6s_ease-out]">
            <h2 className="font-['VT323'] text-4xl text-[#f0abfc] mb-6 pb-2">Clima y Entropía Solar (Vector A)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Panel>
                    <h3 className="text-xl text-[#26c6da] mb-4 font-['VT323']">Ciclos Solares (Live Feed)</h3>
                    <div className="text-sm leading-relaxed opacity-90 space-y-3 min-h-[150px]">
                       {solarData ? (
                           <div dangerouslySetInnerHTML={{ __html: solarData.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
                       ) : (
                           <div className="flex flex-col items-center justify-center h-full">
                               <Spinner className="w-8 h-8" />
                               <span className="text-xs text-[#26c6da] mt-2">Escaneando actividad solar...</span>
                           </div>
                       )}
                    </div>
                </Panel>
                <Panel>
                    <h3 className="text-xl text-[#26c6da] mb-4 font-['VT323']">Estrés Hídrico & Logística (Live Feed)</h3>
                     <div className="text-sm leading-relaxed opacity-90 space-y-3 min-h-[150px]">
                        {waterData ? (
                           <div dangerouslySetInnerHTML={{ __html: waterData.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
                       ) : (
                           <div className="flex flex-col items-center justify-center h-full">
                               <Spinner className="w-8 h-8" />
                               <span className="text-xs text-[#26c6da] mt-2">Midiendo niveles hídricos...</span>
                           </div>
                       )}
                        <button 
                            className="w-full mt-4 p-3 bg-transparent border border-[rgba(240,171,252,0.2)] rounded-md text-center transition-colors hover:bg-[rgba(240,171,252,0.1)]"
                            onClick={() => onOpenModal('estres_hidrico')}>
                            Ver Informe de Fondo
                        </button>
                    </div>
                </Panel>
            </div>
        </div>
    );
};

export default ClimaSection;