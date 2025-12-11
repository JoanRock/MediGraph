import React from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { BatteryMedium, Zap, Activity } from 'lucide-react';
import { HealthMetric } from '../types';

interface EnergyDetailProps {
  data: HealthMetric['details'];
}

export const EnergyDetail: React.FC<EnergyDetailProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="mt-4 animate-fade-in">
      {/* Glucose Trend Graph */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2 px-1">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Glucosa</h4>
            <div className="text-right">
                <span className="text-lg font-bold text-gray-800 block leading-none">{data.glucose} <span className="text-xs font-normal text-gray-400">mg/dL</span></span>
                <span className="text-[10px] text-emerald-600 font-medium">Ref: 67 - 100</span>
            </div>
        </div>
        {data.glucoseTrend && (
            <div className="h-24 w-full bg-white rounded-xl border border-gray-100 p-2 shadow-sm">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.glucoseTrend}>
                <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', fontSize: '12px' }}
                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                />
                <XAxis dataKey="time" hide />
                <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                />
                </AreaChart>
            </ResponsiveContainer>
            </div>
        )}
      </div>

      {/* Metabolic Markers Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
         <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
            <div className="flex items-center gap-2 mb-1">
                <Activity className="w-3 h-3 text-purple-500" />
                <p className="text-xs text-purple-700 font-medium">Cetones (3-HB)</p>
            </div>
            <p className="text-lg font-bold text-gray-800">{data.ketones}</p>
            <p className="text-[10px] text-gray-400">µM</p>
         </div>
         <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 relative">
            <div className="flex items-center gap-2 mb-1">
                <Zap className="w-3 h-3 text-amber-500" />
                <p className="text-xs text-amber-700 font-medium">Lactat</p>
            </div>
            <p className="text-lg font-bold text-gray-800">{data.lactate}</p>
            <div className="flex justify-between items-end">
                <p className="text-[10px] text-gray-400">µM</p>
                <p className="text-[10px] text-amber-600 font-medium">&lt; 550</p>
            </div>
         </div>
      </div>

      {/* Amino Acids for Energy */}
      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Aminoàcids Energètics</h4>
      <div className="grid grid-cols-2 gap-3">
         <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Tirosina</p>
            <p className="text-base font-bold text-gray-800">{data.tyrosine} <span className="text-[10px] font-normal text-gray-400">µM</span></p>
         </div>
         <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Alanina</p>
            <p className="text-base font-bold text-gray-800">{data.alanine} <span className="text-[10px] font-normal text-gray-400">µM</span></p>
         </div>
      </div>

    </div>
  );
};