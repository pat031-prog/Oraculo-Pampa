
import React, { useState, useEffect } from 'react';

const BackgroundEffects: React.FC = () => {
    // FIX: Changed JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
    const [particles, setParticles] = useState<React.ReactElement[]>([]);

    useEffect(() => {
        const createParticles = () => {
            const particleCount = 40;
            const newParticles = Array.from({ length: particleCount }).map((_, i) => {
                const size = Math.random() * 2 + 1;
                const colorChoice = Math.random();
                const color = colorChoice > 0.6 ? '#00ff88' : colorChoice > 0.3 ? '#00d9ff' : '#ffcc00';
                const style = {
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${Math.random() * 100}vw`,
                    animationDuration: `${Math.random() * 20 + 15}s`,
                    animationDelay: `${Math.random() * 10}s`,
                    backgroundColor: color,
                    boxShadow: `0 0 ${size * 3}px ${color}`,
                };
                return <div key={i} className="absolute rounded-sm opacity-0 animate-[rise_20s_infinite_linear]" style={style}></div>;
            });
            setParticles(newParticles);
        };
        
        // Keyframes for animation need to be defined in a global scope, so we use tailwind.config.js or a style tag.
        // For this single-file setup, we rely on a custom tailwind config that would include this:
        /*
        theme: {
          extend: {
            keyframes: {
              rise: {
                '0%': { transform: 'translateY(100vh) scale(0.5)', opacity: '0.5' },
                '50%': { opacity: '1' },
                '100%': { transform: 'translateY(-10vh) scale(1.2)', opacity: '0' },
              },
              scan: {
                 from: { 'background-position-y': '0' },
                 to: { 'background-position-y': '100px' },
              }
            }
          }
        }
        */
        createParticles();
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
            <div className="absolute w-full h-full">{particles}</div>
            <div className="absolute w-full h-full bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_3px] animate-[scan_10s_linear_infinite]"></div>
        </div>
    );
};

export default BackgroundEffects;
