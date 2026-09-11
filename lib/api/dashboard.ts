// @ts-nocheck
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../database.types';

export async function getDashboardStats(supabase: SupabaseClient<Database>) {
  const { data: invoices, error } = await supabase
    .from('invoices')
    .select('amount, status');

  if (error) throw error;

  let totalInvoiced = 0;
  let totalPaid = 0;
  let totalPending = 0;
  let totalOverdue = 0;

  if (invoices) {
    invoices.forEach(inv => {
      totalInvoiced += inv.amount;
      
      if (inv.status === 'paid') totalPaid += inv.amount;
      else if (inv.status === 'draft' || inv.status === 'sent') totalPending += inv.amount;
      else if (inv.status === 'overdue') totalOverdue += inv.amount;
    });
  }

  return {
    totalInvoiced,
    totalPaid,
    totalPending,
    totalOverdue,
  };
}
