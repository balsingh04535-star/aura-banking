import React, { useEffect, ReactNode } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X } from 'lucide-react';
import { triggerHaptic } from '../../hooks/useHaptic';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  maxHeight?: string;
  showCloseButton?: boolean;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxHeight = 'max-h-[92vh]',
  showCloseButton = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      triggerHaptic('light');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-auto">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="absolute inset-0 bg-black/65 backdrop-blur-md"
          />

          {/* Liquid Glass Bottom Sheet Modal */}
          <motion.div
            initial={{ y: '100%', opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0.8 }}
            transition={{
              type: 'spring',
              damping: 32,
              stiffness: 350,
              mass: 0.8,
            }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.6 }}
            onDragEnd={handleDragEnd}
            className={`relative w-full max-w-lg ${maxHeight} liquid-glass-elevated rounded-t-[32px] overflow-hidden flex flex-col z-10 pb-safe`}
          >
            {/* Grab Handle Header */}
            <div className="pt-3 pb-2 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing w-full">
              <div className="w-10 h-1.2 rounded-full bg-white/20 dark:bg-white/20 light:bg-black/20" />
            </div>

            {/* Title Header */}
            {(title || showCloseButton) && (
              <div className="px-6 py-2 flex items-center justify-between border-b border-white/5 dark:border-white/5 light:border-black/5">
                <div>
                  {title && (
                    <h2 className="text-lg font-bold tracking-tight text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A]">
                      {title}
                    </h2>
                  )}
                  {subtitle && (
                    <p className="text-xs text-[#878A8E] dark:text-[#878A8E] light:text-[#64748B] mt-0.5">
                      {subtitle}
                    </p>
                  )}
                </div>

                {showCloseButton && (
                  <button
                    onClick={() => {
                      triggerHaptic('light');
                      onClose();
                    }}
                    className="p-2 rounded-full text-[#878A8E] hover:text-[#F7F7F5] hover:bg-white/10 active:bg-white/15 transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}

            {/* Content Body */}
            <div className="px-6 py-4 overflow-y-auto no-scrollbar flex-1">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
