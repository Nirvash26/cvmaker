"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIModal } from "./AIModal";
import { AILoadingState } from "./AILoadingState";
import { toast } from "sonner";

interface Props {
  jobTitle: string;
  context?: string;
  onApply: (text: string) => void;
}

export function AIAchievementsButton({ jobTitle, context, onApply }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageIdx, setMessageIdx] = useState(0);
  const [ideas, setIdeas] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());

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
    setIdeas([]);
    setSelected(new Set());
    try {
      const res = await fetch("/api/ai/achievements?XTransformPort=3000", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, context }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setIdeas(data.ideas || []);
    } catch {
      toast.error("Failed to generate ideas.");
    } finally {
      setLoading(false);
    }
  };

  const toggleIdea = (i: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const handleApply = () => {
    if (selected.size === 0) {
      toast.error("Select at least one achievement first.");
      return;
    }
    const chosen = Array.from(selected).sort().map((i) => ideas[i]).join("\n");
    onApply(chosen);
    setOpen(false);
    toast.success("Achievement ideas applied!");
  };

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => { setOpen(true); setTimeout(() => generate(), 100); }} className="text-[#FFCB9A] hover:bg-[#FFCB9A]/10 hover:text-[#FFCB9A] text-xs">
        <Sparkles className="w-3.5 h-3.5 mr-1.5" />
        Generate Achievement Ideas
      </Button>

      <AIModal
        open={open}
        onOpenChange={setOpen}
        title={
          <>
            <Sparkles className="w-4 h-4 text-[#FFCB9A]" />
            Achievement Ideas for {jobTitle || "Your Role"}
          </>
        }
        maxWidth="max-w-xl"
      >
        <div className="space-y-3">
          {loading && <AILoadingState messageIndex={messageIdx} />}

          {!loading && ideas.length > 0 && (
            <>
              <p className="text-xs text-[#9DB5B0]">Tap to select which achievement ideas to keep.</p>
              <div className="space-y-2">
                {ideas.map((idea, i) => (
                  <button
                    key={i}
                    onClick={() => toggleIdea(i)}
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
                    <span>{idea}</span>
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button onClick={handleApply} className="bg-[#FFCB9A] hover:bg-[#FFCB9A]/90 text-[#2C3531] flex-1">
                  <Check className="w-4 h-4 mr-1.5" /> Use Selected
                </Button>
                <Button onClick={generate} variant="ghost" className="text-[#9DB5B0] hover:text-[#D1E8E2] flex-1">
                  <RefreshCw className="w-4 h-4 mr-1.5" /> Regenerate
                </Button>
              </div>
            </>
          )}
        </div>
      </AIModal>
    </>
  );
}
