import Link from 'next/link';

export default function PricingSection() {
  return (
    <section className="px-gutter-sm py-space-xl bg-surface-container-low" id="pricing">
      <div className="text-center max-w-xs mx-auto mb-space-lg md:max-w-2xl">
        <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm uppercase tracking-wider mb-2">
          Sans engagement
        </span>
        <h2 className="font-headline-xl-mobile text-headline-xl-mobile font-bold text-on-surface md:text-headline-xl md:font-headline-xl">
          Tarification transparente en FCFA
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1 md:text-body-lg">
          Choisissez la formule adaptée à votre stade de croissance.
        </p>
      </div>
      <div className="flex flex-col gap-space-md max-w-sm mx-auto md:flex-row md:max-w-5xl md:items-stretch">
        {/* Plan Gratuit */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col flex-1 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Plan Gratuit</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Idéal pour se lancer</p>
            </div>
            <span className="font-headline-sm text-headline-sm font-bold text-on-surface font-tabular-mono">0 <span className="text-body-sm">FCFA</span></span>
          </div>
          <ul className="flex flex-col gap-2 my-space-md text-body-sm flex-1">
            <li className="flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span> 5 factures & devis par mois
            </li>
            <li className="flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span> 1 utilisateur
            </li>
            <li className="flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span> Calcul automatique TVA 18%
            </li>
            <li className="flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span> Export PDF officiel
            </li>
          </ul>
          <Link
            href="/dashboard"
            className="w-full h-11 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold flex items-center justify-center hover:bg-surface-container-highest transition-colors active:scale-95"
          >
            Créer un compte
          </Link>
        </div>
        {/* Plan Pro (HIGHLIGHTED) */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-[0_8px_25px_rgba(0,105,72,0.15)] flex flex-col relative flex-1 hover:-translate-y-1 transition-transform duration-300 transform md:scale-105 z-10 border-2 border-primary/20">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold tracking-wider uppercase shadow-sm whitespace-nowrap">
            LE PLUS POPULAIRE
          </div>
          <div className="flex justify-between items-start mb-2 mt-2">
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Plan Pro</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Pour les indépendants & TPE</p>
            </div>
            <div className="text-right">
              <span className="font-headline-sm text-headline-sm font-bold text-primary font-tabular-mono">5 000 <span className="text-body-sm text-on-surface-variant">FCFA</span></span>
              <span className="block text-label-sm text-on-surface-variant">/mois</span>
            </div>
          </div>
          <ul className="flex flex-col gap-2 my-space-md text-body-sm flex-1">
            <li className="flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span> Factures et devis <strong>illimités</strong>
            </li>
            <li className="flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span> Relances WhatsApp automatiques
            </li>
            <li className="flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span> Personnalisation complète (logo, couleurs)
            </li>
            <li className="flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span> Support prioritaire 7j/7
            </li>
          </ul>
          <Link
            href="/dashboard"
            className="w-full h-11 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold flex items-center justify-center shadow-[0_2px_8px_rgba(0,105,72,0.25)] hover:bg-primary-container transition-colors active:scale-95"
          >
            Essayer Pro gratuitement
          </Link>
        </div>
        {/* Plan Business */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col flex-1 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Plan Business</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Pour les PME établies</p>
            </div>
            <div className="text-right">
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface font-tabular-mono">15 000 <span className="text-body-sm text-on-surface-variant">FCFA</span></span>
              <span className="block text-label-sm text-on-surface-variant">/mois</span>
            </div>
          </div>
          <ul className="flex flex-col gap-2 my-space-md text-body-sm flex-1">
            <li className="flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span> Multi-utilisateurs (jusqu'à 5 membres)
            </li>
            <li className="flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span> Multi-devises (FCFA, EUR, USD)
            </li>
            <li className="flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span> Export comptable certifié OHADA
            </li>
            <li className="flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span> Gestionnaire de compte dédié
            </li>
          </ul>
          <Link
            href="/dashboard"
            className="w-full h-11 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold flex items-center justify-center hover:bg-surface-container-highest transition-colors active:scale-95"
          >
            Choisir Business
          </Link>
        </div>
      </div>
    </section>
  );
}
