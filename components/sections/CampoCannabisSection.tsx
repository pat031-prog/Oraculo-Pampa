
import React from 'react';
import Panel from '../ui/Panel';

const CampoCannabisSection: React.FC = () => {
    return (
        <div className="animate-[fadeIn_0.6s_ease-out]">
            <h2 className="font-['VT323'] text-4xl text-[#f0abfc] mb-6 pb-2">Vector: Campo y Cannabis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Panel>
                    <h3 className="text-xl text-[#26c6da] mb-4 font-['VT323']">Industria Regulada: Potencial y Desafíos</h3>
                    <div className="text-sm leading-relaxed opacity-90 space-y-3">
                        <p>La sanción de la <strong>Ley 27.669</strong> y la creación de la <strong>ARICCAME</strong> (Agencia Regulatoria de la Industria del Cáñamo y del Cannabis Medicinal) sentaron las bases para una industria formal. Argentina estableció un umbral de <strong>1% de THC</strong> para el cáñamo industrial, más flexible que el 0.3% internacional, lo que permite el uso de genéticas locales más robustas y con mayor biomasa.</p>
                        <p>El proyecto <strong>Cannava S.E.</strong> en Jujuy es el caso de éxito más visible. No solo desarrolló un producto de grado farmacéutico (aceite CBD10), sino que logró cultivar 35 hectáreas y concretar las primeras exportaciones de flores medicinales a mercados exigentes como Alemania y Australia. Esto posiciona a Argentina como un potencial exportador emergente, aunque la industria enfrenta desafíos de inversión, burocracia y estabilidad regulatoria para escalar su producción y competir con actores como Colombia o Uruguay.</p>
                    </div>
                </Panel>
                <Panel>
                    <h3 className="text-xl text-[#26c6da] mb-4 font-['VT323']">Dimensión Social y Simbólica</h3>
                    <div className="text-sm leading-relaxed opacity-90 space-y-3">
                        <p>El <strong>REPROCANN</strong> (Registro del Programa de Cannabis) fue un hito de salud pública, llegando a inscribir a casi 300,000 usuarios y otorgando un marco de legalidad al autocultivo que redujo la criminalización de pacientes. Este registro visibilizó una demanda social latente y demostró la eficacia de una política de reducción de daños.</p>
                        <p>Simbólicamente, esta dualidad se refleja en su regencia astrológica: <strong>Saturno</strong> representa su uso estructurado, medicinal y regulado, asociado a los límites y al alivio del dolor crónico. Por otro lado, <strong>Neptuno</strong> rige su faceta recreativa, la disolución de fronteras del ego y la conexión espiritual o evasiva. La tensión social y legal en torno al cannabis encarna perfectamente el conflicto entre estos dos arquetipos planetarios.</p>
                    </div>
                </Panel>
            </div>
        </div>
    );
};

export default CampoCannabisSection;