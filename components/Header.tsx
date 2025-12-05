
import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
    const [logoText, setLogoText] = useState('');
    const [time, setTime] = useState('--:--:--');
    const fullLogoText = "ORÁCULO PAMPA";

    useEffect(() => {
        let i = 0;
        const typeWriterInterval = setInterval(() => {
            if (i < fullLogoText.length) {
                // Use Array.from to properly handle Unicode characters
                const chars = Array.from(fullLogoText);
                setLogoText(chars.slice(0, i + 1).join(''));
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
        <header className="col-span-full flex flex-col sm:flex-row justify-between items-center px-3 sm:px-6 py-3 sm:py-4 bg-[rgba(10,30,50,0.85)] border-2 border-[rgba(0,255,136,0.4)] backdrop-blur-md rounded-sm shadow-[0_0_20px_rgba(0,255,136,0.2)]">
            <div className="font-['VT323'] text-2xl sm:text-4xl md:text-5xl text-[#00ff88] [text-shadow:0_0_12px_#00ff88,0_0_24px_#00ff88] mb-2 sm:mb-0">
                {logoText}<span className="animate-pulse">_</span>
            </div>
            <div className="flex gap-3 sm:gap-6 md:gap-8 text-center sm:text-right">
                <div className="border-l-2 border-[rgba(0,217,255,0.3)] pl-3 sm:pl-6 md:pl-8">
                    <div className="text-base sm:text-xl md:text-2xl font-bold text-[#00d9ff] [text-shadow:0_0_8px_#00d9ff]">{time}</div>
                    <div className="text-[0.6rem] sm:text-xs text-[#ffcc00] tracking-[0.1em] sm:tracking-[0.2em] font-semibold">HORA ARG</div>
                </div>
                <div className="border-l-2 border-[rgba(0,217,255,0.3)] pl-3 sm:pl-6 md:pl-8 hidden sm:block">
                    <div className="text-base sm:text-xl md:text-2xl font-bold text-[#00d9ff] [text-shadow:0_0_8px_#00d9ff]">173.2%</div>
                    <div className="text-[0.6rem] sm:text-xs text-[#ffcc00] tracking-[0.1em] sm:tracking-[0.2em] font-semibold">EFICIENCIA SHANNON</div>
                </div>
            </div>
        </header>
    );
};

export default Header;
