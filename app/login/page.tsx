'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { createClient } from '@/utils/supabase/client';
import { FileText, Loader2, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        router.push('/dashboard');
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        
        setSuccess('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
        setIsLogin(true);
      }
      
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Colonne Gauche - Formulaire */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex items-center gap-2 mb-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
              <FileText size={22} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">Facturio</span>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              {isLogin ? 'Bon retour !' : 'Commencez gratuitement'}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {isLogin 
                ? 'Veuillez vous connecter à votre compte.' 
                : 'Créez un compte pour gérer vos factures en toute simplicité.'}
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">Adresse email</Label>
                <div className="mt-1">
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="vous@entreprise.com" 
                    required 
                    className="block w-full rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 bg-slate-50/50 py-2.5 transition-colors"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">Mot de passe</Label>
                <div className="mt-1">
                  <Input 
                    id="password" 
                    type="password" 
                    required 
                    placeholder="••••••••"
                    className="block w-full rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 bg-slate-50/50 py-2.5 transition-colors"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              
              {error && (
                <div className="rounded-lg bg-red-50 p-4 border border-red-100 animate-in fade-in slide-in-from-top-1">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Erreur</h3>
                      <div className="mt-1 text-sm text-red-700">{error}</div>
                    </div>
                  </div>
                </div>
              )}

              {success && (
                <div className="rounded-lg bg-green-50 p-4 border border-green-100 animate-in fade-in slide-in-from-top-1">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Succès</h3>
                      <div className="mt-1 text-sm text-green-700">{success}</div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Button type="submit" className="w-full flex justify-center py-2.5 rounded-xl shadow-md transition-transform hover:-translate-y-0.5 bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                  {loading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      {isLogin ? 'Se connecter' : "S'inscrire"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-slate-500">Ou</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError(null);
                    setSuccess(null);
                  }}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  {isLogin 
                    ? "Vous n'avez pas de compte ? Créez-en un." 
                    : 'Vous avez déjà un compte ? Connectez-vous.'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Colonne Droite - Image/Décoration */}
      <div className="relative hidden w-0 flex-1 lg:block bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900 opacity-90 mix-blend-multiply" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="relative h-full flex flex-col items-center justify-center px-12 text-center overflow-hidden">
          <h2 className="text-4xl font-bold text-white tracking-tight sm:text-5xl mb-6">
            Simplifiez votre facturation.
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl">
            Facturio est l'outil indispensable pour les indépendants. Gérez vos clients, émettez vos factures et suivez vos paiements sur une plateforme élégante et sécurisée.
          </p>
          
          {/* Dashboard Preview Mockup */}
          <div className="mt-12 w-full max-w-3xl rounded-xl bg-white/10 p-2 backdrop-blur-md border border-white/20 shadow-2xl overflow-hidden transform perspective-[1000px] rotate-y-[-10deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 ease-out">
            <div className="rounded-lg bg-slate-50 overflow-hidden shadow-inner">
              <div className="h-6 bg-slate-200 border-b border-slate-300 flex items-center px-3 gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-orange-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
              </div>
              <div className="p-6 grid grid-cols-3 gap-4 h-64 opacity-80">
                <div className="h-24 bg-white rounded shadow-sm border border-slate-100"></div>
                <div className="h-24 bg-white rounded shadow-sm border border-slate-100"></div>
                <div className="h-24 bg-white rounded shadow-sm border border-slate-100"></div>
                <div className="col-span-3 h-full bg-white rounded shadow-sm border border-slate-100 mt-2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
