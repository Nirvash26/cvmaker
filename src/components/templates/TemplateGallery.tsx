"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Check, Eye, ChevronLeft, Star, GitCompare, Sparkles, ArrowRight,
  Wand2, Code, Briefcase, Palette, GraduationCap, Megaphone, DollarSign,
  HeartPulse, BookOpen, MoreHorizontal, X,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { TEMPLATES, TEMPLATE_CATEGORIES, FEATURED_LABELS, ROLE_OPTIONS } from "@/lib/templates";
import { COLOR_SCHEMES } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TemplatePreview as TemplatePreviewCanvas } from "@/components/editor/TemplatePreview";
import { CompareModal } from "./CompareModal";
import { toast } from "sonner";

const ROLE_ICONS: Record<string, any> = {
  "Software / Tech": Code,
  "Business / Corporate": Briefcase,
  "Design / Creative": Palette,
  "Student / Internship": GraduationCap,
  "Marketing": Megaphone,
  "Finance": DollarSign,
  "Healthcare": HeartPulse,
  "Education": BookOpen,
  "Other": MoreHorizontal,
};

// Subtle pill nav (no longer 17 categories — just the key visual ones)
const SUBTLE_CATEGORIES = [
  "All", "Minimal", "Modern", "Professional", "Creative",
  "Tech", "Student", "Executive", "ATS Friendly",
];

export function TemplateGallery() {
  const setView = useAppStore((s) => s.setView);
  const cvs = useAppStore((s) => s.cvs);
  const currentCVId = useAppStore((s) => s.currentCVId);
  const updateCV = useAppStore((s) => s.updateCV);
  const [filter, setFilter] = useState("All");
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [roleRecs, setRoleRecs] = useState<string[] | null>(null);
  const [quickColor, setQuickColor] = useState<Record<string, string>>({});

  const cv = cvs.find((c) => c.id === currentCVId);

  const handleUse = (templateId: string) => {
    if (cv) {
      updateCV(cv.id, { template: templateId });
      setView("preparing");
    } else {
      const id = useAppStore.getState().createCV("form");
      useAppStore.getState().updateCV(id, { template: templateId });
      setView("preparing");
    }
  };

  const toggleCompare = (id: string) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) {
        toast.info("You can compare up to 3 templates at a time.");
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleRoleSelect = (role: string) => {
    const recs = TEMPLATES.filter((t) => t.recommendedFor?.includes(role)).slice(0, 6);
    setRoleRecs(recs.map((t) => t.id));
    setFilter("All");
  };

  // Featured single template (Editor's Choice)
  const featuredTemplate = useMemo(() => TEMPLATES.find((t) => t.id === "vertex") || TEMPLATES[0], []);

  // Filter templates
  const filtered = useMemo(() => {
    let list = TEMPLATES;
    if (filter === "ATS Friendly") {
      list = TEMPLATES.filter((t) => t.atsFriendly);
    } else if (filter !== "All") {
      list = TEMPLATES.filter((t) => t.category === filter);
    }
    if (roleRecs) {
      list = list.filter((t) => roleRecs.includes(t.id));
    }
    return list;
  }, [filter, roleRecs]);

  const getPreviewCV = (templateId: string) => {
    if (!cv) return null;
    const colorOverride = quickColor[templateId];
    if (colorOverride) {
      return { ...cv, design: { ...cv.design, colorScheme: colorOverride } };
    }
    return cv;
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
            <div className="text-sm text-[#D1E8E2]/80 hidden sm:block">
              {cv ? `Choosing template for ${cv.name}` : "Browse templates"}
            </div>
            <div className="flex items-center gap-2">
              {selectedForCompare.length > 0 && (
                <Button
                  size="sm"
                  onClick={() => setCompareOpen(true)}
                  className="bg-[#FFCB9A] hover:bg-[#FFCB9A]/90 text-[#2C3531]"
                >
                  <GitCompare className="w-3.5 h-3.5 mr-1" />
                  Compare ({selectedForCompare.length})
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        {/* HERO AREA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#D1E8E2]">
            Find your perfect <span className="text-gradient-mint">layout.</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#9DB5B0] max-w-xl mx-auto">
            Start with a design that fits your story. {TEMPLATES.length} unique templates to choose from.
          </p>

          {/* Subtle pill navigation */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {SUBTLE_CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => { setFilter(c); setRoleRecs(null); }}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                  filter === c && !roleRecs
                    ? "bg-[#116466]/30 text-[#D1E8E2] border border-[#116466]/50"
                    : "text-[#9DB5B0] hover:text-[#D1E8E2] border border-transparent hover:bg-[#3D4944]/40"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </motion.div>

        {/* FEATURED TEMPLATE — single large highlighted */}
        {!roleRecs && filter === "All" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-16 rounded-3xl glass-card overflow-hidden"
          >
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Large CV preview — left side */}
              <div className="relative bg-[#1a1a1a] p-8 flex items-center justify-center min-h-[400px]">
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFCB9A] text-[#2C3531] text-xs font-bold">
                  <Star className="w-3 h-3 fill-current" />
                  Editor&apos;s Choice
                </div>
                <div
                  className="relative w-full max-w-sm rounded-xl overflow-hidden shadow-2xl cursor-pointer transition-transform hover:scale-[1.02]"
                  onClick={() => setPreview(featuredTemplate.id)}
                  style={{ aspectRatio: "1 / 1.414" }}
                >
                  <TemplatePreviewCanvas templateId={featuredTemplate.id} cv={getPreviewCV(featuredTemplate.id)} />
                </div>
              </div>

              {/* Right side — info and actions */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="text-xs text-[#FFCB9A] font-semibold uppercase tracking-widest mb-2">Featured Template</div>
                <h2 className="text-4xl sm:text-5xl font-bold text-[#D1E8E2] tracking-tight">{featuredTemplate.name}</h2>
                <p className="mt-3 text-base text-[#9DB5B0] leading-relaxed">
                  {featuredTemplate.description}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-[#9DB5B0]">
                  <span className="px-2 py-0.5 rounded bg-[#3D4944]">{featuredTemplate.category}</span>
                  {featuredTemplate.atsFriendly && (
                    <span className="px-2 py-0.5 rounded bg-[#FFCB9A]/15 text-[#FFCB9A]">ATS Friendly</span>
                  )}
                </div>

                {/* Color swatches */}
                <div className="mt-6 flex items-center gap-2">
                  <span className="text-xs text-[#9DB5B0] mr-1">Color:</span>
                  {Object.entries(COLOR_SCHEMES).slice(0, 6).map(([key, sc]) => (
                    <button
                      key={key}
                      onClick={() => setQuickColor({ ...quickColor, [featuredTemplate.id]: key })}
                      className={cn(
                        "w-5 h-5 rounded-full border-2 hover:scale-110 transition-all",
                        (quickColor[featuredTemplate.id] || cv?.design.colorScheme || "nirvash") === key
                          ? "border-[#FFCB9A] scale-110"
                          : "border-transparent"
                      )}
                      style={{ background: sc.accent }}
                      title={sc.name}
                    />
                  ))}
                </div>

                <div className="mt-8 flex items-center gap-3">
                  <Button
                    onClick={() => handleUse(featuredTemplate.id)}
                    className="bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2] h-11 px-6"
                  >
                    Use Template <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setPreview(featuredTemplate.id)}
                    className="text-[#9DB5B0] hover:text-[#D1E8E2] h-11"
                  >
                    <Eye className="w-4 h-4 mr-1.5" /> Preview
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Find the Perfect Template */}
        {!roleRecs && (
          <div className="mb-10 p-6 rounded-2xl glass-card">
            <div className="flex items-center gap-2 mb-4">
              <Wand2 className="w-5 h-5 text-[#FFCB9A]" />
              <h2 className="text-lg font-bold text-[#D1E8E2]">Find the Perfect Template</h2>
            </div>
            <p className="text-sm text-[#9DB5B0] mb-4">What are you creating this CV for?</p>
            <div className="flex flex-wrap gap-2">
              {ROLE_OPTIONS.map((role) => {
                const Icon = ROLE_ICONS[role] || MoreHorizontal;
                return (
                  <button
                    key={role}
                    onClick={() => handleRoleSelect(role)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#3D4944]/50 border border-[#D1E8E2]/15 text-[#9DB5B0] hover:text-[#FFCB9A] hover:border-[#FFCB9A]/50 transition-all text-sm"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {role}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Role recommendation banner */}
        {roleRecs && (
          <div className="mb-6 p-4 rounded-xl bg-[#116466]/20 border border-[#116466]/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FFCB9A]" />
              <span className="text-sm text-[#D1E8E2]">
                Showing <strong className="text-[#FFCB9A]">{filtered.length}</strong> recommended templates for your role
              </span>
            </div>
            <button onClick={() => setRoleRecs(null)} className="text-xs text-[#9DB5B0] hover:text-[#D1E8E2]">
              Show all templates
            </button>
          </div>
        )}

        {/* EXPLORE TEMPLATES — large previews, 3 columns max */}
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-2xl font-bold text-[#D1E8E2]">Explore Templates</h2>
          <span className="text-xs text-[#9DB5B0]">{filtered.length} templates</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tpl, i) => {
            const isSelected = cv?.template === tpl.id;
            const isCompareSelected = selectedForCompare.includes(tpl.id);
            return (
              <motion.div
                key={tpl.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.5) }}
                className="group relative rounded-xl overflow-hidden bg-[#34403B]/40 border border-[#D1E8E2]/8 hover:border-[#116466]/50 transition-all duration-300"
              >
                {/* Larger preview */}
                <div className="relative bg-[#1a1a1a] overflow-hidden cursor-pointer" style={{ aspectRatio: "1 / 1.3" }}>
                  <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                    <TemplatePreviewCanvas templateId={tpl.id} cv={getPreviewCV(tpl.id)} compact />
                  </div>

                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C3531] via-[#2C3531]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Top badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {tpl.atsFriendly && (
                      <span className="px-1.5 py-0.5 rounded-md bg-[#FFCB9A]/90 text-[#2C3531] text-[10px] font-semibold">ATS</span>
                    )}
                    {tpl.featured && (
                      <span className="px-1.5 py-0.5 rounded-md bg-[#FFCB9A]/20 backdrop-blur-sm text-[#FFCB9A] text-[10px] font-semibold border border-[#FFCB9A]/30">
                        {FEATURED_LABELS[tpl.featured]}
                      </span>
                    )}
                  </div>

                  {/* Compare checkbox */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleCompare(tpl.id); }}
                    className={cn(
                      "absolute top-3 right-3 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all backdrop-blur-sm",
                      isCompareSelected
                        ? "bg-[#FFCB9A] border-[#FFCB9A]"
                        : "bg-[#2C3531]/70 border-[#D1E8E2]/30 hover:border-[#FFCB9A] opacity-0 group-hover:opacity-100"
                    )}
                    title="Add to compare"
                  >
                    {isCompareSelected && <Check className="w-4 h-4 text-[#2C3531]" />}
                  </button>

                  {/* Hover actions */}
                  <div className="absolute inset-x-0 bottom-0 p-4 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                    <Button
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); handleUse(tpl.id); }}
                      className="bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2] h-9"
                    >
                      Use Template <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => { e.stopPropagation(); setPreview(tpl.id); }}
                      className="bg-[#2C3531]/80 hover:bg-[#3D4944] text-[#D1E8E2] h-9 w-9 p-0"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>

                  {isSelected && (
                    <div className="absolute top-3 right-10 w-6 h-6 rounded-full bg-[#FFCB9A] flex items-center justify-center">
                      <Check className="w-4 h-4 text-[#2C3531]" />
                    </div>
                  )}
                </div>

                {/* Minimal info below */}
                <div className="p-4">
                  <h3 className="text-base font-semibold text-[#D1E8E2]">{tpl.name}</h3>
                  <div className="text-xs text-[#9DB5B0] mt-1">
                    {tpl.category}{tpl.atsFriendly && " · ATS Friendly"}
                  </div>

                  {/* Quick color swatches */}
                  <div className="mt-3 flex items-center gap-1.5">
                    {Object.entries(COLOR_SCHEMES).slice(0, 5).map(([key, sc]) => (
                      <button
                        key={key}
                        onClick={() => setQuickColor({ ...quickColor, [tpl.id]: key })}
                        className={cn(
                          "w-4 h-4 rounded-full border hover:scale-110 transition-all",
                          (quickColor[tpl.id] || cv?.design.colorScheme || "nirvash") === key
                            ? "border-[#FFCB9A] scale-110"
                            : "border-transparent"
                        )}
                        style={{ background: sc.accent }}
                        title={sc.name}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#9DB5B0]">No templates match this filter.</p>
            <Button
              onClick={() => { setFilter("All"); setRoleRecs(null); }}
              className="mt-4 bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]"
            >
              Show all templates
            </Button>
          </div>
        )}
      </div>

      {/* Full preview modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C3531]/95 backdrop-blur-md" onClick={() => setPreview(null)}>
          <div className="max-w-4xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-[#D1E8E2]">{TEMPLATES.find(t => t.id === preview)?.name}</h3>
                <p className="text-xs text-[#9DB5B0]">{TEMPLATES.find(t => t.id === preview)?.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-1">
                  {Object.entries(COLOR_SCHEMES).slice(0, 8).map(([key, sc]) => (
                    <button
                      key={key}
                      onClick={() => setQuickColor({ ...quickColor, [preview]: key })}
                      className="w-5 h-5 rounded-full border-2 hover:scale-110 transition-all"
                      style={{ background: sc.accent, borderColor: quickColor[preview] === key ? "#FFCB9A" : "transparent" }}
                      title={sc.name}
                    />
                  ))}
                </div>
                <Button onClick={() => { handleUse(preview); setPreview(null); }} className="bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]">
                  Use This Template <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
                <Button variant="ghost" onClick={() => setPreview(null)} className="text-[#9DB5B0]">Close</Button>
              </div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden">
              <TemplatePreviewCanvas templateId={preview} cv={getPreviewCV(preview)} />
            </div>
          </div>
        </div>
      )}

      <CompareModal
        open={compareOpen}
        onOpenChange={setCompareOpen}
        selectedIds={selectedForCompare}
        cv={cv || null}
        onUseTemplate={handleUse}
      />
    </div>
  );
}
