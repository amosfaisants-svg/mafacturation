export default function ProblemsSection() {
  return (
    <section className="px-gutter-sm py-space-xl bg-surface-container-low" id="problems">
      <div className="text-center max-w-xs mx-auto mb-space-lg md:max-w-2xl">
        <span className="inline-block px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm uppercase tracking-wider mb-2">
          La réalité du terrain
        </span>
        <h2 className="font-headline-xl-mobile text-headline-xl-mobile font-bold text-on-surface md:text-headline-xl md:font-headline-xl">
          La réalité de la facturation aujourd’hui
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1 md:text-body-lg">
          Trois pièges qui bloquent la trésorerie de votre entreprise au quotidien.
        </p>
      </div>
      <div className="flex flex-col gap-space-sm max-w-sm mx-auto md:flex-row md:max-w-5xl md:gap-space-md">
        {/* Card 01 */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-2 group hover:-translate-y-1 transition-transform duration-300 cursor-pointer flex-1">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-error-container text-on-error-container flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">description</span>
            </div>
            <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-tabular-mono">01</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
            Factures bricolées sur Word
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Crédibilité entamée auprès des grands comptes, tableaux déformés sur mobile et manque cruel d’image professionnelle.
          </p>
        </div>
        {/* Card 02 */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-2 group hover:-translate-y-1 transition-transform duration-300 cursor-pointer flex-1">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-error-container text-on-error-container flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">calculate</span>
            </div>
            <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-tabular-mono">02</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
            Calculs manuels de TVA 18% à l'aveugle
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Erreurs de centimes coûteuses, angoisse des déclarations fiscales à Abidjan, Dakar ou Yaoundé et régularisations imprévues.
          </p>
        </div>
        {/* Card 03 */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-2 group hover:-translate-y-1 transition-transform duration-300 cursor-pointer flex-1">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-error-container text-on-error-container flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">timer_off</span>
            </div>
            <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-tabular-mono">03</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
            Suivi des impayés impossible
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Relances WhatsApp manuelles oubliées, trésorerie tendue et argent qui dort dehors pendant des mois sans visibilité.
          </p>
        </div>
      </div>
    </section>
  );
}
