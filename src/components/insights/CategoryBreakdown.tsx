import React from 'react';
import { useBanking } from '../../store/BankingContext';
import { formatCurrency } from '../../utils/formatters';
import { triggerHaptic } from '../../hooks/useHaptic';

interface CategorySpend {
  name: string;
  amount: number;
  color: string;
  percentage: number;
}

const CATEGORY_DATA: CategorySpend[] = [
  { name: 'Housing & Rent', amount: 1450.0, color: '#5C7CFF', percentage: 42 },
  { name: 'Technology & Gadgets', amount: 1249.0, color: '#818CF8', percentage: 28 },
  { name: 'Travel & Stays', amount: 890.0, color: '#F59E0B', percentage: 14 },
  { name: 'Groceries & Market', amount: 284.5, color: '#34D399', percentage: 8 },
  { name: 'Restaurants & Dining', amount: 185.3, color: '#EC4899', percentage: 5 },
  { name: 'Transport & Commute', amount: 94.4, color: '#06B6D4', percentage: 3 },
];

export const CategoryBreakdown: React.FC = () => {
  const { setFilter, setActiveTab, showToast } = useBanking();

  const handleCategoryClick = (catName: string) => {
    triggerHaptic('light');
    const simpleName = catName.split(' ')[0];
    setFilter((prev) => ({
      ...prev,
      category: simpleName as any,
      query: '',
    }));
    setActiveTab('home');
    showToast(`Filtering activity by ${simpleName}`, 'info');
  };

  return (
    <div className="liquid-glass rounded-3xl p-5 border border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A]">
          Top Spending Categories
        </h3>
        <span className="text-[11px] text-[#878A8E]">Tap to filter</span>
      </div>

      {/* Multi-segment Horizontal Progress Bar */}
      <div className="w-full h-3 rounded-full overflow-hidden flex bg-white/5 p-0.5">
        {CATEGORY_DATA.map((cat) => (
          <div
            key={cat.name}
            style={{
              width: `${cat.percentage}%`,
              backgroundColor: cat.color,
            }}
            className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500"
            title={`${cat.name}: ${cat.percentage}%`}
          />
        ))}
      </div>

      {/* Categories List */}
      <div className="space-y-3 pt-1">
        {CATEGORY_DATA.map((cat) => (
          <div
            key={cat.name}
            onClick={() => handleCategoryClick(cat.name)}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <div>
                <p className="text-xs font-semibold text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A]">
                  {cat.name}
                </p>
                <p className="text-[10px] text-[#878A8E]">{cat.percentage}% of monthly spend</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A] tnum">
                {formatCurrency(cat.amount, '€')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
