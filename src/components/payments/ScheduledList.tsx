import React, { useState } from 'react';
import { Calendar, Trash2, Clock, CheckCircle2 } from 'lucide-react';
import { useBanking } from '../../store/BankingContext';
import { ScheduledPayment } from '../../types/banking';
import { formatCurrency } from '../../utils/formatters';
import { triggerHaptic } from '../../hooks/useHaptic';

export const ScheduledList: React.FC = () => {
  const { scheduledPayments, cancelScheduledPayment } = useBanking();
  const [selectedForCancel, setSelectedForCancel] = useState<ScheduledPayment | null>(null);

  const handleConfirmCancel = () => {
    if (selectedForCancel) {
      triggerHaptic('medium');
      cancelScheduledPayment(selectedForCancel.id);
      setSelectedForCancel(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A]">
          Upcoming Scheduled Payments
        </h3>
        <span className="text-[11px] text-[#878A8E]">
          {scheduledPayments.length} Active
        </span>
      </div>

      {scheduledPayments.length === 0 ? (
        <div className="liquid-glass rounded-2xl p-6 text-center text-[#878A8E] text-xs">
          No scheduled payments pending.
        </div>
      ) : (
        <div className="space-y-2">
          {scheduledPayments.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl liquid-glass border border-white/5 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#878A8E]">
                  <Calendar size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A]">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-[#878A8E] flex items-center gap-1 mt-0.5">
                    <Clock size={10} />
                    <span>{item.executionDate}</span> • <span>{item.frequency}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs font-bold text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A] tnum">
                    {formatCurrency(item.amount, '€')}
                  </span>
                  <div className="flex items-center gap-1 text-[9px] text-aura-green justify-end">
                    <CheckCircle2 size={10} />
                    <span>Scheduled</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setSelectedForCancel(item);
                  }}
                  className="p-1.5 rounded-lg text-[#878A8E] hover:text-aura-red hover:bg-aura-red/10 transition-colors"
                  title="Cancel Payment"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Dialog for Cancellation */}
      {selectedForCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-xs liquid-glass-elevated rounded-3xl p-5 border border-white/10 text-center">
            <h4 className="text-sm font-bold text-white mb-1">
              Cancel Scheduled Payment?
            </h4>
            <p className="text-xs text-[#878A8E] mb-4">
              Are you sure you want to cancel the transfer of{' '}
              <strong className="text-white">
                {formatCurrency(selectedForCancel.amount, '€')}
              </strong>{' '}
              for "{selectedForCancel.title}"?
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedForCancel(null)}
                className="py-2 text-xs rounded-xl bg-white/10 text-white font-medium hover:bg-white/15"
              >
                Keep
              </button>
              <button
                onClick={handleConfirmCancel}
                className="py-2 text-xs rounded-xl bg-aura-red text-white font-semibold hover:bg-red-600"
              >
                Cancel Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
