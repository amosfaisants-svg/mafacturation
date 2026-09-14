'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Save, User, Building, Bell, Loader2, Upload } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { getSettings, updateSettings } from '@/lib/api/settings';

export default function SettingsPage() {
  const supabase = createClient();
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    company_name: '',
    siret: '',
    address: '',
    currency: 'XOF',
    language: 'fr',
    logo_url: '',
    phone: ''
  });

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await getSettings(supabase);
      setFormData({
        full_name: data.full_name || '',
        email: data.email || '',
        company_name: data.company_name || '',
        siret: data.siret || '',
        address: data.address || '',
        currency: data.currency || 'XOF',
        language: data.language || 'fr',
        logo_url: data.logo_url || '',
        phone: data.phone || ''
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateSettings(supabase, formData);
      alert('Paramètres enregistrés avec succès');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Erreur lors de l\'enregistrement des paramètres');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert("L'image est trop volumineuse. La taille maximum est de 4Mo.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logo_url: reader.result as string });
      };
      reader.readAsDataURL(file);
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
          <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
          <p className="text-sm text-slate-500">Gérez les informations de votre compte et vos préférences.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-2 animate-spin h-4 w-4" /> : <Save size={18} className="mr-2" />}
          {isSaving ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne gauche (Profil) */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="flex items-center gap-2">
                <User size={20} className="text-blue-600" />
                Profil
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Nom complet</label>
                <Input 
                  value={formData.full_name} 
                  onChange={e => setFormData({...formData, full_name: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Adresse email</label>
                <Input 
                  type="email" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  disabled // L'email est souvent lié au compte auth, à ne pas modifier directement ici
                />
                <p className="text-xs text-slate-400">Liée à votre compte de connexion.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne droite (Entreprise & Préférences) */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="flex items-center gap-2">
                <Building size={20} className="text-blue-600" />
                Informations de l&apos;entreprise
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Nom de l&apos;entreprise</label>
                  <Input 
                    value={formData.company_name} 
                    onChange={e => setFormData({...formData, company_name: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">N° SIRET / TVA</label>
                  <Input 
                    value={formData.siret} 
                    onChange={e => setFormData({...formData, siret: e.target.value})} 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Adresse complète</label>
                  <Input 
                    value={formData.address} 
                    onChange={e => setFormData({...formData, address: e.target.value})} 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Numéros de téléphone de l&apos;entreprise</label>
                  <Input 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                    placeholder="Ex: +225 0102030405"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Logo de l&apos;entreprise</label>
                  <div className="flex items-center gap-4">
                    {formData.logo_url && (
                      <div className="h-16 w-16 relative rounded-lg border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center p-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={formData.logo_url} alt="Logo" className="max-h-full max-w-full object-contain" />
                      </div>
                    )}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleLogoUpload} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-2"
                    >
                      <Upload size={16} />
                      {formData.logo_url ? 'Changer de logo' : 'Importer un logo'}
                    </Button>
                    {formData.logo_url && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={() => setFormData({ ...formData, logo_url: '' })}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2"
                      >
                        Supprimer
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">Formats acceptés : JPG, PNG. Poids max : 4Mo.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="flex items-center gap-2">
                <Bell size={20} className="text-blue-600" />
                Préférences
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Devise par défaut</label>
                  <Select 
                    value={formData.currency} 
                    onChange={e => setFormData({...formData, currency: e.target.value})}
                  >
                    <option value="XOF">Franc CFA (XOF)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="USD">Dollar ($)</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Langue</label>
                  <Select 
                    value={formData.language} 
                    onChange={e => setFormData({...formData, language: e.target.value})}
                  >
                    <option value="fr">Français</option>
                    <option value="en">Anglais</option>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
