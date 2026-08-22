"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  cvName?: string;
}

export function DeleteConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
  title = "Delete this CV?",
  description = "This action cannot be undone. The CV and all its content will be permanently removed.",
  confirmLabel = "Delete CV",
  cancelLabel = "Cancel",
  cvName,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-[#34403B] border-[#D1E8E2]/10 text-[#D1E8E2] max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-[#D1E8E2] text-lg">
            <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[#9DB5B0] text-sm">
            {cvName && (
              <span className="block mb-2 text-[#D1E8E2] font-medium">
                &quot;{cvName}&quot;
              </span>
            )}
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] hover:bg-[#3D4944]/80">
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-500/90 hover:bg-red-500 text-white border-0"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
