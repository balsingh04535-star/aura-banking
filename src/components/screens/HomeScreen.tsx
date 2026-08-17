import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Landmark,
  Plus,
  ArrowLeftRight,
  MoreHorizontal,
  AlertTriangle,
  ChevronDown,
  Check,
  Smartphone,
} from 'lucide-react';
import { useBanking } from '../../store/BankingContext';
import { formatCurrency, formatIBAN } from '../../utils/formatters';
import { triggerHaptic } from '../../hooks/useHaptic';

export const HomeScreen: React.FC = () => {
  const {
    activeAccount,
    accounts,
    setActiveAccountId,
    filteredTransactions,
    setSelectedTransaction,
    setIsAddMoneyModalOpen,
    setIsSendModalOpen,
    setIsRequestModalOpen,
    showToast,
  } = useBanking();

  const [isAccountsMenuOpen, setIsAccountsMenuOpen] = useState(false);
  const [isDismissBanner, setIsDismissBanner] = useState(false);

  // Formatted balance with comma
  const balanceFormatted = activeAccount.balance.toFixed(2).split('.');
  const wholePart = balanceFormatted[0];
  const decimalPart = balanceFormatted[1];

  return (
    <motion.div
      key="screen-home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="w-full flex flex-col px-4 pt-4 pb-28 space-y-6 select-none font-sans max-w-lg mx-auto"
    >
      {/* 1. HERO BALANCE SECTION */}
      <div className="flex flex-col items-center justify-center text-center pt-2">
        {/* Flag Subtitle: "Personal · EUR" */}
        <div className="flex items-center gap-1.5 text-xs text-[#8e8e93] font-medium mb-1.5">
          <div className="w-4 h-4 rounded-full bg-[#003399] flex items-center justify-center text-[9px] text-[#ffcc00] font-bold shadow-sm">
            ★
          </div>
          <span>{activeAccount.name} · {activeAccount.currency}</span>
        </div>

        {/* Big Balance: €675,68 */}
        <div className="flex items-baseline justify-center text-white tracking-tight tnum my-0.5">
          <span className="text-5xl sm:text-6xl font-bold">
            €{wholePart}
          </span>
          <span className="text-3xl sm:text-4xl font-bold text-white/90">
            ,{decimalPart}
          </span>
        </div>

        {/* IBAN Subtitle with Bank Building Icon */}
        <div className="flex items-center gap-1.5 text-xs text-[#8e8e93] font-mono tracking-tight mt-1">
          <Landmark size={13} className="text-[#8e8e93]" />
          <span>{formatIBAN(activeAccount.iban)}</span>
        </div>

        {/* "Accounts" Floating Capsule Pill */}
        <div className="relative mt-4">
          <button
            onClick={() => {
              triggerHaptic('light');
              setIsAccountsMenuOpen(!isAccountsMenuOpen);
            }}
            className="rounded-full bg-[#2c2c2e] hover:bg-[#3a3a3c] px-5 py-2 text-xs font-semibold text-white shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
          >
            <span>Accounts</span>
            <ChevronDown
              size={13}
              className={`text-[#8e8e93] transition-transform ${
                isAccountsMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Accounts Dropdown Menu */}
          <AnimatePresence>
            {isAccountsMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute top-10 left-1/2 -translate-x-1/2 w-64 bg-[#1c1c1e] rounded-2xl p-2 z-40 border border-white/10 shadow-2xl"
              >
                <div className="px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-[#8e8e93]">
                  Switch Account
                </div>
                <div className="space-y-1 mt-1">
                  {accounts.map((acc) => {
                    const isSelected = acc.id === activeAccount.id;
                    return (
                      <button
                        key={acc.id}
                        onClick={() => {
                          triggerHaptic('light');
                          setActiveAccountId(acc.id);
                          setIsAccountsMenuOpen(false);
                        }}
                        className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-colors ${
                          isSelected
                            ? 'bg-white/15 text-white'
                            : 'hover:bg-white/5 text-[#8e8e93] hover:text-white'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-semibold text-white">{acc.name}</p>
                          <p className="text-[10px] text-[#8e8e93] font-mono">
                            €{acc.balance.toFixed(2).replace('.', ',')}
                          </p>
                        </div>
                        {isSelected && <Check size={14} className="text-white shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 2. CIRCULAR QUICK ACTIONS (Add money, MB WAY, Move, More) */}
      <div className="grid grid-cols-4 gap-3 py-1">
        {/* Add Money */}
        <button
          onClick={() => {
            triggerHaptic('medium');
            setIsAddMoneyModalOpen(true);
          }}
          className="flex flex-col items-center gap-2 group outline-none"
        >
          <div className="w-14 h-14 rounded-full bg-[#2c2c2e] hover:bg-[#3a3a3c] text-white flex items-center justify-center transition-transform active:scale-95">
            <Plus size={22} strokeWidth={2.2} />
          </div>
          <span className="text-xs font-medium text-white tracking-tight">
            Add money
          </span>
        </button>

        {/* MB WAY */}
        <button
          onClick={() => {
            triggerHaptic('medium');
            setIsRequestModalOpen(true);
          }}
          className="flex flex-col items-center gap-2 group outline-none"
        >
          <div className="w-14 h-14 rounded-full bg-[#2c2c2e] hover:bg-[#3a3a3c] text-white flex items-center justify-center transition-transform active:scale-95 font-bold text-xs tracking-wider">
            MB
          </div>
          <span className="text-xs font-medium text-white tracking-tight">
            MB WAY
          </span>
        </button>

        {/* Move / Transfers */}
        <button
          onClick={() => {
            triggerHaptic('medium');
            setIsSendModalOpen(true);
          }}
          className="flex flex-col items-center gap-2 group outline-none"
        >
          <div className="w-14 h-14 rounded-full bg-[#2c2c2e] hover:bg-[#3a3a3c] text-white flex items-center justify-center transition-transform active:scale-95">
            <ArrowLeftRight size={20} strokeWidth={2} />
          </div>
          <span className="text-xs font-medium text-white tracking-tight">
            Move
          </span>
        </button>

        {/* More */}
        <button
          onClick={() => {
            triggerHaptic('light');
            showToast('Additional card controls & statements', 'info');
          }}
          className="flex flex-col items-center gap-2 group outline-none"
        >
          <div className="w-14 h-14 rounded-full bg-[#2c2c2e] hover:bg-[#3a3a3c] text-white flex items-center justify-center transition-transform active:scale-95">
            <MoreHorizontal size={20} strokeWidth={2} />
          </div>
          <span className="text-xs font-medium text-white tracking-tight">
            More
          </span>
        </button>
      </div>

      {/* 3. NOTICE BANNER CARD ("Avoid account limits") */}
      {!isDismissBanner && (
        <div className="rounded-[24px] bg-[#1c1c1e] p-5 space-y-4 shadow-md">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#332514] text-[#f59e0b] flex items-center justify-center shrink-0">
              <AlertTriangle size={22} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white">
                Avoid account limits
              </h3>
              <p className="text-xs text-[#8e8e93] mt-0.5 leading-relaxed">
                Update your ID documents by 27 October 2026
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              triggerHaptic('success');
              setIsDismissBanner(true);
              showToast('ID verification documents submitted', 'success');
            }}
            className="w-full py-3 rounded-full bg-white text-black font-semibold text-xs text-center hover:bg-neutral-200 active:scale-[0.99] transition-all"
          >
            Upload documents
          </button>
        </div>
      )}

      {/* 4. RECENT TRANSACTIONS CONTAINER */}
      <div className="rounded-[24px] bg-[#1c1c1e] p-4 space-y-3">
        <div className="px-1 text-xs font-bold uppercase tracking-wider text-[#8e8e93]">
          Recent Activity
        </div>

        <div className="divide-y divide-white/5">
          {filteredTransactions.slice(0, 6).map((tx) => {
            const isHostinger = tx.title.toLowerCase().includes('hostinger');
            const isApple = tx.title.toLowerCase().includes('apple');

            return (
              <div
                key={tx.id}
                onClick={() => {
                  triggerHaptic('light');
                  setSelectedTransaction(tx);
                }}
                className="py-3.5 flex items-center justify-between cursor-pointer hover:bg-white/5 rounded-2xl px-2 transition-colors"
              >
                {/* Left Icon & Details */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* Brand Icon or Category Badge */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isHostinger
                        ? 'bg-[#673de6] text-white'
                        : isApple
                        ? 'bg-[#2c2c2e] text-white'
                        : 'bg-[#2c2c2e] text-white'
                    }`}
                  >
                    {isHostinger ? 'H' : isApple ? '🍎' : tx.title.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">
                      {tx.title}
                    </p>
                    <p className="text-[11px] text-[#8e8e93] mt-0.5">
                      {new Date(tx.timestamp).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                      })}
                      ,{' '}
                      {new Date(tx.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                {/* Right Amount */}
                <div className="text-right shrink-0 ml-3">
                  <div className="text-xs font-semibold text-white tnum">
                    {tx.amount < 0 ? '-' : '+'}€{Math.abs(tx.amount).toFixed(2).replace('.', ',')}
                  </div>
                  {tx.amount < 0 && (
                    <div className="text-[10px] text-[#8e8e93] tnum mt-0.5">
                      -${(Math.abs(tx.amount) * 1.08).toFixed(2).replace('.', ',')}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
