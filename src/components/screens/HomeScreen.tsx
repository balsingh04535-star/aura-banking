import React from 'react';
import { motion } from 'framer-motion';
import { AccountCarousel } from '../dashboard/AccountCarousel';
import { QuickActions } from '../dashboard/QuickActions';
import { TransactionList } from '../dashboard/TransactionList';

export const HomeScreen: React.FC = () => {
  return (
    <motion.div
      key="screen-home"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="w-full flex flex-col"
    >
      <AccountCarousel />
      <QuickActions />
      <TransactionList />
    </motion.div>
  );
};
