"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Eye, ChevronLeft, Star } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { TEMPLATES, TEMPLATE_CATEGORIES } from "@/lib/templates";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TemplatePreview as TemplatePreviewCanvas } from "@/components/editor/TemplatePreview";

export function TemplateGallery() {
  const setView = useAppStore((s) => s.setView);
  const cvs = useAppStore((s) => s.cvs);
  const currentCVId = useAppStore((s) => s.currentCVId);
  const updateCV = useAppStore((s) => s.updateCV);
  const [filter, setFilter] = useState("All");
  const [preview, setPreview] = useState<string | null>(null);

  const cv = cvs.find((c) => c.id === currentCVId);

  const filtered = filter === "All"
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.category === filter || (filter === "ATS Friendly" && t.atsFriendly));

  const handleUse = (templateId: string) => {
    if (cv) {
      updateCV(cv.id, { template: templateId });
      setView("preparing");
    } else {
      // No CV — create one with this template (browse-first flow)
      const id = useAppStore.getState().createCV("form");
      useAppStore.getState().updateCV(id, { template: templateId });
      setView("preparing");
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Top bar */}
      <div className="sticky top-16 z-30 bg-[#2C3531]/80 backdrop-blur-xl border-b border-[#D1E8E2]/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <button onClick={() => setView(cv ? "form-builder" : "landing")} className="inline-flex items-center gap-1 text-sm text-[#9DB5B0] hover:text-[#D1E8E2] transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <div className="text-sm text-[#D1E8E2]/80">
              {cv ? `Choosing template for ${cv.name}` : "Browse templates"}
            </div>
            <div className="w-20" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#D1E8E2]">Choose Your CV Style</h1>
          <p className="mt-2 text-[#9DB5B0]">Don&apos;t worry. You can change the template later.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {TEMPLATE_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-sm transition-all",
                filter === c
                  ? "bg-[#116466] text-[#D1E8E2] border border-[#116466]"
                  : "bg-[#3D4944]/50 text-[#9DB5B0] border border-[#D1E8E2]/10 hover:border-[#D1E8E2]/30"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tpl, i) => {
            const isSelected = cv?.template === tpl.id;
            return (
              <motion.div
                key={tpl.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className={cn(
                  "group relative rounded-xl overflow-hidden glass-card hover:border-[#116466] transition-all duration-300",
                  isSelected && "border-[#FFCB9A] ring-2 ring-[#FFCB9A]/30"
                )}
              >
                {/* Preview */}
                <div className="relative overflow-hidden bg-[#1a1a1a] cursor-pointer" onClick={() => setPreview(tpl.id)}>
                  <div style={{ aspectRatio: "1 / 1.3" }} className="relative">
                    <TemplatePreviewCanvas templateId={tpl.id} cv={cv || null} compact />
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C3531]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                    <Button variant="ghost" size="sm" className="text-[#D1E8E2] bg-[#2C3531]/80 hover:bg-[#3D4944]">
                      <Eye className="w-4 h-4 mr-1.5" /> Preview
                    </Button>
                  </div>

                  {tpl.atsFriendly && (
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-[#FFCB9A]/90 text-[#2C3531] text-[10px] font-semibold">
                      ATS
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#FFCB9A] flex items-center justify-center">
                      <Check className="w-4 h-4 text-[#2C3531]" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-[#D1E8E2]">{tpl.name}</h3>
                      <span className="text-xs text-[#9DB5B0]">{tpl.category}</span>
                    </div>
                    {tpl.atsFriendly && <Star className="w-3.5 h-3.5 text-[#FFCB9A]" />}
                  </div>
                  <p className="text-xs text-[#9DB5B0] mt-1.5 line-clamp-2">{tpl.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      onClick={() => handleUse(tpl.id)}
                      className={cn(
                        "flex-1 h-9",
                        isSelected ? "bg-[#FFCB9A] hover:bg-[#FFCB9A]/90 text-[#2C3531]" : "bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]"
                      )}
                    >
                      {isSelected ? "Selected" : "Use This Template"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Full preview modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C3531]/95 backdrop-blur-md" onClick={() => setPreview(null)}>
          <div className="max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-[#D1E8E2]">{TEMPLATES.find(t => t.id === preview)?.name}</h3>
                <p className="text-xs text-[#9DB5B0]">{TEMPLATES.find(t => t.id === preview)?.description}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => { handleUse(preview); setPreview(null); }} className="bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]">
                  Use This Template
                </Button>
                <Button variant="ghost" onClick={() => setPreview(null)} className="text-[#9DB5B0]">Close</Button>
              </div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden">
              <TemplatePreviewCanvas templateId={preview} cv={cv || null} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
