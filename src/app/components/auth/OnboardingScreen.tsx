import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Shield, TrendingUp, ChevronRight, Sparkles } from 'lucide-react';

const slides = [
  {
    icon: Brain,
    title: 'AI-Powered Health Intelligence',
    subtitle: 'QUANTUM DIAGNOSTICS',
    description: 'Advanced algorithms analyze your biometric patterns and health data to provide personalized clinical insights and predictive stability scores.',
    gradient: 'from-indigo-500 via-blue-600 to-purple-600',
    iconColor: 'text-blue-100',
  },
  {
    icon: Shield,
    title: 'Preventive Health Monitoring',
    subtitle: 'BIO-SECURE VIGILANCE',
    description: 'Stay ahead of potential health anomalies with continuous 24/7 risk assessment and early warning alerts designed for proactive wellness.',
    gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
    iconColor: 'text-emerald-100',
  },
  {
    icon: TrendingUp,
    title: 'Track Your Health Journey',
    subtitle: 'EXECUTIVE ANALYTICS',
    description: 'Experience comprehensive biometric tracking and longitudinal analytics to help you achieve and maintain peak biological performance.',
    gradient: 'from-rose-400 via-orange-500 to-amber-500',
    iconColor: 'text-rose-100',
  },
];

export function OnboardingScreen() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/login');
    }
  };

  const handleSkip = () => {
    navigate('/login');
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="size-full flex flex-col relative overflow-hidden bg-gradient-to-br from-[#0B1528] via-[#0A1F44] to-[#008E77] selection:bg-secondary/30">
      {/* Isolated Performance-Tuned Background Noise Overlay */}
      <div className="absolute inset-0 bg-noise opacity-40 pointer-events-none"></div>

      {/* Holographic Background Orbs & Ambient Particles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-secondary/15 blur-[120px] opacity-70"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-white/5 blur-[150px] opacity-50"></div>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-md w-full"
          >
            {/* ICON CONTAINER */}
            <div className="relative mb-10 inline-block">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-[-12px] rounded-[40px] border border-dashed border-white/20 will-change-transform"
               />
               <div className={`relative w-32 h-32 rounded-[36px] bg-gradient-to-br ${slide.gradient} p-0.5 shadow-2xl shadow-black/40`}>
                 <div className="size-full bg-white/15 rounded-[34px] flex items-center justify-center relative overflow-hidden backdrop-blur-md">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
                    <Icon className={`w-14 h-14 ${slide.iconColor} relative z-10 drop-shadow-xl`} />
                 </div>
               </div>
               <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-[#0B1528]/85 shadow-xl flex items-center justify-center border border-white/20 text-secondary backdrop-blur-md">
                  <Sparkles className="w-5 h-5 animate-pulse" />
               </div>
            </div>

            {/* CONTENT */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-[11px] font-black text-secondary uppercase tracking-[0.3em] mb-3 block drop-shadow-sm">
                {slide.subtitle}
              </span>
              <h2 className="text-3xl font-black text-white mb-4 tracking-tight leading-[1.1] drop-shadow-md">
                {slide.title}
              </h2>
              <p className="text-sm font-medium text-white/70 leading-relaxed px-2">
                {slide.description}
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* FOOTER CONTROLS */}
      <div className="px-8 pb-12 relative z-10 max-w-md mx-auto w-full">
        {/* INDICATORS */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          {slides.map((_, index) => (
            <motion.div
              key={index}
              initial={false}
              animate={{ 
                width: index === currentSlide ? 32 : 10,
                backgroundColor: index === currentSlide ? '#00C6A7' : 'rgba(255, 255, 255, 0.2)'
              }}
              className="h-2 rounded-full"
            />
          ))}
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4">
          {currentSlide < slides.length - 1 ? (
            <button
              onClick={handleSkip}
              className="flex-1 py-4.5 rounded-[20px] bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 font-bold text-xs uppercase tracking-widest transition-all active:scale-95 shadow-sm text-center flex items-center justify-center"
            >
              Skip
            </button>
          ) : (
            <div className="flex-1" />
          )}
          <button
            onClick={handleNext}
            className="flex-[1.5] py-4.5 rounded-[20px] bg-gradient-to-r from-[#0072F5] to-[#00C6A7] text-white flex items-center justify-center gap-3 shadow-[0_12px_25px_-8px_rgba(0,114,245,0.5)] hover:from-[#1a80f6] hover:to-[#14d2b3] hover:shadow-[0_15px_30px_-8px_rgba(0,114,245,0.65)] transition-all active:scale-95 group font-bold text-xs uppercase tracking-widest overflow-hidden relative"
          >
            <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shine"></div>
            <span className="relative z-10">{currentSlide < slides.length - 1 ? 'Next Step' : 'Get Started'}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
          </button>
        </div>
      </div>
    </div>
  );
}
