import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Activity, Dna } from 'lucide-react';
import { toast } from 'sonner';
import favicon from '../../../assets/favicon.png';

export function LoginScreen() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    // Default pre-registered credentials
    const defaultUser = {
      name: 'Alex Johnson',
      email: 'test@example.com',
      password: 'password123'
    };

    // Retrieve users from local storage
    const savedUsers = localStorage.getItem('registeredUsers');
    let registeredUsers = savedUsers ? JSON.parse(savedUsers) : [];

    // Force pull the latest registered users from backend to support real-time cross-device login
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

    // Combine default and registered users for lookup
    const allUsers = [defaultUser, ...registeredUsers];

    // Attempt to authenticate
    const user = allUsers.find(
      (u: any) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );

    if (user) {
      // Set active session details
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // Clear previous sessions' temporary medical histories to avoid leakage
      localStorage.removeItem('selectedSymptoms');
      localStorage.removeItem('addedMedications');
      localStorage.removeItem('symptomHistory');
      localStorage.removeItem('symptomSeverity');
      localStorage.removeItem('healthHistory');
      localStorage.removeItem('dailyLogs');
      localStorage.removeItem('completed_tasks_status');

      toast.success('Welcome back!', {
        description: `Logged in as ${user.name}`,
      });
      navigate('/app');
    } else {
      setError('Invalid email address or password.');
    }
  };

  return (
    <div className="size-full relative flex items-center justify-center px-6 overflow-hidden bg-[#f8fafc] bg-noise">
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
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="relative mb-8 inline-flex items-center justify-center group">
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl scale-150 opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-[1.75rem] bg-gradient-to-br from-[#0B1528] to-[#1a2b4c] border border-white/20 shadow-2xl flex items-center justify-center overflow-hidden ring-4 ring-white/50">
              <img src={favicon} className="w-full h-full object-cover scale-110" alt="LifeMatrix AI" />
            </div>
          </div>
          <h1 className="text-4xl mb-2 font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-primary drop-shadow-sm">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">
            Sign in to continue your health journey
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] p-8 sm:p-10 border border-white/60 animate-fade-in-up animate-delay-100">
          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-2.5 text-red-600 text-sm animate-pulse">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="animate-fade-in-up animate-delay-100">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-secondary group-focus-within:drop-shadow-[0_0_8px_rgba(var(--secondary),0.5)] transition-all duration-300 z-10" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="test@example.com"
                  className="peer w-full pl-12 pr-4 pt-6 pb-2 rounded-2xl bg-white/50 border border-border/50 hover:border-border focus:border-secondary focus:bg-white focus:outline-none focus:ring-4 focus:ring-secondary/10 transition-all font-medium text-foreground placeholder-transparent"
                />
                <label className="absolute left-12 top-4 -translate-y-1/2 text-xs font-bold text-muted-foreground/80 transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-focus:top-4 peer-focus:text-xs peer-focus:font-bold peer-focus:text-secondary pointer-events-none">
                  Email Address
                </label>
              </div>
            </div>

            <div className="animate-fade-in-up animate-delay-200">
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-secondary group-focus-within:drop-shadow-[0_0_8px_rgba(var(--secondary),0.5)] transition-all duration-300 z-10" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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

            <div className="flex items-center justify-between text-sm animate-fade-in-up animate-delay-300">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded accent-secondary cursor-pointer" />
                <span className="text-muted-foreground group-hover:text-foreground transition-colors mt-0.5">Remember me</span>
              </label>
              <button type="button" className="text-secondary font-medium">
                Forgot Password?
              </button>
            </div>

            <div className="flex items-center gap-3 animate-fade-in-up animate-delay-400">
              <button
                type="submit"
                className="relative overflow-hidden w-full py-4 mt-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg shadow-[0_8px_20px_-6px_rgba(var(--primary),0.5)] hover:shadow-[0_12px_25px_-6px_rgba(var(--primary),0.6)] hover:-translate-y-0.5 transition-all active:scale-95 group"
              >
                <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 animate-shine"></div>
                <span className="relative z-10">Sign In</span>
              </button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm animate-fade-in-up animate-delay-500">
            <span className="text-muted-foreground">Don't have an account? </span>
            <button
              onClick={() => navigate('/signup')}
              className="text-secondary font-semibold"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
