import React, { useState } from 'react';
import { QrCode, Copy, Check, Share2, Link as LinkIcon } from 'lucide-react';
import { BottomSheet } from '../common/BottomSheet';
import { GlassButton } from '../common/GlassButton';
import { useBanking } from '../../store/BankingContext';
import { triggerHaptic } from '../../hooks/useHaptic';

export const RequestMoneyModal: React.FC = () => {
  const { isRequestModalOpen, setIsRequestModalOpen, requestMoney, showToast } = useBanking();

  const [recipientName, setRecipientName] = useState('Alex Morgan');
  const [amount, setAmount] = useState('50');
  const [note, setNote] = useState('');
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerate = () => {
    const numAmount = parseFloat(amount) || 0;
    if (numAmount <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }
    triggerHaptic('medium');
    const link = requestMoney(recipientName, numAmount, note);
    setGeneratedLink(link);
  };

  const handleCopyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(`https://${generatedLink}`);
      setIsCopied(true);
      triggerHaptic('success');
      showToast('Payment link copied to clipboard', 'info');
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setIsRequestModalOpen(false);
    setTimeout(() => {
      setGeneratedLink(null);
      setAmount('50');
      setNote('');
      setIsCopied(false);
    }, 250);
  };

  return (
    <BottomSheet
      isOpen={isRequestModalOpen}
      onClose={handleClose}
      title={generatedLink ? 'Payment Request Ready' : 'Request Money'}
      subtitle={generatedLink ? 'Share this link or QR code' : 'Create an instant payment request'}
    >
      <div className="space-y-4 pb-4">
        {!generatedLink ? (
          <>
            <div>
              <label className="text-xs font-semibold text-[#878A8E] block mb-1">
                Requested Amount (€)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-aura-blue">
                  €
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-8 pr-4 py-3 text-lg font-bold text-white tnum focus:outline-none focus:border-aura-blue"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#878A8E] block mb-1">
                Description / Note (Optional)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Dinner split, concert tickets"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-aura-blue"
              />
            </div>

            <GlassButton
              variant="primary"
              size="lg"
              onClick={handleGenerate}
              className="w-full mt-3"
            >
              <LinkIcon size={16} />
              <span>Generate Request Link</span>
            </GlassButton>
          </>
        ) : (
          /* Link & QR Code Generated View */
          <div className="flex flex-col items-center text-center space-y-4 pt-1">
            {/* Simulated QR Code Canvas */}
            <div className="p-4 rounded-3xl bg-white text-black shadow-glass-md flex flex-col items-center justify-center">
              <div className="w-36 h-36 flex items-center justify-center border-4 border-black rounded-xl p-2 relative">
                {/* Visual SVG QR representation */}
                <div className="grid grid-cols-6 gap-1 w-full h-full p-1 bg-white">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-xs ${
                        i % 2 === 0 || i % 7 === 0 || i < 6 || i > 30 ? 'bg-black' : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold mt-2 text-black">
                €{parseFloat(amount).toFixed(2)}
              </span>
            </div>

            {/* Generated Link Display */}
            <div className="w-full liquid-glass rounded-2xl p-3 flex items-center justify-between border border-white/10 text-xs">
              <span className="font-mono text-aura-blue truncate mr-2">
                https://{generatedLink}
              </span>
              <button
                onClick={handleCopyLink}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white shrink-0"
              >
                {isCopied ? <Check size={14} className="text-aura-green" /> : <Copy size={14} />}
              </button>
            </div>

            <div className="w-full grid grid-cols-2 gap-2 pt-2">
              <GlassButton
                variant="glass"
                size="md"
                onClick={handleCopyLink}
                className="w-full"
              >
                <Copy size={14} />
                <span>{isCopied ? 'Copied' : 'Copy Link'}</span>
              </GlassButton>

              <GlassButton
                variant="primary"
                size="md"
                onClick={handleClose}
                className="w-full"
              >
                <span>Done</span>
              </GlassButton>
            </div>
          </div>
        )}
      </div>
    </BottomSheet>
  );
};
