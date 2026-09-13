export default function LandingFooter() {
  return (
    <footer className="px-gutter-sm pt-space-lg pb-space-2xl bg-surface-container-highest/60 text-on-surface mt-space-md">
      <div className="max-w-sm mx-auto flex flex-col gap-space-lg md:max-w-5xl md:flex-row md:justify-between md:items-start">
        {/* Brand & Mission */}
        <div className="flex flex-col gap-space-xs md:max-w-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">keyboard_double_arrow_down</span>
            </div>
            <span className="font-headline-sm text-headline-sm font-bold text-on-surface">Mafacture</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
            Le logiciel de facturation moderne pensé pour libérer les entrepreneurs et PME d'Afrique francophone.
          </p>
        </div>
        {/* Quick Navigation Links */}
        <div className="grid grid-cols-2 gap-space-md text-body-sm md:gap-space-xl">
          <div className="flex flex-col gap-2">
            <span className="font-label-sm text-label-sm font-semibold text-on-surface uppercase tracking-wider mb-2">Produit</span>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#features">Fonctionnalités</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#pricing">Tarifs</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#tax">TVA 18% & OHADA</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Modèles PDF</a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-label-sm text-label-sm font-semibold text-on-surface uppercase tracking-wider mb-2">Légal & Support</span>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Confidentialité</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Conditions (CGU)</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Sécurité bancaire</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Support WhatsApp</a>
          </div>
        </div>
      </div>
      <div className="max-w-sm mx-auto mt-space-lg md:max-w-5xl">
        {/* Social and Community Links */}
        <div className="flex items-center justify-between pt-space-sm border-t border-outline-variant/30">
          <div className="flex items-center gap-3">
            <a aria-label="LinkedIn" className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:text-primary transition-colors hover:scale-110" href="#">
              <span className="font-label-md font-bold text-[14px]">in</span>
            </a>
            <a aria-label="Twitter / X" className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:text-primary transition-colors hover:scale-110" href="#">
              <span className="font-label-md font-bold text-[14px]">𝕏</span>
            </a>
            <a aria-label="Facebook" className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:text-primary transition-colors hover:scale-110" href="#">
              <span className="font-label-md font-bold text-[14px]">f</span>
            </a>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant">© 2025 Mafacture Inc.</span>
        </div>
        {/* Pride mention */}
        <div className="text-center mt-6">
          <p className="font-label-sm text-label-sm text-primary font-semibold flex items-center justify-center gap-1.5 bg-primary-fixed/40 py-2 rounded-lg md:w-max md:mx-auto md:px-4">
            <span>Fait avec fierté en Afrique</span>
            <span>🌍</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
