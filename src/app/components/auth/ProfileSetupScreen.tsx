import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, ChevronLeft, User, Calendar, Ruler, Weight } from 'lucide-react';
import { toast } from 'sonner';

export function ProfileSetupScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    bloodType: '',
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      toast.success('Setup complete!', {
        description: 'Your health profile has been updated.',
      });
      navigate('/app');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="size-full bg-background flex flex-col">
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          {step > 1 && (
            <button onClick={handleBack} className="p-2 rounded-xl hover:bg-muted transition-colors">
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>
          )}
          <div className="flex-1"></div>
          <div className="text-sm text-muted-foreground">
            Step {step} of 3
          </div>
        </div>

        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-all ${
                s <= step ? 'bg-secondary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 px-6 overflow-auto">
        {step === 1 && (
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl mb-2 text-foreground">
              Basic Information
            </h2>
            <p className="text-muted-foreground mb-8">
              Help us personalize your experience
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm text-foreground/80 mb-2">
                  Age
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="25"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-border focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-foreground/80 mb-2">
                  Gender
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Male', 'Female', 'Other'].map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender })}
                      className={`py-4 rounded-2xl border-2 transition-all ${
                        formData.gender === gender
                          ? 'border-secondary bg-secondary/10 text-secondary'
                          : 'border-border bg-white text-foreground'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl mb-2 text-foreground">
              Physical Metrics
            </h2>
            <p className="text-muted-foreground mb-8">
              This helps us calculate health indicators
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm text-foreground/80 mb-2">
                  Height (cm)
                </label>
                <div className="relative">
                  <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    placeholder="170"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-border focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-foreground/80 mb-2">
                  Weight (kg)
                </label>
                <div className="relative">
                  <Weight className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="70"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-border focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl mb-2 text-foreground">
              Medical Details
            </h2>
            <p className="text-muted-foreground mb-8">
              Optional but helpful for better insights
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm text-foreground/80 mb-2">
                  Blood Type
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, bloodType: type })}
                      className={`py-3 rounded-xl border-2 transition-all ${
                        formData.bloodType === type
                          ? 'border-secondary bg-secondary/10 text-secondary'
                          : 'border-border bg-white text-foreground'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 pb-8 pt-4">
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center gap-2 shadow-lg"
        >
          {step < 3 ? 'Continue' : 'Complete Setup'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
