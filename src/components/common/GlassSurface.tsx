import React, { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import clsx from 'clsx';

interface GlassSurfaceProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  variant?: 'base' | 'elevated' | 'pill' | 'subtle';
  className?: string;
  glow?: boolean;
}

export const GlassSurface: React.FC<GlassSurfaceProps> = ({
  children,
  variant = 'base',
  className,
  glow = false,
  ...props
}) => {
  const variantClass = {
    base: 'liquid-glass rounded-2xl md:rounded-3xl',
    elevated: 'liquid-glass-elevated rounded-3xl',
    pill: 'liquid-glass-pill rounded-full',
    subtle: 'bg-[#111315]/60 dark:bg-[#111315]/60 light:bg-white/70 backdrop-blur-md border border-white/5 rounded-2xl',
  }[variant];

  return (
    <motion.div
      className={clsx(
        variantClass,
        glow && 'shadow-glow-blue border-aura-blue/30',
        'relative overflow-hidden transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
