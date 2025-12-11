import React from 'react';
import { Flame } from 'lucide-react';
import { HealthMetric } from '../types';

interface InflammationDetailProps {
  data: HealthMetric['details'];
}

export const InflammationDetail: React.FC<InflammationDetailProps> = ({ data }) => {
  if (!data) return null;

  const score = data.inflammationScore || 0; // 0 to 100

  // Calculate thermometer position (0% to 100%)
  const position = Math.min(Math.max(score, 0), 100);

  return (
    <div className="mt-4 animate-fade-in px-1">
      <div className="flex items-center justify-center mb-6 relative">
          {/* Thermometer Track */}
          <div className="w-full h-6 bg-gradient-to-r from-green-300 via-yellow-300 to-red-400 rounded-full relative shadow-inner">
             {/* Indicator */}
             <div 
                className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white border-4 border-white rounded-full shadow-lg transition-all duration-1000 ease-out flex items-center justify-center"
                style={{ left: `calc(${position}% - 16px)` }}
             >
                <div className={`w-3 h-3 rounded-full ${position > 50 ? 'bg-red-500' : 'bg-green-500'}`}></div>
             </div>
          </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-red-50 rounded-2xl p-4 border border-red-100 flex flex-col items-center relative overflow-hidden">
           <div className="flex items-center gap-2 mb-2 z-10">
             <Flame className="w-4 h-4 text-red-500" />
             <span className="text-xs font-semibold text-red-800 uppercase">Glyc-A</span>
           </div>
           <span className="text-2xl font-bold text-gray-800 z-10">{data.glycA}</span>
           <span className="text-xs text-gray-400 z-10">µmol/L</span>
           <div className="mt-2 text-[10px] text-red-600 font-medium bg-red-100/50 px-2 py-1 rounded-full z-10">
             Max: 650
           </div>
        </div>
        <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 flex flex-col items-center relative overflow-hidden">
           <div className="flex items-center gap-2 mb-2 z-10">
             <Flame className="w-4 h-4 text-orange-500" />
             <span className="text-xs font-semibold text-orange-800 uppercase">Glyc-B</span>
           </div>
           <span className="text-2xl font-bold text-gray-800 z-10">{data.glycB}</span>
           <span className="text-xs text-gray-400 z-10">µmol/L</span>
           <div className="mt-2 text-[10px] text-orange-600 font-medium bg-orange-100/50 px-2 py-1 rounded-full z-10">
             Max: 340
           </div>
        </div>
      </div>
      
      <p className="mt-4 text-xs text-center text-gray-500">
        Els marcadors Glyc-A i Glyc-B indiquen inflamació sistèmica quan superen els màxims.
      </p>
    </div>
  );
};