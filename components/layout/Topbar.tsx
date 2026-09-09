'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';

export default function Topbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 z-10 shrink-0 print:hidden">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-slate-500 hover:text-slate-700"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-md w-64 focus-within:ring-2 focus-within:ring-blue-100 focus-within:bg-white border border-transparent focus-within:border-blue-300 transition-all">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
            />
            <div className="flex items-center justify-center bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[10px] font-medium text-slate-400 shadow-sm">
              ⌘K
            </div>
          </div>
        </div>
        
        {/* Right actions */}
        <div className="flex items-center gap-4">
          <Link href="/invoices/create">
            <button className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg transition-transform hover:scale-105 active:scale-95 text-sm font-medium shadow-sm">
              + Nouvelle Facture
            </button>
          </Link>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar Panel */}
          <div className="relative w-64 max-w-sm h-full flex flex-col bg-white shadow-xl animate-in slide-in-from-left duration-300">
            <button 
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={20} />
            </button>
            <Sidebar className="w-full flex-1" onClose={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
