"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, Check, RefreshCw, Plus, X, Pencil, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AIModal } from "./AIModal";
import { AILoadingState, AI_LOADING_MESSAGES } from "./AILoadingState";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AISummaryButtonProps {
  context: { jobTitle: string; skills: string[]; summary: string };
  onApply: (text: string) => void;
  variant?: "default" | "inline";
  label?: string;
}

const TONES = [
  { id: "professional", label: "Professional" },
  { id: "confident", label: "Confident" },
  { id: "creative", label: "Creative" },
  { id: "concise", label: "Concise" },
];

const LEVELS = [
  { id: "student", label: "Student" },
  { id: "fresher", label: "Fresher" },
  { id: "junior", label: "Junior (0-2y)" },
  { id: "mid", label: "Mid-Level (3-5y)" },
  { id: "senior", label: "Senior (5+y)" },
  { id: "executive", label: "Executive" },
];

export function AISummaryButton({ context, onApply, variant = "default", label }: AISummaryButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageIdx, setMessageIdx] = useState(0);
  const [generated, setGenerated] = useState("");
  const [editable, setEditable] = useState(false);
  const [edited, setEdited] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [inputs, setInputs] = useState({
    jobRole: context.jobTitle || "",
    experience: "",
    keySkills: (context.skills || []).slice(0, 5),
    tone: "professional",
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (loading) {
      intervalRef.current = setInterval(() => {
        setMessageIdx((i) => i + 1);
      }, 2000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setMessageIdx(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [loading]);

  const generate = async () => {
    setLoading(true);
    setGenerated("");
    setEditable(false);
    setMessageIdx(0);
    try {
      const res = await fetch("/api/ai/summary?XTransformPort=3000", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobRole: inputs.jobRole,
          experience: inputs.experience || "junior",
          keySkills: inputs.keySkills.join(", "),
          tone: inputs.tone,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setGenerated(data.summary || "");
      setEdited(data.summary || "");
    } catch (e: any) {
      const fallback = generateFallback(inputs.jobRole, inputs.experience, inputs.keySkills, inputs.tone);
      setGenerated(fallback);
      setEdited(fallback);
      toast.info("Using offline AI suggestions.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setInputs({
      jobRole: context.jobTitle || "",
      experience: "",
      keySkills: (context.skills || []).slice(0, 5),
      tone: "professional",
    });
    setGenerated("");
    setOpen(true);
    setTimeout(() => generate(), 200);
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !inputs.keySkills.includes(trimmed)) {
      setInputs({ ...inputs, keySkills: [...inputs.keySkills, trimmed] });
      setSkillInput("");
    }
  };

  const buttonLabel = label || (variant === "inline" ? "Write with AI" : "Help Me Write This");

  return (
    <>
      <Button
        variant={variant === "inline" ? "outline" : "ghost"}
        size="sm"
        onClick={handleOpen}
        className={cn(
          "text-[#FFCB9A]",
          variant === "inline"
            ? "border-[#FFCB9A]/30 bg-[#FFCB9A]/5 hover:bg-[#FFCB9A]/10 hover:text-[#FFCB9A]"
            : "hover:bg-[#FFCB9A]/10 hover:text-[#FFCB9A]"
        )}
      >
        <Sparkles className="w-4 h-4 mr-1.5" />
        {buttonLabel}
      </Button>

      <AIModal
        open={open}
        onOpenChange={setOpen}
        title={
          <>
            <Sparkles className="w-4 h-4 text-[#FFCB9A]" />
            Write with Nirvash AI
          </>
        }
      >
        <div className="space-y-4">
          {/* Inputs */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#9DB5B0] uppercase tracking-wider mb-1.5 block">Desired Job Role</label>
              <input
                value={inputs.jobRole}
                onChange={(e) => setInputs({ ...inputs, jobRole: e.target.value })}
                className="w-full bg-[#3D4944] border border-[#D1E8E2]/10 rounded-md px-3 py-2 text-sm text-[#D1E8E2]"
                placeholder="Frontend Developer"
              />
            </div>
            <div>
              <label className="text-xs text-[#9DB5B0] uppercase tracking-wider mb-1.5 block">Experience Level</label>
              <select
                value={inputs.experience}
                onChange={(e) => setInputs({ ...inputs, experience: e.target.value })}
                className="w-full bg-[#3D4944] border border-[#D1E8E2]/10 rounded-md px-3 py-2 text-sm text-[#D1E8E2]"
              >
                <option value="">Select...</option>
                {LEVELS.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
              </select>
            </div>
          </div>

          {/* Skill tags input */}
          <div>
            <label className="text-xs text-[#9DB5B0] uppercase tracking-wider mb-1.5 block">Key Skills</label>
            <div className="flex gap-2 mb-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); addSkill(); }
                }}
                className="flex-1 bg-[#3D4944] border border-[#D1E8E2]/10 rounded-md px-3 py-2 text-sm text-[#D1E8E2]"
                placeholder="Type a skill and press Enter"
              />
              <Button size="sm" onClick={addSkill} className="bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {inputs.keySkills.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {inputs.keySkills.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#116466]/30 border border-[#116466]/40 text-[#D1E8E2] text-xs">
                    {s}
                    <button onClick={() => setInputs({ ...inputs, keySkills: inputs.keySkills.filter((k) => k !== s) })} className="text-[#9DB5B0] hover:text-[#FFCB9A]">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Tone selector */}
          <div>
            <label className="text-xs text-[#9DB5B0] uppercase tracking-wider mb-1.5 block">Tone</label>
            <div className="grid grid-cols-4 gap-1.5">
              {TONES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setInputs({ ...inputs, tone: t.id })}
                  className={cn(
                    "px-2 py-1.5 rounded-md text-xs font-medium border transition-all",
                    inputs.tone === t.id
                      ? "bg-[#116466] border-[#116466] text-[#D1E8E2]"
                      : "bg-[#3D4944] border-[#D1E8E2]/10 text-[#9DB5B0] hover:text-[#D1E8E2]"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <div className="flex items-center gap-2">
            <Button
              onClick={generate}
              disabled={loading}
              className="bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              Generate Summary
            </Button>
            {generated && !loading && (
              <Button variant="ghost" onClick={generate} className="text-[#9DB5B0]">
                <RefreshCw className="w-4 h-4 mr-1.5" /> Regenerate
              </Button>
            )}
          </div>

          {/* Loading state */}
          {loading && <AILoadingState messageIndex={messageIdx} />}

          {/* Result */}
          {generated && !loading && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#9DB5B0] uppercase tracking-wider">Generated Summary</span>
                <button
                  onClick={() => { setEditable(!editable); setEdited(generated); }}
                  className="text-xs text-[#FFCB9A] hover:underline inline-flex items-center gap-1"
                >
                  <Pencil className="w-3 h-3" />
                  {editable ? "Done" : "Edit Before Using"}
                </button>
              </div>
              {editable ? (
                <Textarea
                  value={edited}
                  onChange={(e) => setEdited(e.target.value)}
                  className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] min-h-[140px]"
                />
              ) : (
                <div className="p-4 rounded-lg bg-[#3D4944] border border-[#D1E8E2]/10 text-sm text-[#D1E8E2] leading-relaxed">
                  {generated}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => {
                    onApply(editable ? edited : generated);
                    setOpen(false);
                    toast.success("Summary applied!");
                  }}
                  className="bg-[#FFCB9A] hover:bg-[#FFCB9A]/90 text-[#2C3531]"
                >
                  <Check className="w-4 h-4 mr-1.5" /> Use This
                </Button>
                <Button variant="ghost" onClick={() => setOpen(false)} className="text-[#9DB5B0]">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </AIModal>
    </>
  );
}

function generateFallback(role: string, level: string, skills: string[], tone: string): string {
  const r = role || "professional";
  const lvl = level === "senior" || level === "executive" ? "experienced" : "motivated";
  const skillList = skills.slice(0, 4);
  const skillText = skillList.length > 0 ? ` specializing in ${skillList.join(", ")}` : "";

  if (tone === "concise") {
    return `${lvl === "experienced" ? "Experienced" : "Motivated"} ${r}${skillText}. Focused on delivering quality results and continuous improvement.`;
  }
  if (tone === "confident") {
    return `${lvl === "experienced" ? "Experienced" : "Driven"} ${r}${skillText}. Track record of leading initiatives, shipping high-impact work, and pushing teams forward. Confident communicator with a bias for action and measurable outcomes.`;
  }
  if (tone === "creative") {
    return `${lvl === "experienced" ? "Experienced" : "Curious"} ${r}${skillText}. Blends craft with curiosity to ship thoughtful, user-friendly work. Comfortable exploring new ideas while keeping delivery sharp and reliable.`;
  }
  return `${lvl === "experienced" ? "Experienced" : "Motivated"} ${r}${skillText}. Proven track record of delivering high-quality results and collaborating effectively with cross-functional teams. Passionate about continuous learning and applying modern best practices to solve real-world problems.`;
}
