
import React, { useState, useEffect } from 'react';
import Panel from '../ui/Panel';
import Spinner from '../ui/Spinner';
import { generateContent } from '../../services/geminiService';
import { ModalTopic } from '../../types';

// Declare Recharts components to be dynamically loaded from window
declare const window: any;
let PieChart: any, Pie: any, Cell: any, RechartsTooltip: any, Legend: any, ResponsiveContainer: any;

const PBI_DATA = [
    { name: 'Comercio', value: 17.5 },
    { name: 'Industria', value: 16 },
    { name: 'Inmobiliario', value: 10 },
    { name: 'Agro', value: 7 },
    { name: 'Transporte', value: 7.5 },
    { name: 'Otros', value: 42 },
];
const DEUDA_DATA = [
    { name: 'Buenos Aires', value: 51.2 },
    { name: 'Córdoba', value: 9 },
    { name: 'CABA', value: 8 },
    { name: 'Otras', value: 31.8 },
];
const COLORS = ['#f0abfc', '#26c6da', '#ffee58', '#66bb6a', '#ef5350', '#7e57c2'];

interface IndicadoresSectionProps {
    onOpenModal: (topic: ModalTopic) => void;
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[rgba(13,5,28,0.9)] p-3 border border-[#26c6da] rounded-md shadow-lg text-sm">
                <p className="font-bold text-[#26c6da]">{`${payload[0].name}`}</p>
                <p className="text-white">{`Porcentaje: ${payload[0].value}%`}</p>
            </div>
        );
    }
    return null;
};


const IndicadoresSection: React.FC<IndicadoresSectionProps> = ({ onOpenModal }) => {
    const [demographics, setDemographics] = useState<string>('');
    const [rechartsLoadStatus, setRechartsLoadStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

    useEffect(() => {
        let checkCount = 0;
        const maxChecks = 50; // 5 seconds timeout
        
        const interval = setInterval(() => {
            checkCount++;
            if (window.Recharts) {
                ({ PieChart, Pie, Cell, Tooltip: RechartsTooltip, Legend, ResponsiveContainer } = window.Recharts);
                setRechartsLoadStatus('loaded');
                clearInterval(interval);
            } else if (checkCount >= maxChecks) {
                setRechartsLoadStatus('error');
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchDemographics = async () => {
            const prompt = `Como Oráculo Pampa, genera una tabla en formato markdown con proyecciones demográficas para Argentina y 3 provincias clave (Buenos Aires, Córdoba, Santa Fe) para los años 2030 y 2040. Incluye la población total y el porcentaje de mayores de 65 años. No incluyas explicaciones, solo la tabla.`;
            try {
                const markdownTable = await generateContent(prompt);
                
                const rows = markdownTable.trim().split('\n').filter(row => row.includes('|'));
                const headerCells = rows[0].split('|').map(h => h.trim()).filter(Boolean);
                const header = `<thead><tr class="border-b border-[rgba(240,171,252,0.15)]">${headerCells.map(h => `<th>${h}</th>`).join('')}</tr></thead>`;
                
                const bodyRows = rows.slice(2);
                const body = `<tbody>${bodyRows.map(row => {
                    const cells = row.split('|').map(c => c.trim()).filter(Boolean);
                    return `<tr>${cells.map(c => `<td>${c}</td>`).join('')}</tr>`
                }).join('')}</tbody>`;

                setDemographics(`<table class="w-full text-left text-sm">${header}${body}</table>`);

            } catch (error) {
                setDemographics('<p class="text-[#ef5350]">Error al cargar datos demográficos.</p>');
            }
        };
        fetchDemographics();
    }, []);

    const renderCharts = () => {
        if (rechartsLoadStatus === 'loading') {
            return <div className="text-center"><p>Loading charting library...</p><Spinner /></div>;
        }
        if (rechartsLoadStatus === 'error') {
            return <div className="text-center text-red-500"><p>Error: Could not load the charting library. Please check your network connection and refresh.</p></div>;
        }
        return (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <Panel>
                    <h3 className="text-xl text-[#26c6da] mb-4 font-['VT323']">Composición del PBI (Estimado)</h3>
                    <div className="h-72 cursor-pointer" onClick={() => onOpenModal('pbi')}>
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={PBI_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                                    {PBI_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(240, 171, 252, 0.1)' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Panel>
                <Panel>
                    <h3 className="text-xl text-[#26c6da] mb-4 font-['VT323']">Deuda Provincial (% del Total)</h3>
                    <div className="h-72 cursor-pointer" onClick={() => onOpenModal('deuda')}>
                       <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={DEUDA_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#82ca9d" paddingAngle={5}>
                                    {DEUDA_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(240, 171, 252, 0.1)' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Panel>
            </div>
        );
    }

    return (
        <div className="animate-[fadeIn_0.6s_ease-out]">
            <h2 className="font-['VT323'] text-4xl text-[#f0abfc] mb-6 pb-2">Indicadores Clave</h2>
            {renderCharts()}
            <Panel className="mt-5">
                <h3 className="text-xl text-[#26c6da] mb-4 font-['VT323']">Proyecciones Demográficas</h3>
                {demographics ? <div dangerouslySetInnerHTML={{ __html: demographics }} /> : <Spinner />}
            </Panel>
        </div>
    );
};

export default IndicadoresSection;
