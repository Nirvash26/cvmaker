"use client";

import { useState, useEffect } from "react";
import { Sparkles, Plus, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIModal } from "./AIModal";
import { AILoadingState } from "./AILoadingState";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  jobTitle: string;
  experience?: string;
  education?: string;
  existingSkills: string[];
  onAddSkill: (skill: string) => void;
}

export function AISkillsSuggestions({ jobTitle, experience, education, existingSkills, onAddSkill }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [manualJobTitle, setManualJobTitle] = useState("");

  const effectiveJobTitle = jobTitle || manualJobTitle;

  const generate = async () => {
    if (!effectiveJobTitle.trim()) {
      toast.error("Please enter your professional title first.");
      return;
    }
    setLoading(true);
    setSuggestions([]);
    setAdded(new Set());
    try {
      const res = await fetch("/api/ai/skills?XTransformPort=3000", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: effectiveJobTitle,
          experience,
          education,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      // Filter out existing skills
      const filtered = (data.skills || []).filter((s: string) => !existingSkills.includes(s) && !s.toLowerCase().includes("none"));
      setSuggestions(filtered);
    } catch {
      toast.error("Failed to fetch skill suggestions.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    if (effectiveJobTitle) {
      setTimeout(() => generate(), 100);
    }
  };

  const handleAdd = (skill: string) => {
    onAddSkill(skill);
    setAdded((prev) => new Set(prev).add(skill));
  };

  const handleAddAll = () => {
    suggestions.forEach((s) => {
      if (!added.has(s) && !existingSkills.includes(s)) {
        onAddSkill(s);
      }
    });
    setAdded(new Set(suggestions));
    toast.success("All suggestions added!");
  };

  const visibleSuggestions = suggestions.filter((s) => !existingSkills.includes(s));

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleOpen}
        className="text-[#FFCB9A] hover:bg-[#FFCB9A]/10 hover:text-[#FFCB9A] text-xs"
      >
        <Sparkles className="w-3.5 h-3.5 mr-1.5" />
        AI Skill Suggestions
      </Button>

      <AIModal
        open={open}
        onOpenChange={setOpen}
        title={
          <>
            <Sparkles className="w-4 h-4 text-[#FFCB9A]" />
            Suggested Skills {effectiveJobTitle && <span className="text-[#9DB5B0] font-normal">for {effectiveJobTitle}</span>}
          </>
        }
        maxWidth="max-w-lg"
      >
        <div className="space-y-4">
          {/* Job title fallback if user hasn't filled personal info */}
          {!jobTitle && (
            <div>
              <label className="text-xs text-[#9DB5B0] uppercase tracking-wider mb-1.5 block">Your Professional Title</label>
              <div className="flex gap-2">
                <input
                  value={manualJobTitle}
                  onChange={(e) => setManualJobTitle(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") generate(); }}
                  className="flex-1 bg-[#3D4944] border border-[#D1E8E2]/10 rounded-md px-3 py-2 text-sm text-[#D1E8E2]"
                  placeholder="e.g. Software Engineer"
                  autoFocus
                />
                <Button size="sm" onClick={generate} className="bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]">
                  <Sparkles className="w-3.5 h-3.5 mr-1" /> Get
                </Button>
              </div>
            </div>
          )}

          {loading && <AILoadingState message="Finding relevant skills..." />}

          {!loading && visibleSuggestions.length === 0 && effectiveJobTitle && (
            <div className="text-center py-8">
              <Check className="w-10 h-10 text-[#FFCB9A] mx-auto mb-3" />
              <p className="text-sm text-[#D1E8E2]">You&apos;ve added all the suggested skills for this role.</p>
              <p className="text-xs text-[#9DB5B0] mt-1">Great work — your skill set is comprehensive.</p>
            </div>
          )}

          {!loading && visibleSuggestions.length === 0 && !effectiveJobTitle && !jobTitle && (
            <div className="text-center py-6">
              <p className="text-sm text-[#9DB5B0]">Enter your professional title above to get relevant skill suggestions.</p>
            </div>
          )}

          {!loading && visibleSuggestions.length > 0 && (
            <>
              <p className="text-xs text-[#9DB5B0]">
                Click a skill to add it. We never add skills without your permission.
              </p>
              <div className="flex flex-wrap gap-2">
                {visibleSuggestions.map((skill) => {
                  const isAdded = added.has(skill);
                  return (
                    <button
                      key={skill}
                      onClick={() => !isAdded && handleAdd(skill)}
                      disabled={isAdded}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-all",
                        isAdded
                          ? "bg-[#116466]/40 border-[#116466] text-[#D1E8E2] opacity-70 cursor-default"
                          : "bg-[#3D4944]/50 border-dashed border-[#D1E8E2]/20 text-[#9DB5B0] hover:text-[#FFCB9A] hover:border-[#FFCB9A]/50"
                      )}
                    >
                      {isAdded ? (
                        <><Check className="w-3 h-3" /> {skill}</>
                      ) : (
                        <><Plus className="w-3 h-3" /> {skill}</>
                      )}
                    </button>
                  );
                })}
              </div>

              <Button onClick={handleAddAll} className="bg-[#FFCB9A] hover:bg-[#FFCB9A]/90 text-[#2C3531] w-full">
                <Plus className="w-4 h-4 mr-1.5" /> Add All Suggestions
              </Button>
            </>
          )}

          {!loading && effectiveJobTitle && (
            <Button
              variant="ghost"
              onClick={generate}
              className="text-[#9DB5B0] hover:text-[#D1E8E2] w-full"
            >
              <Sparkles className="w-4 h-4 mr-1.5" /> Regenerate Suggestions
            </Button>
          )}
        </div>
      </AIModal>
    </>
  );
}
