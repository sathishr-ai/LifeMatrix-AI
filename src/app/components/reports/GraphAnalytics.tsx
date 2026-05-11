import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function GraphAnalytics() {
  const navigate = useNavigate();

  const riskData = [
    { month: 'Jan', value: 55 },
    { month: 'Feb', value: 58 },
    { month: 'Mar', value: 62 },
    { month: 'Apr', value: 67 },
    { month: 'May', value: 67 },
  ];

  const activityData = [
    { day: 'Mon', steps: 8200, calories: 2100 },
    { day: 'Tue', steps: 6500, calories: 1900 },
    { day: 'Wed', steps: 9100, calories: 2300 },
    { day: 'Thu', steps: 7800, calories: 2000 },
    { day: 'Fri', steps: 8500, calories: 2150 },
    { day: 'Sat', steps: 10200, calories: 2400 },
    { day: 'Sun', steps: 6800, calories: 1850 },
  ];

  return (
    <div className="size-full bg-background overflow-auto">
      <div className="px-6 py-6 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl text-foreground">
              Analytics Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">Comprehensive health insights</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <p className="text-xs text-muted-foreground">Improvements</p>
            </div>
            <h3 className="text-2xl text-green-600 mb-1">+12%</h3>
            <p className="text-xs text-muted-foreground">Exercise frequency</p>
          </div>
          <div className="bg-orange-50 rounded-2xl p-4 border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-orange-600" />
              <p className="text-xs text-muted-foreground">Needs Attention</p>
            </div>
            <h3 className="text-2xl text-orange-600 mb-1">-1.5h</h3>
            <p className="text-xs text-muted-foreground">Sleep deficit</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-border mb-6">
          <h3 className="text-sm text-foreground mb-4">Risk Score Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={riskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7280' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} domain={[50, 70]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Line type="monotone" dataKey="value" stroke="#F59E0B" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-border mb-6">
          <h3 className="text-sm text-foreground mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#6B7280' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="steps" fill="#00C6A7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-border">
          <h3 className="text-sm text-foreground mb-3">Key Metrics Summary</h3>
          <div className="space-y-3">
            {[
              { label: 'Average Heart Rate', value: '71 bpm', change: '+2%', positive: true },
              { label: 'Sleep Quality', value: '6.8 hrs', change: '-5%', positive: false },
              { label: 'Water Intake', value: '6.4 glasses', change: '+8%', positive: true },
              { label: 'Exercise Days', value: '4/week', change: '+15%', positive: true },
            ].map((metric, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{metric.label}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-foreground">{metric.value}</span>
                  <span className={`text-sm ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
