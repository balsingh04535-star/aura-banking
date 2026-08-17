import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  UserPlus,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Share2,
  Repeat,
  ChevronDown,
  Delete,
} from 'lucide-react';
import { BiometricModal } from '../common/BiometricModal';
import { ProcessingOrb } from '../common/ProcessingOrb';
import { useBanking } from '../../store/BankingContext';
import { Beneficiary } from '../../types/banking';
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

  // Custom new beneficiary state
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customIban, setCustomIban] = useState('');

  useEffect(() => {
    if (prefilledRecipient && isSendModalOpen) {
      setSelectedRecipient(prefilledRecipient);
      setStep('amount');
    }
  }, [prefilledRecipient, isSendModalOpen]);

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
    }, 250);
  };

  const currentSource = accounts.find((a) => a.id === sourceAccountId) || activeAccount;
  const parsedAmount = parseFloat(amountStr) || 0;

  const filteredBeneficiaries = beneficiaries.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.iban.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    }, 850);
  };

  if (!isSendModalOpen) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed inset-0 z-50 bg-[#0B0C0E] text-white flex flex-col justify-between p-5 sm:p-6 overflow-y-auto select-none"
        >
          {/* Top Header Bar */}
          <div className="flex items-center justify-between w-full max-w-md mx-auto pt-2">
            {step === 'amount' && (
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setStep('recipient');
                }}
                className="w-10 h-10 rounded-full bg-[#141618] border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            {step === 'review' && (
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setStep('amount');
                }}
                className="w-10 h-10 rounded-full bg-[#141618] border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            {(step === 'recipient' || step === 'processing' || step === 'success') && (
              <div className="w-10 h-10" />
            )}

            <div className="text-center">
              <h2 className="text-sm font-semibold tracking-tight text-white">
                {step === 'recipient' && 'Select Recipient'}
                {step === 'amount' && `Send to ${selectedRecipient?.name}`}
                {step === 'review' && 'Confirm Payment'}
                {step === 'processing' && 'Authorizing'}
                {step === 'success' && 'Payment Sent'}
              </h2>
            </div>

            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-full bg-[#141618] border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Main Body Flow */}
          <div className="flex-1 w-full max-w-md mx-auto flex flex-col justify-center my-auto py-3">
            <AnimatePresence mode="wait">
              {/* STEP 1: SELECT RECIPIENT */}
              {step === 'recipient' && (
                <motion.div
                  key="step-recipient"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="w-full space-y-4"
                >
                  {!isAddingCustom ? (
                    <>
                      {/* Search */}
                      <div className="relative">
                        <Search
                          size={15}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7E848D]"
                        />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search contact or IBAN..."
                          className="w-full bg-[#141618] border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-[#7E848D] focus:outline-none focus:border-white/30"
                        />
                      </div>

                      {/* New Beneficiary Action */}
                      <button
                        onClick={() => setIsAddingCustom(true)}
                        className="w-full p-3 rounded-2xl bg-[#141618] border border-dashed border-white/15 flex items-center justify-center gap-2 text-xs font-medium text-white hover:border-white/30 transition-colors"
                      >
                        <UserPlus size={15} />
                        <span>Add New Recipient</span>
                      </button>

                      {/* Beneficiaries List */}
                      <div className="space-y-1.5 max-h-[380px] overflow-y-auto no-scrollbar pt-1">
                        <span className="text-[10px] font-medium uppercase tracking-wider text-[#7E848D] px-1">
                          Recent Contacts
                        </span>
                        {filteredBeneficiaries.map((ben) => (
                          <div
                            key={ben.id}
                            onClick={() => handleSelectRecipient(ben)}
                            className="p-3 rounded-2xl bg-[#141618] border border-white/5 hover:border-white/15 flex items-center justify-between cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#1D2024] flex items-center justify-center font-medium text-sm text-white shrink-0">
                                {ben.avatarUrl ? (
                                  <img
                                    src={ben.avatarUrl}
                                    alt={ben.name}
                                    className="w-full h-full rounded-full object-cover"
                                  />
                                ) : (
                                  ben.name.charAt(0)
                                )}
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-white">
                                  {ben.name}
                                </p>
                                <p className="text-[10px] text-[#7E848D] font-mono">
                                  {formatIBAN(ben.iban).slice(0, 18)}...
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] text-[#7E848D]">{ben.bank}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    /* Add Custom Form */
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-[#7E848D] block mb-1">
                          Recipient Full Name
                        </label>
                        <input
                          type="text"
                          value={customName}
                          onChange={(e) => setCustomName(e.target.value)}
                          placeholder="e.g. Marcus Aurelius"
                          className="w-full bg-[#141618] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-white/30"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#7E848D] block mb-1">
                          IBAN Account Number
                        </label>
                        <input
                          type="text"
                          value={customIban}
                          onChange={(e) => setCustomIban(e.target.value)}
                          placeholder="PT50 0000 0000 0000 0000 0"
                          className="w-full bg-[#141618] border border-white/10 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-white/30"
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => setIsAddingCustom(false)}
                          className="flex-1 py-3 rounded-xl bg-[#141618] text-xs font-medium text-white border border-white/10"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddCustomRecipient}
                          className="flex-1 py-3 rounded-xl bg-white text-black text-xs font-semibold"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 2: ENTER AMOUNT & TACTILE KEYPAD */}
              {step === 'amount' && selectedRecipient && (
                <motion.div
                  key="step-amount"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="w-full flex flex-col items-center justify-between"
                >
                  {/* From Account Selector Pill */}
                  <div className="w-full mb-3 flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-[#141618] border border-white/10 text-xs">
                    <span className="text-[#7E848D]">From</span>
                    <div className="flex items-center gap-1.5">
                      <select
                        value={sourceAccountId}
                        onChange={(e) => setSourceAccountId(e.target.value)}
                        className="bg-transparent text-white font-medium outline-none cursor-pointer text-xs"
                      >
                        {accounts.map((acc) => (
                          <option key={acc.id} value={acc.id} className="bg-[#0B0C0E] text-white">
                            {acc.name} ({formatCurrency(acc.balance, acc.currency)})
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={13} className="text-[#7E848D]" />
                    </div>
                  </div>

                  {/* Prominent Typographic Balance Display (Monochrome) */}
                  <div className="my-3 flex flex-col items-center">
                    <div className="text-5xl font-bold tracking-tight text-white tnum flex items-center">
                      <span className="text-white/60 mr-1.5 font-normal">€</span>
                      <span>{amountStr}</span>
                    </div>
                    <span className="text-xs text-[#7E848D] mt-1.5">
                      Available: {formatCurrency(currentSource.balance, currentSource.currency)}
                    </span>
                  </div>

                  {/* Inline Note / Reference */}
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add reference note..."
                    className="w-full text-center bg-transparent border-b border-white/10 py-2 text-xs text-white placeholder-[#7E848D] focus:outline-none focus:border-white/30 my-2"
                  />

                  {/* Tactile Keypad Grid */}
                  <div className="w-full max-w-[300px] grid grid-cols-3 gap-2.5 my-3">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'].map(
                      (key) => (
                        <button
                          key={key}
                          onClick={() => handleKeypadPress(key)}
                          className="h-13 rounded-2xl bg-[#141618] border border-white/5 text-lg font-medium text-white active:bg-[#22262B] transition-colors flex items-center justify-center"
                        >
                          {key === 'backspace' ? <Delete size={20} className="text-white/80" /> : key}
                        </button>
                      )
                    )}
                  </div>
                </motion.div>
              )}

              {/* STEP 3: REVIEW TRANSFER */}
              {step === 'review' && selectedRecipient && (
                <motion.div
                  key="step-review"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="w-full space-y-4"
                >
                  <div className="bg-[#141618] rounded-3xl p-5 border border-white/10 space-y-3.5 text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <span className="text-[#7E848D]">Recipient</span>
                      <div className="text-right">
                        <p className="font-semibold text-white">{selectedRecipient.name}</p>
                        <p className="text-[10px] text-[#7E848D] font-mono">
                          {formatIBAN(selectedRecipient.iban)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <span className="text-[#7E848D]">From Account</span>
                      <span className="font-medium text-white">
                        {currentSource.name} (••{currentSource.accountNumber})
                      </span>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <span className="text-[#7E848D]">Transfer Amount</span>
                      <span className="text-lg font-bold text-white tnum">
                        €{parsedAmount.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <span className="text-[#7E848D]">Transfer Fee</span>
                      <span className="text-white font-medium">€0.00 (Instant)</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#7E848D]">Execution Speed</span>
                      <span className="font-medium text-white">Instant SEPA Direct</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: PROCESSING */}
              {step === 'processing' && (
                <motion.div
                  key="step-processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-10 text-center"
                >
                  <ProcessingOrb status="processing" />
                  <h3 className="text-base font-semibold text-white mt-4">
                    Authorizing Payment
                  </h3>
                  <p className="text-xs text-[#7E848D] mt-1">
                    Connecting to SEPA clearing engine...
                  </p>
                </motion.div>
              )}

              {/* STEP 5: SUCCESS */}
              {step === 'success' && selectedRecipient && (
                <motion.div
                  key="step-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-6"
                >
                  <ProcessingOrb status="success" />

                  <h3 className="text-2xl font-bold text-white mt-3">
                    €{parsedAmount.toFixed(2)} Sent
                  </h3>
                  <p className="text-xs text-[#7E848D] mt-1 mb-6">
                    Funds transferred immediately to {selectedRecipient.name}.
                  </p>

                  <div className="w-full grid grid-cols-2 gap-2.5 max-w-xs">
                    <button
                      onClick={() => {
                        showToast('Receipt copied to clipboard', 'info');
                      }}
                      className="py-2.5 rounded-xl bg-[#141618] border border-white/10 text-xs font-medium text-white flex items-center justify-center gap-1.5"
                    >
                      <Share2 size={14} />
                      <span>Receipt</span>
                    </button>

                    <button
                      onClick={() => {
                        setStep('amount');
                      }}
                      className="py-2.5 rounded-xl bg-[#141618] border border-white/10 text-xs font-medium text-white flex items-center justify-center gap-1.5"
                    >
                      <Repeat size={14} />
                      <span>Send Again</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Action Footer */}
          <div className="w-full max-w-md mx-auto pb-3">
            {step === 'amount' && (
              <button
                onClick={handleProceedToReview}
                className="w-full py-3.5 rounded-2xl bg-white text-black font-semibold text-sm flex items-center justify-center gap-2 transition-colors hover:bg-neutral-200"
              >
                <span>Review Transfer</span>
                <ArrowRight size={16} />
              </button>
            )}

            {step === 'review' && (
              <button
                onClick={handleStartAuthentication}
                className="w-full py-3.5 rounded-2xl bg-white text-black font-semibold text-sm flex items-center justify-center gap-2 transition-colors hover:bg-neutral-200"
              >
                <ShieldCheck size={18} />
                <span>Authorize & Send €{parsedAmount.toFixed(2)}</span>
              </button>
            )}

            {step === 'success' && (
              <button
                onClick={handleClose}
                className="w-full py-3.5 rounded-2xl bg-white text-black font-semibold text-sm transition-colors hover:bg-neutral-200"
              >
                Done
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Biometric Scanning Modal */}
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
