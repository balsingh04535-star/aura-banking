import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  Check,
  Share2,
  Repeat,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { BottomSheet } from '../common/BottomSheet';
import { GlassButton } from '../common/GlassButton';
import { BiometricModal } from '../common/BiometricModal';
import { ProcessingOrb } from '../common/ProcessingOrb';
import { useBanking } from '../../store/BankingContext';
import { Beneficiary, Account } from '../../types/banking';
import { formatCurrency, formatIBAN } from '../../utils/formatters';
import { triggerHaptic } from '../../hooks/useHaptic';

type Step = 'recipient' | 'amount' | 'review' | 'processing' | 'success';

export const SendMoneyModal: React.FC = () => {
  const {
    isSendModalOpen,
    setIsSendModalOpen,
    accounts,
    activeAccount,
    beneficiaries,
    sendMoney,
    prefilledRecipient,
    setPrefilledRecipient,
    showToast,
  } = useBanking();

  const [step, setStep] = useState<Step>('recipient');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<Beneficiary | null>(null);
  const [amountStr, setAmountStr] = useState<string>('250');
  const [sourceAccountId, setSourceAccountId] = useState<string>(activeAccount.id);
  const [note, setNote] = useState<string>('');
  const [showBiometrics, setShowBiometrics] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Custom new beneficiary input state
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customIban, setCustomIban] = useState('');

  // Handle prefilled recipient from other screens
  useEffect(() => {
    if (prefilledRecipient && isSendModalOpen) {
      setSelectedRecipient(prefilledRecipient);
      setStep('amount');
    }
  }, [prefilledRecipient, isSendModalOpen]);

  // Reset modal state on close
  const handleClose = () => {
    setIsSendModalOpen(false);
    setTimeout(() => {
      setStep('recipient');
      setSelectedRecipient(null);
      setPrefilledRecipient(null);
      setAmountStr('250');
      setNote('');
      setIsAddingCustom(false);
      setShowBiometrics(false);
      setIsProcessing(false);
    }, 300);
  };

  const currentSource = accounts.find((a) => a.id === sourceAccountId) || activeAccount;
  const parsedAmount = parseFloat(amountStr) || 0;

  const filteredBeneficiaries = beneficiaries.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.iban.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Keypad Handlers
  const handleKeypadPress = (val: string) => {
    triggerHaptic('light');
    if (val === 'backspace') {
      setAmountStr((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
      return;
    }
    if (val === '.') {
      if (!amountStr.includes('.')) {
        setAmountStr((prev) => `${prev}.`);
      }
      return;
    }
    if (amountStr === '0') {
      setAmountStr(val);
    } else if (amountStr.length < 7) {
      setAmountStr((prev) => `${prev}${val}`);
    }
  };

  const handleSelectRecipient = (ben: Beneficiary) => {
    triggerHaptic('light');
    setSelectedRecipient(ben);
    setStep('amount');
  };

  const handleAddCustomRecipient = () => {
    if (!customName.trim() || !customIban.trim()) {
      showToast('Please enter both name and valid IBAN', 'error');
      return;
    }
    const newBen: Beneficiary = {
      id: `ben-${Date.now()}`,
      name: customName.trim(),
      iban: customIban.trim(),
      bank: 'SEPA Direct Bank',
      country: 'European Union',
      isFavorite: false,
    };
    setSelectedRecipient(newBen);
    setIsAddingCustom(false);
    setStep('amount');
  };

  const handleProceedToReview = () => {
    if (parsedAmount <= 0) {
      showToast('Please enter an amount greater than €0', 'error');
      return;
    }
    if (parsedAmount > currentSource.balance) {
      showToast('Amount exceeds available balance', 'error');
      return;
    }
    triggerHaptic('medium');
    setStep('review');
  };

  const handleStartAuthentication = () => {
    setShowBiometrics(true);
  };

  const handleBiometricSuccess = () => {
    setShowBiometrics(false);
    setStep('processing');
    setIsProcessing(true);

    // Simulate authentic processing sequence 800ms
    setTimeout(async () => {
      if (selectedRecipient) {
        await sendMoney(
          {
            name: selectedRecipient.name,
            iban: selectedRecipient.iban,
            avatarUrl: selectedRecipient.avatarUrl,
          },
          parsedAmount,
          sourceAccountId,
          note
        );
      }
      setIsProcessing(false);
      setStep('success');
      triggerHaptic('success');
    }, 900);
  };

  return (
    <>
      <BottomSheet
        isOpen={isSendModalOpen && !showBiometrics}
        onClose={handleClose}
        title={
          step === 'recipient'
            ? 'Send Money'
            : step === 'amount'
            ? `Send to ${selectedRecipient?.name}`
            : step === 'review'
            ? 'Review Transfer'
            : step === 'processing'
            ? 'Authorizing Transfer'
            : 'Payment Sent'
        }
      >
        <div className="min-h-[380px] flex flex-col justify-between pb-4">
          <AnimatePresence mode="wait">
            {/* STEP 1: CHOOSE RECIPIENT */}
            {step === 'recipient' && (
              <motion.div
                key="step-recipient"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                {!isAddingCustom ? (
                  <>
                    {/* Search */}
                    <div className="relative">
                      <Search
                        size={15}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#878A8E]"
                      />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search contact or IBAN..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#878A8E] focus:outline-none focus:border-aura-blue"
                      />
                    </div>

                    {/* New Beneficiary Action */}
                    <button
                      onClick={() => setIsAddingCustom(true)}
                      className="w-full p-3 rounded-2xl liquid-glass border border-dashed border-white/20 flex items-center justify-center gap-2 text-xs font-semibold text-aura-blue hover:bg-white/5 transition-colors"
                    >
                      <UserPlus size={16} />
                      <span>New Beneficiary / Bank Transfer</span>
                    </button>

                    {/* Recipient List */}
                    <div className="space-y-1.5 max-h-[260px] overflow-y-auto no-scrollbar">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#878A8E] px-1">
                        Recent & Favourites
                      </span>
                      {filteredBeneficiaries.map((ben) => (
                        <div
                          key={ben.id}
                          onClick={() => handleSelectRecipient(ben)}
                          className="p-2.5 rounded-xl liquid-glass border border-white/5 hover:border-white/15 flex items-center justify-between cursor-pointer transition-colors"
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
                              <p className="text-xs font-semibold text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A]">
                                {ben.name}
                              </p>
                              <p className="text-[10px] text-[#878A8E] font-mono">
                                {formatIBAN(ben.iban).slice(0, 18)}...
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] text-[#878A8E]">{ben.bank}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  /* Add Custom Recipient Form */
                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="text-xs text-[#878A8E] block mb-1">
                        Recipient Full Name
                      </label>
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="e.g. Marcus Aurelius"
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-aura-blue"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#878A8E] block mb-1">
                        IBAN / Account Number
                      </label>
                      <input
                        type="text"
                        value={customIban}
                        onChange={(e) => setCustomIban(e.target.value)}
                        placeholder="PT50 0000 0000 0000 0000 0"
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-aura-blue"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <GlassButton
                        variant="ghost"
                        size="md"
                        onClick={() => setIsAddingCustom(false)}
                        className="flex-1"
                      >
                        Cancel
                      </GlassButton>
                      <GlassButton
                        variant="primary"
                        size="md"
                        onClick={handleAddCustomRecipient}
                        className="flex-1"
                      >
                        Continue
                      </GlassButton>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 2: ENTER AMOUNT */}
            {step === 'amount' && selectedRecipient && (
              <motion.div
                key="step-amount"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex flex-col items-center justify-between"
              >
                {/* Source Account Selector */}
                <div className="w-full mb-3 flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <span className="text-[#878A8E]">From:</span>
                  <select
                    value={sourceAccountId}
                    onChange={(e) => setSourceAccountId(e.target.value)}
                    className="bg-transparent text-white font-semibold outline-none cursor-pointer text-xs"
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id} className="bg-[#111315] text-white">
                        {acc.name} ({formatCurrency(acc.balance, acc.currency)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Big Currency Display */}
                <div className="my-2 flex flex-col items-center">
                  <div className="text-4xl sm:text-5xl font-extrabold text-white tnum flex items-center">
                    <span className="text-aura-blue mr-1">€</span>
                    <span>{amountStr}</span>
                  </div>
                  <span className="text-xs text-[#878A8E] mt-1">
                    Available: {formatCurrency(currentSource.balance, currentSource.currency)}
                  </span>
                </div>

                {/* Optional Note */}
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a payment reference or note..."
                  className="w-full text-center bg-transparent border-b border-white/10 py-1.5 text-xs text-white placeholder-[#878A8E] focus:outline-none focus:border-aura-blue my-2"
                />

                {/* Keypad Grid */}
                <div className="w-full max-w-[280px] grid grid-cols-3 gap-2 my-2">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'].map(
                    (key) => (
                      <button
                        key={key}
                        onClick={() => handleKeypadPress(key)}
                        className="h-11 rounded-2xl liquid-glass text-sm font-semibold text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A] active:scale-95 transition-all flex items-center justify-center"
                      >
                        {key === 'backspace' ? '⌫' : key}
                      </button>
                    )
                  )}
                </div>

                {/* Continue Button */}
                <GlassButton
                  variant="primary"
                  size="lg"
                  onClick={handleProceedToReview}
                  className="w-full mt-2"
                >
                  <span>Review Transfer</span>
                  <ArrowRight size={16} />
                </GlassButton>
              </motion.div>
            )}

            {/* STEP 3: REVIEW TRANSFER */}
            {step === 'review' && selectedRecipient && (
              <motion.div
                key="step-review"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                {/* Summary Card */}
                <div className="liquid-glass rounded-2xl p-4 border border-white/10 space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <span className="text-[#878A8E]">To</span>
                    <div className="text-right">
                      <p className="font-semibold text-white">{selectedRecipient.name}</p>
                      <p className="text-[10px] text-[#878A8E] font-mono">
                        {formatIBAN(selectedRecipient.iban)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <span className="text-[#878A8E]">From</span>
                    <span className="font-semibold text-white">
                      {currentSource.name} (••{currentSource.accountNumber})
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <span className="text-[#878A8E]">Transfer Amount</span>
                    <span className="text-base font-bold text-white tnum">
                      €{parsedAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <span className="text-[#878A8E]">Transfer Fee</span>
                    <span className="text-aura-green font-semibold">€0.00 (Instant)</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#878A8E]">Arrival</span>
                    <span className="font-semibold text-white">Instant SEPA</span>
                  </div>
                </div>

                {/* Authentication trigger */}
                <div className="pt-2">
                  <GlassButton
                    variant="primary"
                    size="lg"
                    onClick={handleStartAuthentication}
                    className="w-full"
                  >
                    <ShieldCheck size={18} />
                    <span>Authorize & Send €{parsedAmount.toFixed(2)}</span>
                  </GlassButton>
                </div>
              </motion.div>
            )}

            {/* STEP 4: PROCESSING STATE */}
            {step === 'processing' && (
              <motion.div
                key="step-processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <ProcessingOrb status="processing" />
                <h3 className="text-base font-semibold text-white mt-2">
                  Processing Instant Payment
                </h3>
                <p className="text-xs text-[#878A8E] mt-1">
                  Connecting to SEPA clearing engine...
                </p>
              </motion.div>
            )}

            {/* STEP 5: SUCCESS STATE */}
            {step === 'success' && selectedRecipient && (
              <motion.div
                key="step-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-4"
              >
                <ProcessingOrb status="success" />

                <h3 className="text-xl font-bold text-white mt-1">
                  €{parsedAmount.toFixed(2)} Sent
                </h3>
                <p className="text-xs text-[#878A8E] mt-1 mb-6">
                  Funds transferred immediately to {selectedRecipient.name}.
                </p>

                <div className="w-full grid grid-cols-2 gap-2.5">
                  <GlassButton
                    variant="glass"
                    size="md"
                    onClick={() => {
                      showToast('Receipt copied and ready to share', 'info');
                    }}
                    className="w-full"
                  >
                    <Share2 size={15} />
                    <span>Share Receipt</span>
                  </GlassButton>

                  <GlassButton
                    variant="glass"
                    size="md"
                    onClick={() => {
                      setStep('amount');
                    }}
                    className="w-full"
                  >
                    <Repeat size={15} />
                    <span>Send Again</span>
                  </GlassButton>

                  <GlassButton
                    variant="primary"
                    size="lg"
                    onClick={handleClose}
                    className="w-full col-span-2 mt-2"
                  >
                    <span>Done</span>
                  </GlassButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </BottomSheet>

      {/* Biometric Scanning Overlay */}
      <BiometricModal
        isOpen={showBiometrics}
        onSuccess={handleBiometricSuccess}
        onCancel={() => setShowBiometrics(false)}
        title="Authorize Transfer"
        subtitle={`Confirm €${parsedAmount.toFixed(2)} to ${selectedRecipient?.name}`}
      />
    </>
  );
};
