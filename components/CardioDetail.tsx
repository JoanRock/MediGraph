import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { HealthMetric } from '../types';

interface CardioDetailProps {
  data: HealthMetric['details'];
}

export const CardioDetail: React.FC<CardioDetailProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="mt-4 animate-fade-in">
      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
             <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Colesterol Total</p>
             <p className="text-xl font-bold text-gray-800">{data.cholesterolTotal} <span className="text-xs font-normal text-gray-500">mg/dL</span></p>
             <p className="text-[10px] text-emerald-600 mt-1">Objectiu: &lt; 200</p>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
             <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Partícules LDL</p>
             <p className="text-xl font-bold text-gray-800">{data.ldlParticles} <span className="text-xs font-normal text-gray-500">nmol/L</span></p>
             <p className="text-[10px] text-emerald-600 mt-1">Objectiu: &lt; 1150</p>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
             <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">LDL Colesterol</p>
             <p className="text-xl font-bold text-gray-800">{data.ldlCholesterol} <span className="text-xs font-normal text-gray-500">mg/dL</span></p>
             <p className="text-[10px] text-emerald-600 mt-1">Objectiu: &lt; 116</p>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
             <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Mida Partícula</p>
             <p className="text-xl font-bold text-gray-800">{data.ldlSize} <span className="text-xs font-normal text-gray-500">nm</span></p>
             <p className="text-[10px] text-emerald-600 mt-1">Objectiu: &gt; 20.91</p>
          </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Distribució</h4>
        <div className="h-40 w-full">
          {data.lipidDist && (
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.lipidDist} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    width={70} 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                    {data.lipidDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Bar>
                </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="mt-2 text-center text-xs text-gray-400">
           Interpretació: Menys LDL-P i mida major és millor.
        </div>
      </div>
    </div>
  );
};