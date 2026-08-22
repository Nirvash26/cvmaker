"use client";

import { useState } from "react";
import { Sparkles, Loader2, Check, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface AISummaryButtonProps {
  context: { jobTitle: string; skills: string[]; summary: string };
  onApply: (text: string) => void;
}

export function AISummaryButton({ context, onApply }: AISummaryButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState("");
  const [editable, setEditable] = useState(false);
  const [edited, setEdited] = useState("");
  const [inputs, setInputs] = useState({
    jobRole: context.jobTitle || "",
    experience: "",
    keySkills: (context.skills || []).slice(0, 5).join(", "),
  });

  const generate = async (regenerate = false) => {
    setLoading(true);
    setGenerated("");
    try {
      const res = await fetch("/api/ai/summary?XTransformPort=3000", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobRole: inputs.jobRole,
          experience: inputs.experience || "junior",
          keySkills: inputs.keySkills,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setGenerated(data.summary || "");
      setEditable(false);
      setEdited(data.summary || "");
    } catch (e: any) {
      // Fallback local generation if API unavailable
      const fallback = generateFallback(inputs.jobRole, inputs.experience, inputs.keySkills);
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
      keySkills: (context.skills || []).slice(0, 5).join(", "),
    });
    setOpen(true);
    setTimeout(() => generate(), 200);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleOpen}
        className="text-[#FFCB9A] hover:bg-[#FFCB9A]/10 hover:text-[#FFCB9A]"
      >
        <Sparkles className="w-4 h-4 mr-1.5" />
        Help Me Write This
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#34403B] border-[#D1E8E2]/10 text-[#D1E8E2] max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#D1E8E2]">
              <Sparkles className="w-4 h-4 text-[#FFCB9A]" />
              AI Summary Writer
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#9DB5B0] uppercase tracking-wider mb-1.5 block">Job Role</label>
                <input
                  value={inputs.jobRole}
                  onChange={(e) => setInputs({ ...inputs, jobRole: e.target.value })}
                  className="w-full bg-[#3D4944] border border-[#D1E8E2]/10 rounded-md px-3 py-2 text-sm text-[#D1E8E2]"
                  placeholder="Software Engineer"
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
                  <option value="junior">Junior (0-2 years)</option>
                  <option value="mid">Mid-level (3-5 years)</option>
                  <option value="senior">Senior (5+ years)</option>
                  <option value="lead">Lead / Manager</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-[#9DB5B0] uppercase tracking-wider mb-1.5 block">Key Skills (comma separated)</label>
                <input
                  value={inputs.keySkills}
                  onChange={(e) => setInputs({ ...inputs, keySkills: e.target.value })}
                  className="w-full bg-[#3D4944] border border-[#D1E8E2]/10 rounded-md px-3 py-2 text-sm text-[#D1E8E2]"
                  placeholder="React, JavaScript, Communication"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => generate(true)}
                disabled={loading}
                className="bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Generating...</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-1.5" /> Generate</>
                )}
              </Button>
              {generated && (
                <Button variant="ghost" onClick={() => generate(true)} className="text-[#9DB5B0]">
                  <RefreshCw className="w-4 h-4 mr-1.5" /> Regenerate
                </Button>
              )}
            </div>

            {generated && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#9DB5B0] uppercase tracking-wider">Generated Summary</span>
                  <button
                    onClick={() => { setEditable(!editable); setEdited(generated); }}
                    className="text-xs text-[#FFCB9A] hover:underline"
                  >
                    {editable ? "Done" : "Edit"}
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
        </DialogContent>
      </Dialog>
    </>
  );
}

function generateFallback(role: string, level: string, skills: string): string {
  const r = role || "professional";
  const lvl = level === "senior" || level === "lead" ? "experienced" : "motivated";
  const skillList = skills ? skills.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4) : [];
  const skillText = skillList.length > 0 ? ` specializing in ${skillList.join(", ")}` : "";
  return `${lvl === "experienced" ? "Experienced" : "Motivated"} ${r}${skillText}. Proven track record of delivering high-quality results and collaborating effectively with cross-functional teams. Passionate about continuous learning and applying modern best practices to solve real-world problems.`;
}
