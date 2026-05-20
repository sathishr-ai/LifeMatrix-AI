import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Shield } from 'lucide-react';
import favicon from '../../../assets/favicon.png';

export function SplashScreen() {
  const navigate = useNavigate();
  // State to track mouse or gyroscope tilt for Parallax Effect
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Extended timer slightly to 4.5 seconds to let the biometric scan finish
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 4500); 
    
    return () => clearTimeout(timer);
  }, [navigate]);

  useEffect(() => {
    // 3. Parallax Effect: Track mouse and device orientation
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize screen coordinates from -1 to 1
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setTilt({ x, y });
    };
    
    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma && e.beta) {
        // Normalize device tilt (approximate angles)
        const x = Math.min(Math.max(e.gamma / 45, -1), 1);
        const y = Math.min(Math.max(e.beta / 45, -1), 1);
        setTilt({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('deviceorientation', handleDeviceOrientation as any);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleDeviceOrientation as any);
    };
  }, []);

  return (
    <div className="size-full flex items-center justify-center bg-gradient-to-br from-primary via-primary to-secondary overflow-hidden relative">
      {/* Deep Space Background Atmosphere with Parallax (Moves opposite to tilt) */}
      <motion.div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        animate={{ x: tilt.x * -40, y: tilt.y * -40 }}
        transition={{ type: "spring", stiffness: 70, damping: 30 }}
      >
        <div className="absolute top-20 left-10 w-64 h-64 bg-secondary rounded-full blur-2xl will-change-transform"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-white rounded-full blur-2xl will-change-transform"></div>
      </motion.div>

      {/* Foreground Content with Parallax (Moves with tilt and rotates slightly) */}
      <motion.div
        animate={{ 
          x: tilt.x * 20, 
          y: tilt.y * 20,
          rotateX: tilt.y * -5,
          rotateY: tilt.x * 5
        }}
        transition={{ type: "spring", stiffness: 70, damping: 30 }}
        style={{ perspective: 1200 }}
        className="relative z-10 text-center flex flex-col items-center w-full"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative text-center flex flex-col items-center"
        >
        {/* Animated Logo Chamber - Preserving Original Style but adding Exploded View */}
        <motion.div 
          className="relative mb-8 w-28 h-28" 
          style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <div className="absolute inset-0 bg-secondary/25 rounded-full blur-2xl scale-150 pointer-events-none" />
          
          {/* The Perfect Solid Logo that appears precisely when the pieces assemble, eliminating any seams */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.1 }}
            className="absolute inset-0 w-full h-full rounded-[32px] bg-[#0B1528] border-2 border-white/15 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden z-10"
          >
            <img src={favicon} className="absolute w-full h-full object-cover scale-[1.35] z-10" alt="Solid Logo" />
            
            {/* 2. Biometric Laser Scan - Sweeps down exactly after the logo is assembled */}
            <motion.div
              initial={{ top: "-10%", opacity: 0 }}
              animate={{ top: "110%", opacity: [0, 1, 1, 0] }}
              transition={{ delay: 1.5, duration: 1.8, ease: "easeInOut" }}
              className="absolute left-0 right-0 h-[3px] bg-emerald-400 z-20 pointer-events-none"
              style={{
                boxShadow: '0 0 15px 4px rgba(52, 211, 153, 0.6), 0 0 30px 8px rgba(52, 211, 153, 0.3)'
              }}
            />
          </motion.div>

          {/* Master wrapper for the flying pieces that vanishes during the white flash */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 1.0, duration: 0.1 }}
            className="absolute inset-0 z-20 pointer-events-none"
            style={{ willChange: 'opacity' }}
          >
            {/* Render 4 true physical DOM quadrants for the flying animation */}
            {[
              { 
                pos: 'top-0 left-0 rounded-tl-[32px] border-t-2 border-l-2', 
                imgPos: 'top-0 left-0', 
                x: -80, y: -80, z: -200, rotate: -45, delay: 0.1 
              },
              { 
                pos: 'top-0 right-0 rounded-tr-[32px] border-t-2 border-r-2', 
                imgPos: 'top-0 right-0', 
                x: 80, y: -80, z: -100, rotate: 45, delay: 0.2 
              },
              { 
                pos: 'bottom-0 left-0 rounded-bl-[32px] border-b-2 border-l-2', 
                imgPos: 'bottom-0 left-0', 
                x: -80, y: 80, z: 100, rotate: 45, delay: 0.3 
              },
              { 
                pos: 'bottom-0 right-0 rounded-br-[32px] border-b-2 border-r-2', 
                imgPos: 'bottom-0 right-0', 
                x: 80, y: 80, z: 200, rotate: -45, delay: 0.4 
              }
            ].map((piece, i) => (
              <motion.div
                key={i}
                initial={{ x: piece.x, y: piece.y, z: piece.z, rotateZ: piece.rotate, opacity: 0, scale: 0.5 }}
                animate={{ x: 0, y: 0, z: 0, rotateZ: 0, opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 15, delay: piece.delay }}
                className={`absolute w-[56px] h-[56px] bg-[#0B1528] border-white/15 overflow-hidden shadow-lg ${piece.pos}`}
                style={{ willChange: 'transform, opacity' }}
              >
                <img src={favicon} className={`absolute w-[112px] h-[112px] max-w-none object-cover scale-[1.35] origin-center ${piece.imgPos}`} alt="Logo Part" loading="eager" decoding="sync" />
              </motion.div>
            ))}
          </motion.div>

          {/* Assembly Flash - triggers precisely when the pieces touch */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 2] }}
            transition={{ delay: 0.9, duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 bg-white rounded-full blur-[20px] pointer-events-none z-30"
          />
        </motion.div>

        {/* Original Authoritative Tech Branding */}
        <motion.h1
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight drop-shadow-xl"
        >
          LifeMatrix AI
        </motion.h1>

        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-secondary text-xs font-extrabold tracking-[0.25em] uppercase opacity-90"
        >
          Smart Health Intelligence
        </motion.p>

        {/* Original High-Fidelity Clinical Linear Scanner Engine */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.5 }}
          className="mt-12 flex flex-col items-center gap-3"
        >
          <div className="w-44 h-[3px] bg-white/10 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              style={{ originX: 0 }}
              transition={{ duration: 2.6, ease: [0.22, 1, 0.36, 1] }}
              className="h-full w-full bg-gradient-to-r from-secondary to-white shadow-[0_0_10px_rgba(0,198,167,0.5)]"
            />
          </div>
          <span className="text-[9px] tracking-[0.2em] text-white/40 font-mono animate-pulse uppercase">
            LOADING YOUR HEALTH PORTAL...
          </span>
        </motion.div>
        </motion.div>
      </motion.div>

      {/* Original Official Clinical Compliance Security Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-10 left-0 w-full text-center pointer-events-none"
      >
        <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-white/30 tracking-[0.18em] font-mono">
          <Shield className="w-3.5 h-3.5 text-secondary/40" strokeWidth={2.5} />
          <span>END-TO-END SECURE ENCRYPTION</span>
        </div>
      </motion.div>
    </div>
  );
}
