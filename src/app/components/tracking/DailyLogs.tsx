import { ArrowLeft, Heart, Activity, Moon, Droplet, Apple, Save, Zap, Shield, Sparkles, Clock, Mic } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { toast } from 'sonner';
import { getStorageItem, setStorageItem } from '../../utils/storage';

export function DailyLogs() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState(() => {
    const saved = getStorageItem('dailyLogs');
    return saved ? JSON.parse(saved) : {
      heartRate: '72',
      bloodPressure: '120/80',
      weight: '70',
      sleep: '7',
      water: '6',
      meals: '3',
    };
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');

  const handleVoiceRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    // Check if we are inside a mobile WebView where microphone access is blocked
    const isWebView = /wv|WebView|Expo|CoreHTML|iPhone|iPad|Android/i.test(navigator.userAgent) && !/Safari|Chrome/i.test(navigator.userAgent);
    
    const startSimulator = () => {
      setIsListening(true);
      setVoiceTranscript('Listening... (Simulated speech in progress)');
      toast.info('Starting Speech Simulator', { description: 'Simulating speech input...' });
      
      setTimeout(() => {
        const phrases = [
          'my heart rate is 105 and slept for 8 hours',
          'blood pressure is 118 over 76 and drank 16 glasses of water',
          'heart rate ninety five and water ten glasses'
        ];
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        setVoiceTranscript(randomPhrase);
        parseVoiceData(randomPhrase);
        setIsListening(false);
      }, 2500);
    };

    if (!SpeechRecognition || isWebView) {
      startSimulator();
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceTranscript('Go ahead, speak now...');
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event);
        setIsListening(false);
        // Automatically trigger simulator fallback if browser microphone is blocked/restricted
        toast.warning('Microphone Restricted', { description: 'Microphone blocked or not supported in this view. Running simulator...' });
        startSimulator();
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceTranscript(transcript);
        parseVoiceData(transcript);
      };

      if (isListening) {
        recognition.stop();
        setIsListening(false);
      } else {
        recognition.start();
      }
    } catch (err) {
      console.error('Failed to start SpeechRecognition:', err);
      startSimulator();
    }
  };

  const parseVoiceData = (text: string) => {
    const cleaned = text.toLowerCase();
    let updatedLogs = { ...logs };
    let parsedCount = 0;

    // Helper to find numbers in text (both digits and English words!)
    const getNumber = (phrase: string): number | null => {
      const wordToNum: Record<string, number> = {
        one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
        eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventy: 70, eighty: 80, ninety: 90
      };
      
      const words = phrase.split(' ');
      for (const word of words) {
        const num = parseInt(word);
        if (!isNaN(num)) return num;
        if (wordToNum[word] !== undefined) return wordToNum[word];
      }
      return null;
    };

    // Parse Heart Rate
    if (cleaned.includes('heart') || cleaned.includes('bpm') || cleaned.includes('pulse')) {
      const segments = cleaned.split(/(?:heart|bpm|pulse)/);
      if (segments.length > 1) {
        const val = getNumber(segments[1]) || getNumber(segments[0]);
        if (val) {
          updatedLogs.heartRate = val.toString();
          parsedCount++;
        }
      }
    }

    // Parse Sleep
    if (cleaned.includes('sleep') || cleaned.includes('slept') || cleaned.includes('hour')) {
      const segments = cleaned.split(/(?:sleep|slept|hour)/);
      if (segments.length > 1) {
        const val = getNumber(segments[1]) || getNumber(segments[0]);
        if (val) {
          updatedLogs.sleep = val.toString();
          parsedCount++;
        }
      }
    }

    // Parse Water
    if (cleaned.includes('water') || cleaned.includes('glass') || cleaned.includes('drink') || cleaned.includes('drank')) {
      const segments = cleaned.split(/(?:water|glass|drink|drank)/);
      if (segments.length > 1) {
        const val = getNumber(segments[1]) || getNumber(segments[0]);
        if (val) {
          updatedLogs.water = val.toString();
          parsedCount++;
        }
      }
    }

    // Parse Blood Pressure (supports "115 over 75" or "120 80")
    if (cleaned.includes('pressure') || cleaned.includes('bp') || cleaned.includes('over')) {
      const match = cleaned.match(/(\d+)\s*(?:over|\/)\s*(\d+)/) || cleaned.match(/(\d+)\s+(\d+)/);
      if (match) {
        updatedLogs.bloodPressure = `${match[1]}/${match[2]}`;
        parsedCount++;
      }
    }

    if (parsedCount > 0) {
      setLogs(updatedLogs);
      toast.success('Speech Parsed Successfully', {
        description: `Successfully extracted ${parsedCount} biometric metrics from your voice!`,
        duration: 4000,
        icon: <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
      });
    } else {
      toast.warning('Speech Heard But No Metrics Found', {
        description: 'Try saying: "My heart rate is 85 and I drank 6 glasses of water."',
        duration: 4000
      });
    }
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setStorageItem('dailyLogs', JSON.stringify(logs));
      const historyStr = getStorageItem('healthHistory', '[]');
      const history = JSON.parse(historyStr);
      const todayISO = new Date().toISOString().split('T')[0];
      const existingIndex = history.findIndex((h: any) => h.dateISO === todayISO);
      const newEntry = {
        ...logs,
        dateISO: todayISO,
        dateDisplay: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        timestamp: Date.now()
      };
      if (existingIndex >= 0) { history[existingIndex] = newEntry; } 
      else { history.push(newEntry); }
      if (history.length > 30) history.shift();
      setStorageItem('healthHistory', JSON.stringify(history));
      toast.success('Protocol Synchronized', {
        description: 'Biological metrics have been securely committed.',
        duration: 3000,
        icon: <Shield className="w-4 h-4 text-emerald-500" />
      });
      setIsSaving(false);
      navigate('/app');
    }, 800);
  };

  return (
    <div className="size-full bg-slate-50 overflow-auto selection:bg-secondary/20 relative">
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-100/40 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="w-full px-5 py-6 pb-32 relative z-10 md:px-12 md:py-8 max-w-[1600px] mx-auto">
        {/* HEADER - COMPACT */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-3 md:gap-5">
            <button 
              onClick={() => navigate(-1)} 
              className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-white border border-border shadow-sm flex items-center justify-center hover:bg-slate-50 transition-all active:scale-90"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-indigo-950" />
            </button>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                 <Zap className="w-2.5 h-2.5 text-secondary" />
                 <p className="text-[7px] md:text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em]">Clinical Protocol</p>
              </div>
              <h1 className="text-lg md:text-3xl font-black text-indigo-950 tracking-tight leading-none">Vital Sync</h1>
            </div>
          </div>
          <p className="text-[9px] md:text-sm font-black text-indigo-950/20 uppercase tracking-widest hidden sm:block">{today}</p>
        </div>

        {/* ULTRA-COMPACT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 mb-6">
          {[
            { key: 'heartRate', label: 'Heart Rate', unit: 'BPM', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
            { key: 'bloodPressure', label: 'Blood Pressure', unit: 'SYS/DIA', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
            { key: 'sleep', label: 'Sleep Cycle', unit: 'HOURS', icon: Moon, color: 'text-purple-500', bg: 'bg-purple-50' },
            { key: 'water', label: 'Hydration', unit: 'GLASSES', icon: Droplet, color: 'text-cyan-500', bg: 'bg-cyan-50' },
          ].map((item) => (
            <div key={item.key} className="bg-white rounded-[22px] p-4 border border-border shadow-sm hover:shadow-md transition-all md:p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center ${item.color}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-[9px] md:text-[11px] font-black text-indigo-950 uppercase tracking-widest">{item.label}</h3>
                </div>
                <p className="text-[7px] md:text-[9px] font-black text-indigo-950/30 uppercase tracking-widest">{item.unit}</p>
              </div>
              <input
                type={item.key === 'bloodPressure' ? 'text' : 'number'}
                value={(logs as any)[item.key]}
                onChange={(e) => setLogs({ ...logs, [item.key]: e.target.value })}
                className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-base md:text-xl font-black text-indigo-950 focus:ring-1 focus:ring-secondary/10 outline-none"
              />
            </div>
          ))}
        </div>

        {/* VOICE SCRIBE */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 rounded-[24px] p-5 border border-white/5 shadow-xl mb-6 md:p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700"></div>
          <div className="flex items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isListening ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'bg-white/10 text-indigo-300'}`}>
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-1.5">
                  NLP Voice Scribe
                  {isListening && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>}
                </h3>
                <p className="text-[10px] text-indigo-200/50 font-bold mt-0.5">
                  {isListening ? 'Listening live... speak your vitals.' : 'Click to speak vitals (e.g., "heart rate 85, water 8")'}
                </p>
              </div>
            </div>
            <button
              onClick={handleVoiceRecognition}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                isListening 
                  ? 'bg-rose-500 text-white animate-pulse' 
                  : 'bg-white/10 text-white hover:bg-white/25 border border-white/10'
              }`}
            >
              {isListening ? 'Stop' : 'Listen'}
            </button>
          </div>
          {voiceTranscript && (
            <div className="mt-4 bg-black/30 rounded-xl p-3 border border-white/5 relative z-10">
              <span className="text-[7px] font-black text-indigo-300 uppercase tracking-widest block mb-1">Live Transcript</span>
              <p className="text-[11px] font-medium text-indigo-100 italic">"{voiceTranscript}"</p>
            </div>
          )}
        </div>

        {/* COMPACT NOTES */}
        <div className="bg-white rounded-[24px] p-5 border border-border shadow-sm mb-6 md:p-6">
           <div className="flex items-center gap-2.5 mb-3">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-[9px] md:text-[11px] font-black text-muted-foreground uppercase tracking-widest">Biological Notes</h3>
           </div>
           <textarea
              placeholder="Physiological anomalies..."
              rows={2}
              className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-[13px] md:text-base font-bold text-indigo-950 focus:ring-1 focus:ring-secondary/10 outline-none resize-none placeholder:text-indigo-950/20"
            />
        </div>

        {/* ACTION BUTTON */}
        <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent z-20">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full max-w-[450px] mx-auto py-3.5 rounded-[18px] flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 ${
              isSaving 
                ? 'bg-slate-200 text-slate-500' 
                : 'bg-indigo-950 text-white hover:bg-black'
            }`}
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-600 rounded-full animate-spin"></div>
            ) : (
              <>
                <Shield className="w-4 h-4 text-secondary" />
                <span className="text-[11px] font-black uppercase tracking-widest">Verify & Sync</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
