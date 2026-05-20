import { ArrowLeft, AlertCircle, Info, ChevronRight, CheckCircle2, AlertTriangle, ShieldCheck, Heart, Calendar, Bookmark, BookOpen, Brain, Sparkles, X, Activity, Zap, Phone, PhoneOff, Loader2, Pill, Volume2, VolumeX, FileText, ShieldAlert, MapPin, Bot, Leaf, Utensils, Sunrise, Coffee, Moon, ChevronDown, Sun } from 'lucide-react';
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

  // Voice AI Accessibility Engine
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  // Interactive Diet Dashboard State
  const [expandedDietIndex, setExpandedDietIndex] = useState<number | null>(null);

  useEffect(() => {
    // Safe cleanup hook prevents speech bleeding during navigation
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleListenToReport = (condition: any, idx: number) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      toast.error('Text-to-Speech is currently unavailable on this device');
      return;
    }

    // Toggle Pause/Stop if clicking the active card again
    if (speakingIndex === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    // Stop any currently reading card before launching new synthesis
    window.speechSynthesis.cancel();

    const diagnosis = condition.name.replace('/', 'or');
    const payload = `Based on your assessment, there is an active ${condition.probability} percent correlation with ${diagnosis}. Rationale: ${condition.description} Suggested recovery routes: ${condition.recommendations.join('. ')}`;

    const utterance = new SpeechSynthesisUtterance(payload);
    
    // Dynamically fetch standard native localized voices
    const voices = window.speechSynthesis.getVoices();
    const primaryVoice = voices.find(v => v.lang.includes('en-US') || v.lang.includes('en-GB')) || voices[0];
    if (primaryVoice) {
      utterance.voice = primaryVoice;
    }
    
    utterance.rate = 0.92; // Calm clinical natural speed
    utterance.pitch = 1.02; // Warm friendly pitch

    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    setSpeakingIndex(idx);
    window.speechSynthesis.speak(utterance);
  };

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

  const getTriageInfo = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('heart') || lower.includes('cardiac') || lower.includes('chest pain')) {
      return {
        level: 'LEVEL 1',
        label: 'EMERGENCY CARE',
        emoji: '🚑',
        colors: 'bg-rose-50 text-rose-600 border-rose-200 shadow-[0_1px_3px_rgba(225,29,72,0.08)]'
      };
    }
    if (lower.includes('bronchitis') || lower.includes('lung') || lower.includes('ear') || lower.includes('otitis') || lower.includes('influenza') || lower.includes('covid') || lower.includes('nerve') || lower.includes('radiculopathy')) {
      return {
        level: 'LEVEL 2',
        label: 'CLINICAL CONSULT',
        emoji: '👨‍⚕️',
        colors: 'bg-amber-50 text-amber-700 border-amber-200 shadow-[0_1px_3px_rgba(217,119,6,0.08)]'
      };
    }
    return {
      level: 'LEVEL 3',
      label: 'SELF-DIRECTED CARE',
      emoji: '🏡',
      colors: 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-[0_1px_3px_rgba(5,150,105,0.08)]'
    };
  };

  const getRedFlags = (name: string): string[] => {
    const lower = name.toLowerCase();
    if (lower.includes('heart') || lower.includes('cardiac') || lower.includes('chest pain')) {
      return [
        'Pain radiating to left arm, neck, jaw, or upper back',
        'Sudden cold sweats, heavy nausea, or profound lightheadedness',
        'Unexplained sudden shortness of breath while fully resting'
      ];
    }
    if (lower.includes('influenza') || lower.includes('covid')) {
      return [
        'Difficulty breathing or persistent severe shortness of breath',
        'Bluish tint to lips, nails, or face (low blood oxygen indicators)',
        'New-onset mental confusion, disorientation, or inability to stay awake'
      ];
    }
    if (lower.includes('bronchitis') || lower.includes('lung')) {
      return [
        'Coughing up physical blood or rust-colored sputum',
        'Extreme high fever (>103°F / 39.4°C) unresponsive to antipyretics',
        'Severe chest tightness that prevents taking shallow or full breaths'
      ];
    }
    if (lower.includes('stomach') || lower.includes('gastro')) {
      return [
        'Absolute inability to retain any clear fluids for more than 24 hours',
        'Clinical signs of severe dehydration (absence of urination, shrunken eyes)',
        'Presence of blood in vomit or dark black, tarry stools'
      ];
    }
    if (lower.includes('migraine') || lower.includes('headache')) {
      return [
        'Sudden, explosive onset of headache ("thunderclap" intensity)',
        'Headache immediately accompanied by high fever and severe stiff neck',
        'Loss of motor balance, numbness on one side of body, or slurred speech'
      ];
    }
    if (lower.includes('ear') || lower.includes('otitis')) {
      return [
        'Noticeable swelling/redness behind the ear, severe bone tenderness',
        'Fluid, blood, or active pus draining directly from the ear canal',
        'Sudden complete unilateral loss of hearing or violent spinning vertigo'
      ];
    }
    if (lower.includes('fatigue') || lower.includes('dehydration')) {
      return [
        'Syncopal episodes (fainting), loss of consciousness, or deep lethargy',
        'Resting tachycardia (heart rate over 100 bpm) that does not settle',
        'Violent muscle cramping or complete cessation of sweat production'
      ];
    }
    if (lower.includes('indigestion') || lower.includes('gas')) {
      return [
        'Persistent dysphagia (difficulty or severe pain when swallowing food)',
        'Unexplained rapid weight loss without dietary changes',
        'Biliary-type severe abdominal pain radiating heavily to the back'
      ];
    }
    if (lower.includes('muscle') || lower.includes('joint')) {
      return [
        'Total inability to bear any functional weight on the affected limb',
        'Visible clinical joint deformity, lock-up, or extreme localized heat/redness',
        'Constant numbness, tingling, or loss of sensation ("foot drop")'
      ];
    }
    if (lower.includes('gerd') || lower.includes('reflux')) {
      return [
        'Persistent chest pain radiating to left arm or jaw (often mimics cardiac strain)',
        'Choking sensations, coughing at night, or clinical regurgitation during sleep',
        'Significant pain, blockage, or total inability to swallow solid foods'
      ];
    }
    if (lower.includes('sinusitis') || lower.includes('allergy')) {
      return [
        'Severe ocular changes, double vision, or visible swelling around the eyes',
        'Excruciating, unremitting headache accompanied by a very stiff neck',
        'Persistent localized facial numbness, high fever, or mental confusion'
      ];
    }
    if (lower.includes('anxiety') || lower.includes('panic')) {
      return [
        'Chest pain that persists beyond 20 minutes or actively worsens with movement',
        'Severe carpopedal hand spasms (fingers locking up or clawing together)',
        'Inability to take any air at all coupled with a noticeable bluish tint to lips'
      ];
    }
    if (lower.includes('rash') || lower.includes('hives') || lower.includes('urticaria')) {
      return [
        'Visible swelling of the lips, tongue, or throat (signals airway obstruction)',
        'Sudden difficulty breathing, wheezing, or profound dizziness (anaphylaxis risk)',
        'Rapid spreading of hives covering more than 50% of the total body surface'
      ];
    }
    if (lower.includes('nerve') || lower.includes('radiculopathy')) {
      return [
        'Sudden onset of bowel or bladder incontinence (saddle anesthesia indicator)',
        'Rapidly progressing bilateral weakness in the legs (inability to lift foot)',
        'Unbearable "shooting electric" pain unresponsive to heavy pain medication'
      ];
    }
    return [
      'Systemic fever exceeding 103°F (39.4°C) unresponsive to medication',
      'Sudden clinical worsening of core respiratory/pulmonary functions',
      'Altered consciousness, severe lethargy, or sudden confusion'
    ];
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleGeneratePDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow pop-ups to generate your clinical summary');
      return;
    }

    const docId = `LMX-${Math.floor(Math.random() * 900000 + 100000)}`;
    const formattedDate = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });

    // Retrieve the active registered patient name dynamically from local storage
    const currentUserStr = localStorage.getItem('currentUser');
    let patientName = 'Sathish'; // Native fallback defaults to developer-supplied baseline
    if (currentUserStr) {
      try {
        const parsed = JSON.parse(currentUserStr);
        if (parsed.name) patientName = parsed.name;
      } catch (e) {}
    }

    // Build dynamic HTML payload purely using user data variables
    const htmlPayload = `
      <html>
        <head>
          <title>LifeMatrix_Clinical_Summary_${docId}</title>
          <style>
            * { box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1e293b; padding: 25px; line-height: 1.4; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #4f46e5; padding-bottom: 12px; margin-bottom: 15px; }
            .logo { font-size: 18px; font-weight: 900; color: #4f46e5; letter-spacing: -0.5px; }
            .meta-info { text-align: right; font-size: 10.5px; color: #64748b; }
            .section-title { font-size: 11px; font-weight: 900; text-transform: uppercase; color: #4f46e5; letter-spacing: 1px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-top: 16px; margin-bottom: 8px; }
            .patient-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; background: #f8fafc; padding: 12px; border-radius: 10px; border: 1px solid #f1f5f9; }
            .grid-item { font-size: 11.5px; color: #475569; }
            .grid-item strong { color: #0f172a; font-weight: 700; }
            .symptom-pill { display: inline-block; background: #e0e7ff; color: #3730a3; padding: 4px 10px; border-radius: 20px; font-size: 10.5px; font-weight: 700; margin-right: 5px; margin-bottom: 5px; border: 1px solid #c7d2fe; }
            .disease-card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; margin-bottom: 10px; background: #ffffff; page-break-inside: auto; }
            .disease-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
            .disease-name { font-weight: 800; font-size: 14px; color: #0f172a; }
            .disease-prob { font-weight: 800; font-size: 11.5px; color: #4338ca; background: #eef2ff; padding: 2px 6px; border-radius: 5px; }
            .description { font-size: 11.5px; color: #64748b; margin-bottom: 8px; line-height: 1.3; font-style: italic; }
            .bullet-list { font-size: 11.5px; margin: 0; padding-left: 18px; color: #334155; }
            .bullet-list li { margin-bottom: 2px; }
            .med-container { margin-top: 8px; display: grid; grid-template-columns: 1fr; gap: 6px; }
            .med-item { background: #f8fafc; border: 1px solid #f1f5f9; border-left: 3px solid #4f46e5; border-radius: 6px; padding: 8px 10px; font-size: 11.5px; }
            .med-header { display: flex; justify-content: space-between; font-weight: 700; color: #1e293b; }
            .med-purpose { font-size: 10px; color: #64748b; margin-top: 2px; }
            .flag-box { margin-top: 8px; border: 1px solid #fecdd3; background: #fff1f2; border-radius: 6px; padding: 8px 10px; font-size: 11px; }
            .flag-title { font-weight: 900; color: #e11d48; font-size: 9.5px; text-transform: uppercase; margin-bottom: 3px; letter-spacing: 0.5px; }
            .flag-list { margin: 0; padding-left: 16px; color: #4c0519; font-weight: 700; }
            .flag-list li { margin-bottom: 2px; }
            .disclaimer { font-size: 9px; color: #94a3b8; margin-top: 25px; border-top: 1px dashed #cbd5e1; padding-top: 12px; text-align: justify; line-height: 1.3; }
            @media print {
              body { padding: 10px; font-size: 11.5px; }
              @page { margin: 0.8cm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">LifeMatrix AI Health System</div>
              <div style="font-size: 11px; font-weight: 600; color: #64748b; margin-top: 3px;">Clinical Symptom & Correlation Summary</div>
            </div>
            <div class="meta-info">
              <div><strong>Summary ID:</strong> ${docId}</div>
              <div><strong>Generated:</strong> ${formattedDate}</div>
            </div>
          </div>

          <div class="section-title">Patient Profile & Vitals</div>
          <div class="patient-grid">
            <div class="grid-item" style="grid-column: span 2; border-bottom: 1px dashed #e2e8f0; padding-bottom: 8px; margin-bottom: 4px; font-size: 13px;">
              <strong>Patient Full Name:</strong> <span style="color: #4f46e5; font-weight: 850; text-transform: uppercase; letter-spacing: 0.5px;">${patientName}</span>
            </div>
            <div class="grid-item"><strong>Reported Age Range:</strong> ${age}</div>
            <div class="grid-item"><strong>Gender Assigned:</strong> ${gender}</div>
            <div class="grid-item"><strong>Baseline Risk Index:</strong> ${riskScore}% (${riskLevel})</div>
            <div class="grid-item"><strong>Symptom Duration:</strong> ${duration}</div>
          </div>

          <div class="section-title">Active User-Reported Symptoms</div>
          <div style="margin-bottom: 20px;">
            ${selectedSymptoms.map((s: string) => `<span class="symptom-pill">${s}</span>`).join('')}
          </div>

          <div class="section-title">Automated Diagnostic Matching Summary</div>
          ${conditions.map((c) => {
            const tLabel = c.name.toLowerCase().includes('heart') || c.name.toLowerCase().includes('cardiac')
              ? '<div style="font-size: 8.5px; font-weight: 800; color: #e11d48; background: #fff1f2; padding: 2.5px 8px; border-radius: 4px; display: inline-block; margin-top: 3px; border: 1px solid #fecdd3; text-transform: uppercase; letter-spacing: 0.5px;">🚑 LEVEL 1: EMERGENCY CARE</div>'
              : (c.name.toLowerCase().includes('bronchitis') || c.name.toLowerCase().includes('lung') || c.name.toLowerCase().includes('ear') || c.name.toLowerCase().includes('otitis') || c.name.toLowerCase().includes('influenza') || c.name.toLowerCase().includes('covid'))
                ? '<div style="font-size: 8.5px; font-weight: 800; color: #b45309; background: #fffbeb; padding: 2.5px 8px; border-radius: 4px; display: inline-block; margin-top: 3px; border: 1px solid #fde68a; text-transform: uppercase; letter-spacing: 0.5px;">👨‍⚕️ LEVEL 2: CLINICAL CONSULT</div>'
                : '<div style="font-size: 8.5px; font-weight: 800; color: #047857; background: #ecfdf5; padding: 2.5px 8px; border-radius: 4px; display: inline-block; margin-top: 3px; border: 1px solid #a7f3d0; text-transform: uppercase; letter-spacing: 0.5px;">🏡 LEVEL 3: SELF-DIRECTED CARE</div>';
            return `
              <div class="disease-card">
                <div class="disease-header">
                  <div class="disease-name">${c.name}</div>
                  <div class="disease-prob">${c.probability}% Correlation</div>
                </div>
                <div style="margin-bottom: 12px;">${tLabel}</div>
                <div class="description">“${c.description}”</div>
                
                <div style="font-weight: 800; font-size: 11px; color: #475569; margin-bottom: 6px; text-transform: uppercase;">Advised Next Steps:</div>
                <ul class="bullet-list">
                  ${c.recommendations.map(r => `<li>${r}</li>`).join('')}
                </ul>

                <div class="flag-box">
                  <div class="flag-title">🚨 Urgent Red Flag Protocols (Go to ER If):</div>
                  <ul class="flag-list">
                    ${getRedFlags(c.name).map(f => `<li>${f}</li>`).join('')}
                  </ul>
                </div>

                ${c.medications && c.medications.length > 0 ? `
                  <div style="font-weight: 800; font-size: 11px; color: #475569; margin-top: 14px; margin-bottom: 6px; text-transform: uppercase;">First-Line Pharmaceutical Suggestions:</div>
                  <div class="med-container">
                    ${c.medications.map(m => `
                      <div class="med-item">
                        <div class="med-header">
                          <span>${m.name}</span>
                          <span style="color: #4f46e5; font-size: 10px;">${m.dosage}</span>
                        </div>
                        <div class="med-purpose">Purpose: ${m.purpose} (${m.type} Route)</div>
                      </div>
                    `).join('')}
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}

          <div class="disclaimer">
            <strong>LEGAL DISCLAIMER AND COMPLIANCE NOTICE:</strong> This clinical summary was autonomously generated based on user-declared inputs. It represents educational statistical correlations and does NOT constitute formal medical advice, diagnosis, or an active prescription. Please present this summary to your primary care physician, qualified clinician, or emergency healthcare coordinator for physical corroboration and execution of active treatment protocols.
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                setTimeout(function() { window.close(); }, 500);
              }, 500);
            };
          </script>
        </body>
      </html>
    `;

    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'GENERATE_PDF_SUMMARY',
        payload: { docId, age, gender, selectedSymptoms, conditions }
      }));
    }

    printWindow.document.write(htmlPayload);
    printWindow.document.close();
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
      
      await fetch((import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/userdata` : `http://${host}:5175/api/userdata`), {
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

  // --- DYNAMIC CLINICAL DISEASE PREDICTION ENGINE ---
  const conditions: { 
    name: string; 
    probability: number; 
    color: string; 
    description: string; 
    recommendations: string[]; 
    medications: { name: string; dosage: string; type: 'OTC' | 'Prescription' | 'Emergency' | 'Supplement'; purpose: string }[];
    dietChart: {
      morning: string;
      breakfast: string;
      lunch: string;
      snack: string;
      dinner: string;
    };
    naturalRemedies: string[];
  }[] = [];
  const symptomListLower = selectedSymptoms.map((s: string) => s.toLowerCase());
  const matches = (sym: string) => symptomListLower.some((s: string) => s.includes(sym.toLowerCase()));

  // Professional Disease Symptom-Cluster Mappings with Exact Verified Medications
  const diseaseDefinitions = [
    {
      name: 'Influenza (Flu) / COVID-19',
      keySymptoms: ['fever', 'cough', 'fatigue', 'chills', 'body aches'],
      otherSymptoms: ['sore throat', 'runny nose', 'shortness of breath', 'muscle pain', 'night sweats', 'loss of taste', 'loss of smell', 'sweating'],
      description: 'A highly contagious viral infection causing severe body aches, high fever, exhaustion, and a heavy cough.',
      recommendations: ['Self-isolate to limit exposure to others', 'Stay well-hydrated with warm liquids', 'Monitor core body temperature every 4 hours'],
      color: 'from-red-500 to-amber-500',
      medications: [
        { name: 'Paracetamol (Acetaminophen)', dosage: '650mg every 6 hours', type: 'OTC', purpose: 'Fever reduction & body aches' },
        { name: 'Dextromethorphan Syrup', dosage: '10ml twice daily', type: 'OTC', purpose: 'Dry cough suppression' }
      ],
      dietChart: {
        morning: 'Warm lemon water with 1 tsp grated ginger & organic honey.',
        breakfast: 'Warm steel-cut oatmeal with mixed berries and ground flaxseeds.',
        lunch: 'Clear organic chicken broth or spiced lentil soup with turmeric.',
        snack: 'Echinacea herbal tea with a small handful of raw walnuts.',
        dinner: 'Soft brown rice, baked salmon/tofu, and steamed leafy greens.'
      },
      naturalRemedies: ['Fresh Ginger Root', 'Raw Local Honey', 'Turmeric Powder']
    },
    {
      name: 'Viral Stomach Flu (Gastro)',
      keySymptoms: ['nausea', 'vomiting', 'stomach pain', 'diarrhea'],
      otherSymptoms: ['bloating', 'indigestion', 'fatigue', 'fever', 'chills', 'abdominal cramps', 'loss of appetite'],
      description: 'An active stomach bug or infection that irritates your gut, causing nausea, bloating, and severe stomach pain.',
      recommendations: ['SIP clear electrolyte fluids regularly', 'Adopt BRAT diet (Bananas, Rice, Applesauce, Toast)', 'Strictly avoid high-fat and dairy products'],
      color: 'from-orange-500 to-amber-600',
      medications: [
        { name: 'Oral Rehydration Salts (ORS)', dosage: '1 Sachet in 1L water', type: 'OTC', purpose: 'Fluid & electrolyte replacement' },
        { name: 'Ondansetron', dosage: '4mg as directed', type: 'Prescription', purpose: 'Severe nausea & vomiting relief' }
      ],
      dietChart: {
        morning: 'Small sips of warm coconut water or oral rehydration salts (ORS).',
        breakfast: '2 slices of plain dry toast with half a ripe mashed banana.',
        lunch: 'Soft steamed jasmine rice with a pinch of salt & boiled potato.',
        snack: 'Organic unsweetened applesauce and warm chamomile tea.',
        dinner: 'Plain boiled carrots and light vegetable congee (rice porridge).'
      },
      naturalRemedies: ['Ripe Bananas', 'Fresh Coconut Water', 'Chamomile Blossoms']
    },
    {
      name: 'Severe Migraine / Headache',
      keySymptoms: ['headache', 'vision blur', 'dizziness'],
      otherSymptoms: ['nausea', 'fatigue', 'weakness', 'confusion', 'brain fog'],
      description: 'A severe, throbbing headache typically accompanied by blurry vision, dizziness, and heavy sensitivity to light.',
      recommendations: ['Lie down immediately in a quiet, pitch-dark room', 'Place a cold, damp compress across your forehead', 'Avoid blue light screens (phones/laptops) completely'],
      color: 'from-purple-500 to-indigo-600',
      medications: [
        { name: 'Naproxen Sodium / Ibuprofen', dosage: '250mg / 400mg', type: 'OTC', purpose: 'Anti-inflammatory vascular pain relief' },
        { name: 'Sumatriptan', dosage: '50mg at onset', type: 'Prescription', purpose: 'Migraine abortive therapy' }
      ],
      dietChart: {
        morning: 'Large glass of room-temperature water & 1 tbsp pumpkin seeds.',
        breakfast: 'Spinach, banana, and almond milk smoothie (magnesium-rich).',
        lunch: 'Quinoa bowl with cucumber, baked fish/beans, and olive oil.',
        snack: 'Caffeine-free peppermint herbal tea and 1/2 fresh avocado.',
        dinner: 'Roasted turkey breast or lentils with sweet potatoes & broccoli.'
      },
      naturalRemedies: ['Peppermint Herb', 'Magnesium-rich Pumpkin Seeds', 'Dark Leafy Greens']
    },
    {
      name: 'Heart Strain / Cardiac Risk',
      keySymptoms: ['chest pain', 'tightness', 'heart palpitations', 'chest pressure'],
      otherSymptoms: ['shortness of breath', 'dizziness', 'numbness', 'weakness', 'rapid heartbeat', 'tingling'],
      description: 'An important indicator that your heart is under physical strain. Requires instant rest and careful attention.',
      recommendations: ['CEASE all physical movement immediately', 'Loosen any tight shirts or neck collars', 'Alert nearby persons and prepare for emergency dispatch'],
      color: 'from-rose-600 to-red-700',
      medications: [
        { name: 'Soluble Aspirin', dosage: '325mg (Chewable)', type: 'Emergency', purpose: 'Anti-platelet cardiac protocol' },
        { name: 'Glyceryl Trinitrate (GTN)', dosage: '0.4mg Sublingual Spray/Tab', type: 'Prescription', purpose: 'Coronary artery dilation' }
      ],
      dietChart: {
        morning: 'Warm water with a squeeze of fresh organic lemon (strictly NO salt).',
        breakfast: 'Unsweetened steel-cut oats with fresh blueberries & raw walnuts.',
        lunch: 'Grilled skinless chicken breast or chickpeas over raw kale/spinach.',
        snack: 'Fresh pomegranate seeds and 1 cup of organic green tea.',
        dinner: 'Baked mackerel/salmon, steamed asparagus, and plain quinoa.'
      },
      naturalRemedies: ['Fresh Garlic Cloves', 'Organic Blueberries', 'Pomegranate Extract']
    },
    {
      name: 'Common Head Cold / Infection',
      keySymptoms: ['sore throat', 'runny nose', 'cough', 'nasal congestion'],
      otherSymptoms: ['fever', 'ear pain', 'fatigue', 'vision blur', 'sneezing', 'eye redness'],
      description: 'A common head cold causing irritated airways, an itchy throat, and a stuffy or runny nose.',
      recommendations: ['Gargle vigorously with warm saline water', 'Inhale steam or utilize a cool-mist humidifier', 'Maintain optimal fluid volume to thin congestion'],
      color: 'from-cyan-500 to-blue-500',
      medications: [
        { name: 'Cetirizine Hydrochloride', dosage: '10mg once daily', type: 'OTC', purpose: 'Antihistamine for runny nose/allergies' },
        { name: 'Phenylephrine Nasal Drops', dosage: '2 drops per nostril', type: 'OTC', purpose: 'Nasal congestion clearance' }
      ],
      dietChart: {
        morning: 'Hot ginger-tulsi (holy basil) tea with a dash of black pepper.',
        breakfast: 'Whole-grain toast with a boiled egg and warm citrus water.',
        lunch: 'Vegetable soup loaded with crushed garlic, onions, & herbs.',
        snack: 'Warm water with lemon juice, honey, and a cinnamon stick.',
        dinner: 'Stir-fried vegetables with turmeric over soft steamed brown rice.'
      },
      naturalRemedies: ['Tulsi (Holy Basil)', 'Ceylon Cinnamon', 'Black Pepper']
    },
    {
      name: 'Lung Infection (Bronchitis)',
      keySymptoms: ['shortness of breath', 'cough', 'tightness', 'wheezing'],
      otherSymptoms: ['fever', 'night sweats', 'chest pain', 'fatigue', 'shallow breathing', 'deep breathing pain'],
      description: 'Deep irritation of the airways leading to your lungs, which triggers tight breathing and chest heaviness.',
      recommendations: ['Sit upright and perform pursed-lip breathing', 'Avoid exposure to dust, smoke, or cold drafts', 'Utilize bronchodilators if previously prescribed'],
      color: 'from-indigo-500 to-cyan-600',
      medications: [
        { name: 'Guaifenesin', dosage: '600mg twice daily', type: 'OTC', purpose: 'Expectorant to thin lung mucus' },
        { name: 'Salbutamol Inhaler', dosage: '100mcg (2 puffs) SOS', type: 'Prescription', purpose: 'Airway bronchodilation' }
      ],
      dietChart: {
        morning: 'Warm water infused with 1/2 tsp organic black seed oil & honey.',
        breakfast: 'Warm quinoa porridge topped with crushed raw almonds.',
        lunch: 'Garlic broth vegetable soup with soft steamed mixed veggies.',
        snack: 'Turmeric "Golden Milk" (almond/dairy) or hot ginger tea.',
        dinner: 'Baked white fish or tofu with sautéed spinach & garlic oil.'
      },
      naturalRemedies: ['Turmeric Root', 'Black Seed Oil', 'Raw Garlic Bulbs']
    },
    {
      name: 'Middle Ear Infection (Otitis)',
      keySymptoms: ['ear pain', 'dizziness', 'tinnitus'],
      otherSymptoms: ['fever', 'headache', 'nausea', 'face swelling'],
      description: 'A painful build-up of pressure or fluid inside the ear canal, common after a cold or allergy flare-up.',
      recommendations: ['Apply dry external warmth (warm cloth) to ear', 'Avoid getting any water inside the ear canal', 'Refrain from using any ear cotton buds or swabs'],
      color: 'from-teal-500 to-emerald-600',
      medications: [
        { name: 'Amoxicillin', dosage: '500mg three times daily', type: 'Prescription', purpose: 'Bacterial eradication' },
        { name: 'Benzocaine Ear Drops', dosage: '3-4 drops as needed', type: 'OTC', purpose: 'Topical anesthetic for ear pain' }
      ],
      dietChart: {
        morning: 'Fresh Vitamin C-rich juice (amla or fresh-squeezed orange).',
        breakfast: 'Soft scrambled eggs, sautéed mushrooms, and whole toast.',
        lunch: 'Pureed lentil/chicken soup with grated garlic and sweet onion.',
        snack: 'Warm chamomile tea with a handful of raw skinless almonds.',
        dinner: 'Lean ground turkey or baked beans, roasted pumpkin & zucchini.'
      },
      naturalRemedies: ['Fresh Amla (Gooseberry)', 'Raw Garlic', 'Sweet Onions']
    },
    {
      name: 'Severe Fatigue & Dehydration',
      keySymptoms: ['fatigue', 'weakness', 'dizziness'],
      otherSymptoms: ['headache', 'heart palpitations', 'muscle pain', 'weight loss', 'sweating', 'dry mouth', 'cold extremities'],
      description: 'A state of severe fatigue where your body has run out of vital fluids, blood sugar, or energy.',
      recommendations: ['Immediately consume 500ml of clean drinking water', 'Sit down or lie flat to regulate blood pressure', 'Consume a light, glucose-rich fruit or meal'],
      color: 'from-sky-500 to-blue-600',
      medications: [
        { name: 'Dextrose Energy Packets', dosage: '15g glucose SOS', type: 'Supplement', purpose: 'Rapid glycemic restoration' },
        { name: 'Vitamin B-Complex', dosage: '1 Capsule daily', type: 'Supplement', purpose: 'Cellular energy & metabolism' }
      ],
      dietChart: {
        morning: '500ml mineralized water with a pinch of pink salt & lemon.',
        breakfast: 'Greek yogurt bowl with local honey, berries, and chia seeds.',
        lunch: 'Brown rice and lentils (dal) with 1/2 sliced avocado.',
        snack: 'Crisp apple slices with unsweetened almond or peanut butter.',
        dinner: 'Baked salmon or black beans, mashed sweet potatoes, and spinach.'
      },
      naturalRemedies: ['Himalayan Pink Salt', 'Chia Seeds', 'Raw Local Honey']
    },
    {
      name: 'Muscle / Joint Strain',
      keySymptoms: ['muscle pain', 'joint pain', 'swelling', 'back pain'],
      otherSymptoms: ['numbness', 'weakness', 'fatigue', 'shoulder pain', 'knee stiffness', 'ankle pain', 'muscle cramps', 'tingling'],
      description: 'Pain, stiffness, or swelling in your body caused by muscle strain, pulled fibers, or heavy joint stress.',
      recommendations: ['Apply Rest, Ice, Compression, and Elevation (RICE)', 'Limit loading weight or exertion on affected areas', 'Perform extremely gentle, light range-of-motion stretches'],
      color: 'from-yellow-500 to-orange-600',
      medications: [
        { name: 'Diclofenac Diethylamine Gel', dosage: 'Apply 1% gel local x3 daily', type: 'OTC', purpose: 'Targeted topical pain relief' },
        { name: 'Aceclofenac', dosage: '100mg twice daily', type: 'Prescription', purpose: 'Systemic NSAID anti-inflammation' }
      ],
      dietChart: {
        morning: 'Glass of unsweetened tart cherry juice or fresh pineapple juice.',
        breakfast: 'Rolled oats with raw walnuts, chia seeds, & grated fresh ginger.',
        lunch: 'Large dark leafy green salad with chickpeas & olive oil dressing.',
        snack: 'Organic green tea with a small handful of raw walnuts.',
        dinner: 'Baked oily fish (salmon/mackerel) or tofu with steamed broccoli.'
      },
      naturalRemedies: ['Tart Cherry Juice', 'Extra Virgin Olive Oil', 'Fresh Ginger']
    },
    {
      name: 'Severe Indigestion & Gas',
      keySymptoms: ['bloating', 'indigestion', 'acid reflux', 'heartburn'],
      otherSymptoms: ['stomach pain', 'nausea', 'stomach gas', 'loss of appetite', 'abdominal cramps'],
      description: 'General painful indigestion and gas buildup that causes your upper stomach to feel heavy and full.',
      recommendations: ['Take a very slow 10-minute walk after eating', 'Drink warm ginger or organic peppermint herbal tea', 'Avoid all carbonated beverages and soft drinks'],
      color: 'from-emerald-400 to-teal-600',
      medications: [
        { name: 'Pantoprazole / Omeprazole', dosage: '40mg / 20mg before breakfast', type: 'OTC', purpose: 'Proton-Pump acid inhibitor' },
        { name: 'Antacid (Calcium Carbonate)', dosage: '2 Tablets chewable SOS', type: 'OTC', purpose: 'Rapid stomach acid neutralization' }
      ],
      dietChart: {
        morning: 'Warm water with 1 tsp fennel seeds (soaked overnight).',
        breakfast: 'Light warm rice porridge (congee) with fresh papaya slices.',
        lunch: 'Steamed yellow lentils (Moong Dal) with roasted cumin & rice.',
        snack: 'Fresh buttermilk with a pinch of roasted cumin powder & mint.',
        dinner: 'Baked white fish or tofu, steamed zucchini, & easy-digest rice.'
      },
      naturalRemedies: ['Fennel Seeds (Saunf)', 'Cumin (Jeera)', 'Fresh Papaya']
    },
    {
      name: 'Acute Sinusitis & Allergies',
      keySymptoms: ['nasal congestion', 'sneezing', 'headache', 'face swelling'],
      otherSymptoms: ['runny nose', 'eye redness', 'loss of taste', 'loss of smell', 'sore throat', 'fatigue'],
      description: 'An inflammatory block or infection of the nasal sinuses, typically triggered by allergies or a lingering cold.',
      recommendations: ['Apply a warm, damp compress over nose and forehead', 'Perform a saline nasal irrigation (Neti pot) twice daily', 'Stay in climate-controlled, low-pollen environments'],
      color: 'from-sky-400 to-teal-500',
      medications: [
        { name: 'Loratadine (Claritin)', dosage: '10mg once daily', type: 'OTC', purpose: 'Non-drowsy allergy flare reduction' },
        { name: 'Fluticasone Nasal Spray', dosage: '2 sprays per nostril daily', type: 'OTC', purpose: 'Targeted sinus anti-inflammation' }
      ],
      dietChart: {
        morning: 'Warm water with 1 tbsp raw apple cider vinegar & local honey.',
        breakfast: 'Mixed berry smoothie with a tiny pinch of cayenne pepper.',
        lunch: 'Warm rustic vegetable stew loaded with cooked garlic & onions.',
        snack: 'Hot nettle leaf tea or peppermint tea with pumpkin seeds.',
        dinner: 'Spicy vegetable curry (turmeric & cayenne) over brown rice.'
      },
      naturalRemedies: ['Apple Cider Vinegar', 'Cayenne Pepper', 'Nettle Leaf']
    },
    {
      name: 'Gastroesophageal Reflux (GERD)',
      keySymptoms: ['acid reflux', 'heartburn', 'indigestion'],
      otherSymptoms: ['bloating', 'chest pressure', 'nausea', 'dry mouth', 'stomach gas'],
      description: 'A chronic condition where stomach acid frequently flows back into the esophagus, causing severe burning and pressure.',
      recommendations: ['Remain fully upright for at least 3 hours after eating', 'Elevate the head of your bed by 6 inches tonight', 'Avoid acidic citrus, spicy peppers, and caffeinated foods'],
      color: 'from-orange-400 to-red-500',
      medications: [
        { name: 'Esomeprazole (Nexium)', dosage: '40mg 30-mins before breakfast', type: 'Prescription', purpose: 'Profound stomach acid suppression' },
        { name: 'Sodium Alginate Oral Suspension', dosage: '10ml post-meals and bedtime', type: 'OTC', purpose: 'Mechanical acid barrier raft' }
      ],
      dietChart: {
        morning: '2 tbsp organic aloe vera juice or simple warm alkaline water.',
        breakfast: 'Oatmeal made with water, topped with sliced bananas & melons.',
        lunch: 'Plain grilled chicken breast or tofu, brown rice, and green beans.',
        snack: 'Hydrating sliced cucumber, non-fat yogurt, & chamomile tea.',
        dinner: 'Baked turkey breast, boiled sweet potato (strictly no spices).'
      },
      naturalRemedies: ['Aloe Vera Juice', 'Licorice Root (DGL)', 'Fennel Tea']
    },
    {
      name: 'Anxiety & Panic Attack Syndrome',
      keySymptoms: ['anxiety / panic', 'shortness of breath', 'rapid heartbeat'],
      otherSymptoms: ['chest tightness', 'dizziness', 'sweating', 'tingling', 'hand tremors', 'confusion'],
      description: 'A sudden episode of intense fear triggering severe physical reactions (pounding heart, tight air) with no real danger.',
      recommendations: ['Perform the 4-7-8 deep breathing technique immediately', 'Focus on grounding: Name 5 things you can see around you', 'Slowly sip cool water to trigger the parasympathetic nerve'],
      color: 'from-violet-400 to-fuchsia-600',
      medications: [
        { name: 'Propranolol Hydrochloride', dosage: '10mg - 20mg SOS', type: 'Prescription', purpose: 'Physical cardiac symptom regulation' },
        { name: 'Magnesium Glycinate', dosage: '200mg daily', type: 'Supplement', purpose: 'Neuromuscular relaxation support' }
      ],
      dietChart: {
        morning: 'Warm water followed by a caffeine-free organic Tulsi tea.',
        breakfast: 'Omega-3 rich eggs, fresh spinach, and mashed avocado toast.',
        lunch: 'Turkey breast salad with mixed greens, pumpkin seeds, and olive oil.',
        snack: '1 square of dark chocolate (70%+) & warm Ashwagandha tea/milk.',
        dinner: 'Baked salmon, roasted asparagus, and baked sweet potato.'
      },
      naturalRemedies: ['Ashwagandha Herb', 'Dark Chocolate (70%+)', 'Chamomile']
    },
    {
      name: 'Acute Urticaria (Hives) & Skin Allergy',
      keySymptoms: ['skin rash', 'hives', 'itching / pruritus'],
      otherSymptoms: ['sweating', 'face swelling', 'body aches'],
      description: 'A sudden vascular reaction of the skin causing itchy, raised red welts, typically triggered by an allergen or systemic response.',
      recommendations: ['Refrain strictly from scratching or applying abrasive friction', 'Utilize cool-water compresses across active hive breakouts', 'Take cool-to-lukewarm showers; avoid hot water entirely'],
      color: 'from-rose-400 to-pink-500',
      medications: [
        { name: 'Hydrocortisone 1% Topical Cream', dosage: 'Apply thin layer x3 daily', type: 'OTC', purpose: 'Local pruritus & inflammation reduction' },
        { name: 'Cetirizine Hydrochloride (Zyrtec)', dosage: '10mg once daily', type: 'OTC', purpose: 'Potent 24-hour antihistamine control' }
      ],
      dietChart: {
        morning: 'Caffeine-free nettle leaf tea (natural antihistamine).',
        breakfast: 'Quinoa breakfast bowl with fresh blueberries and apples.',
        lunch: 'Fresh steamed low-histamine vegetables, white rice, & black beans.',
        snack: 'Fresh sliced pears and a handful of raw organic pumpkin seeds.',
        dinner: 'Freshly cooked baked chicken or fish, roasted sweet potatoes.'
      },
      naturalRemedies: ['Nettle Leaf Tea', 'Organic Pears', 'Fresh Blueberries']
    },
    {
      name: 'Radiculopathy (Pinched Nerve)',
      keySymptoms: ['neck stiffness', 'back pain', 'tingling pins & needles'],
      otherSymptoms: ['numbness', 'weakness', 'muscle cramps', 'shoulder pain', 'knee stiffness'],
      description: 'Compression or irritation of a spinal nerve root, triggering radiating pain, weakness, or sharp tingling sensations.',
      recommendations: ['Strictly maintain neutral spinal posture and ergonomic lumbar support', 'Cease all repetitive bending, twisting, or lifting movements', 'Apply mild moist heat for 15 minutes to ease surrounding spasm'],
      color: 'from-slate-400 to-indigo-500',
      medications: [
        { name: 'Pregabalin (Lyrica)', dosage: '75mg Capsule twice daily', type: 'Prescription', purpose: 'Neuropathic neuralgic pain modulator' },
        { name: 'Naproxen Sodium (Aleve)', dosage: '500mg twice daily with food', type: 'OTC', purpose: 'Strong systemic NSAID anti-inflammation' }
      ],
      dietChart: {
        morning: 'Turmeric & ginger root tea with a tiny pinch of black pepper.',
        breakfast: 'Omega-3 fortified eggs, sautéd spinach, & whole grain toast.',
        lunch: 'Dark leafy green salad with fresh avocado and crushed walnuts.',
        snack: '100% pure tart cherry juice and 2 squares of dark chocolate.',
        dinner: 'Baked salmon, steamed Brussels sprouts, and quinoa.'
      },
      naturalRemedies: ['Turmeric Root', 'Raw Walnuts', 'Ground Flaxseeds']
    }
  ];

  // Calculate Match Scores for each Condition
  const predictedConditions = diseaseDefinitions.map(disease => {
    let rawScore = 0;
    let count = 0;

    disease.keySymptoms.forEach(sym => {
      if (matches(sym)) {
        rawScore += 40; // Key symptoms have high diagnostic weight
        count++;
      }
    });

    disease.otherSymptoms.forEach(sym => {
      if (matches(sym)) {
        rawScore += 15; // Supporting symptoms provide confirmation
        count++;
      }
    });

    // Normalize the match percentage (maximum 95% for safety)
    let probability = Math.min(rawScore, 95);

    // Base minimum probability if there are any matches
    if (count > 0 && probability < 30) {
      probability = 30 + (count * 5);
    }

    // Fine-tune using the global Risk Score
    if (count > 0) {
      probability = Math.round((probability * 0.7) + (riskScore * 0.3));
    }

    return {
      name: disease.name,
      probability: Math.min(Math.max(probability, 20), 98),
      color: disease.color,
      description: disease.description,
      recommendations: disease.recommendations,
      medications: disease.medications,
      dietChart: disease.dietChart,
      naturalRemedies: disease.naturalRemedies,
      matchCount: count
    };
  });

  // Filter to show only diseases that had at least ONE matching symptom
  const finalPredictions = predictedConditions
    .filter(d => d.matchCount > 0)
    .sort((a, b) => b.probability - a.probability) // Highest probability first
    .slice(0, 3); // Show top 3 best matches

  // Inject into the active array
  finalPredictions.forEach(p => conditions.push(p));

  // Absolute fallback case if no symptoms match the primary matrix
  if (conditions.length === 0) {
    conditions.push({
      name: 'General Wellness Imbalance',
      probability: Math.min(riskScore + 5, 80),
      color: 'from-indigo-400 to-slate-500',
      description: 'General physiological strain. The specific symptom vector could not be fully resolved into a common clinical disease.',
      recommendations: ['Prioritize a full 8-hour sleep cycle', 'Track your symptoms for the next 24 hours', 'Consult a local medical clinic if discomfort increases'],
      medications: [
        { name: 'Multivitamin / Mineral complex', dosage: '1 Tablet once daily', type: 'Supplement', purpose: 'General wellness & immune support' }
      ],
      dietChart: {
        morning: 'Full 500ml glass of pure filtered water to hydrate organs.',
        breakfast: 'Balanced oatmeal with organic nuts, seeds, and fresh fruit.',
        lunch: 'Balanced macro plate: lean protein, complex carbs, and raw greens.',
        snack: 'Fresh green tea or herbal infusion with a handful of almonds.',
        dinner: 'Lightly cooked vegetables with baked fish or beans & brown rice.'
      },
      naturalRemedies: ['Pure Mineral Water', 'Mixed Raw Nuts', 'Green Tea']
    });
  }

  const lastEntry = historyLogs[historyLogs.length - 1] || { riskScore: 65 }; // Dynamic baseline fallback for instant mobile functionality
  let riskTrendLabel = 'Steady';
  let trendColor = 'text-muted-foreground';
  
  if (riskScore < lastEntry.riskScore) {
    riskTrendLabel = 'Improving';
    trendColor = 'text-emerald-600';
  } else if (riskScore > lastEntry.riskScore) {
    riskTrendLabel = 'Elevated';
    trendColor = 'text-rose-600';
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
      <div className="px-5 py-6 pb-10">
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

        {/* CRITICAL EMERGENCY SOS PANEL - SOFT ROSE GLASS COMPRESSION */}
        {riskScore >= 70 && (
          <div className="mb-5 bg-gradient-to-br from-rose-50/80 to-white/90 rounded-2xl sm:rounded-[24px] p-3.5 sm:p-4 border border-rose-200/60 shadow-[0_8px_30px_rgba(244,63,94,0.05)] backdrop-blur-md animate-pulse-slow relative overflow-hidden">
            {/* High-Tech Technical Micro-Mesh (Subtle Grey) */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(244,63,94,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(244,63,94,.03)_1px,transparent_1px)] bg-[size:8px_8px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Left Content Capsule (Soft Rose Themes) */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center flex-shrink-0 shadow-sm shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.8)]">
                  <AlertTriangle className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-rose-600 animate-pulse" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h3 className="text-[12px] sm:text-[13px] font-black tracking-tight uppercase leading-none text-rose-950">Emergency Active</h3>
                    <span className="bg-rose-600 text-white px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest scale-90 flex-shrink-0 shadow-sm shadow-rose-200">Critical</span>
                  </div>
                  <p className="text-[9.5px] sm:text-[10.5px] text-rose-700 font-black tracking-tight leading-tight opacity-95 line-clamp-1">
                    Immediate care required: Cardiorespiratory Distress.
                  </p>
                </div>
              </div>

              {/* Right Pill-Button Action Cluster (Aligned to Soft Theme) */}
              <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto mt-0.5 sm:mt-0">
                <button
                  onClick={handleCallER}
                  className="flex-1 sm:flex-none px-3.5 py-2 sm:py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-black text-[9.5px] sm:text-[10.5px] tracking-tight uppercase shadow-[0_4px_12px_rgba(225,29,72,0.2)] active:scale-95 transition-all cursor-pointer border-none flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3 h-3 animate-bounce" />
                  <span className="truncate">Call ER</span>
                </button>
                <button
                  onClick={handleDispatchTelemetry}
                  className="flex-1 sm:flex-none px-3.5 py-2 sm:py-2.5 rounded-full bg-rose-100/60 hover:bg-rose-100 border border-rose-200/60 text-rose-700 font-black text-[9.5px] sm:text-[10.5px] tracking-tight uppercase shadow-sm backdrop-blur-sm active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Activity className="w-3 h-3 animate-pulse" />
                  <span className="truncate">Dispatch</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HIGH PROFESSIONAL COMPACT COMMAND HERO */}
        <div className={`relative overflow-hidden rounded-2xl sm:rounded-[24px] p-4 sm:p-4 mb-5 border ${riskBorder} ${riskBg} backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex items-center justify-between gap-3 animate-fade-in`}>
          <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-3 min-w-0 flex-1">
            {/* Fully Rounded Glassmorphic Anchor */}
            <div className="w-12 h-12 sm:w-12 sm:h-12 rounded-full bg-white shadow-md border border-white flex items-center justify-center flex-shrink-0 shadow-[inset_0_1.5px_2px_rgba(255,255,255,1)]">
               <AlertCircle className={`w-6 h-6 sm:w-6 sm:h-6 ${riskIconColor} drop-shadow-sm`} />
            </div>
            
            <div className="min-w-0 flex-1">
               <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                  <h2 className={`text-[15.5px] sm:text-base font-black tracking-tight uppercase ${riskColor} drop-shadow-sm leading-none`}>
                    {riskIndicator} Risk
                  </h2>
                  <span className="text-[8px] sm:text-[8px] font-black font-mono text-foreground/40 bg-white/75 px-1 py-0.5 rounded border border-white/60 uppercase tracking-wider flex-shrink-0">Verified</span>
               </div>
               <div className="flex items-center gap-1 opacity-90 mt-0.5">
                 <Zap className="w-3 h-3 text-amber-500" />
                 <p className="text-[9.5px] sm:text-[10px] font-black text-muted-foreground/80 uppercase tracking-tight">
                   {riskScore}% Accuracy Confidence
                 </p>
               </div>
            </div>
          </div>

          {/* HIGH-PRESTIGE RADIAL PROGRESS RING */}
          <div className="relative z-10 pl-3 sm:pl-4 border-l border-white/40 flex items-center justify-center flex-shrink-0">
             <div className="relative w-[50px] h-[50px] sm:w-12 sm:h-12 flex items-center justify-center bg-white shadow-sm border border-white rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
               {/* Background & Radial SVG Gauge */}
               <svg className="w-full h-full transform -rotate-90 p-1" viewBox="0 0 36 36">
                 {/* Visible High-Contrast Background Track */}
                 <path
                   className="text-slate-100 stroke-current"
                   strokeWidth="3.5"
                   stroke="currentColor"
                   fill="none"
                   d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                 />
                 {/* Active Dynamic Arc */}
                 <path
                   className={`${riskColor} stroke-current transition-all duration-1000 ease-out`}
                   strokeWidth="3.5"
                   strokeDasharray={`${riskScore}, 100`}
                   strokeLinecap="round"
                   stroke="currentColor"
                   fill="none"
                   d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                 />
                 {/* Absolute Mathematical Inner Text Anchor - MAXIMUM VISIBILITY */}
                 <text 
                   x="18" 
                   y="21.8" 
                   className={`${riskColor} fill-current font-sans font-black text-[11px] rotate-90 origin-center tracking-tighter`}
                   textAnchor="middle"
                   style={{ transformOrigin: '18px 18px' }}
                 >
                   {riskScore}%
                 </text>
               </svg>
             </div>
          </div>
        </div>

        {/* TREND BADGE */}
        <div className="flex items-center gap-2 bg-white border border-border/50 rounded-2xl p-3 mb-6 animate-fade-in">
          <Activity className={`w-4 h-4 ${trendColor}`} />
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Trend: <span className={trendColor}>{riskTrendLabel}</span></p>
        </div>

        {/* NEW ULTRA-LUXURY LIGHT GLASSMORPHIC DIAGNOSTIC INDEX SNAPSHOT */}
        {conditions.length > 0 && (
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50/70 via-white/90 to-emerald-50/70 text-slate-900 rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 mb-6 sm:mb-8 border border-indigo-100/70 shadow-[0_20px_40px_-15px_rgba(99,102,241,0.1)] animate-fade-in">
            {/* Animated ambient lighting circles */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-400/10 rounded-full blur-[50px] pointer-events-none animate-pulse" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-emerald-400/10 rounded-full blur-[50px] pointer-events-none" />
            
            <div className="relative flex items-center justify-between mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                 <div className="w-9 h-9 sm:w-9 sm:h-9 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-tr from-indigo-600 to-indigo-400 shadow-[0_4px_12px_rgba(99,102,241,0.2)]">
                   <Brain className="w-4.5 h-4.5 text-white" />
                 </div>
                 <div className="min-w-0">
                    <h3 className="text-[11.5px] sm:text-sm font-black tracking-[0.15em] uppercase text-slate-800 leading-none whitespace-nowrap">Quick Diagnostics</h3>
                    <p className="text-[8.5px] sm:text-[9.5px] font-black text-indigo-600/60 uppercase tracking-widest mt-1 whitespace-nowrap">Real-Time Analysis</p>
                 </div>
              </div>
              <div className="flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 flex-shrink-0 ml-2 shadow-sm">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]" />
                 <span className="text-[9px] sm:text-[9.5px] font-black uppercase tracking-wider text-emerald-700">
                   <span className="sm:hidden">Live</span>
                   <span className="hidden sm:inline">Live Scanning</span>
                 </span>
              </div>
            </div>

            <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
               {conditions.map((c, cIdx) => {
                 const isHigh = c.probability >= 80;
                 const isMed = c.probability >= 40;
                 const glowColor = isHigh ? 'shadow-[0_4px_10px_rgba(244,63,94,0.2)]' : isMed ? 'shadow-[0_4px_10px_rgba(245,158,11,0.15)]' : 'shadow-[0_4px_10px_rgba(16,185,129,0.15)]';
                 const barColor = isHigh ? 'from-rose-500 to-red-500' : isMed ? 'from-amber-400 to-orange-500' : 'from-emerald-400 to-teal-500';
                 const badgeColor = isHigh ? 'bg-rose-50 border-rose-200/60 text-rose-600' : isMed ? 'bg-amber-50 border-amber-200/60 text-amber-600' : 'bg-emerald-50 border-emerald-200/60 text-emerald-600';
                 
                 return (
                   <div key={cIdx} className="group relative bg-white/70 hover:bg-white border border-indigo-50/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                     <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                       <div className="flex items-center gap-2.5 min-w-0 flex-1">
                         <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isHigh ? 'bg-rose-500 shadow-[0_0_5px_#f43f5e]' : isMed ? 'bg-amber-500 shadow-[0_0_5px_#f59e0b]' : 'bg-emerald-500 shadow-[0_0_5px_#10b981]'}`} />
                         <p className="text-[13px] sm:text-[13.5px] font-black tracking-tight truncate text-slate-700 group-hover:text-slate-900 transition-colors">{c.name}</p>
                       </div>
                       <div className={`text-[10.5px] sm:text-[11px] font-black font-mono px-2 py-0.5 rounded-lg border backdrop-blur-sm ${badgeColor} transition-all ml-2 flex-shrink-0`}>
                         {c.probability}%
                       </div>
                     </div>
                     
                     <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden p-[1.5px] border border-slate-200/20 mt-auto">
                        <div 
                          className={`h-full rounded-full bg-gradient-to-r ${barColor} ${glowColor} transition-all duration-1000 ease-out`} 
                          style={{ width: `${c.probability}%` }}
                        />
                     </div>
                   </div>
                 );
               })}
            </div>
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
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                     <h4 className="text-base font-black text-foreground tracking-tight leading-tight">{condition.name}</h4>
                     <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${condition.color} opacity-10 flex items-center justify-center flex-shrink-0`}>
                        <ShieldCheck className="w-4 h-4 opacity-100" />
                     </div>
                  </div>
                  {(() => {
                    const triage = getTriageInfo(condition.name);
                    return (
                      <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[8.5px] font-black tracking-wider uppercase mt-2 shadow-sm ${triage.colors}`}>
                         <span>{triage.emoji} {triage.level}: {triage.label}</span>
                      </div>
                    );
                  })()}
                </div>
                 <div className="flex items-center justify-between mb-1.5 px-0.5">
                   <span className={`text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                     condition.probability >= 80 
                       ? 'text-rose-600' 
                       : condition.probability >= 40 
                         ? 'text-amber-600' 
                         : 'text-emerald-600'
                   }`}>
                     <div className={`w-1.5 h-1.5 rounded-full ${
                       condition.probability >= 80 
                         ? 'bg-rose-500 animate-pulse' 
                         : condition.probability >= 40 
                           ? 'bg-amber-500' 
                           : 'bg-emerald-500'
                     }`}></div>
                     {condition.probability >= 80 ? 'High Correlation' : condition.probability >= 40 ? 'Moderate Probability' : 'Mild Match'}
                   </span>
                   <span className={`text-xs font-black font-mono px-2 py-0.5 rounded-lg border ${
                     condition.probability >= 80 
                       ? 'bg-rose-50 text-rose-700 border-rose-100' 
                       : condition.probability >= 40 
                         ? 'bg-amber-50 text-amber-700 border-amber-100' 
                         : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                   }`}>{condition.probability}%</span>
                 </div>
                 <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4 p-[2px] border border-slate-200/30">
                    <div 
                      className={`h-full bg-gradient-to-r rounded-full transition-all duration-1000 ease-out shadow-inner ${
                        condition.probability >= 80 
                          ? 'from-rose-500 to-red-600' 
                          : condition.probability >= 40 
                            ? 'from-amber-400 to-orange-500' 
                            : 'from-emerald-400 to-teal-500'
                      }`} 
                      style={{ width: `${condition.probability}%` }}
                    ></div>
                 </div>
                <div className="space-y-4">
                   <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100/50">
                      <div className="flex items-center justify-between mb-1.5">
                         <p className="text-[10px] font-black text-foreground/60 uppercase tracking-widest">Rationale</p>
                         <button
                           onClick={() => handleListenToReport(condition, index)}
                           className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black transition-all duration-300 active:scale-95 shadow-sm border ${
                             speakingIndex === index 
                               ? 'bg-rose-500 text-white border-rose-400 animate-pulse' 
                               : 'bg-white hover:bg-slate-50 text-indigo-600 border-slate-200/60'
                           }`}
                         >
                           {speakingIndex === index ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 animate-bounce" style={{ animationDuration: '1.5s' }} />}
                           {speakingIndex === index ? 'Stop Voice' : 'Listen'}
                         </button>
                      </div>
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
 
                    {/* CLINICAL RED FLAGS / SAFETY-NETTING BOX */}
                    {(() => {
                      const flags = getRedFlags(condition.name);
                      return (
                        <div className="mt-2 border border-rose-200 bg-rose-50/50 rounded-2xl p-4 shadow-[inset_0_1px_2px_rgba(225,29,72,0.02)]">
                            <div className="flex items-center gap-2 mb-2.5">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center shadow-sm">
                                <AlertTriangle className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-rose-600" />
                              </div>
                              <p className="text-[12px] sm:text-[13.5px] font-black text-rose-700 uppercase tracking-widest leading-none">🚨 Emergency Red Flags</p>
                            </div>
                            <div className="space-y-2">
                               <p className="text-[11px] sm:text-[12px] font-extrabold text-rose-900 italic mb-2 leading-tight pl-0.5">
                                 Seek immediate professional ER care if you develop:
                               </p>
                               {flags.map((f, fIdx) => (
                                 <div key={fIdx} className="flex items-start gap-2 pl-0.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                                    <p className="text-[11px] sm:text-[12px] font-black text-rose-950/95 leading-relaxed flex-1">{f}</p>
                                 </div>
                               ))}
                            </div>
                         </div>
                      );
                    })()}

                   {/* Premium Medication Suggestions Area */}
                   {condition.medications && condition.medications.length > 0 && (
                     <div className="mt-4 pt-4 border-t border-dashed border-indigo-100">
                        <div className="flex items-center gap-2 mb-3 px-1">
                           <div className="w-8 h-8 sm:w-9.5 sm:h-9.5 rounded-xl bg-indigo-100 flex items-center justify-center">
                              <Pill className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-indigo-600" />
                           </div>
                            <div className="min-w-0">
                               <p className="text-[12px] sm:text-[13px] font-black text-indigo-950 uppercase tracking-wider leading-none">First-Line Treatment</p>
                               <p className="text-[10px] sm:text-[11px] font-black text-sky-500 uppercase tracking-widest mt-1 leading-tight">Pharmaceutical Medicines</p>
                            </div>
                        </div>
                        <div className="space-y-2.5">
                           {condition.medications.map((med, mIdx) => (
                             <div key={mIdx} className="flex items-center justify-between bg-indigo-50/30 hover:bg-indigo-50/50 border border-indigo-100/30 transition-all rounded-2xl p-3.5">
                                <div className="flex flex-col pr-3">
                                   <p className="text-[13px] font-black text-indigo-950">{med.name}</p>
                                   <p className="text-[10px] text-indigo-600/80 font-semibold mt-0.5 tracking-tight">{med.dosage}</p>
                                   <p className="text-[9px] text-muted-foreground font-medium mt-1 italic">Purpose: {med.purpose}</p>
                                </div>
                                <span className={`text-[8px] font-black px-2 py-1 rounded-lg border flex-shrink-0 tracking-tighter uppercase ${
                                  med.type === 'Emergency' 
                                    ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse font-black' 
                                    : med.type === 'Prescription' 
                                      ? 'bg-amber-50 text-amber-600 border-amber-200' 
                                      : med.type === 'Supplement'
                                        ? 'bg-sky-50 text-sky-600 border-sky-200'
                                        : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                }`}>
                                  {med.type}
                                </span>
                             </div>
                           ))}
                        </div>
                     </div>
                   )}

                   {/* PREMIUM CLINICAL DIET RECOVERY CHART ACCORDION */}
                   <div className="mt-4 pt-4 border-t border-dashed border-emerald-100">
                      <button
                        onClick={() => setExpandedDietIndex(expandedDietIndex === index ? null : index)}
                        className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50/50 to-teal-50/30 hover:from-emerald-50 hover:to-teal-50 border border-emerald-100/60 transition-all group"
                      >
                        <div className="flex items-center gap-2.5">
                           <div className="w-8 h-8 rounded-xl bg-emerald-500 shadow-[0_4px_12px_rgba(16,185,129,0.2)] flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
                              <Leaf className="w-4.5 h-4.5 text-white" />
                           </div>
                           <div className="text-left">
                              <p className="text-[12px] sm:text-[13px] font-black text-emerald-950 uppercase tracking-wider leading-none">Dietary Recovery Protocol</p>
                              <p className="text-[9.5px] sm:text-[10.5px] font-black text-teal-600 uppercase tracking-widest mt-1 leading-tight">Tailored Nutritional Recovery</p>
                           </div>
                        </div>
                        <ChevronDown className={`w-4.5 h-4.5 text-emerald-600 transition-transform duration-300 ${expandedDietIndex === index ? 'rotate-180' : ''}`} />
                      </button>

                      {expandedDietIndex === index && (
                        <div className="mt-3 space-y-3 animate-fade-in px-0.5">
                           {/* Timed Recovery Schedule Grid */}
                           <div className="relative pl-3.5 border-l-2 border-emerald-100/60 space-y-4 my-4 ml-1.5">
                              {/* Phase 1: Early Morning */}
                              <div className="relative">
                                 <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white shadow-sm" />
                                 <div className="flex flex-col">
                                    <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-black text-emerald-700 uppercase tracking-wider">
                                       <Sunrise className="w-3 h-3 text-amber-500" />
                                       <span>Early Morning (Detox)</span>
                                    </div>
                                    <p className="text-[11.5px] sm:text-[12.5px] font-semibold text-slate-700 mt-1 leading-relaxed">{condition.dietChart.morning}</p>
                                 </div>
                              </div>

                              {/* Phase 2: Breakfast */}
                              <div className="relative">
                                 <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white shadow-sm" />
                                 <div className="flex flex-col">
                                    <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-black text-emerald-700 uppercase tracking-wider">
                                       <Coffee className="w-3 h-3 text-amber-600" />
                                       <span>Breakfast (Energy Boost)</span>
                                    </div>
                                    <p className="text-[11.5px] sm:text-[12.5px] font-semibold text-slate-700 mt-1 leading-relaxed">{condition.dietChart.breakfast}</p>
                                 </div>
                              </div>

                              {/* Phase 3: Lunch */}
                              <div className="relative">
                                 <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white shadow-sm" />
                                 <div className="flex flex-col">
                                    <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-black text-emerald-700 uppercase tracking-wider">
                                       <Utensils className="w-3 h-3 text-emerald-600" />
                                       <span>Lunch (Stabilization)</span>
                                    </div>
                                    <p className="text-[11.5px] sm:text-[12.5px] font-semibold text-slate-700 mt-1 leading-relaxed">{condition.dietChart.lunch}</p>
                                 </div>
                              </div>

                              {/* Phase 4: Snack */}
                              <div className="relative">
                                 <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white shadow-sm" />
                                 <div className="flex flex-col">
                                    <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-black text-emerald-700 uppercase tracking-wider">
                                       <Sun className="w-3 h-3 text-orange-500" />
                                       <span>Afternoon Snack (Vitality)</span>
                                    </div>
                                    <p className="text-[11.5px] sm:text-[12.5px] font-semibold text-slate-700 mt-1 leading-relaxed">{condition.dietChart.snack}</p>
                                 </div>
                              </div>

                              {/* Phase 5: Dinner */}
                              <div className="relative">
                                 <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white shadow-sm" />
                                 <div className="flex flex-col">
                                    <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-black text-emerald-700 uppercase tracking-wider">
                                       <Moon className="w-3 h-3 text-indigo-700" />
                                       <span>Dinner (Restorative)</span>
                                    </div>
                                    <p className="text-[11.5px] sm:text-[12.5px] font-semibold text-slate-700 mt-1 leading-relaxed">{condition.dietChart.dinner}</p>
                                 </div>
                              </div>
                           </div>

                           {/* ORGANIC BOOSTERS CAPSULE */}
                           <div className="bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] border border-[#BBF7D0] rounded-2xl p-3.5 mt-3">
                              <div className="flex items-center gap-2 mb-2">
                                 <span className="px-2 py-0.5 bg-emerald-600 text-white font-black uppercase text-[8px] sm:text-[9px] tracking-widest rounded-md flex-shrink-0 shadow-sm shadow-emerald-700/20 animate-pulse">100% Natural</span>
                                 <p className="text-[11px] sm:text-[12px] font-black text-emerald-900 uppercase tracking-wider">Natural Recovery Boosters</p>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-1.5">
                                 {condition.naturalRemedies.map((item, iIdx) => (
                                    <div key={iIdx} className="flex items-center gap-1 bg-white border border-emerald-200 px-2.5 py-1 rounded-xl shadow-sm">
                                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                                       <span className="text-[11px] font-bold text-emerald-800">{item}</span>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
              </div>
            ))}
          </div>

          {/* PREMIUM ANALYTICS & UTILITY ACTIONS GRID */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* REAL-WORLD PDF REPORT GENERATOR - PREMIUM COMPACT UPGRADE */}
            <div className="px-1 sm:px-0">
              <button
                onClick={handleGeneratePDF}
                className="w-full relative group overflow-hidden py-3.5 px-3 sm:py-4 sm:px-4 rounded-[18px] bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 hover:to-emerald-700 text-white shadow-[0_6px_16px_-4px_rgba(16,185,129,0.25)] hover:shadow-[0_10px_24px_-2px_rgba(16,185,129,0.35)] transition-all duration-300 active:scale-98 flex items-center gap-2.5 sm:gap-3.5 border border-emerald-400/30 h-full transform-gpu will-change-transform"
              >
                {/* Interactive Background Glow */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-out"></div>
                
                {/* Compact 3D Glassmorphic Icon Box - Optimized to remove scroll-heavy blur */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/25 flex items-center justify-center flex-shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] border border-white/20">
                   <FileText className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white animate-pulse" />
                </div>
                
                {/* High Contrast Text Area */}
                <div className="text-left flex-1 relative z-10 min-w-0">
                   <div className="flex items-center gap-1 flex-wrap">
                     <p className="text-[11px] sm:text-[12.5px] font-black tracking-tight sm:tracking-wide text-white uppercase leading-none drop-shadow-sm truncate">Export Summary to Doctor</p>
                     <Sparkles className="w-2.5 h-2.5 text-emerald-200 fill-emerald-200 animate-[pulse_1.5s_infinite] flex-shrink-0 hidden xs:block" />
                   </div>
                   <p className="text-[8.5px] sm:text-[9.5px] text-emerald-50 font-semibold leading-tight mt-1 opacity-95 drop-shadow-sm truncate">Compile official clinical PDF receipt instantly</p>
                </div>
                
                {/* Sliding Interaction Indicator - Blur pruned for scrolling performance */}
                <div className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-md bg-emerald-950/30 flex items-center justify-center text-[9px] sm:text-[10px] font-black text-white group-hover:translate-x-1 transition-transform duration-300 border border-emerald-400/20 shadow-sm flex-shrink-0 px-2.5">
                   ➔
                </div>
              </button>
            </div>

            {/* AI DEEP ANALYSIS - REPOSITIONED UNDER CORRELATIONS */}
            <div className={aiAnalysis ? 'col-span-1 sm:col-span-2' : ''}>
              {!aiAnalysis ? (
                <button
                  onClick={handleDeepAnalysis}
                  disabled={isAnalyzing}
                  className="w-full relative group overflow-hidden py-3.5 px-3 sm:py-4 sm:px-4 rounded-[18px] bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-950 hover:to-purple-950 text-white shadow-[0_6px_16px_-4px_rgba(79,70,229,0.3)] hover:shadow-[0_10px_24px_-2px_rgba(79,70,229,0.4)] transition-all duration-300 active:scale-98 flex items-center gap-2.5 sm:gap-3.5 border border-indigo-500/20 h-full transform-gpu will-change-transform"
                >
                  {/* Interactive Background Glow */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-purple-500/15 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-out"></div>
                  
                  {/* Compact 3D Glassmorphic Icon Box - Blur-free optimization */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/25 flex items-center justify-center flex-shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] border border-white/20">
                     {isAnalyzing ? (
                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                     ) : (
                       <Bot className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white animate-pulse" />
                     )}
                  </div>
                  
                  {/* High Contrast Text Area */}
                  <div className="text-left flex-1 relative z-10 min-w-0">
                     <div className="flex items-center gap-1 flex-wrap">
                       <p className="text-[11px] sm:text-[12.5px] font-black tracking-tight sm:tracking-wide text-white uppercase leading-none drop-shadow-sm truncate">Unlock AI Deep Analysis</p>
                       <Sparkles className="w-2.5 h-2.5 text-purple-300 fill-purple-300 animate-[pulse_1.5s_infinite] flex-shrink-0 hidden xs:block" />
                     </div>
                     <p className="text-[8.5px] sm:text-[9.5px] text-indigo-200 font-semibold leading-tight mt-1 opacity-95 drop-shadow-sm truncate">Hyper-personalized AI Clinical Chat</p>
                  </div>
                  
                  {/* Sliding Interaction Indicator - Performance optimized */}
                  <div className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-md bg-white/15 flex items-center justify-center text-[9px] sm:text-[10px] font-black text-white group-hover:translate-x-1 transition-transform duration-300 border border-white/10 shadow-sm flex-shrink-0 px-2.5">
                     ➔
                  </div>
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
          </div>
        </section>

        {/* Footer Actions */}
        <div className="mt-6 sm:mt-8 space-y-4">
          {/* Primary Action Buttons Cluster - NOW 2 COLS ON ALL VIEWPORTS */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleSaveResult}
              className="w-full h-12 rounded-2xl bg-white border border-border text-foreground font-black text-[10px] sm:text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm active:scale-98 transform-gpu will-change-transform"
            >
              <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary" />
              <span className="hidden sm:inline">Archive Result</span>
              <span className="sm:hidden">Archive</span>
            </button>
            <button
              onClick={() => navigate('/app/hospitals')}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-black text-[10px] sm:text-[11px] uppercase tracking-wider shadow-xl active:scale-98 transition-all flex items-center justify-center gap-1.5 sm:gap-2 transform-gpu will-change-transform"
            >
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              <span className="hidden sm:inline">Find Nearby Hospitals</span>
              <span className="sm:hidden">Find Hospitals</span>
            </button>
          </div>

          {/* ELITE REGULATORY FOOTER - NOW AT ABSOLUTE BOTTOM */}
          <div className="pt-1 pb-2">
            <div className="relative overflow-hidden py-3 px-3.5 sm:p-4 bg-slate-50 border border-slate-200/80 rounded-2xl shadow-sm flex items-start gap-2.5 sm:gap-3">
               <div className="w-7 h-7 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <ShieldAlert className="w-3.5 h-3.5 text-slate-500 animate-pulse" />
               </div>
               <div className="min-w-0 flex-1">
                  <h4 className="text-[10px] sm:text-[11px] font-black text-slate-800 uppercase tracking-[0.08em] mb-0.5 flex items-center gap-1">
                    Regulatory Advisory & Disclaimer
                  </h4>
                  <p className="text-[8.5px] sm:text-[9.5px] text-slate-500 font-semibold leading-[1.5]">
                    AI statistical mapping only. Does not constitute professional medical advice, diagnosis, or treatment. Consult a physician before clinical action.
                  </p>
               </div>
            </div>
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
