import React from 'react';
import {
  Bell,
  CheckCheck,
  Shield,
  ArrowDownLeft,
  ArrowUpRight,
  Target,
  RefreshCw,
} from 'lucide-react';
import { BottomSheet } from '../common/BottomSheet';
import { GlassButton } from '../common/GlassButton';
import { useBanking } from '../../store/BankingContext';
import { BankingNotification, NotificationType } from '../../types/banking';
import { triggerHaptic } from '../../hooks/useHaptic';

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'transaction':
    case 'transfer':
      return ArrowDownLeft;
    case 'security':
      return Shield;
    case 'savings':
      return Target;
    case 'subscription':
      return RefreshCw;
    case 'system':
    default:
      return Bell;
  }
};

export const NotificationCenter: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useBanking();

  const handleNotificationClick = (notif: BankingNotification) => {
    if (!notif.read) {
      triggerHaptic('light');
      markNotificationAsRead(notif.id);
    }
  };

  return (
    <BottomSheet
      isOpen={isNotificationsOpen}
      onClose={() => setIsNotificationsOpen(false)}
      title="Notification Center"
      subtitle="Security alerts, transactions & updates"
    >
      <div className="space-y-3 pb-6">
        {/* Header Action */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-[#878A8E]">
            {notifications.filter((n) => !n.read).length} Unread
          </span>
          <button
            onClick={() => {
              triggerHaptic('light');
              markAllNotificationsAsRead();
            }}
            className="text-xs text-aura-blue font-semibold flex items-center gap-1 hover:underline"
          >
            <CheckCheck size={14} />
            <span>Mark all as read</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-2">
          {notifications.map((notif) => {
            const Icon = getNotificationIcon(notif.type);
            return (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex gap-3 ${
                  !notif.read
                    ? 'liquid-glass-elevated border-aura-blue/30 shadow-sm'
                    : 'liquid-glass border-white/5 opacity-75'
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    !notif.read
                      ? 'bg-aura-blue text-white'
                      : 'bg-white/10 text-[#878A8E]'
                  }`}
                >
                  <Icon size={16} />
                </div>

                {/* Message Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A] truncate">
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-[#878A8E] shrink-0 ml-2">
                      {notif.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-[#878A8E] mt-0.5 leading-relaxed">
                    {notif.message}
                  </p>
                </div>

                {/* Unread Blue Dot */}
                {!notif.read && (
                  <div className="w-2 h-2 rounded-full bg-aura-blue shrink-0 self-center" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </BottomSheet>
  );
};
