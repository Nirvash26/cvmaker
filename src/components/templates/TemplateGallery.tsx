"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Check, Eye, ChevronLeft, Star, GitCompare, Sparkles, X, ArrowRight,
  LayoutGrid, Wand2, Code, Briefcase, Palette, GraduationCap, Megaphone,
  DollarSign, HeartPulse, BookOpen, MoreHorizontal,
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

  // Featured templates
  const featured = useMemo(() => {
    const featuredIds = ["apex", "executive", "first-step", "signal", "quantum"];
    return featuredIds.map((id) => TEMPLATES.find((t) => t.id === id)).filter(Boolean);
  }, []);

  // Filter templates
  const filtered = useMemo(() => {
    let list = TEMPLATES;
    if (filter === "Recommended") {
      list = TEMPLATES.filter((t) => t.featured || t.atsFriendly);
    } else if (filter === "ATS Friendly") {
      list = TEMPLATES.filter((t) => t.atsFriendly);
    } else if (filter === "One Page") {
      list = TEMPLATES.filter((t) => t.onePage);
    } else if (filter === "Two Column") {
      list = TEMPLATES.filter((t) => ["vertex", "vivid", "sidebar-tpl", "split", "horizon", "studio", "prism"].includes(t.id));
    } else if (filter === "With Photo") {
      list = TEMPLATES.filter((t) => t.hasPhoto);
    } else if (filter === "Without Photo") {
      list = TEMPLATES.filter((t) => !t.hasPhoto);
    } else if (filter !== "All") {
      list = TEMPLATES.filter((t) => t.category === filter);
    }

    // If roleRecs is set, show only those
    if (roleRecs) {
      list = list.filter((t) => roleRecs.includes(t.id));
    }

    return list;
  }, [filter, roleRecs]);

  // Build a preview CV with optional quick color override
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

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* Hero heading */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-5xl font-bold text-[#D1E8E2]">
            Choose Your <span className="text-gradient-mint">CV Style</span>
          </h1>
          <p className="mt-3 text-[#9DB5B0]">
            Don&apos;t worry — you can change the template later. {TEMPLATES.length} templates available.
          </p>
        </div>

        {/* Featured Templates */}
        {!roleRecs && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-5 h-5 text-[#FFCB9A]" />
              <h2 className="text-xl font-bold text-[#D1E8E2]">Featured Templates</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {featured.map((tpl, i) => (
                <motion.div
                  key={tpl!.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="group relative rounded-xl overflow-hidden glass-card hover:border-[#FFCB9A]/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-[#FFCB9A] text-[10px] font-bold text-[#2C3531]">
                    {tpl!.featured && FEATURED_LABELS[tpl!.featured]}
                  </div>
                  <div className="bg-[#1a1a1a] cursor-pointer overflow-hidden" onClick={() => setPreview(tpl!.id)} style={{ aspectRatio: "1 / 1.3" }}>
                    <TemplatePreviewCanvas templateId={tpl!.id} cv={getPreviewCV(tpl!.id)} compact />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-[#D1E8E2]">{tpl!.name}</h3>
                    <p className="text-[10px] text-[#9DB5B0] line-clamp-1">{tpl!.description}</p>
                    <Button
                      size="sm"
                      onClick={() => handleUse(tpl!.id)}
                      className="w-full mt-2 h-7 text-xs bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]"
                    >
                      Use Template
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Find the Perfect Template */}
        {!roleRecs && (
          <div className="mb-10 p-6 rounded-2xl glass-card">
            <div className="flex items-center gap-2 mb-4">
              <Wand2 className="w-5 h-5 text-[#FFCB9A]" />
              <h2 className="text-xl font-bold text-[#D1E8E2]">Find the Perfect Template</h2>
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

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {TEMPLATE_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => { setFilter(c); setRoleRecs(null); }}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm transition-all",
                filter === c && !roleRecs
                  ? "bg-[#116466] text-[#D1E8E2] border border-[#116466]"
                  : "bg-[#3D4944]/50 text-[#9DB5B0] border border-[#D1E8E2]/10 hover:border-[#D1E8E2]/30"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((tpl, i) => {
            const isSelected = cv?.template === tpl.id;
            const isCompareSelected = selectedForCompare.includes(tpl.id);
            return (
              <motion.div
                key={tpl.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.5) }}
                className={cn(
                  "group relative rounded-xl overflow-hidden glass-card hover:border-[#116466] transition-all duration-300",
                  isSelected && "border-[#FFCB9A] ring-2 ring-[#FFCB9A]/30",
                  isCompareSelected && "border-[#FFCB9A] ring-1 ring-[#FFCB9A]/40"
                )}
              >
                {/* Preview */}
                <div className="relative bg-[#1a1a1a] overflow-hidden cursor-pointer" onClick={() => setPreview(tpl.id)} style={{ aspectRatio: "1 / 1.3" }}>
                  <TemplatePreviewCanvas templateId={tpl.id} cv={getPreviewCV(tpl.id)} compact />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C3531]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                    <Button size="sm" className="bg-[#2C3531]/90 hover:bg-[#3D4944] text-[#D1E8E2]">
                      <Eye className="w-3.5 h-3.5 mr-1" /> Preview
                    </Button>
                  </div>

                  {/* Badges top-left */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {tpl.atsFriendly && (
                      <span className="px-1.5 py-0.5 rounded-md bg-[#FFCB9A]/90 text-[#2C3531] text-[9px] font-semibold">ATS</span>
                    )}
                    {tpl.onePage && (
                      <span className="px-1.5 py-0.5 rounded-md bg-[#116466]/90 text-[#D1E8E2] text-[9px] font-semibold">1 PAGE</span>
                    )}
                    {tpl.hasPhoto && (
                      <span className="px-1.5 py-0.5 rounded-md bg-[#D9B08C]/90 text-[#2C3531] text-[9px] font-semibold">PHOTO</span>
                    )}
                  </div>

                  {/* Compare checkbox top-right */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleCompare(tpl.id); }}
                    className={cn(
                      "absolute top-2 right-2 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all",
                      isCompareSelected
                        ? "bg-[#FFCB9A] border-[#FFCB9A]"
                        : "bg-[#2C3531]/80 border-[#D1E8E2]/30 hover:border-[#FFCB9A]"
                    )}
                    title="Add to compare"
                  >
                    {isCompareSelected && <Check className="w-4 h-4 text-[#2C3531]" />}
                  </button>

                  {isSelected && (
                    <div className="absolute top-2 right-9 w-6 h-6 rounded-full bg-[#FFCB9A] flex items-center justify-center">
                      <Check className="w-4 h-4 text-[#2C3531]" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-[#D1E8E2] truncate">{tpl.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="px-1.5 py-0.5 rounded bg-[#3D4944] text-[10px] text-[#9DB5B0]">{tpl.category}</span>
                        {tpl.featured && (
                          <span className="px-1.5 py-0.5 rounded bg-[#FFCB9A]/15 text-[10px] text-[#FFCB9A]">
                            {FEATURED_LABELS[tpl.featured]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-[#9DB5B0] mt-1.5 line-clamp-2">{tpl.description}</p>

                  {/* Quick color swatches */}
                  <div className="mt-3 flex items-center gap-1.5">
                    <span className="text-[10px] text-[#9DB5B0]">Color:</span>
                    {Object.entries(COLOR_SCHEMES).slice(0, 6).map(([key, sc]) => (
                      <button
                        key={key}
                        onClick={() => setQuickColor({ ...quickColor, [tpl.id]: key })}
                        className={cn(
                          "w-4 h-4 rounded-full border transition-all hover:scale-110",
                          (quickColor[tpl.id] || cv?.design.colorScheme || "nirvash") === key
                            ? "border-[#FFCB9A] scale-110"
                            : "border-transparent"
                        )}
                        style={{ background: sc.accent }}
                        title={sc.name}
                      />
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      onClick={() => handleUse(tpl.id)}
                      className={cn(
                        "flex-1 h-9",
                        isSelected ? "bg-[#FFCB9A] hover:bg-[#FFCB9A]/90 text-[#2C3531]" : "bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]"
                      )}
                    >
                      {isSelected ? "Selected ✓" : "Use Template"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreview(tpl.id)}
                      className="text-[#9DB5B0] hover:text-[#D1E8E2] h-9 px-3"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
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
                {/* Quick color swatches in preview */}
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
              <TemplatePreviewCanvas
                templateId={preview}
                cv={getPreviewCV(preview)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Compare modal */}
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
