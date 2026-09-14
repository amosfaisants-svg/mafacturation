// @ts-nocheck
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../database.types';

export async function getDashboardStats(supabase: SupabaseClient<Database>, startDate?: string, endDate?: string) {
  let query = supabase
    .from('invoices')
    .select('amount, status');

  if (startDate) {
    query = query.gte('date', startDate);
  }
  if (endDate) {
    query = query.lte('date', endDate);
  }

  const { data: invoices, error } = await query;

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
