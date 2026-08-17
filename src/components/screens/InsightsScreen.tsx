import React from 'react';
import { motion } from 'framer-motion';
import { SpendingChart } from '../insights/SpendingChart';
import { CategoryBreakdown } from '../insights/CategoryBreakdown';
import { CashFlowVisualizer } from '../insights/CashFlowVisualizer';

export const InsightsScreen: React.FC = () => {
  return (
    <motion.div
      key="screen-insights"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="w-full px-5 pt-2 pb-28 space-y-4"
    >
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A]">
          Financial Insights
        </h2>
        <p className="text-xs text-[#878A8E] mt-0.5">
          Real-time analytics, spend categories, and cash flow
        </p>
      </div>

      {/* Hero Interactive SVG Chart */}
      <SpendingChart />

      {/* Cash Flow */}
      <CashFlowVisualizer />

      {/* Category Breakdown */}
      <CategoryBreakdown />
    </motion.div>
  );
};
