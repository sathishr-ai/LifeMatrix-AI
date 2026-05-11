import { useState } from 'react';
import { ArrowLeft, Clock, RefreshCw, User, Activity, Heart, Shield } from 'lucide-react';
import { useNavigate } from 'react-router';

export function SeveritySelection() {
  const navigate = useNavigate();
  const [severity, setSeverity] = useState(5);
  const [duration, setDuration] = useState('1-2 days');
  const [frequency, setFrequency] = useState('Sometimes');

  // Demographics & Lifestyle states
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [diseases, setDiseases] = useState<string[]>([]);
  const [sleep, setSleep] = useState('7-8');
  const [water, setWater] = useState('8');
  const [smoking, setSmoking] = useState('Non-smoker');

  const diseasesList = ['Diabetes', 'Hypertension (BP)', 'Asthma', 'Thyroid'];

  const getSeverityLabel = (value: number) => {
    if (value <= 3) return 'Mild';
    if (value <= 6) return 'Moderate';
    return 'Severe';
  };

  const getSeverityColor = (value: number) => {
    if (value <= 3) return 'text-green-600 bg-green-50/50 border-green-100';
    if (value <= 6) return 'text-orange-600 bg-orange-50/50 border-orange-100';
    return 'text-red-600 bg-red-50/50 border-red-100';
  };

  const toggleDisease = (disease: string) => {
    setDiseases(prev =>
      prev.includes(disease) ? prev.filter(d => d !== disease) : [...prev, disease]
    );
  };

  return (
    <div className="size-full bg-background overflow-auto">
      <div className="px-6 py-6 pb-32">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Detailed Assessment
            </h1>
            <p className="text-sm text-muted-foreground">Personalize your symptom analysis</p>
          </div>
        </div>

        {/* SECTION 1: SEVERITY */}
        <div className={`bg-white rounded-3xl p-6 border mb-6 transition-all ${getSeverityColor(severity)}`}>
          <div className="text-center mb-5">
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-1">Severity Level</p>
            <h2 className={`text-5xl font-extrabold mb-1`}>
              {severity}/10
            </h2>
            <p className={`text-lg font-bold`}>
              {getSeverityLabel(severity)}
            </p>
          </div>

          <input
            type="range"
            min="1"
            max="10"
            value={severity}
            onChange={(e) => setSeverity(parseInt(e.target.value))}
            className="w-full h-2.5 bg-gradient-to-r from-green-500 via-orange-500 to-red-500 rounded-lg appearance-none cursor-pointer"
            style={{
              background: 'linear-gradient(to right, #10B981, #F59E0B, #EF4444)',
            }}
          />
          <div className="flex justify-between text-xs text-muted-foreground font-medium mt-3 px-1">
            <span>Mild</span>
            <span>Moderate</span>
            <span>Severe</span>
          </div>
        </div>

        {/* SECTION 2: DURATION */}
        <div className="bg-white rounded-2xl p-5 border border-border mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-secondary" />
            <h3 className="text-base font-semibold text-foreground">Duration</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {['< 1 day', '1-2 days', '3-5 days', '> 1 week'].map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`py-3 rounded-xl border-2 transition-all font-medium text-sm ${
                  duration === d
                    ? 'border-secondary bg-secondary/10 text-secondary'
                    : 'border-border bg-background text-foreground'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 3: FREQUENCY */}
        <div className="bg-white rounded-2xl p-5 border border-border mb-6">
          <div className="flex items-center gap-2 mb-3">
            <RefreshCw className="w-5 h-5 text-secondary" />
            <h3 className="text-base font-semibold text-foreground">Symptom Frequency</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {['Sometimes', 'Continuous'].map((f) => (
              <button
                key={f}
                onClick={() => setFrequency(f)}
                className={`py-3 rounded-xl border-2 transition-all font-medium text-sm ${
                  frequency === f
                    ? 'border-secondary bg-secondary/10 text-secondary'
                    : 'border-border bg-background text-foreground'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 4: DEMOGRAPHICS */}
        <div className="bg-white rounded-2xl p-5 border border-border mb-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-secondary" />
            <h3 className="text-base font-semibold text-foreground">Personal Details</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Ex: 28"
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary text-foreground text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-3 rounded-xl bg-background border border-border focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary text-foreground text-sm cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 5: MEDICAL HISTORY */}
        <div className="bg-white rounded-2xl p-5 border border-border mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-secondary" />
            <h3 className="text-base font-semibold text-foreground">Existing Conditions</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3 leading-tight">Do you have any pre-existing medical conditions?</p>
          <div className="flex flex-wrap gap-2">
            {diseasesList.map((disease) => (
              <button
                key={disease}
                onClick={() => toggleDisease(disease)}
                className={`px-4 py-2.5 rounded-xl text-sm border-2 font-medium transition-all ${
                  diseases.includes(disease)
                    ? 'border-red-400 bg-red-50 text-red-700'
                    : 'border-border bg-background text-foreground hover:border-red-200'
                }`}
              >
                {disease}
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 6: LIFESTYLE METRICS */}
        <div className="bg-white rounded-2xl p-5 border border-border mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-secondary" />
            <h3 className="text-base font-semibold text-foreground">Lifestyle Metrics</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Sleep Hours (Daily)</label>
              <select
                value={sleep}
                onChange={(e) => setSleep(e.target.value)}
                className="w-full px-3 py-3 rounded-xl bg-background border border-border focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary text-foreground text-sm"
              >
                <option value="< 6 hours">&lt; 6 hours</option>
                <option value="7-8 hours">7-8 hours</option>
                <option value="> 8 hours">&gt; 8 hours</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Water Intake (Glasses Daily)</label>
              <select
                value={water}
                onChange={(e) => setWater(e.target.value)}
                className="w-full px-3 py-3 rounded-xl bg-background border border-border focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary text-foreground text-sm"
              >
                <option value="< 4 glasses">&lt; 4 glasses</option>
                <option value="5-8 glasses">5-8 glasses</option>
                <option value="> 8 glasses">&gt; 8 glasses</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Smoking Habits</label>
              <div className="grid grid-cols-2 gap-3">
                {['Non-smoker', 'Smoker'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSmoking(s)}
                    className={`py-3 rounded-xl border-2 transition-all font-medium text-sm ${
                      smoking === s
                        ? 'border-secondary bg-secondary/10 text-secondary'
                        : 'border-border bg-background text-foreground'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* NEXT BUTTON */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur border-t border-border/50 max-w-lg mx-auto z-50">
          <button
            onClick={() => {
              localStorage.setItem('symptomSeverity', severity.toString());
              localStorage.setItem('symptomDuration', duration);
              localStorage.setItem('symptomFrequency', frequency);
              localStorage.setItem('healthAge', age || 'Not specified');
              localStorage.setItem('healthGender', gender);
              localStorage.setItem('healthDiseases', JSON.stringify(diseases));
              localStorage.setItem('healthSleep', sleep);
              localStorage.setItem('healthWater', water);
              localStorage.setItem('healthSmoking', smoking);

              navigate('/app/ai-processing');
            }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-base shadow-xl hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            Analyze Symptoms
          </button>
        </div>
      </div>
    </div>
  );
}
