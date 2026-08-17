import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, Plus, SlidersHorizontal } from 'lucide-react';
import { useBanking } from '../../store/BankingContext';
import { triggerHaptic } from '../../hooks/useHaptic';

export const QuickActions: React.FC = () => {
  const {
    setIsSendModalOpen,
    setIsRequestModalOpen,
    setIsAddMoneyModalOpen,
    setIsFilterSheetOpen,
  } = useBanking();

  const actions = [
    {
      id: 'send',
      label: 'Send',
      icon: ArrowUpRight,
      onClick: () => {
        triggerHaptic('medium');
        setIsSendModalOpen(true);
      },
    },
    {
      id: 'request',
      label: 'Request',
      icon: ArrowDownLeft,
      onClick: () => {
        triggerHaptic('medium');
        setIsRequestModalOpen(true);
      },
    },
    {
      id: 'add',
      label: 'Top Up',
      icon: Plus,
      onClick: () => {
        triggerHaptic('medium');
        setIsAddMoneyModalOpen(true);
      },
    },
    {
      id: 'filter',
      label: 'Filter',
      icon: SlidersHorizontal,
      onClick: () => {
        triggerHaptic('light');
        setIsFilterSheetOpen(true);
      },
    },
  ];

  return (
    <div className="w-full px-5 py-2 select-none">
      <div className="grid grid-cols-4 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={act.onClick}
              className="flex flex-col items-center justify-center gap-2 group outline-none"
            >
              {/* Solid Charcoal Action Box (No Gradients) */}
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#141618] border border-white/10 group-hover:border-white/25 flex items-center justify-center transition-all duration-200">
                <Icon
                  size={20}
                  strokeWidth={1.8}
                  className="text-white/80 group-hover:text-white transition-colors"
                />
              </div>

              {/* Action Label */}
              <span className="text-[11px] font-medium text-[#7E848D] tracking-tight group-hover:text-white transition-colors">
                {act.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
