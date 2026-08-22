"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, Check, RefreshCw, Plus, X, ListPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIModal } from "./AIModal";
import { AILoadingState } from "./AILoadingState";
import { toast } from "sonner";

interface Props {
  jobTitle: string;
  onApply: (text: string) => void;
  triggerLabel?: string;
}

export function AIBulletPoints({ jobTitle, onApply, triggerLabel = "Generate Professional Bullet Points" }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageIdx, setMessageIdx] = useState(0);
  const [bullets, setBullets] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [skillInput, setSkillInput] = useState("");
  const [inputs, setInputs] = useState({
    jobTitle: jobTitle || "",
    companyType: "",
    responsibilities: "",
    skills: [] as string[],
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (loading) {
      intervalRef.current = setInterval(() => setMessageIdx((i) => i + 1), 2000);
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
    setBullets([]);
    setSelected(new Set());
    try {
      const res = await fetch("/api/ai/bullet-points?XTransformPort=3000", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: inputs.jobTitle,
          companyType: inputs.companyType,
          responsibilities: inputs.responsibilities,
          skills: inputs.skills.join(", "),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBullets(data.bullets || []);
    } catch {
      toast.error("Failed to generate bullet points.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setInputs({
      jobTitle: jobTitle || "",
      companyType: "",
      responsibilities: "",
      skills: [],
    });
    setBullets([]);
    setOpen(true);
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !inputs.skills.includes(trimmed)) {
      setInputs({ ...inputs, skills: [...inputs.skills, trimmed] });
      setSkillInput("");
    }
  };

  const toggleBullet = (i: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const handleApply = () => {
    if (selected.size === 0) {
      toast.error("Select at least one bullet point first.");
      return;
    }
    const chosen = Array.from(selected).sort().map((i) => bullets[i]).join("\n");
    onApply(chosen);
    setOpen(false);
    toast.success("Bullet points applied!");
  };

  const canGenerate = inputs.jobTitle.trim() || inputs.responsibilities.trim();

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleOpen}
        className="text-[#FFCB9A] hover:bg-[#FFCB9A]/10 hover:text-[#FFCB9A] text-xs"
      >
        <ListPlus className="w-3.5 h-3.5 mr-1.5" />
        {triggerLabel}
      </Button>

      <AIModal
        open={open}
        onOpenChange={setOpen}
        title={
          <>
            <Sparkles className="w-4 h-4 text-[#FFCB9A]" />
            Professional Bullet Point Generator
          </>
        }
        maxWidth="max-w-xl"
      >
        <div className="space-y-4">
          {/* Inputs */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#9DB5B0] uppercase tracking-wider mb-1.5 block">Job Title</label>
              <input
                value={inputs.jobTitle}
                onChange={(e) => setInputs({ ...inputs, jobTitle: e.target.value })}
                className="w-full bg-[#3D4944] border border-[#D1E8E2]/10 rounded-md px-3 py-2 text-sm text-[#D1E8E2]"
                placeholder="Software Engineer"
              />
            </div>
            <div>
              <label className="text-xs text-[#9DB5B0] uppercase tracking-wider mb-1.5 block">Company Type (optional)</label>
              <input
                value={inputs.companyType}
                onChange={(e) => setInputs({ ...inputs, companyType: e.target.value })}
                className="w-full bg-[#3D4944] border border-[#D1E8E2]/10 rounded-md px-3 py-2 text-sm text-[#D1E8E2]"
                placeholder="Startup, Enterprise, Agency"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-[#9DB5B0] uppercase tracking-wider mb-1.5 block">Main Responsibilities</label>
            <textarea
              value={inputs.responsibilities}
              onChange={(e) => setInputs({ ...inputs, responsibilities: e.target.value })}
              className="w-full bg-[#3D4944] border border-[#D1E8E2]/10 rounded-md px-3 py-2 text-sm text-[#D1E8E2] min-h-[80px]"
              placeholder="e.g. Managed social media, wrote content, ran campaigns"
            />
            <p className="text-xs text-[#9DB5B0] mt-1">
              💡 Tip: Include any measurable numbers you have (e.g. &quot;30% growth&quot;) — AI won&apos;t invent fake metrics.
            </p>
          </div>

          <div>
            <label className="text-xs text-[#9DB5B0] uppercase tracking-wider mb-1.5 block">Important Skills</label>
            <div className="flex gap-2 mb-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                className="flex-1 bg-[#3D4944] border border-[#D1E8E2]/10 rounded-md px-3 py-2 text-sm text-[#D1E8E2]"
                placeholder="Type a skill and press Enter"
              />
              <Button size="sm" onClick={addSkill} className="bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {inputs.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {inputs.skills.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#116466]/30 border border-[#116466]/40 text-[#D1E8E2] text-xs">
                    {s}
                    <button onClick={() => setInputs({ ...inputs, skills: inputs.skills.filter((k) => k !== s) })} className="text-[#9DB5B0] hover:text-[#FFCB9A]">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <Button onClick={generate} disabled={loading || !canGenerate} className="bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2] w-full">
            <Sparkles className="w-4 h-4 mr-1.5" />
            Generate Bullet Points
          </Button>

          {/* Loading */}
          {loading && <AILoadingState messageIndex={messageIdx} />}

          {/* Result */}
          {bullets.length > 0 && !loading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#9DB5B0] uppercase tracking-wider">AI Suggestions</span>
                <button onClick={generate} className="text-xs text-[#FFCB9A] hover:underline inline-flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> Regenerate
                </button>
              </div>
              <p className="text-xs text-[#9DB5B0]">Tap to select which bullet points to use.</p>

              {bullets.map((b, i) => (
                <button
                  key={i}
                  onClick={() => toggleBullet(i)}
                  className={`w-full flex items-start gap-2 p-3 rounded-lg border text-left text-sm transition-all ${
                    selected.has(i)
                      ? "bg-[#116466]/20 border-[#116466] text-[#D1E8E2]"
                      : "bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]/80 hover:border-[#D1E8E2]/30"
                  }`}
                >
                  <div className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    selected.has(i) ? "bg-[#FFCB9A] border-[#FFCB9A]" : "border-[#9DB5B0]"
                  }`}>
                    {selected.has(i) && <Check className="w-3 h-3 text-[#2C3531]" />}
                  </div>
                  <span>{b}</span>
                </button>
              ))}

              <Button onClick={handleApply} className="bg-[#FFCB9A] hover:bg-[#FFCB9A]/90 text-[#2C3531] w-full">
                <Check className="w-4 h-4 mr-1.5" /> Use Selected Bullets
              </Button>
            </div>
          )}
        </div>
      </AIModal>
    </>
  );
}
