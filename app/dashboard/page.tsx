'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatFCFA, formatDate } from '@/lib/format';
import { Wallet, TrendingUp, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';
import { getDashboardStats } from '@/lib/api/dashboard';
import { getInvoices, updateInvoiceStatus, InvoiceWithClient } from '@/lib/api/invoices';
import { Database } from '@/lib/database.types';

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<InvoiceWithClient[]>([]);
  const [stats, setStats] = useState({ totalInvoiced: 0, totalPaid: 0, totalPending: 0, totalOverdue: 0 });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, invoicesData] = await Promise.all([
        getDashboardStats(supabase),
        getInvoices(supabase)
      ]);
      setStats(statsData);
      setInvoices(invoicesData.slice(0, 5)); // Just the 5 most recent
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: Database['public']['Tables']['invoices']['Row']['status']) => {
    try {
      await updateInvoiceStatus(supabase, id, newStatus);
      // Optimistic update
      setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv));
      
      // Update stats to keep them in sync
      const statsData = await getDashboardStats(supabase);
      setStats(statsData);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const statCards = [
    {
      title: "Total Facturé",
      amount: stats.totalInvoiced,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Encaissé",
      amount: stats.totalPaid,
      icon: Wallet,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "En Attente",
      amount: stats.totalPending,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "En Retard",
      amount: stats.totalOverdue,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Bienvenue, voici le résumé de votre activité.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <Card key={i} className="group hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-3">
              <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.color} transition-transform group-hover:scale-110 duration-300`}>
                <stat.icon size={24} />
              </div>
              <div className="w-full min-w-0">
                <p className="text-sm font-medium text-slate-500 truncate">{stat.title}</p>
                <h3 className="text-xl font-bold text-slate-900 mt-1 truncate" title={formatFCFA(stat.amount)}>
                  {formatFCFA(stat.amount)}
                </h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dernières factures</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-y border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-medium">N° Facture</th>
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Date d&apos;émission</th>
                  <th className="px-4 py-3 font-medium text-right">Montant</th>
                  <th className="px-4 py-3 font-medium text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-4 font-medium text-slate-900">{invoice.id}</td>
                    <td className="px-4 py-4 text-slate-600">{invoice.clients?.name}</td>
                    <td className="px-4 py-4 text-slate-600">{formatDate(invoice.date)}</td>
                    <td className="px-4 py-4 text-slate-900 font-medium text-right">
                      {formatFCFA(invoice.amount)}
                    </td>
                    <td className="px-4 py-4 text-right">
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
                    </td>
                  </tr>
                ))}
                {invoices.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      Aucune facture récente
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
