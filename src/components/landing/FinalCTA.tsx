"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { useAppStore } from "@/lib/store";

export function FinalCTA() {
  const setView = useAppStore((s) => s.setView);

  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
      {/* Futuristic glowing background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-bg radial-fade opacity-30" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#116466]/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#FFCB9A]/15 rounded-full blur-3xl"
        />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative inline-flex items-center justify-center mb-8"
        >
          <div className="absolute inset-0 blur-2xl">
            <Sparkles className="w-12 h-12 text-[#FFCB9A]" />
          </div>
          <Sparkles className="relative w-10 h-10 text-[#FFCB9A]" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-bold tracking-tight text-[#D1E8E2]"
        >
          Your Next Opportunity
          <br />
          <span className="text-gradient-mint">Starts Here.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg text-[#9DB5B0] max-w-xl mx-auto"
        >
          Start with a few simple answers. Leave with a professional CV.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10"
        >
          <button
            onClick={() => setView("method-select")}
            className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2] font-medium text-lg transition-all teal-glow hover:scale-[1.02]"
          >
            <Sparkles className="w-5 h-5 text-[#FFCB9A]" />
            Create My CV
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
          <p className="mt-4 text-xs text-[#9DB5B0]">
            No credit card required · Ready in minutes
          </p>
        </motion.div>
      </div>
    </section>
  );
}
