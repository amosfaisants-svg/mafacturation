import Image from 'next/image';

export default function TestimonialsSection() {
  return (
    <section className="px-gutter-sm py-space-xl" id="testimonials">
      <div className="text-center max-w-xs mx-auto mb-space-lg md:max-w-2xl">
        <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm uppercase tracking-wider mb-2">
          Avis certifiés
        </span>
        <h2 className="font-headline-xl-mobile text-headline-xl-mobile font-bold text-on-surface md:text-headline-xl md:font-headline-xl">
          Ils accélèrent leur business avec Mafacture
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1 md:text-body-lg">
          Découvrez les retours des fondateurs et directeurs de PME à travers l'Afrique.
        </p>
      </div>
      {/* Testimonials List */}
      <div className="flex flex-col gap-space-md max-w-sm mx-auto md:flex-row md:max-w-5xl md:items-stretch">
        {/* Testimonial 1 */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-[0_2px_12px_rgba(15,23,42,0.06)] flex flex-col gap-space-sm flex-1 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center gap-1 text-primary">
            <span className="material-symbols-outlined text-[18px]">star</span>
            <span className="material-symbols-outlined text-[18px]">star</span>
            <span className="material-symbols-outlined text-[18px]">star</span>
            <span className="material-symbols-outlined text-[18px]">star</span>
            <span className="material-symbols-outlined text-[18px]">star</span>
          </div>
          <blockquote className="font-body-md text-body-md text-on-surface italic flex-1">
            « J'ai récupéré 1,4 million de FCFA d'impayés dès la première semaine grâce aux relances automatiques. C'est le jour et la nuit avec mes anciens tableaux. »
          </blockquote>
          <div className="flex items-center gap-3 pt-space-xs">
            <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 bg-surface-container relative">
              <img
                className="w-full h-full object-cover"
                alt="Portrait of Mamadou Diop"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMwgmFx_15qlJjEBS5LZ7-8bnRT6hjjoK2JDe4t4zwFYG3JqXDEQ_k0tK44qFELF6l4OMVM6aghWTxQ7L3pNcelKa5o_6u4Cnc8PLAOtOr07SOpCzrHVcpBK16kDP4K1RjfUR0qaaeuQF5uCqYt7b6WIyFyQHZG03CkM01_oQle86T893LCgk8pU1zp4N--TWeVDms28EnaXbBYLZ0pw_uDfbe0ujG1bNxFsMKjBeLWh2BGEc_ozK1Rg"
              />
            </div>
            <div>
              <div className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                <span>Mamadou Diop</span>
                <span>🇸🇳</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Fondateur de Dakar Logistics • Sénégal</p>
            </div>
          </div>
        </div>
        {/* Testimonial 2 */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-[0_2px_12px_rgba(15,23,42,0.06)] flex flex-col gap-space-sm flex-1 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center gap-1 text-primary">
            <span className="material-symbols-outlined text-[18px]">star</span>
            <span className="material-symbols-outlined text-[18px]">star</span>
            <span className="material-symbols-outlined text-[18px]">star</span>
            <span className="material-symbols-outlined text-[18px]">star</span>
            <span className="material-symbols-outlined text-[18px]">star</span>
          </div>
          <blockquote className="font-body-md text-body-md text-on-surface italic flex-1">
            « Le calcul automatique de la TVA 18% me fait gagner au moins 5 heures chaque fin de mois. Mes bilans comptables à Abidjan sont limpides. »
          </blockquote>
          <div className="flex items-center gap-3 pt-space-xs">
            <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 bg-surface-container relative">
              <img
                className="w-full h-full object-cover"
                alt="Portrait of Aïssatou Kouassi"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBym7Eu_kk-gWac4lJXHlSDFJ18F0Bd11Dea4Mt1nAK495u4t95LSgGtmQI82PRJidfGX-4OlrBFEbg_CesfYbKhedxzVaFOxrEhLDEbAXaHYdKsLszKBZRJrIhl5jEQDf_FSBMfCQgt6YMSneYUQ_odLEGJZW1-FZv7aaGYHftKGJrESg4pvZ69w8D5brJNjTNpv64QuuoHpuEL0GdnesR04FOmrRVKuxttR4J0Ufr-7YQEdBnkpbsFQ"
              />
            </div>
            <div>
              <div className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                <span>Aïssatou Kouassi</span>
                <span>🇨🇮</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Directrice d’Agence Créative • Côte d’Ivoire</p>
            </div>
          </div>
        </div>
        {/* Testimonial 3 */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-[0_2px_12px_rgba(15,23,42,0.06)] flex flex-col gap-space-sm flex-1 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center gap-1 text-primary">
            <span className="material-symbols-outlined text-[18px]">star</span>
            <span className="material-symbols-outlined text-[18px]">star</span>
            <span className="material-symbols-outlined text-[18px]">star</span>
            <span className="material-symbols-outlined text-[18px]">star</span>
            <span className="material-symbols-outlined text-[18px]">star</span>
          </div>
          <blockquote className="font-body-md text-body-md text-on-surface italic flex-1">
            « Mes clients sont impressionnés par le professionnalisme de mes factures. Plus jamais de tableau Excel bricolé tard le soir ! »
          </blockquote>
          <div className="flex items-center gap-3 pt-space-xs">
            <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 bg-surface-container relative">
              <img
                className="w-full h-full object-cover"
                alt="Portrait of Jean-Paul Mbarga"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgQ8323SOedoRp5NExR2EzmzwXSK78lF__czSBVZoHbYqxhYhS1M8DQZ2zl_Mo0IT9Sr9glWedM_RR0zKi9eKXA8cUWfBTwJVx3ky2TkP1WFmVaZ7oF5wumBm8OwD7i2bXPVCE0jdjjmNrS1qpcJwFMk0hdGATLTsw81yEP8nBrRVt4prPjV5NDZ6bgZHcUqUHh7I1dJwfVuh1iAGRIEGpSFhVG5BGfLiS_gEIpjL_G3ZfqRbq4khQig"
              />
            </div>
            <div>
              <div className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                <span>Jean-Paul Mbarga</span>
                <span>🇨🇲</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Consultant IT indépendant • Cameroun</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
