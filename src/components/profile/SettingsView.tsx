import React from 'react';
import {
  Moon,
  Sun,
  Globe,
  Bell,
  Sliders,
  RotateCcw,
  Shield,
  HelpCircle,
  FileText,
  MessageSquare,
} from 'lucide-react';
import { useBanking } from '../../store/BankingContext';
import { triggerHaptic } from '../../hooks/useHaptic';

export const SettingsView: React.FC = () => {
  const {
    theme,
    toggleTheme,
    resetAllDemoData,
    setIsStatementsOpen,
    setIsSupportOpen,
    showToast,
  } = useBanking();

  const handleThemeSwitch = (mode: 'dark' | 'light') => {
    if (theme !== mode) {
      triggerHaptic('medium');
      toggleTheme();
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Appearance Section */}
      <div className="liquid-glass rounded-3xl p-5 border border-white/10 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#878A8E]">
          Appearance & Theme
        </h4>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleThemeSwitch('dark')}
            className={`p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-semibold transition-all border ${
              theme === 'dark'
                ? 'bg-white/15 border-aura-blue text-white shadow-glow-blue'
                : 'bg-white/5 border-white/5 text-[#878A8E] hover:text-white'
            }`}
          >
            <Moon size={16} />
            <span>Dark Obsidian</span>
          </button>

          <button
            onClick={() => handleThemeSwitch('light')}
            className={`p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-semibold transition-all border ${
              theme === 'light'
                ? 'bg-white text-black border-aura-blue shadow-md'
                : 'bg-white/5 border-white/5 text-[#878A8E] hover:text-white'
            }`}
          >
            <Sun size={16} />
            <span>Light Pearl</span>
          </button>
        </div>
      </div>

      {/* Financial Documents & Statements */}
      <div className="liquid-glass rounded-3xl p-5 border border-white/10 space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#878A8E] mb-2">
          Documents & Statements
        </h4>

        <div
          onClick={() => {
            triggerHaptic('light');
            setIsStatementsOpen(true);
          }}
          className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[#878A8E]">
              <FileText size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A]">
                Account Statements
              </p>
              <p className="text-[10px] text-[#878A8E]">
                Download monthly PDFs and CSV transaction logs
              </p>
            </div>
          </div>
          <span className="text-xs text-aura-blue font-semibold">View</span>
        </div>

        <div
          onClick={() => {
            triggerHaptic('light');
            setIsSupportOpen(true);
          }}
          className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[#878A8E]">
              <MessageSquare size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A]">
                Aura Concierge Support
              </p>
              <p className="text-[10px] text-[#878A8E]">
                Instant 24/7 AI-assisted chat support
              </p>
            </div>
          </div>
          <span className="text-xs text-aura-blue font-semibold">Chat</span>
        </div>
      </div>

      {/* Preferences & Locale */}
      <div className="liquid-glass rounded-3xl p-5 border border-white/10 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#878A8E]">
          Preferences & Core
        </h4>

        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-3">
            <Globe size={18} className="text-[#878A8E]" />
            <span className="text-xs font-semibold text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A]">
              Display Currency
            </span>
          </div>
          <span className="text-xs font-semibold text-[#878A8E]">EUR (€)</span>
        </div>

        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-3">
            <Bell size={18} className="text-[#878A8E]" />
            <span className="text-xs font-semibold text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A]">
              Push Notifications
            </span>
          </div>
          <span className="text-xs font-semibold text-aura-green">Enabled</span>
        </div>
      </div>

      {/* Demo State Reset Button */}
      <div className="pt-2">
        <button
          onClick={() => {
            triggerHaptic('medium');
            resetAllDemoData();
          }}
          className="w-full p-3 rounded-2xl bg-white/5 hover:bg-aura-red/15 hover:text-aura-red text-xs text-[#878A8E] font-semibold border border-white/5 transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw size={14} />
          <span>Reset Demo Application State</span>
        </button>
      </div>
    </div>
  );
};
