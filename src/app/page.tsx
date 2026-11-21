"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { SocialProof } from "@/components/SocialProof";
import { InteractiveDemo } from "@/components/InteractiveDemo";
import { Features } from "@/components/Features";
import { RoiCalculator } from "@/components/RoiCalculator";
import { Pricing } from "@/components/Pricing";
import { Testimonials } from "@/components/Testimonials";
import { Faq } from "@/components/Faq";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { WaitlistModal } from "@/components/WaitlistModal";

export default function HomePage() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const handleOpenWaitlist = () => {
    setIsWaitlistOpen(true);
  };

  const handleCloseWaitlist = () => {
    setIsWaitlistOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-brand-500 selection:text-white">
      {/* Navigation */}
      <Navbar onOpenWaitlist={handleOpenWaitlist} />

      {/* Main Page Sections */}
      <main className="flex-1">
        <Hero onOpenWaitlist={handleOpenWaitlist} />
        <SocialProof />
        <InteractiveDemo />
        <Features />
        <RoiCalculator onOpenWaitlist={handleOpenWaitlist} />
        <Pricing onOpenWaitlist={handleOpenWaitlist} />
        <Testimonials />
        <Faq />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Waitlist Lead Capture Modal */}
      <WaitlistModal isOpen={isWaitlistOpen} onClose={handleCloseWaitlist} />
    </div>
  );
}
