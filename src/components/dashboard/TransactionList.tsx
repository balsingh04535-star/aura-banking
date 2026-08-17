import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  ArrowUpRight,
  ArrowDownLeft,
  ShoppingBag,
  Car,
  Utensils,
  Laptop,
  Briefcase,
  Music,
  Home as HomeIcon,
  Zap,
  Plane,
  HeartPulse,
  Repeat,
} from 'lucide-react';
import { useBanking } from '../../store/BankingContext';
import { Transaction, TransactionCategory } from '../../types/banking';
import { formatCurrency, formatDateGroup } from '../../utils/formatters';
import { triggerHaptic } from '../../hooks/useHaptic';

const getCategoryIcon = (category: TransactionCategory) => {
  switch (category) {
    case 'Salary':
      return Briefcase;
    case 'Technology':
      return Laptop;
    case 'Entertainment':
    case 'Subscriptions':
      return Music;
    case 'Transport':
      return Car;
    case 'Groceries':
    case 'Shopping':
      return ShoppingBag;
    case 'Restaurants':
      return Utensils;
    case 'Housing':
      return HomeIcon;
    case 'Utilities':
      return Zap;
    case 'Travel':
      return Plane;
    case 'Health':
      return HeartPulse;
    case 'Transfer':
    default:
      return Repeat;
  }
};

export const TransactionList: React.FC = () => {
  const {
    filteredTransactions,
    setSelectedTransaction,
    filter,
    setFilter,
    setIsFilterSheetOpen,
  } = useBanking();

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: Transaction[] } = {};
    filteredTransactions.forEach((tx) => {
      const groupKey = formatDateGroup(tx.timestamp);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(tx);
    });
    return groups;
  }, [filteredTransactions]);

  const handleTransactionClick = (tx: Transaction) => {
    triggerHaptic('light');
    setSelectedTransaction(tx);
  };

  return (
    <div className="w-full px-5 pt-3 pb-28 select-none">
      {/* Activity Header & Search */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold tracking-tight text-white">
          Activity
        </h2>

        <button
          onClick={() => {
            triggerHaptic('light');
            setIsFilterSheetOpen(true);
          }}
          className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-all bg-[#141618] border ${
            filter.category !== 'all' || filter.type !== 'all'
              ? 'border-white text-white'
              : 'border-white/10 text-[#7E848D] hover:text-white'
          }`}
        >
          <SlidersHorizontal size={13} />
          {(filter.category !== 'all' || filter.type !== 'all') && (
            <span className="text-[10px] font-semibold">Active</span>
          )}
        </button>
      </div>

      {/* Inline Search Bar */}
      <div className="relative mb-4">
        <Search
          size={14}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7E848D]"
        />
        <input
          type="text"
          value={filter.query}
          onChange={(e) =>
            setFilter((prev) => ({ ...prev, query: e.target.value }))
          }
          placeholder="Search activity..."
          className="w-full bg-[#141618] border border-white/10 rounded-2xl pl-9 pr-4 py-2 text-xs text-white placeholder-[#7E848D] focus:outline-none focus:border-white/30 transition-colors"
        />
      </div>

      {/* Grouped Transactions Feed */}
      {Object.keys(groupedTransactions).length === 0 ? (
        <div className="bg-[#141618] rounded-2xl p-8 flex flex-col items-center justify-center text-center my-4 border border-white/10">
          <p className="text-xs font-medium text-[#7E848D]">
            No transactions found
          </p>
          {(filter.query || filter.category !== 'all') && (
            <button
              onClick={() =>
                setFilter({
                  query: '',
                  category: 'all',
                  type: 'all',
                  status: 'all',
                  dateRange: 'all',
                })
              }
              className="mt-2 text-xs text-white font-medium hover:underline"
            >
              Reset search
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedTransactions).map(([dateLabel, items]) => (
            <div key={dateLabel} className="space-y-1.5">
              {/* Date Group Label */}
              <div className="px-1 text-[10px] font-medium uppercase tracking-wider text-[#7E848D]">
                {dateLabel}
              </div>

              {/* Transactions in Group */}
              <div className="bg-[#141618] rounded-2xl overflow-hidden border border-white/10 divide-y divide-white/5">
                {items.map((tx) => {
                  const Icon = getCategoryIcon(tx.category);
                  const isIncoming = tx.amount > 0;

                  return (
                    <div
                      key={tx.id}
                      onClick={() => handleTransactionClick(tx)}
                      className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                    >
                      {/* Left: Icon & Details */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-[#1D2024] border border-white/5 flex items-center justify-center text-white/80 shrink-0">
                          <Icon size={16} strokeWidth={1.75} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-medium text-white truncate">
                            {tx.title}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-[#7E848D] truncate">
                              {tx.category}
                            </span>
                            {tx.isRecurring && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white/10 text-[#7E848D]">
                                Recurring
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Amount & Status */}
                      <div className="text-right shrink-0 ml-3">
                        <div className="text-xs font-semibold tnum text-white">
                          {isIncoming ? '+' : ''}
                          {formatCurrency(tx.amount, '€')}
                        </div>
                        <span className="text-[10px] text-[#7E848D]">
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
