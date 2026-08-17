import React, { useState } from 'react';
import { CreditCard, Landmark, Smartphone, Plus, Check } from 'lucide-react';
import { BottomSheet } from '../common/BottomSheet';
import { GlassButton } from '../common/GlassButton';
import { useBanking } from '../../store/BankingContext';
import { formatCurrency } from '../../utils/formatters';
import { triggerHaptic } from '../../hooks/useHaptic';

export const AddMoneyModal: React.FC = () => {
  const {
    isAddMoneyModalOpen,
    setIsAddMoneyModalOpen,
    accounts,
    activeAccount,
    addMoney,
    showToast,
  } = useBanking();

  const [amountStr, setAmountStr] = useState('200');
  const [targetAccountId, setTargetAccountId] = useState(activeAccount.id);
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'apple_pay' | 'wire'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parsedAmount = parseFloat(amountStr) || 0;

  const handleAdd = () => {
    if (parsedAmount <= 0) {
      showToast('Please enter an amount greater than €0', 'error');
      return;
    }

    setIsSubmitting(true);
    triggerHaptic('medium');

    setTimeout(() => {
      const methodName =
        selectedMethod === 'card'
          ? 'Debit Card Top-up'
          : selectedMethod === 'apple_pay'
          ? 'Apple Pay Instant'
          : 'SEPA Bank Wire';

      addMoney(parsedAmount, targetAccountId, methodName);
      setIsSubmitting(false);
      setIsAddMoneyModalOpen(false);
      triggerHaptic('success');
    }, 600);
  };

  const methods = [
    {
      id: 'card',
      label: 'Debit Card',
      sub: 'Instant • Free',
      icon: CreditCard,
    },
    {
      id: 'apple_pay',
      label: 'Apple Pay',
      sub: 'Instant Top-up',
      icon: Smartphone,
    },
    {
      id: 'wire',
      label: 'Bank Wire Transfer',
      sub: 'Direct SEPA deposit',
      icon: Landmark,
    },
  ];

  return (
    <BottomSheet
      isOpen={isAddMoneyModalOpen}
      onClose={() => setIsAddMoneyModalOpen(false)}
      title="Add Money"
      subtitle="Instantly deposit funds into your account"
    >
      <div className="space-y-4 pb-4">
        {/* Target Account Picker */}
        <div>
          <label className="text-xs font-semibold text-[#878A8E] block mb-1">
            Deposit Into
          </label>
          <select
            value={targetAccountId}
            onChange={(e) => setTargetAccountId(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none cursor-pointer"
          >
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id} className="bg-[#111315] text-white">
                {acc.name} — Current: {formatCurrency(acc.balance, acc.currency)}
              </option>
            ))}
          </select>
        </div>

        {/* Amount Input */}
        <div>
          <label className="text-xs font-semibold text-[#878A8E] block mb-1">
            Amount (€)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-aura-blue">
              €
            </span>
            <input
              type="number"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              placeholder="0.00"
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-2xl font-bold text-white tnum focus:outline-none focus:border-aura-blue"
            />
          </div>

          {/* Quick preset amount pills */}
          <div className="flex gap-2 mt-2">
            {[50, 100, 250, 500].map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  triggerHaptic('light');
                  setAmountStr(preset.toString());
                }}
                className="flex-1 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A] tnum transition-colors"
              >
                +€{preset}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <label className="text-xs font-semibold text-[#878A8E] block mb-1.5">
            Top-up Method
          </label>
          <div className="space-y-2">
            {methods.map((m) => {
              const Icon = m.icon;
              const isSelected = selectedMethod === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => {
                    triggerHaptic('light');
                    setSelectedMethod(m.id as any);
                  }}
                  className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'liquid-glass-elevated border-aura-blue/50 shadow-sm'
                      : 'liquid-glass border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-aura-blue text-white' : 'bg-white/5 text-[#878A8E]'
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A]">
                        {m.label}
                      </p>
                      <p className="text-[10px] text-[#878A8E]">{m.sub}</p>
                    </div>
                  </div>
                  {isSelected && <Check size={16} className="text-aura-blue" />}
                </div>
              );
            })}
          </div>
        </div>

        <GlassButton
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          onClick={handleAdd}
          className="w-full mt-2"
        >
          <Plus size={16} />
          <span>Deposit €{parsedAmount.toFixed(2)} Instantly</span>
        </GlassButton>
      </div>
    </BottomSheet>
  );
};
