import { ArrowLeft, Flame } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';

export function HabitTracking() {
  const navigate = useNavigate();
  const [habits, setHabits] = useState([
    { name: 'Morning Exercise', streak: 7, completed: [true, true, true, true, true, true, true] },
    { name: 'Drink Water', streak: 5, completed: [true, true, false, true, true, true, true] },
    { name: 'Healthy Eating', streak: 3, completed: [false, true, true, false, true, true, true] },
    { name: 'Sleep 8 hours', streak: 4, completed: [true, false, true, true, true, false, true] },
  ]);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="size-full bg-background overflow-auto">
      <div className="px-6 py-6 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl text-foreground">
              Habit Tracking
            </h1>
            <p className="text-sm text-muted-foreground">Build healthy routines</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-6 mb-6 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-white/80 text-sm">Longest Streak</p>
              <h2 className="text-4xl">7 Days</h2>
            </div>
          </div>
          <p className="text-white/90 text-sm">
            You're on fire! Keep building those healthy habits.
          </p>
        </div>

        <div className="space-y-4">
          {habits.map((habit, habitIndex) => (
            <div key={habitIndex} className="bg-white rounded-2xl p-5 border border-border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm text-foreground mb-1">{habit.name}</h3>
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-xs text-orange-600">{habit.streak} day streak</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {days.map((day, dayIndex) => (
                  <div key={dayIndex} className="text-center">
                    <p className="text-xs text-muted-foreground mb-2">{day}</p>
                    <button
                      onClick={() => {
                        const newHabits = [...habits];
                        newHabits[habitIndex].completed[dayIndex] = !newHabits[habitIndex].completed[dayIndex];
                        setHabits(newHabits);
                      }}
                      className={`w-full aspect-square rounded-xl border-2 transition-all ${
                        habit.completed[dayIndex]
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'bg-background border-border hover:border-green-500'
                      }`}
                    >
                      {habit.completed[dayIndex] && (
                        <span className="text-sm">✓</span>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-6 py-4 rounded-2xl bg-secondary/10 text-secondary border border-secondary/20">
          + Add New Habit
        </button>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <h3 className="text-sm text-blue-900 mb-2">Habit Building Tips</h3>
          <ul className="space-y-1">
            <li className="text-sm text-blue-700">• Start with small, achievable goals</li>
            <li className="text-sm text-blue-700">• Track consistently every day</li>
            <li className="text-sm text-blue-700">• Celebrate your streaks</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
