-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Tables
CREATE TABLE public.clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE public.invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue');

CREATE TABLE public.invoices (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  client_id UUID REFERENCES public.clients(id) NOT NULL,
  date DATE NOT NULL,
  due_date DATE NOT NULL,
  amount NUMERIC NOT NULL,
  tax_amount NUMERIC,
  status public.invoice_status DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.invoice_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  invoice_id TEXT REFERENCES public.invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC NOT NULL
);

CREATE TABLE public.company_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT,
  company_name TEXT,
  siret TEXT,
  address TEXT,
  currency TEXT DEFAULT 'XOF',
  language TEXT DEFAULT 'fr',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies

-- Clients
CREATE POLICY "Users can view their own clients" 
ON public.clients FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clients" 
ON public.clients FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients" 
ON public.clients FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients" 
ON public.clients FOR DELETE USING (auth.uid() = user_id);

-- Invoices
CREATE POLICY "Users can view their own invoices" 
ON public.invoices FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own invoices" 
ON public.invoices FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invoices" 
ON public.invoices FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own invoices" 
ON public.invoices FOR DELETE USING (auth.uid() = user_id);

-- Invoice Items
CREATE POLICY "Users can view their invoice items" 
ON public.invoice_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.invoices 
    WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert invoice items to their invoices" 
ON public.invoice_items FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.invoices 
    WHERE invoices.id = invoice_id AND invoices.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their invoice items" 
ON public.invoice_items FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.invoices 
    WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their invoice items" 
ON public.invoice_items FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.invoices 
    WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid()
  )
);

-- Company Settings
CREATE POLICY "Users can view their own company settings" 
ON public.company_settings FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own company settings" 
ON public.company_settings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own company settings" 
ON public.company_settings FOR UPDATE USING (auth.uid() = user_id);
