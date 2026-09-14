'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { formatFCFA, formatDate } from '@/lib/format';
import { ArrowLeft, Trash2, Plus, Send, Save, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { getClients } from '@/lib/api/clients';
import { getInvoiceById, updateInvoice, InvoiceWithDetails } from '@/lib/api/invoices';
import { getSettings } from '@/lib/api/settings';
import { Database } from '@/lib/database.types';

type ClientRow = Database['public']['Tables']['clients']['Row'];

export default function EditInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const invoiceId = params.id as string;
  const supabase = createClient();
  
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [invoice, setInvoice] = useState<InvoiceWithDetails | null>(null);
  const [clientId, setClientId] = useState('');
  const [date, setDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<{ id: string; description: string; quantity: number; unitPrice: number }[]>([]);
  
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [invoiceId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [clientsData, invoiceData, settingsData] = await Promise.all([
        getClients(supabase),
        getInvoiceById(supabase, invoiceId),
        getSettings(supabase)
      ]);
      setClients(clientsData);
      setSettings(settingsData);
      
      setInvoice(invoiceData);
      setClientId(invoiceData.client_id);
      setDate(invoiceData.date);
      setDueDate(invoiceData.due_date);
      
      if (invoiceData.invoice_items && invoiceData.invoice_items.length > 0) {
        setItems(invoiceData.invoice_items.map(item => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unit_price
        })));
      } else {
        setItems([{ id: '1', description: '', quantity: 1, unitPrice: 0 }]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  }, [items]);
  
  const vatRate = useMemo(() => {
    const siret = settings?.siret || '';
    const match = siret.match(/(\d+(?:[.,]\d+)?)\s*%/);
    if (match) {
      const val = parseFloat(match[1].replace(',', '.'));
      if (!isNaN(val)) return val / 100;
    }
    const exactMatch = siret.trim().match(/^(\d+(?:[.,]\d+)?)$/);
    if (exactMatch) {
       const val = parseFloat(exactMatch[1].replace(',', '.'));
       if (!isNaN(val) && val <= 100) return val / 100;
    }
    return 0.18;
  }, [settings?.siret]);

  const taxAmount = useMemo(() => subtotal * vatRate, [subtotal, vatRate]);
  const total = useMemo(() => subtotal + taxAmount, [subtotal, taxAmount]);

  const handleSave = async (status?: 'draft' | 'sent') => {
    if (!clientId || !date || !dueDate || items.length === 0) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      setIsSaving(true);
      
      const invoiceDataToUpdate: any = {
        client_id: clientId,
        date: date,
        due_date: dueDate,
        amount: total,
        tax_amount: taxAmount,
      };

      if (status) {
        invoiceDataToUpdate.status = status;
      }

      const itemsData = items.map(item => ({
        description: item.description || 'Ligne sans description',
        quantity: item.quantity,
        unit_price: item.unitPrice
      }));

      await updateInvoice(supabase, invoiceId, invoiceDataToUpdate, itemsData);
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error('Error updating invoice:', error);
      alert("Erreur lors de la mise à jour de la facture.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = () => {
    setIsSuccessModalOpen(false);
    setTimeout(() => {
      window.print();
      router.push(`/invoices/${invoiceId}`);
    }, 100);
  };
  
  const selectedClient = clients.find(c => c.id === clientId);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0 }]);
  };

  const updateItem = (id: string, field: string, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
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

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-full print:block print:w-full print:max-w-none print:m-0 print:p-0">
      {/* LEFT: FORM */}
      <div className="w-full lg:w-1/2 space-y-6 print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push(`/invoices/${invoiceId}`)}>
            <ArrowLeft size={20} className="text-slate-500" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Modifier la Facture</h1>
            <p className="text-sm text-slate-500">{invoiceId}</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="text-lg font-semibold text-slate-900">Informations</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Client</Label>
                <Select value={clientId} onChange={e => setClientId(e.target.value)}>
                  <option value="">Sélectionner un client...</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date d&apos;émission</Label>
                  <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Date d&apos;échéance</Label>
                  <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-slate-900 pt-4 border-t border-slate-100">Lignes de facture</h3>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="p-4 border border-slate-200 rounded-lg space-y-4 relative bg-slate-50/50 transition-all hover:border-slate-300">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Ligne {index + 1}</span>
                    <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input 
                      placeholder="Nom du service/produit" 
                      value={item.description} 
                      onChange={e => updateItem(item.id, 'description', e.target.value)} 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Quantité</Label>
                      <Input 
                        type="number" min="1" 
                        value={item.quantity} 
                        onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Prix Unitaire (FCFA)</Label>
                      <Input 
                        type="number" min="0" 
                        value={item.unitPrice} 
                        onChange={e => updateItem(item.id, 'unitPrice', parseInt(e.target.value) || 0)} 
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full border-dashed" onClick={addItem}>
                <Plus size={16} className="mr-2" />
                Ajouter une ligne
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => router.push(`/invoices/${invoiceId}`)} disabled={isSaving}>
            Annuler
          </Button>
          <Button onClick={() => handleSave()} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 animate-spin h-4 w-4" /> : <Save size={16} className="mr-2" />} 
            ENREGISTRER
          </Button>
        </div>
      </div>

      {/* RIGHT: LIVE PREVIEW */}
      <div className="w-full lg:w-1/2 bg-slate-200/50 rounded-xl p-4 sm:p-8 flex items-start justify-center overflow-x-auto min-h-[800px] print:w-full print:bg-white print:p-0 print:overflow-visible print:min-h-0 print:block">
        <div className="bg-white shadow-xl w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-12 relative flex flex-col print:shadow-none print:max-w-none print:min-h-0 print:p-0">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">FACTURE</h2>
              <p className="text-slate-500 mt-1"># {invoiceId}</p>
            </div>
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white">
              <FileText size={24} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-12 text-sm">
            <div>
              <p className="text-slate-400 font-medium mb-2">De :</p>
              <p className="font-semibold text-slate-900">Facturio S.A.</p>
              <p className="text-slate-600">contact@facturio.com</p>
              <p className="text-slate-600">Dakar, Senegal</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium mb-2">À :</p>
              {selectedClient ? (
                <>
                  <p className="font-semibold text-slate-900">{selectedClient.name}</p>
                  <p className="text-slate-600">{selectedClient.email}</p>
                  <p className="text-slate-600">{selectedClient.address}</p>
                </>
              ) : (
                <p className="text-slate-400 italic">Veuillez sélectionner un client</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-12 text-sm bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div>
              <p className="text-slate-500 mb-1">Date d&apos;émission</p>
              <p className="font-medium text-slate-900">{date ? formatDate(date) : '-'}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Date d&apos;échéance</p>
              <p className="font-medium text-slate-900">{dueDate ? formatDate(dueDate) : '-'}</p>
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
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-4 text-slate-900">{item.description || <span className="text-slate-300 italic">Sans description</span>}</td>
                    <td className="py-4 text-slate-600 text-center">{item.quantity}</td>
                    <td className="py-4 text-slate-600 text-right">{formatFCFA(item.unitPrice)}</td>
                    <td className="py-4 text-slate-900 font-medium text-right">{formatFCFA(item.quantity * item.unitPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="w-full sm:w-1/2 ml-auto space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Sous-total</span>
              <span className="font-medium text-slate-900">{formatFCFA(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">TVA ({vatRate * 100}%)</span>
              <span className="font-medium text-slate-900">{formatFCFA(taxAmount)}</span>
            </div>
            <div className="pt-3 border-t-2 border-slate-900 flex justify-between">
              <span className="font-bold text-slate-900 text-base">Total TTC</span>
              <span className="font-bold text-lg text-slate-900">{formatFCFA(total)}</span>
            </div>
          </div>

          <div className="mt-24 pt-8 border-t border-slate-200 text-xs text-slate-400 text-center">
            Note: Les paiements en retard peuvent entraîner des pénalités selon la loi en vigueur.
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL OVERLAY */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200 print:hidden">
          <Card className="w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <CardContent className="p-6 text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Facture modifiée !</h3>
                <p className="text-sm text-slate-500 mt-2">
                  Votre facture {invoiceId} a été mise à jour avec succès.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => router.push(`/invoices/${invoiceId}`)}>
                  Voir la facture
                </Button>
                <Button className="w-full sm:w-auto" onClick={handleDownloadPDF}>
                  <FileText size={16} className="mr-2" />
                  Télécharger en PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
