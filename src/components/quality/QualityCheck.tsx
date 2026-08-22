"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, X, ArrowRight } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { CVData, QualityScore, QualitySuggestion } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  cv: CVData;
}

function calculateScore(cv: CVData): { score: QualityScore; suggestions: QualitySuggestion[] } {
  const checks: { ok: boolean; weight: number; text: string; section?: string }[] = [
    { ok: !!(cv.personal.fullName && cv.personal.email && cv.personal.phone), weight: 15, text: "Contact information is complete", section: "personal" },
    { ok: cv.summary.length > 50, weight: 20, text: "Professional summary added", section: "summary" },
    { ok: cv.experience.length > 0, weight: 25, text: "Work experience added", section: "experience" },
    { ok: cv.experience.some((e) => e.achievements && e.achievements.length > 0), weight: 10, text: "Measurable achievements added", section: "experience" },
    { ok: cv.education.length > 0, weight: 10, text: "Education information included", section: "education" },
    { ok: cv.skills.length >= 5, weight: 10, text: "Sufficient skills listed", section: "skills" },
    { ok: cv.skills.length >= 8, weight: 5, text: "Role-specific skills added", section: "skills" },
    { ok: cv.projects.length > 0 || cv.certifications.length > 0, weight: 5, text: "Projects or certifications included", section: "projects" },
  ];

  const earned = checks.reduce((sum, c) => sum + (c.ok ? c.weight : 0), 0);
  const overall = Math.min(100, Math.round((earned / checks.reduce((s, c) => s + c.weight, 0)) * 100));

  // Sub-scores
  const content = Math.round(((cv.summary.length > 50 ? 1 : 0) + (cv.experience.length > 0 ? 1 : 0) + (cv.education.length > 0 ? 1 : 0) + (cv.skills.length >= 5 ? 1 : 0)) / 4 * 100);
  const readability = Math.min(100, 70 + Math.min(30, Math.round(cv.summary.length / 10)));
  const completeness = Math.min(100, Math.round((checks.filter((c) => c.ok).length / checks.length) * 100));
  const ats = Math.min(100, Math.round(80 + (cv.skills.length >= 8 ? 10 : 0) + (cv.experience.length > 0 ? 10 : 0)));

  const suggestions: QualitySuggestion[] = checks.map((c, i) => ({
    id: `chk_${i}`,
    type: c.ok ? "success" : "warning",
    text: c.text,
    section: c.section,
  }));

  // Add dynamic suggestions
  if (cv.summary.length < 50) {
    suggestions.push({
      id: "dyn_summary",
      type: "warning",
      text: "Your professional summary could be more specific and detailed.",
      section: "summary",
    });
  }
  if (!cv.experience.some((e) => e.achievements)) {
    suggestions.push({
      id: "dyn_ach",
      type: "warning",
      text: "Add more measurable achievements to your experience.",
      section: "experience",
    });
  }
  if (cv.skills.length < 8) {
    suggestions.push({
      id: "dyn_skills",
      type: "warning",
      text: "Consider adding more role-specific skills.",
      section: "skills",
    });
  }

  return {
    score: { overall, content, readability, completeness, ats },
    suggestions,
  };
}

export function QualityCheck({ open, onOpenChange, cv }: Props) {
  const setEditorActiveSection = useAppStore((s) => s.setEditorActiveSection);
  const setEditorTab = useAppStore((s) => s.setEditorTab);

  const { score, suggestions } = useMemo(() => calculateScore(cv), [cv]);

  const completed = suggestions.filter((s) => s.type === "success");
  const warnings = suggestions.filter((s) => s.type === "warning");

  const handleFix = (section?: string) => {
    if (section) {
      setEditorActiveSection(section);
      setEditorTab("edit");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#34403B] border-[#D1E8E2]/10 text-[#D1E8E2] max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>CV Quality Check</span>
            <button onClick={() => onOpenChange(false)} className="text-[#9DB5B0] hover:text-[#D1E8E2]">
              <X className="w-5 h-5" />
            </button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Overall score */}
          <div className="flex items-center gap-6">
            <CircularScore value={score.overall} />
            <div className="flex-1 space-y-2">
              <ScoreBar label="Content" value={score.content} />
              <ScoreBar label="Readability" value={score.readability} />
              <ScoreBar label="Completeness" value={score.completeness} />
              <ScoreBar label="ATS Compatibility" value={score.ats} />
            </div>
          </div>

          {/* Completed */}
          {completed.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-wider text-[#9DB5B0] mb-2">Completed</h3>
              <div className="space-y-1.5">
                {completed.map((s) => (
                  <div key={s.id} className="flex items-start gap-2 text-sm text-[#D1E8E2]/80">
                    <CheckCircle2 className="w-4 h-4 text-[#FFCB9A] flex-shrink-0 mt-0.5" />
                    <span>{s.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {warnings.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-wider text-[#9DB5B0] mb-2">Suggestions</h3>
              <div className="space-y-2">
                {warnings.map((s) => (
                  <div key={s.id} className="flex items-start gap-2 p-2.5 rounded-lg bg-[#3D4944] border border-[#D1E8E2]/5">
                    <AlertTriangle className="w-4 h-4 text-[#FFCB9A] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#D1E8E2] flex-1">{s.text}</span>
                    {s.section && (
                      <button
                        onClick={() => handleFix(s.section)}
                        className="text-xs text-[#FFCB9A] hover:underline flex items-center gap-1 flex-shrink-0"
                      >
                        Fix This <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CircularScore({ value }: { value: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value >= 80 ? "#FFCB9A" : value >= 60 ? "#D9B08C" : "#E57373";

  return (
    <div className="relative w-24 h-24">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} stroke="#3D4944" strokeWidth="6" fill="none" />
        <motion.circle
          cx="50" cy="50" r={radius}
          stroke={color} strokeWidth="6" fill="none" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-[#D1E8E2]">{value}</span>
        <span className="text-[10px] text-[#9DB5B0]">/ 100</span>
      </div>
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 80 ? "#FFCB9A" : value >= 60 ? "#D9B08C" : "#E57373";
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-[#9DB5B0]">{label}</span>
        <span className="text-[#D1E8E2] font-medium">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-[#3D4944] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8 }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  );
}
