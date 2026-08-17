import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BankCard3D } from '../cards/BankCard3D';
import { CardControls } from '../cards/CardControls';
import { LimitsSlider } from '../cards/LimitsSlider';
import { useBanking } from '../../store/BankingContext';
import { triggerHaptic } from '../../hooks/useHaptic';

export const CardsScreen: React.FC = () => {
  const { cards } = useBanking();
  const [selectedCardId, setSelectedCardId] = useState<string>(cards[0]?.id || 'card-black');
  const [isDetailsRevealed, setIsDetailsRevealed] = useState(false);

  const activeCard = cards.find((c) => c.id === selectedCardId) || cards[0];

  const handleSelectCard = (id: string) => {
    if (id !== selectedCardId) {
      triggerHaptic('light');
      setSelectedCardId(id);
      setIsDetailsRevealed(false);
    }
  };

  return (
    <motion.div
      key="screen-cards"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="w-full px-5 pt-2 pb-28 space-y-4"
    >
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A]">
          Cards & Security
        </h2>
        <p className="text-xs text-[#878A8E] mt-0.5">
          Manage physical titanium and virtual dynamic credentials
        </p>
      </div>

      {/* Card Selector Pills */}
      <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
        {cards.map((c) => (
          <button
            key={c.id}
            onClick={() => handleSelectCard(c.id)}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
              c.id === selectedCardId
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-[#878A8E] hover:text-white'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* 3D Tilt Card Graphic */}
      <BankCard3D
        card={activeCard}
        isDetailsRevealed={isDetailsRevealed}
        onRevealClick={() => setIsDetailsRevealed(!isDetailsRevealed)}
      />

      {/* Controls & Toggles */}
      <CardControls
        card={activeCard}
        isDetailsRevealed={isDetailsRevealed}
        setIsDetailsRevealed={setIsDetailsRevealed}
      />

      {/* Spending Limits Slider */}
      <LimitsSlider card={activeCard} />
    </motion.div>
  );
};
