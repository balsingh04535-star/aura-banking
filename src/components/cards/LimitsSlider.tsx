import React, { useState } from 'react';
import { Sliders, Check } from 'lucide-react';
import { useBanking } from '../../store/BankingContext';
import { BankCard } from '../../types/banking';
import { formatCurrency } from '../../utils/formatters';
import { triggerHaptic } from '../../hooks/useHaptic';

interface LimitsSliderProps {
  card: BankCard;
}

export const LimitsSlider: React.FC<LimitsSliderProps> = ({ card }) => {
  const { updateCardLimits, showToast } = useBanking();

  const [dailyLimit, setDailyLimit] = useState(card.dailyLimit);
  const [atmLimit, setAtmLimit] = useState(card.atmLimit);
  const [onlineLimit, setOnlineLimit] = useState(card.onlineLimit);
  const [hasChanges, setHasChanges] = useState(false);

  const handleDailyChange = (val: number) => {
    setDailyLimit(val);
    setHasChanges(true);
  };

  const handleAtmChange = (val: number) => {
    setAtmLimit(val);
    setHasChanges(true);
  };

  const handleOnlineChange = (val: number) => {
    setOnlineLimit(val);
    setHasChanges(true);
  };

  const handleSaveLimits = () => {
    triggerHaptic('success');
    updateCardLimits(card.id, {
      dailyLimit,
      atmLimit,
      onlineLimit,
    });
    setHasChanges(false);
    showToast('Spending limits saved', 'info');
  };

  return (
    <div className="bg-[#141618] rounded-2xl p-4 border border-white/10 space-y-4 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders size={15} className="text-white/80" />
          <h4 className="text-[10px] font-medium uppercase tracking-wider text-[#7E848D]">
            Limits & Ceilings
          </h4>
        </div>
        {hasChanges && (
          <span className="text-[10px] text-white/90 font-medium">
            Unsaved
          </span>
        )}
      </div>

      {/* Daily Total Spending Limit */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-[#7E848D]">Daily Card Limit</span>
          <span className="font-semibold text-white tnum">
            {formatCurrency(dailyLimit, '€')}
          </span>
        </div>
        <input
          type="range"
          min="100"
          max="10000"
          step="100"
          value={dailyLimit}
          onChange={(e) => handleDailyChange(Number(e.target.value))}
          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
        />
        <div className="flex justify-between text-[10px] text-[#7E848D]">
          <span>€100</span>
          <span>€10,000</span>
        </div>
      </div>

      {/* ATM Limit */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-[#7E848D]">ATM Withdrawal</span>
          <span className="font-semibold text-white tnum">
            {formatCurrency(atmLimit, '€')}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="2500"
          step="50"
          value={atmLimit}
          onChange={(e) => handleAtmChange(Number(e.target.value))}
          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
        />
        <div className="flex justify-between text-[10px] text-[#7E848D]">
          <span>€0</span>
          <span>€2,500</span>
        </div>
      </div>

      {/* Online Limit */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-[#7E848D]">Online Purchase</span>
          <span className="font-semibold text-white tnum">
            {formatCurrency(onlineLimit, '€')}
          </span>
        </div>
        <input
          type="range"
          min="100"
          max="8000"
          step="100"
          value={onlineLimit}
          onChange={(e) => handleOnlineChange(Number(e.target.value))}
          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
        />
        <div className="flex justify-between text-[10px] text-[#7E848D]">
          <span>€100</span>
          <span>€8,000</span>
        </div>
      </div>

      {hasChanges && (
        <button
          onClick={handleSaveLimits}
          className="w-full py-2.5 rounded-xl bg-white text-black font-semibold text-xs flex items-center justify-center gap-1.5 mt-2 transition-colors"
        >
          <Check size={14} />
          <span>Save Limits</span>
        </button>
      )}
    </div>
  );
};
