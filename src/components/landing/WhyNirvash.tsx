"use client";

import { motion } from "framer-motion";
import {
  MousePointerClick,
  LayoutTemplate,
  GraduationCap,
  SlidersHorizontal,
  Eye,
  FileDown,
} from "lucide-react";

const FEATURES = [
  {
    icon: MousePointerClick,
    title: "Easy to Use",
    desc: "No design skills required.",
  },
  {
    icon: LayoutTemplate,
    title: "Professional Templates",
    desc: "Beautiful designs ready for real-world applications.",
  },
  {
    icon: GraduationCap,
    title: "Beginner Friendly",
    desc: "We guide you through every step.",
  },
  {
    icon: SlidersHorizontal,
    title: "Customize Everything",
    desc: "Edit content and design whenever you want.",
  },
  {
    icon: Eye,
    title: "Instant Preview",
    desc: "See your CV update in real time.",
  },
  {
    icon: FileDown,
    title: "Export Ready",
    desc: "Download and use your CV professionally.",
  },
];

export function WhyNirvash() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium text-[#FFCB9A] bg-[#FFCB9A]/10 border border-[#FFCB9A]/20">
            Why Nirvash
          </span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-[#D1E8E2]">
            Everything you need. Nothing you don&apos;t.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative p-6 rounded-xl glass-card hover:border-[#116466]/50 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="relative">
                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#116466]/40 to-[#0d4d4f]/30 flex items-center justify-center mb-4 group-hover:from-[#116466] group-hover:to-[#0d4d4f] transition-all">
                  <f.icon className="w-5 h-5 text-[#FFCB9A]" />
                </div>
                <h3 className="text-base font-semibold text-[#D1E8E2]">{f.title}</h3>
                <p className="mt-1.5 text-sm text-[#9DB5B0] leading-relaxed">{f.desc}</p>
              </div>
              <div className="absolute -bottom-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#116466] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
