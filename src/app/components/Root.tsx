import { Outlet, useLocation, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { Home, Brain, Activity, BookOpen, User } from 'lucide-react';

export function Root() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      navigate('/login');
    }
  }, [navigate]);

  const navItems = [
    { icon: Home, label: 'Home', path: '/app' },
    { icon: Brain, label: 'AI', path: '/app/ai-chat' },
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
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-secondary'
                    : 'text-muted-foreground'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
