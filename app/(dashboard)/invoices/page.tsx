'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { formatFCFA, formatDate } from '@/lib/format';
import { Plus, Search, Eye, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';
import { getInvoices, updateInvoiceStatus, InvoiceWithClient } from '@/lib/api/invoices';
import { Database } from '@/lib/database.types';

export default function InvoicesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [invoices, setInvoices] = useState<InvoiceWithClient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const data = await getInvoices(supabase);
      setInvoices(data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: Database['public']['Tables']['invoices']['Row']['status']) => {
    try {
      await updateInvoiceStatus(supabase, id, newStatus);
      setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = inv.clients?.name.toLowerCase().includes(searchString) || inv.id.toLowerCase().includes(searchString);
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Factures</h1>
          <p className="text-sm text-slate-500">Gérez toutes vos factures et suivez les paiements.</p>
        </div>
        <Link href="/invoices/create">
          <Button>
            <Plus size={18} className="mr-2" />
            Créer une facture
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                placeholder="Rechercher par client ou N°..." 
                className="pl-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="all">Tous les statuts</option>
                <option value="paid">Payée</option>
                <option value="sent">Envoyée</option>
                <option value="draft">Brouillon</option>
                <option value="overdue">En Retard</option>
              </Select>
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Facture</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date d&apos;émission</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead className="text-right">Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow 
                  key={invoice.id} 
                  className="cursor-pointer group hover:bg-slate-50 transition-colors"
                  onClick={() => router.push(`/invoices/${invoice.id}`)}
                >
                  <TableCell className="font-medium text-slate-900">{invoice.id}</TableCell>
                  <TableCell className="text-slate-600">{invoice.clients?.name}</TableCell>
                  <TableCell className="text-slate-600">{formatDate(invoice.date)}</TableCell>
                  <TableCell className="text-slate-900 font-medium text-right">
                    {formatFCFA(invoice.amount)}
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={invoice.status}
                      onChange={(e) => handleUpdateStatus(invoice.id, e.target.value as any)}
                      className={cn(
                        "inline-flex appearance-none items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-blue-500",
                        invoice.status === 'paid' ? "bg-green-100 text-green-700 border-green-200" :
                        invoice.status === 'sent' ? "bg-orange-100 text-orange-700 border-orange-200" :
                        invoice.status === 'overdue' ? "bg-red-100 text-red-700 border-red-200" :
                        "bg-slate-100 text-slate-700 border-slate-200"
                      )}
                    >
                      <option value="draft">Brouillon</option>
                      <option value="sent">Envoyée</option>
                      <option value="paid">Payée</option>
                      <option value="overdue">En Retard</option>
                    </select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 group-hover:bg-blue-50">
                      <Eye size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredInvoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                    Aucune facture trouvée.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
