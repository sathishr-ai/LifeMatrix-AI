import { ArrowLeft, Target, TrendingUp, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router';

export function PersonalizedPlan() {
  const navigate = useNavigate();

  const weekPlan = [
    {
      day: 'Monday',
      tasks: [
        { time: '7:00 AM', activity: 'Morning walk - 20 minutes', type: 'exercise' },
        { time: '12:00 PM', activity: 'Healthy lunch with vegetables', type: 'nutrition' },
        { time: '10:00 PM', activity: 'Bedtime routine', type: 'sleep' },
      ],
    },
    {
      day: 'Tuesday',
      tasks: [
        { time: '7:30 AM', activity: 'Yoga session - 30 minutes', type: 'exercise' },
        { time: '2:00 PM', activity: 'Hydration check - 8 glasses', type: 'hydration' },
        { time: '9:30 PM', activity: 'Meditation - 10 minutes', type: 'mental' },
      ],
    },
    {
      day: 'Wednesday',
      tasks: [
        { time: '6:30 AM', activity: 'Cardio workout - 40 minutes', type: 'exercise' },
        { time: '1:00 PM', activity: 'Protein-rich meal', type: 'nutrition' },
        { time: '10:00 PM', activity: 'Screen-free time', type: 'sleep' },
      ],
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'exercise': return 'bg-green-500';
      case 'nutrition': return 'bg-orange-500';
      case 'sleep': return 'bg-purple-500';
      case 'hydration': return 'bg-blue-500';
      case 'mental': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="size-full bg-background overflow-auto">
      <div className="px-6 py-6 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl text-foreground">
              Personalized Plan
            </h1>
            <p className="text-sm text-muted-foreground">Your weekly health plan</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-6 mb-6 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl">This Week's Focus</h2>
              <p className="text-white/80 text-sm">Cardiovascular Health</p>
            </div>
          </div>
          <p className="text-white/90 text-sm">
            Follow this personalized plan to reduce your cardiovascular risk and improve overall health.
          </p>
        </div>

        <div className="space-y-4">
          {weekPlan.map((day, dayIndex) => (
            <div key={dayIndex} className="bg-white rounded-2xl p-5 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="text-foreground">{day.day}</h3>
              </div>

              <div className="space-y-3">
                {day.tasks.map((task, taskIndex) => (
                  <div key={taskIndex} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full ${getTypeColor(task.type)} mt-2`}></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs text-muted-foreground">{task.time}</span>
                      </div>
                      <p className="text-sm text-foreground">{task.activity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate('/app/goals')}
            className="flex-1 py-4 rounded-2xl bg-white text-foreground border border-border flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-5 h-5" />
            View Goals
          </button>
          <button
            onClick={() => navigate('/app/habits')}
            className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white"
          >
            Track Habits
          </button>
        </div>
      </div>
    </div>
  );
}
