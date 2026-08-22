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
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <button
          onClick={() => setView("landing")}
          className="inline-flex items-center gap-1 text-sm text-[#9DB5B0] hover:text-[#D1E8E2] transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Home
        </button>

        <div className="text-center mb-14">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight text-[#D1E8E2]"
          >
            Let&apos;s Create Your CV
          </motion.h1>
          <p className="mt-3 text-base text-[#9DB5B0]">
            Choose the easiest way to get started.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Option 1: Questions */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => handleStart("questions")}
            className="group relative text-left p-8 rounded-2xl glass-card hover:border-[#116466] transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-[#FFCB9A] text-[10px] font-semibold text-[#2C3531]">
              Recommended
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#116466] to-[#0d4d4f] flex items-center justify-center teal-glow">
              <MessageCircle className="w-7 h-7 text-[#FFCB9A]" />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-[#D1E8E2] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FFCB9A]" />
              I&apos;ll Answer Questions
            </h3>
            <p className="mt-3 text-[#9DB5B0] leading-relaxed">
              Perfect if you&apos;re not sure what information to include.
            </p>
            <div className="mt-6 flex items-center gap-2 text-[#9DB5B0]">
              <Check className="w-4 h-4 text-[#FFCB9A]" />
              <span className="text-xs">Recommended for beginners</span>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 text-[#FFCB9A] font-medium group-hover:gap-3 transition-all">
              Start Guided Setup
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5" />
            </div>
          </motion.button>

          {/* Option 2: Form */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            onClick={() => handleStart("form")}
            className="group relative text-left p-8 rounded-2xl glass-card hover:border-[#D9B08C]/40 transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="w-14 h-14 rounded-xl bg-[#3D4944] border border-[#D1E8E2]/10 flex items-center justify-center">
              <FileText className="w-7 h-7 text-[#D9B08C]" />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-[#D1E8E2]">✍ I&apos;ll Fill Out a Form</h3>
            <p className="mt-3 text-[#9DB5B0] leading-relaxed">
              Perfect if you already have your CV information ready.
            </p>
            <div className="mt-6 flex items-center gap-2 text-[#9DB5B0]">
              <Check className="w-4 h-4 text-[#D9B08C]" />
              <span className="text-xs">Fill out every section at your own pace</span>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 text-[#D9B08C] font-medium group-hover:gap-3 transition-all">
              Open CV Form
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5" />
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
