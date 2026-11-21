"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X, ArrowRight, Sparkles, LayoutDashboard, Rocket } from "lucide-react";

interface NavbarProps {
  onOpenWaitlist: () => void;
}

export function Navbar({ onOpenWaitlist }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/80 shadow-lg shadow-black/20 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                {siteConfig.name}
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  v2.4
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm font-medium text-neutral-300 hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="#demo"
              className="text-sm font-medium text-neutral-300 hover:text-white transition-colors flex items-center gap-1"
            >
              Live Demo
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </Link>
            <Link
              href="#roi"
              className="text-sm font-medium text-neutral-300 hover:text-white transition-colors"
            >
              ROI Calculator
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-neutral-300 hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              className="text-sm font-medium text-neutral-300 hover:text-white transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium text-neutral-300 hover:text-white transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-600/20 border border-brand-500/40 text-brand-300 hover:bg-brand-600/30 hover:text-white transition-all shadow-sm"
              title="Launch the OrbitX App Dashboard"
            >
              <Rocket className="w-3.5 h-3.5 text-brand-400" />
              <span>Launch App</span>
            </Link>

            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition-all"
              title="View full-stack leads management panel"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-neutral-400" />
              <span>Admin</span>
            </Link>

            <ThemeToggle />

            <button
              onClick={onOpenWaitlist}
              className="relative group overflow-hidden px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 transition-all duration-200 shadow-md shadow-brand-600/30 active:scale-95 flex items-center gap-1.5"
            >
              <span>Join Waitlist</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
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
        <div className="md:hidden border-b border-neutral-800 bg-neutral-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 mt-3 animate-in fade-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-3">
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-neutral-300 hover:text-white py-1"
            >
              Features
            </Link>
            <Link
              href="#demo"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-neutral-300 hover:text-white py-1 flex items-center justify-between"
            >
              <span>Live Demo</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Interactive
              </span>
            </Link>
            <Link
              href="#roi"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-neutral-300 hover:text-white py-1"
            >
              ROI Calculator
            </Link>
            <Link
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-neutral-300 hover:text-white py-1"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-neutral-300 hover:text-white py-1"
            >
              FAQ
            </Link>
            <Link
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-neutral-300 hover:text-white py-1"
            >
              Contact
            </Link>
          </nav>

          <div className="pt-3 border-t border-neutral-800/80 flex flex-col gap-2.5">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold rounded-xl bg-brand-600/20 border border-brand-500/40 text-brand-300"
            >
              <Rocket className="w-4 h-4 text-brand-400" />
              Launch Cloud App Studio
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300"
            >
              <LayoutDashboard className="w-4 h-4 text-neutral-400" />
              View Admin Lead Manager
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWaitlist();
              }}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-accent-600 shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2"
            >
              <span>Join Early Access Waitlist</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
