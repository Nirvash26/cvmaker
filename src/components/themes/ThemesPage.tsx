"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Check, Sparkles } from "lucide-react";
import { useAppStore, useCurrentCV } from "@/lib/store";
import { COLOR_SCHEMES } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { TemplatePreview } from "@/components/editor/TemplatePreview";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const COLLECTIONS = [
  { id: "professional", name: "Professional Collection", themes: ["nirvash", "navy", "charcoal", "midnight", "graphite"] },
  { id: "creative", name: "Creative Collection", themes: ["coral", "rose", "spectrum", "plum"] },
  { id: "nature", name: "Nature Collection", themes: ["forest", "sand", "ocean", "emerald"] },
  { id: "bold", name: "Bold Collection", themes: ["rubyNoir", "sunburst", "copper", "burgundy"] },
];

const ACCENT_OPTIONS = [
  { id: "teal", label: "Teal", color: "#116466", schemeId: "nirvash" },
  { id: "ruby", label: "Ruby", color: "#B11226", schemeId: "rubyNoir" },
  { id: "blue", label: "Blue", color: "#1D4ED8", schemeId: "cobalt" },
  { id: "purple", label: "Purple", color: "#7E22CE", schemeId: "plum" },
  { id: "orange", label: "Orange", color: "#D97706", schemeId: "sunburst" },
  { id: "green", label: "Green", color: "#047857", schemeId: "emerald" },
];

export function ThemesPage() {
  const cv = useCurrentCV();
  const setView = useAppStore((s) => s.setView);
  const updateDesign = useAppStore((s) => s.updateDesign);
  const [previewScheme, setPreviewScheme] = useState<string>(cv?.design.colorScheme || "nirvash");

  const previewCV = useMemo(() => {
    if (!cv) return null;
    return {
      ...cv,
      design: { ...cv.design, colorScheme: previewScheme },
    };
  }, [cv, previewScheme]);

  if (!cv) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-[#9DB5B0] mb-4">Create or select a CV to customize its theme.</p>
          <Button onClick={() => setView("dashboard")} className="bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const applyTheme = (schemeId: string) => {
    setPreviewScheme(schemeId);
    updateDesign(cv.id, { colorScheme: schemeId });
    const sc = COLOR_SCHEMES[schemeId];
    toast.success(`${sc.name} theme applied`);
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="sticky top-16 z-30 bg-[#2C3531]/80 backdrop-blur-xl border-b border-[#D1E8E2]/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <button onClick={() => setView("editor")} className="inline-flex items-center gap-1 text-sm text-[#9DB5B0] hover:text-[#D1E8E2] transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back to Editor
            </button>
            <div className="text-sm text-[#D1E8E2] font-medium">Theme Studio</div>
            <div className="w-20" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-5xl font-bold text-[#D1E8E2]">
            Make Nirvash <span className="text-gradient-mint">yours.</span>
          </h1>
          <p className="mt-3 text-[#9DB5B0]">Choose a theme that fits your story. Preview updates instantly.</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          {/* LEFT: Large live preview */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <div className="relative bg-[#1a1a1a] rounded-2xl p-6 sm:p-10 overflow-hidden">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${COLOR_SCHEMES[previewScheme].accent}, transparent 70%)`,
                }}
              />
              <motion.div
                key={previewScheme}
                initial={{ opacity: 0.6, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="relative mx-auto rounded-lg overflow-hidden shadow-2xl"
                style={{ maxWidth: "500px", aspectRatio: "1 / 1.414" }}
              >
                <TemplatePreview templateId={cv.template} cv={previewCV} />
              </motion.div>
            </div>
            <p className="text-center text-xs text-[#9DB5B0] mt-3">
              Currently previewing: <span className="text-[#FFCB9A]">{COLOR_SCHEMES[previewScheme].name}</span>
              {COLOR_SCHEMES[previewScheme].subtitle && ` — ${COLOR_SCHEMES[previewScheme].subtitle}`}
            </p>
          </div>

          {/* RIGHT: Theme controls */}
          <div className="space-y-6">
            <div className="p-5 rounded-xl glass-card">
              <h3 className="text-xs uppercase tracking-wider text-[#9DB5B0] mb-3">Accent</h3>
              <div className="grid grid-cols-3 gap-2">
                {ACCENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => applyTheme(opt.schemeId)}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-[#3D4944]/50 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full border-2 border-[#D1E8E2]/20" style={{ background: opt.color }} />
                    <span className="text-[10px] text-[#9DB5B0]">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl glass-card">
              <h3 className="text-xs uppercase tracking-wider text-[#9DB5B0] mb-3">All Themes ({Object.keys(COLOR_SCHEMES).length})</h3>
              <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto no-scrollbar pr-1">
                {Object.entries(COLOR_SCHEMES).map(([key, sc]) => (
                  <button
                    key={key}
                    onClick={() => applyTheme(key)}
                    title={sc.subtitle ? `${sc.name} — ${sc.subtitle}` : sc.name}
                    className={cn(
                      "p-1.5 rounded-md border-2 transition-all flex flex-col gap-0.5 relative",
                      previewScheme === key ? "border-[#FFCB9A]" : "border-transparent hover:border-[#D1E8E2]/20"
                    )}
                    style={{ background: sc.bg }}
                  >
                    {sc.premium && (
                      <span className="absolute -top-1 -right-1 px-1 py-0 rounded bg-[#FFCB9A] text-[7px] font-bold text-[#2C3531] leading-tight">PRO</span>
                    )}
                    {previewScheme === key && (
                      <span className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-[#FFCB9A] flex items-center justify-center">
                        <Check className="w-2 h-2 text-[#2C3531]" />
                      </span>
                    )}
                    <div className="w-full h-2.5 rounded-sm" style={{ background: sc.accent }} />
                    <div className="w-full h-1.5 rounded-sm" style={{ background: sc.text }} />
                    <span className="text-[8px] text-center leading-tight truncate" style={{ color: sc.text }}>{sc.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={() => {
                updateDesign(cv.id, { colorScheme: previewScheme });
                setView("editor");
                toast.success("Theme saved!");
              }}
              className="w-full bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2] h-11"
            >
              <Check className="w-4 h-4 mr-1.5" /> Apply Theme & Return to Editor
            </Button>
          </div>
        </div>

        {/* Theme Collections */}
        <div className="mt-16">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-[#FFCB9A]" />
            <h2 className="text-xl font-bold text-[#D1E8E2]">Theme Collections</h2>
          </div>
          <p className="text-sm text-[#9DB5B0] mb-6">Curated palettes grouped by mood. Click any theme to apply.</p>

          <div className="space-y-8">
            {COLLECTIONS.map((collection) => (
              <div key={collection.id}>
                <h3 className="text-sm font-semibold text-[#FFCB9A] mb-3">{collection.name}</h3>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                  {collection.themes.map((themeId) => {
                    const sc = COLOR_SCHEMES[themeId];
                    if (!sc) return null;
                    return (
                      <button
                        key={themeId}
                        onClick={() => applyTheme(themeId)}
                        className={cn(
                          "flex-shrink-0 w-44 p-3 rounded-xl border-2 transition-all hover:scale-[1.02]",
                          previewScheme === themeId ? "border-[#FFCB9A]" : "border-[#D1E8E2]/10 hover:border-[#D1E8E2]/30"
                        )}
                        style={{ background: sc.bg }}
                      >
                        {sc.premium && (
                          <span className="inline-block px-1.5 py-0.5 rounded bg-[#FFCB9A] text-[8px] font-bold text-[#2C3531] mb-1.5">PRO</span>
                        )}
                        <div className="space-y-1.5">
                          <div className="flex gap-1">
                            {sc.swatches?.slice(0, 5).map((c, i) => (
                              <div key={i} className="w-6 h-6 rounded-full" style={{ background: c, border: `1px solid ${sc.text}20` }} />
                            ))}
                          </div>
                          <div className="text-sm font-semibold" style={{ color: sc.text }}>{sc.name}</div>
                          {sc.subtitle && <div className="text-[10px] italic" style={{ color: sc.muted }}>{sc.subtitle}</div>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
