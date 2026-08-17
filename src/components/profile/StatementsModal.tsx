import React from 'react';
import { Download, FileSpreadsheet, FileText, Calendar } from 'lucide-react';
import { BottomSheet } from '../common/BottomSheet';
import { GlassButton } from '../common/GlassButton';
import { useBanking } from '../../store/BankingContext';
import {
  generateStatementPDF,
  generateTransactionsCSV,
} from '../../utils/statementGenerator';
import { triggerHaptic } from '../../hooks/useHaptic';

export const StatementsModal: React.FC = () => {
  const {
    isStatementsOpen,
    setIsStatementsOpen,
    activeAccount,
    transactions,
    showToast,
  } = useBanking();

  const statements = [
    { period: 'August 2026', subtitle: 'Current active billing cycle' },
    { period: 'July 2026', subtitle: '31 days • 18 transactions' },
    { period: 'June 2026', subtitle: '30 days • 24 transactions' },
  ];

  const handleDownloadPDF = (period: string) => {
    triggerHaptic('success');
    generateStatementPDF(activeAccount, transactions, period);
    showToast(`PDF Statement for ${period} generated & downloaded`, 'success');
  };

  const handleExportCSV = () => {
    triggerHaptic('success');
    generateTransactionsCSV(
      transactions,
      `AURA_${activeAccount.name.replace(/\s+/g, '_')}_Transactions.csv`
    );
    showToast('CSV transaction archive exported', 'success');
  };

  return (
    <BottomSheet
      isOpen={isStatementsOpen}
      onClose={() => setIsStatementsOpen(false)}
      title="Statements & Tax Exports"
      subtitle={`Account: ${activeAccount.name}`}
    >
      <div className="space-y-4 pb-6">
        {/* Quick CSV Export Banner */}
        <div className="liquid-glass-elevated rounded-2xl p-4 border border-aura-blue/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-aura-blue/20 flex items-center justify-center text-aura-blue">
              <FileSpreadsheet size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Full CSV Export</h4>
              <p className="text-[10px] text-[#878A8E]">All historical ledger data</p>
            </div>
          </div>
          <GlassButton variant="primary" size="sm" onClick={handleExportCSV}>
            <Download size={13} />
            <span>Export CSV</span>
          </GlassButton>
        </div>

        {/* Monthly PDF Statements */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#878A8E] px-1">
            Monthly PDF Statements
          </h4>

          {statements.map((stmt) => (
            <div
              key={stmt.period}
              className="p-3.5 rounded-2xl liquid-glass border border-white/5 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-[#878A8E]">
                  <Calendar size={16} />
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A]">
                    {stmt.period}
                  </h5>
                  <p className="text-[10px] text-[#878A8E]">{stmt.subtitle}</p>
                </div>
              </div>

              <button
                onClick={() => handleDownloadPDF(stmt.period)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white flex items-center gap-1 text-xs font-medium transition-colors"
                title="Download PDF"
              >
                <Download size={14} />
                <span>PDF</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </BottomSheet>
  );
};
