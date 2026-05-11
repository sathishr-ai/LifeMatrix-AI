import { ArrowLeft, Target, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router';

export function WeeklyGoals() {
  const navigate = useNavigate();

  const goals = [
    {
      title: 'Exercise 5 days this week',
      current: 3,
      target: 5,
      unit: 'days',
      color: 'bg-green-500',
    },
    {
      title: 'Drink 8 glasses of water daily',
      current: 42,
      target: 56,
      unit: 'glasses',
      color: 'bg-blue-500',
    },
    {
      title: 'Sleep 8 hours per night',
      current: 4,
      target: 7,
      unit: 'nights',
      color: 'bg-purple-500',
    },
    {
      title: 'Log meals every day',
      current: 5,
      target: 7,
      unit: 'days',
      color: 'bg-orange-500',
    },
  ];

  const totalPercentage = Math.round(
    goals.reduce((acc, goal) => acc + Math.min((goal.current / goal.target) * 100, 100), 0) / goals.length
  );

  return (
    <div className="size-full bg-background overflow-auto">
      <div className="px-6 py-6 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl text-foreground">
              Weekly Goals
            </h1>
            <p className="text-sm text-muted-foreground">Track your progress</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-6 mb-6 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl">{totalPercentage}%</h2>
              <p className="text-white/80 text-sm">Overall Progress</p>
            </div>
          </div>
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: `${totalPercentage}%` }}></div>
          </div>
        </div>

        <div className="space-y-4">
          {goals.map((goal, index) => {
            const percentage = Math.round((goal.current / goal.target) * 100);
            const isComplete = goal.current >= goal.target;

            return (
              <div key={index} className="bg-white rounded-2xl p-5 border border-border">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm text-foreground flex-1">{goal.title}</h3>
                  <span className={`text-sm ${isComplete ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {goal.current}/{goal.target} {goal.unit}
                  </span>
                </div>

                <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full ${goal.color} rounded-full transition-all`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {percentage}% complete
                  </span>
                  {isComplete && (
                    <span className="text-xs text-green-600">✓ Goal achieved!</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="text-sm text-green-900 mb-1">You're doing great!</h3>
              <p className="text-sm text-green-700 leading-relaxed">
                You've completed 1 out of 4 goals this week. Keep up the momentum to achieve all your targets!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
