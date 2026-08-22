"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, Check, RefreshCw, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIModal } from "./AIModal";
import { AILoadingState } from "./AILoadingState";
import { toast } from "sonner";

interface Props {
  projectName: string;
  description: string;
  technologies: string[];
  onApply: (text: string) => void;
}

export function AIProjectImprover({ projectName, description, technologies, onApply }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageIdx, setMessageIdx] = useState(0);
  const [improved, setImproved] = useState("");
  const [editable, setEditable] = useState(false);
  const [edited, setEdited] = useState("");

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
    setImproved("");
    try {
      const res = await fetch("/api/ai/project-improve?XTransformPort=3000", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName,
          description,
          technologies: technologies.join(", "),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setImproved(data.description || "");
      setEdited(data.description || "");
      setEditable(false);
    } catch {
      toast.error("Failed to improve description.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    if (description) setTimeout(() => generate(), 100);
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
        Improve Description
      </Button>

      <AIModal
        open={open}
        onOpenChange={setOpen}
        title={
          <>
            <Sparkles className="w-4 h-4 text-[#FFCB9A]" />
            Improve Project Description
          </>
        }
        maxWidth="max-w-xl"
      >
        <div className="space-y-4">
          {!description ? (
            <p className="text-sm text-[#9DB5B0]">Write a description first, then click Improve.</p>
          ) : (
            <>
              {/* Original */}
              <div className="p-3 rounded-lg bg-[#3D4944] border border-[#D1E8E2]/10 text-sm text-[#D1E8E2]/80">
                <span className="text-[#9DB5B0] text-xs uppercase tracking-wider block mb-1">Your description</span>
                {description}
              </div>

              {!loading && !improved && (
                <Button onClick={generate} className="bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]">
                  <Sparkles className="w-4 h-4 mr-1.5" /> Generate Improvement
                </Button>
              )}

              {loading && <AILoadingState messageIndex={messageIdx} />}

              {improved && !loading && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#9DB5B0] uppercase tracking-wider">Improved Description</span>
                    <button
                      onClick={() => { setEditable(!editable); setEdited(improved); }}
                      className="text-xs text-[#FFCB9A] hover:underline"
                    >
                      {editable ? "Done" : "Edit"}
                    </button>
                  </div>
                  {editable ? (
                    <textarea
                      value={edited}
                      onChange={(e) => setEdited(e.target.value)}
                      className="w-full bg-[#3D4944] border border-[#D1E8E2]/10 rounded-md px-3 py-2 text-sm text-[#D1E8E2] min-h-[80px]"
                    />
                  ) : (
                    <div className="p-3 rounded-lg bg-[#3D4944] border border-[#D1E8E2]/10 text-sm text-[#D1E8E2] leading-relaxed">
                      {improved}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={() => {
                        onApply(editable ? edited : improved);
                        setOpen(false);
                        toast.success("Description applied!");
                      }}
                      className="bg-[#FFCB9A] hover:bg-[#FFCB9A]/90 text-[#2C3531] flex-1"
                    >
                      <Check className="w-4 h-4 mr-1.5" /> Use Suggestion
                    </Button>
                    <Button onClick={generate} variant="ghost" className="text-[#9DB5B0] hover:text-[#D1E8E2] flex-1">
                      <RefreshCw className="w-4 h-4 mr-1.5" /> Regenerate
                    </Button>
                  </div>
                  <Button
                    onClick={() => setOpen(false)}
                    variant="ghost"
                    className="text-[#9DB5B0] hover:text-[#D1E8E2] w-full"
                  >
                    Keep Original
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </AIModal>
    </>
  );
}
