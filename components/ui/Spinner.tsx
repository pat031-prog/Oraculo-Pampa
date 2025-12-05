
import React from 'react';

interface SpinnerProps {
    className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ className = '' }) => {
    return (
        <div className={`border-4 border-[rgba(0,255,136,0.2)] border-l-[#00ff88] rounded-full w-8 h-8 sm:w-10 sm:h-10 animate-spin mx-auto my-8 sm:my-12 shadow-[0_0_15px_rgba(0,255,136,0.5)] ${className}`}></div>
    );
};

export default Spinner;
