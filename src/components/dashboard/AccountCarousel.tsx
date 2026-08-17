import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Copy, Check } from 'lucide-react';
import { useBanking } from '../../store/BankingContext';
import { AnimatedCounter } from '../common/AnimatedCounter';
import { formatCurrency } from '../../utils/formatters';
import { triggerHaptic } from '../../hooks/useHaptic';

export const AccountCarousel: React.FC = () => {
  const { accounts, activeAccountId, setActiveAccountId, activeAccount, showToast } =
    useBanking();
  const [copiedIban, setCopiedIban] = React.useState(false);

  const handleCopyIban = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(activeAccount.iban.replace(/\s+/g, ''));
    setCopiedIban(true);
    triggerHaptic('success');
    showToast('IBAN copied to clipboard', 'info');
    setTimeout(() => setCopiedIban(false), 2000);
  };

  return (
    <div className="w-full flex flex-col items-center px-5 pt-2 pb-4">
      {/* Dominant Hero Balance Section */}
      <motion.div
        key={activeAccount.id}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="flex flex-col items-center text-center my-1"
      >
        <span className="text-xs font-normal tracking-wide text-[#7E848D] mb-1">
          Available Balance
        </span>

        {/* Large Interpolating Balance */}
        <AnimatedCounter
          value={activeAccount.balance}
          currency={activeAccount.currency}
          size="hero"
        />

        {/* Monthly Delta Indicator */}
        <div className="flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-[#141618] border border-white/10 text-white/90">
          <TrendingUp size={12} className="text-white/70" />
          <span className="text-xs font-medium tnum text-[#A0A5AE]">
            {activeAccount.monthlyDelta >= 0 ? '+' : ''}
            {formatCurrency(activeAccount.monthlyDelta, activeAccount.currency)} this month
          </span>
        </div>
      </motion.div>

      {/* Account Cards Horizontal Scroll Carousel */}
      <div className="w-full mt-5">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1 px-0.5 snap-x snap-mandatory">
          {accounts.map((acc) => {
            const isActive = acc.id === activeAccountId;
            return (
              <div
                key={acc.id}
                onClick={() => {
                  if (!isActive) {
                    triggerHaptic('light');
                    setActiveAccountId(acc.id);
                  }
                }}
                className={`snap-center shrink-0 w-[240px] p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
                  isActive
                    ? 'bg-[#181A1D] border border-white/20 shadow-md'
                    : 'bg-[#141618] border border-white/10 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-[#7E848D] truncate max-w-[150px]">
                    {acc.name}
                  </span>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isActive ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                </div>

                <div className="text-lg font-bold text-white tnum mb-2">
                  {formatCurrency(acc.balance, acc.currency)}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] text-[#7E848D]">
                  <span className="tnum">•••• {acc.accountNumber}</span>
                  {isActive && (
                    <button
                      onClick={handleCopyIban}
                      className="flex items-center gap-1 hover:text-white transition-colors"
                      title="Copy IBAN"
                    >
                      {copiedIban ? (
                        <>
                          <Check size={12} className="text-white" />
                          <span className="text-[10px] text-white">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={11} />
                          <span className="text-[10px]">IBAN</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
