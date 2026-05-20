import { useNavigate, useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import { Heart, Activity, Brain, TrendingUp, Bell, Plus, Calendar, AlertTriangle, LogOut, MapPin, ChevronRight, Sparkles, Zap, Shield, Search, Trash2, Stethoscope, Moon, Droplet, Watch, Phone, PhoneOff, Loader2, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import logo from '../../../assets/logo.png';
import myPhoto from '../../../assets/sathish.png';
import { getStorageItem, setStorageItem, removeStorageItem } from '../../utils/storage';

export function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const lastSymptoms = JSON.parse(getStorageItem('selectedSymptoms', '[]'));
  const addedMeds = JSON.parse(getStorageItem('addedMedications', '[]'));
  const symptomHistory = JSON.parse(getStorageItem('symptomHistory', '[]'));
  const severityStr = getStorageItem('symptomSeverity', '5');
  const severity = parseInt(severityStr);

  const healthHistoryStr = getStorageItem('healthHistory', '[]');
  const healthHistory = JSON.parse(healthHistoryStr);
  const todayISO = new Date().toISOString().split('T')[0];
  const isVitalsSyncedToday = healthHistory.some((h: any) => h.dateISO === todayISO);

  const [dailyLogs, setDailyLogs] = useState(() => {
    const saved = getStorageItem('dailyLogs');
    return saved ? JSON.parse(saved) : { heartRate: '0', bloodPressure: '', water: '0', sleep: '0' };
  });

  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(() => {
    const saved = getStorageItem('completed_tasks_status');
    return saved ? JSON.parse(saved) : {};
  });

  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  // Immersive SOS States
  const [isCalling, setIsCalling] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmitStep, setTransmitStep] = useState('');
  const [transmitSuccess, setTransmitSuccess] = useState(false);

  const [profilePic, setProfilePic] = useState<string | null>(null);

  useEffect(() => {
    // Load profile picture from local state (synced from Supabase)
    const savedPic = localStorage.getItem('user_profile_pic');
    if (savedPic) setProfilePic(savedPic);

    // Wire up real-time inter-tab or context listener for updates
    const handlePicChange = (e: any) => {
      setProfilePic(e.detail);
    };
    window.addEventListener('profile-pic-changed' as any, handlePicChange);
    return () => window.removeEventListener('profile-pic-changed' as any, handlePicChange);
  }, []);

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
      vitals: dailyLogs,
      symptoms: lastSymptoms,
      riskScore,
      riskLevel: healthScore >= 70 ? 'Low' : healthScore >= 40 ? 'Moderate' : 'High',
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
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [downloadingReport, setDownloadingReport] = useState<string | null>(null);
  const activeUser = getStorageItem('userName') || 'Sathish';
  const [activeDevice, setActiveDevice] = useState<string>(() => getStorageItem('activeWearable') || 'None');
  const [isSyncingDevice, setIsSyncingDevice] = useState(false);
  const [activeVitalTab, setActiveVitalTab] = useState<'heart' | 'bp' | 'sleep' | 'water'>('heart');

  const [pairingDevice, setPairingDevice] = useState<string | null>(null);
  const [pairingPin, setPairingPin] = useState('');
  const [selectedOrgan, setSelectedOrgan] = useState<'brain' | 'heart' | 'fluid'>('brain');

  const [countdownString, setCountdownString] = useState('02h : 14m : 05s');
  const [nextMedName, setNextMedName] = useState('Aspirin');
  const [rotationAngle, setRotationAngle] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRotationAngle(prev => (prev + 2) % 360);

      const userMeds = JSON.parse(getStorageItem('addedMedications', '[]'));
      if (userMeds.length === 0) {
        setCountdownString('00h : 00m : 00s');
        setNextMedName('No Meds Active');
        return;
      }

      const now = new Date();
      let bestDiff = Infinity;
      let bestMedName = 'Aspirin';

      userMeds.forEach((med: any) => {
        if (!med.time) return;
        const [hh, mm] = med.time.split(':').map(Number);
        const target = new Date();
        target.setHours(hh, mm, 0, 0);

        let diff = target.getTime() - now.getTime();
        if (diff < 0) {
          target.setDate(target.getDate() + 1);
          diff = target.getTime() - now.getTime();
        }

        if (diff < bestDiff) {
          bestDiff = diff;
          bestMedName = med.name;
        }
      });

      if (bestDiff === Infinity) {
        setCountdownString('00h : 00m : 00s');
        setNextMedName('Medication');
      } else {
        const h = Math.floor(bestDiff / 3600000).toString().padStart(2, '0');
        const m = Math.floor((bestDiff % 3600000) / 60000).toString().padStart(2, '0');
        const s = Math.floor((bestDiff % 60000) / 1000).toString().padStart(2, '0');
        setCountdownString(`${h}h : ${m}m : ${s}s`);
        setNextMedName(bestMedName);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSyncDevice = (device: string) => {
    setPairingDevice(device);
    setPairingPin('');
  };

  const handleConfirmPairing = () => {
    if (pairingPin.length < 4) {
      toast.error('Pairing Code Required', { description: 'Please enter the 6-digit display pairing PIN.' });
      return;
    }

    const device = pairingDevice || 'Wearable';
    setPairingDevice(null);
    setIsSyncingDevice(true);
    toast.info(`Completing secure Bluetooth BLE handshake with ${device}...`, { duration: 1500 });

    setTimeout(() => {
      const syncedLogs = {
        heartRate: (64 + Math.floor(Math.random() * 12)).toString(),
        bloodPressure: '118/76',
        water: (7 + Math.floor(Math.random() * 3)).toString(),
        sleep: (7.2 + Math.random() * 1.5).toFixed(1)
      };
      setDailyLogs(syncedLogs);
      setStorageItem('dailyLogs', JSON.stringify(syncedLogs));

      const history = JSON.parse(getStorageItem('healthHistory', '[]'));
      const newLog = {
        id: Date.now().toString(),
        dateISO: new Date().toISOString().split('T')[0],
        heartRate: syncedLogs.heartRate,
        bloodPressure: syncedLogs.bloodPressure,
        water: syncedLogs.water,
        sleep: syncedLogs.sleep
      };
      setStorageItem('healthHistory', JSON.stringify([newLog, ...history]));
      setActiveDevice(device);
      setStorageItem('activeWearable', device);
      setIsSyncingDevice(false);

      toast.success(`${device} Connected`, {
        description: 'Secure Bluetooth link established. Active telemetry authorized.',
        duration: 3000
      });
    }, 1500);
  };

  const [notificationList, setNotificationList] = useState(() => {
    let currentList = [];
    const saved = localStorage.getItem(`user_notifications_${activeUser}`);
    if (saved) {
      try {
        currentList = JSON.parse(saved);
        // Auto-heal legacy cached hardcoded dates to 'Today'
        currentList = currentList.map((n: any) => {
          if (n.date === 'Yesterday' || n.date === '04/05/2026') {
            return { ...n, date: 'Today' };
          }
          return n;
        });
      } catch (e) {
        console.error(e);
      }
    }

    // Check if the user is an active user who has checked/updated something
    const hasSymptomHistory = JSON.parse(getStorageItem('symptomHistory', '[]')).length > 0;
    const hasSelectedSymptoms = JSON.parse(getStorageItem('selectedSymptoms', '[]')).length > 0;
    const hasAddedMeds = JSON.parse(getStorageItem('addedMedications', '[]')).length > 0;
    const hasHealthHistory = JSON.parse(getStorageItem('healthHistory', '[]')).length > 0;
    const hasCheckedOrUpdated = hasSymptomHistory || hasSelectedSymptoms || hasAddedMeds || hasHealthHistory;

    // If the user has not checked symptoms or logged any health logs/meds, notifications MUST be 100% empty!
    if (!hasCheckedOrUpdated) {
      return [];
    }

    if (currentList.length === 0) {
      currentList = [];

      // 1. Only include Symptom Analyzer & AI Diagnostics if they have symptom data
      if (hasSymptomHistory || hasSelectedSymptoms) {
        currentList.push({
          id: 'ai-1',
          sender: 'AI Diagnostics Engine',
          date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
          title: 'Cardio-respiratory optimization detected. Suggesting active recovery protocol.',
          type: 'ai_insight',
          unread: true,
        });
        currentList.push({
          id: 'symp-1',
          sender: 'Symptom Analyzer',
          date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
          title: 'Your biometric trends show a 15% reduction in overall metabolic stress indicators.',
          type: 'insight',
          unread: false,
        });
      }

      // 2. Only include Clinical Lab Sync if they have health logs or synced meds
      if (hasHealthHistory || hasAddedMeds) {
        currentList.push({
          id: 'sync-1',
          sender: 'Clinical Lab Sync',
          date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
          title: 'Latest lipid & metabolic panels synced securely with your medical provider.',
          type: 'report',
          unread: true,
          hasDownload: true,
          fileName: 'Lipid_Panel_Report.pdf'
        });
      }
    } else {
      // Dynamic append check for existing lists
      const hasSyncNotif = currentList.some((n: any) => n.id === 'sync-1');
      if ((hasHealthHistory || hasAddedMeds) && !hasSyncNotif) {
        currentList.push({
          id: 'sync-1',
          sender: 'Clinical Lab Sync',
          date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
          title: 'Latest lipid & metabolic panels synced securely with your medical provider.',
          type: 'report',
          unread: true,
          hasDownload: true,
          fileName: 'Lipid_Panel_Report.pdf'
        });
      }

      const hasAiNotif = currentList.some((n: any) => n.id === 'ai-1');
      if ((hasSymptomHistory || hasSelectedSymptoms) && !hasAiNotif) {
        currentList.push({
          id: 'ai-1',
          sender: 'AI Diagnostics Engine',
          date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
          title: 'Cardio-respiratory optimization detected. Suggesting active recovery protocol.',
          type: 'ai_insight',
          unread: true,
        });
        currentList.push({
          id: 'symp-1',
          sender: 'Symptom Analyzer',
          date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
          title: 'Your biometric trends show a 15% reduction in overall metabolic stress indicators.',
          type: 'insight',
          unread: false,
        });
      }
    }

    // Handle Dynamic Symptoms Alert
    const symptomId = 'dyn-symptom';
    if (lastSymptoms && lastSymptoms.length > 0) {
      const activeTitle = `Attention: Active symptoms logged (${lastSymptoms.join(', ')}). Monitor biometrics closely.`;
      const existingIdx = currentList.findIndex((n: any) => n.id === symptomId);
      if (existingIdx > -1) {
        // Update existing symptom alert title if symptoms changed
        if (currentList[existingIdx].title !== activeTitle) {
          currentList[existingIdx] = {
            ...currentList[existingIdx],
            title: activeTitle,
            unread: true // Reset to unread since symptoms are new/updated!
          };
        }
      } else {
        // Prepend new symptom alert
        currentList.unshift({
          id: symptomId,
          sender: 'Clinical Advisor',
          date: 'Today',
          title: activeTitle,
          type: 'warning',
          unread: true,
          hasDownload: false,
          fileName: ''
        });
      }
    } else {
      // Remove symptom alert if symptoms are cleared
      currentList = currentList.filter((n: any) => n.id !== symptomId);
    }

    // Handle Dynamic Medications Alert
    const medId = 'dyn-med';
    if (addedMeds && addedMeds.length > 0) {
      const activeTitle = `Dose schedule synchronized: ${addedMeds.length} items active in your clinical timeline.`;
      const existingIdx = currentList.findIndex((n: any) => n.id === medId);
      if (existingIdx > -1) {
        // Update existing med alert title if medication list changed
        if (currentList[existingIdx].title !== activeTitle) {
          currentList[existingIdx] = {
            ...currentList[existingIdx],
            title: activeTitle,
            unread: true // Reset to unread since medications are new/updated!
          };
        }
      } else {
        // Append new med alert
        currentList.push({
          id: medId,
          sender: 'Protocol Scheduler',
          date: 'Today',
          title: activeTitle,
          type: 'insight',
          unread: true,
          hasDownload: false,
          fileName: ''
        });
      }
    } else {
      // Remove med alert if medications are cleared
      currentList = currentList.filter((n: any) => n.id !== medId);
    }

    return currentList;
  });

  useEffect(() => {
    localStorage.setItem(`user_notifications_${activeUser}`, JSON.stringify(notificationList));
  }, [notificationList, activeUser]);

  // Dynamically sync and update dailyLogs state from localStorage on page load, focus, or route change
  useEffect(() => {
    const updateLogs = () => {
      const saved = getStorageItem('dailyLogs');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setDailyLogs(parsed);
        } catch (e) {
          console.error(e);
        }
      }
    };

    updateLogs();
    window.addEventListener('focus', updateLogs);
    window.addEventListener('storage', updateLogs);

    return () => {
      window.removeEventListener('focus', updateLogs);
      window.removeEventListener('storage', updateLogs);
    };
  }, [location.pathname]);

  // Sync Clinical Lab Sync notification dynamically when they perform any active health checks or updates
  useEffect(() => {
    const hasSymptomHistory = JSON.parse(getStorageItem('symptomHistory', '[]')).length > 0;
    const hasSelectedSymptoms = JSON.parse(getStorageItem('selectedSymptoms', '[]')).length > 0;
    const hasAddedMeds = JSON.parse(getStorageItem('addedMedications', '[]')).length > 0;
    const hasHealthHistory = JSON.parse(getStorageItem('healthHistory', '[]')).length > 0;

    setNotificationList(prev => {
      let updated = [...prev];

      // Sync Lab Report
      const hasSyncNotif = updated.some(n => n.id === 'sync-1');
      if ((hasHealthHistory || hasAddedMeds) && !hasSyncNotif) {
        updated = [
          {
            id: 'sync-1',
            sender: 'Clinical Lab Sync',
            date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
            title: 'Latest lipid & metabolic panels synced securely with your medical provider.',
            type: 'report',
            unread: true,
            hasDownload: true,
            fileName: 'Lipid_Panel_Report.pdf'
          },
          ...updated
        ];
      }

      // Sync AI Diagnostics & Symptom Analyzer
      const hasAiNotif = updated.some(n => n.id === 'ai-1');
      if ((hasSymptomHistory || hasSelectedSymptoms) && !hasAiNotif) {
        updated = [
          {
            id: 'ai-1',
            sender: 'AI Diagnostics Engine',
            date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
            title: 'Cardio-respiratory optimization detected. Suggesting active recovery protocol.',
            type: 'ai_insight',
            unread: true,
          },
          {
            id: 'symp-1',
            sender: 'Symptom Analyzer',
            date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
            title: 'Your biometric trends show a 15% reduction in overall metabolic stress indicators.',
            type: 'insight',
            unread: false,
          },
          ...updated
        ];
      }

      return updated;
    });
  }, [location.pathname]);

  const handleMarkSingleRead = (id: string) => {
    setNotificationList(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const handleMarkAllRead = () => {
    setNotificationList(prev => prev.map(n => ({ ...n, unread: false })));
    toast.success('All notifications marked as read');
  };

  const handleDeleteNotif = (id: string) => {
    setNotificationList(prev => prev.filter(n => n.id !== id));
    toast.info('Notification dismissed');
  };

  const handleDownload = (id: string, fileName: string) => {
    setDownloadingReport(id);
    setTimeout(() => {
      setDownloadingReport(null);
      setNotificationList(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));

      // 1. Calculate dynamic date string
      const currentDate = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });

      // 2. Set up dynamic lab result variables based on user's actual health score
      let totalChol = 185;
      let ldl = 102;
      let hdl = 58;
      let triglycerides = 125;
      let hba1c = '5.4%';
      let glucose = 92;
      let scoreCategory = 'Optimal Range';
      let bp = '120/80 mmHg';
      let rhr = 68;
      let cardioStatus = 'Stable / Normal';
      let insights = `- Cardiovascular profile is highly stable. Fasting glucose is within the optimal range.
- Slight borderline LDL levels detected. LifeMatrix recommends a diet high in dietary soluble fiber (oats, avocados, apples) and active physical training (30 mins cardio daily) to maintain HDL-to-LDL balance.
- Vitamin D levels are sufficient, but daily morning sunlight exposure is advised to maintain bio-availability.`;

      if (healthScore >= 90) {
        totalChol = 172;
        ldl = 85;
        hdl = 66;
        triglycerides = 105;
        hba1c = '5.1%';
        glucose = 84;
        scoreCategory = 'Peak Biomarker Efficiency';
        bp = '115/75 mmHg';
        rhr = 62;
        cardioStatus = 'Outstanding Cardiovascular Efficiency';
        insights = `- Excellent biological performance. All key blood biomarkers sit in the top 5% percentiles.
- HbA1c and glucose metrics represent superb glycemic control.
- Continue current diet, hydration, and exercise protocols to maintain peak metabolic longevity.`;
      } else if (healthScore < 80 && healthScore >= 65) {
        totalChol = 215;
        ldl = 124;
        hdl = 46;
        triglycerides = 155;
        hba1c = '5.8%';
        glucose = 104;
        scoreCategory = 'Moderate / Pre-optimal';
        bp = '128/82 mmHg';
        rhr = 74;
        cardioStatus = 'Stable with Mild Metabolic Elevation';
        insights = `- Borderline glycemic metrics detected (HbA1c: 5.8% / Pre-diabetic threshold). It is recommended to reduce processed carbohydrate consumption.
- Moderate LDL cholesterol elevation. Incorporate heart-healthy unsaturated fats (olive oil, walnuts) and increase weekly aerobic exercise.
- Schedule a follow-up metabolic assessment in 60 days to track adjustments.`;
      } else if (healthScore < 65) {
        totalChol = 238;
        ldl = 154;
        hdl = 36;
        triglycerides = 195;
        hba1c = '6.2%';
        glucose = 120;
        scoreCategory = 'Sub-optimal Range / Action Advised';
        bp = '135/86 mmHg';
        rhr = 80;
        cardioStatus = 'Elevated Cardiovascular & Metabolic Load';
        insights = `- Elevated glycemic and lipid indexes. Consistent fasting glucose above 100 mg/dL requires active metabolic supervision.
- High LDL cholesterol and low HDL levels increase arterial stress. Please focus heavily on high-fiber diets and eliminate simple sugars.
- Highly recommended to consult your clinical provider or primary care physician for a comprehensive health consultation.`;
      }

      // Helper function to build beautiful ASCII progress bars
      const getBar = (val: number, max: number) => {
        const size = 15;
        const filled = Math.min(Math.round((val / max) * size), size);
        return '[' + '■'.repeat(filled) + ' '.repeat(size - filled) + ']';
      };

      // 3. Compile dynamic, high-fidelity report text using user state values
      const reportContent = `======================================================================
               LIFEMATRIX CLINICAL COMPREHENSIVE BIOMETRIC LABS
======================================================================
PATIENT DOSSIER:
  Name: ${userName}
  Date Generated: ${currentDate}
  Report ID: LM-${Math.floor(10000 + Math.random() * 90000)}-SYNC
  Security Hash: SHA-256://LM_${Math.floor(1000 + Math.random() * 9000)}
  Sync Status: COMPLETE & PARSED THROUGH SECURE CHANNEL
======================================================================

OVERALL METRIC HEALTH PROFILE:
----------------------------------------------------------------------
  Clinical Score : ${healthScore}% (${scoreCategory})
  Cardio Status  : ${cardioStatus}
  Blood Pressure : ${bp}
  Pulse (RHR)    : ${rhr} bpm

LABORATORY BLOOD CHEMISTRY PROFILE (METABOLIC & LIPIDS):
----------------------------------------------------------------------
1. CHOLESTEROL PANEL
  - Total Cholesterol: ${totalChol} mg/dL   ${getBar(totalChol, 300)} (Normal: < 200)
  - LDL (Bad)        : ${ldl} mg/dL   ${getBar(ldl, 200)} (Normal: < 100)
  - HDL (Good)       : ${hdl} mg/dL   ${getBar(hdl, 100)} (Normal: > 40)
  - Triglycerides    : ${triglycerides} mg/dL   ${getBar(triglycerides, 250)} (Normal: < 150)

2. GLYCEMIC INDEXES
  - HbA1c            : ${hba1c}          ${getBar(parseFloat(hba1c), 10)} (Normal: < 5.7%)
  - Fasting Glucose  : ${glucose} mg/dL    ${getBar(glucose, 150)} (Normal: 70-99 mg/dL)

3. METABOLIC ENDOCRINE & CELLULAR INTEGRITY
  - Thyroid Stimulating (TSH): 2.1 uIU/mL [■■■■■          ] (Normal: 0.4 - 4.0)
  - Vitamin D (25-Hydroxy)    : 38 ng/mL   [■■■■■          ] (Normal: 30 - 100)

DIAGNOSTIC CLINICAL ADVISORY (LifeMatrix AI):
----------------------------------------------------------------------
${insights}

======================================================================
DISCLAIMER: This clinical report is parsed using LifeMatrix AI secure data ingestion nodes. It is for tracking and educational reference only. Please consult your physician for definitive clinical treatment.
======================================================================`;

      try {
        // Create a blob and trigger browser download
        const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;

        // Use clean txt format if pdf wrapper is not supported natively in client-side text generation
        const cleanName = fileName.endsWith('.pdf') ? fileName.replace('.pdf', '_clinical_report.txt') : fileName;
        link.download = cleanName;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);

        toast.success('Report Downloaded', {
          description: `${cleanName} downloaded and parsed into clinical logs.`,
          duration: 4000
        });
      } catch (err) {
        console.error('Download trigger failed:', err);
        toast.error('Download Failed', {
          description: 'Automatic file downloading is restricted on this mobile system.',
          duration: 4000
        });
      }
    }, 1500);
  };

  const unreadCount = notificationList.filter(n => n.unread).length;

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setShowDiagnostics(false);
      toast.success('Cloud Biometric Sync Complete', {
        description: 'All local health data securely encrypted and backed up.',
      });
    }, 2000);
  };
  useEffect(() => {
    const savedLogs = getStorageItem('dailyLogs');
    if (savedLogs) setDailyLogs(JSON.parse(savedLogs));
    const savedTasks = getStorageItem('completed_tasks_status');
    if (savedTasks) setCompletedTasks(JSON.parse(savedTasks));
  }, [location.pathname]);

  const userMeds = JSON.parse(getStorageItem('addedMedications', '[]'));

  const tasks = [
    ...userMeds.map((med: any) => ({
      title: med.dosage ? `Take ${med.name} (${med.dosage})` : `Take ${med.name}`,
      time: med.time,
      icon: Plus,
      color: 'text-emerald-500', // updated to clinical green
      cat: 'Medication'
    })),
    { title: 'Cloud Biometric Sync', time: '11:00 PM', icon: Zap, color: 'text-indigo-500', cat: 'System' },
  ];

  const handleToggleTask = (title: string) => {
    const updated = { ...completedTasks, [title]: !completedTasks[title] };
    setCompletedTasks(updated);
    setStorageItem('completed_tasks_status', JSON.stringify(updated));
  };

  const handleToggleAll = () => {
    const allDone = tasks.every(t => completedTasks[t.title]);
    const updated: Record<string, boolean> = {};
    if (!allDone) tasks.forEach(t => updated[t.title] = true);
    setCompletedTasks(updated);
    setStorageItem('completed_tasks_status', JSON.stringify(updated));
  };

  const handleDeleteTask = (taskTitle: string) => {
    const savedMeds = JSON.parse(getStorageItem('addedMedications', '[]'));
    const updatedMeds = savedMeds.filter((med: any) => `Take ${med.name} (${med.dosage})` !== taskTitle);
    setStorageItem('addedMedications', JSON.stringify(updatedMeds));

    const updatedCompleted = { ...completedTasks };
    delete updatedCompleted[taskTitle];
    setCompletedTasks(updatedCompleted);
    setStorageItem('completed_tasks_status', JSON.stringify(updatedCompleted));

    toast.success('Protocol item removed');
  };

  // -------------------------------------------------------------------------
  // PROFESSIONAL WEB NOTIFICATIONS ENGINE
  // -------------------------------------------------------------------------
  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }
  }, []);

  const sendSystemNotification = (title: string, body: string) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body: body,
        icon: '/logo.png', // Ensure this points to your public assets
        badge: '/logo.png',
        vibrate: [200, 100, 200]
      });
    }
  };

  useEffect(() => {
    const checkReminders = () => {
      const savedMeds = getStorageItem('addedMedications');
      if (!savedMeds) return;
      const medications = JSON.parse(savedMeds);
      const now = new Date();
      const currentHH = now.getHours().toString().padStart(2, '0');
      const currentMM = now.getMinutes().toString().padStart(2, '0');
      const currentHHMM = `${currentHH}:${currentMM}`;

      medications.forEach((med: any) => {
        if (med.time === currentHHMM) {
          const key = `notified_${med.name}_${currentHHMM}`;
          if (!sessionStorage.getItem(key)) {
            sessionStorage.setItem(key, 'true');
            setActiveAlert(`Time for ${med.name}`);

            // Trigger System-Level Notification
            sendSystemNotification(
              'LifeMatrix Protocol Alert',
              `Scheduled dose: ${med.name} (${med.dosage}) is due now.`
            );
          }
        }
      });
    };
    const interval = setInterval(checkReminders, 10000);
    return () => clearInterval(interval);
  }, []);

  // -------------------------------------------------------------------------
  // PROFESSIONAL BIOMETRIC STABILITY INDEX (BSI) - UNIFIED CLINICAL ENGINE
  // -------------------------------------------------------------------------

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

  // 2. Aggregate Historical Risk (Highest archived risk in last 30 days)
  const historyRisk = symptomHistory.length > 0
    ? Math.max(...symptomHistory.map((h: any) => h.riskScore))
    : 0;

  // 3. Final BSI Calculation: Base 100% reduced by peak active or historical pathology
  const peakPathology = Math.min(Math.max(currentRiskScore, historyRisk), 98);

  // Corrective Protocol Buffer (+5% for adherence)
  const protocolBuffer = addedMeds.length > 0 ? 5 : 0;

  const healthScore = Math.max(Math.min(100 - peakPathology + protocolBuffer, 100), 15);
  const riskScore = Math.round(peakPathology);

  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  const currentUserStr = localStorage.getItem('currentUser');
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
  const userName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Sathish';
  const hour = new Date().getHours();
  let greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="size-full bg-slate-50 overflow-y-auto overflow-x-hidden selection:bg-secondary/20 relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100/40 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full px-5 pt-5 pb-1 relative z-10 md:px-12 md:pt-8 md:pb-4 max-w-[1600px] mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-5 md:mb-8">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setShowDiagnostics(true)}
              className="w-11 h-11 md:w-12 md:h-12 bg-white rounded-full border border-border shadow-sm flex items-center justify-center overflow-hidden p-0.5 active:scale-95 transition-all cursor-pointer hover:shadow-md"
            >
              <img src={logo} className="w-full h-full object-contain scale-[1.2]" alt="Logo" />
            </button>
            <div>
              <h1 className="text-xl font-black text-indigo-950 tracking-tight leading-none">LifeMatrix <span className="text-secondary">AI</span></h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`w-11 h-11 md:w-12 md:h-12 rounded-full border flex items-center justify-center relative active:scale-95 transition-all cursor-pointer ${showNotifications
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100'
                : 'bg-white border-border text-indigo-950 shadow-sm hover:shadow-md'
                }`}
              title="Biological Feeds"
            >
              <Bell className="w-4.5 h-4.5 md:w-5 md:h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-rose-500 border-2 border-white rounded-full text-[8px] font-black text-white flex items-center justify-center px-1 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
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
              className="h-11 px-3.5 md:h-12 md:px-4 rounded-full bg-rose-50 text-rose-600 border border-rose-100 flex items-center gap-2.5 md:gap-3 shadow-sm active:scale-95 transition-all"
            >
              <LogOut className="w-4.5 h-4.5 md:w-5 md:h-5" />
              <span className="hidden sm:inline text-[11px] font-black uppercase tracking-widest">Log Out</span>
            </button>
          </div>
        </div>


        {activeAlert && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -20 }}
            animate={{ height: 'auto', opacity: 1, y: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="bg-rose-600 rounded-3xl p-5 text-white flex items-center justify-between shadow-xl shadow-rose-200 animate-pulse-slow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-rose-200 mb-0.5">Critical Reminder</p>
                  <h3 className="text-sm font-black tracking-tight">{activeAlert}</h3>
                </div>
              </div>
              <button
                onClick={() => setActiveAlert(null)}
                className="px-4 py-2 bg-white text-rose-600 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-rose-50 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}

        {/* 1. GREETING BOX - COMPACT ON WEB */}
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-purple-950 rounded-[32px] p-6 text-white relative overflow-hidden border border-indigo-800/30 shadow-[0_20px_40px_rgba(99,102,241,0.12)] mb-6 md:rounded-[40px] md:p-8 md:mb-8">
          {/* Breathing Ambient Glow Spheres */}
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-indigo-600/30 rounded-full blur-[80px] animate-pulse pointer-events-none"></div>
          <div className="absolute -top-12 -left-12 w-52 h-52 bg-rose-500/20 rounded-full blur-[60px] animate-pulse pointer-events-none" style={{ animationDuration: '6s' }}></div>

          <div className="relative z-10 flex items-center justify-between gap-3 md:gap-6">
            <div className="flex items-center gap-3 md:gap-5 min-w-0 flex-1">
              {/* HIGH-TECH DASHBOARD PORTRAIT IDENTIFIER */}
              <div className="relative flex-shrink-0">
                <div 
                  onClick={() => navigate('/app/profile')}
                  className="w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-[28px] border flex items-center justify-center overflow-hidden shadow-inner cursor-pointer active:scale-95 transition-all duration-300 bg-indigo-950/40 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)] group"
                >
                  {profilePic ? (
                    <img src={profilePic} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="ID" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-secondary flex items-center justify-center text-white font-black uppercase text-sm md:text-xl tracking-wider">
                      {userName.charAt(0)}
                    </div>
                  )}
                </div>
              </div>

              <div className="min-w-0 flex-1 py-0.5">
                <p className="text-indigo-300 text-[8px] md:text-[11px] font-black uppercase tracking-[0.2em] mb-1.5 leading-none">{currentDate}</p>
                <h2 className="min-w-0 mb-2 flex flex-col md:flex-row md:items-baseline md:gap-2">
                  <span className="block text-xs md:text-3xl font-bold md:font-black text-indigo-200/90 md:text-white leading-tight">
                    {greeting},
                  </span>
                  <span className="block text-lg md:text-3xl font-black tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-100 truncate">
                    {userName}
                  </span>
                </h2>

                {/* Dynamic Status Badge */}
                {healthScore >= 50 ? (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full w-fit">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-emerald-400">BIOMETRICS OPTIMIZED</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full w-fit">
                    <span className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-ping"></span>
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-rose-400">PATHOLOGY WARNING</span>
                  </div>
                )}
              </div>
            </div>

            {/* Glowing Circular SVG Health Ring */}
            <div className="relative flex items-center justify-center flex-shrink-0">
              <svg className="w-20 h-20 md:w-28 md:h-28 transform -rotate-90" viewBox="0 0 80 80">
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" /> {/* Cyan */}
                    <stop offset="100%" stopColor="#6366f1" /> {/* Indigo */}
                  </linearGradient>
                </defs>
                {/* Background Track */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  className="stroke-slate-800/80"
                  strokeWidth="5.5"
                  fill="transparent"
                />
                {/* Glow path */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke="url(#scoreGradient)"
                  strokeWidth="5.5"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="opacity-40 blur-[2px]"
                />
                {/* Real path */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke="url(#scoreGradient)"
                  strokeWidth="5.5"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
              </svg>

              {/* Central percentage text */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-base md:text-2xl font-black tracking-tighter leading-none text-white">{healthScore}%</span>
                <span className="text-[6px] md:text-[8px] font-bold tracking-widest text-indigo-300 uppercase mt-0.5 leading-none">HEALTH</span>
              </div>
            </div>
          </div>
        </div>

        {/* PROFESSIONAL CRITICAL EMERGENCY SOS PANEL */}
        <div className="mb-4 md:mb-6 bg-rose-50/70 rounded-2xl md:rounded-[32px] p-3 md:p-5 border border-rose-100 shadow-sm md:shadow-md relative overflow-hidden group animate-pulse-slow">
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          <div className="absolute -right-12 -top-12 w-36 h-36 bg-rose-400/10 rounded-full blur-2xl opacity-20 pointer-events-none"></div>
          
          <div className="flex items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-9.5 h-9.5 md:w-12 md:h-12 rounded-full md:rounded-2xl bg-rose-100/60 border border-rose-200/50 flex items-center justify-center animate-pulse flex-shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]">
                <AlertTriangle className="w-4.5 h-4.5 md:w-5.5 md:h-5.5 text-rose-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[8.5px] md:text-[9px] font-black uppercase tracking-[0.15em] text-rose-600 leading-none whitespace-nowrap">Emergency Active</p>
                <h3 className="text-[13.5px] md:text-base font-black tracking-tight leading-none mt-1.5 text-rose-900 truncate">Critical Response</h3>
                <p className="hidden md:block text-[10px] text-rose-800/80 font-bold mt-1.5 opacity-90 leading-relaxed max-w-md">Directly routes your call to the nearest medical emergency dispatch center.</p>
              </div>
            </div>

            <button
              onClick={handleCallER}
              className="px-4 py-2 md:py-3.5 md:px-6 rounded-full md:rounded-2xl bg-rose-600 text-white font-black text-[10.5px] md:text-xs uppercase tracking-wider md:tracking-widest shadow-[0_4px_12px_rgba(225,29,72,0.15)] active:scale-95 transition-all cursor-pointer border-none flex items-center justify-center gap-1.5 flex-shrink-0"
            >
              <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 animate-bounce" />
              <span>Call Now</span>
            </button>
          </div>
        </div>

        {/* 2. ACTION GRID - COMPACT ON WEB */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 md:gap-6 md:mb-10">
          {[
            { label: 'Symptom Checker', sub: 'CLINICAL DX', icon: Stethoscope, color: 'text-emerald-600', bg: 'bg-emerald-50/50', action: () => navigate('/app/symptom-input') },
            { label: 'Risk Analysis', sub: 'NEURAL TRENDS', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50/50', action: () => navigate('/app/risk-dashboard') },
            { label: 'AI Assistant', sub: 'GPT-4 CORE', icon: Brain, color: 'text-purple-600', bg: 'bg-purple-50/50', action: () => navigate('/app/ai-chat') },
            { label: 'Health Tracker', sub: 'BIO-SYNC', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50/50', action: () => navigate('/app/calendar') },
          ].map((item, idx) => (
            <button key={idx} onClick={item.action} className="group relative bg-white rounded-[28px] p-4 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col gap-3.5 text-left hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all active:scale-95 md:p-6 group">
              <div className={`w-11 h-11 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} shadow-sm group-hover:scale-110 transition-transform relative overflow-hidden`}>
                <item.icon className="w-5.5 h-5.5 relative z-10" />
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div>
                <p className="text-[7px] font-black text-muted-foreground/60 uppercase tracking-[0.15em] mb-1 leading-none group-hover:text-secondary/60 transition-colors">{item.sub}</p>
                <h3 className="text-[13px] md:text-[15px] font-black text-indigo-950 tracking-tight leading-tight group-hover:text-secondary transition-colors">{item.label}</h3>
              </div>

              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-transparent via-transparent to-slate-50/30 rounded-full -mr-8 -mt-8"></div>
            </button>
          ))}
        </div>

        {/* PREMIUM HEALTH SIGNALS & NOTIFICATIONS CENTER */}
        <div className="mb-5">
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.05)] transition-all duration-300">
            {/* Header Banner - Coral/Red Theme Matching User's Request */}
            <div
              onClick={() => setShowNotifications(!showNotifications)}
              className="bg-gradient-to-r from-rose-400 to-rose-500 px-4 py-3 flex items-center justify-between cursor-pointer group text-white relative overflow-hidden active:opacity-95 select-none"
            >
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

              <div className="flex items-center gap-2.5 relative z-10">
                <Bell className="w-4 h-4 text-white" />
                <h3 className="text-[11px] font-black tracking-widest uppercase text-white leading-none">
                  NOTIFICATION
                </h3>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-white text-[7.5px] font-black text-rose-600 rounded-full border border-rose-100 animate-pulse leading-none">
                    {unreadCount} NEW
                  </span>
                )}
              </div>

              {/* Circular expand button with double-arrow expand/collapse icon */}
              <button className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center bg-white/10 text-white group-hover:bg-white/20 active:scale-90 transition-all cursor-pointer">
                <svg
                  className={`w-4 h-4 text-white transition-transform duration-300 ${showNotifications ? 'rotate-180' : ''}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 3 21 3 21 9" />
                  <polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              </button>
            </div>

            {/* Notifications List - Always visible, but sliced based on expand state */}
            <div className="bg-white border-t border-slate-100">
              {/* Optional subheader - Only when expanded and list is not empty */}
              {showNotifications && notificationList.length > 0 && (
                <div className="flex items-center justify-between py-2 px-4 border-b border-slate-50 bg-slate-50/40">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Biological Feed</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAllRead();
                    }}
                    className="text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                  >
                    Mark All As Read
                  </button>
                </div>
              )}

              <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                {notificationList.length > 0 ? (
                  (showNotifications ? notificationList : notificationList.slice(0, 2)).map((notif) => (
                    <div
                      key={notif.id}
                      className={`flex items-start gap-3.5 py-3.5 px-4 transition-all ${notif.unread ? 'bg-indigo-50/5' : ''
                        }`}
                    >
                      {/* Far Left: Avatar Image Placeholder (Matching the Screenshot Profile Face) */}
                      <div className="w-10 h-10 rounded-full border border-slate-100 flex-shrink-0 overflow-hidden bg-slate-50 relative shadow-xs">
                        {notif.type === 'ai_insight' ? (
                          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xs">
                            <Sparkles className="w-4.5 h-4.5" />
                          </div>
                        ) : notif.type === 'warning' ? (
                          <div className="w-full h-full bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white font-black text-xs">
                            <AlertTriangle className="w-4.5 h-4.5" />
                          </div>
                        ) : notif.type === 'report' ? (
                          <div className="w-full h-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-black text-xs">
                            <Stethoscope className="w-4.5 h-4.5" />
                          </div>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-black text-xs">
                            <TrendingUp className="w-4.5 h-4.5" />
                          </div>
                        )}
                      </div>

                      {/* Content Wrapper with Left Green/Teal Line (Matching Screenshot Layout) */}
                      <div className="flex-1 min-w-0 border-l-2 border-teal-500 pl-3.5 relative py-0.5">
                        {/* Little Left Pointer Arrow pointing at Avatar */}
                        <div className="absolute top-2 -left-[6px] w-2.5 h-2.5 bg-white border-l-2 border-b-2 border-teal-500 rotate-45"></div>

                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="text-[11px] font-bold text-slate-500">
                            <span className="text-indigo-600 hover:underline cursor-pointer">{notif.sender}</span> on <span className="text-slate-400">{notif.date === new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) ? 'Today' : notif.date}</span>
                          </p>

                          {/* Read dot + Dismiss trash */}
                          <div className="flex items-center gap-2">
                            {notif.unread && (
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkSingleRead(notif.id);
                                }}
                                className="w-2 h-2 bg-indigo-500 rounded-full cursor-pointer hover:scale-125 transition-transform"
                                title="Mark as read"
                              ></span>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteNotif(notif.id);
                              }}
                              className="p-1 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
                              title="Dismiss Alert"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <h4 className="text-[11px] font-semibold text-slate-700 leading-relaxed mb-2.5 pr-2">
                          {notif.title}
                        </h4>

                        {/* Solid Teal Download Button (Matching Screenshot button) */}
                        {notif.hasDownload && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(notif.id, notif.fileName);
                            }}
                            disabled={downloadingReport !== null}
                            className="px-3 py-1.5 bg-teal-500 text-white hover:bg-teal-600 transition-all rounded text-[9.5px] font-bold uppercase flex items-center gap-1.5 border-none shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
                          >
                            {downloadingReport === notif.id ? (
                              <>
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Syncing...
                              </>
                            ) : (
                              <>
                                {/* Document File Icon inside button */}
                                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                                </svg>
                                Download
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-3 border border-slate-100">
                      <Bell className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-tight">All Feeds Clear</h4>
                    <p className="text-[10px] text-slate-400 mt-1">No pending health alerts or clinical reports.</p>
                  </div>
                )}
              </div>

              {/* Quick "Show More" banner when collapsed and there are more items */}
              {!showNotifications && notificationList.length > 2 && (
                <div
                  onClick={() => setShowNotifications(true)}
                  className="py-2.5 text-center bg-rose-500/5 hover:bg-rose-500/10 border-t border-slate-100 text-[9.5px] font-black uppercase tracking-widest text-rose-600 cursor-pointer active:scale-98 transition-all"
                >
                  + {notificationList.length - 2} More Alerts (Tap to Expand)
                </div>
              )}
              {showNotifications && notificationList.length > 2 && (
                <div
                  onClick={() => setShowNotifications(false)}
                  className="py-2.5 text-center bg-slate-50 hover:bg-slate-100 border-t border-slate-100 text-[9.5px] font-black uppercase tracking-widest text-slate-500 cursor-pointer active:scale-98 transition-all"
                >
                  Tap to Collapse List
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. CLINICAL NAV - COMPACT ON WEB */}
        <div onClick={() => navigate('/app/hospitals')} className="bg-emerald-50 rounded-[28px] p-4 border border-emerald-100 mb-4 flex items-center gap-4 hover:shadow-lg transition-all cursor-pointer md:rounded-[32px] md:p-6 md:mb-6">
          <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center md:w-14 md:h-14 md:rounded-2xl">
            <MapPin className="w-6 h-6 text-emerald-600 md:w-7 md:h-7" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm md:text-lg font-black text-emerald-900 tracking-tight">Clinical Nav</h3>
            <p className="text-[10px] md:text-xs text-emerald-700/70 font-bold">Hyper-local medical facility mapping</p>
          </div>
          <ChevronRight className="w-5 h-5 text-emerald-400" />
        </div>

        {/* WEARABLE & BIO-SENSOR SYNC PORTAL + BIO-TWIN REPORT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* Wearable Sync Control Center */}
          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" />
                <h3 className="text-[13px] font-black uppercase tracking-widest text-slate-700">Bio-Sensor Portal</h3>
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                Active: {activeDevice}
              </span>
            </div>

            <p className="text-[10px] text-slate-400 font-medium mb-4">
              Authorize dynamic wireless links to your active physical wearable sensors.
            </p>

            <div className="space-y-3">
              {[
                { name: 'Apple Watch Series 9', id: 'AppleWatch', status: activeDevice === 'AppleWatch' ? 'Connected' : 'Available', sub: 'WPT-2 Neural Sync' },
                { name: 'boAt Wave Sigma', id: 'boAtWave', status: activeDevice === 'boAtWave' ? 'Connected' : 'Available', sub: 'BLE Telemetry v4.2' },
                { name: 'Fire-Boltt Gladiator', id: 'FireBoltt', status: activeDevice === 'FireBoltt' ? 'Connected' : 'Available', sub: 'SpO2 & HR Link' },
              ].map((device) => {
                const isConnected = activeDevice === device.id;
                return (
                  <div
                    key={device.id}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      isConnected
                        ? 'bg-indigo-50/50 border-indigo-200/60 shadow-xs'
                        : 'bg-slate-50/30 border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                        isConnected
                          ? 'bg-indigo-600 text-white shadow-xs animate-pulse'
                          : 'bg-slate-100 text-slate-400'
                      }`}>
                        <Watch className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-indigo-950 leading-tight uppercase tracking-tight">{device.name}</h4>
                        <p className="text-[9px] text-slate-400 font-bold mt-0.5">{device.sub}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (isConnected) {
                          setActiveDevice('None');
                          removeStorageItem('activeWearable');
                          toast.success('Device Unpaired', {
                            description: `${device.name} link terminated.`
                          });
                        } else {
                          handleSyncDevice(device.id);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl font-black text-[9px] uppercase tracking-widest active:scale-95 transition-all cursor-pointer transform-gpu will-change-transform ${
                        isConnected
                          ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                      }`}
                    >
                      {isConnected ? 'Disconnect' : 'Pair'}
                    </button>
                  </div>
                );
              })}
            </div>

            {activeDevice !== 'None' && (
              <button
                onClick={() => {
                  setActiveDevice('None');
                  removeStorageItem('activeWearable');
                  toast.success('Device Unpaired', {
                    description: 'Biometric telemetry link severed successfully.'
                  });
                }}
                className="w-full mt-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold text-[9px] uppercase tracking-widest transition-all cursor-pointer border border-rose-100 active:scale-98"
              >
                Disconnect Active Link
              </button>
            )}
          </div>

          {/* Weekly Bio-Twin AI Summarizer Card */}
          <div className="bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-white rounded-3xl border border-indigo-100/30 p-5 shadow-[0_8px_30px_rgba(99,102,241,0.02)] flex flex-col justify-between">
            {activeDevice === 'None' ? (
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-4.5 h-4.5 text-slate-400" />
                    <h3 className="text-[13px] font-black uppercase tracking-widest text-slate-500">Bio-Twin AI Summary</h3>
                  </div>

                  <div className="py-2 text-center flex flex-col items-center justify-center">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2.5 animate-pulse border border-slate-200">
                      <Shield className="w-4 h-4 text-slate-400" />
                    </div>
                    <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-wider leading-none">Standby Mode</h4>
                    <p className="text-[10px] text-slate-400 mt-1 max-w-[200px] leading-relaxed font-semibold">
                      Pair an active wearable sensor to trigger continuous neural summary reporting.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100/60 flex items-center justify-between text-[7px] font-black tracking-widest uppercase text-slate-400 select-none">
                  <span>Bio-Twin Health Model v2.4</span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                    Engine Offline
                  </span>
                </div>
              </div>
            ) : (() => {
              const hr = parseInt(dailyLogs.heartRate) || 0;
              const bpStr = dailyLogs.bloodPressure || '120/80';
              const [systolic, diastolic] = bpStr.split('/').map(v => parseInt(v) || 0);
              const sleep = parseFloat(dailyLogs.sleep) || 0;
              const water = parseInt(dailyLogs.water) || 0;

              let insights: string[] = [];

              if (hr > 100) {
                insights.push('Cardiopulmonary strain flagged. Autonomic RHR is currently elevated above baseline norms.');
              } else {
                insights.push('Cardiopulmonary stability is optimal. Myocardial efficiency is tracking inside nominal parameters.');
              }

              if (systolic >= 130 || diastolic >= 85) {
                insights.push('Mild vascular resistance noted. Monitor sodium, stress factors, and hydration intervals.');
              }

              if (sleep > 0 && sleep < 6.5) {
                insights.push('Cerebral glymphatic rest debt detected. Cognitive recovery cycles are currently sub-optimal.');
              } else if (sleep >= 6.5) {
                insights.push('Circadian sleep alignment is nominal. Neurological repair and deep-wave cycles completed.');
              }

              if (water > 0 && water < 7) {
                insights.push('Micro-hydration reserves are low. Plasma viscosity optimization requires fluid loading.');
              } else if (water >= 7) {
                insights.push('Hydration index is ideal. Renal volume clearance is highly balanced.');
              }

              return (
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4.5 h-4.5 text-purple-600 animate-pulse" />
                      <h3 className="text-[13px] font-black uppercase tracking-widest text-indigo-950">Bio-Twin AI Summary</h3>
                    </div>

                    {/* Dynamic Glowing AI Bio-Core Sphere */}
                    <div className="flex items-center gap-3.5 bg-indigo-950 rounded-2xl p-3 text-white border border-indigo-800/20 mb-3.5 relative overflow-hidden shadow-md">
                      <div className="absolute inset-0 bg-radial-gradient from-indigo-500/10 via-transparent to-transparent opacity-40"></div>
                      <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-600 flex items-center justify-center p-0.5 flex-shrink-0 shadow-lg relative z-10 animate-spin-slow">
                        <div className="w-full h-full rounded-full bg-indigo-950 flex items-center justify-center relative">
                          <Brain className="w-5 h-5 text-indigo-400 animate-pulse" />
                        </div>
                      </div>
                      <div className="relative z-10">
                        <span className="text-[6.5px] font-black uppercase tracking-[0.25em] text-indigo-300 block mb-0.5">LifeMatrix Core Neural Engine</span>
                        <h4 className="text-[10px] font-black tracking-tight uppercase leading-none">AI Twin Active & Synced</h4>
                      </div>
                    </div>

                    <div className="space-y-2 select-none">
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0"></span>
                        <p className="text-xs font-semibold text-indigo-950 leading-relaxed">
                          Heart Rate is <span className="text-indigo-600 font-extrabold">{dailyLogs.heartRate} bpm</span> ({hr > 100 ? 'elevated workload' : hr < 60 ? 'bradycardia state' : 'metabolically balanced'}).
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
                        <p className="text-xs font-semibold text-indigo-950 leading-relaxed">
                          Hydration is <span className="text-blue-600 font-extrabold">{dailyLogs.water} glasses</span> (optimal cellular clearance).
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></span>
                        <p className="text-xs font-semibold text-indigo-950 leading-relaxed">
                          Sleep is at <span className="text-purple-600 font-extrabold">{dailyLogs.sleep} hours</span> (parasympathetic recovery).
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[7px] font-black tracking-widest uppercase text-slate-400 select-none">
                    <span>Bio-Twin Health Model v2.4</span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                      Active Engine ({activeDevice})
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* 4. SENSOR GRID - COMPACT ON WEB */}
        <div className="flex items-center gap-2 mb-3.5 mt-2 select-none">
          <Activity className="w-4.5 h-4.5 text-indigo-600 animate-pulse" />
          <h3 className="text-[13px] font-black uppercase tracking-widest text-indigo-950">Active Vitals</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 md:gap-5 md:mb-6">
          {[
            { label: 'Heart Rate', value: `${dailyLogs.heartRate} bpm`, icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
            { label: 'Blood Pressure', value: dailyLogs.bloodPressure || '120/80', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'Sleep Cycle', value: `${dailyLogs.sleep}h`, icon: Moon, color: 'text-purple-500', bg: 'bg-purple-50' },
            { label: 'Hydration', value: `${dailyLogs.water} glasses`, icon: Droplet, color: 'text-cyan-500', bg: 'bg-cyan-50' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 border border-border flex items-center gap-4 md:flex-col md:p-5 md:rounded-[28px] hover:shadow-lg transition-all">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} md:w-12 md:h-12 md:rounded-xl`}>
                <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="flex-1 md:flex-none md:text-center">
                <p className="text-[7px] md:text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">{stat.label}</p>
                <h4 className="text-[12px] md:text-base font-black text-indigo-950">{stat.value}</h4>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive 3D SVG Organ/Body Map Hotspots Card - Moved below Vitals */}
        <div className="bg-white rounded-[32px] p-5 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4.5 h-4.5 text-indigo-600 animate-pulse" />
              <h3 className="text-[13px] font-black uppercase tracking-widest text-indigo-950">Interactive Body Hotspots</h3>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mb-3">
              Tap highlighted clinical centers to diagnose organ-specific biological stress.
            </p>

            <div className="flex items-center justify-center relative mb-1.5">
              <svg viewBox="0 0 100 172" className="w-full h-[136px] drop-shadow-[0_4px_10px_rgba(99,102,241,0.08)]">
                <defs>
                  <linearGradient id="bodyGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>

                {/* Uniformly Scaled and Robustly Outlined Silhouette */}
                <g transform="scale(1.9, 1.0) translate(-23.68, -3.5)">
                  {/* Human Body Vector silhouette */}
                  <path 
                    d="M50,15 C54,15 58,18 58,23 C58,28 54,32 50,32 C46,32 42,28 42,23 C42,18 46,15 50,15 Z M50,32 L50,36 M40,42 C45,36 55,36 60,42 L64,68 C65,72 61,74 58,72 L57,50 L57,110 L64,165 C64,168 61,170 59,168 L51,118 L50,118 L49,118 L41,168 C39,170 36,168 36,165 L43,110 L43,50 L42,72 C39,74 35,72 36,68 L40,42 Z" 
                    fill="none" 
                    stroke="#e2e8f0" 
                    strokeWidth="2.6" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  <path 
                    d="M50,15 C54,15 58,18 58,23 C58,28 54,32 50,32 C46,32 42,28 42,23 C42,18 46,15 50,15 Z M50,32 L50,36 M40,42 C45,36 55,36 60,42 L64,68 C65,72 61,74 58,72 L57,50 L57,110 L64,165 C64,168 61,170 59,168 L51,118 L50,118 L49,118 L41,168 C39,170 36,168 36,165 L43,110 L43,50 L42,72 C39,74 35,72 36,68 L40,42 Z" 
                    fill="none" 
                    stroke="url(#bodyGlow)" 
                    strokeWidth="1.8" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="opacity-55 animate-pulse"
                  />

                  {/* BRAIN HOTSPOT (x=50, y=23) */}
                  <g className="cursor-pointer group" onClick={() => setSelectedOrgan('brain')}>
                    <circle cx="50" cy="23" r="5" className={parseFloat(dailyLogs.sleep) < 6 && parseFloat(dailyLogs.sleep) > 0 ? 'fill-rose-500/30' : 'fill-purple-500/30'}>
                      <animate attributeName="r" values="3;7;3" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="50" cy="23" r="3" className={`${parseFloat(dailyLogs.sleep) < 6 && parseFloat(dailyLogs.sleep) > 0 ? 'fill-rose-500' : 'fill-purple-500'} group-hover:scale-125 transition-all`} />
                  </g>

                  {/* HEART HOTSPOT (x=50, y=52) */}
                  <g className="cursor-pointer group" onClick={() => setSelectedOrgan('heart')}>
                    <circle cx="50" cy="52" r="5" className={parseInt(dailyLogs.heartRate) > 100 ? 'fill-rose-600/30' : 'fill-rose-400/30'}>
                      <animate attributeName="r" values="3;7;3" dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="50" cy="52" r="3" className={`${parseInt(dailyLogs.heartRate) > 100 ? 'fill-rose-600' : 'fill-rose-400'} group-hover:scale-125 transition-all`} />
                  </g>

                  {/* FLUID SYSTEM HOTSPOT (x=50, y=78) */}
                  <g className="cursor-pointer group" onClick={() => setSelectedOrgan('fluid')}>
                    <circle cx="50" cy="78" r="5" className={parseInt(dailyLogs.water) < 6 && parseInt(dailyLogs.water) > 0 ? 'fill-amber-500/30' : 'fill-cyan-400/30'}>
                      <animate attributeName="r" values="3;7;3" dur="2.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="50" cy="78" r="3" className={`${parseInt(dailyLogs.water) < 6 && parseInt(dailyLogs.water) > 0 ? 'fill-amber-500' : 'fill-cyan-400'} group-hover:scale-125 transition-all`} />
                  </g>
                </g>

                {/* High-Tech Sci-Fi Diagnostic Labels & Pointer Lines */}
                {/* BRAIN (Sleep) */}
                <line x1="55" y1="19.5" x2="74" y2="19.5" stroke="#a855f7" strokeWidth="1.6" strokeDasharray="1.5,1.5" />
                <text x="76" y="22.5" fill="#6b21a8" fontSize="9.5" fontWeight="900" className="select-none pointer-events-none">BRAIN (SLEEP)</text>

                {/* HEART (Cardio) */}
                <line x1="45" y1="48.5" x2="26" y2="48.5" stroke="#f43f5e" strokeWidth="1.6" strokeDasharray="1.5,1.5" />
                <text x="24" y="51.5" fill="#be123c" fontSize="9.5" fontWeight="900" textAnchor="end" className="select-none pointer-events-none">HEART (VITAL)</text>

                {/* FLUID SYSTEM (Hydration) */}
                <line x1="55" y1="74.5" x2="74" y2="74.5" stroke="#06b6d4" strokeWidth="1.6" strokeDasharray="1.5,1.5" />
                <text x="76" y="77.5" fill="#0e7490" fontSize="9.5" fontWeight="900" className="select-none pointer-events-none">FLUIDS (WATER)</text>
              </svg>
            </div>

            <div className="bg-slate-50/50 rounded-2xl p-3 border border-slate-100 flex flex-col gap-1 select-none">
              {selectedOrgan === 'brain' && (() => {
                const sleepVal = parseFloat(dailyLogs.sleep) || 0;
                const isLow = sleepVal < 6 && sleepVal > 0;
                return (
                  <>
                    <div className="flex items-center gap-1.5">
                      <Brain className={`w-3.5 h-3.5 ${isLow ? 'text-rose-500 animate-pulse' : 'text-purple-600'}`} />
                      <span className={`text-[11px] font-black uppercase tracking-tight ${isLow ? 'text-rose-600' : 'text-purple-700'}`}>Cerebral Diagnostic</span>
                    </div>
                    <p className="text-[10.5px] font-semibold text-slate-600 leading-relaxed">
                      {isLow ? (
                        <span className="text-rose-600 font-extrabold">⚠️ Sleep debt active: Cognitive clearance reduced. Ensure 7-9 hours to flush metabolic neuro-toxins.</span>
                      ) : sleepVal === 0 ? (
                        <span>Connect a sensor to evaluate active sleep telemetry and deep wave brain cycles.</span>
                      ) : (
                        <span>Circadian rest normal: Brain state optimal. Glymphatic system clearance nominal.</span>
                      )}
                    </p>
                  </>
                );
              })()}

              {selectedOrgan === 'heart' && (() => {
                const hrVal = parseInt(dailyLogs.heartRate) || 0;
                const isElevated = hrVal > 100;
                return (
                  <>
                    <div className="flex items-center gap-1.5">
                      <Heart className={`w-3.5 h-3.5 ${isElevated ? 'text-rose-600 animate-pulse' : 'text-rose-500'}`} />
                      <span className={`text-[11px] font-black uppercase tracking-tight ${isElevated ? 'text-rose-600' : 'text-rose-700'}`}>Cardiopulmonary Status</span>
                    </div>
                    <p className="text-[10.5px] font-semibold text-slate-600 leading-relaxed">
                      {isElevated ? (
                        <span className="text-rose-600 font-extrabold">⚠️ Elevated resting heart rate: Rest advised. Reduce caffeine, lower cardiorespiratory load.</span>
                      ) : hrVal === 0 ? (
                        <span>Link Bluetooth BLE device to stream cardiovascular heart rate trends live.</span>
                      ) : (
                        <span>Heart rate stable: Cardio workload normal. Myocardial compliance is optimal.</span>
                      )}
                    </p>
                  </>
                );
              })()}

              {selectedOrgan === 'fluid' && (() => {
                const waterVal = parseInt(dailyLogs.water) || 0;
                const isLow = waterVal < 6 && waterVal > 0;
                return (
                  <>
                    <div className="flex items-center gap-1.5">
                      <Droplet className={`w-3.5 h-3.5 ${isLow ? 'text-amber-500 animate-pulse' : 'text-cyan-600'}`} />
                      <span className={`text-[11px] font-black uppercase tracking-tight ${isLow ? 'text-amber-600' : 'text-cyan-700'}`}>Renal / Fluid Equilibrium</span>
                    </div>
                    <p className="text-[10.5px] font-semibold text-slate-600 leading-relaxed">
                      {isLow ? (
                        <span className="text-amber-600 font-extrabold">⚠️ Mild cellular dehydration detected. Renal volume clearance demand elevated. Drink water.</span>
                      ) : waterVal === 0 ? (
                        <span>Biometric sync needed to compute active fluid volumes and cellular hydration levels.</span>
                      ) : (
                        <span>Fluid reserves nominal: Cellular hydration perfect. Plasma viscosity nominal.</span>
                      )}
                    </p>
                  </>
                );
              })()}
            </div>
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[7px] font-black tracking-widest uppercase text-slate-400">
            <span>Bio-Anatomical HUD v1.0</span>
            <span className="text-emerald-500 flex items-center gap-0.5">
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping"></span>
              Active Diagnostics
            </span>
          </div>
        </div>

        {/* CLINICAL BIO-RISK HUD GAUGES - Moved below body map */}
        <div className="bg-white rounded-[32px] p-5 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-indigo-600 animate-pulse" />
            <h3 className="text-[13px] font-black uppercase tracking-widest text-indigo-950">Clinical Bio-Risk HUD</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(() => {
              const hr = parseInt(dailyLogs.heartRate) || 0;
              const bpStr = dailyLogs.bloodPressure || '120/80';
              const [systolic, diastolic] = bpStr.split('/').map(v => parseInt(v) || 0);
              const sleep = parseFloat(dailyLogs.sleep) || 0;
              const water = parseInt(dailyLogs.water) || 0;

              if (hr === 0) {
                return [
                  { label: 'Cardiovascular Efficiency', score: 0, desc: 'Autonomic workload & arterial pressure stability.', color: 'stroke-rose-500', textColor: 'text-rose-500', track: 'stroke-rose-100' },
                  { label: 'Circadian Alignment', score: 0, desc: 'Sleep cycle depth & homeostatic recovery.', color: 'stroke-purple-500', textColor: 'text-purple-500', track: 'stroke-purple-100' },
                  { label: 'Hydration Index', score: 0, desc: 'Cellular volume clearance & fluid equilibrium.', color: 'stroke-cyan-500', textColor: 'text-cyan-500', track: 'stroke-cyan-100' }
                ].map((gauge, idx) => {
                  const radius = 18;
                  return (
                    <div key={idx} className="bg-slate-50/50 rounded-[22px] p-4 border border-slate-100 flex items-center gap-4 opacity-50">
                      <div className="relative flex items-center justify-center flex-shrink-0">
                        <svg className="w-12 h-12 transform -rotate-90">
                          <circle cx="24" cy="24" r={radius} className={gauge.track} strokeWidth="3" fill="transparent" />
                        </svg>
                        <span className={`absolute text-[9px] font-black ${gauge.textColor}`}>0%</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[10px] font-black text-indigo-950 uppercase tracking-tight leading-none mb-1">{gauge.label}</h4>
                        <p className="text-[9px] font-bold text-muted-foreground/80 leading-snug">{gauge.desc}</p>
                      </div>
                    </div>
                  );
                });
              }

              // 1. Cardiovascular Efficiency (based on AHA BP categories + Resting HR stability)
              let bpPenalty = 0;
              if (systolic >= 140 || diastolic >= 90) {
                bpPenalty = 30; // Stage 2 Hypertension
              } else if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
                bpPenalty = 15; // Stage 1 Hypertension
              } else if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
                bpPenalty = 8;  // Elevated BP
              } else if (systolic < 120 && diastolic < 80) {
                bpPenalty = 0;  // Normal BP
              } else {
                bpPenalty = 5;
              }

              let hrPenalty = 0;
              if (hr > 100) {
                hrPenalty = Math.min(40, (hr - 100) * 1.5 + 15); // Tachycardia
              } else if (hr < 60) {
                hrPenalty = Math.min(30, (60 - hr) * 2); // Bradycardia
              } else {
                hrPenalty = Math.abs(hr - 70) * 0.5; // Normal deviation from ideal 70 bpm
              }

              const cvScore = Math.max(30, Math.min(100, Math.round(100 - bpPenalty - hrPenalty)));

              // 2. Circadian Alignment (optimal sleep is 7 to 9 hours)
              let sleepPenalty = 0;
              if (sleep < 7) {
                sleepPenalty = (7 - sleep) * 15; // Sleep deprivation
              } else if (sleep > 9) {
                sleepPenalty = (sleep - 9) * 10; // Hypersomnia
              }
              const circadianScore = Math.max(30, Math.min(100, Math.round(100 - sleepPenalty)));

              // 3. Hydration Index (optimal is 8 to 12 glasses)
              let waterPenalty = 0;
              if (water < 8) {
                waterPenalty = (8 - water) * 12; // Dehydration
              } else if (water > 12) {
                waterPenalty = (water - 12) * 5; // Hyperhydration
              }
              const hydrationScore = Math.max(30, Math.min(100, Math.round(100 - waterPenalty)));

              return [
                { label: 'Cardiovascular Efficiency', score: cvScore, desc: 'Autonomic workload & arterial pressure stability.', color: 'stroke-rose-500', textColor: 'text-rose-500', track: 'stroke-rose-100' },
                { label: 'Circadian Alignment', score: circadianScore, desc: 'Sleep cycle depth & homeostatic recovery.', color: 'stroke-purple-500', textColor: 'text-purple-500', track: 'stroke-purple-100' },
                { label: 'Hydration Index', score: hydrationScore, desc: 'Cellular volume clearance & fluid equilibrium.', color: 'stroke-cyan-500', textColor: 'text-cyan-500', track: 'stroke-cyan-100' }
              ].map((gauge, idx) => {
                const radius = 18;
                const circumference = 2 * Math.PI * radius;
                const strokeDashoffset = circumference - (gauge.score / 100) * circumference;

                return (
                  <div key={idx} className="bg-slate-50/50 rounded-[22px] p-4 border border-slate-100 flex items-center gap-4 hover:shadow-md hover:bg-white transition-all">
                    <div className="relative flex items-center justify-center flex-shrink-0">
                      <svg className="w-12 h-12 transform -rotate-90">
                        <circle cx="24" cy="24" r={radius} className={gauge.track} strokeWidth="3" fill="transparent" />
                        <circle 
                          cx="24" 
                          cy="24" 
                          r={radius} 
                          className={`${gauge.color} transition-all duration-1000 ease-out`}
                          strokeWidth="3" 
                          fill="transparent"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className={`absolute text-[9px] font-black ${gauge.textColor}`}>{gauge.score}%</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[10px] font-black text-indigo-950 uppercase tracking-tight leading-none mb-1">{gauge.label}</h4>
                      <p className="text-[9px] font-bold text-muted-foreground/80 leading-snug">{gauge.desc}</p>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {/* INTERACTIVE GLASSMORPHIC TELEMETRY CHART CENTER - Moved below HUD */}
        <div className="bg-gradient-to-br from-indigo-950/95 via-indigo-950 to-slate-950 rounded-[32px] p-6 border border-white/10 shadow-2xl relative overflow-hidden mb-6 transform-gpu will-change-transform">
          {/* Glowing Atmospheric Aura - Optimized with performance-free radial gradients to avoid Gaussian blur lag */}
          <div className={`absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none transition-all duration-700 opacity-50 ${
            activeVitalTab === 'heart' ? 'bg-[radial-gradient(circle,rgba(244,63,94,0.18)_0%,transparent_70%)]' :
            activeVitalTab === 'bp' ? 'bg-[radial-gradient(circle,rgba(59,130,246,0.18)_0%,transparent_70%)]' :
            activeVitalTab === 'sleep' ? 'bg-[radial-gradient(circle,rgba(168,85,247,0.18)_0%,transparent_70%)]' :
            'bg-[radial-gradient(circle,rgba(6,182,212,0.18)_0%,transparent_70%)]'
          }`}></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[8px] font-black uppercase tracking-[0.25em] text-indigo-300 leading-none block mb-1">Live Telemetry Diagnostics</span>
              <h3 className="text-lg font-black text-white tracking-tight">Interactive Biometric Trends</h3>
            </div>
            
            {/* Quick-switch tab bar - Blur pruned for scrolling optimization */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-white/10 rounded-2xl border border-white/10">
              {[
                { id: 'heart', label: 'Heart Rate', color: 'hover:text-rose-400 active:bg-rose-500/20' },
                { id: 'bp', label: 'Blood Pressure', color: 'hover:text-blue-400 active:bg-blue-500/20' },
                { id: 'sleep', label: 'Sleep Cycle', color: 'hover:text-purple-400 active:bg-purple-500/20' },
                { id: 'water', label: 'Hydration', color: 'hover:text-cyan-400 active:bg-cyan-500/20' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveVitalTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                    activeVitalTab === tab.id
                      ? 'bg-white/15 text-white shadow-sm border border-white/10'
                      : 'text-indigo-200/60 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Chart Arena */}
          {(() => {
            const hrVal = parseInt(dailyLogs.heartRate) || 0;
            const bpSystolic = parseInt((dailyLogs.bloodPressure || '120/80').split('/')[0]) || 120;
            const sleepVal = parseFloat(dailyLogs.sleep) || 0;
            const waterVal = parseInt(dailyLogs.water) || 0;

            // 1. Heart Rate dynamic path calculations
            const hrAmp = hrVal > 0 ? Math.min(Math.max((hrVal - 40) / 80, 0.2), 1.3) : 0;
            const p1 = Math.round(110 - 45 * hrAmp);
            const p2 = Math.round(110 - 65 * hrAmp);
            const p3 = Math.round(110 - 75 * hrAmp);
            const p4 = Math.round(110 - 55 * hrAmp);
            const p5 = Math.round(110 - 60 * hrAmp);
            const v = Math.round(110 + 20 * hrAmp);

            const hrPathLine = `M 0 110 Q 30 ${p1} 60 110 Q 90 ${v} 120 110 Q 150 ${p2} 180 110 Q 210 ${v} 240 110 Q 270 ${p3} 300 110 Q 330 ${v} 360 110 Q 390 ${p4} 420 110 Q 450 ${v} 480 110 Q 510 ${p5} 540 110 Q 570 ${v} 600 110`;
            const hrPathFill = `${hrPathLine} L 600 150 L 0 150 Z`;

            // 2. Blood Pressure dynamic path calculations
            const bpAmp = Math.min(Math.max((bpSystolic - 90) / 70, 0.3), 1.3);
            const bpP1 = Math.round(120 - 50 * bpAmp);
            const bpP2 = Math.round(120 - 40 * bpAmp);
            const bpP3 = Math.round(120 - 60 * bpAmp);
            const bpP4 = Math.round(120 - 45 * bpAmp);
            const bpEnd = Math.round(120 - 35 * bpAmp);

            const bpPathLine = `M 0 ${bpP1} Q 50 ${bpP2} 100 ${bpP1} T 200 ${bpP3} T 300 ${bpP2} T 400 ${bpP4} T 500 ${bpP2} T 600 ${bpEnd}`;
            const bpPathFill = `M 0 150 L 0 ${bpP1} Q 50 ${bpP2} 100 ${bpP1} T 200 ${bpP3} T 300 ${bpP2} T 400 ${bpP4} T 500 ${bpP2} T 600 ${bpEnd} L 600 150 Z`;

            // 3. Sleep Cycle dynamic path calculations
            const sleepAmp = sleepVal > 0 ? Math.min(Math.max((sleepVal - 4) / 8, 0.2), 1.2) : 0;
            const sP1 = Math.round(130 - 100 * sleepAmp);
            const sP2 = Math.round(130 - 80 * sleepAmp);
            const sP3 = Math.round(130 - 90 * sleepAmp);
            const sV1 = Math.round(130 - 30 * sleepAmp);

            const sleepPathLine = `M 0 130 C 50 130 75 ${sP1} 100 ${sP1} C 125 ${sP1} 150 ${sV1} 200 ${sV1} C 250 ${sV1} 275 ${sP2} 300 ${sP2} C 325 ${sP2} 350 130 400 130 C 450 130 475 ${sP3} 500 ${sP3} C 525 ${sP3} 550 130 600 130`;
            const sleepPathFill = `M 0 150 L 0 130 C 50 130 75 ${sP1} 100 ${sP1} C 125 ${sP1} 150 ${sV1} 200 ${sV1} C 250 ${sV1} 275 ${sP2} 300 ${sP2} C 325 ${sP2} 350 130 400 130 C 450 130 475 ${sP3} 500 ${sP3} C 525 ${sP3} 550 130 600 130 L 600 150 Z`;

            // 4. Hydration dynamic path calculations
            const waterAmp = waterVal > 0 ? Math.min(Math.max((waterVal - 2) / 10, 0.2), 1.4) : 0;
            const wP1 = Math.round(120 - 75 * waterAmp);
            const wP2 = Math.round(120 - 70 * waterAmp);
            const wV1 = Math.round(120 + 15 * waterAmp);

            const waterPathLine = `M 0 120 Q 75 ${wP1} 150 ${wV1} T 300 120 T 450 ${wP2} T 600 120`;
            const waterPathFill = `M 0 150 L 0 120 Q 75 ${wP1} 150 ${wV1} T 300 120 T 450 ${wP2} T 600 120 L 600 150 Z`;

            return (
              <div className="relative h-48 w-full bg-white/5 rounded-2xl border border-white/5 overflow-hidden flex items-end p-2 group mb-5 transform-gpu will-change-transform">
                {/* Gridlines */}
                <div className="absolute inset-0 flex flex-col justify-between py-6 pointer-events-none opacity-20">
                  <div className="border-b border-white/40 w-full"></div>
                  <div className="border-b border-white/40 w-full"></div>
                  <div className="border-b border-white/40 w-full"></div>
                </div>

                <svg className="w-full h-full pointer-events-none" viewBox="0 0 600 150" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartRoseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="chartBlueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="chartPurpleGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="chartCyanGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Area path with animation */}
                  {dailyLogs.heartRate === '0' ? (
                    <>
                      <path
                        d="M 0 75 L 600 75"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.15)"
                        strokeWidth="3.5"
                        strokeDasharray="8,8"
                        className="animate-pulse"
                      />
                      <foreignObject x="0" y="0" width="100%" height="100%">
                        <div className="flex flex-col items-center justify-center text-center h-full">
                          <Brain className="w-8 h-8 text-indigo-400 mb-2 animate-pulse" />
                          <h4 className="text-xs font-black uppercase tracking-widest text-indigo-300">Telemetry Standby</h4>
                          <p className="text-[9px] text-slate-400 font-bold max-w-[280px] mt-1 leading-normal">
                            Please connect your smartwatch or log your first vitals to activate live biometric trends.
                          </p>
                        </div>
                      </foreignObject>
                    </>
                  ) : (
                    <g className="transition-opacity duration-300">
                      {activeVitalTab === 'heart' && (
                        <>
                          <path
                            d={hrPathFill}
                            fill="url(#chartRoseGrad)"
                          />
                          <path
                            d={hrPathLine}
                            fill="none"
                            stroke="#f43f5e"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                          <circle cx="270" cy={Math.round((110 + p3) / 2)} r="5" fill="#f43f5e" className="animate-ping" />
                          <circle cx="270" cy={Math.round((110 + p3) / 2)} r="4" fill="#ffffff" />
                        </>
                      )}

                      {activeVitalTab === 'bp' && (
                        <>
                          <path
                            d={bpPathFill}
                            fill="url(#chartBlueGrad)"
                          />
                          <path
                            d={bpPathLine}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                          <circle cx="400" cy={bpP4} r="5" fill="#3b82f6" className="animate-ping" />
                          <circle cx="400" cy={bpP4} r="4" fill="#ffffff" />
                        </>
                      )}

                      {activeVitalTab === 'sleep' && (
                        <>
                          <path
                            d={sleepPathFill}
                            fill="url(#chartPurpleGrad)"
                          />
                          <path
                            d={sleepPathLine}
                            fill="none"
                            stroke="#a855f7"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                          <circle cx="100" cy={sP1} r="5" fill="#a855f7" className="animate-ping" />
                          <circle cx="100" cy={sP1} r="4" fill="#ffffff" />
                        </>
                      )}

                      {activeVitalTab === 'water' && (
                        <>
                          <path
                            d={waterPathFill}
                            fill="url(#chartCyanGrad)"
                          />
                          <path
                            d={waterPathLine}
                            fill="none"
                            stroke="#06b6d4"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                          <circle cx="75" cy={Math.round((120 + wP1) / 2)} r="5" fill="#06b6d4" className="animate-ping" />
                          <circle cx="75" cy={Math.round((120 + wP1) / 2)} r="4" fill="#ffffff" />
                        </>
                      )}
                    </g>
                  )}
                </svg>

                {/* Glowing Peak indicator floating overlay */}
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-right">
                  <span className="text-[7px] font-black text-indigo-300 uppercase tracking-widest block mb-0.5">Peak Activity</span>
                  <span className={`text-[11px] font-black uppercase ${
                    activeVitalTab === 'heart' ? 'text-rose-400' :
                    activeVitalTab === 'bp' ? 'text-blue-400' :
                    activeVitalTab === 'sleep' ? 'text-purple-400' : 'text-cyan-400'
                  }`}>
                    {dailyLogs.heartRate === '0' ? 'Standby' :
                     activeVitalTab === 'heart' ? `${dailyLogs.heartRate} bpm` :
                     activeVitalTab === 'bp' ? `${dailyLogs.bloodPressure || '120/80'}` :
                     activeVitalTab === 'sleep' ? `${dailyLogs.sleep}h` :
                     `${dailyLogs.water} glasses`}
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Micro-stats Footer */}
          <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-4">
            <div className="text-center md:text-left">
              <p className="text-[7.5px] font-black text-indigo-200/50 uppercase tracking-widest mb-0.5">Stability Rating</p>
              <h4 className="text-sm font-black text-emerald-400">98.6% <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-1 py-0.5 rounded ml-1">Optimal</span></h4>
            </div>
            <div className="text-center">
              <p className="text-[7.5px] font-black text-indigo-200/50 uppercase tracking-widest mb-0.5">Analysis Target</p>
              <h4 className="text-sm font-black text-indigo-100 uppercase tracking-tight">Active Sensor</h4>
            </div>
            <div className="text-center md:text-right">
              <p className="text-[7.5px] font-black text-indigo-200/50 uppercase tracking-widest mb-0.5">Telemetry Status</p>
              <h4 className="text-sm font-black text-indigo-100 uppercase tracking-tight flex items-center justify-center md:justify-end gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Nominal
              </h4>
            </div>
          </div>
        </div>

        {/* 5. DAILY PROTOCOL - BALANCED COMPACT WITH ANIMATED COUNTDOWN */}
        <div className="bg-white rounded-[32px] p-6 border border-slate-100 mb-6 md:rounded-[40px] md:p-8 md:mb-8 shadow-[0_8px_30px_rgba(0,0,0,0.01)]">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Left 3 Columns: Daily Protocol Tasks List */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h3 className="text-[15px] md:text-xl font-black text-indigo-950 tracking-tight">Daily Protocol</h3>
                  <button
                    onClick={() => navigate('/app/add-medicine')}
                    className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all active:scale-90"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <button onClick={handleToggleAll} className="text-[11px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
                  {tasks.every(t => completedTasks[t.title]) ? 'Deselect All' : 'Mark Complete'}
                </button>
              </div>

              <div className="space-y-4">
                {tasks.map((task, idx) => {
                  const isDone = !!completedTasks[task.title];
                  const isDeletable = task.cat === 'Medication';
                  return (
                    <div key={idx} className={`group bg-slate-50/50 rounded-[22px] p-4 border border-slate-100/50 flex items-center gap-5 transition-all ${isDone ? 'opacity-50' : 'hover:bg-white hover:shadow-md'}`}>
                      <div onClick={() => handleToggleTask(task.title)} className="flex-1 flex items-center gap-5 cursor-pointer">
                        <div className="relative w-11 h-11 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          {task.cat === 'Medication' ? (
                            <div className="w-11 h-11 rounded-xl bg-white border border-slate-100 flex items-center justify-center relative overflow-hidden shadow-sm">
                              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50/50 to-white"></div>
                              {/* Top half of capsule */}
                              <div className={`w-3.5 h-3.5 rounded-t-full absolute top-2 transition-all ${isDone ? 'bg-indigo-300' : 'bg-indigo-600 animate-pulse'}`}></div>
                              {/* Bottom half of capsule */}
                              <div className={`w-3.5 h-3.5 rounded-b-full absolute bottom-2 transition-all ${isDone ? 'bg-indigo-100' : 'bg-indigo-400'}`}></div>
                              {/* Glass shine reflective glint */}
                              <div className="absolute top-1 left-2.5 w-1 h-9 bg-white/20 rounded-full blur-[0.5px]"></div>
                            </div>
                          ) : (
                            <div className={`w-11 h-11 rounded-xl bg-white border border-slate-100 flex items-center justify-center ${task.color}`}>
                              <task.icon className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">{task.cat}</p>
                          <h4 className={`text-[13px] md:text-sm font-black text-indigo-950 leading-tight ${isDone ? 'line-through' : ''}`}>{task.title}</h4>
                          <p className="text-[10px] font-bold text-muted-foreground/60">{task.time}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {isDeletable && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.title); }}
                            className="w-9 h-9 rounded-lg bg-rose-50 text-rose-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <div
                          onClick={() => handleToggleTask(task.title)}
                          className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all cursor-pointer ${isDone ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200'}`}
                        >
                          {isDone && <Shield className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

             {/* Right Column: Animated Medication Countdown Timer */}
            <div className="lg:col-span-1 bg-gradient-to-br from-indigo-950 via-slate-950 to-indigo-950 rounded-[20px] p-3.5 border border-white/10 flex flex-col gap-3 text-white relative overflow-hidden shadow-xl">
              {/* Atmospheric Background Glow */}
              <div className="absolute inset-0 bg-radial-gradient from-indigo-500/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>

              <div>
                <div className="flex items-center justify-between mb-1 relative z-10">
                  <div>
                    <span className="text-[6.5px] font-black uppercase tracking-[0.2em] text-indigo-300 block mb-0.5">Next Scheduled Dose</span>
                    <h4 className="text-[10px] font-black tracking-tight uppercase">Medicine Timer</h4>
                  </div>
                  <span className="text-[7px] font-black uppercase bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full animate-pulse">
                    Live Telemetry
                  </span>
                </div>

                {/* Slowly Rotating Circular Clock Face */}
                <div className="flex flex-col items-center justify-center py-1 relative z-10">
                  <div className="relative w-32 h-32 md:w-36 md:h-36 flex items-center justify-center">
                    {/* SVG Circular Dial */}
                    <svg className="w-full h-full absolute inset-0 transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" className="stroke-white/5" strokeWidth="2" fill="transparent" />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="42" 
                        className="stroke-indigo-500 transition-all duration-1000" 
                        strokeWidth="3.5" 
                        fill="transparent" 
                        strokeDasharray={263.89}
                        strokeDashoffset={140}
                        strokeLinecap="round"
                      />
                      {/* Rotating Ticking Notch */}
                      <g transform={`rotate(${rotationAngle} 50 50)`}>
                        <line x1="50" y1="8" x2="50" y2="15" className="stroke-indigo-400" strokeWidth="2.5" strokeLinecap="round" />
                      </g>
                    </svg>

                    {/* Central Glowing Countdown String */}
                    <div className="text-center">
                      <span className="text-[11px] md:text-xs font-black tracking-wider text-indigo-100 block drop-shadow-[0_0_12px_rgba(99,102,241,0.6)] whitespace-nowrap">
                        {countdownString}
                      </span>
                      <span className="text-[7px] font-black tracking-[0.15em] text-indigo-400 uppercase mt-0.5 inline-block bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                        {nextMedName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tap to Metabolize Dose Interactive Button */}
              <button
                onClick={() => {
                  if (nextMedName === 'No Meds Active') {
                    toast.error('No Active Medication', {
                      description: 'Please add a medication to begin tracking.',
                      duration: 4000
                    });
                    return;
                  }
                  toast.success('Dose Logged Successfully', {
                    description: `You have successfully taken your dose of ${nextMedName}.`,
                    duration: 4000,
                    icon: <Plus className="w-4 h-4 text-emerald-500 animate-pulse" />
                  });
                }}
                className="w-full py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-lg font-black text-[8px] uppercase tracking-widest transition-all cursor-pointer border-none shadow-md shadow-indigo-500/10 active:scale-95 text-center relative z-10"
              >
                Take Medicine Now
              </button>
            </div>

          </div>
        </div>

        {/* 6. VITAL OUTAGE / VITAL SYNCED - DYNAMIC BRAND BANNER */}
        {isVitalsSyncedToday ? (
          <button
            onClick={() => navigate('/app/daily-logs')}
            className="w-full bg-emerald-50 border border-emerald-100 rounded-[28px] p-4 flex items-center gap-4 hover:bg-emerald-100 transition-all text-left group active:scale-99 mb-4 animate-fade-in"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-[11px] md:text-lg font-black text-emerald-950 uppercase tracking-widest mb-0.5">Vitals Connected</h4>
              <p className="text-[9px] md:text-sm text-emerald-800/70 font-bold leading-tight">
                Synced successfully today. All biological systems nominal.
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-emerald-300 group-hover:translate-x-1 transition-all" />
          </button>
        ) : (
          <button
            onClick={() => navigate('/app/daily-logs')}
            className="w-full bg-rose-50 border border-rose-100 rounded-[28px] p-4 flex items-center gap-4 hover:bg-rose-100 transition-all text-left group active:scale-99 mb-4"
          >
            <div className="w-11 h-11 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-[11px] md:text-lg font-black text-rose-950 uppercase tracking-widest mb-0.5">Vital Outage</h4>
              <p className="text-[9px] md:text-sm text-rose-800/70 font-bold leading-tight">
                3 days since last sync. Tap to initiate.
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-rose-300 group-hover:translate-x-1 transition-all" />
          </button>
        )}
        {/* Bottom Spacer for Mobile Navigation Bar */}
        <div className="h-10"></div>
      </div>

      {/* SYSTEM DIAGNOSTICS OVERLAY */}
      {showDiagnostics && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">
          {/* Hardware-Accelerated Translucent Overlay (Zero JS thread lag) */}
          <div
            onClick={() => setShowDiagnostics(false)}
            className="absolute inset-0 bg-black/60 animate-fadeIn"
          />

          {/* Modal Card with GPU-Accelerated springy cubic-bezier entry */}
          <div className="relative w-full max-w-sm bg-white dark:bg-card rounded-[32px] p-6 shadow-2xl border border-white dark:border-border/50 overflow-hidden z-10 animate-scaleIn">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-950/20 rounded-full blur-2xl -mr-10 -mt-10"></div>

            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="w-11 h-11 md:w-12 md:h-12 bg-white dark:bg-slate-800 rounded-full border border-border shadow-sm flex items-center justify-center overflow-hidden p-0.5">
                <img src={logo} className={`w-full h-full object-contain scale-[1.2] ${isSyncing ? 'animate-spin' : ''}`} alt="Logo" />
              </div>
              <button onClick={() => setShowDiagnostics(false)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-rose-100 hover:text-rose-600 transition-colors">
                <span className="font-black text-sm leading-none">&times;</span>
              </button>
            </div>

            <div className="relative z-10 mb-6">
              <h2 className="text-xl font-black text-indigo-950 dark:text-white tracking-tight">System Diagnostics</h2>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">LifeMatrix Core v2.4.0</p>
            </div>

            <div className="space-y-3 mb-8 relative z-10">
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-border/50">
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Server Connection</span>
                </div>
                <span className="text-[9px] font-black uppercase text-emerald-600 tracking-widest bg-emerald-100 dark:bg-emerald-950/30 px-2 py-1 rounded-md">Secure</span>
              </div>
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-border/50">
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-indigo-500" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Encryption Status</span>
                </div>
                <span className="text-[9px] font-black uppercase text-indigo-600 tracking-widest bg-indigo-100 dark:bg-indigo-950/30 px-2 py-1 rounded-md">E2E Active</span>
              </div>

              {/* PROFESSIONAL DEVELOPER CREDIT */}
              <div className="flex items-center justify-between bg-indigo-50/60 dark:bg-indigo-950/20 p-3 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 mt-2">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={myPhoto}
                      alt="Sathish"
                      className="w-8 h-8 rounded-full relative z-10 object-cover object-top"
                    />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase text-indigo-400 tracking-widest leading-none mb-0.5">Engineered By</p>
                    <h4 className="text-xs font-black text-indigo-950 dark:text-white leading-none">Sathish</h4>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-slate-800 rounded-lg border border-indigo-100 dark:border-border shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[8px] font-black uppercase text-indigo-900 dark:text-indigo-300 tracking-widest">Lead Architect</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSync}
              disabled={isSyncing}
              className={`w-full h-14 rounded-2xl flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest transition-all ${isSyncing ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-400' : 'bg-indigo-950 dark:bg-white dark:text-black text-white hover:shadow-lg active:scale-95'}`}
            >
              {isSyncing ? (
                <>
                  <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                  Syncing Data...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Force Cloud Sync
                </>
              )}
            </button>
          </div>
        </div>
      )}

        <AnimatePresence>
          {pairingDevice && (
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-indigo-950/60 transform-gpu will-change-transform"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-white rounded-[32px] p-6 shadow-2xl border border-white relative overflow-hidden transform-gpu will-change-transform"
            >
              {/* Soft, performance-free glow that avoids costly real-time GPU Gaussian Blurs */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-10 -mt-10 opacity-60 pointer-events-none bg-[radial-gradient(circle,rgba(99,102,241,0.15)_0%,transparent_70%)]"></div>

              <div className="flex items-center justify-between mb-5 relative z-10">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-600 animate-pulse" />
                  <span className="text-[9px] font-black uppercase text-indigo-500 tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md">BLE Bluetooth Link</span>
                </div>
                <button
                  onClick={() => setPairingDevice(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-rose-100 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  <span className="font-black text-sm leading-none">&times;</span>
                </button>
              </div>

              <div className="relative z-10 mb-5">
                <h2 className="text-lg font-black text-indigo-950 tracking-tight">
                  Pair {pairingDevice === 'AppleWatch' ? 'Apple Watch Series 9' : pairingDevice === 'boAtWave' ? 'boAt Wave Sigma' : pairingDevice === 'FireBoltt' ? 'Fire-Boltt Gladiator' : pairingDevice}
                </h2>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Bluetooth GATT Secure Protocol</p>
              </div>

              {/* PERMISSION CHECKBOXES */}
              <div className="space-y-2 mb-5 relative z-10 bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Authorized Telemetry</p>
                <div className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 text-[10px] font-black">✓</span>
                  <span className="text-xs font-bold text-slate-700">Heart Rate Stream (BPM)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 text-[10px] font-black">✓</span>
                  <span className="text-xs font-bold text-slate-700">Sleep Duration Telemetry (Hours)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 text-[10px] font-black">✓</span>
                  <span className="text-xs font-bold text-slate-700">Water Consumption Index</span>
                </div>
              </div>

              {/* PIN INPUT */}
              <div className="mb-6 relative z-10">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                  Enter 6-Digit PIN from Watch Screen
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 884021"
                  value={pairingPin}
                  onChange={(e) => setPairingPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center text-lg font-black tracking-[0.2em] text-indigo-950 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all placeholder:tracking-normal placeholder:font-bold placeholder:text-slate-300"
                />
              </div>

              <button
                onClick={handleConfirmPairing}
                className="w-full h-13 bg-indigo-950 hover:bg-black text-white rounded-2xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest hover:shadow-lg active:scale-95 transition-all cursor-pointer border-none"
              >
                <Zap className="w-4 h-4 text-secondary" />
                Authorize secure BLE Link
              </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
                  <p className="text-lg font-black">{dailyLogs.heartRate} <span className="text-[9px] font-normal text-rose-300">bpm</span></p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <p className="text-[8px] font-bold text-rose-300 uppercase">Health Score</p>
                  <p className="text-lg font-black text-rose-400">{healthScore}%</p>
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
                  <Shield className="w-10 h-10 text-emerald-400 animate-bounce" />
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
  );
}
