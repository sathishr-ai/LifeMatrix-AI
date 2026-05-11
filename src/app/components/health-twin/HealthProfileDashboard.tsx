import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { User, Activity, Heart, Droplet, ChevronRight, Edit3, Save, ArrowLeft, Ruler, Weight, Thermometer, Zap, Shield, Sparkles, Plus } from 'lucide-react';
import { getStorageItem, setStorageItem } from '../../utils/storage';

export function HealthProfileDashboard() {
  const navigate = useNavigate();

  // Retrieve active logged in user's profile details
  const currentUserStr = localStorage.getItem('currentUser');
  let initialName = 'Alex Johnson';
  let currentUserObj: any = {};
  if (currentUserStr) {
    try {
      currentUserObj = JSON.parse(currentUserStr);
      if (currentUserObj.name) initialName = currentUserObj.name;
    } catch (e) {}
  }

  // Read latest dynamic daily logs
  const dailyLogsStr = getStorageItem('dailyLogs');
  const initialLogs = dailyLogsStr ? JSON.parse(dailyLogsStr) : {
    heartRate: '72',
    bloodPressure: '120/80',
    weight: '70',
    sleep: '7',
    water: '6',
    meals: '3',
  };

  const initialHeight = parseInt(getStorageItem('user_height', '175'), 10);
  const initialBloodType = getStorageItem('user_blood_type', 'O+');

  // React State for editable inputs
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [height, setHeight] = useState(initialHeight);
  const [weight, setWeight] = useState(parseInt(initialLogs.weight || '70', 10));
  const [bloodPressure, setBloodPressure] = useState(initialLogs.bloodPressure || '120/80');
  const [heartRate, setHeartRate] = useState(initialLogs.heartRate || '72');
  const [bloodType, setBloodType] = useState(initialBloodType);

  const bmi = (weight / Math.pow(height / 100, 2)).toFixed(1);

  const handleSave = () => {
    if (currentUserStr) {
      try {
        const u = JSON.parse(currentUserStr);
        u.name = name;
        localStorage.setItem('currentUser', JSON.stringify(u));
      } catch (e) {}
    }
    setStorageItem('user_height', height.toString());
    setStorageItem('user_blood_type', bloodType);
    const updatedLogs = {
      ...initialLogs,
      weight: weight.toString(),
      bloodPressure,
      heartRate: heartRate.toString(),
    };
    setStorageItem('dailyLogs', JSON.stringify(updatedLogs));
    setIsEditing(false);
  };

  return (
    <div className="size-full bg-slate-50 overflow-auto selection:bg-secondary/20 relative">
      {/* Background Blurs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-100/40 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full px-4 py-6 md:px-8 md:py-8 pb-32 relative z-10">
        {/* HEADER - COMPACTED */}
        <div className="flex items-center justify-between mb-5 md:mb-8 max-w-[1600px] mx-auto">
          <div className="flex items-center gap-3 md:gap-4">
            <button onClick={() => navigate(-1)} className="w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl bg-white border border-border shadow-sm flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all">
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-indigo-950" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-indigo-950 tracking-tight">
                Health <span className="text-secondary">Twin</span>
              </h1>
              <p className="text-[8px] md:text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                Bio-Model
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (isEditing) handleSave();
              else setIsEditing(true);
            }}
            className={`px-4 py-2 md:px-6 md:py-2.5 ${isEditing ? 'bg-emerald-600' : 'bg-indigo-950'} text-white rounded-xl md:rounded-2xl shadow-xl shadow-indigo-200 hover:shadow-2xl transition-all flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest active:scale-95`}
          >
            {isEditing ? <Save className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <Edit3 className="w-3.5 h-3.5 md:w-4 md:h-4" />}
            {isEditing ? 'Sync' : 'Edit'}
          </button>
        </div>

        {/* HERO IDENTITY CARD - ULTRA-THIN ON MOBILE */}
        <div className="bg-indigo-950 rounded-[24px] p-3.5 mb-4 text-white relative overflow-hidden shadow-xl md:rounded-[48px] md:p-10 md:mb-8 max-w-[1600px] mx-auto">
          <div className="hidden md:block absolute top-0 right-0 p-12 opacity-10">
             <Sparkles className="w-48 h-48" />
          </div>
          
          <div className="flex items-center gap-3 relative z-10 md:flex-row md:items-center md:justify-between md:gap-8">
            {/* IDENTITY SECTION */}
            <div className="flex items-center gap-3 md:gap-8">
              <div className="w-12 h-12 md:w-28 md:h-28 rounded-xl md:rounded-[40px] bg-gradient-to-br from-indigo-400 to-secondary border border-white/20 flex items-center justify-center shadow-inner overflow-hidden">
                 <span className="text-white font-black text-xl md:text-5xl leading-none">{name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-2 py-1 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white text-sm md:text-3xl font-black backdrop-blur-md"
                  />
                ) : (
                  <>
                    <h2 className="text-sm md:text-4xl font-black tracking-tight mb-0.5 md:mb-2">{name}</h2>
                    <div className="flex items-center gap-1.5 md:gap-4">
                       <div className="px-1.5 py-0.5 rounded-full bg-indigo-400/10 border border-indigo-400/20 text-indigo-300 text-[6px] md:text-[11px] font-black uppercase tracking-widest">
                         Active
                       </div>
                       <div className="px-1.5 py-0.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[6px] md:text-[11px] font-black uppercase tracking-widest">
                         v1.0
                       </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* METRICS - SLIMMED DOWN */}
            <div className="flex items-center gap-2 md:gap-5 ml-auto md:ml-0">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-2.5 py-1.5 md:rounded-2xl md:px-6 md:py-5 text-center min-w-[50px] md:min-w-[176px]">
                <p className="text-indigo-300 text-[6px] md:text-[11px] font-black uppercase tracking-widest mb-0.5">HGT</p>
                <p className="text-[11px] md:text-3xl font-black">{height}<span className="text-[7px] md:text-xs text-indigo-400 ml-0.5">cm</span></p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-2.5 py-1.5 md:rounded-2xl md:px-6 md:py-5 text-center min-w-[50px] md:min-w-[176px]">
                <p className="text-indigo-300 text-[6px] md:text-[11px] font-black uppercase tracking-widest mb-0.5">WGT</p>
                <p className="text-[11px] md:text-3xl font-black">{weight}<span className="text-[7px] md:text-xs text-indigo-400 ml-0.5">kg</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* PRECISION SENSORS GRID - FULL WIDTH */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-8 max-w-[1600px] mx-auto">
          {/* BMI */}
          <div className="bg-emerald-50/50 rounded-[28px] p-4 md:p-8 border border-emerald-100 hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between mb-4 md:mb-6">
               <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-600">
                  <Activity className="w-4 h-4 md:w-6 md:h-6" />
               </div>
               <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-100/50 text-emerald-600 text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  Normal
               </div>
            </div>
            <p className="text-[9px] md:text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1 md:mb-2">BMI Sensor</p>
            <h3 className="text-xl md:text-3xl font-black text-indigo-950 group-hover:text-emerald-600 transition-colors">
              {bmi} <span className="text-[10px] md:text-xs text-muted-foreground font-bold">kg/m²</span>
            </h3>
          </div>

          {/* BLOOD PRESSURE */}
          <div className="bg-emerald-50/50 rounded-[28px] p-4 md:p-8 border border-emerald-100 hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between mb-4 md:mb-6">
               <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-600">
                  <Thermometer className="w-4 h-4 md:w-6 md:h-6" />
               </div>
               <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-100/50 text-emerald-600 text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  Optimal
               </div>
            </div>
            <p className="text-[9px] md:text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1 md:mb-2">Vascular</p>
            {isEditing ? (
              <input
                type="text"
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
                className="w-full px-2 py-1 bg-white border border-border rounded-xl focus:outline-none focus:border-emerald-600 text-lg font-black text-emerald-600"
              />
            ) : (
              <h3 className="text-xl md:text-3xl font-black text-indigo-950 group-hover:text-emerald-600 transition-colors">
                {bloodPressure} <span className="text-[10px] md:text-xs text-muted-foreground font-bold">mmHg</span>
              </h3>
            )}
          </div>

          {/* HEART RATE */}
          <div className="bg-emerald-50/50 rounded-[28px] p-4 md:p-8 border border-emerald-100 hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between mb-4 md:mb-6">
               <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-600">
                  <Heart className="w-4 h-4 md:w-6 md:h-6" />
               </div>
               <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-100/50 text-emerald-600 text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  Stable
               </div>
            </div>
            <p className="text-[9px] md:text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1 md:mb-2">Cardiac</p>
            {isEditing ? (
              <input
                type="text"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                className="w-full px-2 py-1 bg-white border border-border rounded-xl focus:outline-none focus:border-emerald-600 text-lg font-black text-emerald-600"
              />
            ) : (
              <h3 className="text-xl md:text-3xl font-black text-indigo-950 group-hover:text-emerald-600 transition-colors">
                {heartRate} <span className="text-[10px] md:text-xs text-muted-foreground font-bold">bpm</span>
              </h3>
            )}
          </div>

          {/* BLOOD TYPE */}
          <div className="bg-blue-50/50 rounded-[28px] p-4 md:p-8 border border-blue-100 hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between mb-4 md:mb-6">
               <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600">
                  <Droplet className="w-4 h-4 md:w-6 md:h-6" />
               </div>
               <div className="px-2 py-1 rounded-full bg-blue-100/50 text-blue-600 text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                  Verified
               </div>
            </div>
            <p className="text-[9px] md:text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1 md:mb-2">Blood Group</p>
            {isEditing ? (
              <input
                type="text"
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                className="w-full px-2 py-1 bg-white border border-border rounded-xl focus:outline-none focus:border-blue-600 text-lg font-black text-blue-600"
              />
            ) : (
              <h3 className="text-xl md:text-3xl font-black text-indigo-950 group-hover:text-blue-600 transition-colors">
                {bloodType} <span className="text-[10px] md:text-xs text-muted-foreground font-bold">Pos</span>
              </h3>
            )}
          </div>
        </div>

        {/* EXECUTIVE INFORMATION MENU - FULL WIDTH GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-[1600px] mx-auto">
          {[
            {
              title: 'Lifestyle Diagnostics',
              subtitle: 'Activity, Nutrition & Circadian',
              icon: Zap,
              color: 'text-amber-500',
              bg: 'bg-white',
              action: () => navigate('/app/lifestyle-input')
            },
            {
              title: 'Clinical History',
              subtitle: 'Pathology, Conditions & Allergy',
              icon: Shield,
              color: 'text-rose-500',
              bg: 'bg-white',
              action: () => navigate('/app/medical-history')
            },
            {
              title: 'Bio-Sync Summary',
              subtitle: 'AI Driven Health Synthesis',
              icon: Droplet,
              color: 'text-purple-500',
              bg: 'bg-white',
              action: () => navigate('/app/health-summary')
            },
          ].map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="group bg-white rounded-3xl md:rounded-[40px] p-5 md:p-8 border border-border/50 flex items-center gap-6 md:gap-8 hover:shadow-2xl hover:border-secondary/20 transition-all text-left active:scale-98 shadow-sm"
            >
              <div className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-slate-50 flex items-center justify-center transition-colors group-hover:bg-white ${item.color}`}>
                <item.icon className="w-6 h-6 md:w-10 md:h-10" />
              </div>
              <div className="flex-1">
                <h4 className="text-[14px] md:text-[18px] font-black text-indigo-950 tracking-tight group-hover:text-secondary transition-colors">{item.title}</h4>
                <p className="text-[10px] md:text-[13px] font-bold text-muted-foreground mt-1">{item.subtitle}</p>
              </div>
              <ChevronRight className="w-5 h-5 md:w-8 md:h-8 text-muted-foreground group-hover:translate-x-2 group-hover:text-secondary transition-all" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
