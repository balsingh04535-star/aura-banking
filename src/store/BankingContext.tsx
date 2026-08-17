import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Account,
  BankCard,
  Beneficiary,
  SavingsGoal,
  SubscriptionItem,
  ScheduledPayment,
  BankingNotification,
  SecurityDevice,
  Transaction,
  ActiveTab,
  TransactionFilter,
} from '../types/banking';
import {
  INITIAL_ACCOUNTS,
  INITIAL_CARDS,
  INITIAL_BENEFICIARIES,
  INITIAL_SAVINGS_GOALS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_SCHEDULED_PAYMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_DEVICES,
  INITIAL_TRANSACTIONS,
} from './mockData';

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface BankingContextType {
  // Navigation & UI
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeAccountId: string;
  setActiveAccountId: (id: string) => void;
  activeAccount: Account;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: () => void;
  isOnboarded: boolean;
  setIsOnboarded: (val: boolean) => void;
  
  // Data Entities
  accounts: Account[];
  transactions: Transaction[];
  cards: BankCard[];
  beneficiaries: Beneficiary[];
  savingsGoals: SavingsGoal[];
  subscriptions: SubscriptionItem[];
  scheduledPayments: ScheduledPayment[];
  notifications: BankingNotification[];
  devices: SecurityDevice[];
  unreadNotificationCount: number;

  // Selected for Sheets & Modals
  selectedTransaction: Transaction | null;
  setSelectedTransaction: (tx: Transaction | null) => void;
  isSendModalOpen: boolean;
  setIsSendModalOpen: (open: boolean) => void;
  isRequestModalOpen: boolean;
  setIsRequestModalOpen: (open: boolean) => void;
  isAddMoneyModalOpen: boolean;
  setIsAddMoneyModalOpen: (open: boolean) => void;
  isFilterSheetOpen: boolean;
  setIsFilterSheetOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isStatementsOpen: boolean;
  setIsStatementsOpen: (open: boolean) => void;
  isSupportOpen: boolean;
  setIsSupportOpen: (open: boolean) => void;
  isAddBeneficiaryOpen: boolean;
  setIsAddBeneficiaryOpen: (open: boolean) => void;
  prefilledRecipient: Beneficiary | null;
  setPrefilledRecipient: (ben: Beneficiary | null) => void;

  // Filters
  filter: TransactionFilter;
  setFilter: React.Dispatch<React.SetStateAction<TransactionFilter>>;
  filteredTransactions: Transaction[];

  // Actions
  sendMoney: (
    recipient: { name: string; iban: string; avatarUrl?: string },
    amount: number,
    sourceAccountId: string,
    note?: string
  ) => Promise<boolean>;
  requestMoney: (recipientName: string, amount: number, note?: string) => string;
  addMoney: (amount: number, targetAccountId: string, method: string) => void;
  toggleCardFreeze: (cardId: string) => void;
  updateCardLimits: (
    cardId: string,
    limits: { dailyLimit?: number; atmLimit?: number; onlineLimit?: number }
  ) => void;
  toggleCardFeature: (
    cardId: string,
    feature: 'contactlessEnabled' | 'onlineEnabled' | 'atmEnabled' | 'internationalEnabled'
  ) => void;
  addBeneficiary: (ben: Omit<Beneficiary, 'id'>) => void;
  toggleFavoriteBeneficiary: (id: string) => void;
  deleteBeneficiary: (id: string) => void;
  addFundsToSavingsGoal: (goalId: string, amount: number, sourceAccountId: string) => boolean;
  withdrawFromSavingsGoal: (goalId: string, amount: number, targetAccountId: string) => boolean;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  removeSecurityDevice: (id: string) => void;
  cancelScheduledPayment: (id: string) => void;
  toggleSubscription: (id: string) => void;
  resetAllDemoData: () => void;
}

const BankingContext = createContext<BankingContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'AURA_BANKING_STATE_V1';

export const BankingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from LocalStorage if available
  const savedState = useMemo(() => {
    try {
      const item = localStorage.getItem(LOCAL_STORAGE_KEY);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }, []);

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [activeAccountId, setActiveAccountId] = useState<string>(
    savedState?.activeAccountId || 'acc-personal'
  );
  const [accounts, setAccounts] = useState<Account[]>(
    savedState?.accounts || INITIAL_ACCOUNTS
  );
  const [transactions, setTransactions] = useState<Transaction[]>(
    savedState?.transactions || INITIAL_TRANSACTIONS
  );
  const [cards, setCards] = useState<BankCard[]>(
    savedState?.cards || INITIAL_CARDS
  );
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(
    savedState?.beneficiaries || INITIAL_BENEFICIARIES
  );
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(
    savedState?.savingsGoals || INITIAL_SAVINGS_GOALS
  );
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>(
    savedState?.subscriptions || INITIAL_SUBSCRIPTIONS
  );
  const [scheduledPayments, setScheduledPayments] = useState<ScheduledPayment[]>(
    savedState?.scheduledPayments || INITIAL_SCHEDULED_PAYMENTS
  );
  const [notifications, setNotifications] = useState<BankingNotification[]>(
    savedState?.notifications || INITIAL_NOTIFICATIONS
  );
  const [devices, setDevices] = useState<SecurityDevice[]>(
    savedState?.devices || INITIAL_DEVICES
  );
  const [theme, setThemeState] = useState<'dark' | 'light'>(
    savedState?.theme || 'dark'
  );
  const [isOnboarded, setIsOnboarded] = useState<boolean>(
    savedState?.isOnboarded !== undefined ? savedState.isOnboarded : true
  );

  // Modals & Sheets
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isStatementsOpen, setIsStatementsOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isAddBeneficiaryOpen, setIsAddBeneficiaryOpen] = useState(false);
  const [prefilledRecipient, setPrefilledRecipient] = useState<Beneficiary | null>(null);

  // Toast
  const [toast, setToast] = useState<ToastState | null>(null);

  // Filters
  const [filter, setFilter] = useState<TransactionFilter>({
    query: '',
    category: 'all',
    type: 'all',
    status: 'all',
    dateRange: 'all',
  });

  // Sync theme to DOM
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  // Persist State
  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          activeAccountId,
          accounts,
          transactions,
          cards,
          beneficiaries,
          savingsGoals,
          subscriptions,
          scheduledPayments,
          notifications,
          devices,
          theme,
          isOnboarded,
        })
      );
    } catch {
      // ignore storage quota error
    }
  }, [
    activeAccountId,
    accounts,
    transactions,
    cards,
    beneficiaries,
    savingsGoals,
    subscriptions,
    scheduledPayments,
    notifications,
    devices,
    theme,
    isOnboarded,
  ]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 3500);
  };

  const dismissToast = () => setToast(null);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
  };

  const activeAccount = useMemo(() => {
    return accounts.find((a) => a.id === activeAccountId) || accounts[0];
  }, [accounts, activeAccountId]);

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // Filtered transactions computation
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Account isolation for specific account views if filtered
      if (activeAccountId && tx.accountId !== activeAccountId && filter.category === 'all' && !filter.query) {
        // When searching, search all accounts, otherwise show active account transactions
        if (filter.query.trim() === '') {
          return tx.accountId === activeAccountId;
        }
      }

      if (filter.query.trim() !== '') {
        const q = filter.query.toLowerCase();
        const matches =
          tx.title.toLowerCase().includes(q) ||
          tx.merchant.toLowerCase().includes(q) ||
          tx.category.toLowerCase().includes(q) ||
          (tx.note && tx.note.toLowerCase().includes(q)) ||
          Math.abs(tx.amount).toString().includes(q);
        if (!matches) return false;
      }

      if (filter.category !== 'all' && tx.category !== filter.category) {
        return false;
      }

      if (filter.type !== 'all' && tx.type !== filter.type) {
        return false;
      }

      if (filter.status !== 'all' && tx.status !== filter.status) {
        return false;
      }

      if (filter.minAmount !== undefined && Math.abs(tx.amount) < filter.minAmount) {
        return false;
      }

      if (filter.maxAmount !== undefined && Math.abs(tx.amount) > filter.maxAmount) {
        return false;
      }

      return true;
    });
  }, [transactions, activeAccountId, filter]);

  // Action: Send Money
  const sendMoney = async (
    recipient: { name: string; iban: string; avatarUrl?: string },
    amount: number,
    sourceAccountId: string,
    note?: string
  ): Promise<boolean> => {
    const src = accounts.find((a) => a.id === sourceAccountId);
    if (!src || src.balance < amount) {
      showToast('Insufficient funds in selected account', 'error');
      return false;
    }

    const now = Date.now();
    const newTx: Transaction = {
      id: `tx-${now}`,
      accountId: sourceAccountId,
      title: `Transfer to ${recipient.name}`,
      merchant: recipient.name,
      category: 'Transfer',
      amount: -amount,
      type: 'outgoing',
      date: 'Just now',
      timestamp: now,
      status: 'completed',
      paymentMethod: 'Instant SEPA Transfer',
      recipientIban: recipient.iban,
      note: note || 'Personal Transfer',
      referenceId: `AUR-TX-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10 + Math.random() * 90)}`,
    };

    // Deduct balance
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === sourceAccountId
          ? { ...acc, balance: Number((acc.balance - amount).toFixed(2)) }
          : acc
      )
    );

    // Prepend transaction
    setTransactions((prev) => [newTx, ...prev]);

    // Dispatch notification
    const newNotif: BankingNotification = {
      id: `notif-${now}`,
      title: 'Transfer Sent',
      message: `€${amount.toFixed(2)} sent instantly to ${recipient.name}. Reference: ${newTx.referenceId}`,
      timestamp: 'Just now',
      read: false,
      type: 'transfer',
      amount: -amount,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`€${amount.toFixed(2)} sent to ${recipient.name}`, 'success');
    return true;
  };

  // Action: Request Money
  const requestMoney = (recipientName: string, amount: number, note?: string) => {
    const now = Date.now();
    const payLink = `aura.app/pay/alex/${amount}`;
    
    const newNotif: BankingNotification = {
      id: `notif-${now}`,
      title: 'Payment Request Generated',
      message: `Payment request of €${amount.toFixed(2)} created for ${recipientName}. Share link: ${payLink}`,
      timestamp: 'Just now',
      read: false,
      type: 'system',
      amount,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast(`Payment request link created: ${payLink}`, 'success');
    return payLink;
  };

  // Action: Add Money
  const addMoney = (amount: number, targetAccountId: string, method: string) => {
    const now = Date.now();
    const newTx: Transaction = {
      id: `tx-${now}`,
      accountId: targetAccountId,
      title: `Top-up via ${method}`,
      merchant: 'Aura Instant Deposit',
      category: 'Salary',
      amount: amount,
      type: 'incoming',
      date: 'Just now',
      timestamp: now,
      status: 'completed',
      paymentMethod: method,
      note: 'Account Top-Up',
      referenceId: `AUR-TOP-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === targetAccountId
          ? { ...acc, balance: Number((acc.balance + amount).toFixed(2)) }
          : acc
      )
    );

    setTransactions((prev) => [newTx, ...prev]);

    const newNotif: BankingNotification = {
      id: `notif-${now}`,
      title: 'Funds Added Successfully',
      message: `€${amount.toFixed(2)} loaded via ${method} into your account.`,
      timestamp: 'Just now',
      read: false,
      type: 'transaction',
      amount,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`€${amount.toFixed(2)} added to ${activeAccount.name}`, 'success');
  };

  // Action: Toggle Card Freeze
  const toggleCardFreeze = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          const nextState = !c.isFrozen;
          showToast(
            nextState ? `${c.name} is now frozen` : `${c.name} unfrozen & active`,
            nextState ? 'info' : 'success'
          );
          return { ...c, isFrozen: nextState };
        }
        return c;
      })
    );
  };

  // Action: Update Card Limits
  const updateCardLimits = (
    cardId: string,
    limits: { dailyLimit?: number; atmLimit?: number; onlineLimit?: number }
  ) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          return {
            ...c,
            dailyLimit: limits.dailyLimit !== undefined ? limits.dailyLimit : c.dailyLimit,
            atmLimit: limits.atmLimit !== undefined ? limits.atmLimit : c.atmLimit,
            onlineLimit: limits.onlineLimit !== undefined ? limits.onlineLimit : c.onlineLimit,
          };
        }
        return c;
      })
    );
    showToast('Card spending limits updated', 'success');
  };

  // Action: Toggle Card Feature
  const toggleCardFeature = (
    cardId: string,
    feature: 'contactlessEnabled' | 'onlineEnabled' | 'atmEnabled' | 'internationalEnabled'
  ) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          const nextVal = !c[feature];
          return { ...c, [feature]: nextVal };
        }
        return c;
      })
    );
  };

  // Action: Beneficiary CRUD
  const addBeneficiary = (ben: Omit<Beneficiary, 'id'>) => {
    const newBen: Beneficiary = {
      ...ben,
      id: `ben-${Date.now()}`,
    };
    setBeneficiaries((prev) => [newBen, ...prev]);
    showToast(`Added ${ben.name} to beneficiaries`, 'success');
  };

  const toggleFavoriteBeneficiary = (id: string) => {
    setBeneficiaries((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isFavorite: !b.isFavorite } : b))
    );
  };

  const deleteBeneficiary = (id: string) => {
    setBeneficiaries((prev) => prev.filter((b) => b.id !== id));
    showToast('Beneficiary removed', 'info');
  };

  // Action: Savings Goal Add/Withdraw
  const addFundsToSavingsGoal = (
    goalId: string,
    amount: number,
    sourceAccountId: string
  ): boolean => {
    const src = accounts.find((a) => a.id === sourceAccountId);
    if (!src || src.balance < amount) {
      showToast('Insufficient funds in selected account', 'error');
      return false;
    }

    // Deduct source account, add to savings account
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === sourceAccountId) {
          return { ...acc, balance: Number((acc.balance - amount).toFixed(2)) };
        }
        if (acc.id === 'acc-savings') {
          return { ...acc, balance: Number((acc.balance + amount).toFixed(2)) };
        }
        return acc;
      })
    );

    // Update goal amount
    setSavingsGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? { ...g, currentAmount: Number((g.currentAmount + amount).toFixed(2)) }
          : g
      )
    );

    const now = Date.now();
    const newTx: Transaction = {
      id: `tx-${now}`,
      accountId: sourceAccountId,
      title: 'Allocation to Vault',
      merchant: 'House Deposit Vault',
      category: 'Transfer',
      amount: -amount,
      type: 'outgoing',
      date: 'Just now',
      timestamp: now,
      status: 'completed',
      paymentMethod: 'Internal Vault Transfer',
      note: 'Savings allocation',
      referenceId: `AUR-VLT-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setTransactions((prev) => [newTx, ...prev]);

    showToast(`€${amount.toFixed(2)} transferred to Vault`, 'success');
    return true;
  };

  const withdrawFromSavingsGoal = (
    goalId: string,
    amount: number,
    targetAccountId: string
  ): boolean => {
    const goal = savingsGoals.find((g) => g.id === goalId);
    if (!goal || goal.currentAmount < amount) {
      showToast('Insufficient balance in Vault', 'error');
      return false;
    }

    // Deduct savings, credit target
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === 'acc-savings') {
          return { ...acc, balance: Number((acc.balance - amount).toFixed(2)) };
        }
        if (acc.id === targetAccountId) {
          return { ...acc, balance: Number((acc.balance + amount).toFixed(2)) };
        }
        return acc;
      })
    );

    setSavingsGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? { ...g, currentAmount: Number((g.currentAmount - amount).toFixed(2)) }
          : g
      )
    );

    const now = Date.now();
    const newTx: Transaction = {
      id: `tx-${now}`,
      accountId: targetAccountId,
      title: 'Withdrawal from Vault',
      merchant: 'House Deposit Vault',
      category: 'Transfer',
      amount: amount,
      type: 'incoming',
      date: 'Just now',
      timestamp: now,
      status: 'completed',
      paymentMethod: 'Internal Vault Transfer',
      note: 'Vault withdrawal',
      referenceId: `AUR-VLT-W-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setTransactions((prev) => [newTx, ...prev]);

    showToast(`€${amount.toFixed(2)} withdrawn to ${activeAccount.name}`, 'success');
    return true;
  };

  // Action: Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  // Action: Security Devices
  const removeSecurityDevice = (id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
    showToast('Device session revoked', 'info');
  };

  // Action: Scheduled & Subscriptions
  const cancelScheduledPayment = (id: string) => {
    setScheduledPayments((prev) => prev.filter((p) => p.id !== id));
    showToast('Scheduled payment cancelled', 'info');
  };

  const toggleSubscription = (id: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const next = !s.isActive;
          showToast(
            next ? `${s.merchant} resumed` : `${s.merchant} direct debit paused`,
            'info'
          );
          return { ...s, isActive: next };
        }
        return s;
      })
    );
  };

  const resetAllDemoData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setAccounts(INITIAL_ACCOUNTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setCards(INITIAL_CARDS);
    setBeneficiaries(INITIAL_BENEFICIARIES);
    setSavingsGoals(INITIAL_SAVINGS_GOALS);
    setSubscriptions(INITIAL_SUBSCRIPTIONS);
    setScheduledPayments(INITIAL_SCHEDULED_PAYMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setDevices(INITIAL_DEVICES);
    setActiveAccountId('acc-personal');
    setThemeState('dark');
    showToast('Demo data reset to factory initial state', 'info');
  };

  return (
    <BankingContext.Provider
      value={{
        activeTab,
        setActiveTab,
        activeAccountId,
        setActiveAccountId,
        activeAccount,
        theme,
        toggleTheme,
        setTheme,
        toast,
        showToast,
        dismissToast,
        isOnboarded,
        setIsOnboarded,

        accounts,
        transactions,
        cards,
        beneficiaries,
        savingsGoals,
        subscriptions,
        scheduledPayments,
        notifications,
        devices,
        unreadNotificationCount,

        selectedTransaction,
        setSelectedTransaction,
        isSendModalOpen,
        setIsSendModalOpen,
        isRequestModalOpen,
        setIsRequestModalOpen,
        isAddMoneyModalOpen,
        setIsAddMoneyModalOpen,
        isFilterSheetOpen,
        setIsFilterSheetOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isStatementsOpen,
        setIsStatementsOpen,
        isSupportOpen,
        setIsSupportOpen,
        isAddBeneficiaryOpen,
        setIsAddBeneficiaryOpen,
        prefilledRecipient,
        setPrefilledRecipient,

        filter,
        setFilter,
        filteredTransactions,

        sendMoney,
        requestMoney,
        addMoney,
        toggleCardFreeze,
        updateCardLimits,
        toggleCardFeature,
        addBeneficiary,
        toggleFavoriteBeneficiary,
        deleteBeneficiary,
        addFundsToSavingsGoal,
        withdrawFromSavingsGoal,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        removeSecurityDevice,
        cancelScheduledPayment,
        toggleSubscription,
        resetAllDemoData,
      }}
    >
      {children}
    </BankingContext.Provider>
  );
};

export const useBanking = () => {
  const context = useContext(BankingContext);
  if (!context) {
    throw new Error('useBanking must be used within a BankingProvider');
  }
  return context;
};
