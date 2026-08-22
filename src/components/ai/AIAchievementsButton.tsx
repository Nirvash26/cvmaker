"use client";

import { useState } from "react";
import { Sparkles, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Props {
  jobTitle: string;
  context?: string;
  onApply: (text: string) => void;
}

export function AIAchievementsButton({ jobTitle, context, onApply }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<string[]>([]);

  const generate = async () => {
    setLoading(true);
    setIdeas([]);
    try {
      const res = await fetch("/api/ai/achievements?XTransformPort=3000", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, context }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setIdeas(data.ideas || []);
    } catch (e: any) {
      toast.error("Failed to generate ideas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => { setOpen(true); setTimeout(() => generate(), 100); }} className="text-[#FFCB9A] hover:bg-[#FFCB9A]/10 hover:text-[#FFCB9A] text-xs">
        <Sparkles className="w-3.5 h-3.5 mr-1.5" />
        Generate Achievement Ideas
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#34403B] border-[#D1E8E2]/10 text-[#D1E8E2] max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FFCB9A]" />
              Achievement Ideas for {jobTitle || "Your Role"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Button onClick={generate} disabled={loading} className="bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]">
              {loading ? <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4 mr-1.5" /> Generate</>}
            </Button>

            {ideas.length > 0 && (
              <div className="space-y-2">
                {ideas.map((idea, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-[#3D4944] border border-[#D1E8E2]/10 text-sm text-[#D1E8E2]">
                    <span className="flex-1">{idea}</span>
                    <button onClick={() => { onApply(idea); setOpen(false); toast.success("Idea applied!"); }} className="text-[#FFCB9A] hover:text-[#FFCB9A]/80 p-1 rounded">
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
