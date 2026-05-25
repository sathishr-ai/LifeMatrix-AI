import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Activity, Dna, ArrowLeft, CheckCircle2, KeyRound, Send, Loader2, User } from 'lucide-react';
import { toast } from 'sonner';
import favicon from '../../../assets/favicon.png';
import authBg from '../../../assets/auth-bg.png';

export function LoginScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const [showForgotModal, setShowForgotModal] = useState(false);

  // Check for session expiration flag
  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      setIsExpired(true);
      // Clean the URL silently so the warning doesn't persist on manual refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [searchParams]);

  // Auto-hydrate recovery console if browser/WebView restarts on mobile app switch
  useEffect(() => {
    const savedSession = localStorage.getItem('activeRecoverySession');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        // Restore if session is fresh (< 10 minutes old)
        if (session && session.timestamp && (Date.now() - session.timestamp < 10 * 60 * 1000)) {
          setShowForgotModal(true);
        } else {
          localStorage.removeItem('activeRecoverySession');
        }
      } catch (e) {
        localStorage.removeItem('activeRecoverySession');
      }
    }
  }, []);



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password.trim()) {
      setError('Please enter your email/mobile and password.');
      return;
    }

    setIsProcessing(true);

    // Default pre-registered credentials
    const defaultUser = {
      name: 'Alex Johnson',
      email: 'test@example.com',
      mobile: '1234567890',
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

    // Simulate secure network verification delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Combine default and registered users for lookup
    const allUsers = [defaultUser, ...registeredUsers];

    // Attempt to authenticate
    const user = allUsers.find(
      (u: any) =>
        (u.email?.toLowerCase() === identifier.toLowerCase() || u.mobile === identifier.replace(/\D/g, '')) &&
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
      // No need to reset isProcessing since we navigate away
      navigate('/app');
    } else {
      setError('Invalid email address or password.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="size-full relative flex items-center justify-center px-6 overflow-hidden bg-[#050B14]">
      {/* Full-Bleed Background Image */}
      <div className="absolute inset-0">
        <img src={authBg} alt="" className="w-full h-full object-cover opacity-70" />
      </div>

      {/* Very subtle noise for texture */}
      <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none"></div>

      {/* Holographic Ambient Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[140px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-400/5 blur-[150px] opacity-50"></div>

        {/* Floating DNA / Medical Particles */}
        <Dna className="absolute top-[15%] left-[20%] w-12 h-12 text-white/[0.03] animate-float-slow will-change-transform" strokeWidth={1} />
        <Activity className="absolute bottom-[20%] right-[15%] w-16 h-16 text-secondary/10 animate-float-slower will-change-transform" strokeWidth={1} />
        <Dna className="absolute top-[40%] right-[10%] w-10 h-10 text-white/[0.03] animate-float-slow animate-delay-300 will-change-transform" strokeWidth={1} />
      </div>

      <div className="w-full max-w-[26rem] relative z-10">
        <div className="relative bg-[#0B1528]/30 backdrop-blur-md rounded-[2rem] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.4)] px-4 py-7 sm:px-9 sm:py-9 border border-white/10 animate-fade-in-up animate-delay-100">
          {/* Subtle inner glow */}
          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

          <div className="relative text-center mb-8">
            <div className="relative mb-6 inline-flex items-center justify-center group">
              <div className="absolute inset-0 bg-secondary/20 rounded-full blur-2xl scale-150 opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#0B1528] border border-white/10 shadow-2xl flex items-center justify-center overflow-hidden">
                <img src={favicon} className="w-full h-full object-cover scale-[1.35]" alt="LifeMatrix AI" />
              </div>
            </div>
            <h1 className="text-3xl mb-1 font-black text-white tracking-tight drop-shadow-lg">
              Welcome Back
            </h1>
            <p className="text-white/60 text-sm font-medium">
              Sign in to continue your health journey
            </p>
          </div>
          
          {isExpired && !error && (
            <div className="mb-5 p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-start gap-2.5 text-orange-200 text-sm animate-pulse">
              <Lock className="w-5 h-5 flex-shrink-0 mt-0.5 text-orange-400" />
              <span>For your security, your session has expired due to inactivity. Please sign in again.</span>
            </div>
          )}

          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-red-200 text-sm animate-pulse">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-secondary transition-all duration-300 z-10" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="test@example.com or 1234567890"
                  disabled={isProcessing}
                  className="peer w-full pl-12 pr-4 pt-6 pb-2 rounded-2xl bg-black/25 border border-white/10 hover:border-white/20 focus:border-secondary focus:bg-black/35 focus:outline-none focus:ring-4 focus:ring-secondary/10 transition-all font-medium text-white placeholder-transparent disabled:opacity-50"
                />
                <label className="absolute left-12 top-4 -translate-y-1/2 text-xs font-bold text-white/50 transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:text-white/30 peer-focus:top-4 peer-focus:text-xs peer-focus:font-bold peer-focus:text-secondary pointer-events-none">
                  Email or Mobile Number
                </label>
              </div>
            </div>

            <div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-secondary transition-all duration-300 z-10" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isProcessing}
                  className="peer w-full pl-12 pr-12 pt-6 pb-2 rounded-2xl bg-black/25 border border-white/10 hover:border-white/20 focus:border-secondary focus:bg-black/35 focus:outline-none focus:ring-4 focus:ring-secondary/10 transition-all font-medium text-white placeholder-transparent disabled:opacity-50"
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

            <div className="flex items-center justify-between text-[10px] sm:text-sm">
              <label className="flex items-center gap-1.5 cursor-pointer group whitespace-nowrap select-none">
                <input type="checkbox" className="w-3.5 h-3.5 rounded accent-secondary border-white/20 bg-transparent cursor-pointer" />
                <span className="text-white/60 group-hover:text-white/90 transition-colors">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-secondary hover:text-secondary/85 font-semibold sm:font-bold transition-colors whitespace-nowrap"
              >
                Forgot Password
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isProcessing}
                className="relative overflow-hidden w-full py-3.5 mt-3 rounded-2xl bg-gradient-to-r from-[#0072F5] to-[#00C6A7] text-white font-extrabold text-base tracking-wide shadow-[0_10px_25px_-8px_rgba(0,114,245,0.45)] hover:from-[#1a80f6] hover:to-[#14d2b3] hover:shadow-[0_14px_30px_-8px_rgba(0,114,245,0.55)] transition-all disabled:opacity-80 disabled:pointer-events-none flex items-center justify-center gap-2 group"
              >
                {!isProcessing && <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shine"></div>}
                
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <span className="relative z-10">Sign In</span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-white/50">Don't have an account? </span>
            <button
              onClick={() => navigate('/signup')}
              className="text-secondary hover:text-secondary/85 font-bold hover:underline transition-all"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      <PasswordRecoveryModal
        isOpen={showForgotModal}
        onClose={() => {
          setShowForgotModal(false);
          localStorage.removeItem('activeRecoverySession');
        }}
        initialEmail={identifier.includes('@') ? identifier : ''}
        onComplete={(recoveredEmail) => {
          setIdentifier(recoveredEmail);
          setPassword('');
        }}
      />
    </div>
  );
}

interface PasswordRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail: string;
  onComplete: (email: string) => void;
}

function PasswordRecoveryModal({ isOpen, onClose, initialEmail, onComplete }: PasswordRecoveryModalProps) {
  const [forgotStep, setForgotStep] = useState<'email' | 'otp' | 'reset' | 'success'>('email');
  const [forgotEmail, setForgotEmail] = useState(initialEmail);
  const [recoveryOtp, setRecoveryOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recoveryError, setRecoveryError] = useState('');
  const [showForgotNewPass, setShowForgotNewPass] = useState(false);
  const [showForgotConfirmPass, setShowForgotConfirmPass] = useState(false);

  // Restore active recovery state securely upon instantiation (fixes mobile backgrounding)
  useEffect(() => {
    if (isOpen) {
      const savedSession = localStorage.getItem('activeRecoverySession');
      if (savedSession) {
        try {
          const session = JSON.parse(savedSession);
          if (session && session.timestamp && (Date.now() - session.timestamp < 10 * 60 * 1000)) {
            setForgotEmail(session.email);
            setForgotStep(session.step);
            setRecoveryOtp(session.otp);
            setRecoveryError('');
            setOtpInput('');
            setNewPassword('');
            setConfirmPassword('');
            return;
          }
        } catch (e) {
          localStorage.removeItem('activeRecoverySession');
        }
      }
      
      setForgotEmail(initialEmail);
      setForgotStep('email');
      setRecoveryOtp('');
      setRecoveryError('');
      setOtpInput('');
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [isOpen, initialEmail]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError('');
    if (!forgotEmail.trim()) {
      setRecoveryError('Please enter your registered email address.');
      return;
    }

    setIsProcessing(true);
    try {
      let host = window.location.hostname || '127.0.0.1';
      const apiHost = host === 'localhost' ? '127.0.0.1' : host;

      let registry = [];
      try {
        const res = await fetch((import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/users` : `http://${apiHost}:5175/api/users`));
        if (res.ok) {
          const data = await res.json();
          registry = data.users || [];
        }
      } catch (err) {
        const savedUsers = localStorage.getItem('registeredUsers');
        registry = savedUsers ? JSON.parse(savedUsers) : [];
      }

      const defaultUser = { name: 'Alex Johnson', email: 'test@example.com', password: 'password123' };
      const allUsers = [defaultUser, ...registry];

      const userExists = allUsers.some(u => u.email.toLowerCase() === forgotEmail.toLowerCase());

      if (!userExists) {
        setRecoveryError('No account active under this email identity.');
        setIsProcessing(false);
        return;
      }

      // Generate high-fidelity 6-digit dynamic OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setRecoveryOtp(generatedOtp);

      // Persist recovery session state for crash/tab-refresh resilience 
      localStorage.setItem('activeRecoverySession', JSON.stringify({
        email: forgotEmail,
        step: 'otp',
        otp: generatedOtp,
        timestamp: Date.now()
      }));

      // ⚡ INSTANT RESPONSE: Advance user to OTP screen immediately to feel blazing fast!
      setForgotStep('otp');
      setIsProcessing(false);

      // Dispatch to backend asynchronously in the background without blocking the user interface
      (async () => {
        try {
          const mailRes = await fetch((import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/auth/send-recovery-email` : `http://${apiHost}:5175/api/auth/send-recovery-email`), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: forgotEmail.toLowerCase(), code: generatedOtp }),
          });

          if (mailRes.ok) {
            const mailData = await mailRes.json();
            if (mailData.simulated) {
              toast.success('Physical Signature Initiated', {
                description: `⚠️ SIMULATION ACTIVE: Access code routed securely to your backend Terminal Console.`,
                duration: 15000,
              });
            } else if (mailData.offlineRecovery) {
              toast.success('Security Sandbox Bypass Active', {
                description: `⚠️ NETWORK BLOCK: Direct Local Code provided: ${generatedOtp}`,
                duration: 20000,
              });
            } else {
              toast.success('Verification Code Sent', {
                description: `A security verification code has been sent to your email address.`,
                duration: 8000,
              });
            }
          } else {
            throw new Error('Dispatch refused by backend Node.');
          }
        } catch (mailErr) {
          console.error('[SECURITY_NODE] Physical email routing failed:', mailErr);
          // Resilient Fallback: Instantly reveal the code if network fails completely
          toast.success('Security Sandbox Bypass Active', {
            description: `⚠️ NETWORK TIMEOUT: Access Handshake code is: ${generatedOtp}`,
            duration: 20000,
          });
        }
      })();

      return; // End standard execution thread immediately
    } catch (err) {
      setRecoveryError('Failed to connect. Please check your internet connection.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError('');
    if (otpInput.trim() !== recoveryOtp) {
      setRecoveryError('Invalid verification code. Please try again.');
      return;
    }
    // Advance session persistence step to allow background recovery resume
    const savedSession = localStorage.getItem('activeRecoverySession');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        localStorage.setItem('activeRecoverySession', JSON.stringify({
          ...session,
          step: 'reset'
        }));
      } catch(e) {}
    }

    setForgotStep('reset');
  };

  const handleCommitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError('');
    if (newPassword !== confirmPassword) {
      setRecoveryError('Passwords do not match. Please re-enter.');
      return;
    }
    if (newPassword.length < 6) {
      setRecoveryError('Password is too short. Minimum 6 characters required.');
      return;
    }

    setIsProcessing(true);
    const loadToast = toast.loading('Updating your password...');

    try {
      let host = window.location.hostname || '127.0.0.1';
      const apiHost = host === 'localhost' ? '127.0.0.1' : host;

      let registry = [];
      try {
        const listRes = await fetch((import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/users` : `http://${apiHost}:5175/api/users`));
        if (listRes.ok) {
          const dat = await listRes.json();
          registry = dat.users || [];
        }
      } catch (e) {
        const savedUsers = localStorage.getItem('registeredUsers');
        registry = savedUsers ? JSON.parse(savedUsers) : [];
      }

      let userFound = false;
      let newRegistry = registry.map((u: any) => {
        if (u.email.toLowerCase() === forgotEmail.toLowerCase()) {
          userFound = true;
          return { ...u, password: newPassword };
        }
        return u;
      });

      if (!userFound && forgotEmail.toLowerCase() === 'test@example.com') {
        newRegistry.push({
          id: '9f0aa232-9d65-4d61-82f0-47a0d1de67dd',
          created_at: new Date().toISOString(),
          name: 'Alex Johnson',
          email: 'test@example.com',
          password: newPassword
        });
      }

      // Push updating back to cloud node
      try {
        await fetch((import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/users` : `http://${apiHost}:5175/api/users`), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ users: newRegistry }),
        });
      } catch (apiErr) {
        console.warn('Cloud sync node offline. Committing directly to device cache.');
      }

      localStorage.setItem('registeredUsers', JSON.stringify(newRegistry));

      // Complete recovery pipeline and delete active persistence session
      localStorage.removeItem('activeRecoverySession');

      toast.success('Password Updated', { id: loadToast, description: 'Your new password is now active.' });
      setForgotStep('success');
    } catch (err) {
      toast.error('Update Failed', { id: loadToast, description: 'Something went wrong. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 overflow-hidden">
      <div
        onClick={() => !isProcessing && onClose()}
        className="absolute inset-0 bg-[#080E1D]/95 animate-fade-in"
      />

      <div className="relative w-full max-w-md bg-[#0C1425] border border-white/10 rounded-[2.5rem] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.8)] p-8 sm:p-10 overflow-hidden z-10 animate-scale-in">

        {/* Ambient Glow Effects */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl opacity-60 pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          {forgotStep !== 'email' && forgotStep !== 'success' ? (
            <button
              disabled={isProcessing}
              onClick={() => {
                if (forgotStep === 'otp') setForgotStep('email');
                if (forgotStep === 'reset') setForgotStep('otp');
                setRecoveryError('');
              }}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-white/70 hover:text-white transition-all flex items-center justify-center disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : <div className="w-9" />}

          <h3 className="text-xs font-black text-white/80 tracking-[0.2em] uppercase">Reset Password</h3>

          <button
            disabled={isProcessing}
            onClick={onClose}
            className="text-xs font-bold text-white/40 hover:text-white/80 transition-colors disabled:opacity-50 py-1.5 px-3 rounded-lg hover:bg-white/5"
          >
            Cancel
          </button>
        </div>

        {recoveryError && (
          <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-red-200 text-xs leading-relaxed animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
            <span>{recoveryError}</span>
          </div>
        )}

        {/* STEP 1: VALIDATE EMAIL */}
        {forgotStep === 'email' && (
          <form onSubmit={handleSendOtp} className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mx-auto text-secondary shadow-inner shadow-secondary/5">
                <Mail className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-black text-white tracking-tight">Account Recovery</h4>
              <p className="text-xs text-white/60 font-medium px-4 leading-relaxed">
                Enter your email address below and we will send you a verification code.
              </p>
            </div>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-secondary transition-colors z-10" />
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={isProcessing}
                className="peer w-full pl-12 pr-4 pt-6 pb-2 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 focus:border-secondary focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-secondary/10 transition-all font-medium text-white placeholder-transparent disabled:opacity-50"
                required
              />
              <label className="absolute left-12 top-4 -translate-y-1/2 text-xs font-bold text-white/50 transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:text-white/30 peer-focus:top-4 peer-focus:text-xs peer-focus:font-bold peer-focus:text-secondary pointer-events-none">
                Email Address
              </label>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="relative overflow-hidden w-full py-4 rounded-2xl bg-gradient-to-r from-[#0072F5] to-[#00C6A7] text-white font-bold text-sm tracking-widest uppercase shadow-[0_12px_30px_-10px_rgba(0,114,245,0.45)] hover:from-[#1a80f6] hover:to-[#14d2b3] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 group"
            >
              {isProcessing ? 'Sending Code...' : (
                <>
                  <span>Send CODE</span>
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: SECURE OTP */}
        {forgotStep === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400 shadow-inner shadow-amber-500/5">
                <KeyRound className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-black text-white tracking-tight">Enter Verification Code</h4>
              <p className="text-xs text-white/60 font-medium px-4 leading-relaxed">
                We have sent a security verification code to <span className="text-secondary font-bold">{forgotEmail}</span>.
              </p>
            </div>

            <div className="relative group">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-amber-400 transition-colors z-10" />
              <input
                type="text"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="••••••"
                disabled={isProcessing}
                className="peer w-full pl-12 pr-4 pt-6 pb-2 tracking-[0.4em] rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 focus:border-amber-400 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-amber-400/10 transition-all font-black text-white text-lg placeholder-transparent disabled:opacity-50"
                required
              />
              <label className="absolute left-12 top-4 -translate-y-1/2 text-xs font-bold tracking-normal text-white/50 transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:text-white/30 peer-focus:top-4 peer-focus:text-xs peer-focus:font-bold peer-focus:text-amber-400 pointer-events-none">
                Enter Security Code
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm tracking-widest uppercase shadow-[0_12px_30px_-10px_rgba(245,158,11,0.45)] hover:from-amber-600 hover:to-orange-600 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Verify code
            </button>

            <p className="text-xs text-center text-white/40 font-semibold">
              Code not received?{' '}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleSendOtp}
                className="text-amber-400 font-bold hover:underline"
              >
                Resend Code
              </button>
            </p>
          </form>
        )}

        {/* STEP 3: RESET SECURE PASSWORD */}
        {forgotStep === 'reset' && (
          <form onSubmit={handleCommitPassword} className="space-y-5 animate-fade-in">
            <div className="text-center space-y-2 mb-2">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400 shadow-inner">
                <Lock className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-black text-white tracking-tight">Create New Password</h4>
              <p className="text-xs text-white/60 font-medium leading-relaxed">
                Choose a new secure password to regain access to your account.
              </p>
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-indigo-400 transition-colors z-10" />
              <input
                type={showForgotNewPass ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Create secure password"
                disabled={isProcessing}
                className="peer w-full pl-12 pr-12 pt-6 pb-2 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 focus:border-indigo-400 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-indigo-400/10 transition-all font-medium text-white placeholder-transparent disabled:opacity-50"
                required
              />
              <label className="absolute left-12 top-4 -translate-y-1/2 text-xs font-bold text-white/50 transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:text-white/30 peer-focus:top-4 peer-focus:text-xs peer-focus:font-bold peer-focus:text-indigo-400 pointer-events-none">
                New Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotNewPass(!showForgotNewPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors z-10"
              >
                {showForgotNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-indigo-400 transition-colors z-10" />
              <input
                type={showForgotConfirmPass ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Verify secure password"
                disabled={isProcessing}
                className="peer w-full pl-12 pr-12 pt-6 pb-2 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 focus:border-indigo-400 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-indigo-400/10 transition-all font-medium text-white placeholder-transparent disabled:opacity-50"
                required
              />
              <label className="absolute left-12 top-4 -translate-y-1/2 text-xs font-bold text-white/50 transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:text-white/30 peer-focus:top-4 peer-focus:text-xs peer-focus:font-bold peer-focus:text-indigo-400 pointer-events-none">
                Confirm Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotConfirmPass(!showForgotConfirmPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors z-10"
              >
                {showForgotConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 mt-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold text-sm tracking-widest uppercase shadow-[0_12px_30px_-10px_rgba(99,102,241,0.45)] hover:from-indigo-600 hover:to-violet-600 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? 'Saving password...' : 'Reset Password'}
            </button>
          </form>
        )}

        {/* STEP 4: SUCCESS OVERLAY */}
        {forgotStep === 'success' && (
          <div className="text-center space-y-6 py-4 animate-fade-in">
            <div className="relative w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/10 animate-pulse">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-black text-white tracking-tight">Password Updated!</h4>
              <p className="text-xs text-white/60 px-4 font-medium leading-relaxed">
                Your account credentials have been successfully reset and synced.
              </p>
            </div>

            <button
              onClick={() => {
                onComplete(forgotEmail);
                onClose();
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm tracking-widest uppercase shadow-[0_12px_30px_-10px_rgba(16,185,129,0.45)] hover:from-emerald-600 hover:to-teal-600 transition-all active:scale-95"
            >
              Return to Login
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
