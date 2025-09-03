
import React from 'react';
import Panel from '../ui/Panel';

const CulturaSection: React.FC = () => {
    return (
        <div className="animate-[fadeIn_0.6s_ease-out]">
            <h2 className="font-['VT323'] text-4xl text-[#f0abfc] mb-6 pb-2">Entropía Cultural y Capital Humano (Capa S)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Panel>
                    <h3 className="text-xl text-[#26c6da] mb-4 font-['VT323']">Pulso del Inconsciente Colectivo</h3>
                    <div className="text-sm leading-relaxed opacity-90 space-y-3">
                        <p>La cultura popular actúa como un sismógrafo del ánimo social. Un análisis de las letras de las canciones más populares en Argentina en la última década muestra un incremento medible en palabras asociadas a la tristeza y el enojo. Géneros como el <strong>Trap</strong> y el <strong>RKT</strong>, con su lírica cruda y ritmos urgentes, canalizan una energía de frustración y resiliencia callejera, resonando masivamente en la juventud.</p>
                        <p>En el cine, el dominio de narrativas de superhéroes y distopías refleja una búsqueda colectiva de orden y salvación en un contexto percibido como caótico. Paralelamente, las búsquedas en Google de términos como "emigrar", "ansiedad" y "plazo fijo" actúan como indicadores en tiempo real de la incertidumbre económica y existencial, con picos que se correlacionan directamente con eventos de crisis.</p>
                    </div>
                </Panel>
                <Panel>
                    <h3 className="text-xl text-[#26c6da] mb-4 font-['VT323']">Fuga de Capital Humano</h3>
                    <div className="text-sm leading-relaxed opacity-90 space-y-3">
                        <p>La "fuga de cerebros" es una hemorragia de capital humano que hipoteca el futuro. Argentina presenta un saldo migratorio negativo persistente, con picos de más de <strong>50,000 declaraciones de "mudanza"</strong> al exterior en un solo año post-pandemia. Esto representa una pérdida neta de talento formado con recursos públicos, que luego genera valor en otras economías.</p>
                        <p>El problema se agrava por un déficit estructural en la formación de talento para la economía del conocimiento: solo un <strong>~23% de los nuevos universitarios eligen carreras STEM</strong> (Ciencia, Tecnología, Ingeniería y Matemáticas), y la tasa de deserción en el primer año supera el 40% en muchas de ellas. Esta combinación de alta emigración y baja formación en áreas estratégicas es un vector crítico de entropía social a largo plazo.</p>
                    </div>
                </Panel>
            </div>
        </div>
    );
};

export default CulturaSection;