import { ArrowLeft, Droplet, Activity, Moon, Apple, Check } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';

export function DailySuggestions() {
  const navigate = useNavigate();
  const [completed, setCompleted] = useState<number[]>([]);

  const suggestions = [
    {
      icon: Droplet,
      title: 'Drink 2 glasses of water',
      time: 'Morning',
      priority: 'High',
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      icon: Activity,
      title: '30 minutes cardio exercise',
      time: 'Afternoon',
      priority: 'High',
      color: 'text-green-500',
      bg: 'bg-green-50',
    },
    {
      icon: Apple,
      title: 'Eat a serving of vegetables',
      time: 'Lunch',
      priority: 'Medium',
      color: 'text-orange-500',
      bg: 'bg-orange-50',
    },
    {
      icon: Moon,
      title: 'Sleep by 10:00 PM',
      time: 'Evening',
      priority: 'High',
      color: 'text-purple-500',
      bg: 'bg-purple-50',
    },
  ];

  const toggleComplete = (index: number) => {
    setCompleted(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
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
              Daily Suggestions
            </h1>
            <p className="text-sm text-muted-foreground">Personalized for today</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-6 mb-6 text-white">
          <h2 className="text-2xl mb-2">
            {completed.length} of {suggestions.length}
          </h2>
          <p className="text-white/90 text-sm mb-4">Tasks completed today</p>
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${(completed.length / suggestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-3">
          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            const isCompleted = completed.includes(index);

            return (
              <div
                key={index}
                className={`${suggestion.bg} rounded-2xl p-4 border border-border/50 transition-all ${
                  isCompleted ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0 ${suggestion.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-sm text-foreground mb-1 ${isCompleted ? 'line-through' : ''}`}>
                      {suggestion.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{suggestion.time}</span>
                      <span>•</span>
                      <span className={suggestion.priority === 'High' ? 'text-red-600' : 'text-orange-600'}>
                        {suggestion.priority} Priority
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleComplete(index)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-white border-2 border-muted'
                    }`}
                  >
                    {isCompleted && <Check className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <h3 className="text-sm text-blue-900 mb-2">Why These Suggestions?</h3>
          <p className="text-sm text-blue-700 leading-relaxed">
            Based on your health profile, these daily activities can help reduce your cardiovascular
            risk by 12% and improve overall wellness.
          </p>
        </div>
      </div>
    </div>
  );
}
