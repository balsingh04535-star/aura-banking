import React from 'react';
import { Search, BarChart3, CreditCard, Camera } from 'lucide-react';
import { useBanking } from '../../store/BankingContext';
import { triggerHaptic } from '../../hooks/useHaptic';

export const TopHeader: React.FC = () => {
  const { setActiveTab, filter, setFilter } = useBanking();

  return (
    <header className="w-full px-4 pt-[max(env(safe-area-inset-top,0px),16px)] pb-2 flex items-center justify-between gap-2.5 select-none font-sans">
      {/* Profile Avatar (Coral/Orange circle with camera glyph + notification red dot) */}
      <button
        onClick={() => {
          triggerHaptic('light');
          setActiveTab('profile');
        }}
        className="relative w-11 h-11 rounded-full bg-[#ff6c47] text-white flex items-center justify-center shrink-0 active:scale-95 transition-transform"
        aria-label="Profile"
      >
        <Camera size={19} strokeWidth={2} />
        {/* Red notification dot */}
        <div className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-[#ff3b30] border-2 border-black" />
      </button>

      {/* Center Search Bar Pill */}
      <div className="flex-1 relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e8e93]"
        />
        <input
          type="text"
          value={filter.query}
          onChange={(e) => setFilter((prev) => ({ ...prev, query: e.target.value }))}
          placeholder="Search"
          className="w-full h-11 bg-[#1c1c1e] text-white placeholder-[#8e8e93] text-sm rounded-full pl-10 pr-4 outline-none focus:bg-[#252528] transition-colors"
        />
      </div>

      {/* Analytics / Insights Button */}
      <button
        onClick={() => {
          triggerHaptic('light');
          setActiveTab('insights');
        }}
        className="w-11 h-11 rounded-full bg-[#1c1c1e] text-white flex items-center justify-center shrink-0 hover:bg-[#2c2c2e] active:scale-95 transition-all"
        aria-label="Analytics"
      >
        <BarChart3 size={18} strokeWidth={2} />
      </button>

      {/* Cards Button */}
      <button
        onClick={() => {
          triggerHaptic('light');
          setActiveTab('cards');
        }}
        className="w-11 h-11 rounded-full bg-[#1c1c1e] text-white flex items-center justify-center shrink-0 hover:bg-[#2c2c2e] active:scale-95 transition-all"
        aria-label="Cards"
      >
        <CreditCard size={18} strokeWidth={2} />
      </button>
    </header>
  );
};
