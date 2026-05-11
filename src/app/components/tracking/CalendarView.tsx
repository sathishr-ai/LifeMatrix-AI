import { ArrowLeft, ChevronLeft, ChevronRight, Plus, Activity, Calendar, Zap, Bell, TrendingUp, Heart } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { getStorageItem } from '../../utils/storage';

export function CalendarView() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [history, setHistory] = useState<any[]>([]);
  const [activeProtocolCount, setActiveProtocolCount] = useState(0);

  useEffect(() => {
    const saved = JSON.parse(getStorageItem('symptomHistory', '[]'));
    setHistory(saved);
    const meds = JSON.parse(getStorageItem('addedMedications', '[]'));
    setActiveProtocolCount(meds.length);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(selectedDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const hasData = (day: number) => {
    // Check if any history entry matches this day/month/year
    return history.some(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getDate() === day && 
             entryDate.getMonth() === selectedDate.getMonth() && 
             entryDate.getFullYear() === selectedDate.getFullYear();
    });
  };

  const handlePrevMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  return (
    <div className="size-full bg-slate-50 relative overflow-auto selection:bg-secondary/20">
      <div className="px-6 pt-6 pb-28 relative z-10">
        {/* PREMIUM HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-violet-50 border border-violet-100/50 flex items-center justify-center flex-shrink-0 text-violet-600">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-indigo-950 tracking-tight">Health <span className="text-secondary">Tracker</span></h1>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Biometric History Logs</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/app/reminders')}
            className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-white border border-border flex items-center justify-center relative hover:shadow-lg transition-all"
          >
            <Bell className="w-4.5 h-4.5 md:w-5 md:h-5 text-muted-foreground" />
            <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-white"></div>
          </button>
        </div>

        {/* ANALYTICS SNAPSHOT - DYNAMIC CLINICAL DATA */}
        <div className="grid grid-cols-3 gap-3 mb-8">
           <div className="bg-white rounded-[24px] p-3 md:rounded-3xl md:p-5 border border-border shadow-sm flex flex-col items-center text-center group hover:scale-105 transition-transform">
              <Activity className="w-4 h-4 md:w-5 md:h-5 text-rose-500 mb-2 md:mb-3" />
              <span className="text-lg md:text-xl font-black text-indigo-950 tracking-tighter leading-none">{history.length}</span>
              <span className="text-[7px] md:text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1.5 md:mt-2">Total Logs</span>
           </div>
           <div className="bg-white rounded-[24px] p-3 md:rounded-3xl md:p-5 border border-border shadow-sm flex flex-col items-center text-center group hover:scale-105 transition-transform">
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-amber-500 mb-2 md:mb-3" />
              <span className="text-lg md:text-xl font-black text-indigo-950 tracking-tighter leading-none">
                {history.length > 0 ? Math.min(Math.round((history.length / 30) * 100), 100) : 0}%
              </span>
              <span className="text-[7px] md:text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1.5 md:mt-2">Consistency</span>
           </div>
           <div className="bg-white rounded-[24px] p-3 md:rounded-3xl md:p-5 border border-border shadow-sm flex flex-col items-center text-center group hover:scale-105 transition-transform">
              <Heart className="w-4 h-4 md:w-5 md:h-5 text-emerald-500 mb-2 md:mb-3" />
               <span className={`text-lg md:text-xl font-black tracking-tighter leading-none ${
                 history.length > 0 && Math.max(...history.map(h => h.riskScore)) > 60 ? 'text-rose-500' : 'text-emerald-500'
               }`}>
                 {history.length > 0 ? (Math.max(...history.map(h => h.riskScore)) > 60 ? 'High' : 'Normal') : 'Safe'}
               </span>
              <span className="text-[7px] md:text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1.5 md:mt-2">Avg Risk</span>
           </div>
        </div>

        {/* GLASSMORPHIC CALENDAR CONTAINER - OPTIMIZED FOR 60FPS SCROLLING */}
        <div className="max-w-2xl mx-auto bg-white rounded-[40px] p-8 border border-slate-100 shadow-2xl shadow-indigo-900/[0.03] mb-8 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                 </div>
                 <h3 className="text-xl font-black text-indigo-950 tracking-tight">
                   {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                 </h3>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrevMonth}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-white border border-border/40 transition-all hover:shadow-md active:scale-90"
                >
                  <ChevronLeft className="w-5 h-5 text-indigo-950" />
                </button>
                <button 
                  onClick={handleNextMonth}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-white border border-border/40 transition-all hover:shadow-md active:scale-90"
                >
                  <ChevronRight className="w-5 h-5 text-indigo-950" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-6 text-center">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, i) => (
                <div key={i} className="text-[10px] font-black text-indigo-950/30 uppercase tracking-[0.2em]">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-3">
              {emptyDays.map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square"></div>
              ))}
              {days.map((day) => {
                const isToday = day === new Date().getDate() && selectedDate.getMonth() === new Date().getMonth() && selectedDate.getFullYear() === new Date().getFullYear();
                const logData = hasData(day);

                return (
                  <button
                    key={day}
                    onClick={() => navigate('/app/daily-logs')}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center text-sm font-black transition-all relative group overflow-hidden ${
                      isToday
                        ? 'bg-indigo-950 text-white shadow-2xl shadow-indigo-200 scale-110 z-10'
                        : logData
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100'
                        : 'hover:bg-slate-50 text-indigo-950/50 hover:text-indigo-950'
                    }`}
                  >
                    <span className="relative z-10">{day}</span>
                    {logData && !isToday && (
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* QUICK ACTION BUTTONS */}
        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => navigate('/app/reminders')}
            className="group w-full bg-white rounded-[24px] md:rounded-[32px] p-4 md:p-6 border border-border/60 hover:shadow-xl hover:border-secondary/20 transition-all flex items-center gap-5 md:gap-6"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-orange-50 flex items-center justify-center group-hover:scale-110 transition-transform">
               <div className="text-xl md:text-3xl">💊</div>
            </div>
            <div className="text-left flex-1">
              <h3 className="text-[14px] md:text-lg font-black text-foreground tracking-tight mb-0.5">Medication Reminders</h3>
              <p className="text-[10px] md:text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                {activeProtocolCount} Active Protocol{activeProtocolCount !== 1 ? 's' : ''} Today
              </p>
            </div>
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground group-hover:translate-x-1 transition-all" />
          </button>

          <button
            onClick={() => navigate('/app/trends')}
            className="group w-full bg-white rounded-[24px] md:rounded-[32px] p-4 md:p-6 border border-border/60 hover:shadow-xl hover:border-secondary/20 transition-all flex items-center gap-5 md:gap-6"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
               <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-secondary" />
            </div>
            <div className="text-left flex-1">
              <h3 className="text-[14px] md:text-lg font-black text-foreground tracking-tight mb-0.5">Statistical Trends</h3>
              <p className="text-[10px] md:text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Advanced Pattern Analysis</p>
            </div>
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground group-hover:translate-x-1 transition-all" />
          </button>

          <button
            onClick={() => navigate('/app/daily-logs')}
            className="w-full group bg-indigo-950 rounded-[24px] md:rounded-[32px] p-4 md:p-6 shadow-2xl shadow-indigo-100 flex items-center gap-5 md:gap-6 transition-all active:scale-98"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/20 flex items-center justify-center border border-white/10">
               <Plus className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div className="text-left flex-1">
              <h3 className="text-[14px] md:text-lg font-black text-white tracking-tight mb-0.5">Record New Entry</h3>
              <p className="text-[10px] md:text-[11px] font-bold text-indigo-100 uppercase tracking-widest leading-none">Update biometrics now</p>
            </div>
            <Zap className="w-5 h-5 md:w-6 md:h-6 text-indigo-200 animate-pulse" />
          </button>
        </div>

        {/* DATA SYNC FOOTER */}
        <div className="mt-8 flex flex-col items-center">
           <div className="flex items-center gap-2 px-3 py-1 bg-white border border-border rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter">Biometric Cloud Sync Active</span>
           </div>
        </div>
      </div>
    </div>
  );
}
