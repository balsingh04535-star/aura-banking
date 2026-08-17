import React, { useState } from 'react';
import {
  Download,
  Share2,
  Repeat,
  AlertCircle,
  CheckCircle2,
  Calendar,
  CreditCard,
  MapPin,
  FileText,
  Clock,
  Split,
  Edit2,
  Check,
} from 'lucide-react';
import { BottomSheet } from '../common/BottomSheet';
import { GlassButton } from '../common/GlassButton';
import { useBanking } from '../../store/BankingContext';
import { formatCurrency, formatIBAN } from '../../utils/formatters';
import { triggerHaptic } from '../../hooks/useHaptic';

export const TransactionDetailSheet: React.FC = () => {
  const {
    selectedTransaction,
    setSelectedTransaction,
    setIsSendModalOpen,
    setPrefilledRecipient,
    beneficiaries,
    showToast,
  } = useBanking();

  const [note, setNote] = useState(selectedTransaction?.note || '');
  const [isEditingNote, setIsEditingNote] = useState(false);

  if (!selectedTransaction) return null;

  const isIncoming = selectedTransaction.amount > 0;

  const handleDownloadReceipt = () => {
    triggerHaptic('success');
    showToast('Receipt downloaded to device', 'success');
  };

  const handleRepeatTransfer = () => {
    // Find matching beneficiary or create fallback
    const matchingBen = beneficiaries.find(
      (b) =>
        b.name.toLowerCase() === selectedTransaction.merchant.toLowerCase() ||
        b.name.toLowerCase() === selectedTransaction.title.toLowerCase()
    );

    if (matchingBen) {
      setPrefilledRecipient(matchingBen);
    } else {
      setPrefilledRecipient({
        id: 'ben-temp',
        name: selectedTransaction.merchant || selectedTransaction.title,
        iban: selectedTransaction.recipientIban || 'PT50 0035 0123 4567 8901 2345 6',
        bank: 'SEPA Bank',
        country: 'Europe',
        isFavorite: false,
      });
    }

    setSelectedTransaction(null);
    setIsSendModalOpen(true);
  };

  const handleSplitBill = () => {
    triggerHaptic('light');
    showToast('Split bill link created and copied', 'info');
  };

  return (
    <BottomSheet
      isOpen={!!selectedTransaction}
      onClose={() => setSelectedTransaction(null)}
      title="Transaction Details"
    >
      <div className="flex flex-col items-center pt-2 pb-6 text-center">
        {/* Merchant Avatar / Category */}
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold mb-3 ${
            isIncoming
              ? 'bg-aura-green/20 text-aura-green border border-aura-green/30'
              : 'liquid-glass text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A] border border-white/10'
          }`}
        >
          {selectedTransaction.merchant.charAt(0)}
        </div>

        {/* Merchant Name */}
        <h3 className="text-lg font-bold text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A]">
          {selectedTransaction.title}
        </h3>
        <p className="text-xs text-[#878A8E] mt-0.5">
          {selectedTransaction.merchant}
        </p>

        {/* Large Amount */}
        <div
          className={`text-3xl font-extrabold tnum mt-3 mb-1 ${
            isIncoming
              ? 'text-aura-green'
              : 'text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A]'
          }`}
        >
          {isIncoming ? '+' : ''}
          {formatCurrency(selectedTransaction.amount, '€')}
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#878A8E] mb-6">
          <CheckCircle2 size={13} className="text-aura-green" />
          <span className="capitalize">{selectedTransaction.status}</span>
        </div>

        {/* Transaction Metadata Grid */}
        <div className="w-full liquid-glass rounded-2xl p-4 border border-white/5 text-left space-y-3.5 mb-6 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#878A8E]">
              <Calendar size={14} />
              <span>Date & Time</span>
            </div>
            <span className="font-semibold text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A] tnum">
              {new Date(selectedTransaction.timestamp).toLocaleString('en-GB', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#878A8E]">
              <CreditCard size={14} />
              <span>Payment Method</span>
            </div>
            <span className="font-semibold text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A]">
              {selectedTransaction.paymentMethod}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#878A8E]">
              <FileText size={14} />
              <span>Category</span>
            </div>
            <span className="font-semibold text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A]">
              {selectedTransaction.category}
            </span>
          </div>

          {selectedTransaction.location && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#878A8E]">
                <MapPin size={14} />
                <span>Location</span>
              </div>
              <span className="font-semibold text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A]">
                {selectedTransaction.location}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#878A8E]">
              <Clock size={14} />
              <span>Reference ID</span>
            </div>
            <span className="font-mono text-[10px] text-[#878A8E]">
              {selectedTransaction.referenceId || 'AUR-TX-8921-00'}
            </span>
          </div>

          {/* Note Section */}
          <div className="pt-2 border-t border-white/5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[#878A8E]">Note</span>
              {!isEditingNote ? (
                <button
                  onClick={() => setIsEditingNote(true)}
                  className="text-aura-blue flex items-center gap-1 text-[11px]"
                >
                  <Edit2 size={11} />
                  <span>Edit</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsEditingNote(false);
                    showToast('Note updated', 'info');
                  }}
                  className="text-aura-green flex items-center gap-1 text-[11px]"
                >
                  <Check size={11} />
                  <span>Save</span>
                </button>
              )}
            </div>

            {isEditingNote ? (
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-aura-blue"
              />
            ) : (
              <p className="text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A] italic">
                "{note || selectedTransaction.note || 'No note added'}"
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="w-full grid grid-cols-2 gap-2.5">
          <GlassButton
            variant="glass"
            size="md"
            onClick={handleDownloadReceipt}
            className="w-full"
          >
            <Download size={15} />
            <span>Receipt</span>
          </GlassButton>

          <GlassButton
            variant="glass"
            size="md"
            onClick={handleSplitBill}
            className="w-full"
          >
            <Split size={15} />
            <span>Split Bill</span>
          </GlassButton>

          {!isIncoming && (
            <GlassButton
              variant="primary"
              size="md"
              onClick={handleRepeatTransfer}
              className="w-full col-span-2"
            >
              <Repeat size={15} />
              <span>Repeat Transfer</span>
            </GlassButton>
          )}

          <button
            onClick={() => {
              triggerHaptic('light');
              showToast('Dispute reported to Aura fraud prevention', 'info');
            }}
            className="col-span-2 text-[11px] text-[#878A8E] hover:text-aura-red flex items-center justify-center gap-1.5 py-2 transition-colors"
          >
            <AlertCircle size={13} />
            <span>Report a problem with this transaction</span>
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};
