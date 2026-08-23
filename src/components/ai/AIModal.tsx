"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { X } from "lucide-react";

interface AIModalProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
}

/**
 * Mobile-aware AI modal:
 * - Desktop: centered Dialog
 * - Mobile: bottom-sheet Drawer
 *
 * Auto-detects viewport size and re-renders on resize.
 */
export function AIModal({ open, onOpenChange, title, children, maxWidth = "max-w-2xl" }: AIModalProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="bg-[#34403B] border-[#D1E8E2]/10 text-[#D1E8E2] max-h-[92vh]">
          <div className="mx-auto w-full max-w-md overflow-y-auto no-scrollbar">
            <DrawerHeader className="pb-2">
              <DrawerTitle className="flex items-center justify-between text-[#D1E8E2]">
                <span className="flex items-center gap-2">{title}</span>
                <button onClick={() => onOpenChange(false)} className="text-[#9DB5B0] hover:text-[#D1E8E2] p-1">
                  <X className="w-5 h-5" />
                </button>
              </DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-6 pt-1">{children}</div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`bg-[#34403B] border-[#D1E8E2]/10 text-[#D1E8E2] ${maxWidth}`}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-[#D1E8E2]">
            <span className="flex items-center gap-2">{title}</span>
          </DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
