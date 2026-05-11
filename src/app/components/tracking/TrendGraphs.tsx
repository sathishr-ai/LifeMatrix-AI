import { ArrowLeft, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getStorageItem } from '../../utils/storage';

export function TrendGraphs() {
  const navigate = useNavigate();

  const historyStr = getStorageItem('healthHistory', '[]');
  const history = JSON.parse(historyStr);

  // Default data for demo if history is too short
  const demoHeartRate = [
    { dateDisplay: 'Apr 27', heartRate: 68 },
    { dateDisplay: 'Apr 28', heartRate: 72 },
    { dateDisplay: 'Apr 29', heartRate: 70 },
    { dateDisplay: 'Apr 30', heartRate: 74 },
    { dateDisplay: 'May 1', heartRate: 71 },
    { dateDisplay: 'May 2', heartRate: 73 },
    { dateDisplay: 'May 3', heartRate: 72 },
  ];

  const demoSleep = [
    { dateDisplay: 'Apr 27', sleep: 6.5 },
    { dateDisplay: 'Apr 28', sleep: 7 },
    { dateDisplay: 'Apr 29', sleep: 6 },
    { dateDisplay: 'Apr 30', sleep: 7.5 },
    { dateDisplay: 'May 1', sleep: 7 },
    { dateDisplay: 'May 2', sleep: 6.5 },
    { dateDisplay: 'May 3', sleep: 7 },
  ];

  const demoWater = [
    { dateDisplay: 'Apr 27', water: 5 },
    { dateDisplay: 'Apr 28', water: 7 },
    { dateDisplay: 'Apr 29', water: 6 },
    { dateDisplay: 'Apr 30', water: 8 },
    { dateDisplay: 'May 1', water: 6 },
    { dateDisplay: 'May 2', water: 7 },
    { dateDisplay: 'May 3', water: 6 },
  ];

  // Use real data if we have at least 2 points, otherwise mix with demo for visuals
  const chartData = history.length >= 2 ? history.map((h: any) => ({
    ...h,
    heartRate: parseFloat(h.heartRate) || 70,
    sleep: parseFloat(h.sleep) || 7,
    water: parseFloat(h.water) || 8
  })) : null;

  const getStats = (data: any[], key: string) => {
    if (!data || data.length === 0) return { avg: 0, min: 0, max: 0 };
    const values = data.map(d => d[key]);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return {
      avg: avg.toFixed(1),
      min: Math.min(...values),
      max: Math.max(...values)
    };
  };

  const hrStats = getStats(chartData || demoHeartRate, 'heartRate');
  const sleepStats = getStats(chartData || demoSleep, 'sleep');
  const waterStats = getStats(chartData || demoWater, 'water');

  return (
    <div className="size-full bg-background overflow-auto">
      <div className="px-6 py-6 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl text-foreground font-bold tracking-tight">
              Trend Analysis
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              {chartData ? 'Based on your recent logs' : 'Demo data - start logging to see trends'}
            </p>
          </div>
        </div>

        {!chartData && (
          <div className="bg-secondary/10 rounded-2xl p-4 border border-secondary/20 mb-6 flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-secondary" />
            <p className="text-xs text-secondary-foreground font-medium">
              Log your health metrics for at least 2 days to see your personalized trends.
            </p>
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-border shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center justify-between">
              Heart Rate 
              <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full border border-red-100">BPM</span>
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData || demoHeartRate}>
                <defs>
                  <linearGradient id="heartRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="dateDisplay" tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 500 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
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
                  dataKey="heartRate"
                  stroke="#EF4444"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#heartRate)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Average</p>
                <p className="text-xl font-extrabold text-foreground">{hrStats.avg} <span className="text-xs font-medium text-muted-foreground">bpm</span></p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Range</p>
                <p className="text-xl font-extrabold text-foreground">{hrStats.min}-{hrStats.max}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-border shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center justify-between">
              Sleep Duration
              <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full border border-purple-100">HOURS</span>
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData || demoSleep}>
                <defs>
                  <linearGradient id="sleep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="dateDisplay" tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 500 }} axisLine={false} tickLine={false} domain={[0, 12]} />
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
                  dataKey="sleep"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#sleep)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Average</p>
                <p className="text-xl font-extrabold text-foreground">{sleepStats.avg} <span className="text-xs font-medium text-muted-foreground">hrs</span></p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Goal</p>
                <p className="text-xl font-extrabold text-foreground">8.0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-border shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center justify-between">
              Water Intake
              <span className="text-[10px] bg-cyan-50 text-cyan-600 px-2 py-0.5 rounded-full border border-cyan-100">GLASSES</span>
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData || demoWater}>
                <defs>
                  <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="dateDisplay" tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 500 }} axisLine={false} tickLine={false} domain={[0, 10]} />
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
                  dataKey="water"
                  stroke="#06B6D4"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#water)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Average</p>
                <p className="text-xl font-extrabold text-foreground">{waterStats.avg} <span className="text-xs font-medium text-muted-foreground">gls</span></p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Goal</p>
                <p className="text-xl font-extrabold text-foreground">8.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
