"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ArrowRight, Eye, Layers } from "lucide-react";
import { CVData, COLOR_SCHEMES } from "@/lib/types";
import { TEMPLATES } from "@/lib/templates";
import { Button } from "@/components/ui/button";
import { TemplatePreview } from "@/components/editor/TemplatePreview";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  selectedIds: string[];
  cv: CVData | null;
  onUseTemplate: (id: string) => void;
}

export function CompareModal({ open, onOpenChange, selectedIds, cv, onUseTemplate }: Props) {
  const [colorScheme, setColorScheme] = useState<string>(cv?.design.colorScheme || "nirvash");

  if (!open || selectedIds.length === 0) return null;

  const templates = selectedIds.map((id) => TEMPLATES.find((t) => t.id === id)).filter(Boolean);

  // Build a CV with the chosen color scheme for preview
  const previewCV: CVData | null = cv ? {
    ...cv,
    design: { ...cv.design, colorScheme },
  } : null;

  return (
    <div className="fixed inset-0 z-50 bg-[#2C3531]/95 backdrop-blur-md flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#D1E8E2]/10">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#FFCB9A]" />
          <h2 className="text-lg font-semibold text-[#D1E8E2]">Compare Templates</h2>
          <span className="text-xs text-[#9DB5B0]">({templates.length} selected)</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Color scheme quick switch */}
          <div className="hidden md:flex items-center gap-1.5">
            <span className="text-xs text-[#9DB5B0]">Color:</span>
            {Object.entries(COLOR_SCHEMES).slice(0, 8).map(([key, sc]) => (
              <button
                key={key}
                onClick={() => setColorScheme(key)}
                className={cn(
                  "w-5 h-5 rounded-full border-2 transition-all",
                  colorScheme === key ? "border-[#FFCB9A] scale-110" : "border-transparent hover:border-[#D1E8E2]/40"
                )}
                style={{ background: sc.accent }}
                title={sc.name}
              />
            ))}
          </div>
          <button onClick={() => onOpenChange(false)} className="text-[#9DB5B0] hover:text-[#D1E8E2] p-2">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Templates side-by-side */}
      <div className="flex-1 overflow-auto p-4">
        <div className={cn(
          "grid gap-4 mx-auto",
          selectedIds.length === 1 && "max-w-md grid-cols-1",
          selectedIds.length === 2 && "max-w-3xl grid-cols-2",
          selectedIds.length === 3 && "max-w-6xl grid-cols-3",
        )}>
          {templates.map((tpl) => (
            <div key={tpl!.id} className="space-y-2">
              <div className="text-center">
                <h3 className="text-base font-semibold text-[#D1E8E2]">{tpl!.name}</h3>
                <p className="text-xs text-[#9DB5B0]">{tpl!.category}</p>
              </div>
              <div className="bg-white rounded-lg overflow-hidden shadow-xl" style={{ aspectRatio: "1 / 1.414" }}>
                <TemplatePreview templateId={tpl!.id} cv={previewCV} />
              </div>
              <Button
                onClick={() => { onUseTemplate(tpl!.id); onOpenChange(false); }}
                className="w-full bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]"
              >
                Use This Template <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
