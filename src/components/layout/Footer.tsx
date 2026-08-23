"use client";

import Image from "next/image";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { useAppStore } from "@/lib/store";

export function Footer() {
  const setView = useAppStore((s) => s.setView);

  return (
    <footer className="mt-auto border-t border-[#D1E8E2]/8 bg-[#2C3531]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg overflow-hidden bg-gradient-to-br from-[#116466] to-[#0d4d4f] flex items-center justify-center ring-1 ring-[#FFCB9A]/20">
                <Image
                  src="/nirvash-logo-nav.png"
                  alt="Nirvash CV Maker logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[#D1E8E2] font-semibold tracking-wide">NIRVASH</span>
                <span className="text-[#9DB5B0] text-[10px] tracking-[0.2em] uppercase">CV Maker</span>
              </div>
            </div>
            <p className="text-[#D1E8E2]/60 text-sm max-w-xs">
              Your CV. Made Effortlessly.
            </p>
            <p className="text-[#9DB5B0] text-xs">
              You bring the experience. We make it professional.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="text-[#FFCB9A] text-xs font-semibold tracking-widest uppercase">
              Navigate
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setView("landing")} className="text-sm text-[#D1E8E2]/70 hover:text-[#D1E8E2] transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => setView("template-gallery")} className="text-sm text-[#D1E8E2]/70 hover:text-[#D1E8E2] transition-colors">
                  Templates
                </button>
              </li>
              <li>
                <button onClick={() => { setView("landing"); setTimeout(() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" }), 100); }} className="text-sm text-[#D1E8E2]/70 hover:text-[#D1E8E2] transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => setView("dashboard")} className="text-sm text-[#D1E8E2]/70 hover:text-[#D1E8E2] transition-colors">
                  My CVs
                </button>
              </li>
            </ul>
          </div>

          {/* Legal + Social */}
          <div className="space-y-3">
            <h4 className="text-[#FFCB9A] text-xs font-semibold tracking-widest uppercase">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <button className="text-sm text-[#D1E8E2]/70 hover:text-[#D1E8E2] transition-colors">
                  Privacy
                </button>
              </li>
              <li>
                <button className="text-sm text-[#D1E8E2]/70 hover:text-[#D1E8E2] transition-colors">
                  Terms
                </button>
              </li>
            </ul>
            <div className="flex items-center gap-2 pt-2">
              {[Twitter, Linkedin, Github, Mail].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-lg border border-[#D1E8E2]/10 hover:border-[#116466] hover:bg-[#116466]/20 text-[#D1E8E2]/70 hover:text-[#FFCB9A] flex items-center justify-center transition-all"
                  aria-label="social link"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#D1E8E2]/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#9DB5B0]">
            © {new Date().getFullYear()} Nirvash CV Maker. Crafted with care.
          </p>
          <p className="text-xs text-[#9DB5B0]">
            From a blank page to a professional CV in minutes.
          </p>
        </div>
      </div>
    </footer>
  );
}
