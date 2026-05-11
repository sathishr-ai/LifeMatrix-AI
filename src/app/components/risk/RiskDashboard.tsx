import { useNavigate } from 'react-router';
import { ArrowLeft, TrendingUp, AlertTriangle, Shield, ChevronRight, Activity, Clock, Zap } from 'lucide-react';
import { getStorageItem } from '../../utils/storage';

export function RiskDashboard() {
  const navigate = useNavigate();

  // 1. DATA ACQUISITION
  const lastSymptoms = JSON.parse(getStorageItem('selectedSymptoms', '[]'));
  const severityStr = getStorageItem('symptomSeverity', '5');
  const severity = parseInt(severityStr);
  const diseases = JSON.parse(getStorageItem('healthDiseases', '[]'));
  const smoking = getStorageItem('healthSmoking', 'Non-smoker');
  const sleep = getStorageItem('healthSleep', '7-8 hours');
  const healthScore = parseInt(getStorageItem('user_health_score', '85'));

  // 2. DYNAMIC RISK CALCULATION (Exact Logic)
  let basePoints = 0;
  lastSymptoms.forEach((s: string) => {
    const sym = s.toLowerCase();
    // Critical & High Risk (30-40 pts)
    if (sym.includes('chest pain')) basePoints += 38;
    if (sym.includes('shortness of breath')) basePoints += 35;
    if (sym.includes('unconsciousness')) basePoints += 40;
    
    // Moderate to High (20-30 pts)
    if (sym.includes('fever')) basePoints += 25;
    if (sym.includes('vomiting')) basePoints += 22;
    if (sym.includes('dizziness')) basePoints += 20;
    if (sym.includes('stomach pain') || sym.includes('abdominal pain')) basePoints += 20;
    if (sym.includes('heart palpitations')) basePoints += 30;
    if (sym.includes('tightness')) basePoints += 25;
    
    // Moderate (10-20 pts)
    if (sym.includes('headache')) basePoints += 15;
    if (sym.includes('nausea')) basePoints += 18;
    if (sym.includes('cough')) basePoints += 16;
    if (sym.includes('sore throat')) basePoints += 12;
    if (sym.includes('fatigue')) basePoints += 14;
    if (sym.includes('muscle pain')) basePoints += 12;
    if (sym.includes('joint pain')) basePoints += 12;
    if (sym.includes('numbness')) basePoints += 15;
    if (sym.includes('swelling')) basePoints += 15;
    if (sym.includes('weakness')) basePoints += 15;
    if (sym.includes('vision blur')) basePoints += 15;
    if (sym.includes('ear pain')) basePoints += 10;
    if (sym.includes('weight loss')) basePoints += 18;
    if (sym.includes('insomnia')) basePoints += 10;
    
    // Low (5-10 pts)
    if (sym.includes('runny nose')) basePoints += 6;
    if (sym.includes('skin rash')) basePoints += 8;
    if (sym.includes('itchy eyes')) basePoints += 5;
    if (sym.includes('chills')) basePoints += 10;
    if (sym.includes('night sweats')) basePoints += 15;
  });

  // Calculate lifestyle risk factors
  let lifestyleRisk = 0;
  if (smoking === 'Smoker') lifestyleRisk += 15;
  if (diseases.length > 0) lifestyleRisk += 10 * diseases.length;
  if (sleep.includes('Less than 5')) lifestyleRisk += 12;
  if (sleep.includes('5-6 hours')) lifestyleRisk += 6;

  // Final Algorithm: Balance Biometrics + Symptoms
  let calculatedScore = 0;
  if (basePoints > 0) {
    calculatedScore = Math.round((basePoints + lifestyleRisk) * (1 + (severity - 5) * 0.12));
  } else {
    // If no symptoms, risk is inverse of health score + lifestyle factors
    calculatedScore = Math.max(100 - healthScore + lifestyleRisk, 8);
  }

  if (calculatedScore < 5) calculatedScore = 5;
  if (calculatedScore > 98) calculatedScore = 98;

  const riskScore = calculatedScore;

  const getRiskLevel = (score: number) => {
    if (score >= 70) return { label: 'High', color: 'text-rose-600', bg: 'bg-rose-50/50', border: 'border-rose-100', accent: 'text-rose-500', gradient: 'from-rose-500 to-rose-600' };
    if (score >= 40) return { label: 'Moderate', color: 'text-amber-600', bg: 'bg-amber-50/50', border: 'border-amber-100', accent: 'text-amber-500', gradient: 'from-amber-500 to-amber-600' };
    return { label: 'Low', color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100', accent: 'text-emerald-500', gradient: 'from-emerald-500 to-emerald-600' };
  };

  const risk = getRiskLevel(riskScore);

  // 3. DYNAMIC KEY FACTORS (Based on real user data)
  const factors = [];
  if (diseases.length > 0) {
    diseases.forEach((d: string) => factors.push(`Chronic Comorbidity: ${d}`));
  }
  if (smoking === 'Smoker') factors.push('Active Nicotine & Cardiovascular stress factor');
  if (sleep.includes('Less than 5')) factors.push('Severe Sleep Deprivation (< 5 hrs)');
  if (sleep.includes('5-6 hours')) factors.push('Sub-optimal sleep cycle (5-6 hrs)');
  if (lastSymptoms.length > 0) {
    lastSymptoms.forEach((s: string) => factors.push(`Active Symptom Strain: ${s}`));
  }
  if (factors.length === 0) {
    factors.push('Optimal lifestyle maintenance');
    factors.push('Low chronic biometric stress index');
  }

  return (
    <div className="size-full bg-background overflow-auto selection:bg-secondary/20">
      <div className="px-6 py-6 pb-28">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-3 rounded-2xl bg-white border border-border shadow-sm hover:bg-muted active:scale-95 transition-all">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-foreground tracking-tight">Risk <span className="text-secondary">Intelligence</span></h1>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Real-time Diagnostic Data</p>
              </div>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
            <Zap className="w-6 h-6 text-secondary" />
          </div>
        </div>

        {/* HERO GAUGE CARD - ULTRA-COMPACT & SLEEK */}
        <div className="bg-white rounded-[24px] p-4 mb-4 border border-border shadow-sm relative overflow-hidden">
          <div className="absolute -top-10 -right-10 opacity-5">
             <Activity className="w-48 h-48" />
          </div>
          
          <div className="text-center relative z-10">
            <p className="text-[11px] md:text-sm font-black text-muted-foreground uppercase tracking-[0.15em] mb-3">Aggregate Risk Assessment</p>
            
            <div className="relative inline-flex items-center justify-center w-32 h-32 mb-3">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="54"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-100"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="54"
                  stroke="url(#riskGradient)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 54}`}
                  strokeDashoffset={`${2 * Math.PI * 54 * (1 - riskScore / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-[1500ms] ease-out"
                />
                <defs>
                  <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" className={risk.accent} stopColor="currentColor" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col animate-fade-in">
                <span className="text-3xl font-black tracking-tighter text-indigo-950">{riskScore}</span>
                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Index Score</span>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border ${risk.border} ${risk.bg}`}>
                 <div className={`w-1.5 h-1.5 rounded-full ${risk.accent.replace('text-', 'bg-')} animate-pulse`}></div>
                 <h3 className={`text-[11px] md:text-xs font-black uppercase tracking-widest ${risk.color}`}>
                   {risk.label} Probability
                 </h3>
              </div>
            </div>
          </div>
        </div>

        {/* ANALYTICS GRID */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => navigate('/app/risk-breakdown')}
            className="group bg-white rounded-[32px] p-6 border border-border/60 hover:shadow-xl hover:border-secondary/20 transition-all text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity">
               <ChevronRight className="w-12 h-12" />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6 text-rose-500" />
            </div>
            <h3 className="text-sm font-black text-foreground tracking-tight mb-1">
              Risk Breakdown
            </h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Categorical Analysis</p>
          </button>

          <button
            onClick={() => navigate('/app/trend-analysis')}
            className="group bg-white rounded-[32px] p-6 border border-border/60 hover:shadow-xl hover:border-secondary/20 transition-all text-left relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity">
               <ChevronRight className="w-12 h-12" />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-sm font-black text-foreground tracking-tight mb-1">
              Trend Analysis
            </h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Chronological View</p>
          </button>
        </div>

        <button
          onClick={() => navigate('/app/future-prediction')}
          className="w-full group bg-indigo-950 rounded-[32px] p-6 border border-indigo-900 flex items-center justify-between hover:shadow-2xl hover:shadow-indigo-200 transition-all mb-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:rotate-12 transition-transform">
              <Shield className="w-6 h-6 text-indigo-300" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-black text-white tracking-tight">Future Predictions</h4>
              <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">AI-Engineered Forecasts</p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-indigo-300 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* DYNAMIC KEY FACTORS SECTION */}
        <div className="bg-white rounded-[40px] border border-border p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
             </div>
             <div>
               <h4 className="text-sm font-black text-foreground tracking-tight">Personal Risk Factors</h4>
               <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Based on your biometric profile</p>
             </div>
          </div>
          
          <div className="space-y-3">
            {factors.map((factor, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl border border-border/20 group hover:bg-white hover:border-orange-100 transition-all">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 group-hover:scale-150 transition-transform"></div>
                <span className="text-xs font-bold text-foreground/80 leading-tight">{factor}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-8 border-t border-border flex items-center justify-between">
             <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Last Diagnostic Sync</span>
             </div>
             <span className="text-[10px] font-black text-foreground uppercase tracking-widest">Just Now</span>
          </div>
        </div>
      </div>
    </div>
  );
}
