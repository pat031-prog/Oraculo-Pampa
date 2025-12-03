import React, { useEffect, useState } from 'react';
import Panel from '../ui/Panel';
import Spinner from '../ui/Spinner';
import { generateContent } from '../../services/geminiService';

const CulturaSection: React.FC = () => {
    const [moodData, setMoodData] = useState('');
    const [migrationData, setMigrationData] = useState('');

    useEffect(() => {
        const fetchCultureData = async () => {
            const moodPrompt = "Usa Google Search para detectar el 'Humor Social' actual en Argentina basado en noticias de protestas, redes sociales, o encuestas de las últimas 2 semanas. Describe la 'Entropía Psicosocial' del momento.";
            const migrationPrompt = "Usa Google Search para buscar datos o artículos recientes (2024-2025) sobre emigración de profesionales argentinos, becas o fuga de talentos en tecnología. Analiza el impacto en el Capital Humano.";

            try {
                const [moodRes, migRes] = await Promise.all([
                    generateContent(moodPrompt, true),
                    generateContent(migrationPrompt, true)
                ]);
                setMoodData(moodRes);
                setMigrationData(migRes);
            } catch (e) {
                console.error(e);
            }
        };
        fetchCultureData();
    }, []);

    return (
        <div className="animate-[fadeIn_0.6s_ease-out]">
            <h2 className="font-['VT323'] text-4xl text-[#f0abfc] mb-6 pb-2">Entropía Cultural y Capital Humano (Vector S)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Panel>
                    <h3 className="text-xl text-[#26c6da] mb-4 font-['VT323']">Sismógrafo Social (Live)</h3>
                    <div className="text-sm leading-relaxed opacity-90 space-y-3 min-h-[150px]">
                         {moodData ? (
                           <div dangerouslySetInnerHTML={{ __html: moodData.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
                        ) : (
                           <div className="flex flex-col items-center justify-center h-full">
                               <Spinner className="w-8 h-8" />
                               <span className="text-xs text-[#26c6da] mt-2">Midiendo temperatura social...</span>
                           </div>
                        )}
                    </div>
                </Panel>
                <Panel>
                    <h3 className="text-xl text-[#26c6da] mb-4 font-['VT323']">Flujo de Capital Humano (Live)</h3>
                    <div className="text-sm leading-relaxed opacity-90 space-y-3 min-h-[150px]">
                        {migrationData ? (
                           <div dangerouslySetInnerHTML={{ __html: migrationData.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
                        ) : (
                           <div className="flex flex-col items-center justify-center h-full">
                               <Spinner className="w-8 h-8" />
                               <span className="text-xs text-[#26c6da] mt-2">Rastreando migración de talento...</span>
                           </div>
                        )}
                    </div>
                </Panel>
            </div>
        </div>
    );
};

export default CulturaSection;