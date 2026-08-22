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

        <div className="text-center mb-14">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight text-[#D1E8E2]"
          >
            Let&apos;s Create Your CV
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-base text-[#9DB5B0] max-w-xl mx-auto"
          >
            Choose the way that feels easiest for you. Both options will help you create a professional CV.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* CARD 1 — ANSWER QUESTIONS */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => handleStart("questions")}
            className="group relative text-left p-8 rounded-2xl glass-card hover:border-[#116466] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            {/* Animated glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#116466]/0 via-[#116466]/0 to-[#116466]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#FFCB9A]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative">
              {/* Recommended badge */}
              <div className="absolute top-0 right-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFCB9A] text-[11px] font-semibold text-[#2C3531]">
                <Sparkles className="w-3 h-3" />
                Recommended for Beginners
              </div>

              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#116466] to-[#0d4d4f] flex items-center justify-center teal-glow group-hover:scale-105 transition-transform">
                <MessageCircle className="w-7 h-7 text-[#FFCB9A]" />
              </div>

              {/* Title */}
              <h3 className="mt-6 text-2xl font-bold text-[#D1E8E2]">
                Answer Simple Questions
              </h3>

              {/* Description */}
              <p className="mt-3 text-[#9DB5B0] leading-relaxed">
                We&apos;ll guide you step by step. Just answer a few simple questions, and we&apos;ll organize your information into a professional CV.
              </p>

              {/* Bullet points */}
              <div className="mt-5 space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-[#D1E8E2]/80">
                  <Check className="w-3.5 h-3.5 text-[#FFCB9A]" />
                  One question at a time
                </div>
                <div className="flex items-center gap-2 text-sm text-[#D1E8E2]/80">
                  <Check className="w-3.5 h-3.5 text-[#FFCB9A]" />
                  AI help when you need it
                </div>
              </div>

              {/* Button */}
              <div className="mt-7 inline-flex items-center gap-2 text-[#FFCB9A] font-medium group-hover:gap-3 transition-all">
                Start Guided Setup
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.button>

          {/* CARD 2 — FILL OUT A FORM */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            onClick={() => handleStart("form")}
            className="group relative text-left p-8 rounded-2xl glass-card hover:border-[#D9B08C]/40 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
          >
            <div className="relative">
              {/* Badge */}
              <div className="absolute top-0 right-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#3D4944] border border-[#D9B08C]/40 text-[11px] font-semibold text-[#D9B08C]">
                Full Control
              </div>

              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-[#3D4944] border border-[#D1E8E2]/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-7 h-7 text-[#D9B08C]" />
              </div>

              {/* Title */}
              <h3 className="mt-6 text-2xl font-bold text-[#D1E8E2]">Fill Out a Form</h3>

              {/* Description */}
              <p className="mt-3 text-[#9DB5B0] leading-relaxed">
                Already know what you want to include? Enter all your information and build your CV at your own pace.
              </p>

              {/* Bullet points */}
              <div className="mt-5 space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-[#D1E8E2]/80">
                  <Check className="w-3.5 h-3.5 text-[#D9B08C]" />
                  Edit every section at once
                </div>
                <div className="flex items-center gap-2 text-sm text-[#D1E8E2]/80">
                  <Check className="w-3.5 h-3.5 text-[#D9B08C]" />
                  See completion progress
                </div>
              </div>

              {/* Button */}
              <div className="mt-7 inline-flex items-center gap-2 text-[#D9B08C] font-medium group-hover:gap-3 transition-all">
                Open CV Form
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
