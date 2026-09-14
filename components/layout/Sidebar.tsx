'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  HelpCircle,
  Moon,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Factures', href: '/invoices', icon: FileText },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Paramètres', href: '/settings', icon: Settings },
];

export default function Sidebar({ className, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className={cn("w-64 bg-white border-r border-slate-200 flex flex-col print:hidden", className)}>
      <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <span className="text-xl font-bold text-blue-600 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <FileText size={18} />
          </div>
          Facturio
        </span>
      </div>

      <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">
          Menu
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium hover:translate-x-1",
                isActive 
                  ? "bg-slate-100 text-blue-700" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <item.icon size={18} className={isActive ? "text-blue-600" : "text-slate-400"} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-100 space-y-2">
        <button className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-slate-600 hover:bg-slate-50 transition-all duration-200 text-sm font-medium hover:translate-x-1">
          <HelpCircle size={18} className="text-slate-400" />
          Aide & Support
        </button>
        <button className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-slate-600 hover:bg-slate-50 transition-all duration-200 text-sm font-medium justify-between hover:translate-x-1">
          <div className="flex items-center gap-3">
            <Moon size={18} className="text-slate-400" />
            Mode Sombre
          </div>
          <div className="w-8 h-4 bg-slate-200 rounded-full flex items-center p-0.5">
            <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
          </div>
        </button>
      </div>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-slate-900 truncate">
              {user ? (user.user_metadata?.full_name || user.email) : 'Chargement...'}
            </p>
            <p className="text-xs text-slate-500 truncate">Connecté</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-red-600 hover:bg-red-50 transition-all duration-200 text-sm font-medium hover:translate-x-1"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </div>
  );
}
