import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Users,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { BeneficiaryList } from '../payments/BeneficiaryList';
import { ScheduledList } from '../payments/ScheduledList';
import { SubscriptionsList } from '../payments/SubscriptionsList';
import { useBanking } from '../../store/BankingContext';
import { triggerHaptic } from '../../hooks/useHaptic';

export const PaymentsScreen: React.FC = () => {
  const {
    setIsSendModalOpen,
    setIsRequestModalOpen,
    setIsAddMoneyModalOpen,
  } = useBanking();

  const [activeTabSection, setActiveTabSection] = useState<'beneficiaries' | 'scheduled' | 'subscriptions'>('beneficiaries');

  const handleSectionSwitch = (sec: 'beneficiaries' | 'scheduled' | 'subscriptions') => {
    triggerHaptic('light');
    setActiveTabSection(sec);
  };

  return (
    <motion.div
      key="screen-payments"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="w-full px-5 pt-2 pb-28 space-y-5"
    >
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A]">
          Payments & Transfers
        </h2>
        <p className="text-xs text-[#878A8E] mt-0.5">
          Send funds, manage beneficiaries and scheduled debits
        </p>
      </div>

      {/* Quick Action Dock */}
      <div className="grid grid-cols-3 gap-2.5">
        <button
          onClick={() => {
            triggerHaptic('medium');
            setIsSendModalOpen(true);
          }}
          className="p-3.5 rounded-2xl bg-aura-blue text-white flex flex-col items-center justify-center gap-1.5 shadow-glow-blue active:scale-95 transition-all"
        >
          <ArrowUpRight size={20} />
          <span className="text-xs font-semibold">Send</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('medium');
            setIsRequestModalOpen(true);
          }}
          className="p-3.5 rounded-2xl liquid-glass text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A] flex flex-col items-center justify-center gap-1.5 border border-white/10 active:scale-95 transition-all"
        >
          <ArrowDownLeft size={20} />
          <span className="text-xs font-semibold">Request</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('medium');
            setIsAddMoneyModalOpen(true);
          }}
          className="p-3.5 rounded-2xl liquid-glass text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A] flex flex-col items-center justify-center gap-1.5 border border-white/10 active:scale-95 transition-all"
        >
          <Plus size={20} />
          <span className="text-xs font-semibold">Top Up</span>
        </button>
      </div>

      {/* Section Switcher Tabs */}
      <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
        {[
          { id: 'beneficiaries', label: 'Beneficiaries', icon: Users },
          { id: 'scheduled', label: 'Scheduled', icon: Calendar },
          { id: 'subscriptions', label: 'Direct Debits', icon: RefreshCw },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTabSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleSectionSwitch(tab.id as any)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                isSelected
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-[#878A8E] hover:text-white'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Section Content */}
      <div>
        {activeTabSection === 'beneficiaries' && <BeneficiaryList />}
        {activeTabSection === 'scheduled' && <ScheduledList />}
        {activeTabSection === 'subscriptions' && <SubscriptionsList />}
      </div>
    </motion.div>
  );
};
