
import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
    const [logoText, setLogoText] = useState('');
    const [time, setTime] = useState('--:--:--');
    const fullLogoText = "ORÁCULO PAMPA";

    useEffect(() => {
        let i = 0;
        const typeWriterInterval = setInterval(() => {
            if (i < fullLogoText.length) {
                setLogoText(prev => prev + fullLogoText.charAt(i));
                i++;
            } else {
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
        <header className="col-span-full flex justify-between items-center px-6 bg-[rgba(22,11,47,0.75)] border border-[rgba(240,171,252,0.2)] backdrop-blur-md rounded-lg">
            <div className="font-['VT323'] text-5xl text-[#f0abfc] [text-shadow:0_0_8px_var(--color-glow-primary)]">
                {logoText}<span className="animate-ping">_</span>
            </div>
            <div className="flex gap-8 text-right">
                <div>
                    <div className="text-2xl text-[#26c6da]">{time}</div>
                    <div className="text-xs opacity-60 tracking-wider">HORA ARG</div>
                </div>
                <div>
                    <div className="text-2xl text-[#26c6da]">173.2%</div>
                    <div className="text-xs opacity-60 tracking-wider">EFICIENCIA SHANNON</div>
                </div>
            </div>
        </header>
    );
};

export default Header;
