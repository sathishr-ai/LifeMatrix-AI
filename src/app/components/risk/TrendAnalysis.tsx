import { ArrowLeft, TrendingUp, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getStorageItem } from '../../utils/storage';

export function TrendAnalysis() {
  const navigate = useNavigate();

  const historyStr = getStorageItem('healthHistory', '[]');
  const history = JSON.parse(historyStr);

  // Derive risk score from health score (Risk = 100 - HealthScore)
  const chartData = history.length >= 2 ? history.map((h: any) => {
    const healthScore = parseInt(getStorageItem('user_health_score', '85'));
    const hr = parseFloat(h.heartRate) || 72;
    const sleep = parseFloat(h.sleep) || 7;
    const baseRisk = 100 - healthScore;
    
    // Add some variance based on actual metrics
    const variance = (hr > 80 ? (hr - 80) : 0) + (sleep < 6 ? (6 - sleep) * 5 : 0);
    const calculatedRisk = Math.min(Math.max(baseRisk + variance, 5), 95);

    return {
      month: h.dateDisplay,
      risk: Math.round(calculatedRisk),
    };
  }) : [
    { month: 'Jan', risk: 45 },
    { month: 'Feb', risk: 48 },
    { month: 'Mar', risk: 42 },
    { month: 'Apr', risk: 47 },
    { month: 'May', risk: 52 },
  ];

  const risks = chartData.map(d => d.risk);
  const highest = Math.max(...risks);
  const lowest = Math.min(...risks);
  const latest = risks[risks.length - 1];
  const previous = risks[risks.length - 2] || latest;
  const diff = latest - previous;

  return (
    <div className="size-full bg-background overflow-auto">
      <div className="px-6 py-6 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl text-foreground font-bold tracking-tight">
              Risk Progression
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              {history.length >= 2 ? 'Real-time analysis' : 'Sample analysis - log more data'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-border shadow-sm mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-foreground">Overall Risk Trend</h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-orange-50 rounded-full border border-orange-100">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-orange-600 uppercase">Live Index</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 500 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 500 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              />
              <Area
                type="monotone"
                dataKey="risk"
                stroke="#F59E0B"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRisk)"
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-red-50 rounded-3xl p-5 border border-red-100 shadow-sm">
            <p className="text-[10px] text-red-600 font-bold uppercase tracking-wider mb-2">Peak Risk</p>
            <h3 className="text-3xl font-black text-red-700">{highest}</h3>
            <p className="text-[10px] text-red-600/70 font-medium mt-1">Highest recorded</p>
          </div>
          <div className="bg-emerald-50 rounded-3xl p-5 border border-emerald-100 shadow-sm">
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-2">Optimal</p>
            <h3 className="text-3xl font-black text-emerald-700">{lowest}</h3>
            <p className="text-[10px] text-emerald-600/70 font-medium mt-1">Lowest recorded</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-border shadow-sm">
          <h3 className="text-sm font-bold text-foreground mb-4">Dynamic Insights</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${diff > 0 ? 'bg-orange-100' : 'bg-emerald-100'}`}>
                <TrendingUp className={`w-5 h-5 ${diff > 0 ? 'text-orange-600' : 'text-emerald-600'}`} />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {diff > 0 ? `Risk increased by ${diff}%` : diff < 0 ? `Risk decreased by ${Math.abs(diff)}%` : 'Risk levels are stable'}
                </p>
                <p className="text-xs text-muted-foreground font-medium">Based on your latest biometric inputs compared to the previous session.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Biometric Stability</p>
                <p className="text-xs text-muted-foreground font-medium">
                  {latest > 70 ? 'High risk detected. Consider consulting a professional.' : latest > 40 ? 'Moderate risk. Keep tracking your daily vitals.' : 'Low risk. Your metrics are within optimal ranges.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
