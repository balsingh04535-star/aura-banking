import React from 'react';
import { RefreshCw, CheckCircle2, PauseCircle } from 'lucide-react';
import { useBanking } from '../../store/BankingContext';
import { formatCurrency } from '../../utils/formatters';
import { triggerHaptic } from '../../hooks/useHaptic';

export const SubscriptionsList: React.FC = () => {
  const { subscriptions, toggleSubscription } = useBanking();

  const totalMonthly = subscriptions
    .filter((s) => s.isActive)
    .reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-sm font-bold text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A]">
            Subscriptions & Direct Debits
          </h3>
          <p className="text-[11px] text-[#878A8E]">
            {formatCurrency(totalMonthly, '€')}/month recurring
          </p>
        </div>
        <div className="p-1.5 rounded-lg bg-white/5 text-[#878A8E]">
          <RefreshCw size={14} />
        </div>
      </div>

      <div className="space-y-2">
        {subscriptions.map((sub) => (
          <div
            key={sub.id}
            className={`p-3.5 rounded-2xl liquid-glass border transition-all flex items-center justify-between ${
              sub.isActive ? 'border-white/5' : 'opacity-60 border-white/5 bg-white/2'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-sm text-white">
                {sub.logoInitial}
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A]">
                  {sub.merchant}
                </h4>
                <p className="text-[10px] text-[#878A8E]">
                  Next debit: {sub.nextBillingDate} • {sub.frequency}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs font-bold text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A] tnum">
                  {formatCurrency(sub.amount, '€')}
                </span>
                <span
                  className={`block text-[9px] ${
                    sub.isActive ? 'text-aura-green' : 'text-[#878A8E]'
                  }`}
                >
                  {sub.isActive ? 'Active' : 'Paused'}
                </span>
              </div>

              {/* Pause / Resume Button */}
              <button
                onClick={() => {
                  triggerHaptic('light');
                  toggleSubscription(sub.id);
                }}
                className={`p-1.5 rounded-xl border text-xs font-medium transition-colors ${
                  sub.isActive
                    ? 'border-white/10 hover:border-aura-red/30 hover:text-aura-red text-[#878A8E]'
                    : 'border-aura-green/30 text-aura-green bg-aura-green/10'
                }`}
                title={sub.isActive ? 'Pause Direct Debit' : 'Resume Direct Debit'}
              >
                {sub.isActive ? <PauseCircle size={15} /> : <CheckCircle2 size={15} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
