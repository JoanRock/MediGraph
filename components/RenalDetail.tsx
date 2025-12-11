import React from 'react';
import { HealthMetric } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface RenalDetailProps {
  data: HealthMetric['details'];
}

export const RenalDetail: React.FC<RenalDetailProps> = ({ data }) => {
  if (!data) return null;

  // Simple gauge data
  const gaugeData = [
    { name: 'Value', value: 98, color: '#0ea5e9' }, // sky-500
    { name: 'Remaining', value: 2, color: '#f1f5f9' }, // slate-100
  ];

  return (
    <div className="mt-4 animate-fade-in">
        <div className="flex flex-row items-center justify-between gap-4">
            {/* Gauge */}
            <div className="relative w-1/2 h-32">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={gaugeData}
                            cx="50%"
                            cy="100%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={45}
                            outerRadius={60}
                            paddingAngle={0}
                            dataKey="value"
                            stroke="none"
                        >
                            <Cell key="cell-0" fill={gaugeData[0].color} />
                            <Cell key="cell-1" fill={gaugeData[1].color} />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute bottom-0 left-0 w-full text-center mb-[-5px]">
                     <span className="text-2xl font-bold text-gray-800">98%</span>
                     <p className="text-[10px] text-gray-400 uppercase font-bold">Funció (eGFR)</p>
                     <p className="text-[10px] text-sky-600 font-medium">Ref: &gt; 90</p>
                </div>
            </div>

            {/* Creatinine Stat */}
            <div className="w-1/2 flex flex-col justify-center space-y-4">
                <div className="bg-sky-50 p-3 rounded-xl border border-sky-100">
                    <p className="text-xs text-sky-600 font-semibold uppercase">Creatinina</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{data.creatinine}</p>
                    <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-gray-400">µM</p>
                        <p className="text-[10px] text-sky-600 font-medium">Ref: 28-59</p>
                    </div>
                </div>
            </div>
        </div>
        
        <p className="mt-6 text-xs text-gray-400 text-center leading-relaxed">
            La creatinina està dins dels rangs normals (28-59 µM), indicant una funció renal correcta.
        </p>
    </div>
  );
};