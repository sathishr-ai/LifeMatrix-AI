import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Activity, Brain, Heart } from 'lucide-react';
import favicon from '../../../assets/favicon.png';

export function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="size-full flex items-center justify-center bg-gradient-to-br from-primary via-primary to-secondary overflow-hidden relative">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-secondary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex items-center justify-center w-28 h-28 rounded-[36px] bg-[#0B1528] border border-white/10 mb-6 relative overflow-hidden shadow-2xl"
        >
          <img src={favicon} className="w-full h-full object-cover scale-[1.35] relative z-10" alt="Logo" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-3xl text-white mb-2"
        >
          LifeMatrix AI
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-white/80 text-sm px-8"
        >
          Smart Health Intelligence System
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex items-center justify-center gap-2 mt-12"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ delay: i * 0.2, duration: 1, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-white/60"
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
