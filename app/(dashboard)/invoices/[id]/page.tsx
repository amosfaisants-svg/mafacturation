'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { formatFCFA, formatDate } from '@/lib/format';
import { ArrowLeft, Printer, Send, Edit2, Trash2, Loader2, FileText } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { getInvoiceById, InvoiceWithDetails } from '@/lib/api/invoices';
import { getSettings } from '@/lib/api/settings';

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;
  
  const supabase = createClient();
  const [invoice, setInvoice] = useState<InvoiceWithDetails | null>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice();
    }
  }, [invoiceId]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const [data, settingsData] = await Promise.all([
        getInvoiceById(supabase, invoiceId),
        getSettings(supabase)
      ]);
      setInvoice(data);
      setSettings(settingsData);
    } catch (error: any) {
      console.error('Error fetching invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Facture introuvable</h2>
        <Button onClick={() => router.push('/invoices')} variant="outline">
          <ArrowLeft size={16} className="mr-2" /> Retour aux factures
        </Button>
      </div>
    );
  }

  const translateStatus = (status: string) => {
    switch (status) {
      case 'paid': return 'Payée';
      case 'sent': return 'Envoyée';
      case 'draft': return 'Brouillon';
      case 'overdue': return 'En Retard';
      default: return status;
    }
  };

  const subtotal = invoice.amount - (invoice.tax_amount || 0);

  const handleShare = async () => {
    if (!invoice) return;
    
    const text = `Bonjour,\n\nVoici les détails de votre facture ${invoice.id} d'un montant total de ${formatFCFA(invoice.amount)}.\nDate d'échéance : ${formatDate(invoice.due_date)}.\n\nMerci de votre confiance.`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Facture ${invoice.id}`,
          text: text,
        });
      } catch (err) {
        console.log('Partage annulé ou erreur:', err);
      }
    } else {
      // Fallback (mailto) si la Web Share API n'est pas supportée sur ce navigateur (ex: desktop non-mac)
      const mailtoLink = `mailto:${invoice.clients?.email || ''}?subject=Facture ${invoice.id}&body=${encodeURIComponent(text)}`;
      window.location.href = mailtoLink;
    }
  };

  return (
    <>
    <div className="space-y-6 max-w-5xl mx-auto print:hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/invoices')}>
            <ArrowLeft size={20} className="text-slate-500" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{invoice.id}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-slate-500">Date d&apos;émission : {formatDate(invoice.date)}</span>
              <span className="text-slate-300">•</span>
              <Badge variant={invoice.status}>{translateStatus(invoice.status)}</Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap print:hidden">
          <Button variant="outline" onClick={() => window.print()}><Printer size={16} className="mr-2" /> Imprimer / PDF</Button>
          <Button variant="outline" onClick={() => router.push(`/invoices/${invoice.id}/edit`)}><Edit2 size={16} className="mr-2" /> Modifier</Button>
          <Button variant="outline" onClick={handleShare}><Send size={16} className="mr-2" /> Envoyer</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Détails des lignes</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Quantité</TableHead>
                    <TableHead className="text-right">Prix Unitaire</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.invoice_items && invoice.invoice_items.length > 0 ? (
                    invoice.invoice_items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium text-slate-900">{item.description}</TableCell>
                        <TableCell className="text-right text-slate-600">{item.quantity}</TableCell>
                        <TableCell className="text-right text-slate-600">{formatFCFA(item.unit_price)}</TableCell>
                        <TableCell className="text-right font-medium text-slate-900">{formatFCFA(item.quantity * item.unit_price)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                        Aucune ligne détaillée. (Total simple)
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="w-full sm:w-1/2 ml-auto space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Sous-total</span>
                  <span className="font-medium text-slate-900">{formatFCFA(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">TVA (18%)</span>
                  <span className="font-medium text-slate-900">{formatFCFA(invoice.tax_amount || 0)}</span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between">
                  <span className="font-bold text-slate-900">Total TTC</span>
                  <span className="font-bold text-xl text-blue-600">{formatFCFA(invoice.amount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations Client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Nom</p>
                <p className="font-medium text-slate-900">{invoice.clients.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Email</p>
                <p className="text-slate-900">{invoice.clients.email || 'Non renseigné'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Adresse</p>
                <p className="text-slate-900">{invoice.clients.address || 'Non renseignée'}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Échéance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm">Date d&apos;échéance</span>
                <span className="font-medium text-slate-900">{formatDate(invoice.due_date)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

      {/* PRINT ONLY UI */}
      <div className="hidden print:block w-full bg-white text-slate-900">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">FACTURE</h2>
            <p className="text-slate-500 mt-1"># {invoice.id}</p>
          </div>
          {settings?.logo_url ? (
            <div className="h-16 w-48 relative flex items-center justify-end">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={settings.logo_url} alt="Logo entreprise" className="max-h-full max-w-full object-contain" />
            </div>
          ) : (
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white">
              <FileText size={24} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-8 mb-12 text-sm">
          <div>
            <p className="text-slate-400 font-medium mb-2">De :</p>
            <p className="font-semibold text-slate-900">{settings?.company_name || 'Facturio S.A.'}</p>
            <p className="text-slate-600">{settings?.email || 'contact@facturio.com'}</p>
            <p className="text-slate-600">{settings?.address || 'Adresse non renseignée'}</p>
          </div>
          <div>
            <p className="text-slate-400 font-medium mb-2">À :</p>
            <p className="font-semibold text-slate-900">{invoice.clients.name}</p>
            <p className="text-slate-600">{invoice.clients.email || 'Non renseigné'}</p>
            <p className="text-slate-600">{invoice.clients.address || 'Non renseignée'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-12 text-sm bg-slate-50 p-4 rounded-lg border border-slate-100">
          <div>
            <p className="text-slate-500 mb-1">Date d&apos;émission</p>
            <p className="font-medium text-slate-900">{formatDate(invoice.date)}</p>
          </div>
          <div>
            <p className="text-slate-500 mb-1">Date d&apos;échéance</p>
            <p className="font-medium text-slate-900">{formatDate(invoice.due_date)}</p>
          </div>
        </div>

        <div className="flex-1">
          <table className="w-full text-sm text-left mb-8">
            <thead className="text-slate-500 border-b-2 border-slate-900">
              <tr>
                <th className="py-3 font-semibold w-1/2">Description</th>
                <th className="py-3 font-semibold text-center">Qté</th>
                <th className="py-3 font-semibold text-right">Prix U.</th>
                <th className="py-3 font-semibold text-right">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.invoice_items && invoice.invoice_items.length > 0 ? (
                invoice.invoice_items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-4 text-slate-900">{item.description || <span className="text-slate-300 italic">Sans description</span>}</td>
                    <td className="py-4 text-slate-600 text-center">{item.quantity}</td>
                    <td className="py-4 text-slate-600 text-right">{formatFCFA(item.unit_price)}</td>
                    <td className="py-4 text-slate-900 font-medium text-right">{formatFCFA(item.quantity * item.unit_price)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-slate-500 italic">Aucune ligne détaillée.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="w-full sm:w-1/2 ml-auto space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Sous-total</span>
            <span className="font-medium text-slate-900">{formatFCFA(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">TVA (18%)</span>
            <span className="font-medium text-slate-900">{formatFCFA(invoice.tax_amount || 0)}</span>
          </div>
          <div className="pt-3 border-t-2 border-slate-900 flex justify-between">
            <span className="font-bold text-slate-900 text-base">Total TTC</span>
            <span className="font-bold text-lg text-slate-900">{formatFCFA(invoice.amount)}</span>
          </div>
        </div>

          <div className="mt-24 pt-8 border-t border-slate-200 text-xs text-slate-400 text-center">
          <p className="mb-2">Note: Les paiements en retard peuvent entraîner des pénalités selon la loi en vigueur.</p>
          {settings && (
            <p className="font-medium text-slate-500 mt-2">
              {settings.company_name} • {settings.address} {settings.phone ? `• ${settings.phone}` : ''} • {settings.email}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
