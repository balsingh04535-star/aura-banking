import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const CashFlowVisualizer: React.FC = () => {
  const income = 4950.0;
  const expenses = 2460.0;
  const netSavings = income - expenses;

  return (
    <div className="liquid-glass rounded-3xl p-5 border border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A]">
          Monthly Cash Flow
        </h3>
        <div className="flex items-center gap-1 text-[11px] text-aura-green font-semibold">
          <Wallet size={13} />
          <span>+50% Saved</span>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-1 text-[10px] text-aura-green font-semibold mb-1">
            <ArrowDownLeft size={12} />
            <span>Income</span>
          </div>
          <p className="text-xs font-bold text-white tnum">
            {formatCurrency(income, '€')}
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-1 text-[10px] text-aura-red font-semibold mb-1">
            <ArrowUpRight size={12} />
            <span>Outflow</span>
          </div>
          <p className="text-xs font-bold text-white tnum">
            {formatCurrency(expenses, '€')}
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-aura-blue/15 border border-aura-blue/20">
          <div className="flex items-center gap-1 text-[10px] text-aura-blue font-semibold mb-1">
            <Wallet size={12} />
            <span>Net Flow</span>
          </div>
          <p className="text-xs font-bold text-white tnum">
            +{formatCurrency(netSavings, '€')}
          </p>
        </div>
      </div>
    </div>
  );
};
