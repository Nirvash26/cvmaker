"use client";

import { useState } from "react";
import { Sparkles, Loader2, Check, X } from "lucide-react";
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
  description: string;
  type: "responsibilities" | "achievements";
  onApply: (text: string) => void;
}

export function AIImproveButton({ jobTitle, description, type, onApply }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bullets, setBullets] = useState<string[]>([]);

  const generate = async () => {
    setLoading(true);
    setBullets([]);
    try {
      const res = await fetch("/api/ai/improve?XTransformPort=3000", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, description, type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBullets(data.bullets || []);
    } catch (e: any) {
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

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleOpen}
        className="text-[#FFCB9A] hover:bg-[#FFCB9A]/10 hover:text-[#FFCB9A] text-xs"
      >
        <Sparkles className="w-3.5 h-3.5 mr-1.5" />
        Improve with AI
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#34403B] border-[#D1E8E2]/10 text-[#D1E8E2] max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FFCB9A]" />
              AI Improvement Suggestions
            </DialogTitle>
          </DialogHeader>

          {!description ? (
            <p className="text-sm text-[#9DB5B0]">Write something first, then click improve.</p>
          ) : (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-[#3D4944] border border-[#D1E8E2]/10 text-sm text-[#D1E8E2]/80">
                <span className="text-[#9DB5B0] text-xs uppercase tracking-wider block mb-1">Your text</span>
                {description}
              </div>
              <Button onClick={generate} disabled={loading} className="bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]">
                {loading ? <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4 mr-1.5" /> Generate</>}
              </Button>

              {bullets.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs text-[#9DB5B0] uppercase tracking-wider">AI Suggestions</span>
                  {bullets.map((b, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-[#3D4944] border border-[#D1E8E2]/10 text-sm text-[#D1E8E2]">
                      <span className="flex-1">{b}</span>
                      <button
                        onClick={() => { onApply(b); setOpen(false); toast.success("Applied!"); }}
                        className="text-[#FFCB9A] hover:text-[#FFCB9A]/80 p-1 rounded"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <Button
                    onClick={() => { onApply(bullets.join("\n")); setOpen(false); toast.success("All applied!"); }}
                    className="bg-[#FFCB9A] hover:bg-[#FFCB9A]/90 text-[#2C3531] w-full"
                  >
                    Use All
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
