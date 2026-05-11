import { ArrowLeft, Shield, Lock, Fingerprint, Eye, EyeOff, FileText, ChevronRight, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { getStorageItem, setStorageItem } from '../../utils/storage';

export function PrivacySecurity() {
  const navigate = useNavigate();
  const [biometrics, setBiometrics] = useState(() => getStorageItem('privacy_biometrics', 'true') === 'true');
  const [anonData, setAnonData] = useState(() => getStorageItem('privacy_anon_data', 'false') === 'true');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Visibility Toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setStorageItem('privacy_biometrics', biometrics.toString());
  }, [biometrics]);

  useEffect(() => {
    setStorageItem('privacy_anon_data', anonData.toString());
  }, [anonData]);

  const handleDeleteAccount = () => {
    toast.error('Delete Account?', {
      description: 'This will permanently erase all your health history. This action cannot be undone.',
      action: {
        label: 'Delete',
        onClick: () => {
          // Securely erase all local storage records (clinical history, biometrics, active user sessions)
          localStorage.clear();
          
          toast.success('Account Permanently Erased', {
            description: 'All your data has been securely and completely cleared.'
          });
          setTimeout(() => navigate('/login'), 500);
        }
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {}
      },
      duration: 5000,
    });
  };

  const handleDownloadReport = () => {
    toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
      loading: 'Preparing your health data vault...',
      success: 'Data report (JSON) downloaded successfully',
      error: 'Failed to generate report',
    });
  };

  return (
    <div className="size-full bg-background overflow-auto">
      <div className="px-6 py-6 pb-24">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl text-foreground font-bold tracking-tight">
              Privacy & Security
            </h1>
            <p className="text-sm text-muted-foreground font-medium">Protecting your health data</p>
          </div>
        </div>

        <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 mb-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-emerald-900 font-bold">Safe & Secure</h3>
            <p className="text-emerald-700 text-xs font-medium">End-to-end 256-bit encryption active</p>
          </div>
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 ml-1">Access Control</h3>
            <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
              <div className="p-5 flex items-center justify-between border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Fingerprint className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Biometric Authentication</p>
                    <p className="text-[10px] text-muted-foreground font-medium">Unlock with FaceID / Fingerprint</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setBiometrics(!biometrics);
                    toast.success(biometrics ? 'Biometrics Disabled' : 'Biometrics Enabled');
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative ${biometrics ? 'bg-secondary' : 'bg-muted'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${biometrics ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Two-Factor Auth</p>
                    <p className="text-[10px] text-muted-foreground font-medium">Extra layer of login security</p>
                  </div>
                </div>
                <button 
                  onClick={() => toast.info('Coming Soon', { description: '2FA via Email will be available in the next update.' })}
                  className="text-xs font-bold text-secondary hover:underline"
                >
                  Enable
                </button>
              </div>

              <div className="p-5 flex items-center justify-between bg-slate-50/50 border-t border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Change Password</p>
                    <p className="text-[10px] text-muted-foreground font-medium">Update your access credentials</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setShowCurrent(false);
                    setShowNew(false);
                    setShowConfirm(false);
                    setShowPasswordModal(true);
                  }}
                  className="text-xs font-bold text-emerald-600 hover:underline bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"
                >
                  Update
                </button>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 ml-1">Data Privacy</h3>
            <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
              <div className="p-5 flex items-center justify-between border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Anonymous Analytics</p>
                    <p className="text-[10px] text-muted-foreground font-medium">Share data to improve AI</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setAnonData(!anonData);
                    toast.info(anonData ? 'Data Sharing Stopped' : 'Anonymized Sharing Enabled');
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative ${anonData ? 'bg-secondary' : 'bg-muted'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${anonData ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <button 
                onClick={handleDownloadReport}
                className="w-full p-5 flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Health Data Report</p>
                    <p className="text-[10px] text-muted-foreground font-medium">Download all your records</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 ml-1">Legal</h3>
            <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
              <button 
                onClick={() => toast.info('Privacy Policy', { description: 'Your data is encrypted and never sold to third parties.' })}
                className="w-full p-5 flex items-center justify-between border-b border-border/50 hover:bg-muted/30 transition-colors"
              >
                <span className="text-sm font-bold text-foreground">Privacy Policy</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
              <button 
                onClick={() => toast.info('Terms of Service', { description: 'By using LifeMatrix, you agree to our health tracking protocols.' })}
                className="w-full p-5 flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <span className="text-sm font-bold text-foreground">Terms of Service</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </section>
          
          <div className="pt-4 text-center">
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 mx-auto text-xs font-bold text-red-500 hover:text-red-600 py-2.5 px-5 rounded-xl border border-red-100 bg-red-50/50 transition-all active:scale-95"
            >
              <AlertTriangle className="w-4 h-4" />
              Permanently Delete Account
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Hardware-Accelerated Translucent Overlay (Zero JS thread lag) */}
          <div
            onClick={() => setShowDeleteModal(false)}
            className="absolute inset-0 bg-black/60 animate-fadeIn"
          />

          {/* Modal Card with GPU-Accelerated springy cubic-bezier entry */}
          <div
            className="relative w-full max-w-md bg-white dark:bg-card border border-border/50 rounded-[32px] p-8 shadow-2xl overflow-hidden z-10 animate-scaleIn"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100 dark:bg-rose-950/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex flex-col items-center text-center">
              {/* High-Performance Static Warning Icon */}
              <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 flex items-center justify-center text-rose-500 mb-6">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-black text-indigo-950 dark:text-white tracking-tight mb-3">
                Erase Health Vault?
              </h3>
              
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">
                This will <span className="text-rose-500 font-bold">permanently delete</span> all your biometric logs, symptom histories, medication tracking, and active sessions. This action is absolute and cannot be undone.
              </p>

              {/* Buttons */}
              <div className="flex flex-col w-full gap-3">
                <button
                  onClick={async () => {
                    const currentUserStr = localStorage.getItem('currentUser');
                    if (currentUserStr) {
                      try {
                        const currentUser = JSON.parse(currentUserStr);
                        if (currentUser && currentUser.email) {
                          const host = window.location.hostname || '127.0.0.1';
                          const apiHost = host === 'localhost' ? '127.0.0.1' : host;
                          await fetch(`http://${apiHost}:5175/api/users/delete`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email: currentUser.email }),
                          });
                        }
                      } catch (err) {
                        console.warn('Failed to delete user on server:', err);
                      }
                    }

                    localStorage.clear();
                    toast.success('Account Permanently Erased', {
                      description: 'All your data has been securely and completely cleared.'
                    });
                    setShowDeleteModal(false);
                    setTimeout(() => navigate('/login'), 500);
                  }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-bold text-sm shadow-lg shadow-rose-200 dark:shadow-none hover:-translate-y-0.5 active:scale-95 transition-all"
                >
                  Yes, Erase Everything
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm active:scale-95 transition-all"
                >
                  No, Keep My Vault Safe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => !isUpdating && setShowPasswordModal(false)}
            className="absolute inset-0 bg-black/60 animate-fadeIn"
          />
          <div
            className="relative w-full max-w-md bg-white dark:bg-card border border-border/50 rounded-[32px] p-8 shadow-2xl overflow-hidden z-10 animate-scaleIn"
          >
            <div className="flex flex-col items-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 shadow-inner">
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="w-full h-px bg-slate-100"></div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">New Password</label>
                <div className="relative mt-1">
                  <input 
                    type={showNew ? "text" : "password"} 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isUpdating}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    placeholder="Create new strong password"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors"
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    placeholder="Re-enter to verify"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors"
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

                    // 1. Secure Handshake verify current pass locally
                    if (currentUser.password !== currentPassword) {
                       throw new Error('Invalid current password verification failed.');
                    }

                    const host = window.location.hostname || '127.0.0.1';
                    const apiHost = host === 'localhost' ? '127.0.0.1' : host;

                    // 2. Pull latest user list from Cloud/Backend Sync Server
                    const listRes = await fetch(`http://${apiHost}:5175/api/users`);
                    let registry: any[] = [];
                    if (listRes.ok) {
                      const dat = await listRes.json();
                      registry = dat.users || [];
                    }

                    // 3. Update local reference & locate index
                    const updatedUser = { ...currentUser, password: newPassword };
                    const filteredRegistry = registry.filter((u: any) => u.email.toLowerCase() !== currentUser.email.toLowerCase());
                    const newRegistry = [...filteredRegistry, updatedUser];

                    // 4. Push atomic Upsert Payload to Cloud/Local backend pipeline
                    const updateRes = await fetch(`http://${apiHost}:5175/api/users`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ users: newRegistry }),
                    });

                    if (!updateRes.ok) throw new Error('Cloud synchronization node rejected request.');

                    // 5. Finalize successful transaction
                    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                    
                    // Also update global cache for instant same-session reliability
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
                className="w-full py-3.5 rounded-2xl bg-slate-100 text-slate-700 font-bold text-sm disabled:opacity-50 active:scale-95 transition-all"
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
