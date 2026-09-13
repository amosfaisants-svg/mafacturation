export default function HowItWorksSection() {
  return (
    <section className="px-gutter-sm py-space-xl bg-surface-container-low" id="how-it-works">
      <div className="text-center max-w-xs mx-auto mb-space-lg md:max-w-2xl">
        <span className="inline-block px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-wider mb-2">
          Simplicité absolue
        </span>
        <h2 className="font-headline-xl-mobile text-headline-xl-mobile font-bold text-on-surface md:text-headline-xl md:font-headline-xl">
          Opérationnel en moins de 2 minutes
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1 md:text-body-lg">
          Aucune installation complexe, accessible sur smartphone ou ordinateur.
        </p>
      </div>
      {/* Vertical Timeline */}
      <div className="max-w-sm mx-auto flex flex-col gap-space-md relative md:max-w-2xl">
        {/* Continuous vertical guideline */}
        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-primary/20 -z-0"></div>
        {/* Step 1 */}
        <div className="flex items-start gap-space-md relative z-10 group">
          <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-headline-sm shadow-md shrink-0 group-hover:scale-110 transition-transform">
            1
          </div>
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex-1 group-hover:-translate-y-1 group-hover:shadow-md transition-all">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">
              Inscris-toi en 30 secondes
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Renseigne ton nom d'entreprise et ton contact. Aucune carte bancaire n'est requise pour débuter.
            </p>
          </div>
        </div>
        {/* Step 2 */}
        <div className="flex items-start gap-space-md relative z-10 group">
          <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-headline-sm shadow-md shrink-0 group-hover:scale-110 transition-transform">
            2
          </div>
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex-1 group-hover:-translate-y-1 group-hover:shadow-md transition-all">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">
              Crée ta facture en FCFA
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Ajoute tes prestations. Les calculs de montants HT, TVA 18% et remises s'ajustent automatiquement.
            </p>
          </div>
        </div>
        {/* Step 3 */}
        <div className="flex items-start gap-space-md relative z-10 group">
          <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-headline-sm shadow-md shrink-0 group-hover:scale-110 transition-transform">
            3
          </div>
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex-1 group-hover:-translate-y-1 group-hover:shadow-md transition-all">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">
              Envoie et reçois tes paiements
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Partage le lien de paiement WhatsApp ou le PDF certifié. Suis chaque validation en direct.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
