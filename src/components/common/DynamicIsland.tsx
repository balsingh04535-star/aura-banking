import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Battery, BellRing } from 'lucide-react';
import { useBanking } from '../../store/BankingContext';

export const DynamicIsland: React.FC = () => {
  const [time, setTime] = useState<string>('09:41');
  const { toast } = useBanking();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full pt-2.5 px-6 pb-2 flex items-center justify-between z-40 select-none">
      {/* Left: Time */}
      <span className="text-xs font-semibold tracking-tight text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A] tnum">
        {time}
      </span>

      {/* Center: Dynamic Island Pill */}
      <div className="relative">
        <motion.div
          animate={
            toast
              ? { width: 190, height: 32, borderRadius: 20 }
              : { width: 110, height: 26, borderRadius: 16 }
          }
          transition={{ type: 'spring', stiffness: 450, damping: 30 }}
          className="bg-black border border-white/10 flex items-center justify-between px-3 overflow-hidden shadow-md"
        >
          <AnimatePresence mode="wait">
            {toast ? (
              <motion.div
                key="toast-island"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 w-full text-left"
              >
                <div className="w-4 h-4 rounded-full bg-aura-blue flex items-center justify-center text-white shrink-0">
                  <BellRing size={10} />
                </div>
                <span className="text-[11px] font-medium text-white truncate">
                  {toast.message}
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="idle-island"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex items-center justify-between"
              >
                {/* Camera / Sensor Dots */}
                <div className="w-2.5 h-2.5 rounded-full bg-[#151518] border border-white/5" />
                <div className="w-2 h-2 rounded-full bg-[#0d0d10] border border-blue-900/30" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Right: Icons (Signal, Wifi, Battery) */}
      <div className="flex items-center gap-1.5 text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A]">
        <Wifi size={13} strokeWidth={2.2} />
        <div className="flex items-center gap-0.5 text-xs">
          <span className="text-[10px] font-bold tracking-tighter">5G</span>
          <Battery size={15} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
};
