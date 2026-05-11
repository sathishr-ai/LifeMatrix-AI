import { ArrowLeft, AlertTriangle, Bell, Settings } from 'lucide-react';
import { useNavigate } from 'react-router';

export function AlertDashboard() {
  const navigate = useNavigate();

  const alerts = [
    {
      type: 'high',
      title: 'Blood Pressure Elevated',
      message: 'Your last reading was 145/95 mmHg. Consider consulting your doctor.',
      time: '2 hours ago',
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
    },
    {
      type: 'medium',
      title: 'Medication Reminder',
      message: 'Time to take your evening medication.',
      time: '4 hours ago',
      icon: Bell,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
    },
    {
      type: 'low',
      title: 'Sleep Goal Not Met',
      message: 'You slept only 6 hours last night. Aim for 8 hours.',
      time: '1 day ago',
      icon: Bell,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
    },
  ];

  return (
    <div className="size-full bg-background overflow-auto">
      <div className="px-6 py-6 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl text-foreground">
              Alerts & Notifications
            </h1>
            <p className="text-sm text-muted-foreground">{alerts.length} active alerts</p>
          </div>
          <button
            onClick={() => navigate('/app/alert-settings')}
            className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          >
            <Settings className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-red-50 rounded-2xl p-4 border border-red-200 text-center">
            <h3 className="text-2xl text-red-600 mb-1">1</h3>
            <p className="text-xs text-muted-foreground">High Priority</p>
          </div>
          <div className="bg-orange-50 rounded-2xl p-4 border border-orange-200 text-center">
            <h3 className="text-2xl text-orange-600 mb-1">1</h3>
            <p className="text-xs text-muted-foreground">Medium</p>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200 text-center">
            <h3 className="text-2xl text-blue-600 mb-1">1</h3>
            <p className="text-xs text-muted-foreground">Info</p>
          </div>
        </div>

        <div className="space-y-3">
          {alerts.map((alert, index) => {
            const Icon = alert.icon;
            return (
              <div
                key={index}
                className={`${alert.bg} border ${alert.border} rounded-2xl p-4`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 ${alert.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm text-foreground mb-1">{alert.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                      {alert.message}
                    </p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                  <button className="text-xs text-muted-foreground hover:text-foreground">
                    Dismiss
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 bg-white rounded-2xl p-5 border border-border">
          <h3 className="text-sm text-foreground mb-3">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { title: 'Symptom check completed', time: '2 days ago' },
              { title: 'Health summary generated', time: '3 days ago' },
              { title: 'Weekly report available', time: '5 days ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  <span className="text-sm text-foreground">{activity.title}</span>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
