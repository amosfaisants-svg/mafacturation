import Link from 'next/link';

export default function CtaSection() {
  return (
    <section className="px-gutter-sm py-space-xl">
      <div className="max-w-sm mx-auto bg-primary rounded-2xl p-space-lg text-center text-on-primary relative overflow-hidden shadow-xl md:max-w-4xl md:p-space-2xl">
        {/* Decorative radial highlights */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary-fixed/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-surface-container-lowest/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-on-primary/10 flex items-center justify-center mb-space-sm group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-primary-fixed text-[28px]">rocket_launch</span>
          </div>
          <h2 className="font-headline-xl-mobile text-headline-xl-mobile font-bold text-on-primary mb-space-xs leading-tight md:text-display-lg md:font-display-lg">
            Rejoins les entrepreneurs qui facturent comme des pros.
          </h2>
          <p className="font-body-md text-body-md text-on-primary-container max-w-xs mb-space-lg opacity-90 md:text-body-lg md:max-w-md">
            Prêt en 2 minutes. Sans carte bancaire requise.
          </p>
          <Link
            href="/dashboard"
            className="w-full h-12 rounded-lg bg-on-primary text-primary font-label-md text-label-md font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 hover:scale-105 transition-all group md:max-w-xs"
          >
            <span>Commencer gratuitement</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
