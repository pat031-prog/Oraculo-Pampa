import React, { useEffect, useState } from 'react';
import Spinner from './ui/Spinner';
import { generateContent } from '../services/geminiService';
import { ModalTopic } from '../types';

interface AiModalProps {
    topic: ModalTopic;
    onClose: () => void;
}

const AiModal: React.FC<AiModalProps> = ({ topic, onClose }) => {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');

    useEffect(() => {
        const fetchAnalysis = async () => {
            let prompt = '';
            let modalTitle = '';

            switch (topic) {
                case 'pbi':
                    modalTitle = "Análisis y Proyección del PBI";
                    prompt = "Como Oráculo Pampa, analiza la composición actual del PBI argentino. Desglosa el 42% de 'Otros' en sus componentes más relevantes. Luego, genera una proyección a 5 años sobre cómo podría mutar esta composición, considerando los vectores entrópicos actuales (tecnología, clima, política).";
                    break;
                case 'deuda':
                    modalTitle = "Análisis de Deuda Provincial";
                    prompt = "Como Oráculo Pampa, analiza la distribución de la deuda provincial argentina. Detalla los riesgos de contagio sistémico derivados de la alta concentración en la provincia de Buenos Aires y proyecta qué provincias podrían enfrentar mayor estrés financiero en los próximos 24 meses, explicando los mecanismos de contagio.";
                    break;
                case 'estres_hidrico':
                    modalTitle = "Análisis de Estrés Hídrico";
                    prompt = "Como Oráculo Pampa, realiza un análisis detallado sobre el estrés hídrico en Argentina. Identifica las 3 zonas más críticas y explica cómo la escasez de agua impacta en la producción agrícola, la generación de energía y la estabilidad social en esas regiones. Proporciona una proyección a corto plazo (12-18 meses).";
                    break;
            }

            setTitle(modalTitle);
            try {
                const generatedText = await generateContent(prompt);
                setContent(generatedText);
            } catch (error) {
                setContent("Error al generar el análisis. Por favor, intente de nuevo más tarde.");
            }
        };

        fetchAnalysis();
    }, [topic]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(13,5,28,0.8)] backdrop-blur-sm animate-[fadeIn_0.3s]">
            <div className="bg-[rgba(22,11,47,0.9)] border border-[#f0abfc] rounded-lg shadow-lg w-11/12 max-w-3xl max-h-[80vh] flex flex-col">
                <div className="flex justify-between items-center p-5 border-b border-[rgba(240,171,252,0.2)]">
                    <h3 className="font-['VT323'] text-3xl text-[#26c6da]">{title}</h3>
                    <button onClick={onClose} className="text-3xl text-gray-400 hover:text-[#f0abfc]">&times;</button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {content ? 
                        <div className="text-sm leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n\n/g, '<br /><br />').replace(/\n/g, '<br />') }} /> 
                        : <Spinner />}
                </div>
            </div>
        </div>
    );
};

export default AiModal;