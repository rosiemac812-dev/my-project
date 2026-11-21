"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X, ArrowRight, Sparkles, LayoutDashboard, Rocket, Wallet, Check, ChevronDown } from "lucide-react";

interface NavbarProps {
  onOpenWaitlist: () => void;
}

export function Navbar({ onOpenWaitlist }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("0x71C4...49b2");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToggleWallet = () => {
    setWalletConnected(!walletConnected);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-neutral-950/85 backdrop-blur-md border-b border-neutral-800/80 shadow-lg shadow-black/30 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-brand-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                {siteConfig.name}
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  DEX v2.0
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#markets"
              className="text-sm font-medium text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>Markets</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-neutral-300 hover:text-white transition-colors"
            >
              Trade Terminal
            </Link>
            <Link
              href="#staking"
              className="text-sm font-medium text-neutral-300 hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Staking</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                24.8% APY
              </span>
            </Link>
            <Link
              href="#tokenomics"
              className="text-sm font-medium text-neutral-300 hover:text-white transition-colors"
            >
              Tokenomics
            </Link>
            <Link
              href="#faq"
              className="text-sm font-medium text-neutral-300 hover:text-white transition-colors"
            >
              FAQ
            </Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Wallet Connect Button */}
            <button
              onClick={handleToggleWallet}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold rounded-xl border transition-all ${
                walletConnected
                  ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-300"
                  : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700"
              }`}
            >
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <span>{walletConnected ? walletAddress : "Connect Wallet"}</span>
            </button>

            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/30 transition-all"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Launch App</span>
            </Link>

            <ThemeToggle />

            <button
              onClick={onOpenWaitlist}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-neutral-850 hover:bg-neutral-800 border border-neutral-700 transition-all flex items-center gap-1"
            >
              <span>Airdrop</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800/80 transition-colors border border-neutral-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-800 bg-neutral-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 mt-3 animate-in fade-in">
          <nav className="flex flex-col space-y-3 text-sm">
            <Link
              href="#markets"
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-300 hover:text-white py-1 flex items-center justify-between"
            >
              <span>Crypto Markets</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                Live
              </span>
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-300 hover:text-white py-1"
            >
              DEX Trading Terminal
            </Link>
            <Link
              href="#staking"
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-300 hover:text-white py-1"
            >
              Liquid Staking Vaults (24.8% APY)
            </Link>
            <Link
              href="#tokenomics"
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-300 hover:text-white py-1"
            >
              $ORBX Tokenomics
            </Link>
            <Link
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-300 hover:text-white py-1"
            >
              FAQ
            </Link>
          </nav>

          <div className="pt-3 border-t border-neutral-800/80 flex flex-col gap-2.5">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
            >
              <Rocket className="w-4 h-4" />
              Launch DEX Trading Terminal
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWaitlist();
              }}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-neutral-300 bg-neutral-900 border border-neutral-800"
            >
              Claim Whitelist & Airdrop
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
