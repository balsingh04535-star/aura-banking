import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, ArrowDown } from 'lucide-react';
import { BottomSheet } from '../common/BottomSheet';
import { useBanking } from '../../store/BankingContext';
import { SavingsGoal } from '../../types/banking';
import { formatCurrency } from '../../utils/formatters';
import { triggerHaptic } from '../../hooks/useHaptic';

interface SavingsVaultCardProps {
  goal: SavingsGoal;
}

export const SavingsVaultCard: React.FC<SavingsVaultCardProps> = ({ goal }) => {
  const {
    activeAccount,
    addFundsToSavingsGoal,
    withdrawFromSavingsGoal,
    showToast,
  } = useBanking();

  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [amountInput, setAmountInput] = useState('500');

  const percentage = Math.min(
    Math.round((goal.currentAmount / goal.targetAmount) * 100),
    100
  );

  const handleDeposit = () => {
    const amt = parseFloat(amountInput) || 0;
    if (amt <= 0) {
      showToast('Enter a valid amount', 'error');
      return;
    }
    triggerHaptic('medium');
    const success = addFundsToSavingsGoal(goal.id, amt, activeAccount.id);
    if (success) {
      setIsDepositOpen(false);
      triggerHaptic('success');
    }
  };

  const handleWithdraw = () => {
    const amt = parseFloat(amountInput) || 0;
    if (amt <= 0) {
      showToast('Enter a valid amount', 'error');
      return;
    }
    triggerHaptic('medium');
    const success = withdrawFromSavingsGoal(goal.id, amt, activeAccount.id);
    if (success) {
      setIsWithdrawOpen(false);
      triggerHaptic('success');
    }
  };

  return (
    <>
      <div className="bg-[#141618] rounded-3xl p-5 border border-white/10 space-y-4 select-none">
        {/* Goal Title & Target */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1D2024] border border-white/5 flex items-center justify-center text-white/80">
              <Target size={18} strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                {goal.name}
              </h3>
              <p className="text-[11px] text-[#7E848D]">
                Target: {formatCurrency(goal.targetAmount, goal.currency)}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-base font-bold text-white tnum">
              {formatCurrency(goal.currentAmount, goal.currency)}
            </span>
            <span className="block text-[10px] text-[#7E848D] font-medium">
              {percentage}% Complete
            </span>
          </div>
        </div>

        {/* Minimal Solid Progress Bar (No Gradients) */}
        <div className="space-y-1.5">
          <div className="w-full h-2 rounded-full bg-[#1D2024] p-0.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full rounded-full bg-white"
            />
          </div>

          <div className="flex justify-between text-[10px] text-[#7E848D]">
            <span>€0</span>
            <span>{percentage}% reached</span>
            <span>{formatCurrency(goal.targetAmount, goal.currency)}</span>
          </div>
        </div>

        {/* Vault Actions */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => {
              triggerHaptic('light');
              setAmountInput('500');
              setIsDepositOpen(true);
            }}
            className="py-2.5 px-3 rounded-2xl bg-white text-black font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors hover:bg-neutral-200"
          >
            <Plus size={14} />
            <span>Add to Vault</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('light');
              setAmountInput('250');
              setIsWithdrawOpen(true);
            }}
            className="py-2.5 px-3 rounded-2xl bg-[#1D2024] text-white border border-white/10 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors hover:border-white/20"
          >
            <ArrowDown size={14} />
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      {/* Deposit to Vault Modal */}
      <BottomSheet
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        title={`Add Money to ${goal.name}`}
        subtitle={`Deducts from ${activeAccount.name}`}
      >
        <div className="space-y-4 pb-4">
          <div>
            <label className="text-xs font-medium text-[#7E848D] block mb-1">
              Deposit Amount (€)
            </label>
            <input
              type="number"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              className="w-full bg-[#141618] border border-white/10 rounded-2xl p-3 text-xl font-bold text-white tnum focus:outline-none focus:border-white/30"
            />
          </div>

          <div className="flex gap-2">
            {[100, 250, 500, 1000].map((preset) => (
              <button
                key={preset}
                onClick={() => setAmountInput(preset.toString())}
                className="flex-1 py-1.5 rounded-xl bg-[#1D2024] text-xs font-medium text-white hover:bg-white/10"
              >
                +€{preset}
              </button>
            ))}
          </div>

          <button
            onClick={handleDeposit}
            className="w-full py-3 rounded-2xl bg-white text-black font-semibold text-xs flex items-center justify-center gap-2 mt-2"
          >
            <Plus size={16} />
            <span>Transfer to Vault</span>
          </button>
        </div>
      </BottomSheet>

      {/* Withdraw from Vault Modal */}
      <BottomSheet
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        title={`Withdraw from ${goal.name}`}
        subtitle={`Transfers into ${activeAccount.name}`}
      >
        <div className="space-y-4 pb-4">
          <div>
            <label className="text-xs font-medium text-[#7E848D] block mb-1">
              Withdrawal Amount (€)
            </label>
            <input
              type="number"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              className="w-full bg-[#141618] border border-white/10 rounded-2xl p-3 text-xl font-bold text-white tnum focus:outline-none focus:border-white/30"
            />
          </div>

          <div className="text-xs text-[#7E848D]">
            Vault Balance: {formatCurrency(goal.currentAmount, goal.currency)}
          </div>

          <button
            onClick={handleWithdraw}
            className="w-full py-3 rounded-2xl bg-white text-black font-semibold text-xs flex items-center justify-center gap-2 mt-2"
          >
            <ArrowDown size={16} />
            <span>Withdraw to Personal Account</span>
          </button>
        </div>
      </BottomSheet>
    </>
  );
};
