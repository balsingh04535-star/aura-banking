import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { BankCard } from '../../types/banking';
import { formatCardNumber } from '../../utils/formatters';

interface BankCard3DProps {
  card: BankCard;
  isDetailsRevealed?: boolean;
  onRevealClick?: () => void;
}

export const BankCard3D: React.FC<BankCard3DProps> = ({
  card,
  isDetailsRevealed = false,
  onRevealClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  const isBlack = card.tier === 'black';
  const cardSvgSrc = isBlack ? '/cards/card-black.svg' : '/cards/card-virtual.svg';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Max tilt 10 degrees for elegant restraint
    const rotX = -((y - centerY) / centerY) * 10;
    const rotY = ((x - centerX) / centerX) * 10;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePosition({ x: 50, y: 50 });
  };

  return (
    <div
      style={{ perspective: 1000 }}
      className="w-full flex justify-center py-3 select-none"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX,
          rotateY,
          scale: card.isFrozen ? 0.98 : 1,
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        style={{ transformStyle: 'preserve-3d' }}
        className={`relative w-full max-w-[340px] h-[215px] rounded-[24px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)] border border-white/15 transition-all duration-500 cursor-pointer ${
          card.isFrozen ? 'grayscale brightness-90' : ''
        }`}
      >
        {/* Custom High-Res Card SVG Artwork for ANSHDEEP SINGH */}
        <img
          src={cardSvgSrc}
          alt={card.name}
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        />

        {/* Dynamic Specular Light Glare following pointer */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.28) 0%, transparent 65%)`,
          }}
        />

        {/* Sensitive Details Overlay (Number & CVV when revealed) */}
        {isDetailsRevealed && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-md z-15 flex flex-col justify-between p-6 transition-all">
            <div className="flex items-center justify-between text-white/70 text-xs">
              <span className="font-mono uppercase tracking-widest text-aura-blue font-bold">
                Credential Reveal
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white font-mono">
                Auto-hide 15s
              </span>
            </div>

            <div className="my-auto text-center space-y-1">
              <p className="text-[10px] text-white/50 uppercase tracking-wider font-mono">
                Full Card Number
              </p>
              <p className="text-lg sm:text-xl font-mono tracking-widest text-white font-bold">
                {formatCardNumber(card.fullNumber)}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-white/90 pt-2 border-t border-white/10">
              <div>
                <span className="text-[9px] text-white/50 block">CARDHOLDER</span>
                <span className="font-semibold text-white uppercase">{card.cardholder}</span>
              </div>
              <div>
                <span className="text-[9px] text-white/50 block">EXPIRES</span>
                <span className="font-semibold text-white">{card.expiry}</span>
              </div>
              <div>
                <span className="text-[9px] text-white/50 block">CVV</span>
                <span className="font-semibold text-aura-green">{card.cvv}</span>
              </div>
            </div>
          </div>
        )}

        {/* SIGNATURE FROST FREEZE ANIMATION LAYER */}
        <motion.div
          initial={false}
          animate={{
            opacity: card.isFrozen ? 1 : 0,
            x: card.isFrozen ? 0 : '100%',
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 frost-layer rounded-[24px] z-25 flex flex-col items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: card.isFrozen ? 1 : 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
            className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl"
          >
            <Lock size={22} className="text-white" />
          </motion.div>
          <span className="text-xs font-bold tracking-wider uppercase text-white drop-shadow-md mt-2">
            Card Frozen
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
};
