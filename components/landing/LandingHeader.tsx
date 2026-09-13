'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LandingHeader() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
        <div className="h-16 px-gutter-sm flex items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-xs">
            <img
              alt="Logo Mafacture"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1V62o93X-54FaFubHeNTwAaD2458ZfEF_qhFUCDZHcE1JZ0uI9cAJtD6FKCvXuR4VhNne6wIXedO0VnH9TeJGHQpaDeP2P51aRS7kqGcyOBkP8Q-Sl0LWW5OPLYgkqVjJF2G7OpXyJA9oimNw1PClYbeIrw7YBCOqY8X-vb6i_m8ZgiQ1TcFBAugawwZec-SpmbZmVh1Aj652kc5VICQL0YAfw3ryDNaV1FFegf9XeMvI2jAuTetqXazpI"
            />
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight ml-space-xs hidden sm:inline">
              Mafacture
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              Nouveau
            </span>
          </div>
          <div className="flex items-center gap-space-xs">
            <Link
              href="/dashboard"
              className="h-11 px-space-md rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold flex items-center justify-center transition-all hover:bg-primary-container active:scale-95 hover:scale-105 shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]"
            >
              Se connecter
            </Link>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
            <button
              aria-label="Ouvrir le menu"
              className="w-11 h-11 flex items-center justify-center rounded-lg text-on-surface hover:bg-surface-container-low transition-colors"
              onClick={() => setIsDrawerOpen(true)}
              type="button"
            >
              <span className="material-symbols-outlined text-on-surface text-[24px]">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out flex justify-end ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div
          className={`fixed inset-0 bg-inverse-surface/20 backdrop-blur-sm transition-opacity ${
            isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsDrawerOpen(false)}
        ></div>
        <div className="relative w-4/5 max-w-sm h-full bg-surface-container-lowest shadow-[0_20px_25px_-5px_rgba(15,23,42,0.08)] flex flex-col pt-safe pb-safe z-10">
          <div className="h-16 px-gutter-sm flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <img
                alt="Logo Mafacture"
                className="h-8 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1V62o93X-54FaFubHeNTwAaD2458ZfEF_qhFUCDZHcE1JZ0uI9cAJtD6FKCvXuR4VhNne6wIXedO0VnH9TeJGHQpaDeP2P51aRS7kqGcyOBkP8Q-Sl0LWW5OPLYgkqVjJF2G7OpXyJA9oimNw1PClYbeIrw7YBCOqY8X-vb6i_m8ZgiQ1TcFBAugawwZec-SpmbZmVh1Aj652kc5VICQL0YAfw3ryDNaV1FFegf9XeMvI2jAuTetqXazpI"
              />
              <span className="font-headline-sm text-headline-sm text-on-surface">Mafacture</span>
            </div>
            <button
              aria-label="Fermer le menu"
              className="w-11 h-11 flex items-center justify-center rounded-lg text-on-surface hover:bg-surface-container-low transition-colors"
              onClick={() => setIsDrawerOpen(false)}
              type="button"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>
          <nav className="flex-1 px-gutter-sm py-space-md flex flex-col gap-space-xs overflow-y-auto">
            <a
              className="flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-on-surface hover:bg-surface-container-low font-label-md text-label-md transition-colors group"
              href="#"
            >
              <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">home</span>
              Accueil
            </a>
            <a
              className="flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container-low font-label-md text-label-md transition-colors group"
              href="#features"
            >
              <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform">receipt_long</span>
              Fonctionnalités
            </a>
            <a
              className="flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container-low font-label-md text-label-md transition-colors group"
              href="#tax"
            >
              <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform">calculate</span>
              TVA & FCFA Conforme
            </a>
            <a
              className="flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container-low font-label-md text-label-md transition-colors group"
              href="#pricing"
            >
              <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform">payments</span>
              Tarifs PME
            </a>
            <a
              className="flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container-low font-label-md text-label-md transition-colors group"
              href="#testimonials"
            >
              <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform">verified</span>
              Avis Clients
            </a>
          </nav>
          <div className="p-gutter-sm flex flex-col gap-space-sm bg-surface-container-low">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[20px]">security</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Conforme OHADA & UEMOA
              </span>
            </div>
            <Link
              href="/dashboard"
              className="w-full h-11 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold flex items-center justify-center shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] hover:bg-primary-container transition-all active:scale-95"
            >
              Créer une facture test
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
