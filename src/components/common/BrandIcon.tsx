import React from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Repeat,
  ShoppingBag,
  Car,
  Utensils,
  Laptop,
  Briefcase,
  Zap,
  Plane,
  HeartPulse,
  CreditCard,
  Building,
} from 'lucide-react';

interface BrandIconProps {
  title: string;
  category?: string;
  className?: string;
  size?: number;
}

export const BrandIcon: React.FC<BrandIconProps> = ({
  title,
  category,
  className = 'w-10 h-10',
  size = 20,
}) => {
  const lowerTitle = title.toLowerCase();

  // 1. Apple
  if (lowerTitle.includes('apple') || lowerTitle.includes('app store') || lowerTitle.includes('apple pay')) {
    return (
      <div className={`${className} rounded-full bg-[#1c1c1e] text-white flex items-center justify-center shrink-0 border border-white/10`}>
        <svg width={size} height={size} viewBox="0 0 170 170" fill="currentColor">
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.65-7.74-11.87-14.11-6.19-9.35-11.1-20.17-14.73-32.48-3.63-12.31-5.45-23.75-5.45-34.33 0-14.24 3.69-25.77 11.08-34.59 7.39-8.82 16.59-13.35 27.6-13.59 4.89 0 10.33 1.25 16.32 3.75 5.99 2.5 9.78 3.81 11.38 3.93 1.31-.12 5.37-1.5 12.18-4.14 6.81-2.64 12.56-3.8 17.25-3.48 13.59.87 24.25 6.09 31.98 15.66-11.96 7.29-17.83 17.29-17.61 30 0 10.22 3.92 18.92 11.75 26.1 3.92 3.69 8.48 6.3 13.69 7.83-2.72 8.05-6.19 16.42-10.43 25.12zM119.22 33.56c0-7.39 2.61-14.24 7.83-20.55 5.22-6.31 11.74-10.66 19.57-13.01.22 1.41.33 2.72.33 3.91 0 7.39-2.72 14.46-8.16 21.21-5.44 6.74-12.07 10.87-19.89 12.4-.22-1.3-.33-2.61-.33-3.96z" />
        </svg>
      </div>
    );
  }

  // 2. Spotify
  if (lowerTitle.includes('spotify')) {
    return (
      <div className={`${className} rounded-full bg-[#1db954] text-black flex items-center justify-center shrink-0 shadow-sm`}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.49 17.306c-.215.353-.674.466-1.027.251-2.812-1.718-6.353-2.107-10.523-1.155-.404.092-.807-.16-.9-.564-.092-.404.16-.807.564-.9 4.568-1.044 8.482-.603 11.635 1.341.353.215.466.674.251 1.027zm1.464-3.255c-.27.44-.848.58-1.288.31-3.22-1.979-8.128-2.551-11.936-1.395-.494.15-1.02-.132-1.17-.626-.15-.494.132-1.02.626-1.17 4.354-1.321 9.774-.682 13.458 1.583.44.27.58.848.31 1.298zm.126-3.395c-3.86-2.292-10.228-2.503-13.904-1.388-.592.18-1.22-.158-1.4-.75-.18-.592.158-1.22.75-1.4 4.225-1.283 11.258-1.037 15.688 1.593.532.316.706 1.008.39 1.54-.316.532-1.008.706-1.54.39z" />
        </svg>
      </div>
    );
  }

  // 3. Netflix
  if (lowerTitle.includes('netflix')) {
    return (
      <div className={`${className} rounded-full bg-[#141414] text-[#e50914] flex items-center justify-center shrink-0 border border-white/10`}>
        <span className="font-extrabold text-sm tracking-tighter">N</span>
      </div>
    );
  }

  // 4. Hostinger
  if (lowerTitle.includes('hostinger')) {
    return (
      <div className={`${className} rounded-full bg-[#673de6] text-white flex items-center justify-center shrink-0 font-extrabold text-xs`}>
        H
      </div>
    );
  }

  // 5. Amazon / AWS
  if (lowerTitle.includes('amazon') || lowerTitle.includes('aws')) {
    return (
      <div className={`${className} rounded-full bg-[#232f3e] text-[#ff9900] flex items-center justify-center shrink-0 font-bold text-xs`}>
        a
      </div>
    );
  }

  // 6. Uber
  if (lowerTitle.includes('uber')) {
    return (
      <div className={`${className} rounded-full bg-black text-white border border-white/20 flex items-center justify-center shrink-0 font-bold text-xs`}>
        Uber
      </div>
    );
  }

  // 7. Figma
  if (lowerTitle.includes('figma')) {
    return (
      <div className={`${className} rounded-full bg-[#1e1e1e] flex items-center justify-center shrink-0 border border-white/10`}>
        <div className="w-3.5 h-3.5 rounded-full bg-[#f24e1e]" />
      </div>
    );
  }

  // 8. Transfers / Top-ups / MB WAY
  if (lowerTitle.includes('transfer') || lowerTitle.includes('sent to') || lowerTitle.includes('wire')) {
    return (
      <div className={`${className} rounded-full bg-[#1c1c1e] text-white flex items-center justify-center shrink-0 border border-white/10`}>
        <ArrowUpRight size={size} strokeWidth={2} />
      </div>
    );
  }

  if (lowerTitle.includes('top-up') || lowerTitle.includes('deposit') || lowerTitle.includes('received') || lowerTitle.includes('salary')) {
    return (
      <div className={`${className} rounded-full bg-[#1c1c1e] text-white flex items-center justify-center shrink-0 border border-white/10`}>
        <ArrowDownLeft size={size} strokeWidth={2} />
      </div>
    );
  }

  // 9. Categories
  if (category === 'Salary') {
    return (
      <div className={`${className} rounded-full bg-[#1c1c1e] text-white flex items-center justify-center shrink-0 border border-white/10`}>
        <Briefcase size={size} strokeWidth={1.8} />
      </div>
    );
  }
  if (category === 'Technology') {
    return (
      <div className={`${className} rounded-full bg-[#1c1c1e] text-white flex items-center justify-center shrink-0 border border-white/10`}>
        <Laptop size={size} strokeWidth={1.8} />
      </div>
    );
  }
  if (category === 'Transport') {
    return (
      <div className={`${className} rounded-full bg-[#1c1c1e] text-white flex items-center justify-center shrink-0 border border-white/10`}>
        <Car size={size} strokeWidth={1.8} />
      </div>
    );
  }
  if (category === 'Groceries' || category === 'Shopping') {
    return (
      <div className={`${className} rounded-full bg-[#1c1c1e] text-white flex items-center justify-center shrink-0 border border-white/10`}>
        <ShoppingBag size={size} strokeWidth={1.8} />
      </div>
    );
  }
  if (category === 'Restaurants') {
    return (
      <div className={`${className} rounded-full bg-[#1c1c1e] text-white flex items-center justify-center shrink-0 border border-white/10`}>
        <Utensils size={size} strokeWidth={1.8} />
      </div>
    );
  }

  // Fallback Clean Monogram
  const initials = title
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`${className} rounded-full bg-[#2c2c2e] text-white flex items-center justify-center shrink-0 font-bold text-xs border border-white/5`}>
      {initials || 'TR'}
    </div>
  );
};
