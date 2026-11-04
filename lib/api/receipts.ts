import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../database.types';
import { InvoiceWithClient } from './invoices';

export interface PaymentRecord {
  id: string;
  invoice_id: string;
  amount: number;
  date: string;
  remaining_after: number;
}

export interface InvoiceReceiptHistory {
  invoice_id: string;
  initial_amount: number;
  payments: PaymentRecord[];
}

const STORAGE_KEY = 'facturio_invoice_receipts_v1';

function getLocalReceiptMap(): Record<string, InvoiceReceiptHistory> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalReceiptMap(map: Record<string, InvoiceReceiptHistory>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch (e) {
    console.error('Failed to save receipt history to localStorage:', e);
  }
}

export function getInvoiceOriginalAmount(invoice: InvoiceWithClient): number {
  const map = getLocalReceiptMap();
  const existing = map[invoice.id];
  if (existing && existing.initial_amount > 0) {
    return existing.initial_amount;
  }

  if (invoice.invoice_items && invoice.invoice_items.length > 0) {
    const itemsSubtotal = invoice.invoice_items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );
    const computedTotal = Math.round(itemsSubtotal + (invoice.tax_amount || 0));
    if (computedTotal > invoice.amount) {
      return computedTotal;
    }
  }

  return invoice.amount;
}

export function getInvoiceReceiptHistory(
  invoiceOrId: InvoiceWithClient | string,
  currentInvoiceAmount?: number
): InvoiceReceiptHistory {
  const isObj = typeof invoiceOrId !== 'string';
  const invoiceId = isObj ? invoiceOrId.id : invoiceOrId;
  const remaining = isObj ? invoiceOrId.amount : (currentInvoiceAmount ?? 0);
  const originalAmount = isObj ? getInvoiceOriginalAmount(invoiceOrId) : remaining;

  const map = getLocalReceiptMap();
  const existing = map[invoiceId];

  if (existing && existing.payments.length > 0) {
    return existing;
  }

  // If the invoice already has a paid difference (e.g. remaining < originalAmount or remaining === 0)
  const paidDiff = Math.max(0, originalAmount - remaining);
  if (paidDiff > 0 || remaining === 0) {
    const reconstructedPayment: PaymentRecord = {
      id: `REC-INIT-${invoiceId}`,
      invoice_id: invoiceId,
      amount: paidDiff > 0 ? paidDiff : originalAmount,
      date: isObj && invoiceOrId.date ? invoiceOrId.date : new Date().toISOString().split('T')[0],
      remaining_after: remaining,
    };

    return {
      invoice_id: invoiceId,
      initial_amount: originalAmount,
      payments: [reconstructedPayment],
    };
  }

  return {
    invoice_id: invoiceId,
    initial_amount: originalAmount,
    payments: [],
  };
}

export async function recordInvoicePayment(
  supabase: SupabaseClient<Database>,
  invoice: InvoiceWithClient,
  currentAmountInColumn: number,
  paymentAmount: number,
  paymentDate: string
): Promise<{
  history: InvoiceReceiptHistory;
  newRemainingAmount: number;
  newStatus?: Database['public']['Tables']['invoices']['Row']['status'];
}> {
  const invoiceId = invoice.id;
  if (paymentAmount <= 0) {
    throw new Error('Le montant doit être supérieur à 0.');
  }
  if (paymentAmount > currentAmountInColumn) {
    throw new Error('Le montant saisi ne peut pas dépasser le montant restant à payer.');
  }

  const newRemainingAmount = Math.max(0, currentAmountInColumn - paymentAmount);
  const map = getLocalReceiptMap();
  const currentHistory = getInvoiceReceiptHistory(invoice, currentAmountInColumn);

  const previousPayments = currentHistory.payments || [];
  const sumPreviousPayments = previousPayments.reduce((sum, p) => sum + p.amount, 0);
  const initialAmount = currentHistory.initial_amount || (currentAmountInColumn + sumPreviousPayments);

  const newPayment: PaymentRecord = {
    id: `REC-${Date.now()}`,
    invoice_id: invoiceId,
    amount: paymentAmount,
    date: paymentDate,
    remaining_after: newRemainingAmount,
  };

  const updatedHistory: InvoiceReceiptHistory = {
    invoice_id: invoiceId,
    initial_amount: initialAmount,
    payments: [...previousPayments, newPayment],
  };

  // Update invoice amount (and status if fully paid) in Supabase
  const updatePayload: Partial<Database['public']['Tables']['invoices']['Update']> = {
    amount: newRemainingAmount,
  };

  if (newRemainingAmount === 0) {
    updatePayload.status = 'paid';
  }

  const { error } = await (supabase
    .from('invoices') as any)
    .update(updatePayload)
    .eq('id', invoiceId);

  if (error) {
    throw error;
  }

  // Persist history locally
  map[invoiceId] = updatedHistory;
  saveLocalReceiptMap(map);

  return {
    history: updatedHistory,
    newRemainingAmount,
    newStatus: newRemainingAmount === 0 ? 'paid' : undefined,
  };
}

