import { ArrowLeft, Activity, Heart, TrendingUp, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router';

export function HealthTimeline() {
  const navigate = useNavigate();

  const events = [
    {
      date: 'May 3, 2026',
      type: 'symptom',
      title: 'Symptom Check Completed',
      description: 'Common cold diagnosis with 75% confidence',
      icon: Activity,
      color: 'bg-blue-500',
    },
    {
      date: 'May 1, 2026',
      type: 'metric',
      title: 'Health Metrics Updated',
      description: 'Blood pressure: 120/80, Heart rate: 72 bpm',
      icon: Heart,
      color: 'bg-green-500',
    },
    {
      date: 'April 28, 2026',
      type: 'risk',
      title: 'Risk Assessment',
      description: 'Cardiovascular risk increased to moderate',
      icon: AlertCircle,
      color: 'bg-orange-500',
    },
    {
      date: 'April 25, 2026',
      type: 'improvement',
      title: 'Health Improvement',
      description: 'Sleep quality improved by 15%',
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
    {
      date: 'April 20, 2026',
      type: 'symptom',
      title: 'Symptom Check',
      description: 'Headache and fatigue - advised rest',
      icon: Activity,
      color: 'bg-blue-500',
    },
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
              Health Timeline
            </h1>
            <p className="text-sm text-muted-foreground">Your health journey</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-6 mb-6 text-white shadow-xl">
          <h2 className="text-2xl mb-2">30 Days</h2>
          <p className="text-white/90 text-sm">
            Tracking your health events and milestones
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>

          <div className="space-y-6">
            {events.map((event, index) => {
              const Icon = event.icon;
              return (
                <div key={index} className="relative pl-16">
                  <div className={`absolute left-0 w-12 h-12 rounded-2xl ${event.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-border">
                    <p className="text-xs text-muted-foreground mb-2">{event.date}</p>
                    <h3 className="text-sm text-foreground mb-1">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
