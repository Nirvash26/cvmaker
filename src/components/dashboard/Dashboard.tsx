"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus, MoreVertical, Edit3, Download, Copy, Trash2, FileText,
  Clock, Sparkles, ChevronLeft, LayoutTemplate, CheckCircle2,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { CVData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { TemplatePreview } from "@/components/editor/TemplatePreview";
import { DownloadModal } from "@/components/common/DownloadModal";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import { RenameModal } from "@/components/common/RenameModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function Dashboard() {
  const setView = useAppStore((s) => s.setView);
  const cvs = useAppStore((s) => s.cvs);
  const setCurrentCV = useAppStore((s) => s.setCurrentCV);
  const deleteCV = useAppStore((s) => s.deleteCV);
  const duplicateCV = useAppStore((s) => s.duplicateCV);
  const renameCV = useAppStore((s) => s.renameCV);

  const [downloadFor, setDownloadFor] = useState<string | null>(null);
  const [deleteFor, setDeleteFor] = useState<string | null>(null);
  const [renameFor, setRenameFor] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setCurrentCV(id);
    setView("editor");
  };

  const handleCreateNew = () => {
    setView("method-select");
  };

  const handleDuplicate = (id: string) => {
    duplicateCV(id);
    toast.success("CV duplicated");
  };

  const handleDeleteConfirm = () => {
    if (deleteFor) {
      const cvName = cvs.find((c) => c.id === deleteFor)?.name;
      deleteCV(deleteFor);
      setDeleteFor(null);
      toast.success(`"${cvName || "CV"}" deleted`);
    }
  };

  const handleRename = (name: string) => {
    if (renameFor) {
      renameCV(renameFor, name);
      setRenameFor(null);
      toast.success("CV renamed");
    }
  };

  const handleChangeTemplate = (id: string) => {
    setCurrentCV(id);
    setView("template-gallery");
  };

  const cvForDownload = cvs.find((c) => c.id === downloadFor);
  const cvForDelete = cvs.find((c) => c.id === deleteFor);
  const cvForRename = cvs.find((c) => c.id === renameFor);

  return (
    <div className="min-h-screen pt-20">
      {/* Top bar */}
      <div className="sticky top-16 z-30 bg-[#2C3531]/80 backdrop-blur-xl border-b border-[#D1E8E2]/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <button onClick={() => setView("landing")} className="inline-flex items-center gap-1 text-sm text-[#9DB5B0] hover:text-[#D1E8E2] transition-colors">
              <ChevronLeft className="w-4 h-4" /> Home
            </button>
            <div className="text-sm text-[#D1E8E2] font-medium">Dashboard</div>
            <div className="w-16" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#D1E8E2]">My CVs</h1>
            <p className="mt-1.5 text-[#9DB5B0] text-sm">
              {cvs.length === 0
                ? "Create, manage, and improve all your professional CVs in one place."
                : `${cvs.length} ${cvs.length === 1 ? "CV" : "CVs"} · Create, manage, and improve all your professional CVs in one place.`}
            </p>
          </div>
          <Button onClick={handleCreateNew} className="bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]">
            <Plus className="w-4 h-4 mr-1.5" /> Create New CV
          </Button>
        </div>

        {cvs.length === 0 ? (
          <EmptyState onCreate={handleCreateNew} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cvs.map((cv, i) => {
              const score = computeCVScore(cv);
              return (
                <motion.div
                  key={cv.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="group rounded-xl glass-card hover:border-[#116466] transition-all duration-300 overflow-hidden"
                >
                  {/* Thumbnail */}
                  <div className="relative bg-[#1a1a1a] overflow-hidden cursor-pointer" onClick={() => handleEdit(cv.id)} style={{ aspectRatio: "1 / 1.3" }}>
                    <TemplatePreview templateId={cv.template} cv={cv} compact />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2C3531]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                      <Button size="sm" className="bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]">
                        <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit
                      </Button>
                    </div>

                    {/* Score badge */}
                    {score > 0 && (
                      <div className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#2C3531]/90 backdrop-blur-sm text-[10px] font-semibold text-[#FFCB9A] border border-[#FFCB9A]/30">
                        <Sparkles className="w-2.5 h-2.5" />
                        {score}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-base font-semibold text-[#D1E8E2] truncate">{cv.name || "Untitled CV"}</h3>
                    <div className="mt-1 flex items-center gap-2 text-xs text-[#9DB5B0]">
                      <span className="px-1.5 py-0.5 rounded bg-[#3D4944]">{cv.template}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {formatRelative(cv.updatedAt)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="mt-3 flex items-center gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(cv.id)} className="text-[#9DB5B0] hover:text-[#D1E8E2] flex-1">
                        <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setDownloadFor(cv.id)} className="text-[#9DB5B0] hover:text-[#D1E8E2]">
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1.5 rounded-md text-[#9DB5B0] hover:text-[#D1E8E2] hover:bg-[#3D4944]" aria-label="More options">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#34403B] border-[#D1E8E2]/10">
                          <DropdownMenuItem onClick={() => setRenameFor(cv.id)} className="text-[#D1E8E2] hover:bg-[#3D4944] cursor-pointer">
                            <Edit3 className="w-4 h-4 mr-2" /> Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(cv.id)} className="text-[#D1E8E2] hover:bg-[#3D4944] cursor-pointer">
                            <Copy className="w-4 h-4 mr-2" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeTemplate(cv.id)} className="text-[#D1E8E2] hover:bg-[#3D4944] cursor-pointer">
                            <LayoutTemplate className="w-4 h-4 mr-2" /> Change Template
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteFor(cv.id)}
                            className="text-red-400 hover:bg-[#3D4944] cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {cvForDownload && (
        <DownloadModal open={true} onOpenChange={(o) => !o && setDownloadFor(null)} cv={cvForDownload} />
      )}

      <DeleteConfirmationModal
        open={!!deleteFor}
        onOpenChange={(o) => !o && setDeleteFor(null)}
        onConfirm={handleDeleteConfirm}
        cvName={cvForDelete?.name}
      />

      <RenameModal
        open={!!renameFor}
        onOpenChange={(o) => !o && setRenameFor(null)}
        onConfirm={handleRename}
        currentName={cvForRename?.name || ""}
      />
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20"
    >
      {/* Illustration */}
      <div className="relative inline-block mb-8">
        <svg width="200" height="160" viewBox="0 0 200 160" className="mx-auto">
          <defs>
            <linearGradient id="emptyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#116466" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FFCB9A" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <motion.g
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <rect x="50" y="20" width="100" height="130" rx="8" fill="url(#emptyGrad)" stroke="#116466" strokeWidth="1.5" />
            <rect x="60" y="35" width="50" height="6" rx="3" fill="#FFCB9A" opacity="0.8" />
            <rect x="60" y="48" width="30" height="4" rx="2" fill="#D1E8E2" opacity="0.4" />
            <rect x="60" y="65" width="80" height="3" rx="1.5" fill="#D1E8E2" opacity="0.3" />
            <rect x="60" y="73" width="70" height="3" rx="1.5" fill="#D1E8E2" opacity="0.3" />
            <rect x="60" y="81" width="75" height="3" rx="1.5" fill="#D1E8E2" opacity="0.3" />
            <rect x="60" y="98" width="35" height="4" rx="2" fill="#FFCB9A" opacity="0.5" />
            <rect x="60" y="108" width="80" height="3" rx="1.5" fill="#D1E8E2" opacity="0.3" />
            <rect x="60" y="116" width="65" height="3" rx="1.5" fill="#D1E8E2" opacity="0.3" />
            <circle cx="140" cy="40" r="6" fill="#FFCB9A" opacity="0.8" />
            <circle cx="140" cy="40" r="10" fill="none" stroke="#FFCB9A" strokeWidth="1" opacity="0.4" />
          </motion.g>
        </svg>
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-[#116466]/40 blur-2xl rounded-full" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-[#D1E8E2]">
        Your next opportunity starts here.
      </h2>
      <p className="mt-3 text-[#9DB5B0] max-w-md mx-auto">
        Create your first professional CV in just a few simple steps.
      </p>
      <Button
        onClick={onCreate}
        className="mt-6 bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2] teal-glow-soft"
      >
        <Sparkles className="w-4 h-4 mr-1.5 text-[#FFCB9A]" /> Create My First CV →
      </Button>
    </motion.div>
  );
}

function formatRelative(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

// Lightweight CV score for dashboard display
function computeCVScore(cv: CVData): number {
  const checks = [
    !!(cv.personal.fullName && cv.personal.email && cv.personal.phone),
    cv.summary.length > 50,
    cv.experience.length > 0,
    cv.experience.some((e) => e.achievements && e.achievements.length > 0),
    cv.education.length > 0,
    cv.skills.length >= 5,
    cv.skills.length >= 8,
    cv.projects.length > 0 || cv.certifications.length > 0,
  ];
  const earned = checks.filter(Boolean).length;
  return Math.min(100, Math.round((earned / checks.length) * 100));
}
