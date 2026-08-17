import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  Delete,
  Search,
  UserPlus,
  ShieldCheck,
  Share2,
  Repeat,
  Check,
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
  const [amountStr, setAmountStr] = useState<string>('0');
  const [sourceAccountId, setSourceAccountId] = useState<string>(activeAccount.id);
  const [transferType, setTransferType] = useState<'free' | 'structured'>('free');
  const [reference, setReference] = useState<string>('');
  const [showBiometrics, setShowBiometrics] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAccountPickerOpen, setIsAccountPickerOpen] = useState(false);

  // Custom new beneficiary state
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customIban, setCustomIban] = useState('');

  // Default to a default recipient if opened without prefill
  useEffect(() => {
    if (isSendModalOpen) {
      if (prefilledRecipient) {
        setSelectedRecipient(prefilledRecipient);
        setStep('amount');
      } else if (beneficiaries.length > 0 && !selectedRecipient) {
        setSelectedRecipient(beneficiaries[0]);
        setStep('amount');
      }
    }
  }, [prefilledRecipient, isSendModalOpen, beneficiaries]);

  const handleClose = () => {
    setIsSendModalOpen(false);
    setTimeout(() => {
      setStep('amount');
      setAmountStr('0');
      setReference('');
      setIsAddingCustom(false);
      setShowBiometrics(false);
      setIsProcessing(false);
      setIsAccountPickerOpen(false);
    }, 250);
  };

  const currentSource = accounts.find((a) => a.id === sourceAccountId) || activeAccount;
  const parsedAmount = parseFloat(amountStr.replace(',', '.')) || 0;

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
    if (val === ',') {
      if (!amountStr.includes(',')) {
        setAmountStr((prev) => `${prev},`);
      }
      return;
    }
    if (amountStr === '0') {
      setAmountStr(val);
    } else if (amountStr.length < 8) {
      setAmountStr((prev) => `${prev}${val}`);
    }
  };

  const handlePresetAmount = (preset: number) => {
    triggerHaptic('light');
    setAmountStr(preset.toString());
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
      name: customName.trim().toUpperCase(),
      iban: customIban.trim().toUpperCase(),
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
          reference
        );
      }
      setIsProcessing(false);
      setStep('success');
      triggerHaptic('success');
    }, 850);
  };

  if (!isSendModalOpen) return null;

  const recipientInitials = selectedRecipient?.name
    ? selectedRecipient.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'BS';

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 bg-[#000000] text-white flex flex-col justify-between p-4 sm:p-5 overflow-y-auto select-none font-sans"
        >
          {/* TOP HEADER BAR (Exact to reference) */}
          <div className="flex items-center justify-between w-full max-w-sm mx-auto pt-1 pb-2">
            <button
              onClick={() => {
                triggerHaptic('light');
                if (step === 'amount') {
                  setStep('recipient');
                } else if (step === 'review') {
                  setStep('amount');
                } else {
                  handleClose();
                }
              }}
              className="w-10 h-10 rounded-full bg-[#1c1c1e] text-white flex items-center justify-center hover:bg-[#2c2c2e] transition-colors"
            >
              <ArrowLeft size={18} />
            </button>

            {/* Recipient Name & IBAN in Center */}
            <div
              onClick={() => {
                triggerHaptic('light');
                setStep('recipient');
              }}
              className="text-center cursor-pointer group"
            >
              <h2 className="text-sm font-bold tracking-wide text-white uppercase truncate max-w-[200px]">
                {selectedRecipient?.name || 'BALVINDER SINGH'}
              </h2>
              <p className="text-[11px] text-[#8e8e93] font-mono tracking-tight truncate max-w-[200px]">
                {selectedRecipient?.iban || 'BE37 9676 3046 7428'}
              </p>
            </div>

            {/* Recipient Avatar Circle with Blue Mini Badge */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#8370ff] text-white font-bold text-xs flex items-center justify-center shadow-sm">
                {recipientInitials}
              </div>
              {/* Cyan mini badge in corner */}
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#00d2ff] border-2 border-[#000000] flex items-center justify-center">
                <span className="text-[7px] font-extrabold text-black">Σ</span>
              </div>
            </div>
          </div>

          {/* MAIN BODY FLOW */}
          <div className="flex-1 w-full max-w-sm mx-auto flex flex-col justify-between py-1">
            <AnimatePresence mode="wait">
              {/* STEP 1: RECIPIENT PICKER */}
              {step === 'recipient' && (
                <motion.div
                  key="step-recipient"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full space-y-3 pt-2"
                >
                  {!isAddingCustom ? (
                    <>
                      <div className="relative">
                        <Search
                          size={14}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e8e93]"
                        />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search contact or IBAN..."
                          className="w-full bg-[#1c1c1e] rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-[#8e8e93] focus:outline-none"
                        />
                      </div>

                      <button
                        onClick={() => setIsAddingCustom(true)}
                        className="w-full p-3 rounded-2xl bg-[#1c1c1e] text-xs font-medium text-white hover:bg-[#2c2c2e] transition-colors flex items-center justify-center gap-2"
                      >
                        <UserPlus size={15} />
                        <span>Add New Beneficiary</span>
                      </button>

                      <div className="space-y-1.5 max-h-[380px] overflow-y-auto no-scrollbar pt-1">
                        <span className="text-[10px] font-medium uppercase tracking-wider text-[#8e8e93] px-1">
                          Recent Beneficiaries
                        </span>
                        {filteredBeneficiaries.map((ben) => (
                          <div
                            key={ben.id}
                            onClick={() => handleSelectRecipient(ben)}
                            className="p-3 rounded-2xl bg-[#1c1c1e] hover:bg-[#2c2c2e] flex items-center justify-between cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#2c2c2e] flex items-center justify-center font-bold text-xs text-white shrink-0">
                                {ben.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .slice(0, 2)}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-white uppercase">
                                  {ben.name}
                                </p>
                                <p className="text-[10px] text-[#8e8e93] font-mono">
                                  {formatIBAN(ben.iban)}
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] text-[#8e8e93]">{ben.bank}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3 pt-2">
                      <div>
                        <label className="text-xs text-[#8e8e93] block mb-1">
                          Beneficiary Name
                        </label>
                        <input
                          type="text"
                          value={customName}
                          onChange={(e) => setCustomName(e.target.value)}
                          placeholder="e.g. BALVINDER SINGH"
                          className="w-full bg-[#1c1c1e] rounded-xl p-3 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#8e8e93] block mb-1">
                          IBAN Number
                        </label>
                        <input
                          type="text"
                          value={customIban}
                          onChange={(e) => setCustomIban(e.target.value)}
                          placeholder="BE37 0000 0000 0000"
                          className="w-full bg-[#1c1c1e] rounded-xl p-3 text-xs text-white font-mono focus:outline-none"
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => setIsAddingCustom(false)}
                          className="flex-1 py-3 rounded-xl bg-[#1c1c1e] text-xs font-medium text-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddCustomRecipient}
                          className="flex-1 py-3 rounded-xl bg-white text-black text-xs font-semibold"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 2: AMOUNT INPUT (EXACT REPLICA OF USER REFERENCE SCREENSHOT) */}
              {step === 'amount' && selectedRecipient && (
                <motion.div
                  key="step-amount"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full flex flex-col items-center justify-between"
                >
                  {/* Hero Amount & "No fees" display */}
                  <div className="text-center pt-2 pb-1">
                    <div className="text-5xl sm:text-6xl font-bold tracking-tight text-white tnum">
                      €{amountStr}
                    </div>
                    <p className="text-xs text-[#8e8e93] mt-1.5 font-normal">
                      No fees
                    </p>
                  </div>

                  {/* Source Account Selector Pill */}
                  <div className="relative my-2">
                    <button
                      onClick={() => {
                        triggerHaptic('light');
                        setIsAccountPickerOpen(!isAccountPickerOpen);
                      }}
                      className="rounded-full bg-[#2c2c2e] hover:bg-[#3a3a3c] py-1.5 px-3.5 flex items-center gap-2 text-xs font-medium text-white transition-colors"
                    >
                      {/* EU Flag Icon */}
                      <span className="w-4 h-4 rounded-full bg-[#003399] flex items-center justify-center text-[8px] text-[#ffcc00] font-bold">
                        ★
                      </span>
                      <span>
                        {currentSource.name.replace(' Account', '')} · €{currentSource.balance.toFixed(2).replace('.', ',')}
                      </span>
                      <ChevronDown
                        size={13}
                        className={`text-[#8e8e93] transition-transform ${
                          isAccountPickerOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Account Dropdown */}
                    {isAccountPickerOpen && (
                      <div className="absolute top-9 left-1/2 -translate-x-1/2 w-56 bg-[#1c1c1e] rounded-2xl p-2 z-40 border border-white/10 shadow-2xl">
                        {accounts.map((acc) => (
                          <button
                            key={acc.id}
                            onClick={() => {
                              setSourceAccountId(acc.id);
                              setIsAccountPickerOpen(false);
                            }}
                            className="w-full p-2 rounded-xl text-left text-xs flex items-center justify-between hover:bg-[#2c2c2e] text-white"
                          >
                            <span>{acc.name}</span>
                            <span className="text-[#8e8e93] font-mono">
                              €{acc.balance.toFixed(2)}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Transfer Type Tabs: Free format / Structured */}
                  <div className="w-full rounded-2xl bg-[#1c1c1e] p-1 grid grid-cols-2 gap-1 my-2">
                    <button
                      onClick={() => {
                        triggerHaptic('light');
                        setTransferType('free');
                      }}
                      className={`py-2 rounded-xl text-xs font-medium text-center transition-all ${
                        transferType === 'free'
                          ? 'bg-[#3a3a3c] text-white shadow-sm'
                          : 'text-[#8e8e93] hover:text-white'
                      }`}
                    >
                      Free format
                    </button>
                    <button
                      onClick={() => {
                        triggerHaptic('light');
                        setTransferType('structured');
                      }}
                      className={`py-2 rounded-xl text-xs font-medium text-center transition-all ${
                        transferType === 'structured'
                          ? 'bg-[#3a3a3c] text-white shadow-sm'
                          : 'text-[#8e8e93] hover:text-white'
                      }`}
                    >
                      Structured
                    </button>
                  </div>

                  {/* Reference Input */}
                  <div className="w-full my-1">
                    <input
                      type="text"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder={transferType === 'free' ? 'Reference' : '+++000/0000/00000+++'}
                      className="w-full rounded-2xl bg-[#1c1c1e] px-4 py-3 text-xs text-white placeholder-[#636366] focus:outline-none focus:bg-[#252528] transition-colors font-mono"
                    />
                  </div>

                  {/* Calendar & Continue Row */}
                  <div className="w-full flex items-center gap-2 my-1">
                    <button
                      onClick={() => {
                        triggerHaptic('light');
                        showToast('Transfer scheduled for standard SEPA execution', 'info');
                      }}
                      className="w-12 h-12 rounded-2xl bg-[#2c2c2e] hover:bg-[#3a3a3c] flex items-center justify-center text-[#8e8e93] hover:text-white shrink-0 transition-colors"
                      title="Schedule transfer"
                    >
                      <Calendar size={18} />
                    </button>

                    <button
                      onClick={handleProceedToReview}
                      disabled={parsedAmount <= 0}
                      className={`h-12 rounded-2xl flex-1 font-semibold text-xs flex items-center justify-center transition-all ${
                        parsedAmount > 0
                          ? 'bg-white text-black hover:bg-neutral-200 active:scale-[0.99]'
                          : 'bg-[#3a3a3c] text-[#8e8e93] cursor-not-allowed opacity-80'
                      }`}
                    >
                      Continue
                    </button>
                  </div>

                  {/* Preset Amount Pills: €10, €20, €50, €100 */}
                  <div className="w-full grid grid-cols-4 gap-2 my-2">
                    {[10, 20, 50, 100].map((val) => (
                      <button
                        key={val}
                        onClick={() => handlePresetAmount(val)}
                        className="py-2 rounded-full bg-[#1c1c1e] hover:bg-[#2c2c2e] active:scale-95 text-xs font-medium text-white text-center transition-all border border-white/5"
                      >
                        € {val}
                      </button>
                    ))}
                  </div>

                  {/* Keypad Grid (Borderless European Layout) */}
                  <div className="w-full grid grid-cols-3 gap-y-2.5 pt-1">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', ',', '0', 'backspace'].map(
                      (key) => (
                        <button
                          key={key}
                          onClick={() => handleKeypadPress(key)}
                          className="h-11 text-2xl font-normal text-white flex items-center justify-center active:scale-90 transition-transform select-none"
                        >
                          {key === 'backspace' ? (
                            <Delete size={22} className="text-white/80" />
                          ) : (
                            key
                          )}
                        </button>
                      )
                    )}
                  </div>
                </motion.div>
              )}

              {/* STEP 3: REVIEW CONFIRMATION */}
              {step === 'review' && selectedRecipient && (
                <motion.div
                  key="step-review"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full space-y-4 pt-3"
                >
                  <div className="bg-[#1c1c1e] rounded-3xl p-5 space-y-3.5 text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <span className="text-[#8e8e93]">Recipient</span>
                      <div className="text-right">
                        <p className="font-bold text-white uppercase">{selectedRecipient.name}</p>
                        <p className="text-[10px] text-[#8e8e93] font-mono">
                          {formatIBAN(selectedRecipient.iban)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <span className="text-[#8e8e93]">From Account</span>
                      <span className="font-medium text-white">
                        {currentSource.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <span className="text-[#8e8e93]">Amount</span>
                      <span className="text-xl font-bold text-white tnum">
                        €{parsedAmount.toFixed(2).replace('.', ',')}
                      </span>
                    </div>

                    {reference && (
                      <div className="flex items-center justify-between pb-3 border-b border-white/5">
                        <span className="text-[#8e8e93]">Reference</span>
                        <span className="font-mono text-white text-[11px]">{reference}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <span className="text-[#8e8e93]">Fee</span>
                      <span className="text-white font-medium">No fees (€0,00)</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#8e8e93]">Transfer Mode</span>
                      <span className="font-medium text-white">Instant SEPA Direct</span>
                    </div>
                  </div>

                  <button
                    onClick={handleStartAuthentication}
                    className="w-full py-4 rounded-2xl bg-white text-black font-semibold text-sm flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors"
                  >
                    <ShieldCheck size={18} />
                    <span>Authorize & Send €{parsedAmount.toFixed(2).replace('.', ',')}</span>
                  </button>
                </motion.div>
              )}

              {/* STEP 4: PROCESSING STATE */}
              {step === 'processing' && (
                <motion.div
                  key="step-processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <ProcessingOrb status="processing" />
                  <h3 className="text-base font-semibold text-white mt-4">
                    Authorizing Payment
                  </h3>
                  <p className="text-xs text-[#8e8e93] mt-1">
                    SEPA direct clearing in progress...
                  </p>
                </motion.div>
              )}

              {/* STEP 5: SUCCESS STATE */}
              {step === 'success' && selectedRecipient && (
                <motion.div
                  key="step-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-8"
                >
                  <ProcessingOrb status="success" />

                  <h3 className="text-3xl font-bold text-white mt-4">
                    €{parsedAmount.toFixed(2).replace('.', ',')}
                  </h3>
                  <p className="text-xs text-[#8e8e93] mt-1 mb-8">
                    Sent successfully to {selectedRecipient.name}.
                  </p>

                  <div className="w-full grid grid-cols-2 gap-2.5 mb-3">
                    <button
                      onClick={() => {
                        showToast('Receipt copied to clipboard', 'info');
                      }}
                      className="py-3 rounded-2xl bg-[#1c1c1e] text-xs font-medium text-white hover:bg-[#2c2c2e] flex items-center justify-center gap-1.5"
                    >
                      <Share2 size={14} />
                      <span>Share Receipt</span>
                    </button>

                    <button
                      onClick={() => {
                        setAmountStr('0');
                        setStep('amount');
                      }}
                      className="py-3 rounded-2xl bg-[#1c1c1e] text-xs font-medium text-white hover:bg-[#2c2c2e] flex items-center justify-center gap-1.5"
                    >
                      <Repeat size={14} />
                      <span>Send Again</span>
                    </button>
                  </div>

                  <button
                    onClick={handleClose}
                    className="w-full py-3.5 rounded-2xl bg-white text-black font-semibold text-sm hover:bg-neutral-200"
                  >
                    Done
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Biometric Scanning Modal */}
      <BiometricModal
        isOpen={showBiometrics}
        onSuccess={handleBiometricSuccess}
        onCancel={() => setShowBiometrics(false)}
        title="Authorize Transfer"
        subtitle={`Confirm €${parsedAmount.toFixed(2).replace('.', ',')} to ${selectedRecipient?.name}`}
      />
    </>
  );
};
