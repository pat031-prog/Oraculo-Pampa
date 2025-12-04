import React from 'react';

interface PanelProps {
    children: React.ReactNode;
    className?: string;
}

const Panel: React.FC<PanelProps> = ({ children, className = '' }) => {
    return (
        <div className={`bg-[rgba(22,11,47,0.75)] border border-[rgba(240,171,252,0.2)] backdrop-blur-md rounded-lg p-3 md:p-5 ${className}`}>
            {children}
        </div>
    );
};

export default Panel;