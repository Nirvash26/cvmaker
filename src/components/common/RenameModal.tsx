"use client";

import { useState, useRef, useEffect } from "react";
import { Edit3, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onConfirm: (name: string) => void;
  currentName: string;
}

export function RenameModal({ open, onOpenChange, onConfirm, currentName }: Props) {
  // Use the modal's open state as a key so internal state resets when it opens.
  // We render the inner content only when open to avoid stale state issues.
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#34403B] border-[#D1E8E2]/10 text-[#D1E8E2] max-w-md">
        {open && <RenameForm initialName={currentName} onConfirm={onConfirm} onCancel={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

function RenameForm({ initialName, onConfirm, onCancel }: { initialName: string; onConfirm: (n: string) => void; onCancel: () => void }) {
  const [value, setValue] = useState(initialName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between text-[#D1E8E2]">
          <span className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-[#FFCB9A]" />
            Rename CV
          </span>
          <button onClick={onCancel} className="text-[#9DB5B0] hover:text-[#D1E8E2]">
            <X className="w-5 h-5" />
          </button>
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-[#9DB5B0] uppercase tracking-wider mb-1.5 block">CV Name</label>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && value.trim()) {
                onConfirm(value.trim());
              }
            }}
            className="w-full bg-[#3D4944] border border-[#D1E8E2]/10 rounded-md px-3 py-2 text-sm text-[#D1E8E2]"
            placeholder="e.g. Software Developer CV"
          />
        </div>

        {/* Suggestions */}
        <div>
          <p className="text-xs text-[#9DB5B0] uppercase tracking-wider mb-1.5">Suggestions</p>
          <div className="flex flex-wrap gap-1.5">
            {[
              "Software Developer CV",
              "Graphic Design Portfolio CV",
              "Internship Application CV",
              "Google Application CV",
            ].map((s) => (
              <button
                key={s}
                onClick={() => setValue(s)}
                className="px-2 py-1 rounded-md bg-[#3D4944]/60 border border-[#D1E8E2]/10 hover:border-[#116466] text-xs text-[#9DB5B0] hover:text-[#D1E8E2] transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button
            onClick={() => value.trim() && onConfirm(value.trim())}
            className="bg-[#FFCB9A] hover:bg-[#FFCB9A]/90 text-[#2C3531] flex-1"
            disabled={!value.trim()}
          >
            Save
          </Button>
          <Button variant="ghost" onClick={onCancel} className="text-[#9DB5B0] flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
}
