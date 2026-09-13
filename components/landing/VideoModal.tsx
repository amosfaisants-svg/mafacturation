'use client';

import { useEffect } from 'react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ isOpen, onClose }: VideoModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-gutter-sm">
      <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-space-md shadow-2xl relative md:max-w-2xl">
        <div className="flex items-center justify-between mb-space-sm">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">play_circle</span>
            <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface">Démo Mafacture</h4>
          </div>
          <button
            aria-label="Fermer la démo"
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
            onClick={onClose}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
        <div className="relative w-full aspect-video bg-surface-container-high rounded-xl overflow-hidden flex flex-col items-center justify-center text-center p-4 group cursor-pointer">
          <img
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            alt="Mafacture software interface preview video teaser"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFAeG3sE0L4tubFpZiAIBNB5pAJPaLPoJlsKF0x_1QkdGFzZ_Gev3_i9BTTtTW4yq7HMhULC0jvNJxikwUDACgMcijEElzREE1_aWUWmwgUypC23Wys1y407vIMqa-c_ct8IH-46OXZbpXi9dqua6oCftB4yOnhPIXAUdrbnrrwgasb3a60beqnnr4-GaqfpOf5jeLnA96CXrinifNdEdWjsoTTgnO7wqe_3K7PS6zgGETUfv0bR_vsw"
          />
          <div className="relative z-10 w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg group-hover:scale-110 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-[28px]">play_arrow</span>
          </div>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant text-center mt-3">
          Découvrez comment générer une facture conforme OHADA en 45 secondes chrono.
        </p>
      </div>
    </div>
  );
}
