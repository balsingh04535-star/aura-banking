import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, Sparkles, Layers, Zap } from 'lucide-react';
import { GlassButton } from '../common/GlassButton';
import { triggerHaptic } from '../../hooks/useHaptic';

interface WelcomeTourProps {
  onComplete: () => void;
}

const SLIDES = [
  {
    title: 'Move money effortlessly.',
    desc: 'Instant borderless SEPA transfers, multi-vault allocations, and intelligent automated wealth routing.',
    icon: Zap,
  },
  {
    title: 'Everything under control.',
    desc: 'Dynamic spending limits, 3D interactive titanium cards, and signature frost freeze security.',
    icon: Layers,
  },
  {
    title: 'Your capital, protected.',
    desc: 'Encrypted hardware isolation, biometric Face ID authorizations, and licensed institutional safety.',
    icon: ShieldCheck,
  },
];

export const WelcomeTour: React.FC<WelcomeTourProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    triggerHaptic('light');
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const CurrentIcon = SLIDES[currentSlide].icon;

  return (
    <div className="fixed inset-0 z-50 bg-[#141619] text-[#F7F7F5] flex flex-col justify-between p-6 sm:p-8 select-none">
      {/* Top Header / Skip */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-aura-blue/20 flex items-center justify-center text-aura-blue">
            <Sparkles size={14} />
          </div>
          <span className="text-sm font-extrabold tracking-widest uppercase">
            AURA
          </span>
        </div>

        <button
          onClick={() => {
            triggerHaptic('light');
            onComplete();
          }}
          className="text-xs font-semibold text-[#878A8E] hover:text-white"
        >
          Skip to Demo
        </button>
      </div>

      {/* Center Slide Content */}
      <div className="my-auto py-6 max-w-sm mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex flex-col items-center text-center"
          >
            {/* Visual Icon Orb */}
            <div className="w-24 h-24 rounded-3xl liquid-glass-elevated border border-aura-blue/30 flex items-center justify-center text-aura-blue shadow-glow-blue mb-8">
              <CurrentIcon size={40} strokeWidth={1.75} />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
              {SLIDES[currentSlide].title}
            </h2>

            <p className="text-xs sm:text-sm text-[#878A8E] leading-relaxed">
              {SLIDES[currentSlide].desc}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Step Indicator Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentSlide
                  ? 'w-6 bg-aura-blue'
                  : 'w-1.5 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="space-y-2.5 pb-4 max-w-sm mx-auto w-full">
        <GlassButton
          variant="primary"
          size="lg"
          onClick={handleNext}
          className="w-full"
        >
          <span>
            {currentSlide === SLIDES.length - 1
              ? 'Enter Demo Account'
              : 'Continue'}
          </span>
          <ArrowRight size={16} />
        </GlassButton>

        <button
          onClick={() => {
            triggerHaptic('light');
            onComplete();
          }}
          className="w-full py-2.5 text-xs text-[#878A8E] hover:text-white font-medium text-center"
        >
          Sign in as Alex Morgan (Demo)
        </button>
      </div>
    </div>
  );
};
