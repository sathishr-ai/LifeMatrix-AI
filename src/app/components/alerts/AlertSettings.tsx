import { ArrowLeft, Bell, BellOff, Pill, Activity, Heart, FileText, Shield, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { toast } from 'sonner';
import { getStorageItem, setStorageItem } from '../../utils/storage';

export function AlertSettings() {
  const navigate = useNavigate();

  // Load state persistently from localStorage
  const [settings, setSettings] = useState(() => {
    const saved = getStorageItem('notificationSettings');
    return saved ? JSON.parse(saved) : {
      medicationReminders: true,
      symptomAlerts: true,
      healthMetrics: false,
      weeklyReports: true,
      riskAlerts: true,
      appointments: true,
    };
  });

  const [masterEnabled, setMasterEnabled] = useState(() => {
    const saved = getStorageItem('masterNotifications');
    return saved ? JSON.parse(saved) : true;
  });

  const toggleSetting = (key: keyof typeof settings) => {
    const nextSettings = { ...settings, [key]: !settings[key] };
    setSettings(nextSettings);
    setStorageItem('notificationSettings', JSON.stringify(nextSettings));
    
    // Auto-update master if all are off or on
    const values = Object.values(nextSettings);
    const someEnabled = values.some(v => v);
    if (someEnabled !== masterEnabled) {
      setMasterEnabled(someEnabled);
      setStorageItem('masterNotifications', JSON.stringify(someEnabled));
    }

    toast.success('Preferences Updated', {
      description: 'Your clinical notification rules have been synced successfully.',
      duration: 1500
    });
  };

  const toggleMaster = () => {
    const nextMaster = !masterEnabled;
    setMasterEnabled(nextMaster);
    setStorageItem('masterNotifications', JSON.stringify(nextMaster));
    
    const nextSettings = {
      medicationReminders: nextMaster,
      symptomAlerts: nextMaster,
      healthMetrics: nextMaster,
      weeklyReports: nextMaster,
      riskAlerts: nextMaster,
      appointments: nextMaster,
    };
    setSettings(nextSettings);
    setStorageItem('notificationSettings', JSON.stringify(nextSettings));
    
    if (nextMaster) {
      toast.success('All Notifications Enabled', {
        description: 'You will receive all clinical alerts and health reminders.',
        duration: 2000
      });
    } else {
      toast.warning('All Notifications Muted', {
        description: 'Alerts are muted. High-priority SOS warnings remain active.',
        duration: 2000
      });
    }
  };

  const settingsList = [
    {
      key: 'medicationReminders' as keyof typeof settings,
      title: 'Medication Reminders',
      description: 'Get notified when it\'s time to take medicine',
      icon: Pill,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
    },
    {
      key: 'symptomAlerts' as keyof typeof settings,
      title: 'Symptom Alerts',
      description: 'Alerts for concerning symptoms',
      icon: Activity,
      color: 'text-rose-500',
      bg: 'bg-rose-50',
    },
    {
      key: 'healthMetrics' as keyof typeof settings,
      title: 'Health Metrics',
      description: 'Notifications for abnormal vitals',
      icon: Heart,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
    {
      key: 'weeklyReports' as keyof typeof settings,
      title: 'Weekly Reports',
      description: 'Summary of your health data',
      icon: FileText,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50',
    },
    {
      key: 'riskAlerts' as keyof typeof settings,
      title: 'Risk Alerts',
      description: 'High-priority health risk warnings',
      icon: Shield,
      color: 'text-violet-500',
      bg: 'bg-violet-50',
    },
    {
      key: 'appointments' as keyof typeof settings,
      title: 'Appointment Reminders',
      description: 'Doctor appointments and checkups',
      icon: Calendar,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
  ];

  return (
    <div className="size-full bg-slate-50 overflow-y-auto selection:bg-secondary/20 relative">
      {/* Background Blurs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-100/40 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="px-5 pt-4 pb-20 relative z-10 md:px-8 md:pt-6">
        {/* PREMIUM HEADER WITH UNIFIED CIRCULAR NAVIGATION */}
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 md:w-12 md:h-12 rounded-full border border-border bg-white flex items-center justify-center hover:shadow-lg transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4.5 h-4.5 md:w-5 md:h-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-indigo-950 tracking-tight leading-none md:text-3xl">
              Notification <span className="text-secondary">Rules</span>
            </h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Clinical Communication Hub</p>
          </div>
        </div>

        {/* MASTER SWITCH CARD */}
        <div className="bg-white rounded-[28px] p-5 border border-border/60 shadow-xl shadow-indigo-900/[0.02] mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${masterEnabled ? 'bg-secondary/15 text-secondary' : 'bg-slate-100 text-slate-400'}`}>
                {masterEnabled ? <Bell className="w-5.5 h-5.5 animate-bounce" /> : <BellOff className="w-5.5 h-5.5" />}
              </div>
              <div className="text-left">
                <h3 className="text-[13px] font-black text-indigo-950 tracking-tight md:text-sm">All Notifications</h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Master Global Switch</p>
              </div>
            </div>
            <button
              onClick={toggleMaster}
              className={`w-11 h-6.5 rounded-full transition-colors relative flex items-center p-1 cursor-pointer ${masterEnabled ? 'bg-secondary' : 'bg-slate-200'}`}
            >
              <div className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${masterEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </button>
          </div>
        </div>

        {/* SETTINGS RULES GRID */}
        <div className="space-y-3">
          {settingsList.map((setting) => (
            <div
              key={setting.key}
              className="bg-white rounded-[22px] p-4 border border-border/50 flex items-center justify-between hover:shadow-xl hover:border-secondary/20 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all group-hover:bg-white group-hover:shadow-inner ${setting.bg} ${setting.color}`}>
                  <setting.icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-[13px] font-black text-indigo-950 tracking-tight group-hover:text-secondary transition-colors md:text-sm">{setting.title}</h4>
                  <p className="text-[10px] font-bold text-muted-foreground mt-0.5">{setting.description}</p>
                </div>
              </div>
              <button
                onClick={() => toggleSetting(setting.key)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-1 cursor-pointer ${settings[setting.key] ? 'bg-secondary' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${settings[setting.key] ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </button>
            </div>
          ))}
        </div>

        {/* COMPLIANCE DISCLOSURE */}
        <div className="mt-8 bg-blue-50/70 border border-blue-100 rounded-[28px] p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100/30 rounded-full blur-xl"></div>
          <h3 className="text-xs font-black text-blue-950 tracking-tight uppercase mb-2 text-left">Clinical Safety Policy</h3>
          <p className="text-[11px] text-blue-800 font-bold leading-relaxed text-left">
            You can customize when and how you receive notifications. For your security, high-priority system alerts (e.g., Critical Risk warnings & Telemetry Failures) cannot be disabled.
          </p>
        </div>
      </div>
    </div>
  );
}
