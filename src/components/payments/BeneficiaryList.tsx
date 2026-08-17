import React, { useState } from 'react';
import {
  UserPlus,
  Star,
  Trash2,
  Send,
  Search,
  Check,
  Building,
  Globe,
} from 'lucide-react';
import { BottomSheet } from '../common/BottomSheet';
import { GlassButton } from '../common/GlassButton';
import { useBanking } from '../../store/BankingContext';
import { Beneficiary } from '../../types/banking';
import { formatIBAN } from '../../utils/formatters';
import { triggerHaptic } from '../../hooks/useHaptic';

export const BeneficiaryList: React.FC = () => {
  const {
    beneficiaries,
    addBeneficiary,
    toggleFavoriteBeneficiary,
    deleteBeneficiary,
    setPrefilledRecipient,
    setIsSendModalOpen,
    isAddBeneficiaryOpen,
    setIsAddBeneficiaryOpen,
    showToast,
  } = useBanking();

  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [iban, setIban] = useState('');
  const [bank, setBank] = useState('');
  const [country, setCountry] = useState('European Union');

  const filtered = beneficiaries.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.iban.toLowerCase().includes(search.toLowerCase()) ||
      b.bank.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !iban.trim()) {
      showToast('Please provide a name and valid IBAN', 'error');
      return;
    }

    addBeneficiary({
      name: name.trim(),
      iban: iban.trim(),
      bank: bank.trim() || 'SEPA Bank',
      country: country.trim() || 'Europe',
      isFavorite: false,
    });

    setName('');
    setIban('');
    setBank('');
    setIsAddBeneficiaryOpen(false);
    triggerHaptic('success');
  };

  const handleSendTo = (ben: Beneficiary) => {
    triggerHaptic('medium');
    setPrefilledRecipient(ben);
    setIsSendModalOpen(true);
  };

  return (
    <div className="space-y-3">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A]">
          Saved Beneficiaries
        </h3>
        <button
          onClick={() => {
            triggerHaptic('light');
            setIsAddBeneficiaryOpen(true);
          }}
          className="p-1.5 px-3 rounded-xl liquid-glass text-xs font-semibold text-aura-blue flex items-center gap-1.5 hover:bg-white/10"
        >
          <UserPlus size={13} />
          <span>Add New</span>
        </button>
      </div>

      {/* Inline Search */}
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#878A8E]"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter beneficiaries..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#878A8E] focus:outline-none focus:border-aura-blue"
        />
      </div>

      {/* Beneficiaries List */}
      <div className="space-y-2">
        {filtered.map((ben) => (
          <div
            key={ben.id}
            className="p-3.5 rounded-2xl liquid-glass border border-white/5 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 flex items-center justify-center font-bold text-sm text-white shrink-0">
                {ben.avatarUrl ? (
                  <img
                    src={ben.avatarUrl}
                    alt={ben.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  ben.name.charAt(0)
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-semibold text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A]">
                    {ben.name}
                  </h4>
                  <button
                    onClick={() => {
                      triggerHaptic('light');
                      toggleFavoriteBeneficiary(ben.id);
                    }}
                    className="text-[#878A8E] hover:text-amber-400 transition-colors"
                  >
                    <Star
                      size={12}
                      className={ben.isFavorite ? 'text-amber-400 fill-amber-400' : ''}
                    />
                  </button>
                </div>
                <p className="text-[10px] text-[#878A8E] font-mono mt-0.5">
                  {formatIBAN(ben.iban).slice(0, 18)}...
                </p>
                <p className="text-[9px] text-[#878A8E]">{ben.bank}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleSendTo(ben)}
                className="p-2 rounded-xl bg-aura-blue/20 text-aura-blue hover:bg-aura-blue hover:text-white transition-colors"
                title="Send Money"
              >
                <Send size={13} />
              </button>

              <button
                onClick={() => {
                  triggerHaptic('light');
                  deleteBeneficiary(ben.id);
                }}
                className="p-2 rounded-xl text-[#878A8E] hover:text-aura-red hover:bg-aura-red/10 transition-colors"
                title="Delete"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Beneficiary Sheet */}
      <BottomSheet
        isOpen={isAddBeneficiaryOpen}
        onClose={() => setIsAddBeneficiaryOpen(false)}
        title="Add Beneficiary"
        subtitle="Save account for fast future transfers"
      >
        <form onSubmit={handleAddNew} className="space-y-3 pb-4">
          <div>
            <label className="text-xs text-[#878A8E] block mb-1">Full Legal Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Elena Rostova"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-aura-blue"
            />
          </div>

          <div>
            <label className="text-xs text-[#878A8E] block mb-1">IBAN</label>
            <input
              type="text"
              required
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              placeholder="DE89 3704 0044 0532 0130 00"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-aura-blue"
            />
          </div>

          <div>
            <label className="text-xs text-[#878A8E] block mb-1">Bank Name</label>
            <input
              type="text"
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              placeholder="e.g. Deutsche Bank"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-aura-blue"
            />
          </div>

          <div>
            <label className="text-xs text-[#878A8E] block mb-1">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g. Germany"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-aura-blue"
            />
          </div>

          <GlassButton
            variant="primary"
            size="lg"
            type="submit"
            className="w-full mt-3"
          >
            <span>Save Beneficiary</span>
          </GlassButton>
        </form>
      </BottomSheet>
    </div>
  );
};
