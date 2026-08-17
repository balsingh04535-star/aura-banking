import React, { useState } from 'react';
import {
  Snowflake,
  Eye,
  EyeOff,
  KeyRound,
  Globe,
  Radio,
  Landmark,
} from 'lucide-react';
import { BiometricModal } from '../common/BiometricModal';
import { useBanking } from '../../store/BankingContext';
import { BankCard } from '../../types/banking';
import { triggerHaptic } from '../../hooks/useHaptic';

interface CardControlsProps {
  card: BankCard;
  isDetailsRevealed: boolean;
  setIsDetailsRevealed: (revealed: boolean) => void;
}

export const CardControls: React.FC<CardControlsProps> = ({
  card,
  isDetailsRevealed,
  setIsDetailsRevealed,
}) => {
  const { toggleCardFreeze, toggleCardFeature, showToast } = useBanking();
  const [showBiometricForReveal, setShowBiometricForReveal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);

  const handleFreezeToggle = () => {
    triggerHaptic('medium');
    toggleCardFreeze(card.id);
  };

  const handleRevealClick = () => {
    if (isDetailsRevealed) {
      setIsDetailsRevealed(false);
      showToast('Card details masked', 'info');
    } else {
      setShowBiometricForReveal(true);
    }
  };

  const handleBiometricSuccess = () => {
    setShowBiometricForReveal(false);
    setIsDetailsRevealed(true);
    triggerHaptic('success');
    showToast('Card numbers revealed (auto-masks in 15s)', 'info');

    setTimeout(() => {
      setIsDetailsRevealed(false);
    }, 15000);
  };

  const features = [
    {
      id: 'onlineEnabled' as const,
      label: 'Online Payments',
      sub: 'E-commerce & web checkouts',
      icon: Globe,
      enabled: card.onlineEnabled,
    },
    {
      id: 'contactlessEnabled' as const,
      label: 'Contactless Tap',
      sub: 'NFC terminal payments',
      icon: Radio,
      enabled: card.contactlessEnabled,
    },
    {
      id: 'atmEnabled' as const,
      label: 'ATM Withdrawals',
      sub: 'Cash dispensing machines',
      icon: Landmark,
      enabled: card.atmEnabled,
    },
    {
      id: 'internationalEnabled' as const,
      label: 'International Usage',
      sub: 'Cross-border & currency conversion',
      icon: Globe,
      enabled: card.internationalEnabled,
    },
  ];

  return (
    <div className="space-y-3 select-none">
      {/* Primary Actions Dock */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={handleFreezeToggle}
          className={`py-3 px-2 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-xs font-medium border transition-all ${
            card.isFrozen
              ? 'bg-white text-black border-white'
              : 'bg-[#141618] text-white border-white/10 hover:border-white/20'
          }`}
        >
          <Snowflake size={16} strokeWidth={1.8} />
          <span>{card.isFrozen ? 'Unfreeze' : 'Freeze Card'}</span>
        </button>

        <button
          onClick={handleRevealClick}
          className="py-3 px-2 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-xs font-medium bg-[#141618] text-white border border-white/10 hover:border-white/20 transition-all"
        >
          {isDetailsRevealed ? (
            <EyeOff size={16} strokeWidth={1.8} />
          ) : (
            <Eye size={16} strokeWidth={1.8} />
          )}
          <span>{isDetailsRevealed ? 'Mask Info' : 'Reveal Info'}</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('light');
            setShowPinModal(true);
          }}
          className="py-3 px-2 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-xs font-medium bg-[#141618] text-white border border-white/10 hover:border-white/20 transition-all"
        >
          <KeyRound size={16} strokeWidth={1.8} />
          <span>View PIN</span>
        </button>
      </div>

      {/* Security Feature Toggles */}
      <div className="bg-[#141618] rounded-2xl p-4 border border-white/10 space-y-3">
        <h4 className="text-[10px] font-medium uppercase tracking-wider text-[#7E848D]">
          Controls & Permissions
        </h4>

        <div className="space-y-2.5">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className="flex items-center justify-between py-1"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#1D2024] flex items-center justify-center text-white/80">
                    <Icon size={15} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white">
                      {feat.label}
                    </p>
                    <p className="text-[10px] text-[#7E848D]">{feat.sub}</p>
                  </div>
                </div>

                {/* Minimal Toggle Switch */}
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    toggleCardFeature(card.id, feat.id);
                  }}
                  className={`w-10 h-5 rounded-full transition-colors relative p-0.5 outline-none ${
                    feat.enabled ? 'bg-white' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full transition-transform ${
                      feat.enabled ? 'translate-x-5 bg-black' : 'translate-x-0 bg-white/60'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Biometric Scan for Sensitive Card Details Reveal */}
      <BiometricModal
        isOpen={showBiometricForReveal}
        onSuccess={handleBiometricSuccess}
        onCancel={() => setShowBiometricForReveal(false)}
        title="Authenticate Identity"
        subtitle="Confirm biometric to decrypt CVV and 16-digit card number"
      />

      {/* PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="w-full max-w-xs bg-[#141618] rounded-3xl p-6 border border-white/15 text-center">
            <h3 className="text-sm font-semibold text-white">Card PIN</h3>
            <p className="text-xs text-[#7E848D] mt-1 mb-4">
              Use this code at physical terminals and ATMs.
            </p>

            <div className="bg-[#0B0C0E] rounded-2xl py-4 mb-4 border border-white/10">
              <span className="text-3xl font-mono font-bold tracking-[0.3em] text-white">
                {card.pin}
              </span>
            </div>

            <button
              onClick={() => setShowPinModal(false)}
              className="w-full py-2.5 rounded-xl bg-white text-black font-semibold text-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
