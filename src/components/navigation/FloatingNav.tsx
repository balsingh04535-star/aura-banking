import React from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  Layers,
  CircleDollarSign,
  PieChart,
  User,
} from 'lucide-react';
import { useBanking } from '../../store/BankingContext';
import { ActiveTab } from '../../types/banking';
import { triggerHaptic } from '../../hooks/useHaptic';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: Wallet },
  { id: 'cards', label: 'Cards', icon: Layers },
  { id: 'payments', label: 'Transfers', icon: CircleDollarSign },
  { id: 'insights', label: 'Analytics', icon: PieChart },
  { id: 'profile', label: 'Profile', icon: User },
];

export const FloatingNav: React.FC = () => {
  const { activeTab, setActiveTab } = useBanking();

  const handleSelectTab = (tabId: ActiveTab) => {
    if (activeTab === tabId) return;
    triggerHaptic('light');
    setActiveTab(tabId);
  };

  return (
    <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center pointer-events-none px-4 select-none">
      <nav className="pointer-events-auto bg-[#141618] p-1.5 rounded-full flex items-center gap-1 border border-white/10 shadow-2xl max-w-[270px] w-full justify-between">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              aria-label={item.label}
              title={item.label}
              className="relative w-10 h-10 rounded-[18px] flex items-center justify-center transition-all duration-200 outline-none select-none group"
            >
              {/* Active Clean Dark Highlight Bubble */}
              {isActive && (
                <motion.div
                  layoutId="activeDockBubble"
                  transition={{
                    type: 'spring',
                    stiffness: 450,
                    damping: 30,
                  }}
                  className="absolute inset-0 bg-[#22262B] rounded-[18px] border border-white/15"
                />
              )}

              {/* Icon */}
              <div className="relative z-10">
                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.2 : 1.7}
                  className={`transition-colors duration-150 ${
                    isActive
                      ? 'text-white'
                      : 'text-[#6C717A] group-hover:text-[#A0A5AE]'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
