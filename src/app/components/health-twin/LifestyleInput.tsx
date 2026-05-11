import { useState, useEffect } from 'react';
import { ArrowLeft, Activity, Coffee, Moon, Cigarette } from 'lucide-react';
import { useNavigate } from 'react-router';

export function LifestyleInput() {
  const navigate = useNavigate();
  const [lifestyle, setLifestyle] = useState({
    exercise: 3,
    waterIntake: 6,
    sleepHours: 7,
    smoking: false,
    alcohol: 1,
  });

  const [savedStatus, setSavedStatus] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('lifestyle');
    if (saved) {
      try {
        setLifestyle(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('lifestyle', JSON.stringify(lifestyle));
    
    // Also save simple individual stats for the homepage / health profile
    const dailyLogs = {
      heartRate: '72',
      bloodPressure: '120/80',
      water: lifestyle.waterIntake,
      sleep: lifestyle.sleepHours
    };
    localStorage.setItem('dailyLogs', JSON.stringify(dailyLogs));

    setSavedStatus('Changes saved successfully!');
    setTimeout(() => {
      setSavedStatus('');
      navigate(-1);
    }, 1500);
  };

  return (
    <div className="size-full bg-background overflow-auto">
      <div className="px-6 py-6 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Lifestyle Information
            </h1>
            <p className="text-sm text-muted-foreground">Update your daily habits</p>
          </div>
        </div>

        <div className="space-y-6 mb-16">
          <div className="bg-white rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm text-foreground">Exercise (days/week)</h3>
                <p className="text-xs text-muted-foreground">{lifestyle.exercise} days</p>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="7"
              value={lifestyle.exercise}
              onChange={(e) => setLifestyle({ ...lifestyle, exercise: parseInt(e.target.value) })}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-secondary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2 font-medium">
              <span>0</span>
              <span>7</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Coffee className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm text-foreground font-semibold">Water Intake (glasses/day)</h3>
                <p className="text-xs text-muted-foreground">{lifestyle.waterIntake} glasses</p>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              value={lifestyle.waterIntake}
              onChange={(e) => setLifestyle({ ...lifestyle, waterIntake: parseInt(e.target.value) })}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2 font-medium">
              <span>0</span>
              <span>12</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Moon className="w-5 h-5 text-purple-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm text-foreground font-semibold">Sleep (hours/night)</h3>
                <p className="text-xs text-muted-foreground">{lifestyle.sleepHours} hours</p>
              </div>
            </div>
            <input
              type="range"
              min="4"
              max="12"
              value={lifestyle.sleepHours}
              onChange={(e) => setLifestyle({ ...lifestyle, sleepHours: parseInt(e.target.value) })}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2 font-medium">
              <span>4h</span>
              <span>12h</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <Cigarette className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-sm text-foreground font-semibold">Smoking</h3>
                  <p className="text-xs text-muted-foreground">Do you smoke?</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={lifestyle.smoking}
                  onChange={(e) => setLifestyle({ ...lifestyle, smoking: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Coffee className="w-5 h-5 text-orange-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm text-foreground font-semibold">Alcohol (drinks/week)</h3>
                <p className="text-xs text-muted-foreground">{lifestyle.alcohol} drinks</p>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="14"
              value={lifestyle.alcohol}
              onChange={(e) => setLifestyle({ ...lifestyle, alcohol: parseInt(e.target.value) })}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2 font-medium">
              <span>0</span>
              <span>14</span>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 px-6 py-4 bg-background/80 backdrop-blur max-w-lg mx-auto z-50 border-t border-border/40">
          <button
            onClick={handleSave}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-base shadow-xl hover:opacity-95 active:scale-[0.99] transition-all"
          >
            Save Changes
          </button>
          {savedStatus && (
            <p className="text-xs text-green-600 font-semibold text-center mt-2 bg-green-50/50 py-1 border border-green-100 rounded-lg">
              {savedStatus}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
