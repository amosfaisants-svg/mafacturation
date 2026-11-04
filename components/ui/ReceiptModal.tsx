'use client';

import React, { useState, useEffect, useRef } from 'react';
import { InvoiceWithClient } from '@/lib/api/invoices';
import {
  getInvoiceReceiptHistory,
  recordInvoicePayment,
  InvoiceReceiptHistory,
} from '@/lib/api/receipts';
import { getSettings } from '@/lib/api/settings';
import { createClient } from '@/utils/supabase/client';
import { formatFCFA, formatDate } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { cn } from '@/lib/utils';
import {
  X,
  Receipt,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  ExternalLink,
  Send,
  Loader2,
  Calendar,
  Wallet,
} from 'lucide-react';
import { Database } from '@/lib/database.types';

export interface ReceiptModalProps {
  invoice: InvoiceWithClient | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentRecorded: (
    invoiceId: string,
    newRemainingAmount: number,
    newStatus?: Database['public']['Tables']['invoices']['Row']['status']
  ) => void;
  className?: string;
}

export function ReceiptModal({
  invoice,
  isOpen,
  onClose,
  onPaymentRecorded,
  className,
}: ReceiptModalProps) {
  const supabase = createClient();
  const receiptPrintRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<'form' | 'pdf'>('form');
  const [amountInput, setAmountInput] = useState<string>('');
  const [paymentDate, setPaymentDate] = useState<string>(() =>
    new Date().toISOString().split('T')[0]
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const [history, setHistory] = useState<InvoiceReceiptHistory | null>(null);
  const [remainingAmount, setRemainingAmount] = useState<number>(0);
  const [settings, setSettings] = useState<any>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [clientPhone, setClientPhone] = useState<string>('');

  useEffect(() => {
    if (isOpen && invoice) {
      const existingHistory = getInvoiceReceiptHistory(invoice.id, invoice.amount);
      setHistory(existingHistory);
      setRemainingAmount(invoice.amount);
      setAmountInput('');
      setPaymentDate(new Date().toISOString().split('T')[0]);
      setError(null);
      setPdfBlob(null);
      setPdfUrl(null);
      setClientPhone(invoice.clients?.phone || '');

      // If the invoice is already at 0 FCFA and has payments, go directly to the PDF recap
      if (invoice.amount === 0 && existingHistory.payments.length > 0) {
        setStep('pdf');
      } else {
        setStep('form');
      }

      getSettings(supabase)
        .then((data) => setSettings(data))
        .catch((err) => console.error('Error loading settings:', err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, invoice]);

  // Cleanup object URL on unmount or change
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  // Automatically generate and open PDF when entering 'pdf' step
  useEffect(() => {
    if (step === 'pdf' && invoice && history) {
      const timer = setTimeout(() => {
        generateAndOpenPdf(true);
      }, 250);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, history]);

  if (!isOpen || !invoice) return null;

  const numericAmount = Number(amountInput);
  const isOverMax = !isNaN(numericAmount) && numericAmount > invoice.amount;
  const isValidAmount =
    amountInput.trim() !== '' &&
    !isNaN(numericAmount) &&
    numericAmount > 0 &&
    numericAmount <= invoice.amount;

  const previewRemaining = isValidAmount
    ? Math.max(0, invoice.amount - numericAmount)
    : invoice.amount;

  const handleAmountChange = (val: string) => {
    setAmountInput(val);
    const num = Number(val);
    if (val.trim() !== '' && !isNaN(num)) {
      if (num > invoice.amount) {
        setError(
          `Le montant ne doit pas être supérieur au montant indiqué par la facture (${formatFCFA(
            invoice.amount
          )}).`
        );
      } else if (num <= 0) {
        setError('Le montant doit être supérieur à 0 FCFA.');
      } else {
        setError(null);
      }
    } else {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidAmount) {
      if (isOverMax) {
        setError(
          `Le montant ne doit pas être supérieur au montant indiqué par la facture (${formatFCFA(
            invoice.amount
          )}).`
        );
      } else {
        setError('Veuillez saisir un montant valide.');
      }
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const result = await recordInvoicePayment(
        supabase,
        invoice.id,
        invoice.amount,
        numericAmount,
        paymentDate
      );

      setHistory(result.history);
      setRemainingAmount(result.newRemainingAmount);
      onPaymentRecorded(invoice.id, result.newRemainingAmount, result.newStatus);
      setStep('pdf');
    } catch (err: any) {
      console.error('Error recording payment:', err);
      setError(err?.message || "Erreur lors de l'enregistrement du reçu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatePdfBlob = async (): Promise<{ blob: Blob; url: string } | null> => {
    const element = receiptPrintRef.current;
    if (!element) return null;

    try {
      setIsGeneratingPdf(true);
      // @ts-ignore
      const html2pdf = (await import('html2pdf.js')).default;

      const opt = {
        margin: 0.3,
        filename: `Recu_${invoice.id}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, windowWidth: 780 },
        jsPDF: { unit: 'in' as const, format: 'a4' as const, orientation: 'portrait' as const },
      };

      const blob: Blob = await html2pdf().set(opt).from(element).output('blob');
      const url = URL.createObjectURL(blob);
      setPdfBlob(blob);
      setPdfUrl(url);
      return { blob, url };
    } catch (err) {
      console.error('Error generating receipt PDF:', err);
      return null;
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const generateAndOpenPdf = async (autoOpenTab = true) => {
    const generated = await generatePdfBlob();
    if (generated && autoOpenTab) {
      window.open(generated.url, '_blank');
    }
  };

  const handleDownloadPdf = async () => {
    let urlToUse = pdfUrl;
    if (!urlToUse) {
      const generated = await generatePdfBlob();
      urlToUse = generated?.url || null;
    }
    if (urlToUse) {
      const link = document.createElement('a');
      link.href = urlToUse;
      link.download = `Recu_${invoice.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleOpenPdfTab = async () => {
    let urlToUse = pdfUrl;
    if (!urlToUse) {
      const generated = await generatePdfBlob();
      urlToUse = generated?.url || null;
    }
    if (urlToUse) {
      window.open(urlToUse, '_blank');
    }
  };

  const totalPaid =
    history?.payments.reduce((sum, p) => sum + p.amount, 0) || 0;
  const initialAmount =
    history?.initial_amount || totalPaid + remainingAmount;

  const buildWhatsAppMessage = () => {
    const companyName = settings?.company_name || 'Facturio';
    const paymentLines =
      history?.payments
        .map(
          (p, idx) =>
            `  ${idx + 1}. ${formatDate(p.date)} : *${formatFCFA(p.amount)}*`
        )
        .join('\n') || '';

    return (
      `Bonjour *${invoice.clients?.name || 'Client'}*,\n\n` +
      `Voici votre reçu de paiement pour la facture *${invoice.id}* (${companyName}).\n\n` +
      `📋 *Récapitulatif des versements enregistrés :*\n` +
      `${paymentLines}\n\n` +
      `💰 *Montant initial :* ${formatFCFA(initialAmount)}\n` +
      `✅ *Total payé :* ${formatFCFA(totalPaid)}\n` +
      `📌 *Montant restant à payer :* *${formatFCFA(remainingAmount)}*\n\n` +
      `Merci pour votre confiance !`
    );
  };

  const handleSendWhatsApp = async () => {
    const message = buildWhatsAppMessage();

    // Ensure PDF blob is ready
    let currentBlob = pdfBlob;
    let currentUrl = pdfUrl;
    if (!currentBlob || !currentUrl) {
      const generated = await generatePdfBlob();
      currentBlob = generated?.blob || null;
      currentUrl = generated?.url || null;
    }

    // 1. Try native file sharing (mobile / compatible browsers) if no specific phone forces wa.me
    if (currentBlob && typeof navigator !== 'undefined' && navigator.share && navigator.canShare) {
      const file = new File([currentBlob], `Recu_${invoice.id}.pdf`, {
        type: 'application/pdf',
      });
      if (navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `Reçu de paiement - ${invoice.id}`,
            text: message,
          });
          return;
        } catch (err) {
          // User cancelled or share failed; fall back to WhatsApp direct link below
          console.log('Fallback to wa.me link:', err);
        }
      }
    }

    // 2. Download the PDF file automatically so the user can attach it in WhatsApp, and open WhatsApp chat
    if (currentUrl) {
      const link = document.createElement('a');
      link.href = currentUrl;
      link.download = `Recu_${invoice.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    const sanitizedPhone = clientPhone.replace(/[^0-9]/g, '');
    const waUrl = sanitizedPhone
      ? `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(waUrl, '_blank');
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto',
        className
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          'bg-white rounded-xl border border-slate-200 shadow-xl w-full transition-all duration-300 overflow-hidden my-8',
          step === 'form' ? 'max-w-md' : 'max-w-3xl'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <Receipt size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {step === 'form'
                  ? 'Enregistrer un reçu de paiement'
                  : `Reçu PDF — Facture ${invoice.id}`}
              </h3>
              <p className="text-xs text-slate-500">
                Client : {invoice.clients?.name || 'Non spécifié'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {step === 'form' ? (
          /* STEP 1: PAYMENT AMOUNT ENTRY FORM */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Invoice Summary Banner */}
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">N° Facture</span>
                <span className="font-semibold text-slate-900">{invoice.id}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Montant indiqué (Reste à payer)</span>
                <span className="font-bold text-base text-blue-600">
                  {formatFCFA(invoice.amount)}
                </span>
              </div>
              {history && history.payments.length > 0 && (
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
                  <span>
                    {history.payments.length} versement(s) déjà enregistré(s)
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep('pdf')}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Voir le récap PDF →
                  </button>
                </div>
              )}
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="receipt-amount">Montant reçu (FCFA)</Label>
                {invoice.amount > 0 && (
                  <button
                    type="button"
                    onClick={() => handleAmountChange(String(invoice.amount))}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Tout régler ({formatFCFA(invoice.amount)})
                  </button>
                )}
              </div>
              <div className="relative">
                <Wallet
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <Input
                  id="receipt-amount"
                  type="number"
                  min={1}
                  max={invoice.amount}
                  step="any"
                  placeholder={`Ex: ${Math.min(50000, invoice.amount)}`}
                  value={amountInput}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className={cn(
                    'pl-9 font-medium',
                    isOverMax && 'border-red-500 focus-visible:ring-red-500'
                  )}
                  autoFocus
                  required
                />
              </div>
              <p className="text-xs text-slate-500">
                Maximum autorisé : <strong>{formatFCFA(invoice.amount)}</strong>
              </p>
            </div>

            {/* Payment Date Input */}
            <div className="space-y-2">
              <Label htmlFor="receipt-date">Date du versement</Label>
              <div className="relative">
                <Calendar
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <Input
                  id="receipt-date"
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Live Calculation Preview */}
            {isValidAmount && (
              <div className="rounded-xl bg-green-50/80 border border-green-200 p-3.5 space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Montant actuel :</span>
                  <span>{formatFCFA(invoice.amount)}</span>
                </div>
                <div className="flex justify-between text-green-700 font-medium">
                  <span>Montant encaissé :</span>
                  <span>- {formatFCFA(numericAmount)}</span>
                </div>
                <div className="pt-1.5 border-t border-green-200 flex justify-between font-bold text-slate-900">
                  <span>Nouveau reste à payer :</span>
                  <span className="text-green-700">{formatFCFA(previewRemaining)}</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={!isValidAmount || isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} className="mr-2" />
                    Enregistrer et ouvrir le PDF
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          /* STEP 2: PDF RECAP VIEW & WHATSAPP SHARE */
          <div className="p-6 space-y-6">
            {/* Top Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex-1 space-y-1">
                <Label htmlFor="wa-phone" className="text-xs text-slate-500">
                  Numéro WhatsApp du client (avec indicatif, ex: 225...)
                </Label>
                <Input
                  id="wa-phone"
                  type="tel"
                  placeholder="Ex: 2250700000000"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="h-9 bg-white text-sm"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:self-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleOpenPdfTab}
                  disabled={isGeneratingPdf}
                  className="h-9"
                >
                  {isGeneratingPdf ? (
                    <Loader2 size={15} className="mr-1.5 animate-spin" />
                  ) : (
                    <ExternalLink size={15} className="mr-1.5" />
                  )}
                  Ouvrir le PDF
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="h-9"
                >
                  <Download size={15} className="mr-1.5" />
                  Télécharger PDF
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={handleSendWhatsApp}
                  disabled={isGeneratingPdf}
                  className="h-9 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Send size={15} className="mr-1.5" />
                  Envoyer par WhatsApp
                </Button>
              </div>
            </div>

            {/* Printable / PDF Container */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white max-h-[60vh] overflow-y-auto">
              <div
                ref={receiptPrintRef}
                className="w-full bg-white text-slate-900 p-8 space-y-6"
              >
                {/* Receipt Header */}
                <div className="flex justify-between items-start border-b border-slate-200 pb-6">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider mb-2">
                      Reçu de Paiement
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Facture #{invoice.id}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Date d&apos;édition du reçu : {formatDate(new Date())}
                    </p>
                  </div>

                  <div className="text-right">
                    {settings?.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={settings.logo_url}
                        alt="Logo entreprise"
                        className="h-12 max-w-[150px] object-contain ml-auto mb-2"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white ml-auto mb-2">
                        <FileText size={20} />
                      </div>
                    )}
                    <p className="font-bold text-sm text-slate-900">
                      {settings?.company_name || 'Amos Tech SARL'}
                    </p>
                    {settings?.address && (
                      <p className="text-xs text-slate-500">{settings.address}</p>
                    )}
                    {settings?.phone && (
                      <p className="text-xs text-slate-500">{settings.phone}</p>
                    )}
                  </div>
                </div>

                {/* Client & Invoice Info */}
                <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
                  <div>
                    <p className="text-xs uppercase font-medium text-slate-400 mb-1">
                      Reçu de (Client)
                    </p>
                    <p className="font-semibold text-slate-900">
                      {invoice.clients?.name || 'Client'}
                    </p>
                    {invoice.clients?.phone && (
                      <p className="text-slate-600 text-xs mt-0.5">
                        Tél : {invoice.clients.phone}
                      </p>
                    )}
                    {invoice.clients?.email && (
                      <p className="text-slate-600 text-xs">
                        {invoice.clients.email}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase font-medium text-slate-400 mb-1">
                      Référence Facture
                    </p>
                    <p className="font-semibold text-slate-900">{invoice.id}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Date facture : {formatDate(invoice.date)}
                    </p>
                    <p className="text-xs text-slate-500">
                      Montant initial : {formatFCFA(initialAmount)}
                    </p>
                  </div>
                </div>

                {/* Payment History Table */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">
                    Récapitulatif des montants enregistrés
                  </h4>
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-slate-900 text-xs uppercase text-slate-500">
                        <th className="py-2.5 px-3">N° Versement</th>
                        <th className="py-2.5 px-3">Date d&apos;enregistrement</th>
                        <th className="py-2.5 px-3 text-right">Montant versé</th>
                        <th className="py-2.5 px-3 text-right">Reste après versement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {history?.payments.map((payment, index) => (
                        <tr key={payment.id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-3 font-medium text-slate-900">
                            Versement #{index + 1}
                          </td>
                          <td className="py-3 px-3 text-slate-600">
                            {formatDate(payment.date)}
                          </td>
                          <td className="py-3 px-3 text-right font-semibold text-green-600">
                            {formatFCFA(payment.amount)}
                          </td>
                          <td className="py-3 px-3 text-right font-medium text-slate-700">
                            {formatFCFA(payment.remaining_after)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Financial Summary Box */}
                <div className="w-full sm:w-2/3 ml-auto bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Montant initial de la facture</span>
                    <span className="font-medium text-slate-900">
                      {formatFCFA(initialAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-green-700">
                    <span>Total des montants enregistrés</span>
                    <span className="font-semibold">
                      {formatFCFA(totalPaid)}
                    </span>
                  </div>
                  <div className="pt-2.5 border-t-2 border-slate-900 flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-base">
                      Montant restant à payer
                    </span>
                    <span
                      className={cn(
                        'font-bold text-lg px-3 py-1 rounded-lg',
                        remainingAmount === 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      )}
                    >
                      {formatFCFA(remainingAmount)}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
                  <p>
                    Ce reçu atteste des paiements enregistrés pour la facture{' '}
                    <strong className="text-slate-600">{invoice.id}</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Modal Footer */}
            <div className="flex items-center justify-between pt-2">
              {remainingAmount > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setAmountInput('');
                    setStep('form');
                  }}
                >
                  + Enregistrer un autre versement
                </Button>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                  <CheckCircle2 size={15} /> Facture totalement soldée
                </span>
              )}

              <Button type="button" variant="secondary" onClick={onClose}>
                Fermer
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
