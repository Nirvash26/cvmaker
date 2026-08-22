"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const setView = useAppStore((s) => s.setView);
  const view = useAppStore((s) => s.view);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItem = (target: any, label: string, isHowItWorks = false) => {
    const isActive =
      (target === "landing" && view === "landing") ||
      (target === "template-gallery" && view === "template-gallery") ||
      (target === "dashboard" && view === "dashboard");
    return (
      <button
        onClick={() => {
          if (isHowItWorks) {
            setView("landing");
            setTimeout(() => {
              document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          } else {
            setView(target);
          }
          setMobileOpen(false);
        }}
        className={cn(
          "relative px-3 py-1.5 text-sm font-medium transition-colors",
          isActive ? "text-[#FFCB9A]" : "text-[#D1E8E2]/80 hover:text-[#D1E8E2]"
        )}
      >
        {label}
        {isActive && (
          <motion.span
            layoutId="nav-underline"
            className="absolute -bottom-0.5 left-3 right-3 h-px bg-[#FFCB9A]"
          />
        )}
      </button>
    );
  };

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#2C3531]/80 backdrop-blur-xl border-b border-[#D1E8E2]/5"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => setView("landing")} className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#116466] to-[#0d4d4f] flex items-center justify-center teal-glow">
                <span className="text-[#FFCB9A] font-bold text-lg">N</span>
              </div>
              <div className="absolute inset-0 rounded-lg bg-[#FFCB9A]/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[#D1E8E2] font-semibold tracking-wide text-base">NIRVASH</span>
              <span className="text-[#9DB5B0] text-[10px] tracking-[0.2em] uppercase">CV Maker</span>
            </div>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            {navItem("landing", "Home")}
            {navItem("template-gallery", "Templates")}
            {navItem("how-it-works", "How It Works", true)}
            {navItem("dashboard", "My CVs")}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setView("dashboard")}
              className="px-4 py-2 text-sm font-medium text-[#D1E8E2]/90 hover:text-[#D1E8E2] transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => setView("method-select")}
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2] text-sm font-medium transition-all teal-glow-soft hover:teal-glow"
            >
              <Sparkles className="w-4 h-4 text-[#FFCB9A]" />
              Create My CV
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-[#D1E8E2]"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#2C3531]/95 backdrop-blur-xl border-b border-[#D1E8E2]/5 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              <button
                onClick={() => { setView("landing"); setMobileOpen(false); }}
                className="block w-full text-left px-4 py-3 rounded-lg text-[#D1E8E2] hover:bg-[#3D4944]"
              >
                Home
              </button>
              <button
                onClick={() => { setView("template-gallery"); setMobileOpen(false); }}
                className="block w-full text-left px-4 py-3 rounded-lg text-[#D1E8E2] hover:bg-[#3D4944]"
              >
                Templates
              </button>
              <button
                onClick={() => { setView("landing"); setMobileOpen(false); setTimeout(() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" }), 100); }}
                className="block w-full text-left px-4 py-3 rounded-lg text-[#D1E8E2] hover:bg-[#3D4944]"
              >
                How It Works
              </button>
              <button
                onClick={() => { setView("dashboard"); setMobileOpen(false); }}
                className="block w-full text-left px-4 py-3 rounded-lg text-[#D1E8E2] hover:bg-[#3D4944]"
              >
                My CVs
              </button>
              <button
                onClick={() => { setView("method-select"); setMobileOpen(false); }}
                className="block w-full mt-2 px-4 py-3 rounded-lg bg-[#116466] text-[#D1E8E2] font-medium text-center"
              >
                Create My CV →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
