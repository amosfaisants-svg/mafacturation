import Link from 'next/link';

export default function HeroSection({ onPlayVideo }: { onPlayVideo: () => void }) {
  return (
    <section className="px-gutter-sm pt-space-md pb-space-xl flex flex-col items-center text-center relative mt-16">
      {/* Ambient glowing backdrop effect */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      
      {/* Trust pill badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-label-sm font-label-sm mb-space-md shadow-sm">
        <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
        <span>⚡ Conçu pour les entrepreneurs africains</span>
      </div>
      
      {/* Main Headline */}
      <h1 className="font-headline-xl-mobile text-headline-xl-mobile text-on-surface font-bold tracking-tight mb-space-sm md:font-display-lg md:text-display-lg md:max-w-3xl">
        Fini les factures bricolées sur Word et Excel.
      </h1>
      
      {/* Subtitle */}
      <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mx-auto mb-space-lg md:text-body-lg md:max-w-2xl">
        Créez des factures certifiées en FCFA, calculez la TVA 18% en un éclair et faites-vous payer 3x plus vite.
      </p>
      
      {/* CTAs */}
      <div className="w-full flex flex-col gap-space-xs max-w-xs mb-space-xl md:flex-row md:max-w-lg md:justify-center">
        <Link
          href="/dashboard"
          className="w-full h-12 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(0,105,72,0.35)] active:scale-95 hover:scale-105 transition-all group"
        >
          <span>Commencer gratuitement</span>
          <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </Link>
        <button
          type="button"
          onClick={onPlayVideo}
          className="w-full h-12 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md font-semibold flex items-center justify-center gap-2 hover:bg-surface-container-high active:scale-95 hover:scale-105 transition-all shadow-sm group"
        >
          <span className="material-symbols-outlined text-primary text-[20px] group-hover:scale-110 transition-transform">play_circle</span>
          <span>Voir la démo (1 min)</span>
        </button>
      </div>

      {/* Interactive Mobile Dashboard Mockup Card */}
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-xl shadow-[0_8px_30px_rgba(15,23,42,0.08)] p-space-md text-left relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
        {/* Top app indicator bar */}
        <div className="flex items-center justify-between pb-space-sm mb-space-sm bg-surface-container-low/50 -mx-space-md -mt-space-md px-space-md pt-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-error/60"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-tertiary/40"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-primary/60"></div>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary"></span> Direct • Abidjan & Dakar
          </span>
        </div>

        {/* Financial Metric Card */}
        <div className="bg-surface-container-low rounded-lg p-space-sm mb-space-md hover:bg-surface-container transition-colors duration-300">
          <div className="flex items-center justify-between mb-1">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Solde encaissé ce mois</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">
              +24%
            </span>
          </div>
          <div className="font-headline-sm text-headline-sm font-bold text-on-surface font-tabular-mono">
            2 850 000 <span className="text-body-sm font-body-sm text-primary">FCFA</span>
          </div>
          {/* Inline Sparkline Curve SVG */}
          <div className="mt-2 w-full h-10">
            <svg className="w-full h-full" fill="none" viewBox="0 0 280 40">
              <path d="M0 35 C 40 32, 60 25, 90 27 C 130 30, 160 12, 200 15 C 230 18, 250 5, 280 4" fill="none" stroke="#006948" strokeLinecap="round" strokeWidth="2.5"></path>
              <path d="M0 35 C 40 32, 60 25, 90 27 C 130 30, 160 12, 200 15 C 230 18, 250 5, 280 4 L 280 40 L 0 40 Z" fill="url(#green-gradient)" opacity="0.15"></path>
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="green-gradient" x1="0" x2="0" y1="0" y2="40">
                  <stop stopColor="#006948"></stop>
                  <stop offset="1" stopColor="#006948" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Mini Live Invoice Item Preview */}
        <div className="bg-surface-container rounded-lg p-space-sm shadow-sm relative hover:bg-surface-container-high transition-colors duration-300">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-bold text-body-sm">
                DT
              </div>
              <div>
                <p className="font-label-md text-label-md font-semibold text-on-surface leading-tight">Dakar Tech SARL</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Facture #FAC-2025-084</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Payée
            </span>
          </div>
          <div className="pt-2 mt-2 bg-surface-container-lowest/60 rounded p-2 flex justify-between items-center text-body-sm">
            <div>
              <span className="text-on-surface-variant font-body-sm block">TVA 18% (Automatique)</span>
              <span className="font-tabular-mono font-semibold text-on-surface">72 000 FCFA</span>
            </div>
            <div className="text-right">
              <span className="text-on-surface-variant font-body-sm block">Total TTC</span>
              <span className="font-tabular-mono font-bold text-headline-sm text-primary">472 000 FCFA</span>
            </div>
          </div>
        </div>

        {/* Mobile payment receipt confirmation pill */}
        <div className="mt-space-sm flex items-center justify-between px-3 py-2 rounded-lg bg-surface-container-high text-on-surface text-body-sm">
          <span className="flex items-center gap-1.5 font-label-sm">
            <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
            Reçu via Wave & OM
          </span>
          <span className="text-primary font-tabular-mono text-label-sm font-semibold">Instant</span>
        </div>
      </div>
    </section>
  );
}
