
import React from 'react';
import Panel from '../ui/Panel';
import { ModalTopic } from '../../types';

interface ClimaSectionProps {
    onOpenModal: (topic: ModalTopic) => void;
}

const ClimaSection: React.FC<ClimaSectionProps> = ({ onOpenModal }) => {
    return (
        <div className="animate-[fadeIn_0.6s_ease-out]">
            <h2 className="font-['VT323'] text-4xl text-[#f0abfc] mb-6 pb-2">Clima y Entropía Solar (Capa A)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Panel>
                    <h3 className="text-xl text-[#26c6da] mb-4 font-['VT323']">Ciclos Solares y Riesgo Astrofísico</h3>
                    <div className="text-sm leading-relaxed opacity-90 space-y-3">
                       <p>La actividad solar es un vector de entropía exógeno crítico. El <strong>Ciclo Solar 25</strong>, actualmente en curso, está mostrando una actividad significativamente mayor a la proyectada, con picos de manchas solares que superan consistentemente los del ciclo anterior. Este aumento de actividad incrementa la probabilidad de <strong>tormentas geomagnéticas severas</strong> (medidas por el índice Kp).</p>
                       <p>Una tormenta de este tipo (evento Carrington) puede inducir corrientes en las redes eléctricas, con riesgo de apagones masivos, y degradar o interrumpir las señales de navegación por satélite (GPS/PNT), afectando la logística, la aviación, las finanzas y las operaciones militares. Este es un riesgo de alto impacto y baja frecuencia que conecta directamente la entropía astrofísica con la entropía de la infraestructura tecnológica global.</p>
                    </div>
                </Panel>
                <Panel>
                    <h3 className="text-xl text-[#26c6da] mb-4 font-['VT323']">Estrés Hídrico y Fragilidad Logística</h3>
                     <div className="text-sm leading-relaxed opacity-90 space-y-3">
                        <p>El evento prolongado de <strong>La Niña</strong> entre 2020 y 2023 provocó una de las sequías más severas en la historia argentina, llevando el caudal del <strong>Río Paraná</strong> a mínimos en casi 80 años. Esta situación expuso una vulnerabilidad sistémica clave: la dependencia de la hidrovía para el 80% de las exportaciones agrícolas del país.</p>
                        <p>La bajante del río no solo redujo la capacidad de carga de los buques, aumentando costos logísticos y restando competitividad, sino que también mermó drásticamente la generación de energía hidroeléctrica (Yacyretá), forzando un mayor uso de combustibles fósiles, más caros y contaminantes. Esto demuestra una clara interconexión en cascada entre la entropía climática, económica y energética.</p>
                        <button 
                            className="w-full mt-4 p-3 bg-transparent border border-[rgba(240,171,252,0.2)] rounded-md text-center transition-colors hover:bg-[rgba(240,171,252,0.1)]"
                            onClick={() => onOpenModal('estres_hidrico')}>
                            Análisis Detallado de Estrés Hídrico
                        </button>
                    </div>
                </Panel>
            </div>
        </div>
    );
};

export default ClimaSection;