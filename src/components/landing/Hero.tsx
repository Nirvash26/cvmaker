"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { useAppStore } from "@/lib/store";

export function Hero() {
  const setView = useAppStore((s) => s.setView);

  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-bg radial-fade opacity-50" />
        {/* Glow orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#116466]/30 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#FFCB9A]/10 rounded-full blur-3xl" />
        {/* Decorative SVG lines */}
        <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
          <defs>
            <linearGradient id="heroLine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#116466" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FFCB9A" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <motion.path
            d="M0,200 Q400,100 800,300 T1600,200"
            stroke="url(#heroLine)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <motion.path
            d="M0,400 Q500,300 1000,500 T2000,400"
            stroke="url(#heroLine)"
            strokeWidth="0.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, ease: "easeInOut", delay: 0.3 }}
          />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs text-[#D1E8E2]/80 mb-8"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFCB9A] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#FFCB9A]" />
            </span>
            Premium CV Builder · No experience required
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
          >
            <span className="text-[#D1E8E2]">Your Professional CV.</span>
            <br />
            <span className="relative inline-block mt-2">
              <span className="text-gradient-mint">Made Effortlessly.</span>
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFCB9A] to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
            </span>
          </motion.h1>

          {/* Supporting text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-7 text-base sm:text-lg text-[#9DB5B0] max-w-2xl mx-auto leading-relaxed"
          >
            Create a professional CV in minutes.
            <br className="hidden sm:block" />
            <span className="text-[#D1E8E2]/70"> No complicated design tools. No confusing forms. No experience required.</span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => setView("method-select")}
              className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2] font-medium transition-all teal-glow hover:scale-[1.02]"
            >
              <Sparkles className="w-5 h-5 text-[#FFCB9A]" />
              Create My CV
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => setView("template-gallery")}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl glass-card hover:border-[#116466] text-[#D1E8E2] font-medium transition-all"
            >
              Explore Templates
            </button>
          </motion.div>

          {/* Floating CV preview mockups */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative mt-16 max-w-5xl mx-auto"
          >
            <div className="relative grid grid-cols-3 gap-4 sm:gap-6">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -12, 0] }}
                  transition={{
                    duration: 4 + i,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.5,
                  }}
                  className={`glass-card-strong rounded-xl overflow-hidden ${
                    i === 1 ? "scale-105 sm:scale-110 z-10" : "opacity-80 scale-95"
                  }`}
                  style={{ aspectRatio: "1 / 1.414" }}
                >
                  <CVPreviewMock variant={i} />
                </motion.div>
              ))}
            </div>
            {/* Glow under mockups */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-[#116466]/40 blur-2xl rounded-full" />
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-14 grid grid-cols-3 gap-6 max-w-2xl mx-auto"
          >
            {[
              { value: "12+", label: "Templates" },
              { value: "8 Steps", label: "to a Full CV" },
              { value: "100%", label: "Free to Start" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gradient-teal">{s.value}</div>
                <div className="text-xs text-[#9DB5B0] mt-1 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CVPreviewMock({ variant }: { variant: number }) {
  if (variant === 0) {
    // Sidebar style
    return (
      <div className="flex h-full text-[6px]">
        <div className="w-1/3 bg-[#116466] p-1.5 space-y-1">
          <div className="w-4 h-4 rounded-full bg-[#FFCB9A]/80 mx-auto" />
          <div className="h-px bg-[#D1E8E2]/30 my-1" />
          <div className="space-y-0.5">
            <div className="h-1 bg-[#D1E8E2]/40 rounded" />
            <div className="h-1 bg-[#D1E8E2]/30 rounded w-3/4" />
            <div className="h-1 bg-[#D1E8E2]/30 rounded w-2/3" />
          </div>
          <div className="space-y-0.5 pt-1">
            <div className="h-1 bg-[#FFCB9A]/60 rounded w-1/2" />
            <div className="h-1 bg-[#D1E8E2]/20 rounded" />
            <div className="h-1 bg-[#D1E8E2]/20 rounded w-4/5" />
          </div>
        </div>
        <div className="flex-1 p-1.5 space-y-1">
          <div className="h-1.5 bg-[#116466] rounded w-3/4" />
          <div className="h-px bg-[#FFCB9A]/50" />
          <div className="space-y-0.5">
            <div className="h-1 bg-[#2C3531]/40 rounded w-2/3" />
            <div className="h-1 bg-[#2C3531]/20 rounded" />
            <div className="h-1 bg-[#2C3531]/20 rounded w-5/6" />
          </div>
          <div className="space-y-0.5 pt-1">
            <div className="h-1 bg-[#116466]/70 rounded w-1/2" />
            <div className="h-1 bg-[#2C3531]/20 rounded" />
            <div className="h-1 bg-[#2C3531]/20 rounded w-3/4" />
          </div>
        </div>
      </div>
    );
  }
  if (variant === 1) {
    // Centered minimal
    return (
      <div className="p-2 h-full space-y-1.5">
        <div className="text-center">
          <div className="h-2 bg-[#116466] rounded w-1/2 mx-auto" />
          <div className="h-1 bg-[#FFCB9A]/80 rounded w-1/3 mx-auto mt-1" />
        </div>
        <div className="h-px bg-[#2C3531]/20 my-1" />
        <div className="space-y-0.5">
          <div className="h-1 bg-[#116466]/80 rounded w-1/3" />
          <div className="h-1 bg-[#2C3531]/30 rounded" />
          <div className="h-1 bg-[#2C3531]/20 rounded w-5/6" />
          <div className="h-1 bg-[#2C3531]/20 rounded w-2/3" />
        </div>
        <div className="space-y-0.5 pt-1">
          <div className="h-1 bg-[#116466]/80 rounded w-1/4" />
          <div className="h-1 bg-[#2C3531]/30 rounded" />
          <div className="h-1 bg-[#2C3531]/20 rounded w-3/4" />
        </div>
        <div className="flex gap-0.5 pt-1">
          <div className="h-1.5 bg-[#FFCB9A]/60 rounded flex-1" />
          <div className="h-1.5 bg-[#116466]/60 rounded flex-1" />
          <div className="h-1.5 bg-[#D1E8E2]/40 rounded flex-1" />
        </div>
      </div>
    );
  }
  // Modern two-column
  return (
    <div className="p-2 h-full space-y-1.5">
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-[#116466]" />
        <div className="space-y-0.5 flex-1">
          <div className="h-1.5 bg-[#2C3531]/70 rounded w-3/4" />
          <div className="h-0.5 bg-[#FFCB9A]/70 rounded w-1/2" />
        </div>
      </div>
      <div className="h-px bg-[#116466]/40" />
      <div className="grid grid-cols-2 gap-1">
        <div className="space-y-0.5">
          <div className="h-1 bg-[#116466]/70 rounded w-2/3" />
          <div className="h-0.5 bg-[#2C3531]/30 rounded" />
          <div className="h-0.5 bg-[#2C3531]/20 rounded w-5/6" />
        </div>
        <div className="space-y-0.5">
          <div className="h-1 bg-[#FFCB9A]/70 rounded w-1/2" />
          <div className="h-0.5 bg-[#2C3531]/30 rounded" />
          <div className="h-0.5 bg-[#2C3531]/20 rounded w-3/4" />
        </div>
      </div>
      <div className="space-y-0.5 pt-1">
        <div className="h-1 bg-[#116466]/70 rounded w-1/3" />
        <div className="h-0.5 bg-[#2C3531]/30 rounded" />
        <div className="h-0.5 bg-[#2C3531]/20 rounded w-2/3" />
      </div>
    </div>
  );
}
