import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ProcessingOrbProps {
  status: 'processing' | 'success';
}

export const ProcessingOrb: React.FC<ProcessingOrbProps> = ({ status }) => {
  return (
    <div className="relative w-28 h-28 flex items-center justify-center my-6">
      {/* Outer ambient glow expansion */}
      <motion.div
        animate={{
          scale: status === 'success' ? [1, 1.4, 1.2] : [1, 1.15, 1],
          opacity: status === 'success' ? [0.4, 0.9, 0.6] : [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className={`absolute inset-0 rounded-full blur-2xl ${
          status === 'success' ? 'bg-aura-green/30' : 'bg-aura-blue/25'
        }`}
      />

      {/* Glass Orb Shell */}
      <motion.div
        animate={
          status === 'processing'
            ? { rotate: 360, scale: [1, 0.96, 1] }
            : { rotate: 0, scale: 1 }
        }
        transition={
          status === 'processing'
            ? { rotate: { repeat: Infinity, duration: 3, ease: 'linear' }, scale: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' } }
            : { type: 'spring', stiffness: 400, damping: 25 }
        }
        className={`w-24 h-24 rounded-full liquid-glass-elevated border flex items-center justify-center relative overflow-hidden ${
          status === 'success'
            ? 'border-aura-green/40 shadow-lg shadow-aura-green/20'
            : 'border-aura-blue/40 shadow-lg shadow-aura-blue/20'
        }`}
      >
        {/* Specular internal refraction highlight */}
        <motion.div
          animate={{ x: ['-100%', '200%'] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
        />

        {status === 'processing' ? (
          <div className="w-10 h-10 border-2 border-aura-blue border-t-transparent rounded-full animate-spin" />
        ) : (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            className="w-12 h-12 rounded-full bg-aura-green/20 border border-aura-green/50 flex items-center justify-center text-aura-green"
          >
            <Check size={28} strokeWidth={3} />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
