import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
    const [logoText, setLogoText] = useState('');
    const [time, setTime] = useState('--:--:--');
    const fullLogoText = "ORÁCULO PAMPA";

    useEffect(() => {
        let i = 0;
        setLogoText('');
        const typeWriterInterval = setInterval(() => {
            i++;
            setLogoText(fullLogoText.slice(0, i));
            if (i === fullLogoText.length) {
                clearInterval(typeWriterInterval);
            }
        }, 150);

        // Clear interval on component unmount
        return () => clearInterval(typeWriterInterval);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            try {
                const now = new Date();
                const argTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }));
                setTime(argTime.toLocaleTimeString('es-AR', { hour12: false }));
            } catch (e) {
                // Fallback for environments that might not support the timeZone
                const now = new Date();
                setTime(now.toLocaleTimeString('es-AR', { hour12: false }));
            }
        }, 1000);
        return () => clearInterval(timer);
    }, []);


    return (
        <header className="col-span-full flex flex-col md:flex-row justify-between items-center px-4 py-3 md:px-6 bg-[rgba(22,11,47,0.75)] border border-[rgba(240,171,252,0.2)] backdrop-blur-md rounded-lg gap-2 md:gap-0">
            <div className="font-['VT323'] text-4xl md:text-5xl text-[#f0abfc] [text-shadow:0_0_8px_var(--color-glow-primary)] whitespace-nowrap">
                {logoText}<span className="animate-ping">_</span>
            </div>
            <div className="flex gap-4 md:gap-8 text-right w-full md:w-auto justify-center md:justify-end border-t md:border-t-0 border-[rgba(240,171,252,0.1)] pt-2 md:pt-0">
                <div className="flex flex-col items-center md:items-end">
                    <div className="text-xl md:text-2xl text-[#26c6da] font-bold tracking-wider">{time}</div>
                    <div className="text-[10px] md:text-xs opacity-60 tracking-wider">HORA ARG</div>
                </div>
                <div className="flex flex-col items-center md:items-end">
                    <div className="text-xl md:text-2xl text-[#26c6da] font-bold tracking-wider">ONLINE</div>
                    <div className="text-[10px] md:text-xs opacity-60 tracking-wider">ESTADO OPERATIVO</div>
                </div>
            </div>
        </header>
    );
};

export default Header;