import React, { useEffect, useState } from 'react';
import Panel from '../ui/Panel';
import Spinner from '../ui/Spinner';
import { generateContent } from '../../services/geminiService';

const CampoCannabisSection: React.FC = () => {
    const [industryNews, setIndustryNews] = useState('');
    const [socialNews, setSocialNews] = useState('');

    useEffect(() => {
        const fetchCannabisData = async () => {
            const industryPrompt = "Usa Google Search para buscar las últimas noticias (últimos 30 días) sobre la industria del Cannabis en Argentina, ARICCAME, y exportaciones de cáñamo. Sintetiza el estado regulatorio y productivo actual.";
            const socialPrompt = "Usa Google Search para buscar novedades sobre REPROCANN, fallos judiciales recientes o debate social sobre cannabis en Argentina. Analiza la tensión entre legalidad y uso social.";

            try {
                const [indRes, socRes] = await Promise.all([
                    generateContent(industryPrompt, true),
                    generateContent(socialPrompt, true)
                ]);
                setIndustryNews(indRes);
                setSocialNews(socRes);
            } catch (e) {
                console.error(e);
            }
        };
        fetchCannabisData();
    }, []);

    return (
        <div className="animate-[fadeIn_0.6s_ease-out]">
            <h2 className="font-['VT323'] text-4xl text-[#f0abfc] mb-6 pb-2">Vector: Bio-Economía y Cannabis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Panel>
                    <h3 className="text-xl text-[#26c6da] mb-4 font-['VT323']">Dinámica Industrial (Live Status)</h3>
                    <div className="text-sm leading-relaxed opacity-90 space-y-3 min-h-[150px]">
                        {industryNews ? (
                           <div dangerouslySetInnerHTML={{ __html: industryNews.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
                        ) : (
                           <div className="flex flex-col items-center justify-center h-full">
                               <Spinner className="w-8 h-8" />
                               <span className="text-xs text-[#26c6da] mt-2">Consultando ARICCAME/Boletín Oficial...</span>
                           </div>
                        )}
                    </div>
                </Panel>
                <Panel>
                    <h3 className="text-xl text-[#26c6da] mb-4 font-['VT323']">Tensión Social & Legal (Live Status)</h3>
                    <div className="text-sm leading-relaxed opacity-90 space-y-3 min-h-[150px]">
                        {socialNews ? (
                           <div dangerouslySetInnerHTML={{ __html: socialNews.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
                        ) : (
                           <div className="flex flex-col items-center justify-center h-full">
                               <Spinner className="w-8 h-8" />
                               <span className="text-xs text-[#26c6da] mt-2">Analizando estado REPROCANN...</span>
                           </div>
                        )}
                    </div>
                </Panel>
            </div>
        </div>
    );
};

export default CampoCannabisSection;