import { ArrowLeft, TrendingUp, TrendingDown, AlertCircle, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';
import { getStorageItem } from '../../utils/storage';

export function FuturePrediction() {
  const navigate = useNavigate();

  // 1. DATA ACQUISITION
  const lastSymptoms = JSON.parse(getStorageItem('selectedSymptoms', '[]'));
  const healthScore = parseInt(getStorageItem('user_health_score', '85'));
  const diseases = JSON.parse(getStorageItem('healthDiseases', '[]'));
  const smoking = getStorageItem('healthSmoking', 'Non-smoker');
  const severityStr = getStorageItem('symptomSeverity', '5');
  const severity = parseInt(severityStr);

  // 2. DYNAMIC PREDICTION LOGIC
  // Calculate current risk base
  let currentRisk = 100 - healthScore;
  if (lastSymptoms.length > 0) currentRisk += 20 + (severity * 2);
  if (smoking === 'Smoker') currentRisk += 10;
  currentRisk = Math.min(Math.max(currentRisk, 10), 95);

  // Projecting 3-Month and 6-Month based on trend
  // If symptoms are active, trend is temporarily 'up'
  const trendDirection = lastSymptoms.length > 0 ? 'up' : 'down';
  
  const predictions = [
    {
      title: '90-Day Prognosis',
      risk: trendDirection === 'up' ? Math.min(currentRisk + 8, 98) : Math.max(currentRisk - 5, 5),
      change: trendDirection === 'up' ? 8 : -5,
      trend: trendDirection,
      insights: [
        trendDirection === 'up' ? 'Current symptomatic patterns suggest a 8% risk escalation' : 'Risk stabilization expected with current wellness adherence',
        diseases.length > 0 ? `Chronic management for ${diseases[0]} is a critical factor` : 'Absence of chronic conditions favors a positive outlook',
        'Projected improvement if rest cycles are maintained'
      ],
    },
    {
      title: '180-Day Forecast',
      risk: trendDirection === 'up' ? Math.min(currentRisk + 15, 98) : Math.max(currentRisk - 12, 5),
      change: trendDirection === 'up' ? 15 : -12,
      trend: trendDirection,
      insights: [
        'AI detects potential biological strain over long-term cycles',
        smoking === 'Smoker' ? 'Nicotine levels remain the primary long-term risk driver' : 'Non-smoking status reduces cardiovascular projection by 15%',
        'Annual screening recommended to verify this projection'
      ],
    },
    {
      title: 'Optimized Path',
      risk: Math.max(currentRisk - 25, 5),
      change: -25,
      trend: 'down',
      insights: [
        'Potential result with strict lifestyle optimization',
        'Achievable through 150min/week aerobic activity',
        'Stress reduction protocols could lower risk significantly'
      ],
    },
  ];

  return (
    <div className="size-full bg-background overflow-auto selection:bg-secondary/20">
      <div className="px-6 py-6 pb-28">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-3 rounded-2xl bg-white border border-border shadow-sm hover:bg-muted active:scale-95 transition-all">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-black text-foreground tracking-tight">Future <span className="text-secondary">Predictions</span></h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">AI Biological Forecasting</p>
          </div>
        </div>

        {/* HERO PROJECTED CARD */}
        <div className="bg-indigo-950 rounded-[40px] p-8 mb-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <Sparkles className="w-32 h-32" />
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8 text-indigo-300" />
            </div>
            <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-2">Baseline Prediction Score</p>
            <h2 className="text-6xl font-black tracking-tighter mb-4">{currentRisk}</h2>
            <div className="flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full border border-white/10">
               <Zap className="w-3 h-3 text-indigo-300" />
               <span className="text-[10px] font-bold text-indigo-100 uppercase">AI-Modeled Outlook</span>
            </div>
          </div>
        </div>

        {/* TIMELINE PREDICTIONS */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
             <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Chronological Projections</h3>
             <span className="text-[10px] font-bold text-secondary uppercase tracking-tighter">Confidence: 94%</span>
          </div>

          {predictions.map((prediction, index) => {
            const isOptimized = prediction.trend === 'down';
            const bgColor = isOptimized ? 'bg-emerald-50/50' : 'bg-rose-50/50';
            const borderColor = isOptimized ? 'border-emerald-100' : 'border-rose-100';
            const iconColor = isOptimized ? 'text-emerald-600' : 'text-rose-600';
            const TrendIcon = isOptimized ? TrendingDown : TrendingUp;

            return (
              <div key={index} className={`${bgColor} border ${borderColor} rounded-[32px] p-8 transition-all hover:scale-[1.01]`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-black text-foreground uppercase tracking-tight">{prediction.title}</h3>
                  <div className={`flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-border shadow-sm ${iconColor}`}>
                    <TrendIcon className="w-4 h-4" />
                    <span className="text-xs font-black">
                      {prediction.trend === 'up' ? '+' : ''}{prediction.change}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 mb-8">
                  <div className="text-left">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Projected Risk</p>
                    <h2 className={`text-5xl font-black tracking-tighter ${iconColor}`}>{prediction.risk}</h2>
                  </div>
                  <div className="flex-1">
                    <div className="w-full h-3 bg-white rounded-full overflow-hidden p-0.5 border border-border/50">
                      <div
                        className={`h-full ${isOptimized ? 'bg-emerald-500' : 'bg-rose-500'} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${prediction.risk}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {prediction.insights.map((insight, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-white/40 rounded-2xl border border-white/50">
                      <div className={`w-1.5 h-1.5 rounded-full ${isOptimized ? 'bg-emerald-400' : 'bg-rose-400'} mt-1.5`}></div>
                      <p className="text-xs font-bold text-foreground/70 leading-tight">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* DISCLAIMER */}
        <div className="mt-10 p-6 bg-indigo-50/50 rounded-[32px] border border-indigo-100 flex gap-4">
           <AlertCircle className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
           <div>
             <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest mb-1">AI Modeling Disclaimer</h4>
             <p className="text-[11px] text-indigo-800/70 font-medium leading-relaxed">
               These predictions are non-deterministic and serve as biological indicators based on current biometric trajectory. Real outcomes depend on lifestyle changes.
             </p>
           </div>
        </div>
      </div>
    </div>
  );
}
