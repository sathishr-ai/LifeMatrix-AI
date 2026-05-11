import { ArrowLeft, TrendingUp, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router';

export function RecoveryProgress() {
  const navigate = useNavigate();

  const milestones = [
    { title: 'Started health tracking', date: 'April 1, 2026', completed: true },
    { title: 'First week completed', date: 'April 7, 2026', completed: true },
    { title: 'Improved sleep quality', date: 'April 15, 2026', completed: true },
    { title: 'Regular exercise routine', date: 'April 22, 2026', completed: true },
    { title: 'Reduced cardiovascular risk', date: 'In Progress', completed: false },
    { title: 'Achieve target BMI', date: 'Upcoming', completed: false },
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
              Recovery Progress
            </h1>
            <p className="text-sm text-muted-foreground">Your health journey</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-6 mb-6 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl">67%</h2>
              <p className="text-white/80 text-sm">Overall Progress</p>
            </div>
          </div>
          <p className="text-white/90 text-sm">
            You've completed 4 out of 6 major milestones. Keep up the great work!
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-border mb-6">
          <h3 className="text-sm text-foreground mb-4">Key Improvements</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <p className="text-xs text-muted-foreground mb-1">Risk Score</p>
              <h3 className="text-2xl text-green-600 mb-1">-12%</h3>
              <p className="text-xs text-muted-foreground">From baseline</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-xs text-muted-foreground mb-1">Exercise</p>
              <h3 className="text-2xl text-blue-600 mb-1">+60%</h3>
              <p className="text-xs text-muted-foreground">Activity increase</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <p className="text-xs text-muted-foreground mb-1">Sleep</p>
              <h3 className="text-2xl text-purple-600 mb-1">+1.2h</h3>
              <p className="text-xs text-muted-foreground">Average per night</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
              <p className="text-xs text-muted-foreground mb-1">Consistency</p>
              <h3 className="text-2xl text-orange-600 mb-1">85%</h3>
              <p className="text-xs text-muted-foreground">Daily tracking</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-border">
          <h3 className="text-sm text-foreground mb-4">Milestones</h3>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  milestone.completed
                    ? 'bg-green-500'
                    : 'bg-muted border-2 border-muted-foreground'
                }`}>
                  {milestone.completed && (
                    <CheckCircle className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm text-foreground mb-0.5 ${
                    milestone.completed ? '' : 'text-muted-foreground'
                  }`}>
                    {milestone.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">{milestone.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
