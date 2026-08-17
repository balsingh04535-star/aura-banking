import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ChevronDown, Check, User } from 'lucide-react';
import { useBanking } from '../../store/BankingContext';
import { formatCurrency } from '../../utils/formatters';
import { triggerHaptic } from '../../hooks/useHaptic';

export const TopHeader: React.FC = () => {
  const {
    activeAccount,
    accounts,
    setActiveAccountId,
    unreadNotificationCount,
    setIsNotificationsOpen,
    setActiveTab,
  } = useBanking();

  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsAccountDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="w-full px-5 pt-4 pb-3 flex flex-col gap-3 relative z-30 select-none">
      {/* Top Row: Minimal User Avatar + Greeting + Notifications */}
      <div className="flex items-center justify-between">
        {/* User Info & Minimal Avatar */}
        <div
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('profile');
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-[#141618] border border-white/10 flex items-center justify-center text-white/80 group-hover:border-white/25 transition-all">
            <User size={19} strokeWidth={1.75} />
          </div>

          <div>
            <span className="text-xs font-normal text-[#7E848D]">
              {getGreeting()},
            </span>
            <h1 className="text-sm font-semibold tracking-tight text-white">
              Anshdeep Singh
            </h1>
          </div>
        </div>

        {/* Notification Button */}
        <button
          onClick={() => {
            triggerHaptic('light');
            setIsNotificationsOpen(true);
          }}
          className="relative w-10 h-10 rounded-full bg-[#141618] border border-white/10 text-white/80 hover:text-white hover:border-white/25 flex items-center justify-center transition-all"
          aria-label="Open Notifications"
        >
          <Bell size={17} strokeWidth={1.75} />
          {unreadNotificationCount > 0 && (
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white" />
          )}
        </button>
      </div>

      {/* Account Selector Pill with rounded-full edges */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => {
            triggerHaptic('light');
            setIsAccountDropdownOpen(!isAccountDropdownOpen);
          }}
          className="rounded-full py-1.5 px-3.5 flex items-center gap-2 text-xs font-medium text-white bg-[#141618] border border-white/10 hover:border-white/20 transition-all active:scale-98"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
          <span className="font-medium text-white">{activeAccount.name}</span>
          <span className="text-[#7E848D] text-[11px] tnum">
            •• {activeAccount.accountNumber}
          </span>
          <ChevronDown
            size={13}
            className={`text-[#7E848D] transition-transform duration-200 ${
              isAccountDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isAccountDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute top-10 left-0 w-64 bg-[#141618] rounded-2xl p-2 z-50 border border-white/10 shadow-xl"
            >
              <div className="px-3 py-1.5 text-[10px] font-medium tracking-wider uppercase text-[#7E848D]">
                Select Account
              </div>
              <div className="space-y-1">
                {accounts.map((acc) => {
                  const isSelected = acc.id === activeAccount.id;
                  return (
                    <button
                      key={acc.id}
                      onClick={() => {
                        triggerHaptic('light');
                        setActiveAccountId(acc.id);
                        setIsAccountDropdownOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-colors ${
                        isSelected
                          ? 'bg-white/10 text-white'
                          : 'hover:bg-white/5 text-[#7E848D] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-white/60 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold">{acc.name}</p>
                          <p className="text-[10px] text-[#7E848D] tnum">
                            {formatCurrency(acc.balance, acc.currency)}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <Check size={14} className="text-white shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
