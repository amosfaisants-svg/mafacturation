export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          phone: string
          address: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email: string
          phone: string
          address: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string
          phone?: string
          address?: string
          created_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          user_id: string
          client_id: string
          date: string
          due_date: string
          amount: number
          tax_amount: number | null
          status: 'draft' | 'sent' | 'paid' | 'overdue'
          created_at: string
        }
        Insert: {
          id: string
          user_id: string
          client_id: string
          date: string
          due_date: string
          amount: number
          tax_amount?: number | null
          status?: 'draft' | 'sent' | 'paid' | 'overdue'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string
          date?: string
          due_date?: string
          amount?: number
          tax_amount?: number | null
          status?: 'draft' | 'sent' | 'paid' | 'overdue'
          created_at?: string
        }
      }
      invoice_items: {
        Row: {
          id: string
          invoice_id: string
          description: string
          quantity: number
          unit_price: number
        }
        Insert: {
          id?: string
          invoice_id: string
          description: string
          quantity: number
          unit_price: number
        }
        Update: {
          id?: string
          invoice_id?: string
          description?: string
          quantity?: number
          unit_price?: number
        }
      }
      company_settings: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          email: string | null
          company_name: string | null
          siret: string | null
          address: string | null
          currency: string | null
          language: string | null
          logo_url: string | null
          phone: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          email?: string | null
          company_name?: string | null
          siret?: string | null
          address?: string | null
          currency?: string | null
          language?: string | null
          logo_url?: string | null
          phone?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          email?: string | null
          company_name?: string | null
          siret?: string | null
          address?: string | null
          currency?: string | null
          language?: string | null
          logo_url?: string | null
          phone?: string | null
          created_at?: string
        }
      }
    }
  }
}
