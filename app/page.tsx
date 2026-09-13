'use client';

import { useState } from 'react';
import LandingHeader from '@/components/landing/LandingHeader';
import HeroSection from '@/components/landing/HeroSection';
import ProblemsSection from '@/components/landing/ProblemsSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import PricingSection from '@/components/landing/PricingSection';
import CtaSection from '@/components/landing/CtaSection';
import LandingFooter from '@/components/landing/LandingFooter';
import VideoModal from '@/components/landing/VideoModal';

export default function Home() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface flex flex-col min-h-screen antialiased">
      <LandingHeader />
      
      <main className="flex flex-col relative w-full bg-surface">
        <div className="flex flex-col w-full text-on-surface overflow-x-hidden">
          <HeroSection onPlayVideo={() => setIsVideoModalOpen(true)} />
          <ProblemsSection />
          <FeaturesSection />
          <HowItWorksSection />
          <TestimonialsSection />
          <PricingSection />
          <CtaSection />
        </div>
      </main>

      <LandingFooter />
      
      <VideoModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} />
    </div>
  );
}
