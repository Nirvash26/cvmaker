"use client";

import { motion } from "framer-motion";
import { MessageCircle, FileText, ArrowRight, ChevronLeft, Sparkles, Check } from "lucide-react";
import { useAppStore } from "@/lib/store";

export function MethodSelect() {
  const setView = useAppStore((s) => s.setView);
  const createCV = useAppStore((s) => s.createCV);

  const handleStart = (method: "questions" | "form") => {
    createCV(method);
    setView(method === "questions" ? "question-wizard" : "form-builder");
  };

  return (
    <div className="min-h-screen pt-24 pb-16 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#116466]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#FFCB9A]/8 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <button
          onClick={() => setView("landing")}
          className="inline-flex items-center gap-1 text-sm text-[#9DB5B0] hover:text-[#D1E8E2] transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Home
        </button>

        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-6xl font-bold tracking-tight text-[#D1E8E2]"
          >
            How would you like to <span className="text-gradient-mint">begin?</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-base text-[#9DB5B0] max-w-xl mx-auto"
          >
            Choose the path that feels right. Both will create a professional CV.
          </motion.p>
        </div>

        {/* Two distinct pathways — split-screen feel */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* PATH 1 — Guided (left) */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => handleStart("questions")}
            className="group relative text-left rounded-2xl overflow-hidden bg-gradient-to-br from-[#116466]/30 via-[#2C3531] to-[#2C3531] border border-[#116466]/40 hover:border-[#116466] transition-all duration-300 hover:-translate-y-1"
          >
            {/* Decorative element top-right */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#116466]/20 rounded-full blur-3xl group-hover:bg-[#116466]/40 transition-colors" />
            <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-[#FFCB9A] text-[10px] font-bold text-[#2C3531]">
              RECOMMENDED
            </div>

            <div className="relative p-8 sm:p-10">
              {/* Big icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#116466] to-[#0d4d4f] flex items-center justify-center teal-glow mb-6">
                <Sparkles className="w-8 h-8 text-[#FFCB9A]" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-[#D1E8E2]">Guide me</h3>
              <p className="mt-3 text-[#9DB5B0] leading-relaxed text-sm sm:text-base">
                Answer a few simple questions and we&apos;ll build your CV step by step.
              </p>

              {/* Bullet list */}
              <div className="mt-6 space-y-2">
                {["One question at a time", "AI help when needed", "Beginner-friendly"].map((point) => (
                  <div key={point} className="flex items-center gap-2 text-sm text-[#D1E8E2]/80">
                    <Check className="w-3.5 h-3.5 text-[#FFCB9A]" />
                    {point}
                  </div>
                ))}
              </div>

              <div className="mt-8 inline-flex items-center gap-2 text-[#FFCB9A] font-medium group-hover:gap-3 transition-all">
                Start Guided
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.button>

          {/* PATH 2 — Form (right) */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onClick={() => handleStart("form")}
            className="group relative text-left rounded-2xl overflow-hidden bg-gradient-to-br from-[#3D4944]/40 via-[#2C3531] to-[#2C3531] border border-[#D1E8E2]/10 hover:border-[#D9B08C]/40 transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#D9B08C]/10 rounded-full blur-3xl group-hover:bg-[#D9B08C]/20 transition-colors" />

            <div className="relative p-8 sm:p-10">
              {/* Big icon — document */}
              <div className="w-16 h-16 rounded-2xl bg-[#3D4944] border border-[#D1E8E2]/10 flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-[#D9B08C]" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-[#D1E8E2]">I&apos;ll do it myself</h3>
              <p className="mt-3 text-[#9DB5B0] leading-relaxed text-sm sm:text-base">
                Fill in your information directly with complete control.
              </p>

              <div className="mt-6 space-y-2">
                {["Edit every section at once", "See completion progress", "Full control over content"].map((point) => (
                  <div key={point} className="flex items-center gap-2 text-sm text-[#D1E8E2]/80">
                    <Check className="w-3.5 h-3.5 text-[#D9B08C]" />
                    {point}
                  </div>
                ))}
              </div>

              <div className="mt-8 inline-flex items-center gap-2 text-[#D9B08C] font-medium group-hover:gap-3 transition-all">
                Open Form
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
