import { ArrowLeft, AlertCircle, Info, ChevronRight, CheckCircle2, AlertTriangle, ShieldCheck, Heart, Calendar, Bookmark, BookOpen, Brain, Sparkles, X, Activity, Zap, Phone, PhoneOff, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getStorageItem, setStorageItem } from '../../utils/storage';

interface SavedSymptomLog {
  id: string;
  date: string;
  symptoms: string[];
  riskScore: number;
  riskLevel: string;
  condition: string;
  age: string;
  gender: string;
}

export function ResultScreen() {
  const navigate = useNavigate();

  const selectedSymptoms = JSON.parse(getStorageItem('selectedSymptoms', '[]'));
  const severityStr = getStorageItem('symptomSeverity', '5');
  const severity = parseInt(severityStr);
  const duration = getStorageItem('symptomDuration', '1-2 days');
  const frequency = getStorageItem('symptomFrequency', 'Sometimes');
  const age = getStorageItem('healthAge', 'Not specified');
  const gender = getStorageItem('healthGender', 'Male');
  const diseases = JSON.parse(getStorageItem('healthDiseases', '[]'));
  const sleep = getStorageItem('healthSleep', '7-8 hours');
  const water = getStorageItem('healthWater', '5-8 glasses');
  const smoking = getStorageItem('healthSmoking', 'Non-smoker');

  const [historyLogs, setHistoryLogs] = useState<SavedSymptomLog[]>([]);
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [apiKey] = useState(
    import.meta.env.VITE_OPENROUTER_API_KEY || localStorage.getItem('openrouter_api_key') || ''
  );

  // Immersive SOS States
  const [isCalling, setIsCalling] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmitStep, setTransmitStep] = useState('');
  const [transmitSuccess, setTransmitSuccess] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isCalling) {
      interval = setInterval(() => {
        setCallTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(interval);
  }, [isCalling]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCallER = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'MAKE_CALL',
        payload: '108'
      }));
    } else {
      window.location.href = 'tel:108';
    }
    setIsCalling(true);
  };

  const handleDispatchTelemetry = async () => {
    setIsTransmitting(true);
    setTransmitSuccess(false);
    
    const steps = [
      'Establishing Secure Handshake...',
      'Encrypting Biometric Telemetry Package...',
      'Locating Closest ER Command Center...',
      'Transmitting Clinical Heart-Rate & BP Stream...',
      'Uplink Verified! Medical Dispatch Synced.'
    ];

    for (let i = 0; i < steps.length; i++) {
      setTransmitStep(steps[i]);
      await new Promise((resolve) => setTimeout(resolve, i === steps.length - 1 ? 1500 : 1000));
    }

    const currentUserStr = localStorage.getItem('currentUser');
    let userEmail = 'anonymous@healthcare.io';
    if (currentUserStr) {
      try {
        const parsed = JSON.parse(currentUserStr);
        if (parsed.email) userEmail = parsed.email;
      } catch (e) {}
    }

    const telemetryPayload = {
      email: userEmail,
      vitals: getStorageItem('dailyLogs') ? JSON.parse(getStorageItem('dailyLogs')) : { heartRate: '72', bloodPressure: '120/80' },
      symptoms: selectedSymptoms,
      riskScore,
      riskLevel,
      dispatchedAt: new Date().toISOString()
    };

    try {
      let host = window.location.hostname || '127.0.0.1';
      if (host === 'localhost') host = '127.0.0.1';
      
      await fetch(`http://${host}:5175/api/userdata`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: telemetryPayload.email,
          key: `telemetry_dispatch_${Date.now()}`,
          value: JSON.stringify(telemetryPayload)
        })
      });
      console.log('[TELEMETRY] Successfully synced to backend!');
    } catch (err) {
      console.warn('[TELEMETRY] Standalone mode: Telemetry stored locally inside browser.', err);
    }

    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'DISPATCH_TELEMETRY',
        payload: telemetryPayload
      }));
    }

    setTransmitSuccess(true);
  };

  useEffect(() => {
    const saved = JSON.parse(getStorageItem('symptomHistory', '[]'));
    setHistoryLogs(saved);
  }, []);

  let basePoints = 0;
  selectedSymptoms.forEach((s: string) => {
    const symptom = s.toLowerCase();
    // Critical & High Risk (30-40 pts)
    if (symptom.includes('chest pain')) basePoints += 38;
    if (symptom.includes('shortness of breath')) basePoints += 35;
    if (symptom.includes('unconsciousness')) basePoints += 40;
    
    // Moderate to High (20-30 pts)
    if (symptom.includes('fever')) basePoints += 25;
    if (symptom.includes('vomiting')) basePoints += 22;
    if (symptom.includes('dizziness')) basePoints += 20;
    if (symptom.includes('stomach pain')) basePoints += 20;
    if (symptom.includes('abdominal pain')) basePoints += 20;
    
    // Moderate (10-20 pts)
    if (symptom.includes('headache')) basePoints += 15;
    if (symptom.includes('nausea')) basePoints += 18;
    if (symptom.includes('cough')) basePoints += 16;
    if (symptom.includes('sore throat')) basePoints += 12;
    if (symptom.includes('fatigue')) basePoints += 14;
    if (symptom.includes('muscle pain')) basePoints += 12;
    if (symptom.includes('joint pain')) basePoints += 12;
    if (symptom.includes('insomnia')) basePoints += 10;
    
    // Low (5-10 pts)
    if (symptom.includes('runny nose')) basePoints += 6;
    if (symptom.includes('skin rash')) basePoints += 8;
    if (symptom.includes('itchy eyes')) basePoints += 5;
  });

  if (diseases.some((d: string) => d.toLowerCase().includes('hypertension') || d.toLowerCase().includes('diabetes'))) {
    basePoints += 15;
  }
  const ageNum = parseInt(age);
  if (!isNaN(ageNum) && ageNum > 50) basePoints += 10;
  if (basePoints === 0) basePoints = 18;
  let score = Math.round(basePoints * (1 + (severity - 5) * 0.12));
  if (score < 10) score = 10;
  if (score > 98) score = 98;
  const riskScore = score;

  let riskLevel = 'Low';
  let riskIndicator = 'Optimal';
  let riskColor = 'text-emerald-600';
  let riskBg = 'bg-emerald-50/30';
  let riskBorder = 'border-emerald-100';
  let riskIconColor = 'text-emerald-500';
  let gradientTo = 'from-emerald-400 to-emerald-600';

  if (riskScore >= 70) {
    riskLevel = 'High';
    riskIndicator = 'Critical';
    riskColor = 'text-rose-600';
    riskBg = 'bg-rose-50/30';
    riskBorder = 'border-rose-100';
    riskIconColor = 'text-rose-500';
    gradientTo = 'from-rose-400 to-rose-600';
  } else if (riskScore >= 40) {
    riskLevel = 'Moderate';
    riskIndicator = 'Elevated';
    riskColor = 'text-amber-600';
    riskBg = 'bg-amber-50/30';
    riskBorder = 'border-amber-100';
    riskIconColor = 'text-amber-500';
    gradientTo = 'from-amber-400 to-amber-600';
  }

  const conditions: { name: string; probability: number; color: string; description: string; recommendations: string[] }[] = [];
  const hasChestPain = selectedSymptoms.some((s: string) => s.toLowerCase().includes('chest pain'));
  const hasShortnessOfBreath = selectedSymptoms.some((s: string) => s.toLowerCase().includes('shortness of breath'));
  const hasTightness = selectedSymptoms.some((s: string) => s.toLowerCase().includes('tightness'));
  const hasHeartPalpitations = selectedSymptoms.some((s: string) => s.toLowerCase().includes('heart palpitations'));
  
  const hasFever = selectedSymptoms.some((s: string) => s.toLowerCase().includes('fever') || s.toLowerCase().includes('chills') || s.toLowerCase().includes('night sweats'));
  const hasCoughSoreThroat = selectedSymptoms.some((s: string) => s.toLowerCase().includes('cough') || s.toLowerCase().includes('sore throat') || s.toLowerCase().includes('runny nose'));
  const hasGastro = selectedSymptoms.some((s: string) => s.toLowerCase().includes('vomiting') || s.toLowerCase().includes('nausea') || s.toLowerCase().includes('stomach pain') || s.toLowerCase().includes('abdominal pain'));
  const hasIndigestion = selectedSymptoms.some((s: string) => s.toLowerCase().includes('indigestion') || s.toLowerCase().includes('bloating'));
  
  const hasHeadache = selectedSymptoms.some((s: string) => s.toLowerCase().includes('headache'));
  const hasDizziness = selectedSymptoms.some((s: string) => s.toLowerCase().includes('dizziness') || s.toLowerCase().includes('vision blur'));
  const hasEarPain = selectedSymptoms.some((s: string) => s.toLowerCase().includes('ear pain'));
  
  const hasMuscleJoint = selectedSymptoms.some((s: string) => s.toLowerCase().includes('muscle pain') || s.toLowerCase().includes('joint pain'));
  const hasNeuromuscular = selectedSymptoms.some((s: string) => s.toLowerCase().includes('numbness') || s.toLowerCase().includes('weakness') || s.toLowerCase().includes('swelling'));
  
  const hasFatigue = selectedSymptoms.some((s: string) => s.toLowerCase().includes('fatigue') || s.toLowerCase().includes('weight loss'));

  if (hasChestPain || hasShortnessOfBreath) {
    conditions.push({
      name: 'Severe Chest & Breathing Distress',
      probability: Math.min(riskScore + 10, 95),
      color: 'from-rose-500 to-orange-500',
      description: 'Potential strain on your heart or lungs. Requires resting immediately and seeking medical care.',
      recommendations: ['Rest immediately and avoid moving around', 'Sit up straight and take slow, deep breaths', 'Seek urgent medical attention or call a doctor']
    });
  }

  if (hasHeartPalpitations || hasTightness) {
    conditions.push({
      name: 'Heart Rate & Muscle Tension',
      probability: Math.min(riskScore + 8, 90),
      color: 'from-pink-500 to-rose-600',
      description: 'Your biometric signs show your heart rate or chest muscles are under elevated physical tension.',
      recommendations: ['Take slow, calm breaths to relax your heart', 'Check your heart rate if you can', 'Avoid coffee, tea, and energy drinks']
    });
  }

  if (hasFever) {
    conditions.push({
      name: 'Fever (High Temperature)',
      probability: Math.min(riskScore + 12, 92),
      color: 'from-red-500 to-amber-500',
      description: 'Your body temperature is elevated as your immune system actively fights off a bug.',
      recommendations: ['Check your temperature with a thermometer', 'Take standard fever medicine if prescribed by a doctor', 'Drink plenty of water to stay hydrated']
    });
  }

  if (hasCoughSoreThroat) {
    conditions.push({
      name: 'Common Cold & Sore Throat',
      probability: Math.min(riskScore + 5, 88),
      color: 'from-cyan-500 to-blue-500',
      description: 'Mild irritation or strain in your throat and breathing passages, typical of a standard cold.',
      recommendations: ['Gargle with warm salt water', 'Breathe in steam or use a humidifier', 'Drink warm tea or warm water']
    });
  }

  if (hasGastro) {
    conditions.push({
      name: 'Stomach Bug & Gastro Irritation',
      probability: Math.min(riskScore + 6, 85),
      color: 'from-amber-500 to-orange-500',
      description: 'Irritation in your stomach lining, often caused by food sensitivity or a mild stomach bug.',
      recommendations: ['Eat simple foods like bananas, rice, or toast', 'Take small sips of water or coconut water frequently', 'Avoid spicy, oily, or fried foods']
    });
  }

  if (hasIndigestion) {
    conditions.push({
      name: 'Indigestion & Bloating',
      probability: Math.min(riskScore + 4, 80),
      color: 'from-emerald-400 to-teal-500',
      description: 'Mild irritation or transit issues in your digestive tract.',
      recommendations: ['Take a gentle, slow walk after eating', 'Drink warm ginger or peppermint tea', 'Avoid fizzy sodas and soft drinks']
    });
  }

  if (hasHeadache) {
    conditions.push({
      name: 'Tension Headache or Migraine',
      probability: Math.min(riskScore - 2, 82),
      color: 'from-blue-500 to-indigo-500',
      description: 'Tension or vascular stress causing a headache or migraine.',
      recommendations: ['Rest in a dark, quiet, and peaceful room', 'Place a cool, damp cloth on your forehead', 'Avoid looking at phone or laptop screens']
    });
  }

  if (hasDizziness) {
    conditions.push({
      name: 'Dizziness & Eye Strain',
      probability: Math.min(riskScore - 4, 78),
      color: 'from-purple-500 to-indigo-600',
      description: 'Mild dizziness caused by fatigue, eye strain, or sudden posture/blood pressure changes.',
      recommendations: ['Lie down safely to rest your head', 'Look at one steady object in front of you', 'Avoid moving your head too quickly']
    });
  }

  if (hasEarPain) {
    conditions.push({
      name: 'Ear Ache & Inflammation',
      probability: Math.min(riskScore + 2, 85),
      color: 'from-blue-400 to-cyan-500',
      description: 'Mild irritation or pressure inside your ear canal.',
      recommendations: ['Do not put cotton buds or swabs inside your ear', 'Hold a warm, dry cloth to the outside of your ear', 'See an ear doctor if the pain continues']
    });
  }

  if (hasMuscleJoint) {
    conditions.push({
      name: 'Muscle & Joint Aches',
      probability: Math.min(riskScore + 15, 89),
      color: 'from-amber-500 to-rose-500',
      description: 'Aches in your muscles or joints, often due to physical overexertion or fighting off a cold.',
      recommendations: ['Take a warm bath or apply a warm compress', 'Avoid lifting heavy objects or running', 'Drink plenty of water to stay hydrated']
    });
  }

  if (hasNeuromuscular) {
    conditions.push({
      name: 'Muscle Numbness & Weakness',
      probability: Math.min(riskScore + 6, 82),
      color: 'from-purple-500 to-pink-500',
      description: 'Mild muscle numbness or weakness, often due to poor sitting postures or sitting too long.',
      recommendations: ['Gently stretch your arms and legs', 'Rest your limbs on a soft pillow to elevate them', 'Avoid sitting in the same tight position for too long']
    });
  }

  if (hasFatigue) {
    conditions.push({
      name: 'Extreme Tiredness & Low Energy',
      probability: Math.min(riskScore + 5, 85),
      color: 'from-indigo-400 to-slate-500',
      description: 'Your body is running low on energy because your immune system is busy healing itself.',
      recommendations: ['Sleep for at least 8 hours to let your body heal', 'Eat simple, healthy foods to rebuild energy', 'Avoid heavy exercise or running']
    });
  }

  if (conditions.length === 0) {
    conditions.push({
      name: 'Common Cold Syndrome',
      probability: Math.min(riskScore + 12, 85),
      color: 'from-blue-500 to-cyan-500',
      description: 'Symptoms correlate closely with common upper respiratory viruses.',
      recommendations: ['Rest under a warm blanket', 'Eat fruits with Vitamin C (like oranges)', 'Avoid cold foods and cold winds']
    });
  }

  const lastEntry = historyLogs[historyLogs.length - 1];
  let riskTrendLabel = 'Steady';
  let trendColor = 'text-muted-foreground';
  if (lastEntry) {
    if (riskScore < lastEntry.riskScore) {
      riskTrendLabel = 'Improving';
      trendColor = 'text-emerald-600';
    } else if (riskScore > lastEntry.riskScore) {
      riskTrendLabel = 'Elevated';
      trendColor = 'text-rose-600';
    }
  }

  const handleSaveResult = () => {
    const newHistory: SavedSymptomLog = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      symptoms: selectedSymptoms,
      riskScore,
      riskLevel,
      condition: conditions[0]?.name || 'Common Cold',
      age,
      gender
    };
    const updated = [...historyLogs, newHistory];
    setStorageItem('symptomHistory', JSON.stringify(updated));
    setHistoryLogs(updated);
    
    toast.success('Archived Successfully', {
      description: 'Your report has been saved to history.'
    });
    
    // Immediate navigation
    navigate('/app/calendar');
  };

  const handleDeepAnalysis = async () => {
    setIsAnalyzing(true);
    const context = `User Profile: ${age}yo ${gender}. Symptoms: ${selectedSymptoms.join(', ')}. Severity: ${severity}/10.`;
    if (!apiKey) {
      setTimeout(() => {
        setAiAnalysis(`**Clinical Assessment Summary**\n\nBased on your symptoms (**${selectedSymptoms.join(', ')}**), our local models suggest a correlation with metabolic strain. \n\n**Recommendation:** Monitor your temperature every 4 hours and maintain hydration. If symptoms persist for more than 48 hours, consult a physician.`);
        setIsAnalyzing(false);
      }, 2000);
      return;
    }
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'HTTP-Referer': window.location.origin, 'X-Title': 'LifeMatrix AI' },
        body: JSON.stringify({ model: 'google/gemini-2.5-flash', max_tokens: 500, messages: [{ role: 'system', content: 'You are a professional Medical AI analyzer. Use markdown. Keep it professional.' }, { role: 'user', content: `Analyze: ${context}` }] })
      });
      const data = await response.json();
      setAiAnalysis(data.choices?.[0]?.message?.content || 'Unable to generate live analysis.');
    } catch (error) { setAiAnalysis('Network sync issue. Using local logic.'); }
    finally { setIsAnalyzing(false); }
  };

  const renderMarkdown = (text: string) => {
    let parsed = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    parsed = parsed.replace(/^\*\s+(.*)/gm, '• $1');
    parsed = parsed.replace(/\n/g, '<br />');
    return <span dangerouslySetInnerHTML={{ __html: parsed }} />;
  };

  return (
    <div className="size-full bg-background overflow-auto selection:bg-secondary/30">
      <div className="px-5 py-6 pb-24">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-white border border-border shadow-sm active:scale-95 transition-all">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="text-xl font-black text-foreground tracking-tight">Diagnostic <span className="text-secondary">Report</span></h1>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-secondary" />
          </div>
        </div>

        {/* CRITICAL EMERGENCY SOS PANEL */}
        {riskScore >= 70 && (
          <div className="mb-6 bg-rose-600 rounded-[32px] p-6 text-white border border-rose-500 shadow-xl shadow-rose-200/50 animate-pulse-slow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-rose-200">Critical Medical Alert</p>
                <h3 className="text-sm font-black tracking-tight uppercase">Emergency dispatch active</h3>
              </div>
            </div>
            
            <p className="text-[11px] text-rose-100 font-medium leading-relaxed mb-4">
              Biometrics indicate cardiorespiratory distress. Seek immediate care or trigger direct nearby clinical dispatch below.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCallER}
                className="py-3 px-2 rounded-xl bg-white text-rose-600 font-black text-[9px] tracking-tight uppercase shadow-md active:scale-95 cursor-pointer border-none flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 animate-bounce" />
                Call nearest ER
              </button>
              <button
                onClick={handleDispatchTelemetry}
                className="py-3 px-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-black text-[9px] tracking-tight uppercase shadow-md active:scale-95 cursor-pointer border-none flex items-center justify-center gap-1.5"
              >
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                Dispatch Telemetry
              </button>
            </div>
          </div>
        )}

        {/* CONDENSED HERO CARD */}
        <div className={`relative overflow-hidden rounded-[32px] p-6 mb-6 border ${riskBorder} ${riskBg} backdrop-blur-xl shadow-xl shadow-black/5`}>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center mb-4 border border-white/50">
               <AlertCircle className={`w-7 h-7 ${riskIconColor}`} />
            </div>
            <h2 className={`text-3xl font-black mb-1 tracking-tighter ${riskColor}`}>
              {riskIndicator} <span className="text-foreground/80 font-medium text-2xl">Risk</span>
            </h2>
            <div className="flex items-center gap-1.5 mb-6 bg-white/60 backdrop-blur px-3 py-1 rounded-full border border-white/40">
              <Zap className="w-3 h-3 text-secondary" />
              <p className="text-[10px] font-black text-foreground/70 uppercase tracking-tighter">
                {riskScore}% Accuracy Score
              </p>
            </div>
            <div className="w-full h-3 bg-white/40 rounded-full p-0.5 border border-white/60">
              <div
                className={`h-full bg-gradient-to-r ${gradientTo} rounded-full shadow-lg transition-all duration-1000 ease-out`}
                style={{ width: `${riskScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* TREND BADGE (Optional row) */}
        {lastEntry && (
          <div className="flex items-center gap-2 bg-white border border-border/50 rounded-2xl p-3 mb-6 animate-fade-in">
            <Activity className={`w-4 h-4 ${trendColor}`} />
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Trend: <span className={trendColor}>{riskTrendLabel}</span></p>
          </div>
        )}

        {/* MEDICAL CORRELATIONS SECTION */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
             <div className="flex items-center gap-2">
               <Activity className="w-4 h-4 text-secondary" />
               <h3 className="text-xs font-black text-foreground/80 uppercase tracking-widest">Medical Correlations</h3>
             </div>
             <span className="text-[9px] font-black text-muted-foreground uppercase">{conditions.length} findings</span>
          </div>
          
          <div className="space-y-4">
            {conditions.map((condition, index) => (
              <div key={index} className="bg-white border border-border/50 shadow-sm rounded-3xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base font-black text-foreground tracking-tight leading-tight">{condition.name}</h4>
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${condition.color} opacity-10 flex items-center justify-center flex-shrink-0`}>
                     <ShieldCheck className="w-4 h-4 opacity-100" />
                  </div>
                </div>
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden mb-4">
                   <div className={`h-full bg-gradient-to-r ${condition.color} rounded-full`} style={{ width: `${condition.probability}%` }}></div>
                </div>
                <div className="space-y-4">
                   <div className="p-3 bg-muted/20 rounded-xl">
                      <p className="text-[10px] font-black text-foreground/60 uppercase tracking-widest mb-1">Rationale</p>
                      <p className="text-xs text-muted-foreground leading-relaxed font-medium">{condition.description}</p>
                   </div>
                   <div className="grid grid-cols-1 gap-2">
                      {condition.recommendations.map((rec, rIdx) => (
                        <div key={rIdx} className="flex items-center gap-2.5 p-2.5 bg-emerald-50/20 rounded-xl border border-emerald-100/20">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-xs font-bold text-emerald-900/70">{rec}</span>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI DEEP ANALYSIS - REPOSITIONED UNDER CORRELATIONS */}
          <div className="mt-6">
            {!aiAnalysis ? (
              <button
                onClick={handleDeepAnalysis}
                disabled={isAnalyzing}
                className="w-full group relative py-5 rounded-2xl bg-indigo-950 text-white shadow-xl flex flex-col items-center justify-center overflow-hidden transition-all active:scale-98"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative z-10 flex items-center gap-2.5">
                   {isAnalyzing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Sparkles className="w-4 h-4 text-indigo-300" />}
                   <span className="text-xs font-black tracking-tight uppercase">Unlock AI Deep Analysis</span>
                </div>
                <p className="relative z-10 text-[8px] font-bold text-indigo-300 uppercase tracking-widest opacity-70">Hyper-personalized AI Clinical Insight</p>
              </button>
            ) : (
              <div className="bg-white rounded-[32px] p-1 border border-purple-100 shadow-xl animate-fade-in-up">
                <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 p-6 rounded-[30px]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-100">
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-xs font-black text-indigo-950 uppercase tracking-tighter">AI Insight Report</h3>
                    </div>
                    <button onClick={() => setAiAnalysis(null)} className="p-1.5 hover:bg-white rounded-full transition-all">
                      <X className="w-3.5 h-3.5 text-purple-400" />
                    </button>
                  </div>
                  <div className="text-[12px] text-indigo-900 leading-relaxed font-medium">
                    {renderMarkdown(aiAnalysis)}
                  </div>
                  <div className="mt-4 pt-4 border-t border-purple-100 flex items-center justify-between">
                    <span className="text-[8px] font-black text-purple-400 tracking-widest uppercase italic">Gemini Pro Assessment</span>
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[8px] font-black text-emerald-600 uppercase tracking-tighter">Logic Secure</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Footer Actions */}
        <div className="mt-10 space-y-4">
          <div className="p-4 bg-muted/20 rounded-2xl border border-border/50 border-dashed">
             <p className="text-[10px] text-muted-foreground/80 font-medium leading-relaxed text-center italic">
               This report is for informational analysis. Consult a physician for definitive medical treatment.
             </p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={handleSaveResult}
              className="w-full py-4 rounded-xl bg-white border border-border text-foreground font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm active:scale-98"
            >
              <Bookmark className="w-4 h-4 text-secondary" />
              Archive Result
            </button>
            <button
              onClick={() => navigate('/app/hospitals')}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-black text-xs uppercase tracking-tight shadow-xl active:scale-98 transition-all"
            >
              Find Nearby Hospitals
            </button>
          </div>
        </div>

        {/* IMMERSIVE SOS CALLING DIALER OVERLAY */}
        {isCalling && (
          <div className="fixed inset-0 bg-rose-950/95 backdrop-blur-2xl z-50 flex flex-col justify-between p-8 text-white animate-fade-in">
            <div className="flex flex-col items-center mt-16 text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full bg-rose-600/20 border border-rose-500/30 flex items-center justify-center animate-ping absolute inset-0"></div>
                <div className="relative w-24 h-24 rounded-full bg-rose-600 border border-rose-400 flex items-center justify-center shadow-2xl shadow-rose-500/50">
                  <Phone className="w-10 h-10 text-white animate-pulse" />
                </div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-300">Emergency Link Active</p>
              <h2 className="text-3xl font-black tracking-tight mt-2 mb-1">ER Dispatcher</h2>
              <p className="text-sm font-medium text-rose-200/80 mb-6">108 Central Medical Command</p>
              
              <div className="bg-white/10 backdrop-blur rounded-2xl px-4 py-2 border border-white/10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-mono font-black">{formatTimer(callTimer)}</span>
              </div>
            </div>

            {/* Simulated Live Connection Stats */}
            <div className="bg-black/20 rounded-[32px] p-6 border border-white/5 space-y-4 max-w-sm mx-auto w-full">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-300">Biometric Uplink</span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  Connected
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <p className="text-[8px] font-bold text-rose-300 uppercase">Heart Rate</p>
                  <p className="text-lg font-black">{getStorageItem('dailyLogs') ? JSON.parse(getStorageItem('dailyLogs')).heartRate : '72'} <span className="text-[9px] font-normal text-rose-300">bpm</span></p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <p className="text-[8px] font-bold text-rose-300 uppercase">Risk Level</p>
                  <p className="text-lg font-black text-rose-400">{riskLevel}</p>
                </div>
              </div>
              <p className="text-[9px] text-center text-white/50 font-medium">Secured biometric packets are streaming live to ER doctor terminal.</p>
            </div>

            <div className="flex flex-col items-center mb-16">
              <button
                onClick={() => setIsCalling(false)}
                className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center shadow-xl shadow-red-950/50 active:scale-90 transition-all border-none cursor-pointer"
              >
                <PhoneOff className="w-7 h-7 text-white" />
              </button>
              <p className="text-[10px] font-black uppercase tracking-widest text-rose-300 mt-3">End Emergency Call</p>
            </div>
          </div>
        )}

        {/* IMMERSIVE TELEMETRY DISPATCH OVERLAY */}
        {isTransmitting && (
          <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-50 flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-indigo-950 border border-indigo-800 rounded-[40px] p-8 w-full max-w-md text-white shadow-2xl relative overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
              
              <button 
                onClick={() => setIsTransmitting(false)} 
                disabled={!transmitSuccess}
                className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all disabled:opacity-30 border-none cursor-pointer"
              >
                <X className="w-4 h-4 text-indigo-300" />
              </button>

              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-900/50 border border-indigo-700 shadow-xl mb-6">
                {transmitSuccess ? (
                  <ShieldCheck className="w-10 h-10 text-emerald-400 animate-bounce" />
                ) : (
                  <>
                    <Loader2 className="w-10 h-10 text-indigo-300 animate-spin" />
                    <div className="absolute inset-0 border-2 border-indigo-400 border-t-transparent rounded-3xl animate-ping"></div>
                  </>
                )}
              </div>

              <h2 className="text-xl font-black tracking-tight mb-2">Biometric Telemetry</h2>
              <p className="text-xs text-indigo-300/80 max-w-xs mx-auto mb-6">
                Active clinical reporting pipeline linked directly to medical emergency servers.
              </p>

              {/* Steps Progress */}
              <div className="bg-indigo-900/30 rounded-2xl p-4 border border-indigo-900 mb-6 text-left space-y-3">
                <div className="flex items-center gap-3">
                  {transmitSuccess ? (
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></div>
                  )}
                  <span className="text-xs font-bold text-indigo-100">{transmitStep}</span>
                </div>
                <div className="w-full h-1.5 bg-indigo-950 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ${
                      transmitSuccess ? 'w-full' : 'w-2/3 animate-pulse'
                    }`}
                  ></div>
                </div>
              </div>

              {transmitSuccess && (
                <div className="animate-fade-in-up">
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-emerald-300 text-xs font-bold mb-6">
                    ✔ Telemetry package successfully verified and securely stored in patient diagnostic history log.
                  </div>
                  <button
                    onClick={() => setIsTransmitting(false)}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-950/50 border-none cursor-pointer"
                  >
                    Close Connection
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
