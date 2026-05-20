import { Outlet, useLocation, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Home, MessageSquare, Activity, BookOpen, User } from 'lucide-react';

export function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState<string | null>(null);

  useEffect(() => {
    const currentUserStr = localStorage.getItem('currentUser');
    if (!currentUserStr) {
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(currentUserStr);
      if (user.profilePic) setProfilePic(user.profilePic);
    } catch (e) {}

    // Reactive listener to instantly sync avatar changes from the ProfileScreen in real-time
    const handlePicChange = (e: any) => {
      setProfilePic(e.detail);
    };

    window.addEventListener('profile-pic-changed', handlePicChange);

    // --- Enterprise Security: Auto-Logout Inactivity Timer ---
    // HIPAA standard: Log out user after 15 minutes of zero interaction
    const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; 
    let inactivityTimer: NodeJS.Timeout;

    const resetInactivityTimeout = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        // Purge session on expiration
        localStorage.removeItem('currentUser');
        localStorage.removeItem('activeRecoverySession');
        navigate('/login?expired=true', { replace: true });
        
        toast.error('Session Expired', {
          description: 'For your security, you were logged out due to inactivity.',
          duration: 6000
        });
      }, INACTIVITY_TIMEOUT_MS);
    };

    // Track all physical interactions
    const interactionEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    interactionEvents.forEach(event => window.addEventListener(event, resetInactivityTimeout, { passive: true }));
    
    // Initialize timer on mount
    resetInactivityTimeout();

    return () => {
      window.removeEventListener('profile-pic-changed', handlePicChange);
      clearTimeout(inactivityTimer);
      interactionEvents.forEach(event => window.removeEventListener(event, resetInactivityTimeout));
    };
  }, [navigate]);

  const navItems = [
    { icon: Home, label: 'Home', path: '/app' },
    { icon: MessageSquare, label: 'AI Chat', path: '/app/ai-chat' },
    { icon: Activity, label: 'Tracker', path: '/app/calendar' },
    { icon: BookOpen, label: 'Learn', path: '/app/learning' },
    { icon: User, label: 'Profile', path: '/app/profile' },
  ];

  return (
    <div className="size-full flex flex-col bg-background">
      <main className="flex-1 min-h-0 relative flex flex-col overflow-hidden">
        <Outlet />
      </main>
      <nav className="bg-white border-t border-border shadow-lg">
        <div className="flex items-center justify-around px-2 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const isProfile = item.label === 'Profile';

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 px-2 py-1.5 sm:px-4 sm:py-2 rounded-xl transition-all active:scale-95 ${
                  isActive
                    ? 'text-secondary'
                    : 'text-muted-foreground'
                }`}
              >
                {isProfile && profilePic ? (
                  <div className={`w-6 h-6 rounded-full border-2 overflow-hidden transition-all duration-300 flex-shrink-0 ${
                    isActive ? 'border-secondary shadow-md scale-110 animate-pulse-slow' : 'border-slate-200 scale-100 opacity-85'
                  }`}>
                    <img src={profilePic} className="w-full h-full object-cover" alt="P" />
                  </div>
                ) : (
                  <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                )}
                <span className="text-[10.5px] sm:text-xs font-medium whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
