import React from 'react';

interface PanelProps {
    children: React.ReactNode;
    className?: string;
}

const Panel: React.FC<PanelProps> = ({ children, className = '' }) => {
    return (
        <div className={`bg-[rgba(10,30,50,0.85)] border-2 border-[rgba(0,255,136,0.4)] backdrop-blur-md rounded-sm shadow-[0_0_15px_rgba(0,255,136,0.3)] p-3 md:p-5 ${className}`}>
            {children}
        </div>
    );
};

export default Panel;