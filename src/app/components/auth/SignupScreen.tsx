import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Mail, Lock, Eye, EyeOff, User, AlertCircle, Fingerprint, Activity, Dna } from 'lucide-react';
import { toast } from 'sonner';
import favicon from '../../../assets/favicon.png';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

export function SignupScreen() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Please fill in all the required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // Load registered users from local storage
    const savedUsers = localStorage.getItem('registeredUsers');
    let registeredUsers = savedUsers ? JSON.parse(savedUsers) : [];

    // Force pull the latest registered users from backend to support real-time cross-device checks
    try {
      let host = window.location.hostname || '127.0.0.1';
      if (host === 'localhost') {
        host = '127.0.0.1';
      }
      const res = await fetch(`http://${host}:5175/api/users`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.users)) {
          registeredUsers = data.users;
          localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        }
      }
    } catch (err) {
      console.warn('Backend sync server offline, validating against offline cache.', err);
    }

    // Check if user already exists
    const userExists = registeredUsers.some((u: any) => u.email.toLowerCase() === formData.email.toLowerCase());
    if (userExists) {
      setError('An account with this email address already exists.');
      return;
    }

    // Register user
    const newUser = {
      name: formData.name,
      email: formData.email,
      password: formData.password
    };

    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    // Store active session user details temporarily
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    // Clear previous sessions' temporary medical histories to avoid leakage
    localStorage.removeItem('selectedSymptoms');
    localStorage.removeItem('addedMedications');
    localStorage.removeItem('symptomHistory');
    localStorage.removeItem('symptomSeverity');
    localStorage.removeItem('healthHistory');
    localStorage.removeItem('dailyLogs');
    localStorage.removeItem('completed_tasks_status');

    toast.success('Account created!', {
      description: 'Welcome to LifeMatrix AI. Let\'s set up your profile.',
    });

    navigate('/profile-setup');
  };

  return (
    <div className="size-full relative flex items-center justify-center px-6 py-8 overflow-auto bg-[#f8fafc] bg-noise">
      {/* Holographic Background Orbs & Ambient Particles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] mix-blend-multiply opacity-70 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-secondary/20 blur-[150px] mix-blend-multiply opacity-60"></div>
        
        {/* Floating DNA / Medical Particles */}
        <Dna className="absolute top-[15%] left-[20%] w-12 h-12 text-primary/10 animate-float-slow" strokeWidth={1} />
        <Activity className="absolute bottom-[20%] right-[15%] w-16 h-16 text-secondary/10 animate-float-slower" strokeWidth={1} />
        <Dna className="absolute top-[40%] right-[10%] w-10 h-10 text-primary/10 animate-float-slow animate-delay-300" strokeWidth={1} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-6 animate-fade-in-up">
          <div className="relative mb-8 inline-flex items-center justify-center group">
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl scale-150 opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-[1.75rem] bg-gradient-to-br from-[#0B1528] to-[#1a2b4c] border border-white/20 shadow-2xl flex items-center justify-center overflow-hidden ring-4 ring-white/50">
              <img src={favicon} className="w-full h-full object-cover scale-110" alt="LifeMatrix AI" />
            </div>
          </div>
          <h1 className="text-4xl mb-2 font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-primary drop-shadow-sm">
            Create Account
          </h1>
          <p className="text-muted-foreground">
            Start your personalized health journey
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] p-8 sm:p-10 border border-white/60 animate-fade-in-up animate-delay-100">
          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-2.5 text-red-600 text-sm animate-pulse">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="animate-fade-in-up animate-delay-100">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-secondary group-focus-within:drop-shadow-[0_0_8px_rgba(var(--secondary),0.5)] transition-all duration-300 z-10" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="peer w-full pl-12 pr-4 pt-6 pb-2 rounded-2xl bg-white/50 border border-border/50 hover:border-border focus:border-secondary focus:bg-white focus:outline-none focus:ring-4 focus:ring-secondary/10 transition-all font-medium text-foreground placeholder-transparent"
                />
                <label className="absolute left-12 top-4 -translate-y-1/2 text-xs font-bold text-muted-foreground/80 transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-focus:top-4 peer-focus:text-xs peer-focus:font-bold peer-focus:text-secondary pointer-events-none">
                  Full Name
                </label>
              </div>
            </div>

            <div className="animate-fade-in-up animate-delay-200">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-secondary group-focus-within:drop-shadow-[0_0_8px_rgba(var(--secondary),0.5)] transition-all duration-300 z-10" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="peer w-full pl-12 pr-4 pt-6 pb-2 rounded-2xl bg-white/50 border border-border/50 hover:border-border focus:border-secondary focus:bg-white focus:outline-none focus:ring-4 focus:ring-secondary/10 transition-all font-medium text-foreground placeholder-transparent"
                />
                <label className="absolute left-12 top-4 -translate-y-1/2 text-xs font-bold text-muted-foreground/80 transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-focus:top-4 peer-focus:text-xs peer-focus:font-bold peer-focus:text-secondary pointer-events-none">
                  Email Address
                </label>
              </div>
            </div>

            <div className="animate-fade-in-up animate-delay-300">
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-secondary group-focus-within:drop-shadow-[0_0_8px_rgba(var(--secondary),0.5)] transition-all duration-300 z-10" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Create a strong password"
                  className="peer w-full pl-12 pr-12 pt-6 pb-2 rounded-2xl bg-white/50 border border-border/50 hover:border-border focus:border-secondary focus:bg-white focus:outline-none focus:ring-4 focus:ring-secondary/10 transition-all font-medium text-foreground placeholder-transparent"
                />
                <label className="absolute left-12 top-4 -translate-y-1/2 text-xs font-bold text-muted-foreground/80 transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-focus:top-4 peer-focus:text-xs peer-focus:font-bold peer-focus:text-secondary pointer-events-none">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground z-10"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer group animate-fade-in-up animate-delay-400">
              <input type="checkbox" className="w-4 h-4 rounded accent-secondary mt-1 cursor-pointer" required />
              <span className="text-sm text-muted-foreground leading-relaxed transition-colors">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowTerms(true);
                  }}
                  className="text-secondary font-semibold hover:underline"
                >
                  Terms of Service
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPrivacy(true);
                  }}
                  className="text-secondary font-semibold hover:underline"
                >
                  Privacy Policy
                </button>
              </span>
            </label>

            <div className="flex items-center gap-3 animate-fade-in-up animate-delay-500">
              <button
                type="submit"
                className="relative overflow-hidden flex-1 py-4 mt-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg shadow-[0_8px_20px_-6px_rgba(var(--primary),0.5)] hover:shadow-[0_12px_25px_-6px_rgba(var(--primary),0.6)] hover:-translate-y-0.5 transition-all active:scale-95 group"
              >
                <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 animate-shine"></div>
                <span className="relative z-10">Create Account</span>
              </button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm animate-fade-in-up animate-delay-500">
            <span className="text-muted-foreground">Already have an account? </span>
            <button
              onClick={() => navigate('/login')}
              className="text-secondary font-semibold"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Terms of Service Dialog */}
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-[2rem] bg-white/95 backdrop-blur-xl border border-white/60 shadow-2xl p-6 sm:p-8 animate-fade-in">
          <DialogHeader className="border-b border-border/40 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <Activity className="w-6 h-6 animate-pulse" />
              </div>
              <div className="text-left">
                <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-primary">
                  Terms of Service
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Last updated: May 6, 2026</p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 text-sm text-slate-600 leading-relaxed pr-2">
            <p className="font-medium text-slate-800">
              Welcome to LifeMatrix AI. Please read these Terms of Service ("Terms") carefully before using our healthcare analytics and tracking platform.
            </p>

            <section className="space-y-2">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs">1</span>
                Acceptance of Terms
              </h3>
              <p>
                By creating an account or accessing LifeMatrix AI, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, you must not access or use our services.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs">2</span>
                Health & Medical Disclaimer
              </h3>
              <div className="p-3 bg-amber-50/50 border border-amber-200/50 rounded-xl text-amber-800 text-xs leading-normal">
                <strong>CRITICAL NOTICE:</strong> LifeMatrix AI is an interactive wellness analytics platform. All information, risk percentages, chat answers, and tracking suggestions are for informational and educational purposes only. They are NOT medical advice, diagnostic tools, or professional treatment. Always seek the advice of your physician or other qualified health providers for any medical conditions. Never disregard professional advice because of something you read here.
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs">3</span>
                User Accounts & Security
              </h3>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use. You must provide accurate, complete, and current information when creating an account.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs">4</span>
                Prohibited Use
              </h3>
              <p>
                You may not use the services for any illegal or unauthorized purpose, or attempt to compromise the security, integrity, or source code of the platform. You may not rely on this platform for real-time critical healthcare alerts or emergency medical response.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs">5</span>
                Limitation of Liability
              </h3>
              <p>
                To the maximum extent permitted by law, LifeMatrix AI and its developers shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of data, use, goodwill, or health outcomes resulting from your use of the platform.
              </p>
            </section>
          </div>

          <div className="mt-6 pt-4 border-t border-border/40 flex justify-end">
            <button
              type="button"
              onClick={() => setShowTerms(false)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm hover:opacity-95 transition-all shadow-md active:scale-95"
            >
              I Understand
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Dialog */}
      <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-[2rem] bg-white/95 backdrop-blur-xl border border-white/60 shadow-2xl p-6 sm:p-8 animate-fade-in">
          <DialogHeader className="border-b border-border/40 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary">
                <Fingerprint className="w-6 h-6 animate-pulse" />
              </div>
              <div className="text-left">
                <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-secondary">
                  Privacy Policy
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Last updated: May 6, 2026</p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 text-sm text-slate-600 leading-relaxed pr-2">
            <p className="font-medium text-slate-800">
              Your privacy is our utmost priority. At LifeMatrix AI, we are committed to safeguarding your personal and clinical-level health data using advanced encryption standards.
            </p>

            <section className="space-y-2">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-secondary/10 text-secondary text-xs">1</span>
                Information We Collect
              </h3>
              <p>
                We collect personal identification details (such as name and email address) during signup, as well as voluntary biometric entries (vitals, sleep duration, mood logs, and clinical markers) that you register in the Daily Logs. Additionally, any conversations held with our integrated AI Assistant are processed to offer contextual response insights.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-secondary/10 text-secondary text-xs">2</span>
                How We Use Your Data
              </h3>
              <p>
                Your health and demographic parameters are used solely to run predictive algorithms, calculate health scores, and generate customized clinical risk trends. Your data helps train local, private-context analytics models to provide precise recommendations.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-secondary/10 text-secondary text-xs">3</span>
                State-of-the-Art Security
              </h3>
              <p>
                All data is encrypted in transit and at rest. Your credentials and user inputs are securely cached in local storage and isolated sandboxes. We employ multiple structural security layers to protect your medical details from unauthorized breaches.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-secondary/10 text-secondary text-xs">4</span>
                Zero Third-Party Sharing
              </h3>
              <div className="p-3 bg-emerald-50/50 border border-emerald-200/50 rounded-xl text-emerald-800 text-xs leading-normal">
                <strong>GUARANTEE:</strong> We never sell, rent, or trade your personal health logs, clinical risk factors, or chat history with external advertising brokers, marketing networks, or insurance agencies. Your data belongs entirely to you.
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-secondary/10 text-secondary text-xs">5</span>
                Data Controls & Deletion
              </h3>
              <p>
                You have full authority to permanently delete your account and all associated metrics directly from your Profile settings page at any time.
              </p>
            </section>
          </div>

          <div className="mt-6 pt-4 border-t border-border/40 flex justify-end">
            <button
              type="button"
              onClick={() => setShowPrivacy(false)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-secondary to-[#10b981] text-white font-semibold text-sm hover:opacity-95 transition-all shadow-md active:scale-95"
            >
              Accept & Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
