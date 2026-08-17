import { jsPDF } from 'jspdf';
import { Transaction, Account } from '../types/banking';
import { formatCurrency, formatIBAN } from './formatters';

export const generateStatementPDF = (
  account: Account,
  transactions: Transaction[],
  period: string
) => {
  const doc = new jsPDF();
  
  // Color styling
  doc.setFillColor(8, 9, 10);
  doc.rect(0, 0, 210, 36, 'F');
  
  // Header
  doc.setTextColor(247, 247, 245);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('AURA DIGITAL BANK', 20, 20);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(150, 160, 175);
  doc.text('STATEMENT OF ACCOUNT', 20, 28);
  doc.text(`PERIOD: ${period.toUpperCase()}`, 140, 28);

  // Account Info Box
  doc.setDrawColor(220, 224, 230);
  doc.setFillColor(248, 249, 250);
  doc.roundedRect(20, 45, 170, 30, 2, 2, 'FD');

  doc.setTextColor(20, 24, 30);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(account.name, 26, 54);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 110, 120);
  doc.text(`IBAN: ${formatIBAN(account.iban)}`, 26, 61);
  doc.text(`Account Number: ${account.accountNumber}`, 26, 67);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 24, 30);
  doc.text('Closing Balance', 130, 54);
  doc.setFontSize(13);
  doc.setTextColor(92, 124, 255);
  doc.text(formatCurrency(account.balance, account.currency), 130, 64);

  // Table Headers
  let y = 88;
  doc.setDrawColor(200, 205, 215);
  doc.line(20, y, 190, y);
  
  y += 6;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 110, 120);
  doc.text('DATE', 20, y);
  doc.text('DESCRIPTION', 55, y);
  doc.text('CATEGORY', 120, y);
  doc.text('AMOUNT', 165, y);

  y += 3;
  doc.line(20, y, 190, y);

  // Rows
  const rows = transactions.slice(0, 18);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  rows.forEach((tx) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.setTextColor(70, 75, 85);
    const dateStr = new Date(tx.timestamp).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    doc.text(dateStr, 20, y);
    doc.text(tx.title.substring(0, 28), 55, y);
    doc.text(tx.category, 120, y);

    if (tx.amount > 0) {
      doc.setTextColor(16, 149, 93);
    } else {
      doc.setTextColor(20, 24, 30);
    }
    const amtStr = formatCurrency(tx.amount, account.currency, { showPlus: true });
    doc.text(amtStr, 165, y);

    y += 7.5;
  });

  // Footer
  doc.setFontSize(7.5);
  doc.setTextColor(140, 145, 155);
  doc.text('AURA Digital Bank S.A. • Licensed Credit Institution • Generated securely via AURA Mobile Core', 20, 285);

  doc.save(`AURA_Statement_${account.name.replace(/\s+/g, '_')}_${period.replace(/\s+/g, '_')}.pdf`);
};

export const generateTransactionsCSV = (transactions: Transaction[], filename: string = 'AURA_Transactions.csv') => {
  const headers = ['ID', 'Date', 'Description', 'Category', 'Amount', 'Type', 'Status', 'Payment Method'];
  const rows = transactions.map(tx => [
    tx.id,
    new Date(tx.timestamp).toISOString(),
    `"${tx.title.replace(/"/g, '""')}"`,
    tx.category,
    tx.amount.toFixed(2),
    tx.type,
    tx.status,
    `"${tx.paymentMethod}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
