"use client";

import { useState } from "react";
import { FileText, FileType, Printer, Loader2, X, Check } from "lucide-react";
import { CVData } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  cv: CVData;
}

export function DownloadModal({ open, onOpenChange, cv }: Props) {
  const setView = useAppStore((s) => s.setView);
  const [generating, setGenerating] = useState<"pdf" | "docx" | null>(null);

  const handlePDF = async () => {
    setGenerating("pdf");
    // Browser print-to-PDF flow
    setTimeout(() => {
      window.print();
      setGenerating(null);
      onOpenChange(false);
      toast.success("Print dialog opened. Choose 'Save as PDF'.");
    }, 300);
  };

  const handlePrint = () => {
    window.print();
    onOpenChange(false);
  };

  const handleDOCX = async () => {
    setGenerating("docx");
    try {
      const { generateDOCX } = await import("@/lib/docx-export");
      const blob = await generateDOCX(cv);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${cv.name || "cv"}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("DOCX downloaded!");
      onOpenChange(false);
    } catch (e: any) {
      console.error(e);
      toast.error("Failed to generate DOCX.");
    } finally {
      setGenerating(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#34403B] border-[#D1E8E2]/10 text-[#D1E8E2] max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Download Your CV</span>
            <button onClick={() => onOpenChange(false)} className="text-[#9DB5B0] hover:text-[#D1E8E2]">
              <X className="w-5 h-5" />
            </button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-sm text-[#9DB5B0]">Choose your preferred format.</p>

          {/* PDF */}
          <button
            onClick={handlePDF}
            disabled={generating !== null}
            className="w-full flex items-center gap-3 p-4 rounded-lg bg-[#3D4944] hover:bg-[#3D4944]/80 hover:border-[#116466] border border-transparent transition-all text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-red-500/15 flex items-center justify-center">
              <FileText className="w-5 h-5 text-red-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-[#D1E8E2]">PDF</div>
              <div className="text-xs text-[#9DB5B0]">Best for applications and professional sharing.</div>
            </div>
            {generating === "pdf" ? <Loader2 className="w-4 h-4 animate-spin text-[#FFCB9A]" /> : null}
          </button>

          {/* DOCX */}
          <button
            onClick={handleDOCX}
            disabled={generating !== null}
            className="w-full flex items-center gap-3 p-4 rounded-lg bg-[#3D4944] hover:bg-[#3D4944]/80 hover:border-[#116466] border border-transparent transition-all text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-500/15 flex items-center justify-center">
              <FileType className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-[#D1E8E2]">DOCX</div>
              <div className="text-xs text-[#9DB5B0]">Best for further editing in Word.</div>
            </div>
            {generating === "docx" ? <Loader2 className="w-4 h-4 animate-spin text-[#FFCB9A]" /> : null}
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            disabled={generating !== null}
            className="w-full flex items-center gap-3 p-4 rounded-lg bg-[#3D4944] hover:bg-[#3D4944]/80 hover:border-[#116466] border border-transparent transition-all text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-[#FFCB9A]/15 flex items-center justify-center">
              <Printer className="w-5 h-5 text-[#FFCB9A]" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-[#D1E8E2]">Print</div>
              <div className="text-xs text-[#9DB5B0]">Print your CV directly from your browser.</div>
            </div>
          </button>

          {/* Success CTA */}
          <div className="pt-3 border-t border-[#D1E8E2]/5">
            <Button
              onClick={() => { onOpenChange(false); setView("success"); }}
              className="w-full bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]"
            >
              <Check className="w-4 h-4 mr-1.5" /> I'm Done — Show Success Screen
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
