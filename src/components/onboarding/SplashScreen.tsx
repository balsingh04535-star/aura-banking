import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 900);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 bg-[#141619] flex flex-col items-center justify-center select-none">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center"
      >
        {/* Refracting Geometric Aura Logo Icon */}
        <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
          {/* Ambient Glow */}
          <div className="absolute inset-0 rounded-full bg-aura-blue/20 blur-2xl animate-pulse" />

          {/* Logo Glyph */}
          <svg className="w-20 h-20 relative z-10" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="#111315"
              stroke="#5C7CFF"
              strokeWidth="2"
            />
            {/* Triangular Diamond Core */}
            <motion.path
              d="M50 24 L72 70 L28 70 Z"
              fill="none"
              stroke="#F7F7F5"
              strokeWidth="4"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
            />
            {/* Specular Refraction Streak */}
            <line
              x1="35"
              y1="35"
              x2="65"
              y2="65"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-3xl font-extrabold tracking-[0.25em] text-[#F7F7F5] uppercase font-sans"
        >
          AURA
        </motion.h1>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="text-[10px] tracking-[0.35em] text-[#878A8E] uppercase mt-1.5"
        >
          Private Digital Banking
        </motion.span>
      </motion.div>
    </div>
  );
};
