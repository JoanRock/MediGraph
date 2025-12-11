
export type HealthStatus = 'good' | 'alert' | 'neutral';

export interface HealthMetric {
  id: string;
  title: string;
  iconName: string; // Mapping string to Lucide icon
  status: HealthStatus;
  summary?: string;
  // Flexible details structure to accommodate different visualization requirements
  details?: {
    // Cardio
    cholesterolTotal?: number;
    ldlCholesterol?: number;
    hdlCholesterol?: number;
    triglycerides?: number;
    ldlParticles?: number;
    ldlSize?: number;
    lipidDist?: { name: string; value: number; color: string }[];
    
    // Inflammation
    glycA?: number;
    glycB?: number;
    inflammationScore?: number; // Kept for backward compat or derived

    // Energy
    glucose?: number;
    lactate?: number;
    ketones?: number; // 3-HB
    acetone?: number;
    tyrosine?: number;
    alanine?: number;
    glucoseTrend?: { time: string; value: number }[];

    // Muscle
    valine?: number;
    leucine?: number;
    isoleucine?: number;
    glutamine?: number;
    glutamate?: number;
    creatine?: number; // Muscle creatine
    proteinSynthesis?: number;

    // Renal
    creatinine?: number; // Renal creatinine
    gfr?: number;
  };
}

export interface AISummaryResponse {
  summaryText: string;
}
