"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus, Edit3, Download, Copy, Trash2, Clock, Sparkles, ChevronLeft,
  LayoutTemplate, MoreVertical, FileText, Star, ChevronRight,
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
import { cn } from "@/lib/utils";

export function Dashboard() {
  const setView = useAppStore((s) => s.setView);
  const cvs = useAppStore((s) => s.cvs);
  const setCurrentCV = useAppStore((s) => s.setCurrentCV);
  const deleteCV = useAppStore((s) => s.deleteCV);
  const duplicateCV = useAppStore((s) => s.duplicateCV);
  const renameCV = useAppStore((s) => s.renameCV);
  const updateCV = useAppStore((s) => s.updateCV);

  const [downloadFor, setDownloadFor] = useState<string | null>(null);
  const [deleteFor, setDeleteFor] = useState<string | null>(null);
  const [renameFor, setRenameFor] = useState<string | null>(null);
  const [recentFilter, setRecentFilter] = useState<"all" | "favorites">("all");

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

  const toggleFavorite = (id: string, current: boolean) => {
    updateCV(id, { name: useAppStore.getState().cvs.find((c) => c.id === id)?.name || "Untitled" });
    // Store favorite in a simple way using cv name suffix — actually use a dedicated field
    // For simplicity, store as a Set in localStorage
    try {
      const favs = JSON.parse(localStorage.getItem("nirvash-favorites") || "[]");
      const newFavs = current ? favs.filter((f: string) => f !== id) : [...favs, id];
      localStorage.setItem("nirvash-favorites", JSON.stringify(newFavs));
      toast.success(current ? "Removed from favorites" : "Added to favorites");
      // Force refresh
      setRecentFilter(r => r === "favorites" ? "favorites" : "all");
      setTimeout(() => setRecentFilter(r => r === "all" ? "all" : r), 0);
    } catch {}
  };

  const favorites = (() => {
    try {
      return new Set<string>(JSON.parse(localStorage.getItem("nirvash-favorites") || "[]"));
    } catch {
      return new Set<string>();
    }
  })();

  const cvForDownload = cvs.find((c) => c.id === downloadFor);
  const cvForDelete = cvs.find((c) => c.id === deleteFor);
  const cvForRename = cvs.find((c) => c.id === renameFor);

  const sortedCVs = [...cvs].sort((a, b) => b.updatedAt - a.updatedAt);
  const filteredCVs = recentFilter === "favorites" ? sortedCVs.filter((cv) => favorites.has(cv.id)) : sortedCVs;

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
          <div className="flex items-center gap-2">
            {cvs.length > 0 && (
              <div className="flex items-center gap-1 p-1 rounded-lg bg-[#3D4944]/60 border border-[#D1E8E2]/10">
                <button
                  onClick={() => setRecentFilter("all")}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-medium transition-all",
                    recentFilter === "all" ? "bg-[#116466] text-[#D1E8E2]" : "text-[#9DB5B0] hover:text-[#D1E8E2]"
                  )}
                >
                  All Documents
                </button>
                <button
                  onClick={() => setRecentFilter("favorites")}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1",
                    recentFilter === "favorites" ? "bg-[#116466] text-[#D1E8E2]" : "text-[#9DB5B0] hover:text-[#D1E8E2]"
                  )}
                >
                  <Star className={cn("w-3 h-3", favorites.size > 0 && "fill-[#FFCB9A] text-[#FFCB9A]")} />
                  Favorites
                </button>
              </div>
            )}
            <Button onClick={handleCreateNew} className="bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]">
              <Plus className="w-4 h-4 mr-1.5" /> Create New CV
            </Button>
          </div>
        </div>

        {cvs.length === 0 ? (
          <EmptyState onCreate={handleCreateNew} />
        ) : (
          <>
            {/* Recent CV (large featured card) */}
            {recentFilter === "all" && sortedCVs[0] && (
              <div className="mb-8">
                <h2 className="text-xs font-semibold text-[#9DB5B0] uppercase tracking-wider mb-3">Recent</h2>
                <FeaturedCVCard cv={sortedCVs[0]} score={computeCVScore(sortedCVs[0])} onEdit={() => handleEdit(sortedCVs[0].id)} onDownload={() => setDownloadFor(sortedCVs[0].id)} onMore={() => handleEdit(sortedCVs[0].id)} />
              </div>
            )}

            {/* All Documents */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-semibold text-[#9DB5B0] uppercase tracking-wider">
                  {recentFilter === "favorites" ? "Favorite Documents" : "All Documents"}
                </h2>
                <span className="text-xs text-[#9DB5B0]">{filteredCVs.length} items</span>
              </div>

              {filteredCVs.length === 0 ? (
                <div className="text-center py-12 text-[#9DB5B0] text-sm">
                  No favorite CVs yet. Click the star on a CV to add it here.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredCVs.map((cv, i) => (
                    <CompactCVCard
                      key={cv.id}
                      cv={cv}
                      score={computeCVScore(cv)}
                      isFavorite={favorites.has(cv.id)}
                      onEdit={() => handleEdit(cv.id)}
                      onDownload={() => setDownloadFor(cv.id)}
                      onDuplicate={() => handleDuplicate(cv.id)}
                      onRename={() => setRenameFor(cv.id)}
                      onChangeTemplate={() => handleChangeTemplate(cv.id)}
                      onDelete={() => setDeleteFor(cv.id)}
                      onToggleFavorite={() => toggleFavorite(cv.id, favorites.has(cv.id))}
                      delay={i * 0.04}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
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

// ============= Featured CV (large, top of dashboard) =============

function FeaturedCVCard({ cv, score, onEdit, onDownload, onMore }: { cv: CVData; score: number; onEdit: () => void; onDownload: () => void; onMore: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative rounded-2xl glass-card overflow-hidden hover:border-[#116466] transition-all duration-300"
    >
      <div className="grid md:grid-cols-[200px_1fr] gap-4 p-4">
        {/* Thumbnail */}
        <div
          className="relative bg-[#1a1a1a] rounded-xl overflow-hidden cursor-pointer"
          onClick={onEdit}
          style={{ aspectRatio: "1 / 1.414" }}
        >
          <TemplatePreview templateId={cv.template} cv={cv} compact />

          {/* Score badge */}
          {score > 0 && (
            <div className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#2C3531]/90 backdrop-blur-sm text-[10px] font-semibold text-[#FFCB9A] border border-[#FFCB9A]/30">
              <Sparkles className="w-2.5 h-2.5" />
              {score}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-between py-1">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-[#D1E8E2] truncate">{cv.name || "Untitled CV"}</h3>
                <div className="text-sm text-[#9DB5B0] mt-1">
                  {cv.personal.title || "Professional Title"} — {new Date().getFullYear()}
                </div>
                <div className="text-xs text-[#9DB5B0] mt-1.5 flex items-center gap-2 flex-wrap">
                  <span className="px-1.5 py-0.5 rounded bg-[#3D4944]">{cv.template}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {formatRelative(cv.updatedAt)}
                  </span>
                  {score > 0 && (
                    <span className="flex items-center gap-1 text-[#FFCB9A]">
                      <Sparkles className="w-3 h-3" /> CV Score: {score}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex items-center gap-2 mt-4">
            <Button onClick={onEdit} size="sm" className="bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]">
              Continue Editing <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
            <Button onClick={onDownload} variant="ghost" size="sm" className="text-[#9DB5B0] hover:text-[#D1E8E2]">
              <Download className="w-3.5 h-3.5 mr-1" /> Download
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-md text-[#9DB5B0] hover:text-[#D1E8E2] hover:bg-[#3D4944]" aria-label="More options">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#34403B] border-[#D1E8E2]/10">
                <DropdownMenuItem onClick={onMore} className="text-[#D1E8E2] hover:bg-[#3D4944] cursor-pointer">
                  <Edit3 className="w-4 h-4 mr-2" /> Open Editor
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============= Compact CV Card (smaller, hover actions) =============

function CompactCVCard({
  cv, score, isFavorite, onEdit, onDownload, onDuplicate, onRename, onChangeTemplate, onDelete, onToggleFavorite, delay,
}: {
  cv: CVData; score: number; isFavorite: boolean;
  onEdit: () => void; onDownload: () => void; onDuplicate: () => void; onRename: () => void; onChangeTemplate: () => void; onDelete: () => void; onToggleFavorite: () => void;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="group relative rounded-xl glass-card overflow-hidden hover:border-[#116466] transition-all duration-300 hover:-translate-y-0.5"
    >
      {/* Thumbnail */}
      <div
        className="relative bg-[#1a1a1a] overflow-hidden cursor-pointer"
        onClick={onEdit}
        style={{ aspectRatio: "1 / 1.3" }}
      >
        <TemplatePreview templateId={cv.template} cv={cv} compact />

        {/* Favorite button */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          className={cn(
            "absolute top-2 left-2 w-7 h-7 rounded-full backdrop-blur-sm flex items-center justify-center transition-all",
            isFavorite
              ? "bg-[#FFCB9A] text-[#2C3531]"
              : "bg-[#2C3531]/70 text-[#9DB5B0] opacity-0 group-hover:opacity-100 hover:text-[#FFCB9A]"
          )}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Star className={cn("w-3.5 h-3.5", isFavorite && "fill-current")} />
        </button>

        {/* Score badge */}
        {score > 0 && (
          <div className="absolute top-2 right-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#2C3531]/90 backdrop-blur-sm text-[9px] font-semibold text-[#FFCB9A] border border-[#FFCB9A]/30">
            <Sparkles className="w-2 h-2" />
            {score}
          </div>
        )}

        {/* Hover actions overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C3531]/95 via-[#2C3531]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center gap-2 p-3">
          <Button size="sm" onClick={(e) => { e.stopPropagation(); onEdit(); }} className="bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2] h-8">
            <Edit3 className="w-3 h-3 mr-1" /> Edit
          </Button>
          <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onDownload(); }} className="bg-[#2C3531]/80 hover:bg-[#3D4944] text-[#D1E8E2] h-8 w-8 p-0">
            <Download className="w-3.5 h-3.5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="bg-[#2C3531]/80 hover:bg-[#3D4944] text-[#D1E8E2] h-8 w-8 rounded-md flex items-center justify-center"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#34403B] border-[#D1E8E2]/10">
              <DropdownMenuItem onClick={onRename} className="text-[#D1E8E2] hover:bg-[#3D4944] cursor-pointer">
                <Edit3 className="w-4 h-4 mr-2" /> Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDuplicate} className="text-[#D1E8E2] hover:bg-[#3D4944] cursor-pointer">
                <Copy className="w-4 h-4 mr-2" /> Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onChangeTemplate} className="text-[#D1E8E2] hover:bg-[#3D4944] cursor-pointer">
                <LayoutTemplate className="w-4 h-4 mr-2" /> Change Template
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-400 hover:bg-[#3D4944] cursor-pointer">
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-[#D1E8E2] truncate">{cv.name || "Untitled CV"}</h3>
        <div className="flex items-center gap-1.5 mt-1 text-[10px] text-[#9DB5B0]">
          <span className="px-1 py-0.5 rounded bg-[#3D4944]">{cv.template}</span>
          <span className="flex items-center gap-0.5">
            <Clock className="w-2.5 h-2.5" /> {formatRelative(cv.updatedAt)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20"
    >
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
