'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { formatFCFA, formatDate } from '@/lib/format';
import { ArrowLeft, Trash2, Plus, Send, Save, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { getClients } from '@/lib/api/clients';
import { createInvoice } from '@/lib/api/invoices';
import { getSettings } from '@/lib/api/settings';
import { Database } from '@/lib/database.types';

type ClientRow = Database['public']['Tables']['clients']['Row'];

export default function CreateInvoicePage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [clientId, setClientId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState([
    { id: '1', description: '', quantity: 1, unitPrice: 0 }
  ]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [savedInvoiceId, setSavedInvoiceId] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const [clientsData, settingsData] = await Promise.all([
        getClients(supabase),
        getSettings(supabase)
      ]);
      setClients(clientsData);
      setSettings(settingsData);
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

  const handleSave = async (status: 'draft' | 'sent' = 'sent') => {
    if (!clientId || !date || !dueDate || items.length === 0) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      setIsSaving(true);
      // Generate ID like FAC-2026-0012
      const newId = `FAC-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      const invoiceData = {
        id: newId,
        client_id: clientId,
        date: date,
        due_date: dueDate,
        amount: total,
        tax_amount: taxAmount,
        status: status
      };

      const itemsData = items.map(item => ({
        description: item.description || 'Ligne sans description',
        quantity: item.quantity,
        unit_price: item.unitPrice
      }));

      await createInvoice(supabase, invoiceData, itemsData);
      setSavedInvoiceId(newId);
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert("Erreur lors de l'enregistrement de la facture.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = () => {
    setIsSuccessModalOpen(false);
    setTimeout(() => {
      window.print();
      router.push(`/invoices/${savedInvoiceId}`);
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

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-full print:block print:w-full print:max-w-none print:m-0 print:p-0">
      {/* LEFT: FORM */}
      <div className="w-full lg:w-1/2 space-y-6 print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/invoices')}>
            <ArrowLeft size={20} className="text-slate-500" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Créer une Facture</h1>
            <p className="text-sm text-slate-500">Créez et envoyez une nouvelle facture.</p>
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
          <Button variant="outline" onClick={() => handleSave('draft')} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 animate-spin h-4 w-4" /> : <Save size={16} className="mr-2" />} 
            Enregistrer brouillon
          </Button>
          <Button onClick={() => handleSave('sent')} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 animate-spin h-4 w-4" /> : <Send size={16} className="mr-2" />} 
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
              <p className="text-slate-500 mt-1"># FAC-A-VENIR</p>
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
            <p className="mb-2">Note: Les paiements en retard peuvent entraîner des pénalités selon la loi en vigueur.</p>
            {settings && (
              <p className="font-medium text-slate-500 mt-2">
                {settings.company_name} • {settings.address} {settings.phone ? `• ${settings.phone}` : ''} • {settings.email}
              </p>
            )}
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
                <h3 className="text-xl font-bold text-slate-900">Facture enregistrée !</h3>
                <p className="text-sm text-slate-500 mt-2">
                  Votre facture {savedInvoiceId} a été créée et enregistrée avec succès.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => router.push('/invoices')}>
                  Retour aux factures
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
