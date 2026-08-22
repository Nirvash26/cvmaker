"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, X, ArrowRight, Sparkles, RefreshCw } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { CVData, QualityScore, QualitySuggestion } from "@/lib/types";
import { AIModal } from "@/components/ai/AIModal";
import { AILoadingState } from "@/components/ai/AILoadingState";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  cv: CVData;
}

function calculateScore(cv: CVData): { score: QualityScore; completed: QualitySuggestion[]; suggestions: QualitySuggestion[] } {
  const checks: { ok: boolean; weight: number; text: string; section?: string }[] = [
    { ok: !!(cv.personal.fullName && cv.personal.email && cv.personal.phone), weight: 15, text: "Contact information is complete", section: "personal" },
    { ok: cv.summary.length > 50, weight: 20, text: "Professional summary is added", section: "summary" },
    { ok: cv.experience.length > 0, weight: 25, text: "Work experience is properly organized", section: "experience" },
    { ok: cv.experience.some((e) => e.achievements && e.achievements.length > 0), weight: 10, text: "Measurable achievements are included", section: "experience" },
    { ok: cv.education.length > 0, weight: 10, text: "Education information is included", section: "education" },
    { ok: cv.skills.length >= 5, weight: 10, text: "Relevant skills have been included", section: "skills" },
    { ok: cv.skills.length >= 8, weight: 5, text: "Sufficient role-specific skills listed", section: "skills" },
    { ok: cv.projects.length > 0 || cv.certifications.length > 0, weight: 5, text: "Projects or certifications included", section: "projects" },
  ];

  const earned = checks.reduce((sum, c) => sum + (c.ok ? c.weight : 0), 0);
  const overall = Math.min(100, Math.round((earned / checks.reduce((s, c) => s + c.weight, 0)) * 100));

  const content = Math.round(((cv.summary.length > 50 ? 1 : 0) + (cv.experience.length > 0 ? 1 : 0) + (cv.education.length > 0 ? 1 : 0) + (cv.skills.length >= 5 ? 1 : 0)) / 4 * 100);
  const readability = Math.min(100, 70 + Math.min(30, Math.round(cv.summary.length / 10)));
  const completeness = Math.min(100, Math.round((checks.filter((c) => c.ok).length / checks.length) * 100));
  const ats = Math.min(100, Math.round(80 + (cv.skills.length >= 8 ? 10 : 0) + (cv.experience.length > 0 ? 10 : 0)));

  const completed: QualitySuggestion[] = [];
  const suggestions: QualitySuggestion[] = [];

  checks.forEach((c, i) => {
    if (c.ok) {
      completed.push({ id: `chk_${i}`, type: "success", text: c.text, section: c.section });
    }
  });

  if (cv.summary.length < 50) {
    suggestions.push({ id: "dyn_summary", type: "warning", text: "Your professional summary could be more specific.", section: "summary" });
  }
  if (!cv.experience.some((e) => e.achievements)) {
    suggestions.push({ id: "dyn_ach", type: "warning", text: "Add measurable achievements to your experience.", section: "experience" });
  }
  if (cv.skills.length < 8) {
    suggestions.push({ id: "dyn_skills", type: "warning", text: "Consider adding 2-3 more skills relevant to your target role.", section: "skills" });
  }
  if (cv.projects.length > 0 && cv.projects.some((p) => p.description.length < 30)) {
    suggestions.push({ id: "dyn_proj", type: "warning", text: "Your project descriptions could explain your impact more clearly.", section: "projects" });
  }
  if (!cv.personal.linkedin && !cv.personal.github) {
    suggestions.push({ id: "dyn_links", type: "warning", text: "Add LinkedIn or GitHub to strengthen your profile.", section: "personal" });
  }

  return {
    score: { overall, content, readability, completeness, ats },
    completed,
    suggestions,
  };
}

export function QualityCheck({ open, onOpenChange, cv }: Props) {
  const setEditorActiveSection = useAppStore((s) => s.setEditorActiveSection);
  const setEditorTab = useAppStore((s) => s.setEditorTab);
  const [analyzing, setAnalyzing] = useState(false);

  const { score, completed, suggestions } = useMemo(() => calculateScore(cv), [cv]);

  const runAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 900);
  };

  // Trigger analysis whenever the modal opens or cv changes meaningfully
  // (using open change event handler via onOpenChange pattern instead of effect)
  const handleOpenChange = (o: boolean) => {
    if (o && !analyzing) {
      runAnalysis();
    }
    onOpenChange(o);
  };

  const handleFix = (section?: string) => {
    if (section) {
      setEditorActiveSection(section);
      setEditorTab("edit");
    }
    onOpenChange(false);
  };

  return (
    <AIModal
      open={open}
      onOpenChange={handleOpenChange}
      title={
        <>
          <Sparkles className="w-4 h-4 text-[#FFCB9A]" />
          CV Score
        </>
      }
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        {analyzing ? (
          <AILoadingState message="Reviewing your CV..." />
        ) : (
          <>
            {/* Overall score */}
            <div className="flex items-center gap-6">
              <CircularScore value={score.overall} />
              <div className="flex-1 space-y-2">
                <ScoreBar label="Content" value={score.content} />
                <ScoreBar label="Readability" value={score.readability} />
                <ScoreBar label="Completeness" value={score.completeness} />
                <ScoreBar label="ATS Readiness" value={score.ats} />
              </div>
            </div>

            {/* Supporting message */}
            <p className="text-sm text-[#9DB5B0] text-center italic px-4">
              {score.overall >= 85
                ? "Your CV is looking strong. A few improvements could make it even better."
                : score.overall >= 60
                  ? "Your CV is on the right track. Address the suggestions below to strengthen it."
                  : "Your CV needs some attention. Follow the suggestions below to bring it up to professional standards."}
            </p>

            {/* Looking Great */}
            {completed.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-wider text-[#9DB5B0] mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FFCB9A]" />
                  Looking Great
                </h3>
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

            {/* Suggested Improvements */}
            {suggestions.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-wider text-[#9DB5B0] mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#FFCB9A]" />
                  Suggested Improvements
                </h3>
                <div className="space-y-2">
                  {suggestions.map((s) => (
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

            {/* Disclaimer */}
            <p className="text-xs text-[#9DB5B0] text-center pt-2 border-t border-[#D1E8E2]/5">
              This analysis is guidance, not a guarantee of hiring outcomes. Always tailor your CV to each opportunity.
            </p>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={runAnalysis}
                className="text-[#9DB5B0] hover:text-[#D1E8E2] flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-1.5" /> Re-analyze
              </Button>
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2] flex-1"
              >
                Done
              </Button>
            </div>
          </>
        )}
      </div>
    </AIModal>
  );
}

function CircularScore({ value }: { value: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value >= 80 ? "#FFCB9A" : value >= 60 ? "#D9B08C" : "#E57373";

  return (
    <div className="relative w-24 h-24 flex-shrink-0">
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
