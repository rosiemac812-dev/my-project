"use client";

import { useState } from "react";
import { CryptoTicker } from "@/components/CryptoTicker";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { InteractiveTradingView } from "@/components/InteractiveTradingView";
import { Features } from "@/components/Features";
import { StakingCalculator } from "@/components/StakingCalculator";
import { Tokenomics } from "@/components/Tokenomics";
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
    <div className="relative min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Live Market Price Ticker */}
      <CryptoTicker />

      {/* Main Navigation */}
      <Navbar onOpenWaitlist={handleOpenWaitlist} />

      {/* Main Crypto Landing Page Sections */}
      <main className="flex-1">
        {/* Hero with Instant Swap Engine */}
        <Hero onOpenWaitlist={handleOpenWaitlist} />

        {/* Live Order Book & DEX Trading Terminal */}
        <InteractiveTradingView />

        {/* Protocol Security & Architecture Grid */}
        <Features />

        {/* Liquid Staking & Yield Calculator */}
        <StakingCalculator onOpenWaitlist={handleOpenWaitlist} />

        {/* Tokenomics & $ORBX Distribution */}
        <Tokenomics />

        {/* Institutional & Trader Testimonials */}
        <Testimonials />

        {/* Crypto & Web3 FAQ */}
        <Faq />

        {/* Institutional Inquiries & Partnerships */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Whitelist & Airdrop Modal */}
      <WaitlistModal isOpen={isWaitlistOpen} onClose={handleCloseWaitlist} />
    </div>
  );
}
