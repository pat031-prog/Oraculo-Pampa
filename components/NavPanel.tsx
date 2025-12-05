import React from 'react';
import { SectionId } from '../types';
import { NAV_TABS } from '../constants';

interface NavPanelProps {
    activeSection: SectionId;
    onShowSection: (sectionId: SectionId) => void;
}

const NavPanel: React.FC<NavPanelProps> = ({ activeSection, onShowSection }) => {
    return (
        <nav className="flex flex-col gap-2 sm:gap-2.5 bg-[rgba(10,30,50,0.85)] border-2 border-[rgba(0,255,136,0.4)] p-3 sm:p-5 backdrop-blur-md rounded-sm overflow-y-auto shadow-[0_0_20px_rgba(0,255,136,0.15)] max-lg:flex-row max-lg:flex-wrap max-lg:justify-center max-lg:gap-2">
            <div className="font-['VT323'] text-xl sm:text-2xl lg:text-3xl text-[#00ff88] mb-2 sm:mb-4 text-center w-full [text-shadow:0_0_8px_#00ff88] border-b-2 border-[rgba(0,255,136,0.3)] pb-2 sm:pb-3">
                VECTORES ENTRÓPICOS
            </div>
            {NAV_TABS.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => onShowSection(tab.id)}
                    className={`w-full p-2 sm:p-3 bg-transparent border-2 rounded-sm text-left transition-all duration-200 ease-in-out text-sm sm:text-base font-medium max-lg:w-auto max-lg:flex-grow max-lg:text-center max-lg:min-w-[120px]
                        ${activeSection === tab.id
                            ? 'bg-[rgba(0,255,136,0.15)] text-[#00ff88] border-[#00ff88] shadow-[0_0_15px_rgba(0,255,136,0.4),inset_0_0_10px_rgba(0,255,136,0.1)] [text-shadow:0_0_8px_#00ff88]'
                            : 'text-[#e8ffe8] border-[rgba(0,217,255,0.3)] hover:bg-[rgba(0,217,255,0.1)] hover:border-[rgba(0,217,255,0.6)] hover:text-[#00d9ff] hover:shadow-[0_0_10px_rgba(0,217,255,0.3)]'
                        }`}
                >
                    <span className="text-base sm:text-lg mr-1 sm:mr-2">{tab.icon}</span>
                    <span className="tracking-wide text-xs sm:text-sm lg:text-base">{tab.label}</span>
                </button>
            ))}
        </nav>
    );
};

export default NavPanel;