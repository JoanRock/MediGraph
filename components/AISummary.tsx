import React, { useEffect, useState, useRef } from 'react';
import { Bot, Sparkles, RefreshCw } from 'lucide-react';
import { HealthMetric } from '../types';
import { generateHealthSummary, generateCategorySummary } from '../services/geminiService';

interface AISummaryProps {
  metrics: HealthMetric[];
  activeMetric: HealthMetric | null;
  age: number;
}

export const AISummary: React.FC<AISummaryProps> = ({ metrics, activeMetric, age }) => {
  const [displayText, setDisplayText] = useState<string>("Inicialitzant l'anàlisi de salut...");
  const [loading, setLoading] = useState<boolean>(true);
  
  // Cache summaries to avoid refetching unnecessarily, key by metric ID + age (simple cache strategy)
  // We use a ref to store cache to persist across re-renders without triggering effects
  const summaryCache = useRef<Record<string, string>>({});
  
  // Debounce ref to prevent rapid firing during slider changes
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const updateSummary = async () => {
      setLoading(true);
      
      // Determine context
      const contextKey = activeMetric ? `${activeMetric.id}_${age}` : `overall_${age}_${metrics.map(m=>m.status).join('')}`;

      // Check cache (optional, but good for performance if switching tabs back and forth)
      if (summaryCache.current[contextKey]) {
        setDisplayText(summaryCache.current[contextKey]);
        setLoading(false);
        return;
      }

      if (activeMetric) {
        setDisplayText(`Analitzant ${activeMetric.title} per a ${age} anys...`);
        const result = await generateCategorySummary(activeMetric, age);
        summaryCache.current[contextKey] = result;
        setDisplayText(result);
      } else {
        setDisplayText(`Generant resum global per a ${age} anys...`);
        const result = await generateHealthSummary(metrics, age);
        summaryCache.current[contextKey] = result;
        setDisplayText(result);
      }
      setLoading(false);
    };

    // Debounce the call to avoid API spam when sliding values
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
        updateSummary();
    }, 800); // 800ms delay

    return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [metrics, activeMetric, age]);

  return (
    <div className="fixed bottom-0 left-0 w-full p-4 z-50">
        <div className="relative overflow-hidden bg-white/95 backdrop-blur-xl border border-blue-100 rounded-[2rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] p-5">
            {/* Decorative background glow */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex gap-4">
                <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                        {loading ? (
                            <RefreshCw className="w-6 h-6 text-white animate-spin" />
                        ) : (
                            <Bot className="w-6 h-6 text-white" />
                        )}
                    </div>
                </div>
                
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-3 h-3 text-purple-500" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-purple-600">
                           {activeMetric ? `Informació IA: ${activeMetric.title}` : 'Resum Global IA'}
                        </h3>
                    </div>
                    <p className={`text-sm leading-relaxed text-gray-700 font-medium transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                        {displayText}
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};