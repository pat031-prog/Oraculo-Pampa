import React, { useEffect, useState, useMemo } from 'react';
import Panel from '../ui/Panel';
import Spinner from '../ui/Spinner';
import { generateContent } from '../../services/geminiService';
import { ALL_PROJECTIONS } from '../../constants';
import { Projection } from '../../types';

const ProyeccionesSection: React.FC = () => {
    const [projectionsContent, setProjectionsContent] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);

    const selectedProjections = useMemo(() => {
        const shuffled = [...ALL_PROJECTIONS].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 4);
    }, []);

    useEffect(() => {
        const fetchProjections = async () => {
            setIsLoading(true);
            const promises = selectedProjections.map(p => 
                generateContent(p.prompt).then(text => ({ id: p.id, text }))
            );
            
            try {
                const results = await Promise.all(promises);
                const contentMap: Record<string, string> = {};
                results.forEach(result => {
                    contentMap[result.id] = result.text;
                });
                setProjectionsContent(contentMap);
            } catch (error) {
                console.error("Failed to fetch Almanac projections", error);
                const errorMap: Record<string, string> = {};
                selectedProjections.forEach(p => {
                    errorMap[p.id] = "Error al generar la proyección del Almanac.";
                });
                setProjectionsContent(errorMap);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjections();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div className="animate-[fadeIn_0.6s_ease-out]">
            <h2 className="font-['VT323'] text-4xl text-[#f0abfc] mb-6 pb-2">Almanac: Análisis Dinámico</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {isLoading ? (
                    <div className="lg:col-span-2"><Spinner /></div>
                ) : (
                    selectedProjections.map(p => (
                        <Panel key={p.id}>
                            <h3 className="text-xl text-[#26c6da] mb-4 font-['VT323'] flex items-center justify-between">
                                {p.title}
                                <span className="relative group">
                                    <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 w-56 p-2 bg-black bg-opacity-80 text-white text-xs rounded-md invisible group-hover:visible transition-opacity opacity-0 group-hover:opacity-100 z-10">
                                        {p.tooltip}
                                    </span>
                                </span>
                            </h3>
                            <div className="text-sm leading-relaxed opacity-90">
                                {projectionsContent[p.id] ? 
                                    <div dangerouslySetInnerHTML={{ __html: projectionsContent[p.id].replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') }}/> : 
                                    <Spinner className="w-6 h-6 my-4"/>
                                }
                            </div>
                        </Panel>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProyeccionesSection;