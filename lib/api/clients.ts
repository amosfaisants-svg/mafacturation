import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../database.types';

export async function getClients(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createClient(
  supabase: SupabaseClient<Database>, 
  clientData: Omit<Database['public']['Tables']['clients']['Insert'], 'user_id' | 'id'>
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('clients')
    // @ts-ignore: bypass type issue with supabase bindings
    .insert([{ ...clientData, user_id: user.id }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateClient(
  supabase: SupabaseClient<Database>, 
  id: string, 
  clientData: Database['public']['Tables']['clients']['Update']
) {
  const { data, error } = await supabase
    .from('clients')
    .update(clientData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteClient(supabase: SupabaseClient<Database>, id: string) {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
