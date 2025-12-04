import React, { useState, useCallback } from 'react';
import { SectionId, ModalTopic, GlobalAlert } from './types';
import NavPanel from './components/NavPanel';
import Header from './components/Header';
import BackgroundEffects from './components/BackgroundEffects';
import AiModal from './components/AiModal';
import ResumenSection from './components/sections/ResumenSection';
import LiveAnalysisSection from './components/sections/LiveAnalysisSection';
import IndicadoresSection from './components/sections/IndicadoresSection';
import ClimaSection from './components/sections/ClimaSection';
import CampoCannabisSection from './components/sections/CampoCannabisSection';
import CulturaSection from './components/sections/CulturaSection';
import ProyeccionesSection from './components/sections/ProyeccionesSection';
import MapaSistemicoSection from './components/sections/MapaSistemicoSection';
import DocumentAnalysisSection from './components/sections/DocumentAnalysisSection';

const App: React.FC = () => {
    const [activeSection, setActiveSection] = useState<SectionId>('resumen');
    const [modalTopic, setModalTopic] = useState<ModalTopic | null>(null);
    const [globalAlert, setGlobalAlert] = useState<GlobalAlert | null>(null);
    const [pdfContext, setPdfContext] = useState<string>('');

    const handleShowSection = useCallback((sectionId: SectionId) => {
        setActiveSection(sectionId);
    }, []);

    const handleOpenModal = useCallback((topic: ModalTopic) => {
        setModalTopic(topic);
    }, []);

    const handleCloseModal = useCallback(() => {
        setModalTopic(null);
    }, []);

    const handleSetAlert = useCallback((alert: GlobalAlert) => {
        setGlobalAlert(alert);
        // Optional: Switch to dashboard when an alert is triggered to show it immediately
        // setActiveSection('resumen'); 
    }, []);

    const handleContextUpdate = useCallback((context: string) => {
        setPdfContext(context);
    }, []);

    const renderSection = () => {
        switch (activeSection) {
            case 'resumen': return <ResumenSection globalAlert={globalAlert} />;
            case 'live_analysis': return <LiveAnalysisSection onSetAlert={handleSetAlert} />;
            case 'documentos': return <DocumentAnalysisSection onSetAlert={handleSetAlert} onContextUpdate={handleContextUpdate} />;
            case 'indicadores': return <IndicadoresSection onOpenModal={handleOpenModal} />;
            case 'clima': return <ClimaSection onOpenModal={handleOpenModal} />;
            case 'campo_cannabis': return <CampoCannabisSection />;
            case 'cultura': return <CulturaSection />;
            case 'proyecciones': return <ProyeccionesSection pdfContext={pdfContext} />;
            case 'mapa_sistemico': return <MapaSistemicoSection />;
            default: return <ResumenSection globalAlert={globalAlert} />;
        }
    };

    return (
        <>
            <BackgroundEffects />
            <div className="h-screen w-screen grid grid-cols-[280px_1fr] grid-rows-[80px_1fr] gap-3 md:gap-4 p-2 md:p-4 font-['Roboto_Mono'] max-lg:grid-cols-1 max-lg:grid-rows-[auto_auto_1fr] max-lg:h-auto max-lg:overflow-y-auto">
                <Header />
                <NavPanel activeSection={activeSection} onShowSection={handleShowSection} />
                <main className="overflow-y-auto pr-0 md:pr-2">
                    {renderSection()}
                </main>
            </div>
            {modalTopic && <AiModal topic={modalTopic} onClose={handleCloseModal} />}
        </>
    );
};

export default App;