import React from 'react';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';
import { splitCurrencyParts } from '../../utils/formatters';

interface AnimatedCounterProps {
  value: number;
  currency?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showDecimals?: boolean;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  currency = '€',
  className = '',
  size = 'hero',
  showDecimals = true,
}) => {
  const animatedValue = useAnimatedCounter(value, 600);
  const { symbol, prefix, integers, decimals } = splitCurrencyParts(animatedValue, currency);

  const sizeClasses = {
    sm: 'text-lg tracking-tight font-semibold',
    md: 'text-2xl tracking-tight font-semibold',
    lg: 'text-3xl tracking-tight font-bold',
    hero: 'text-4xl sm:text-[44px] md:text-5xl font-extrabold tracking-tight',
  }[size];

  const decimalSizeClasses = {
    sm: 'text-xs opacity-70 font-medium',
    md: 'text-sm opacity-70 font-medium',
    lg: 'text-lg opacity-70 font-medium',
    hero: 'text-2xl sm:text-3xl opacity-60 font-semibold',
  }[size];

  return (
    <div className={`inline-flex items-baseline font-sans tnum select-none ${className}`}>
      <span className={`${sizeClasses} text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A]`}>
        {prefix}
        {symbol}
        {integers}
      </span>
      {showDecimals && (
        <span className={`${decimalSizeClasses} text-[#878A8E] dark:text-[#878A8E] light:text-[#64748B] ml-0.5`}>
          {decimals}
        </span>
      )}
    </div>
  );
};
