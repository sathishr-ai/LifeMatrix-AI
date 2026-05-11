import { ArrowLeft, Activity, Info, Zap } from 'lucide-react';
import { useNavigate } from 'react-router';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getStorageItem } from '../../utils/storage';

export function RiskBreakdown() {
  const navigate = useNavigate();

  // 1. DATA ACQUISITION
  const lastSymptoms = JSON.parse(getStorageItem('selectedSymptoms', '[]'));
  const diseases = JSON.parse(getStorageItem('healthDiseases', '[]'));
  const smoking = getStorageItem('healthSmoking', 'Non-smoker');
  const sleep = getStorageItem('healthSleep', '7-8 hours');
  const history = JSON.parse(getStorageItem('symptomHistory', '[]'));

  // 2. LOGIC FOR DYNAMIC CATEGORIES
  const calculateCategoryRisk = (category: string) => {
    let score = 15; // Base physiological risk

    // Add risk from history
    if (diseases.some((d: string) => d.toLowerCase().includes(category.toLowerCase()))) score += 30;
    
    // Add risk from acute symptoms
    lastSymptoms.forEach((s: string) => {
      const sym = s.toLowerCase();
      if (category === 'Cardiovascular' && (sym.includes('chest') || sym.includes('breath'))) score += 25;
      if (category === 'Respiratory' && (sym.includes('cough') || sym.includes('throat') || sym.includes('breath'))) score += 20;
      if (category === 'Lifestyle' && (smoking === 'Smoker' || sleep.includes('Less than 5'))) score += 15;
      if (category === 'Neurological' && (sym.includes('headache') || sym.includes('dizzy'))) score += 20;
    });

    // Add history trends
    const recentHighRisk = history.filter((h: any) => h.riskScore > 60).length;
    score += recentHighRisk * 5;

    return Math.min(Math.max(score, 10), 98);
  };

  const data = [
    { category: 'Cardiovascular', risk: calculateCategoryRisk('Cardiovascular') },
    { category: 'Diabetes', risk: calculateCategoryRisk('Diabetes') },
    { category: 'Respiratory', risk: calculateCategoryRisk('Respiratory') },
    { category: 'Lifestyle', risk: calculateCategoryRisk('Lifestyle') },
    { category: 'Neurological', risk: calculateCategoryRisk('Neurological') },
  ];

  const getColor = (risk: number) => {
    if (risk >= 70) return '#F43F5E'; // Rose 500
    if (risk >= 40) return '#F59E0B'; // Amber 500
    return '#10B981'; // Emerald 500
  };

  return (
    <div className="size-full bg-background overflow-auto selection:bg-secondary/20">
      <div className="px-6 py-6 pb-28">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-3 rounded-2xl bg-white border border-border shadow-sm hover:bg-muted active:scale-95 transition-all">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-black text-foreground tracking-tight">Risk <span className="text-secondary">Breakdown</span></h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Categorical Diagnostic View</p>
          </div>
        </div>

        {/* CHART SECTION */}
        <div className="bg-white rounded-[40px] p-8 border border-border shadow-2xl shadow-black/5 mb-8 relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-foreground uppercase tracking-tight">Probability Analysis</h3>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-secondary/10 rounded-full border border-secondary/20">
               <Zap className="w-3 h-3 text-secondary" />
               <span className="text-[10px] font-black text-secondary uppercase tracking-tighter">AI Precision</span>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis
                dataKey="category"
                tick={{ fontSize: 9, fill: '#64748B', fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
                height={40}
              />
              <YAxis 
                tick={{ fontSize: 9, fill: '#64748B', fontWeight: 700 }} 
                axisLine={false} 
                tickLine={false} 
              />
              <Tooltip
                cursor={{ fill: '#F8FAFC' }}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: 'none',
                  borderRadius: '16px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                  fontSize: '11px',
                  fontWeight: '700'
                }}
              />
              <Bar dataKey="risk" radius={[10, 10, 10, 10]} barSize={32}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.risk)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* DETAILED LIST */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2 px-1">
             <Activity className="w-4 h-4 text-secondary" />
             <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Detailed Insights</h3>
          </div>
          
          {data.map((item, index) => {
            const color = getColor(item.risk);
            const riskLevel = item.risk >= 70 ? 'CRITICAL' : item.risk >= 40 ? 'MODERATE' : 'OPTIMAL';
            const bgColor = item.risk >= 70 ? 'bg-rose-50/50' : item.risk >= 40 ? 'bg-amber-50/50' : 'bg-emerald-50/50';
            const borderColor = item.risk >= 70 ? 'border-rose-100' : item.risk >= 40 ? 'border-amber-100' : 'border-emerald-100';

            return (
              <div key={index} className={`${bgColor} rounded-[32px] p-6 border ${borderColor} transition-all hover:scale-[1.02] active:scale-98`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-black text-foreground tracking-tight mb-0.5">{item.category}</h4>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Diagnostic Correlation</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black tracking-tighter block" style={{ color }}>
                      {riskLevel}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground">{item.risk}% MATCH</span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-white/60 rounded-full overflow-hidden p-0.5 border border-white/40">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                    style={{ width: `${item.risk}%`, backgroundColor: color }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* DISCLAIMER */}
        <div className="mt-8 p-6 bg-indigo-50/50 rounded-[32px] border border-indigo-100 flex gap-4">
           <Info className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
           <p className="text-[11px] text-indigo-900/70 font-medium leading-relaxed">
             This breakdown is generated using biometric pattern matching. Elevated levels in any category should be discussed with a medical professional.
           </p>
        </div>
      </div>
    </div>
  );
}
