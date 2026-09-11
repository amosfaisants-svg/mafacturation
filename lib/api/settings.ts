// @ts-nocheck
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../database.types';

export async function getSettings(supabase: SupabaseClient<Database>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('company_settings')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Row not found, return default settings
      return {
        full_name: '',
        email: user.email || '',
        company_name: '',
        siret: '',
        address: '',
        currency: 'XOF',
        language: 'fr'
      };
    }
    throw error;
  }
  
  return data;
}

export async function updateSettings(
  supabase: SupabaseClient<Database>,
  settingsData: Omit<Database['public']['Tables']['company_settings']['Insert'], 'id' | 'user_id' | 'created_at'>
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('company_settings')
    .upsert({ 
      ...settingsData, 
      user_id: user.id 
    }, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}
