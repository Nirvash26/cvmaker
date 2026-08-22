"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, Check, RefreshCw, X, Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIModal } from "./AIModal";
import { AILoadingState } from "./AILoadingState";
import { toast } from "sonner";

interface Props {
  jobTitle: string;
  description: string;
  type: "responsibilities" | "achievements";
  onApply: (text: string, mode: "replace" | "append") => void;
  label?: string;
}

export function AIImproveButton({ jobTitle, description, type, onApply, label = "Improve with AI" }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageIdx, setMessageIdx] = useState(0);
  const [bullets, setBullets] = useState<string[]>([]);
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
    setBullets([]);
    setSelected(new Set());
    try {
      const res = await fetch("/api/ai/improve?XTransformPort=3000", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, description, type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBullets(data.bullets || []);
    } catch {
      toast.error("Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    if (description) {
      setTimeout(() => generate(), 100);
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

  const handleReplace = () => {
    if (selected.size === 0) {
      toast.error("Select at least one bullet point first.");
      return;
    }
    const chosen = Array.from(selected).sort().map((i) => bullets[i]).join("\n");
    onApply(chosen, "replace");
    setOpen(false);
    toast.success("Replaced with AI suggestions.");
  };

  const handleAppend = () => {
    if (selected.size === 0) {
      toast.error("Select at least one bullet point first.");
      return;
    }
    const chosen = Array.from(selected).sort().map((i) => bullets[i]).join("\n");
    const combined = description ? `${description.trim()}\n${chosen}` : chosen;
    onApply(combined, "append");
    setOpen(false);
    toast.success("Added to existing content.");
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleOpen}
        className="text-[#FFCB9A] hover:bg-[#FFCB9A]/10 hover:text-[#FFCB9A] text-xs"
      >
        <Sparkles className="w-3.5 h-3.5 mr-1.5" />
        {label}
      </Button>

      <AIModal
        open={open}
        onOpenChange={setOpen}
        title={
          <>
            <Sparkles className="w-4 h-4 text-[#FFCB9A]" />
            Improve with Nirvash AI
          </>
        }
        maxWidth="max-w-xl"
      >
        <div className="space-y-4">
          {!description ? (
            <p className="text-sm text-[#9DB5B0]">Write something first, then click Improve.</p>
          ) : (
            <>
              {/* Original */}
              <div className="p-3 rounded-lg bg-[#3D4944] border border-[#D1E8E2]/10 text-sm text-[#D1E8E2]/80">
                <span className="text-[#9DB5B0] text-xs uppercase tracking-wider block mb-1">Your text</span>
                {description}
              </div>

              {!loading && bullets.length === 0 && (
                <Button onClick={generate} className="bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]">
                  <Sparkles className="w-4 h-4 mr-1.5" /> Generate Improvements
                </Button>
              )}

              {/* Loading */}
              {loading && <AILoadingState messageIndex={messageIdx} />}

              {/* Bullets */}
              {bullets.length > 0 && !loading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#9DB5B0] uppercase tracking-wider">AI Suggestions</span>
                    <button onClick={generate} className="text-xs text-[#FFCB9A] hover:underline inline-flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" /> Regenerate
                    </button>
                  </div>
                  <p className="text-xs text-[#9DB5B0]">Tap to select which bullet points to keep.</p>

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

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Button onClick={handleReplace} className="bg-[#FFCB9A] hover:bg-[#FFCB9A]/90 text-[#2C3531] flex-1">
                      <Check className="w-4 h-4 mr-1.5" /> Replace
                    </Button>
                    <Button onClick={handleAppend} className="bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2] flex-1">
                      <Plus className="w-4 h-4 mr-1.5" /> Add to Existing
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </AIModal>
    </>
  );
}
