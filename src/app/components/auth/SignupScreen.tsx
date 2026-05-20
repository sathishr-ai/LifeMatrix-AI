import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Mail, Lock, Eye, EyeOff, User, AlertCircle, Fingerprint, Activity, Dna, Phone, Check, X, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import favicon from '../../../assets/favicon.png';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

export function SignupScreen() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.mobile.trim() || !formData.password.trim()) {
      setError('Please fill in all the required fields.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!/[A-Z]/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter.');
      return;
    }

    if (!/[0-9]/.test(formData.password)) {
      setError('Password must contain at least one number.');
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
      const res = await fetch((import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/users` : `http://${host}:5175/api/users`));
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
    const cleanMobile = formData.mobile.replace(/\D/g, '');
    const userExists = registeredUsers.some((u: any) => 
      u.email.toLowerCase() === formData.email.toLowerCase() || 
      (u.mobile && u.mobile === cleanMobile)
    );
    if (userExists) {
      setError('An account with this email or mobile number already exists.');
      return;
    }

    // Register user
    const newUser = {
      name: formData.name,
      email: formData.email,
      mobile: cleanMobile,
      password: formData.password
    };

    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    // Push new user to the backend database so it persists across sessions
    try {
      let host = window.location.hostname || '127.0.0.1';
      if (host === 'localhost') host = '127.0.0.1';
      
      await fetch((import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/users` : `http://${host}:5175/api/users`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users: registeredUsers }),
      });
    } catch (err) {
      console.warn('Backend sync server offline, saved locally.', err);
    }

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
    <div className="size-full relative flex items-center justify-center px-6 py-8 overflow-auto bg-gradient-to-br from-[#0B1528] via-[#0A1F44] to-[#008E77]">
      {/* Isolated Performance-Tuned Background Noise Overlay */}
      <div className="absolute inset-0 bg-noise opacity-40 pointer-events-none"></div>
      {/* Holographic Background Orbs & Ambient Particles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-secondary/15 blur-[120px] opacity-70"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-white/5 blur-[150px] opacity-50"></div>
        
        {/* Floating DNA / Medical Particles */}
        <Dna className="absolute top-[15%] left-[20%] w-12 h-12 text-white/5 animate-float-slow will-change-transform" strokeWidth={1} />
        <Activity className="absolute bottom-[20%] right-[15%] w-16 h-16 text-secondary/15 animate-float-slower will-change-transform" strokeWidth={1} />
        <Dna className="absolute top-[40%] right-[10%] w-10 h-10 text-white/5 animate-float-slow animate-delay-300 will-change-transform" strokeWidth={1} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#132D57]/70 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_40px_100px_-10px_rgba(0,0,0,0.85),_0_0_40px_-10px_rgba(0,198,167,0.15)] px-4 py-8 sm:p-10 border border-white/20 animate-fade-in-up animate-delay-100">
          <div className="text-center mb-6">
            <div className="relative mb-6 inline-flex items-center justify-center group">
              <div className="absolute inset-0 bg-secondary/20 rounded-full blur-2xl scale-150 opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#0B1528] border border-white/10 shadow-2xl flex items-center justify-center overflow-hidden">
                <img src={favicon} className="w-full h-full object-cover scale-[1.35]" alt="LifeMatrix AI" />
              </div>
            </div>
            <h1 className="text-3xl mb-1 font-black text-white tracking-tight drop-shadow-lg">
              Create Account
            </h1>
            <p className="text-white/60 text-sm font-medium">
              Start your personalized health journey
            </p>
          </div>
          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-red-200 text-sm animate-pulse">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-secondary transition-all duration-300 z-10" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="peer w-full pl-12 pr-4 pt-6 pb-2 rounded-2xl bg-black/25 border border-white/10 hover:border-white/20 focus:border-secondary focus:bg-black/35 focus:outline-none focus:ring-4 focus:ring-secondary/10 transition-all font-medium text-white placeholder-transparent"
                />
                <label className="absolute left-12 top-4 -translate-y-1/2 text-xs font-bold text-white/50 transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:text-white/30 peer-focus:top-4 peer-focus:text-xs peer-focus:font-bold peer-focus:text-secondary pointer-events-none">
                  Full Name
                </label>
              </div>
            </div>

            <div>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-secondary transition-all duration-300 z-10" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="peer w-full pl-12 pr-4 pt-6 pb-2 rounded-2xl bg-black/25 border border-white/10 hover:border-white/20 focus:border-secondary focus:bg-black/35 focus:outline-none focus:ring-4 focus:ring-secondary/10 transition-all font-medium text-white placeholder-transparent"
                />
                <label className="absolute left-12 top-4 -translate-y-1/2 text-xs font-bold text-white/50 transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:text-white/30 peer-focus:top-4 peer-focus:text-xs peer-focus:font-bold peer-focus:text-secondary pointer-events-none">
                  Email Address
                </label>
              </div>
            </div>

            <div>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-secondary transition-all duration-300 z-10" />
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="e.g. 1234567890"
                  className="peer w-full pl-12 pr-4 pt-6 pb-2 rounded-2xl bg-black/25 border border-white/10 hover:border-white/20 focus:border-secondary focus:bg-black/35 focus:outline-none focus:ring-4 focus:ring-secondary/10 transition-all font-medium text-white placeholder-transparent"
                />
                <label className="absolute left-12 top-4 -translate-y-1/2 text-xs font-bold text-white/50 transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:text-white/30 peer-focus:top-4 peer-focus:text-xs peer-focus:font-bold peer-focus:text-secondary pointer-events-none">
                  Mobile Number
                </label>
              </div>
            </div>

            <div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-secondary transition-all duration-300 z-10" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Create a strong password"
                  className="peer w-full pl-12 pr-12 pt-6 pb-2 rounded-2xl bg-black/25 border border-white/10 hover:border-white/20 focus:border-secondary focus:bg-black/35 focus:outline-none focus:ring-4 focus:ring-secondary/10 transition-all font-medium text-white placeholder-transparent"
                />
                <label className="absolute left-12 top-4 -translate-y-1/2 text-xs font-bold text-white/50 transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:text-white/30 peer-focus:top-4 peer-focus:text-xs peer-focus:font-bold peer-focus:text-secondary pointer-events-none">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors z-10"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Password Strength Meter & Rules */}
            {formData.password.length > 0 && (
              <div className="space-y-1.5 animate-[fadeIn_0.3s_ease-out] -mt-1">
                {/* Strength Meter Bar */}
                <div className="flex items-center gap-2.5">
                  <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ease-out ${
                        formData.password.length >= 8 && /[A-Z]/.test(formData.password) && /[0-9]/.test(formData.password) && /[^A-Za-z0-9]/.test(formData.password)
                          ? 'w-full bg-gradient-to-r from-emerald-500 to-emerald-400'
                          : formData.password.length >= 8 && /[A-Z]/.test(formData.password) && /[0-9]/.test(formData.password)
                          ? 'w-3/4 bg-gradient-to-r from-secondary to-cyan-400'
                          : formData.password.length >= 8
                          ? 'w-1/2 bg-gradient-to-r from-amber-500 to-amber-400'
                          : 'w-1/4 bg-gradient-to-r from-red-500 to-red-400'
                      }`}
                    />
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wider whitespace-nowrap ${
                    formData.password.length >= 8 && /[A-Z]/.test(formData.password) && /[0-9]/.test(formData.password) && /[^A-Za-z0-9]/.test(formData.password)
                      ? 'text-emerald-400'
                      : formData.password.length >= 8 && /[A-Z]/.test(formData.password) && /[0-9]/.test(formData.password)
                      ? 'text-secondary'
                      : formData.password.length >= 8
                      ? 'text-amber-400'
                      : 'text-red-400'
                  }`}>
                    {formData.password.length >= 8 && /[A-Z]/.test(formData.password) && /[0-9]/.test(formData.password) && /[^A-Za-z0-9]/.test(formData.password)
                      ? 'Excellent'
                      : formData.password.length >= 8 && /[A-Z]/.test(formData.password) && /[0-9]/.test(formData.password)
                      ? 'Strong'
                      : formData.password.length >= 8
                      ? 'Medium'
                      : 'Weak'}
                  </span>
                </div>

                {/* Compact 2-Column Rules */}
                <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                  <div className={`flex items-center gap-1.5 text-[10px] font-semibold transition-colors duration-300 ${formData.password.length >= 8 ? 'text-emerald-400' : 'text-white/30'}`}>
                    {formData.password.length >= 8 ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    <span>8+ characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 text-[10px] font-semibold transition-colors duration-300 ${/[A-Z]/.test(formData.password) ? 'text-emerald-400' : 'text-white/30'}`}>
                    {/[A-Z]/.test(formData.password) ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    <span>Uppercase</span>
                  </div>
                  <div className={`flex items-center gap-1.5 text-[10px] font-semibold transition-colors duration-300 ${/[0-9]/.test(formData.password) ? 'text-emerald-400' : 'text-white/30'}`}>
                    {/[0-9]/.test(formData.password) ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    <span>Number</span>
                  </div>
                  <div className={`flex items-center gap-1.5 text-[10px] font-semibold transition-colors duration-300 ${/[^A-Za-z0-9]/.test(formData.password) ? 'text-emerald-400' : 'text-white/25'}`}>
                    {/[^A-Za-z0-9]/.test(formData.password) ? <Check className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                    <span>Special <span className="text-white/20">(bonus)</span></span>
                  </div>
                </div>
              </div>
            )}

            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded accent-secondary border-white/20 bg-transparent mt-1 cursor-pointer" required />
              <span className="text-sm text-white/60 leading-relaxed group-hover:text-white/90 transition-colors">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowTerms(true);
                  }}
                  className="text-secondary hover:text-secondary/85 font-bold hover:underline"
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
                  className="text-secondary hover:text-secondary/85 font-bold hover:underline"
                >
                  Privacy Policy
                </button>
              </span>
            </label>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="relative overflow-hidden flex-1 py-3.5 mt-3 rounded-2xl bg-gradient-to-r from-[#0072F5] to-[#00C6A7] text-white font-extrabold text-base tracking-wide shadow-[0_10px_25px_-8px_rgba(0,114,245,0.45)] hover:from-[#1a80f6] hover:to-[#14d2b3] hover:shadow-[0_14px_30px_-8px_rgba(0,114,245,0.55)] hover:-translate-y-0.5 transition-all active:scale-95 group"
              >
                <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shine"></div>
                <span className="relative z-10">Create Account</span>
              </button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-white/50">Already have an account? </span>
            <button
              onClick={() => navigate('/login')}
              className="text-secondary hover:text-secondary/85 font-bold hover:underline transition-all"
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
