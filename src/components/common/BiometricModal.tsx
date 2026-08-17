import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShieldCheck, Fingerprint } from 'lucide-react';
import { triggerHaptic } from '../../hooks/useHaptic';

interface BiometricModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel?: () => void;
  title?: string;
  subtitle?: string;
}

export const BiometricModal: React.FC<BiometricModalProps> = ({
  isOpen,
  onSuccess,
  onCancel,
  title = 'Aura Biometric Verification',
  subtitle = 'Confirm transaction with Touch ID / Face ID',
}) => {
  const [scanState, setScanState] = useState<'scanning' | 'success'>('scanning');

  useEffect(() => {
    if (isOpen) {
      setScanState('scanning');
      triggerHaptic('medium');

      const timer = setTimeout(() => {
        setScanState('success');
        triggerHaptic('success');
        const completeTimer = setTimeout(() => {
          onSuccess();
        }, 450);
        return () => clearTimeout(completeTimer);
      }, 850);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onSuccess]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/75 backdrop-blur-lg"
          onClick={onCancel}
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 350 }}
          className="relative w-full max-w-xs liquid-glass-elevated rounded-3xl p-6 flex flex-col items-center text-center shadow-glass-lg border border-white/15"
        >
          {/* Abstract Biometric Ring */}
          <div className="relative w-24 h-24 my-4 flex items-center justify-center">
            {/* Outer Pulsing Glow */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full bg-aura-blue/20 blur-xl"
            />

            {/* Rotating SVG Perimeter Light Ring */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="4"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke={scanState === 'success' ? '#34D399' : '#5C7CFF'}
                strokeWidth="4"
                strokeDasharray="276"
                initial={{ strokeDashoffset: 276 }}
                animate={{
                  strokeDashoffset: scanState === 'success' ? 0 : [276, 50, 0],
                }}
                transition={{
                  duration: scanState === 'success' ? 0.4 : 0.85,
                  ease: 'easeInOut',
                }}
                strokeLinecap="round"
              />
            </svg>

            {/* Center Icon Morph */}
            <div className="absolute inset-0 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {scanState === 'scanning' ? (
                  <motion.div
                    key="scanning"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="text-aura-blue"
                  >
                    <Fingerprint size={36} className="animate-pulse" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    className="w-12 h-12 rounded-full bg-aura-green/20 border border-aura-green/40 flex items-center justify-center text-aura-green"
                  >
                    <Check size={26} strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <h3 className="text-base font-semibold text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A] mt-2">
            {scanState === 'success' ? 'Authenticated' : title}
          </h3>
          <p className="text-xs text-[#878A8E] mt-1 mb-3">{subtitle}</p>

          <div className="flex items-center gap-1.5 text-[11px] text-aura-blue/90 font-medium">
            <ShieldCheck size={13} />
            <span>Encrypted Secure Enclave</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
