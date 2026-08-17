import React from 'react';
import { BottomSheet } from '../common/BottomSheet';
import { GlassButton } from '../common/GlassButton';
import { useBanking } from '../../store/BankingContext';
import { TransactionCategory } from '../../types/banking';
import { triggerHaptic } from '../../hooks/useHaptic';

const CATEGORIES: TransactionCategory[] = [
  'Salary',
  'Technology',
  'Entertainment',
  'Transport',
  'Groceries',
  'Restaurants',
  'Utilities',
  'Housing',
  'Transfer',
  'Travel',
  'Subscriptions',
  'Shopping',
  'Health',
];

export const SearchFilterSheet: React.FC = () => {
  const { isFilterSheetOpen, setIsFilterSheetOpen, filter, setFilter } = useBanking();

  const handleReset = () => {
    triggerHaptic('light');
    setFilter({
      query: '',
      category: 'all',
      type: 'all',
      status: 'all',
      dateRange: 'all',
    });
  };

  const handleApply = () => {
    triggerHaptic('success');
    setIsFilterSheetOpen(false);
  };

  return (
    <BottomSheet
      isOpen={isFilterSheetOpen}
      onClose={() => setIsFilterSheetOpen(false)}
      title="Filter Transactions"
      subtitle="Refine your activity feed"
    >
      <div className="space-y-5 pb-6">
        {/* Transaction Type Filter */}
        <div>
          <label className="text-xs font-semibold text-[#878A8E] block mb-2">
            Transaction Direction
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'incoming', label: 'Incoming (+)' },
              { id: 'outgoing', label: 'Outgoing (−)' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  triggerHaptic('light');
                  setFilter((prev) => ({ ...prev, type: t.id as any }));
                }}
                className={`py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                  filter.type === t.id
                    ? 'bg-aura-blue text-white shadow-glow-blue'
                    : 'liquid-glass text-[#878A8E] hover:text-[#F7F7F5]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <label className="text-xs font-semibold text-[#878A8E] block mb-2">
            Category
          </label>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => {
                triggerHaptic('light');
                setFilter((prev) => ({ ...prev, category: 'all' }));
              }}
              className={`py-1.5 px-3 rounded-xl text-xs font-medium transition-all ${
                filter.category === 'all'
                  ? 'bg-white/20 text-white font-semibold'
                  : 'liquid-glass text-[#878A8E] hover:text-[#F7F7F5]'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  triggerHaptic('light');
                  setFilter((prev) => ({
                    ...prev,
                    category: prev.category === cat ? 'all' : cat,
                  }));
                }}
                className={`py-1.5 px-3 rounded-xl text-xs font-medium transition-all ${
                  filter.category === cat
                    ? 'bg-aura-blue text-white shadow-glow-blue'
                    : 'liquid-glass text-[#878A8E] hover:text-[#F7F7F5]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="text-xs font-semibold text-[#878A8E] block mb-2">
            Status
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'completed', label: 'Completed' },
              { id: 'pending', label: 'Pending' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  triggerHaptic('light');
                  setFilter((prev) => ({ ...prev, status: s.id as any }));
                }}
                className={`py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                  filter.status === s.id
                    ? 'bg-aura-blue text-white shadow-glow-blue'
                    : 'liquid-glass text-[#878A8E] hover:text-[#F7F7F5]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 pt-3">
          <GlassButton
            variant="ghost"
            size="md"
            onClick={handleReset}
            className="flex-1"
          >
            Reset
          </GlassButton>
          <GlassButton
            variant="primary"
            size="md"
            onClick={handleApply}
            className="flex-1"
          >
            Apply Filters
          </GlassButton>
        </div>
      </div>
    </BottomSheet>
  );
};
