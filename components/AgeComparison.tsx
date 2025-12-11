import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Sparkles, ArrowDown, ArrowUp, Activity } from 'lucide-react';

interface AgeComparisonProps {
  chronologicalAge: number;
  metabolicAge: number;
}

export const AgeComparison: React.FC<AgeComparisonProps> = ({ chronologicalAge, metabolicAge }) => {
  
  const difference = metabolicAge - chronologicalAge;
  const isBetter = difference <= 0;
  
  // Colors based on status
  const mainColor = isBetter ? '#10b981' : '#f43f5e'; // emerald-500 or rose-500
  const lightColor = isBetter ? '#d1fae5' : '#ffe4e6'; // emerald-100 or rose-100

  // Data for the circular chart (Gauge style)
  // We assume a max scale of 100 for visual proportion
  const data = [
    { name: 'Age', value: metabolicAge, color: mainColor },
    { name: 'Remaining', value: 100 - metabolicAge, color: '#f3f4f6' }, // gray-100
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm mb-6 animate-fade-in relative overflow-hidden">
        {/* Background Decoration */}
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none ${isBetter ? 'bg-emerald-300' : 'bg-rose-300'}`}></div>

        <div className="flex items-center justify-between">
            {/* Left: Text Info */}
            <div className="flex flex-col z-10">
                <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Edat Metabòlica</span>
                </div>
                
                <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-bold tracking-tight ${isBetter ? 'text-emerald-900' : 'text-rose-900'}`}>
                        {Math.round(metabolicAge)}
                    </span>
                    <span className="text-sm text-gray-400 font-medium">anys</span>
                </div>

                <div className={`mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                    isBetter ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                }`}>
                    {isBetter ? <ArrowDown className="w-3 h-3 mr-1" /> : <ArrowUp className="w-3 h-3 mr-1" />}
                    {Math.abs(Math.round(difference))} anys {isBetter ? 'més jove' : 'més gran'}
                </div>
                
                <p className="text-[11px] text-gray-400 mt-2 font-medium">
                    Vs. Edat Cronològica: <span className="text-gray-600">{chronologicalAge}</span>
                </p>
            </div>

            {/* Right: Circular Chart */}
            <div className="relative w-28 h-28 z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={38}
                            outerRadius={48}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={10}
                        >
                            <Cell key="cell-0" fill={data[0].color} />
                            <Cell key="cell-1" fill={data[1].color} />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Icon */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className={`p-2 rounded-full ${lightColor}`}>
                        <Sparkles className={`w-5 h-5 ${isBetter ? 'text-emerald-600' : 'text-rose-500'}`} />
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};