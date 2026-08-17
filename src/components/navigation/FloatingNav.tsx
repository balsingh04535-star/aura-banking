import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  ArrowLeftRight,
  Bitcoin,
  Hexagon,
} from 'lucide-react';
import { useBanking } from '../../store/BankingContext';
import { ActiveTab } from '../../types/banking';
import { triggerHaptic } from '../../hooks/useHaptic';

export const FloatingNav: React.FC = () => {
  const { activeTab, setActiveTab } = useBanking();

  const handleSelectTab = (tabId: ActiveTab) => {
    if (activeTab === tabId) return;
    triggerHaptic('light');
    setActiveTab(tabId);
  };

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 flex justify-center pointer-events-none px-4 select-none">
      <nav className="pointer-events-auto bg-[#1c1c1e]/95 backdrop-blur-2xl px-3 py-1.5 rounded-full flex items-center gap-1 border border-white/10 shadow-2xl max-w-sm w-full justify-between">
        {/* Tab 1: Home (Active Pill with R) */}
        <button
          onClick={() => handleSelectTab('home')}
          className={`relative px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
            activeTab === 'home'
              ? 'bg-[#2c2c2e] text-white shadow-sm'
              : 'text-[#8e8e93] hover:text-white'
          }`}
        >
          <span className="font-extrabold text-sm tracking-tighter">R</span>
          <span className="text-[11px] font-semibold">Home</span>
        </button>

        {/* Tab 2: Invest */}
        <button
          onClick={() => handleSelectTab('insights')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
            activeTab === 'insights' ? 'text-white' : 'text-[#8e8e93] hover:text-white'
          }`}
        >
          <TrendingUp size={16} strokeWidth={2} />
          <span className="text-[9px] font-medium mt-0.5">Invest</span>
        </button>

        {/* Tab 3: Payments */}
        <button
          onClick={() => handleSelectTab('payments')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
            activeTab === 'payments' ? 'text-white' : 'text-[#8e8e93] hover:text-white'
          }`}
        >
          <ArrowLeftRight size={16} strokeWidth={2} />
          <span className="text-[9px] font-medium mt-0.5">Payments</span>
        </button>

        {/* Tab 4: Crypto / Cards */}
        <button
          onClick={() => handleSelectTab('cards')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
            activeTab === 'cards' ? 'text-white' : 'text-[#8e8e93] hover:text-white'
          }`}
        >
          <Bitcoin size={16} strokeWidth={2} />
          <span className="text-[9px] font-medium mt-0.5">Crypto</span>
        </button>

        {/* Tab 5: RevPoints / Profile */}
        <button
          onClick={() => handleSelectTab('profile')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
            activeTab === 'profile' ? 'text-white' : 'text-[#8e8e93] hover:text-white'
          }`}
        >
          <Hexagon size={16} strokeWidth={2} />
          <span className="text-[9px] font-medium mt-0.5">RevPoints</span>
        </button>
      </nav>
    </div>
  );
};
