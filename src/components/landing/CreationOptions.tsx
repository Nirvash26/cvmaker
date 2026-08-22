"use client";

import { motion } from "framer-motion";
import { MessageCircle, FileText, ArrowRight, Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/store";

export function CreationOptions() {
  const setView = useAppStore((s) => s.setView);

  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-5xl font-bold tracking-tight text-[#D1E8E2]"
          >
            How would you like to create your CV?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-base sm:text-lg text-[#9DB5B0]"
          >
            Choose the method that feels easiest to you.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {/* OPTION 1 — Question-based */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            onClick={() => setView("method-select")}
            className="group relative text-left p-8 rounded-2xl glass-card hover:border-[#116466] transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#116466]/0 via-[#116466]/0 to-[#116466]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-[#116466]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ maskImage: "linear-gradient(black, transparent 70%)", WebkitMaskImage: "linear-gradient(black, transparent 70%)" }} />

            <div className="relative">
              {/* Icon */}
              <div className="relative inline-flex">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#116466] to-[#0d4d4f] flex items-center justify-center teal-glow">
                  <MessageCircle className="w-7 h-7 text-[#FFCB9A]" />
                </div>
                <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-[#FFCB9A] text-[10px] font-semibold text-[#2C3531] tracking-wide">
                  Best for beginners
                </div>
              </div>

              {/* Title */}
              <h3 className="mt-6 text-2xl font-bold text-[#D1E8E2] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FFCB9A]" />
                Answer Simple Questions
              </h3>

              {/* Description */}
              <p className="mt-3 text-[#9DB5B0] leading-relaxed">
                We&apos;ll guide you step by step and turn your answers into a professional CV.
              </p>

              {/* Button */}
              <div className="mt-6 inline-flex items-center gap-2 text-[#FFCB9A] font-medium text-sm group-hover:gap-3 transition-all">
                Start Answering
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </motion.button>

          {/* OPTION 2 — Form-based */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onClick={() => setView("method-select")}
            className="group relative text-left p-8 rounded-2xl glass-card hover:border-[#D9B08C]/40 transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="relative">
              {/* Icon */}
              <div className="relative inline-flex">
                <div className="w-14 h-14 rounded-xl bg-[#3D4944] border border-[#D1E8E2]/10 flex items-center justify-center">
                  <FileText className="w-7 h-7 text-[#D9B08C]" />
                </div>
                <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-[#3D4944] border border-[#D9B08C]/40 text-[10px] font-semibold text-[#D9B08C] tracking-wide">
                  Full control
                </div>
              </div>

              {/* Title */}
              <h3 className="mt-6 text-2xl font-bold text-[#D1E8E2] flex items-center gap-2">
                ✍ Fill Out a Form
              </h3>

              {/* Description */}
              <p className="mt-3 text-[#9DB5B0] leading-relaxed">
                Already have your information ready? Fill in everything at your own pace.
              </p>

              {/* Button */}
              <div className="mt-6 inline-flex items-center gap-2 text-[#D9B08C] font-medium text-sm group-hover:gap-3 transition-all">
                Fill Out Form
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
