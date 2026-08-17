import React, { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import clsx from 'clsx';
import { triggerHaptic } from '../../hooks/useHaptic';

interface GlassButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'glass' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  variant = 'glass',
  size = 'md',
  className,
  disabled,
  isLoading,
  onClick,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;
    triggerHaptic('light');
    if (onClick) onClick(e);
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-xl font-medium tracking-wide',
    md: 'px-4 py-2.5 text-xs rounded-2xl font-semibold tracking-tight',
    lg: 'px-6 py-3.5 text-sm rounded-2xl font-semibold tracking-tight',
    icon: 'p-2.5 rounded-full flex items-center justify-center',
  }[size];

  const variantClasses = {
    primary:
      'bg-white text-black font-semibold hover:bg-neutral-200 active:bg-neutral-300',
    secondary:
      'bg-[#1D2024] text-white border border-white/10 hover:border-white/20',
    glass:
      'bg-[#141618] text-white border border-white/10 hover:border-white/20 active:bg-[#1D2024]',
    ghost:
      'bg-transparent text-[#7E848D] hover:text-white hover:bg-white/5 active:bg-white/10',
    danger:
      'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20',
  }[variant];

  return (
    <motion.button
      whileTap={!disabled && !isLoading ? { scale: 0.97 } : undefined}
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={clsx(
        'relative select-none inline-flex items-center justify-center gap-2 cursor-pointer transition-colors duration-150',
        sizeClasses,
        variantClasses,
        disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </motion.button>
  );
};
