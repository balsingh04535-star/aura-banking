export type AccountType = 'personal' | 'savings' | 'travel';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  iban: string;
  accountNumber: string;
  color: string;
  monthlyDelta: number;
  isDefault?: boolean;
}

export type TransactionCategory = 
  | 'Salary'
  | 'Technology'
  | 'Entertainment'
  | 'Transport'
  | 'Groceries'
  | 'Restaurants'
  | 'Utilities'
  | 'Housing'
  | 'Transfer'
  | 'Travel'
  | 'Subscriptions'
  | 'Shopping'
  | 'Health'
  | 'Other';

export type TransactionType = 'incoming' | 'outgoing' | 'transfer';
export type TransactionStatus = 'completed' | 'pending' | 'declined';

export interface Transaction {
  id: string;
  accountId: string;
  title: string;
  merchant: string;
  category: TransactionCategory;
  amount: number; // negative for outgoing, positive for incoming
  type: TransactionType;
  date: string; // ISO String or human readable
  timestamp: number; // for sorting
  status: TransactionStatus;
  paymentMethod: string;
  cardLast4?: string;
  location?: string;
  note?: string;
  isRecurring?: boolean;
  recipientIban?: string;
  splitWith?: string[];
  referenceId?: string;
}

export type CardTier = 'black' | 'virtual';

export interface BankCard {
  id: string;
  accountId: string;
  name: string;
  cardholder: string;
  numberMasked: string;
  fullNumber: string;
  cvv: string;
  expiry: string;
  tier: CardTier;
  isFrozen: boolean;
  dailyLimit: number;
  currentDailySpent: number;
  atmLimit: number;
  onlineLimit: number;
  contactlessEnabled: boolean;
  onlineEnabled: boolean;
  atmEnabled: boolean;
  internationalEnabled: boolean;
  pin: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  iban: string;
  bank: string;
  country: string;
  nickname?: string;
  avatarUrl?: string;
  isFavorite: boolean;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  category: string;
  autoSavePercent?: number;
  color?: string;
}

export interface SubscriptionItem {
  id: string;
  merchant: string;
  category: TransactionCategory;
  amount: number;
  frequency: 'Monthly' | 'Yearly';
  nextBillingDate: string;
  isActive: boolean;
  logoInitial: string;
}

export interface ScheduledPayment {
  id: string;
  title: string;
  recipientName: string;
  recipientIban: string;
  amount: number;
  executionDate: string;
  frequency: 'Once' | 'Monthly' | 'Weekly';
  accountId: string;
  status: 'active' | 'paused' | 'completed';
}

export type NotificationType = 'transaction' | 'transfer' | 'security' | 'savings' | 'subscription' | 'system';

export interface BankingNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: NotificationType;
  amount?: number;
}

export interface SecurityDevice {
  id: string;
  name: string;
  type: 'phone' | 'laptop' | 'tablet';
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export type ActiveTab = 'home' | 'payments' | 'cards' | 'insights' | 'profile';

export interface TransactionFilter {
  query: string;
  category: string | 'all';
  type: 'all' | 'incoming' | 'outgoing';
  status: 'all' | 'completed' | 'pending' | 'declined';
  dateRange: 'all' | 'this_month' | 'last_month' | 'last_90_days';
  minAmount?: number;
  maxAmount?: number;
}
