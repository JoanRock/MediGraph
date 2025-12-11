import React from 'react';
import { X, Save, Activity, User, Heart, Flame, Zap, BicepsFlexed, Droplets, Lock } from 'lucide-react';
import { HealthMetric, HealthStatus } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  age: number;
  onUpdateAge: (age: number) => void;
  metrics: HealthMetric[];
  onUpdateMetric: (id: string, updates: Partial<HealthMetric>) => void;
  onUpdateDetail: (id: string, detailKey: string, value: number) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  age, 
  onUpdateAge, 
  metrics, 
  onUpdateMetric,
  onUpdateDetail
}) => {
  if (!isOpen) return null;

  const getMetricIcon = (name: string) => {
    switch(name) {
      case 'Heart': return <Heart className="w-4 h-4 text-gray-500" />;
      case 'Flame': return <Flame className="w-4 h-4 text-gray-500" />;
      case 'Zap': return <Zap className="w-4 h-4 text-gray-500" />;
      case 'BicepsFlexed': return <BicepsFlexed className="w-4 h-4 text-gray-500" />;
      case 'Droplets': return <Droplets className="w-4 h-4 text-gray-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getDetailFields = (metricId: string) => {
    switch(metricId) {
      case 'cardio': return [
        { label: 'Colesterol Total (mg/dL)', key: 'cholesterolTotal', range: '< 200' },
        { label: 'Colesterol LDL (mg/dL)', key: 'ldlCholesterol', range: '< 116' },
        { label: 'Colesterol HDL (mg/dL)', key: 'hdlCholesterol', range: '> 40' },
        { label: 'Triglicèrids (mg/dL)', key: 'triglycerides', range: '< 150' },
        { label: 'Partícules LDL (nmol/L)', key: 'ldlParticles', range: '< 1150' },
        { label: 'Mida LDL (nm)', key: 'ldlSize', range: '> 20.91' },
      ];
      case 'inflammation': return [
        { label: 'Glyc-A (µM)', key: 'glycA', range: '< 650' },
        { label: 'Glyc-B (µM)', key: 'glycB', range: '< 340' },
      ];
      case 'energy': return [
        { label: 'Glucosa (mg/dL)', key: 'glucose', range: '67 - 100' },
        { label: 'Lactat (µM)', key: 'lactate', range: '< 550' },
        { label: 'Cetones 3-HB (µM)', key: 'ketones', range: '< 100' },
        { label: 'Acetona (µM)', key: 'acetone', range: '-' },
        { label: 'Tirosina (µM)', key: 'tyrosine', range: '-' },
        { label: 'Alanina (µM)', key: 'alanine', range: '-' },
      ];
      case 'muscle': return [
        { label: 'Valina (µM)', key: 'valine', range: '125 - 205' },
        { label: 'Leucina (µM)', key: 'leucine', range: '72 - 127' },
        { label: 'Isoleucina (µM)', key: 'isoleucine', range: '20 - 51' },
        { label: 'Glutamina (µM)', key: 'glutamine', range: '400 - 900' },
        { label: 'Glutamat (µM)', key: 'glutamate', range: '20 - 150' },
        { label: 'Creatina (µM)', key: 'creatine', range: '20 - 150' },
      ];
      case 'renal': return [
        { label: 'Creatinina (µM)', key: 'creatinine', range: '28 - 59' },
        { label: 'eGFR (mL/min)', key: 'gfr', range: '> 90' },
      ];
      default: return [];
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">Configuració</h2>
          <button 
            onClick={onClose}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
          
          {/* User Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-blue-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Perfil d'Usuari</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
               <label className="block text-sm font-medium text-gray-700 mb-2">Edat Cronològica</label>
               <input 
                 type="number" 
                 value={age}
                 min="18"
                 onChange={(e) => onUpdateAge(Number(e.target.value))}
                 className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
               />
               <p className="mt-2 text-xs text-gray-500">Mínim 18 anys. S'utilitza per calcular l'edat metabòlica relativa.</p>
            </div>
          </section>

          {/* Metrics Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-purple-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Paràmetres Clínics</h3>
            </div>
            
            <div className="space-y-4">
              {metrics.map(metric => {
                const detailFields = getDetailFields(metric.id);

                return (
                  <div key={metric.id} className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getMetricIcon(metric.iconName)}
                      </div>
                      <span className="font-semibold text-gray-800">{metric.title}</span>
                    </div>

                    {/* Status Display (ReadOnly) */}
                    <div className="mb-4">
                        <div className="flex items-center gap-1 mb-1">
                             <label className="block text-xs font-medium text-gray-500">Estat (Auto)</label>
                             <Lock className="w-3 h-3 text-gray-300" />
                        </div>
                        <div className={`px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 border ${
                            metric.status === 'good' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            metric.status === 'alert' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                            'bg-gray-50 text-gray-600 border-gray-100'
                        }`}>
                             <div className={`w-2 h-2 rounded-full ${
                                 metric.status === 'good' ? 'bg-emerald-500' :
                                 metric.status === 'alert' ? 'bg-rose-500' :
                                 'bg-gray-400'
                             }`}></div>
                             {metric.status === 'good' ? 'Òptim' : metric.status === 'alert' ? 'Alerta' : 'Estable'}
                        </div>
                    </div>

                    {/* Detail Inputs Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {detailFields.map(field => {
                         // Safely access value with fallback to 0 to avoid controlled/uncontrolled warning
                         const detailValue = metric.details ? ((metric.details as any)[field.key] ?? 0) : 0;
                         return (
                            <div key={field.key}>
                               <div className="flex justify-between items-baseline mb-1">
                                    <label className="block text-xs font-medium text-gray-500 truncate" title={field.label}>
                                        {field.label}
                                    </label>
                               </div>
                               <input 
                                  type="number"
                                  value={detailValue}
                                  onChange={(e) => onUpdateDetail(metric.id, field.key, Number(e.target.value))}
                                  className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                               />
                               {field.range && (
                                   <div className="mt-1 text-[10px] text-gray-400 font-medium text-right">
                                       Ref: <span className="text-gray-500">{field.range}</span>
                                   </div>
                               )}
                            </div>
                         );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
           <button 
             onClick={onClose}
             className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium text-sm shadow-lg shadow-gray-200"
           >
             <Save className="w-4 h-4" />
             Desar i Tancar
           </button>
        </div>

      </div>
    </div>
  );
};