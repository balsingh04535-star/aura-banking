import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Settings,
  Target,
  User,
} from 'lucide-react';
import { SecurityCenter } from '../profile/SecurityCenter';
import { SettingsView } from '../profile/SettingsView';
import { SavingsVaultCard } from '../savings/SavingsVaultCard';
import { useBanking } from '../../store/BankingContext';
import { formatIBAN } from '../../utils/formatters';
import { triggerHaptic } from '../../hooks/useHaptic';

export const ProfileScreen: React.FC = () => {
  const { activeAccount, savingsGoals } = useBanking();
  const [profileTab, setProfileTab] = useState<'vaults' | 'security' | 'settings'>('vaults');

  const handleTabSwitch = (tab: 'vaults' | 'security' | 'settings') => {
    triggerHaptic('light');
    setProfileTab(tab);
  };

  return (
    <div className="w-full px-5 pt-2 pb-28 space-y-4 select-none">
      {/* Profile Header Card */}
      <div className="bg-[#141618] rounded-3xl p-5 border border-white/10 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#1D2024] border border-white/15 flex items-center justify-center text-white/90 shrink-0">
            <User size={26} strokeWidth={1.75} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white truncate">
                Anshdeep Singh
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/90 text-[10px] font-medium shrink-0">
                Private
              </span>
            </div>
            <p className="text-xs text-[#7E848D] mt-0.5 truncate">anshdeep.singh@aura.bank</p>
            <p className="text-[10px] text-[#7E848D] font-mono mt-0.5">
              IBAN: {formatIBAN(activeAccount.iban)}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Section Tabs */}
      <div className="flex bg-[#141618] p-1 rounded-2xl border border-white/10">
        {[
          { id: 'vaults', label: 'Vaults', icon: Target },
          { id: 'security', label: 'Security', icon: Shield },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = profileTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabSwitch(tab.id as any)}
              className={`flex-1 py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                isSelected
                  ? 'bg-white text-black'
                  : 'text-[#7E848D] hover:text-white'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>
        {profileTab === 'vaults' && (
          <div className="space-y-3">
            {savingsGoals.map((goal) => (
              <SavingsVaultCard key={goal.id} goal={goal} />
            ))}
          </div>
        )}

        {profileTab === 'security' && <SecurityCenter />}

        {profileTab === 'settings' && <SettingsView />}
      </div>
    </div>
  );
};
