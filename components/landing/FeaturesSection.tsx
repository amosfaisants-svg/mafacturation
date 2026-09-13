export default function FeaturesSection() {
  return (
    <section className="px-gutter-sm py-space-xl" id="features">
      <div className="text-center max-w-xs mx-auto mb-space-lg md:max-w-2xl">
        <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm uppercase tracking-wider mb-2">
          Tout-en-un
        </span>
        <h2 className="font-headline-xl-mobile text-headline-xl-mobile font-bold text-on-surface md:text-headline-xl md:font-headline-xl">
          Fait pour accélérer vos encaissements
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1 md:text-body-lg">
          Des outils précis calibrés pour les réalités du commerce en Afrique francophone.
        </p>
      </div>
      {/* 4 Feature Cards */}
      <div className="grid grid-cols-1 gap-space-md max-w-sm mx-auto md:grid-cols-2 md:max-w-4xl">
        {/* Feature 1 */}
        <div className="p-space-md rounded-xl bg-surface-container shadow-sm flex flex-col group hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center mb-space-sm shadow-sm group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[26px]">receipt_long</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">
            Factures professionnelles en 2 clics
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant mb-space-sm flex-1">
            Export PDF haute résolution avec votre logo, vos coordonnées officielles et transmission directe par WhatsApp et par email.
          </p>
          <div className="p-2.5 rounded-lg bg-surface-container-lowest flex items-center justify-between text-body-sm">
            <span className="text-on-surface font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">send</span> Envoi WhatsApp instantané
            </span>
            <span className="text-label-sm font-label-sm text-primary font-bold">1 clic</span>
          </div>
        </div>
        {/* Feature 2 */}
        <div className="p-space-md rounded-xl bg-surface-container shadow-sm flex flex-col group hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center mb-space-sm shadow-sm group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[26px]">percent</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">
            TVA 18% calculée automatiquement
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant mb-space-sm flex-1">
            Ventilation instantanée Montant HT, TVA à 18% et Total TTC sans aucune formule mathématique. Conforme OHADA et UEMOA.
          </p>
          <div className="p-2.5 rounded-lg bg-surface-container-lowest flex items-center justify-between text-body-sm">
            <span className="text-on-surface font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">gavel</span> Conforme DGI & OHADA
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-bold">Vérifié</span>
          </div>
        </div>
        {/* Feature 3 */}
        <div className="p-space-md rounded-xl bg-surface-container shadow-sm flex flex-col group hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center mb-space-sm shadow-sm group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[26px]">notifications_active</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">
            Suivi des paiements en temps réel
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant mb-space-sm flex-1">
            Notification instantanée dès que votre client consulte la facture ou déclenche le règlement via Wave, Orange Money ou virement.
          </p>
          <div className="p-2.5 rounded-lg bg-surface-container-lowest flex items-center justify-between text-body-sm">
            <span className="text-on-surface font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-tertiary text-[18px]">payments</span> Mobile Money & Virement
            </span>
            <span className="text-label-sm font-label-sm text-on-surface-variant">Live ping</span>
          </div>
        </div>
        {/* Feature 4 */}
        <div className="p-space-md rounded-xl bg-surface-container shadow-sm flex flex-col group hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center mb-space-sm shadow-sm group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[26px]">groups</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">
            Gestion de clients intégrée
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant mb-space-sm flex-1">
            Annuaire client unifié avec suivi des devis émis, encaissements passés et solde restant dû par entreprise en un coup d'œil.
          </p>
          <div className="p-2.5 rounded-lg bg-surface-container-lowest flex items-center justify-between text-body-sm">
            <span className="text-on-surface font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[18px]">folder_shared</span> Fiche client complète
            </span>
            <span className="font-label-sm text-label-sm text-primary font-bold">Accessible</span>
          </div>
        </div>
      </div>
    </section>
  );
}
