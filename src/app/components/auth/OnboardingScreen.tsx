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
    <div className="size-full bg-[#FAFBFF] flex flex-col relative overflow-hidden selection:bg-indigo-500/30">
      {/* PREMIUM BACKGROUND ELEMENTS */}
      <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[30%] bg-blue-50/50 rounded-full blur-[100px]"></div>

      <div className="flex-1 flex items-center justify-center px-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-sm w-full"
          >
            {/* ICON CONTAINER */}
            <div className="relative mb-12 inline-block">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-[-12px] rounded-[40px] border border-dashed border-indigo-200/50"
               />
               <div className={`relative w-36 h-36 rounded-[42px] bg-gradient-to-br ${slide.gradient} p-0.5 shadow-2xl shadow-indigo-200`}>
                 <div className="size-full bg-white/10 backdrop-blur-sm rounded-[40px] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
                    <Icon className={`w-16 h-16 ${slide.iconColor} relative z-10 drop-shadow-xl`} />
                 </div>
               </div>
               <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-white shadow-xl flex items-center justify-center border border-indigo-50">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
               </div>
            </div>

            {/* CONTENT */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-3 block">
                {slide.subtitle}
              </span>
              <h2 className="text-3xl font-black text-indigo-950 mb-4 tracking-tight leading-[1.1]">
                {slide.title}
              </h2>
              <p className="text-sm font-bold text-muted-foreground/80 leading-relaxed px-2">
                {slide.description}
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* FOOTER CONTROLS */}
      <div className="px-8 pb-12 relative z-10">
        {/* INDICATORS */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          {slides.map((_, index) => (
            <motion.div
              key={index}
              initial={false}
              animate={{ 
                width: index === currentSlide ? 32 : 10,
                backgroundColor: index === currentSlide ? '#10B981' : '#E1F5FE'
              }}
              className="h-2 rounded-full transition-all duration-500"
            />
          ))}
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4">
          {currentSlide < slides.length - 1 ? (
            <button
              onClick={handleSkip}
              className="flex-1 py-5 rounded-[24px] bg-white text-emerald-600 border border-emerald-100 font-black text-xs uppercase tracking-widest transition-all hover:bg-emerald-50 active:scale-95 shadow-sm"
            >
              Skip
            </button>
          ) : (
            <div className="flex-1" />
          )}
          <button
            onClick={handleNext}
            className={`flex-[1.5] py-5 rounded-[24px] bg-gradient-to-r from-[#10B981] via-[#059669] to-[#065F46] text-white flex items-center justify-center gap-3 shadow-2xl shadow-emerald-200/50 transition-all active:scale-95 group font-black text-xs uppercase tracking-widest`}
          >
            <span>{currentSlide < slides.length - 1 ? 'Next Step' : 'Get Started'}</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
