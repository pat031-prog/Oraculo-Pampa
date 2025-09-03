
import React from 'react';

interface SpinnerProps {
    className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ className = '' }) => {
    return (
        <div className={`border-4 border-[rgba(38,198,218,0.2)] border-l-[#26c6da] rounded-full w-10 h-10 animate-spin mx-auto my-12 ${className}`}></div>
    );
};

export default Spinner;
