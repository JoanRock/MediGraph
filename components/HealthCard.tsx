import React from 'react';
import { 
  Heart, 
  Flame, 
  Zap, 
  BicepsFlexed, 
  Droplets, 
  ChevronDown, 
  CheckCircle2,
  AlertCircle,
  Info
} from 'lucide-react';
import { HealthMetric } from '../types';
import { EnergyDetail } from './EnergyDetail';
import { CardioDetail } from './CardioDetail';
import { InflammationDetail } from './InflammationDetail';
import { MuscleDetail } from './MuscleDetail';
import { RenalDetail } from './RenalDetail';

interface HealthCardProps {
  metric: HealthMetric;
  isExpanded: boolean;
  onToggle: () => void;
}

const getIcon = (name: string, className: string) => {
  switch (name) {
    case 'Heart': return <Heart className={className} />;
    case 'Flame': return <Flame className={className} />;
    case 'Zap': return <Zap className={className} />;
    case 'BicepsFlexed': return <BicepsFlexed className={className} />;
    case 'Droplets': return <Droplets className={className} />;
    default: return <Heart className={className} />;
  }
};

export const HealthCard: React.FC<HealthCardProps> = ({ metric, isExpanded, onToggle }) => {
  
  // Status-based styling configuration
  const getStatusStyles = () => {
    switch (metric.status) {
      case 'good':
        return {
          container: "bg-emerald-50 border-emerald-200 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.2)]",
          iconBg: "bg-emerald-100",
          iconColor: "text-emerald-600",
          textColor: "text-emerald-900",
          indicatorIcon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
          badge: "bg-emerald-100 text-emerald-700"
        };
      case 'alert':
        return {
          container: "bg-rose-50 border-rose-200 shadow-[0_4px_20px_-4px_rgba(244,63,94,0.2)]",
          iconBg: "bg-rose-100",
          iconColor: "text-rose-600",
          textColor: "text-rose-900",
          indicatorIcon: <AlertCircle className="w-5 h-5 text-rose-500" />,
          badge: "bg-rose-100 text-rose-700"
        };
      default: // neutral
        // Using a distinct "Slate/Blue" theme instead of plain gray
        if (isExpanded) {
           return {
            container: "bg-white border-blue-200 shadow-xl shadow-blue-900/5 ring-1 ring-blue-100",
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600",
            textColor: "text-slate-900",
            indicatorIcon: <ChevronDown className="w-5 h-5 text-blue-400 rotate-180 transition-transform" />,
            badge: "bg-blue-50 text-blue-700"
          };
        }
        return {
          container: "bg-slate-50 border-slate-200 shadow-[0_4px_20px_-4px_rgba(71,85,105,0.1)]",
          iconBg: "bg-slate-200",
          iconColor: "text-slate-600",
          textColor: "text-slate-800",
          indicatorIcon: <Info className="w-5 h-5 text-slate-400" />,
          badge: "bg-slate-200 text-slate-600"
        };
    }
  };

  const styles = getStatusStyles();

  // Detail Content Factory
  const renderDetails = () => {
    if (!metric.details) return <div className="p-4 text-sm text-gray-400">No hi ha dades disponibles.</div>;

    switch (metric.id) {
        case 'cardio': return <CardioDetail data={metric.details} />;
        case 'inflammation': return <InflammationDetail data={metric.details} />;
        case 'energy': return <EnergyDetail data={metric.details} />;
        case 'muscle': return <MuscleDetail data={metric.details} />;
        case 'renal': return <RenalDetail data={metric.details} />;
        default: return null;
    }
  };

  return (
    <div 
      onClick={onToggle}
      className={`
        relative rounded-3xl border p-5 cursor-pointer transition-all duration-500 ease-in-out overflow-hidden
        ${styles.container}
        ${isExpanded ? 'scale-[1.02] z-10' : 'hover:scale-[1.01] active:scale-[0.99] z-0'}
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${styles.iconBg} transition-colors duration-300`}>
            {getIcon(metric.iconName, `w-6 h-6 ${styles.iconColor}`)}
          </div>
          <div>
            <h3 className={`text-base font-bold tracking-tight ${styles.textColor}`}>
              {metric.title}
            </h3>
            {/* Colored Badge for status/score */}
            {!isExpanded && (
               <div className={`mt-1.5 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles.badge}`}>
                 {metric.status === 'good' ? 'Òptim' : metric.status === 'alert' ? 'Acció Requerida' : 'Estable'}
               </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
            {/* Custom glowing dot for active statuses */}
            {metric.status === 'alert' && (
                <span className="relative flex h-3 w-3 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </span>
            )}
            {styles.indicatorIcon}
        </div>
      </div>

      {/* Expanded Content */}
      <div 
        className={`grid transition-[grid-template-rows] duration-500 ease-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden min-h-0">
             <div className="pt-2">
                {renderDetails()}
             </div>
        </div>
      </div>
    </div>
  );
};