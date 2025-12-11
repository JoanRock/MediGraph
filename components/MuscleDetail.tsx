import React from 'react';
import { Dumbbell } from 'lucide-react';
import { HealthMetric } from '../types';

interface MuscleDetailProps {
  data: HealthMetric['details'];
}

export const MuscleDetail: React.FC<MuscleDetailProps> = ({ data }) => {
  if (!data) return null;

  const bcaas = [
    { label: 'Leucina', value: data.leucine || 0, max: 200, range: '72-127', color: 'bg-indigo-500' },
    { label: 'Isoleucina', value: data.isoleucine || 0, max: 100, range: '20-51', color: 'bg-indigo-400' },
    { label: 'Valina', value: data.valine || 0, max: 300, range: '125-205', color: 'bg-indigo-300' },
  ];

  return (
    <div className="mt-4 animate-fade-in">
       
       <div className="grid grid-cols-3 gap-2 mb-6">
           <div className="bg-indigo-50 p-2 rounded-xl border border-indigo-100 text-center">
               <p className="text-[10px] text-indigo-400 uppercase font-bold mb-1">Creatina</p>
               <p className="text-sm font-bold text-indigo-900">{data.creatine}</p>
               <p className="text-[10px] text-indigo-300">µM</p>
           </div>
           <div className="bg-indigo-50 p-2 rounded-xl border border-indigo-100 text-center">
               <p className="text-[10px] text-indigo-400 uppercase font-bold mb-1">Glutamina</p>
               <p className="text-sm font-bold text-indigo-900">{data.glutamine}</p>
               <p className="text-[10px] text-indigo-300">µM</p>
           </div>
           <div className="bg-indigo-50 p-2 rounded-xl border border-indigo-100 text-center">
               <p className="text-[10px] text-indigo-400 uppercase font-bold mb-1">Glutamat</p>
               <p className="text-sm font-bold text-indigo-900">{data.glutamate}</p>
               <p className="text-[10px] text-indigo-300">µM</p>
           </div>
       </div>

       {/* BCAA Bars */}
       <div className="space-y-4">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Perfil BCAA</h4>
          {bcaas.map((n) => (
              <div key={n.label}>
                  <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{n.label}</span>
                      <div className="text-right">
                          <span className="text-gray-900 font-bold mr-2">{n.value}</span>
                          <span className="text-[10px] text-gray-400">Ref: {n.range}</span>
                      </div>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${n.color}`} 
                        style={{ width: `${Math.min((n.value / n.max) * 100, 100)}%` }}
                      ></div>
                  </div>
              </div>
          ))}
       </div>
    </div>
  );
};