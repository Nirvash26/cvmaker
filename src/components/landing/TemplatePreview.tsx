"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { useAppStore } from "@/lib/store";

const PREVIEW_TEMPLATES = [
  { id: "aurora", name: "Aurora", category: "Modern", ats: true },
  { id: "minimal", name: "Minimal", category: "Minimal", ats: true },
  { id: "vertex", name: "Vertex", category: "Tech", ats: true },
  { id: "horizon", name: "Horizon", category: "Professional", ats: false },
  { id: "executive", name: "Executive", category: "Executive", ats: true },
  { id: "nova", name: "Nova", category: "Creative", ats: false },
];

export function TemplatePreview() {
  const setView = useAppStore((s) => s.setView);

  return (
    <section className="relative py-20 sm:py-28">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-[#116466]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-[#FFCB9A]/5 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium text-[#FFCB9A] bg-[#FFCB9A]/10 border border-[#FFCB9A]/20">
            Templates
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-[#D1E8E2]"
          >
            A CV That Looks Like You.
          </motion.h2>
          <p className="mt-4 text-base sm:text-lg text-[#9DB5B0]">
            Choose from professionally designed templates for every career and personality.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {PREVIEW_TEMPLATES.map((tpl, i) => (
            <motion.button
              key={tpl.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              onClick={() => setView("template-gallery")}
              className="group text-left"
            >
              <div className="relative rounded-xl overflow-hidden glass-card hover:border-[#116466] transition-all duration-300 group-hover:-translate-y-1">
                <div style={{ aspectRatio: "1 / 1.414" }}>
                  <TemplateThumb id={tpl.id} />
                </div>
                {tpl.ats && (
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-[#FFCB9A]/90 text-[#2C3531] text-[9px] font-semibold tracking-wide">
                    ATS
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C3531]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 inset-x-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-full py-1.5 rounded-md bg-[#116466] text-[#D1E8E2] text-xs font-medium text-center">
                    Use Template
                  </div>
                </div>
              </div>
              <div className="mt-2.5 px-1">
                <div className="text-sm font-medium text-[#D1E8E2]">{tpl.name}</div>
                <div className="text-[11px] text-[#9DB5B0]">{tpl.category}</div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => setView("template-gallery")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass-card hover:border-[#116466] text-[#D1E8E2] font-medium transition-all"
          >
            View All Templates
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function TemplateThumb({ id }: { id: string }) {
  // Tiny preview thumbnails — different layout per template
  switch (id) {
    case "aurora":
      return (
        <div className="h-full bg-white p-2 flex flex-col gap-1 text-[5px]">
          <div className="h-2 bg-[#116466] rounded-sm w-2/3" />
          <div className="h-0.5 bg-[#FFCB9A] w-1/2" />
          <div className="h-px bg-gray-300 my-0.5" />
          <div className="h-0.5 bg-gray-700 rounded-sm w-1/3" />
          <div className="h-0.5 bg-gray-300 rounded" />
          <div className="h-0.5 bg-gray-300 rounded w-5/6" />
          <div className="h-0.5 bg-gray-300 rounded w-2/3" />
          <div className="h-0.5 bg-gray-700 rounded-sm w-1/4 mt-0.5" />
          <div className="h-0.5 bg-gray-300 rounded" />
          <div className="h-0.5 bg-gray-300 rounded w-3/4" />
        </div>
      );
    case "minimal":
      return (
        <div className="h-full bg-white p-2 text-center flex flex-col items-center gap-0.5 text-[5px]">
          <div className="h-1.5 bg-gray-800 rounded-sm w-1/2" />
          <div className="h-0.5 bg-[#FFCB9A] w-1/3" />
          <div className="h-px bg-gray-300 w-full my-1" />
          <div className="h-0.5 bg-gray-700 rounded-sm w-1/3" />
          <div className="h-0.5 bg-gray-300 rounded w-4/5" />
          <div className="h-0.5 bg-gray-300 rounded w-3/5" />
          <div className="h-0.5 bg-gray-700 rounded-sm w-1/4 mt-1" />
          <div className="h-0.5 bg-gray-300 rounded w-3/4" />
        </div>
      );
    case "vertex":
      return (
        <div className="h-full bg-white flex">
          <div className="w-1/3 bg-[#2C3531] p-1 flex flex-col items-center gap-0.5">
            <div className="w-3 h-3 rounded-full bg-[#FFCB9A] mt-1" />
            <div className="h-0.5 bg-[#D1E8E2]/60 rounded w-full mt-1" />
            <div className="h-0.5 bg-[#D1E8E2]/40 rounded w-3/4" />
            <div className="h-0.5 bg-[#FFCB9A]/60 rounded w-1/2 mt-1" />
            <div className="h-0.5 bg-[#D1E8E2]/30 rounded" />
          </div>
          <div className="flex-1 p-1 text-[5px]">
            <div className="h-1.5 bg-[#116466] rounded-sm w-3/4" />
            <div className="h-0.5 bg-gray-300 rounded w-1/2 mt-0.5" />
            <div className="space-y-0.5 mt-1">
              <div className="h-0.5 bg-gray-700 rounded w-1/3" />
              <div className="h-0.5 bg-gray-300 rounded" />
              <div className="h-0.5 bg-gray-300 rounded w-5/6" />
            </div>
          </div>
        </div>
      );
    case "horizon":
      return (
        <div className="h-full bg-white p-2 text-[5px]">
          <div className="flex justify-between items-center">
            <div className="h-1.5 bg-[#116466] rounded-sm w-1/2" />
            <div className="h-1 w-1 rounded-full bg-[#FFCB9A]" />
          </div>
          <div className="h-0.5 bg-[#FFCB9A] w-full mt-0.5" />
          <div className="grid grid-cols-2 gap-0.5 mt-1">
            <div>
              <div className="h-0.5 bg-gray-700 rounded w-2/3" />
              <div className="h-0.5 bg-gray-300 rounded mt-0.5" />
              <div className="h-0.5 bg-gray-300 rounded w-5/6" />
            </div>
            <div>
              <div className="h-0.5 bg-[#116466] rounded w-1/2" />
              <div className="h-0.5 bg-gray-300 rounded mt-0.5" />
              <div className="h-0.5 bg-gray-300 rounded w-3/4" />
            </div>
          </div>
        </div>
      );
    case "executive":
      return (
        <div className="h-full bg-[#1a1a1a] p-2 text-[5px]">
          <div className="h-1.5 bg-[#FFCB9A] rounded-sm w-3/4" />
          <div className="h-0.5 bg-gray-500 w-1/2 mt-0.5" />
          <div className="h-px bg-[#FFCB9A]/40 my-1" />
          <div className="h-0.5 bg-gray-300 rounded-sm w-1/3" />
          <div className="h-0.5 bg-gray-400 rounded mt-0.5" />
          <div className="h-0.5 bg-gray-400 rounded w-4/5" />
          <div className="h-0.5 bg-gray-300 rounded-sm w-1/4 mt-1" />
          <div className="h-0.5 bg-gray-400 rounded mt-0.5" />
          <div className="h-0.5 bg-gray-400 rounded w-3/4" />
        </div>
      );
    case "nova":
      return (
        <div className="h-full bg-gradient-to-br from-[#fff] to-[#FFCB9A]/20 p-2 text-[5px]">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-[#116466] to-[#FFCB9A]" />
            <div>
              <div className="h-1.5 bg-[#116466] rounded-sm w-3/4" />
              <div className="h-0.5 bg-[#FFCB9A] w-1/2" />
            </div>
          </div>
          <div className="h-px bg-[#116466]/30 my-1" />
          <div className="grid grid-cols-3 gap-0.5">
            <div className="h-1 bg-[#FFCB9A] rounded" />
            <div className="h-1 bg-[#116466] rounded" />
            <div className="h-1 bg-[#D9B08C] rounded" />
          </div>
          <div className="space-y-0.5 mt-1">
            <div className="h-0.5 bg-gray-700 rounded w-1/3" />
            <div className="h-0.5 bg-gray-400 rounded" />
            <div className="h-0.5 bg-gray-400 rounded w-2/3" />
          </div>
        </div>
      );
    default:
      return null;
  }
}
