import React, { useRef, useEffect } from 'react';
import { SectionId } from '../types';
import { NAV_TABS } from '../constants';

interface NavPanelProps {
    activeSection: SectionId;
    onShowSection: (sectionId: SectionId) => void;
}

const getIconPath = (id: SectionId) => {
    switch (id) {
        case 'resumen': return <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />;
        case 'live_analysis': return <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />;
        case 'documentos': return <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />;
        case 'indicadores': return <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />;
        case 'clima': return <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z" />;
        case 'campo_cannabis': return <path d="M17 8C8 10 5.9 16.17 3.82 21.34 5.71 18.06 8.4 15 9 13c1.93.86 3.98 2.12 4.96 4.74 2.55-1.58 4.29-3.79 5.86-7.3-.87 1.89-2.07 3.79-4.96 5.68.22 1.46.06 3.12-.26 4.88 4.14-1.68 6.64-5.98 7.4-12-1.4.9-3.4 2-5 2z" />;
        case 'cultura': return <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />;
        case 'proyecciones': return <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />;
        case 'mapa_sistemico': return <path d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18-.21 0-.41-.06-.57-.18l-7.9-4.44A.991.991 0 0 1 3 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.12.36-.18.57-.18.21 0 .41.06.57.18l7.9 4.44c.32.17.53.5.53.88v9zM12 4.15L6.04 7.5 12 10.85l5.96-3.35L12 4.15zM5 15.91l6 3.38v-6.71L5 9.21v6.7zm14 0v-6.7l-6 3.38v6.71l6-3.38z" />;
        default: return <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />;
    }
}

const NavPanel: React.FC<NavPanelProps> = ({ activeSection, onShowSection }) => {
    const navRef = useRef<HTMLDivElement>(null);
    const activeTabRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        // Auto-scroll logic for mobile
        if (navRef.current && activeTabRef.current) {
            const container = navRef.current;
            const tab = activeTabRef.current;
            
            // Calculate center position
            const scrollLeft = tab.offsetLeft - (container.clientWidth / 2) + (tab.clientWidth / 2);
            
            container.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
            });
        }
    }, [activeSection]);

    return (
        <nav 
            ref={navRef}
            className="flex flex-row overflow-x-auto pb-2 lg:pb-0 lg:flex-col gap-2 bg-[rgba(22,11,47,0.75)] border border-[rgba(240,171,252,0.2)] p-3 md:p-4 backdrop-blur-md rounded-lg [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
            <div className="font-['VT323'] text-xl md:text-2xl text-[#f0abfc] mb-0 md:mb-3 text-center lg:w-full border-r lg:border-r-0 lg:border-b border-[rgba(240,171,252,0.1)] pr-4 lg:pr-0 lg:pb-2 tracking-widest hidden md:block">
                NAVEGACIÓN_
            </div>
            {NAV_TABS.map(tab => (
                <button
                    key={tab.id}
                    ref={activeSection === tab.id ? activeTabRef : null}
                    onClick={() => onShowSection(tab.id)}
                    className={`group min-w-[120px] lg:min-w-0 flex-shrink-0 lg:w-full p-2 md:p-3 rounded-md text-left transition-all duration-300 ease-in-out flex items-center gap-2 md:gap-3 relative overflow-hidden
                        ${activeSection === tab.id 
                            ? 'bg-[rgba(240,171,252,0.15)] text-[#f0abfc] border border-[rgba(240,171,252,0.4)] shadow-[0_0_15px_rgba(240,171,252,0.15)]' 
                            : 'text-gray-400 hover:bg-[rgba(255,255,255,0.05)] hover:text-white hover:pl-4 border border-transparent'
                        }`}
                >
                    <div className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 ${activeSection === tab.id ? 'scale-110 drop-shadow-[0_0_5px_rgba(240,171,252,0.8)]' : 'group-hover:scale-110'}`}>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            {getIconPath(tab.id)}
                        </svg>
                    </div>
                    <span className="font-mono text-xs md:text-sm tracking-tight whitespace-nowrap">{tab.label}</span>
                    
                    {/* Active Indicator Bar */}
                    {activeSection === tab.id && (
                        <div className="absolute right-0 top-0 h-full w-1 bg-[#f0abfc] shadow-[0_0_10px_#f0abfc] hidden lg:block"></div>
                    )}
                    {/* Active Indicator Bar (Mobile Bottom) */}
                    {activeSection === tab.id && (
                        <div className="absolute bottom-0 left-0 h-1 w-full bg-[#f0abfc] shadow-[0_0_10px_#f0abfc] lg:hidden"></div>
                    )}
                </button>
            ))}
        </nav>
    );
};

export default NavPanel;