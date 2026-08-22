"use client";

import { motion } from "framer-motion";
import { User, Palette, Download } from "lucide-react";

const STEPS = [
  {
    n: "01",
    icon: User,
    title: "Tell Us About Yourself",
    desc: "Answer simple questions or fill out your information.",
  },
  {
    n: "02",
    icon: Palette,
    title: "Choose Your Design",
    desc: "Pick a professional CV template that matches your style.",
  },
  {
    n: "03",
    icon: Download,
    title: "Download Your CV",
    desc: "Review your CV and download it as a professional document.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium text-[#FFCB9A] bg-[#FFCB9A]/10 border border-[#FFCB9A]/20">
            How It Works
          </span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-[#D1E8E2]">
            Three steps. That&apos;s it.
          </h2>
        </div>

        {/* Desktop timeline */}
        <div className="hidden md:block relative">
          {/* Timeline line */}
          <div className="absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-[#116466] to-transparent" />
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-[#FFCB9A] via-[#116466] to-[#FFCB9A] origin-left"
          />

          <div className="grid grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="relative text-center"
              >
                {/* Node */}
                <div className="relative inline-flex items-center justify-center w-24 h-24">
                  <div className="absolute inset-0 rounded-full bg-[#116466]/30 blur-xl" />
                  <div className="relative w-20 h-20 rounded-full glass-card-strong flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-[#FFCB9A]" />
                  </div>
                  <span className="absolute -top-1 -right-1 text-xs font-bold text-[#FFCB9A] bg-[#2C3531] px-2 py-0.5 rounded-full border border-[#FFCB9A]/30">
                    {step.n}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-semibold text-[#D1E8E2]">{step.title}</h3>
                <p className="mt-2 text-sm text-[#9DB5B0] max-w-xs mx-auto leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile vertical layout */}
        <div className="md:hidden space-y-8 relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#FFCB9A] via-[#116466] to-[#FFCB9A]/0" />
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative pl-16"
            >
              <div className="absolute left-0 top-0 w-12 h-12 rounded-full glass-card-strong flex items-center justify-center">
                <step.icon className="w-5 h-5 text-[#FFCB9A]" />
              </div>
              <h3 className="text-lg font-semibold text-[#D1E8E2]">
                <span className="text-[#FFCB9A] mr-2">{step.n}</span>
                {step.title}
              </h3>
              <p className="mt-1 text-sm text-[#9DB5B0] leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
