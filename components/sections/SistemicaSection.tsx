
import React from 'react';
import Panel from '../ui/Panel';

const SistemicaSection: React.FC = () => {
    return (
        <div className="animate-[fadeIn_0.6s_ease-out]">
            <h2 className="font-['VT323'] text-4xl text-[#f0abfc] mb-6 pb-2">Entropía Sistémica y de Suministros (Capas E/G)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Panel>
                    <h3 className="text-xl text-[#26c6da] mb-4 font-['VT323']">Nodos Logísticos Críticos (Puntos de Estrangulamiento)</h3>
                    <div className="text-sm leading-relaxed opacity-90">
                        <p className="mb-4">La infraestructura argentina presenta "puntos únicos de falla" donde una interrupción puede generar un colapso en cascada. El monitoreo de estos nodos es esencial para predecir disrupciones sistémicas.</p>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>Puertos del Gran Rosario:</strong> Canalizan casi el <strong>80% de las exportaciones de soja</strong> y derivados del país. Un conflicto gremial o una bajante severa del Paraná detiene el principal ingreso de divisas.</li>
                            <li><strong>Rutas a Vaca Muerta:</strong> Una única vía principal soporta el tráfico pesado. Un bloqueo o colapso de esta ruta puede paralizar la producción energética clave para el equilibrio fiscal y el abastecimiento interno.</li>
                            <li><strong>Puerto de Buenos Aires:</strong> Maneja más del <strong>60% de la carga en contenedores</strong>, vital para la industria manufacturera que depende de insumos importados.</li>
                        </ul>
                    </div>
                </Panel>
                <Panel>
                    <h3 className="text-xl text-[#26c6da] mb-4 font-['VT323']">Fragilidad Financiera y Riesgo de Contagio</h3>
                     <div className="text-sm leading-relaxed opacity-90">
                        <p className="mb-4">El sistema financiero exhibe una alta concentración de riesgo, donde una crisis en un sector puede contagiarse rápidamente al resto de la economía.</p>
                        <ul className="list-disc list-inside space-y-2">
                             <li><strong>Deuda Soberana y Provincial (en USD):</strong> Una devaluación brusca puede hacer insostenible el servicio de la deuda, como se vio en el <strong>default parcial de La Rioja en 2023</strong>, creando un riesgo sistémico para el crédito subnacional.</li>
                             <li><strong>Crédito al Sector Agropecuario:</strong> El Banco Nación concentra una porción significativa del crédito al campo. Una sequía severa, como la de 2023, impacta directamente en el balance del principal banco público del país, conectando la entropía climática con la financiera.</li>
                        </ul>
                    </div>
                </Panel>
            </div>
        </div>
    );
};

export default SistemicaSection;