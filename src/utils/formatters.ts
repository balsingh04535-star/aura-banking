export const formatCurrency = (
  amount: number,
  currency: string = '€',
  options: { showPlus?: boolean; compactDecimals?: boolean } = {}
) => {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(absAmount);

  const prefix = isNegative ? '−' : options.showPlus && amount > 0 ? '+' : '';
  return `${prefix}${currency}${formattedNumber}`;
};

export const splitCurrencyParts = (amount: number, currency: string = '€') => {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(absAmount);

  const [integers, decimals] = formattedNumber.split('.');
  const prefix = isNegative ? '−' : '';

  return {
    symbol: currency,
    prefix,
    integers,
    decimals: `.${decimals}`,
    full: `${prefix}${currency}${formattedNumber}`,
  };
};

export const formatIBAN = (iban: string) => {
  const cleaned = iban.replace(/\s+/g, '').toUpperCase();
  return cleaned.replace(/(.{4})/g, '$1 ').trim();
};

export const formatCardNumber = (cardNumber: string) => {
  const cleaned = cardNumber.replace(/\s+/g, '');
  return cleaned.replace(/(.{4})/g, '$1 ').trim();
};

export const formatRelativeTime = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    const d = new Date(timestamp);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
};

export const formatDateGroup = (timestamp: number) => {
  const txDate = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (txDate.toDateString() === today.toDateString()) {
    return 'Today';
  }
  if (txDate.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  return txDate.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
};
