'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Plus, Edit2, Trash2, Loader2, X } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { getClients, createClient as apiCreateClient, updateClient, deleteClient } from '@/lib/api/clients';
import { Database } from '@/lib/database.types';

type ClientRow = Database['public']['Tables']['clients']['Row'];

export default function ClientsPage() {
  const supabase = createClient();
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getClients(supabase);
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateForm = () => {
    setEditingClientId(null);
    setFormData({ name: '', email: '', phone: '', address: '' });
    setShowForm(true);
  };

  const handleOpenEditForm = (client: ClientRow) => {
    setEditingClientId(client.id);
    setFormData({
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || ''
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingClientId(null);
    setFormData({ name: '', email: '', phone: '', address: '' });
  };

  const handleSave = async () => {
    if (!formData.name) {
      alert("Le nom du client est obligatoire.");
      return;
    }
    
    try {
      setIsSaving(true);
      if (editingClientId) {
        // Update existing client
        const updated = await updateClient(supabase, editingClientId, formData);
        setClients(clients.map(c => c.id === editingClientId ? updated : c));
      } else {
        // Create new client
        const newClient = await apiCreateClient(supabase, formData);
        setClients([newClient, ...clients]);
      }
      handleCloseForm();
    } catch (error) {
      console.error('Error saving client:', error);
      alert("Erreur lors de l'enregistrement du client.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) return;
    
    try {
      await deleteClient(supabase, id);
      setClients(clients.filter(c => c.id !== id));
      if (editingClientId === id) {
        handleCloseForm();
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('Impossible de supprimer ce client. Il est peut-être lié à des factures.');
    }
  };

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
          <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
          <p className="text-sm text-slate-500">Gérez votre répertoire de clients.</p>
        </div>
        <Button onClick={handleOpenCreateForm}>
          <Plus size={18} className="mr-2" />
          Nouveau Client
        </Button>
      </div>

      {showForm && (
        <Card className="border-blue-200 bg-blue-50/50 transition-all animate-in fade-in duration-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{editingClientId ? 'Modifier le client' : 'Ajouter un client'}</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600" onClick={handleCloseForm}>
              <X size={18} />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input id="name" placeholder="Nom de l'entreprise ou du client" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="contact@email.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" placeholder="+225 ..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input id="address" placeholder="Ville, Quartier, Pays" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={handleCloseForm}>Annuler</Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id} className="hover:bg-slate-50 transition-colors">
                  <TableCell className="font-medium text-slate-900">{client.name}</TableCell>
                  <TableCell className="text-slate-600">{client.email || '-'}</TableCell>
                  <TableCell className="text-slate-600">{client.phone || '-'}</TableCell>
                  <TableCell className="text-slate-600">{client.address || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => handleOpenEditForm(client)}
                        title="Modifier le client"
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(client.id)}
                        title="Supprimer le client"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {clients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                    Aucun client enregistré.
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

