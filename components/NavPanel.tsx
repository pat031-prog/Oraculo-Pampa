import React from 'react';
import { SectionId } from '../types';
import { NAV_TABS } from '../constants';

interface NavPanelProps {
    activeSection: SectionId;
    onShowSection: (sectionId: SectionId) => void;
}

const NavPanel: React.FC<NavPanelProps> = ({ activeSection, onShowSection }) => {
    return (
        <nav className="flex flex-col gap-2.5 bg-[rgba(22,11,47,0.75)] border border-[rgba(240,171,252,0.2)] p-5 backdrop-blur-md rounded-lg overflow-y-auto max-lg:flex-row max-lg:flex-wrap max-lg:justify-center">
            <div className="font-['VT323'] text-3xl text-[#f0abfc] mb-4 text-center w-full">Vectores Entrópicos</div>
            {NAV_TABS.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => onShowSection(tab.id)}
                    className={`w-full p-3 bg-transparent border border-[rgba(240,171,252,0.2)] rounded-md text-left transition-all duration-300 ease-in-out text-base max-lg:w-auto max-lg:flex-grow max-lg:text-center
                        ${activeSection === tab.id 
                            ? 'bg-[rgba(240,171,252,0.1)] text-white border-[rgba(240,171,252,0.5)]' 
                            : 'text-[#e0e0e0] hover:bg-[rgba(240,171,252,0.05)] hover:text-white'
                        }`}
                >
                    {tab.icon} {tab.label}
                </button>
            ))}
        </nav>
    );
};

export default NavPanel;