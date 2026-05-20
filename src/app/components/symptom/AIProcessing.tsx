import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Brain, Activity, ArrowLeft } from 'lucide-react';

export function AIProcessing() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/app/result');
    }, 3500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#0A1F44] via-[#0A1F44] to-[#00C6A7] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-8 left-6 z-50 w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-95 shadow-2xl"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-secondary rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 text-center">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl mb-8 relative"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-white/5"></div>
          <Brain className="w-12 h-12 text-white relative z-10" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-black tracking-tight text-white mb-3"
        >
          AI HEALTH SCANNING
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-[10px] font-bold tracking-wider uppercase text-white/60 mb-8 max-w-xs mx-auto leading-relaxed"
        >
          Cross-referencing your symptoms with verified medical databases
        </motion.p>

        <div className="space-y-3 max-w-xs mx-auto">
          {[
            { text: 'Analyzing Symptom Patterns', delay: 0 },
            { text: 'Reviewing Health History', delay: 0.5 },
            { text: 'Calculating Clinical Matches', delay: 1 },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: item.delay, duration: 0.5 }}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 shadow-sm"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/10"
              >
                <Activity className="w-4 h-4 text-white" />
              </motion.div>
              <span className="text-white font-black tracking-wide text-[10.5px] uppercase text-left">{item.text}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex items-center justify-center gap-2 mt-8"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ delay: i * 0.2, duration: 1, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-white/60"
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
