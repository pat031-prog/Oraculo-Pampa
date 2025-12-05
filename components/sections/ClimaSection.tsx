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
                <Panel className="relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-50">
                        <div className="w-2 h-2 bg-[#ffee58] rounded-full animate-pulse"></div>
                    </div>
                    <h3 className="text-xl text-[#26c6da] mb-4 font-['VT323'] flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        Ciclos Solares (Live Feed)
                    </h3>
                    <div className="text-sm leading-relaxed opacity-90 space-y-3 min-h-[150px]">
                       {solarData ? (
                           <div dangerouslySetInnerHTML={{ __html: solarData.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#ffee58]">$1</strong>').replace(/\n/g, '<br/>') }} />
                       ) : (
                           <div className="flex flex-col items-center justify-center h-full">
                               <Spinner className="w-8 h-8 border-l-[#ffee58]" />
                               <span className="text-xs text-[#ffee58] mt-2 animate-pulse">Escaneando actividad solar...</span>
                           </div>
                       )}
                    </div>
                </Panel>
                
                <Panel className="relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-2 opacity-50">
                        <div className="w-2 h-2 bg-[#26c6da] rounded-full animate-pulse"></div>
                    </div>
                    <h3 className="text-xl text-[#26c6da] mb-4 font-['VT323'] flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                        Estrés Hídrico & Logística (Live Feed)
                    </h3>
                     <div className="text-sm leading-relaxed opacity-90 space-y-3 min-h-[150px]">
                        {waterData ? (
                           <div dangerouslySetInnerHTML={{ __html: waterData.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#26c6da]">$1</strong>').replace(/\n/g, '<br/>') }} />
                       ) : (
                           <div className="flex flex-col items-center justify-center h-full">
                               <Spinner className="w-8 h-8" />
                               <span className="text-xs text-[#26c6da] mt-2 animate-pulse">Midiendo niveles hídricos...</span>
                           </div>
                       )}
                        <button 
                            className="w-full mt-4 p-3 bg-[rgba(38,198,218,0.05)] border border-[rgba(38,198,218,0.3)] rounded-md text-center transition-all hover:bg-[rgba(38,198,218,0.15)] hover:shadow-[0_0_10px_rgba(38,198,218,0.2)] text-[#26c6da] font-mono text-xs uppercase tracking-wider"
                            onClick={() => onOpenModal('estres_hidrico')}>
                            [+] Ver Informe de Fondo
                        </button>
                    </div>
                </Panel>
            </div>
        </div>
    );
};

export default ClimaSection;