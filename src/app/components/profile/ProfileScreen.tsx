import { ArrowLeft, User, Bell, Shield, HelpCircle, LogOut, ChevronRight, Settings, Activity, FileText, Pill, Calendar as CalendarIcon, Zap, Globe, Smartphone, Lock, ShieldCheck, Sun, Moon, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { getStorageItem, removeStorageItem } from '../../utils/storage';
import logo from '../../../assets/logo.png';
import myPhoto from '../../../assets/sathish.png';

export function ProfileScreen() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Alex Johnson');
  const [userEmail, setUserEmail] = useState('alex.johnson@email.com');
  const [healthScore, setHealthScore] = useState(87);
  const [riskScore, setRiskScore] = useState(12);
  const [medsCount, setMedsCount] = useState(0);
  const [healthChecks, setHealthChecks] = useState(0);
  const [reportsGenerated, setReportsGenerated] = useState(0);
  const [daysActive, setDaysActive] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Change Password Feature Port from Sub-menu
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    localStorage.setItem('theme', nextMode ? 'dark' : 'light');
    if (nextMode) {
      document.documentElement.classList.add('dark');
      toast.success('Dark Mode Enabled', {
        description: 'Enjoy the premium nighttime clinical view!',
        duration: 2000
      });
    } else {
      document.documentElement.classList.remove('dark');
      toast.success('Light Mode Enabled', {
        description: 'Vibrant daytime clinical view enabled.',
        duration: 2000
      });
    }
  };

  useEffect(() => {
    // Dynamically retrieve active logged in user's profile details
    const currentUserStr = localStorage.getItem('currentUser');
    if (currentUserStr) {
      try {
        const user = JSON.parse(currentUserStr);
        if (user.name) setUserName(user.name);
        if (user.email) setUserEmail(user.email);
      } catch (e) {
        const savedName = localStorage.getItem('user_name');
        const savedEmail = localStorage.getItem('user_email');
        if (savedName) setUserName(savedName);
        if (savedEmail) setUserEmail(savedEmail);
      }
    }

    // DYNAMIC REDUCTION-BASED SCORING ENGINE (100% BASELINE)
    const localMeds = JSON.parse(getStorageItem('addedMedications', '[]'));
    const symptomHistory = JSON.parse(getStorageItem('symptomHistory', '[]'));
    const severityStr = getStorageItem('symptomSeverity', '5');
    const severity = parseInt(severityStr, 10);

    // -------------------------------------------------------------------------
    // PROFESSIONAL BIOMETRIC STABILITY INDEX (BSI) - UNIFIED CLINICAL ENGINE
    // -------------------------------------------------------------------------
    const lastSymptoms = JSON.parse(getStorageItem('selectedSymptoms', '[]'));

    // 1. Calculate Active Risk (Expanded Clinical Dictionary)
    let activeBasePoints = 0;
    lastSymptoms.forEach((s: string) => {
      const symptom = s.toLowerCase();
      // Critical & High Risk (30-40 pts)
      if (symptom.includes('chest pain')) activeBasePoints += 38;
      if (symptom.includes('shortness of breath')) activeBasePoints += 35;
      if (symptom.includes('unconsciousness')) activeBasePoints += 40;

      // Moderate to High (20-30 pts)
      if (symptom.includes('fever')) activeBasePoints += 25;
      if (symptom.includes('vomiting')) activeBasePoints += 22;
      if (symptom.includes('dizziness')) activeBasePoints += 20;
      if (symptom.includes('stomach pain')) activeBasePoints += 20;
      if (symptom.includes('abdominal pain')) activeBasePoints += 20;

      // Moderate (10-20 pts)
      if (symptom.includes('headache')) activeBasePoints += 15;
      if (symptom.includes('nausea')) activeBasePoints += 18;
      if (symptom.includes('cough')) activeBasePoints += 16;
      if (symptom.includes('sore throat')) activeBasePoints += 12;
      if (symptom.includes('fatigue')) activeBasePoints += 14;
      if (symptom.includes('muscle pain')) activeBasePoints += 12;
      if (symptom.includes('joint pain')) activeBasePoints += 12;
      if (symptom.includes('insomnia')) activeBasePoints += 10;

      // Low (5-10 pts)
      if (symptom.includes('runny nose')) activeBasePoints += 6;
      if (symptom.includes('skin rash')) activeBasePoints += 8;
      if (symptom.includes('itchy eyes')) activeBasePoints += 5;
    });
    if (activeBasePoints === 0 && lastSymptoms.length > 0) activeBasePoints = 18;
    const currentRiskScore = Math.min(Math.round(activeBasePoints * (1 + (severity - 5) * 0.12)), 98);

    // 2. Aggregate Historical Risk
    const historyRisk = symptomHistory.length > 0
      ? Math.max(...symptomHistory.map((h: any) => h.riskScore))
      : 0;

    // 3. Final BSI Calculation
    const peakPathology = Math.min(Math.max(currentRiskScore, historyRisk), 98);
    const protocolBuffer = localMeds.length > 0 ? 5 : 0;

    const finalHealth = Math.max(Math.min(100 - peakPathology + protocolBuffer, 100), 15);
    setHealthScore(finalHealth);
    setRiskScore(Math.round(peakPathology));

    // Meta Stats (Highly Dynamic & Exact User Data Mapping)
    const activeCheckBonus = lastSymptoms.length > 0 ? 1 : 0;
    setMedsCount(localMeds.length);
    setHealthChecks(symptomHistory.length + activeCheckBonus);
    setReportsGenerated(symptomHistory.length + activeCheckBonus);

    // Calculate exact count of unique active days
    const uniqueDays = new Set(symptomHistory.map((h: any) => h.date)).size;
    setDaysActive(Math.max(uniqueDays + activeCheckBonus, 1));
  }, []);

  const sections = [
    {
      label: 'Account Settings',
      items: [
        { icon: User, title: 'Personal Information', subtitle: 'Manage identity & health data', action: () => navigate('/app/health-profile'), color: 'text-blue-500', bg: 'bg-blue-50' },
        { icon: Bell, title: 'Notifications', subtitle: 'Alerts & bio-sync preferences', action: () => navigate('/app/alert-settings'), color: 'text-amber-500', bg: 'bg-amber-50' },
        { icon: isDarkMode ? Sun : Moon, title: 'Display Theme', subtitle: isDarkMode ? 'Dark Mode Active' : 'Light Mode Active', action: toggleTheme, color: 'text-violet-500', bg: 'bg-violet-50', isToggle: true },
      ]
    },
    {
      label: 'Security & Privacy',
      items: [
        { icon: Shield, title: 'Privacy Center', subtitle: 'Data encryption & access', action: () => navigate('/app/privacy-security'), color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { icon: Lock, title: 'Secure Access', subtitle: 'Biometric management', action: () => navigate('/app/privacy-security'), color: 'text-indigo-500', bg: 'bg-indigo-50' },
        {
          icon: Eye,
          title: 'Change Password',
          subtitle: 'Update access credentials directly',
          action: () => {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setShowCurrent(false);
            setShowNew(false);
            setShowConfirm(false);
            setShowPasswordModal(true);
          },
          color: 'text-amber-600',
          bg: 'bg-amber-50'
        },
      ]
    },
    {
      label: 'Support & Info',
      items: [
        { icon: HelpCircle, title: 'Clinical Support', subtitle: 'Knowledge base & helpdesk', action: () => navigate('/app/help-support'), color: 'text-rose-500', bg: 'bg-rose-50' },
        { icon: Globe, title: 'Connected Devices', subtitle: 'Manage wearable sync', action: () => { }, color: 'text-sky-500', bg: 'bg-sky-50' },
      ]
    }
  ];

  return (
    <div className="size-full bg-slate-50 overflow-y-auto overflow-x-hidden selection:bg-secondary/20 relative">
      {/* Background Blurs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-100/40 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="px-5 pt-4 pb-1 relative z-10 md:px-8 md:pt-6 md:pb-4">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-violet-50 border border-violet-100/50 flex items-center justify-center text-violet-600 shadow-sm shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-indigo-950 tracking-tight mb-1 md:text-3xl leading-none">
                Executive <span className="text-secondary">Profile</span>
              </h1>
            </div>
          </div>
          <button
            onClick={() => navigate('/app/privacy-security')}
            className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-white border border-border shadow-sm flex items-center justify-center hover:shadow-lg transition-all active:scale-95"
          >
            <Settings className="w-4.5 h-4.5 md:w-5 md:h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* LEFT COLUMN: HERO & STATS */}
          <div className="lg:col-span-5 space-y-5 md:space-y-6">
            {/* HERO CARD - ULTRA-THIN ON MOBILE */}
            <div className="bg-indigo-950 rounded-[24px] p-4 mb-4 text-white relative overflow-hidden shadow-xl md:rounded-[40px] md:p-8 md:mb-8">
              {/* WATERMARK - DESKTOP ONLY */}
              <div className="hidden md:block absolute top-1/2 right-0 -translate-y-1/2 opacity-10">
                <Activity className="w-64 h-64" />
              </div>

              <div className="relative z-10">
                {/* IDENTITY ROW */}
                <div className="flex items-center gap-3 mb-4 md:gap-6 md:mb-8">
                  <div className="w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-3xl bg-gradient-to-br from-indigo-400 to-secondary border border-white/20 flex items-center justify-center shadow-inner overflow-hidden">
                    <span className="text-white font-black text-2xl md:text-4xl leading-none">{userName.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-sm md:text-2xl font-black tracking-tight">{userName}</h2>
                    <p className="text-[10px] md:text-sm text-indigo-300/80 font-bold">{userEmail}</p>
                    <div className="mt-1 flex items-center gap-1.5 md:mt-2 md:gap-3">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[7px] md:text-[10px] font-black uppercase tracking-widest text-emerald-400">
                        Sync Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* METRICS ROW - DYNAMIC TRIO */}
                <div className="grid grid-cols-3 gap-2 md:gap-4">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-2 py-2 md:rounded-2xl md:p-4 hover:bg-white/10 transition-colors">
                    <p className="text-indigo-300 text-[6px] md:text-[9px] font-black uppercase tracking-widest mb-0.5">Health</p>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-sm md:text-2xl font-black">{healthScore}</span>
                      <span className="text-[7px] md:text-xs text-indigo-400 font-bold">%</span>
                    </div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-2 py-2 md:rounded-2xl md:p-4 hover:bg-white/10 transition-colors">
                    <p className="text-rose-300 text-[6px] md:text-[9px] font-black uppercase tracking-widest mb-0.5">Risk</p>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-sm md:text-2xl font-black text-rose-400">{riskScore}</span>
                      <span className="text-[7px] md:text-xs text-rose-500/50 font-bold">%</span>
                    </div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-2 py-2 md:rounded-2xl md:p-4 hover:bg-white/10 transition-colors">
                    <p className="text-indigo-300 text-[6px] md:text-[9px] font-black uppercase tracking-widest mb-0.5">Security</p>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-sm md:text-2xl font-black">L3</span>
                      <span className="text-[7px] md:text-xs text-indigo-400 font-bold uppercase">Elite</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* STATS GRID - COMPACT ON MOBILE */}
            <div className="bg-white rounded-[28px] p-6 border border-border shadow-xl shadow-black/[0.02] md:rounded-[32px] md:p-8">
              <div className="flex items-center gap-2 mb-5 px-1">
                <Zap className="w-3.5 h-3.5 text-secondary" />
                <h3 className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Usage Analytics</h3>
              </div>

              <div className="grid grid-cols-2 gap-5 md:gap-6">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-indigo-950/40">
                    <Activity className="w-3 h-3" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Checks</span>
                  </div>
                  <p className="text-xl font-black text-indigo-950 md:text-2xl">{healthChecks}</p>
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-indigo-950/40">
                    <FileText className="w-3 h-3" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Reports</span>
                  </div>
                  <p className="text-xl font-black text-indigo-950 md:text-2xl">{reportsGenerated}</p>
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-indigo-950/40">
                    <Pill className="w-3 h-3" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Protocol</span>
                  </div>
                  <p className="text-xl font-black text-indigo-950 md:text-2xl">{medsCount}</p>
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-indigo-950/40">
                    <CalendarIcon className="w-3 h-3" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Retention</span>
                  </div>
                  <p className="text-xl font-black text-indigo-950 md:text-2xl">{daysActive}d</p>
                </div>
              </div>
            </div>

            {/* LOGOUT BUTTON - DESKTOP ONLY */}
            <button
              onClick={() => {
                removeStorageItem('selectedSymptoms');
                removeStorageItem('symptomSeverity');
                removeStorageItem('symptomDuration');
                removeStorageItem('symptomFrequency');
                localStorage.removeItem('currentUser');
                toast.success('Securely Logged Out', {
                  description: 'See you next time! Your session has ended.',
                  duration: 3000,
                });
                setTimeout(() => navigate('/login'), 200);
              }}
              className="hidden md:flex w-full py-5 rounded-[28px] bg-rose-50 text-rose-600 border border-rose-100 items-center justify-center gap-3 font-black text-sm uppercase tracking-widest hover:bg-rose-100 transition-all active:scale-98 shadow-sm"
            >
              <LogOut className="w-5 h-5" />
              Secure Log Out
            </button>
          </div>

          {/* RIGHT COLUMN: SETTINGS MENU */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            {sections.map((section, sIdx) => (
              <div key={sIdx}>
                <h3 className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3 ml-2 md:mb-4">{section.label}</h3>
                <div className="space-y-2.5 md:space-y-3">
                  {section.items.map((item, iIdx) => (
                    <button
                      key={iIdx}
                      onClick={item.action}
                      className="w-full bg-white rounded-2xl p-4 border border-border/50 flex items-center gap-4 hover:shadow-xl hover:border-secondary/20 transition-all group active:scale-98 md:rounded-[28px] md:p-5 md:gap-5"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center transition-all group-hover:bg-white group-hover:shadow-inner md:w-14 md:h-14 md:rounded-2xl ${item.color}`}>
                        <item.icon className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="text-[13px] font-black text-indigo-950 tracking-tight group-hover:text-secondary transition-colors md:text-sm">{item.title}</h4>
                        <p className="text-[10px] font-bold text-muted-foreground mt-0.5 md:text-xs">{item.subtitle}</p>
                      </div>
                      {item.isToggle ? (
                        <div className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-1 cursor-pointer ${isDarkMode ? 'bg-secondary' : 'bg-slate-200'}`}>
                          <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </div>
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-secondary transition-all" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* LOGOUT BUTTON - MOBILE ONLY */}
            <button
              onClick={() => {
                removeStorageItem('selectedSymptoms');
                removeStorageItem('symptomSeverity');
                removeStorageItem('symptomDuration');
                removeStorageItem('symptomFrequency');
                localStorage.removeItem('currentUser');
                toast.success('Securely Logged Out', {
                  description: 'See you next time! Your session has ended.',
                  duration: 3000,
                });
                setTimeout(() => navigate('/login'), 200);
              }}
              className="flex md:hidden w-full py-4 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 items-center justify-center gap-2 font-black text-xs uppercase tracking-widest hover:bg-rose-100 transition-all active:scale-98 shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              Secure Log Out
            </button>

          </div>
        </div>

        {/* 7. PLAY STORE PRODUCTION FOOTER */}
        <div className="mt-5 pt-5 pb-1 border-t border-slate-200 flex flex-col md:flex-row items-center justify-center md:justify-between gap-2.5 md:gap-0 w-full text-center md:text-left">

          {/* Left: Branding & Copyright */}
          <div className="flex flex-col items-center md:items-start gap-1 md:gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-xl border border-slate-200 flex items-center justify-center p-1 shadow-sm">
                <img src={logo} className="w-full h-full object-contain" alt="Logo" />
              </div>
              <h3 className="text-[13px] font-black tracking-[0.15em] text-slate-600">LIFEMATRIX OS</h3>
            </div>
            {/* Desktop Copyright */}
            <p className="hidden md:block text-[9px] font-bold text-slate-500 uppercase tracking-widest">
              © {new Date().getFullYear()} LifeMatrix Health. All rights reserved.
            </p>
          </div>

          {/* Center: Compliance & Legal (Required for Play Store Health Apps) */}
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1.5 md:gap-5 text-[9px] md:text-[10px] font-bold tracking-wider uppercase text-slate-600">
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-slate-600"></div>
              <span
                onClick={() => navigate('/app/privacy-security')}
                className="cursor-pointer hover:text-indigo-700 active:text-indigo-700 transition-colors py-1"
              >
                Privacy Policy
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-slate-600"></div>
              <span
                onClick={() => toast.info('Terms of Service document will open securely in browser.')}
                className="cursor-pointer hover:text-indigo-700 active:text-indigo-700 transition-colors py-1"
              >
                Terms of Service
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-slate-600"></div>
              <span
                onClick={() => navigate('/app/help-support')}
                className="cursor-pointer hover:text-indigo-700 active:text-indigo-700 transition-colors py-1"
              >
                Support
              </span>
            </div>
          </div>

          {/* Right: Sleek Developer Signature */}
          <div className="flex flex-col items-center md:items-end gap-3 md:gap-4">
            <div className="w-full max-w-[280px] bg-white p-1.5 rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group cursor-default">
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <img src={myPhoto} alt="Sathish" className="w-10 h-10 rounded-full relative z-10 object-cover object-[center_20%] translate-y-[1px]" />
                </div>
                <div className="text-left md:pr-4">
                  <p className="text-[8px] font-black uppercase text-slate-600 tracking-widest leading-none mb-0.5">Developed By</p>
                  <h4 className="text-[11px] font-black text-indigo-950 leading-none">Sathish</h4>
                </div>
              </div>
              <div className="flex items-center gap-1.5 pr-4 border-l border-slate-200 pl-4">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse-slow"></div>
                <span className="text-[9px] font-black uppercase text-emerald-700 tracking-widest">v2.4.0</span>
              </div>
            </div>

            {/* Mobile Copyright */}
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest md:hidden">
              © {new Date().getFullYear()} LifeMatrix Health. All rights reserved.
            </p>
          </div>
        </div>
      </div>
      {/* PORTED Change Password Modal (Outer Integration) */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => !isUpdating && setShowPasswordModal(false)}
            className="absolute inset-0 bg-black/60 animate-fadeIn"
          />
          <div
            className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-border/50 rounded-[32px] p-8 shadow-2xl overflow-hidden z-10 animate-scaleIn"
          >
            <div className="flex flex-col items-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 mb-4 shadow-inner">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-indigo-950 dark:text-white tracking-tight">
                Update Password
              </h3>
              <p className="text-xs text-slate-500 font-medium">Establish new cryptographic keys.</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Current Password</label>
                <div className="relative mt-1">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={isUpdating}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all dark:text-white"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="w-full h-px bg-slate-100 dark:bg-slate-800"></div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">New Password</label>
                <div className="relative mt-1">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isUpdating}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all dark:text-white"
                    placeholder="Create new strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Confirm New Password</label>
                <div className="relative mt-1">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isUpdating}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all dark:text-white"
                    placeholder="Re-enter to verify"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                disabled={isUpdating}
                onClick={async () => {
                  if (!currentPassword || !newPassword || !confirmPassword) {
                    toast.error('Required', { description: 'All password fields must be completed.' });
                    return;
                  }
                  if (newPassword !== confirmPassword) {
                    toast.error('Mismatch', { description: 'New passwords do not match.' });
                    return;
                  }
                  if (newPassword.length < 6) {
                    toast.error('Too Short', { description: 'Password must contain minimum 6 characters.' });
                    return;
                  }

                  setIsUpdating(true);
                  const id = toast.loading('Initiating Secure Update...');

                  try {
                    const currentUserStr = localStorage.getItem('currentUser');
                    if (!currentUserStr) throw new Error('No session active.');
                    const currentUser = JSON.parse(currentUserStr);

                    if (currentUser.password !== currentPassword) {
                      throw new Error('Invalid current password verification failed.');
                    }

                    const host = window.location.hostname || '127.0.0.1';
                    const apiHost = host === 'localhost' ? '127.0.0.1' : host;

                    const listRes = await fetch(`http://${apiHost}:5175/api/users`);
                    let registry: any[] = [];
                    if (listRes.ok) {
                      const dat = await listRes.json();
                      registry = dat.users || [];
                    }

                    const updatedUser = { ...currentUser, password: newPassword };
                    const filteredRegistry = registry.filter((u: any) => u.email.toLowerCase() !== currentUser.email.toLowerCase());
                    const newRegistry = [...filteredRegistry, updatedUser];

                    const updateRes = await fetch(`http://${apiHost}:5175/api/users`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ users: newRegistry }),
                    });

                    if (!updateRes.ok) throw new Error('Cloud synchronization node rejected request.');

                    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                    localStorage.setItem('registeredUsers', JSON.stringify(newRegistry));

                    toast.success('Secure Key Regenerated', {
                      id,
                      description: 'Your password has been updated and securely synchronized.'
                    });
                    setShowPasswordModal(false);
                  } catch (err: any) {
                    toast.error('Handshake Aborted', {
                      id,
                      description: err.message || 'Password verification logic failed.'
                    });
                  } finally {
                    setIsUpdating(false);
                  }
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center"
              >
                {isUpdating ? 'Processing Safe Keys...' : 'Commit Password Change'}
              </button>
              <button
                disabled={isUpdating}
                onClick={() => setShowPasswordModal(false)}
                className="w-full py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm disabled:opacity-50 active:scale-95 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
