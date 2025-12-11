import React, { useState, useMemo } from 'react';
import { HealthCard } from './components/HealthCard';
import { AISummary } from './components/AISummary';
import { SettingsModal } from './components/SettingsModal';
import { AgeComparison } from './components/AgeComparison';
import { HealthMetric, HealthStatus } from './types';
import { User } from 'lucide-react';

const INITIAL_DATA: HealthMetric[] = [
  {
    id: 'cardio',
    title: 'Salut Cardiovascular',
    iconName: 'Heart',
    status: 'alert',
    details: {
      cholesterolTotal: 201, // > 200
      ldlCholesterol: 126,   // > 116
      hdlCholesterol: 62,
      triglycerides: 58,
      ldlParticles: 1293,    // > 1150
      ldlSize: 20.81,        // < 20.91
      lipidDist: [
        { name: 'VLDL', value: 20, color: '#34d399' },
        { name: 'LDL', value: 60, color: '#f87171' },
        { name: 'HDL', value: 20, color: '#fbbf24' },
      ]
    }
  },
  {
    id: 'inflammation',
    title: 'Inflamació',
    iconName: 'Flame',
    status: 'good',
    details: {
      glycA: 526, // < 650
      glycB: 304, // < 340
      inflammationScore: 15 // Low risk inferred
    }
  },
  {
    id: 'energy',
    title: 'Metabolisme Energètic',
    iconName: 'Zap',
    status: 'good',
    details: {
      glucose: 98,    // 67-100
      lactate: 202,   // < 550
      ketones: 37,    // 3-HB (µM)
      acetone: 18,    // (µM)
      tyrosine: 40,
      alanine: 351,
      glucoseTrend: [
        { time: '10:00', value: 95 },
        { time: '10:30', value: 97 },
        { time: '11:00', value: 102 },
        { time: '11:30', value: 98 },
        { time: '12:00', value: 96 },
        { time: '12:30', value: 98 },
        { time: '13:00', value: 97 },
        { time: '13:30', value: 98 },
      ]
    }
  },
  {
    id: 'muscle',
    title: 'Massa Muscular',
    iconName: 'BicepsFlexed',
    status: 'alert',
    details: {
      valine: 218,     // > 205 (High)
      leucine: 116,
      isoleucine: 41,
      glutamine: 405,
      glutamate: 124,
      creatine: 70,    // Muscle Creatine
      proteinSynthesis: 75
    }
  },
  {
    id: 'renal',
    title: 'Funció Renal',
    iconName: 'Droplets',
    status: 'good',
    details: {
      creatinine: 45, // µM
      gfr: 98 // Inferred normal
    }
  },
];

// Helper to determine status based on PDF reference ranges
const calculateStatus = (id: string, details: HealthMetric['details']): HealthStatus => {
  if (!details) return 'neutral';

  switch (id) {
    case 'cardio':
      // Alert conditions from MetBalance/Liposcale PDF
      // Colesterol Total > 200
      if ((details.cholesterolTotal ?? 0) > 200) return 'alert';
      // LDL Colesterol > 116
      if ((details.ldlCholesterol ?? 0) > 116) return 'alert';
      // HDL Colesterol < 40 (Missing in previous version)
      if ((details.hdlCholesterol ?? 100) < 40) return 'alert';
      // Triglycerides > 150 (Missing in previous version)
      if ((details.triglycerides ?? 0) > 150) return 'alert';
      // LDL Particles > 1150
      if ((details.ldlParticles ?? 0) > 1150) return 'alert';
      
      // LDL Size: < 20.91 is Alert (Small/Dense Pattern B). 
      // STRICT CHECK: 17.81 < 20.91 -> Alert.
      if ((details.ldlSize ?? 99) < 20.91) return 'alert';
      
      return 'good';

    case 'inflammation':
      // GlycA < 650, GlycB < 340
      if ((details.glycA ?? 0) > 650) return 'alert';
      if ((details.glycB ?? 0) > 340) return 'alert';
      return 'good';

    case 'energy':
      // Glucose 67-100
      const glu = details.glucose ?? 0;
      if (glu < 67 || glu > 100) return 'alert';
      // Lactate < 550
      if ((details.lactate ?? 0) > 550) return 'alert';
      // Ketones < 100 (Missing in previous version)
      if ((details.ketones ?? 0) > 100) return 'alert';
      return 'good';

    case 'muscle':
      // Valine 125-205, Leucine 72-127, Isoleucine 20-51
      if ((details.valine ?? 0) > 205 || (details.valine ?? 0) < 125) return 'alert';
      if ((details.leucine ?? 0) > 127 || (details.leucine ?? 0) < 72) return 'alert';
      if ((details.isoleucine ?? 0) > 51 || (details.isoleucine ?? 0) < 20) return 'alert';
      
      // Additional Amino Acids
      // Glutamine 400-900
      if ((details.glutamine ?? 0) > 900 || (details.glutamine ?? 0) < 400) return 'alert';
      // Glutamate 20-150
      if ((details.glutamate ?? 0) > 150 || (details.glutamate ?? 0) < 20) return 'alert';
      // Muscle Creatine 20-150
      if ((details.creatine ?? 0) > 150 || (details.creatine ?? 0) < 20) return 'alert';

      return 'good';

    case 'renal':
      // Creatinine 28-59 µM
      const creat = details.creatinine ?? 0;
      if (creat < 28 || creat > 59) return 'alert';
      
      // eGFR > 90 (Missing in previous version)
      if ((details.gfr ?? 100) < 90) return 'alert';
      return 'good';

    default:
      return 'neutral';
  }
};

const App: React.FC = () => {
  // Application State
  const [metrics, setMetrics] = useState<HealthMetric[]>(INITIAL_DATA);
  const [age, setAge] = useState<number>(40); 
  const [expandedId, setExpandedId] = useState<string | null>(null); // Start collapsed to show Age Card better
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Dynamic Metabolic Age Calculation based on biomedical risk factors
  // REVISED ALGORITHM: Uses a multiplier factor instead of additive years to scale with age.
  const metabolicAge = useMemo(() => {
    let bioAge = Math.max(18, age); // Ensure base calculation uses at least 18
    let agingFactor = 1.0; // Base rate (100%)

    metrics.forEach(m => {
      const d = m.details;
      if (!d) return;

      // 1. SALUT CARDIOVASCULAR
      if (m.id === 'cardio') {
        // LDL Particles: High density creates more vessel damage over time
        if ((d.ldlParticles || 0) > 1400) agingFactor += 0.04;      // +4% aging rate
        else if ((d.ldlParticles || 0) > 1150) agingFactor += 0.02; // +2%
        else if ((d.ldlParticles || 0) < 1000) agingFactor -= 0.02; // -2% (Protection)

        // Mida LDL (Patró B vs A)
        if ((d.ldlSize || 22) < 20.91) agingFactor += 0.04;         // +4%
        else if ((d.ldlSize || 22) > 21.5) agingFactor -= 0.01;     // -1%

        // Triglicèrids (Metabolic efficiency)
        if ((d.triglycerides || 0) > 150) agingFactor += 0.02;
        else if ((d.triglycerides || 0) < 90) agingFactor -= 0.01;
      }

      // 2. INFLAMACIÓ (Inflammaging)
      if (m.id === 'inflammation') {
        const glycA = d.glycA || 0;
        if (glycA > 600) agingFactor += 0.05;      // +5% (Severe inflammation)
        else if (glycA > 450) agingFactor += 0.02; // +2%
        else if (glycA < 380) agingFactor -= 0.03; // -3% (Anti-inflammatory state)
      }

      // 3. METABOLISME ENERGÈTIC
      if (m.id === 'energy') {
        const gl = d.glucose || 0;
        if (gl > 105) agingFactor += 0.04;         // +4% (Glycation damage)
        else if (gl > 95) agingFactor += 0.02;     // +2%
        else if (gl < 90 && gl > 70) agingFactor -= 0.02; 

        // Lactat (Mitochondrial stress)
        if ((d.lactate || 0) > 550) agingFactor += 0.01;
      }

      // 4. MASSA MUSCULAR
      if (m.id === 'muscle') {
        const leu = d.leucine || 0;
        if (leu < 75) agingFactor += 0.03;         // +3% (Frailty risk)
        else if (leu > 110) agingFactor -= 0.03;   // -3% (Robustness)
      }

      // 5. FUNCIÓ RENAL
      if (m.id === 'renal') {
        const gfr = d.gfr || 100;
        if (gfr < 75) agingFactor += 0.04;
        else if (gfr > 95) agingFactor -= 0.01;
      }
    });

    // Apply factor
    let finalAge = bioAge * agingFactor;
    
    // Safety caps
    return Math.max(18, Math.round(finalAge * 10) / 10);
  }, [age, metrics]);

  // Handlers
  const handleToggle = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const handleUpdateMetric = (id: string, updates: Partial<HealthMetric>) => {
    setMetrics(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const handleUpdateDetail = (id: string, detailKey: string, value: number) => {
    setMetrics(prev => prev.map(m => {
      if (m.id === id && m.details) {
        const newDetails = {
          ...m.details,
          [detailKey]: value
        };
        const newStatus = calculateStatus(id, newDetails);
        
        return {
          ...m,
          details: newDetails,
          status: newStatus
        };
      }
      return m;
    }));
  };

  const handleUpdateAge = (newAge: number) => {
    // Enforce min age 18 in state, though input also has min attribute
    setAge(Math.max(18, newAge));
  };

  const activeMetric = metrics.find(m => m.id === expandedId) || null;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans selection:bg-purple-100">
      
      {/* Header */}
      <header className="fixed top-0 w-full z-40 bg-[#FAFAFA]/90 backdrop-blur-md px-6 py-4 border-b border-gray-100/50 shadow-sm">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <div className="flex items-center gap-3">
             {/* Custom Logo representing Heart + EKG */}
             <div className="relative w-11 h-11 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Heart Base */}
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-800 mb-1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                {/* Pulse Line Overlay */}
                <svg viewBox="0 0 24 24" className="w-10 h-10 text-rose-500 absolute top-1 left-0 opacity-90" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
             </div>
             
             <div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-tight">MediGraph</h1>
                <p className="text-xs text-gray-500 font-medium">La teva salut, la teva tranquilitat</p>
             </div>
          </div>
          
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
            aria-label="Open Settings"
          >
             <User className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-28 pb-48 px-4 max-w-md mx-auto">
        
        {/* Metabolic Age Card */}
        <AgeComparison chronologicalAge={age} metabolicAge={metabolicAge} />

        <div className="flex flex-col gap-3">
          {metrics.map((metric) => (
            <HealthCard
              key={metric.id}
              metric={metric}
              isExpanded={expandedId === metric.id}
              onToggle={() => handleToggle(metric.id)}
            />
          ))}
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        age={age}
        onUpdateAge={handleUpdateAge}
        metrics={metrics}
        onUpdateMetric={handleUpdateMetric}
        onUpdateDetail={handleUpdateDetail}
      />

      {/* Sticky AI Footer */}
      <div className="max-w-md mx-auto">
        <AISummary metrics={metrics} activeMetric={activeMetric} age={age} />
      </div>

    </div>
  );
};

export default App;