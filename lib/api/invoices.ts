// @ts-nocheck
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../database.types';

export type InvoiceWithClient = Database['public']['Tables']['invoices']['Row'] & {
  clients: Database['public']['Tables']['clients']['Row'];
};

export type InvoiceWithDetails = InvoiceWithClient & {
  invoice_items: Database['public']['Tables']['invoice_items']['Row'][];
};

export async function getInvoices(supabase: SupabaseClient<Database>, startDate?: string, endDate?: string) {
  let query = supabase
    .from('invoices')
    .select(`
      *,
      clients (*)
    `)
    .order('created_at', { ascending: false });

  if (startDate) {
    query = query.gte('date', startDate);
  }
  if (endDate) {
    query = query.lte('date', endDate);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as unknown as InvoiceWithClient[];
}

export async function getInvoiceById(supabase: SupabaseClient<Database>, id: string) {
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      clients (*),
      invoice_items (*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as unknown as InvoiceWithDetails;
}

export async function createInvoice(
  supabase: SupabaseClient<Database>,
  invoiceData: Omit<Database['public']['Tables']['invoices']['Insert'], 'user_id'>,
  items: Omit<Database['public']['Tables']['invoice_items']['Insert'], 'invoice_id'>[]
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Insert invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .insert([{ ...invoiceData, user_id: user.id }])
    .select()
    .single();

  if (invoiceError) throw invoiceError;

  // Insert items
  if (items.length > 0) {
    const itemsToInsert = items.map(item => ({
      ...item,
      invoice_id: invoice.id
    }));

    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(itemsToInsert);

    if (itemsError) throw itemsError;
  }

  return invoice;
}

export async function updateInvoiceStatus(
  supabase: SupabaseClient<Database>,
  id: string,
  status: Database['public']['Tables']['invoices']['Row']['status']
) {
  const { data, error } = await supabase
    .from('invoices')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateInvoice(
  supabase: SupabaseClient<Database>,
  invoiceId: string,
  invoiceData: Partial<Omit<Database['public']['Tables']['invoices']['Update'], 'user_id' | 'id'>>,
  items: Omit<Database['public']['Tables']['invoice_items']['Insert'], 'invoice_id'>[]
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Update invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .update(invoiceData)
    .eq('id', invoiceId)
    .eq('user_id', user.id) // Security check
    .select()
    .single();

  if (invoiceError) throw invoiceError;

  // Update items - easiest way is to delete all existing items for this invoice and insert the new ones
  const { error: deleteError } = await supabase
    .from('invoice_items')
    .delete()
    .eq('invoice_id', invoiceId);
    
  if (deleteError) throw deleteError;

  if (items.length > 0) {
    const itemsToInsert = items.map(item => ({
      ...item,
      invoice_id: invoice.id
    }));

    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(itemsToInsert);

    if (itemsError) throw itemsError;
  }

  return invoice;
}
