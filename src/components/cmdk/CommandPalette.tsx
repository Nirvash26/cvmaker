"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, FilePlus, FileText, LayoutTemplate, Download, Palette,
  Sparkles, Home, User, ArrowRight, CornerDownLeft,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface Command {
  id: string;
  label: string;
  hint?: string;
  icon: any;
  section: string;
  action: () => void;
  keywords?: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const setView = useAppStore((s) => s.setView);
  const cvs = useAppStore((s) => s.cvs);
  const setCurrentCV = useAppStore((s) => s.setCurrentCV);
  const currentCVId = useAppStore((s) => s.currentCVId);
  const cv = cvs.find((c) => c.id === currentCVId);

  // Global keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setHighlighted(0);
    }
  }, [open]);

  const commands = useMemo<Command[]>(() => {
    const base: Command[] = [
      { id: "create-cv", label: "Create CV", hint: "Start a new CV", icon: FilePlus, section: "Actions", action: () => { setView("method-select"); setOpen(false); }, keywords: "new start" },
      { id: "go-home", label: "Go to Home", icon: Home, section: "Navigation", action: () => { setView("landing"); setOpen(false); } },
      { id: "go-dashboard", label: "Open My CVs", icon: FileText, section: "Navigation", action: () => { setView("dashboard"); setOpen(false); }, keywords: "dashboard" },
      { id: "go-templates", label: "Browse Templates", icon: LayoutTemplate, section: "Navigation", action: () => { setView("template-gallery"); setOpen(false); }, keywords: "change template" },
      { id: "go-themes", label: "Open Themes", icon: Palette, section: "Navigation", action: () => { setView("themes"); setOpen(false); }, keywords: "color theme" },
    ];

    if (cv) {
      base.push(
        { id: "edit-cv", label: `Edit: ${cv.name}`, hint: "Open editor", icon: User, section: "Current CV", action: () => { setView("editor"); setOpen(false); }, keywords: "edit current" },
        { id: "ai-tools", label: "Open AI Tools", hint: "Improve your CV", icon: Sparkles, section: "Current CV", action: () => { setView("editor"); useAppStore.getState().setEditorTab("ai"); setOpen(false); }, keywords: "ai improve summary" },
        { id: "download-pdf", label: "Download PDF", icon: Download, section: "Current CV", action: () => { setView("editor"); setOpen(false); setTimeout(() => window.print(), 500); }, keywords: "export print" },
        { id: "change-template", label: "Change Template", icon: LayoutTemplate, section: "Current CV", action: () => { setView("template-gallery"); setOpen(false); } },
      );
    }

    // Add open existing CVs
    cvs.forEach((c) => {
      base.push({
        id: `open-${c.id}`,
        label: c.name,
        hint: c.template,
        icon: FileText,
        section: "Open CV",
        action: () => { setCurrentCV(c.id); setView("editor"); setOpen(false); },
        keywords: c.name,
      });
    });

    return base;
  }, [setView, cv, cvs, setCurrentCV]);

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter((c) =>
      c.label.toLowerCase().includes(q) ||
      c.hint?.toLowerCase().includes(q) ||
      c.section.toLowerCase().includes(q) ||
      c.keywords?.toLowerCase().includes(q)
    );
  }, [commands, query]);

  // Group by section
  const grouped = useMemo(() => {
    const groups: Record<string, Command[]> = {};
    filtered.forEach((c) => {
      if (!groups[c.section]) groups[c.section] = [];
      groups[c.section].push(c);
    });
    return groups;
  }, [filtered]);

  // Flatten for keyboard nav
  const flat = useMemo(() => Object.values(grouped).flat(), [grouped]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlighted((h) => Math.min(h + 1, flat.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlighted((h) => Math.max(h - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        flat[highlighted]?.action();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, flat, highlighted]);

  // Scroll highlighted into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${highlighted}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [highlighted]);

  let runningIdx = -1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-[#2C3531]/80 backdrop-blur-md"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-xl bg-[#34403B] border border-[#D1E8E2]/10 shadow-2xl overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#D1E8E2]/10">
              <Search className="w-4 h-4 text-[#9DB5B0]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setHighlighted(0); }}
                placeholder="Search actions, CVs, or pages..."
                className="flex-1 bg-transparent text-[#D1E8E2] placeholder:text-[#9DB5B0] outline-none text-sm"
              />
              <kbd className="px-1.5 py-0.5 rounded bg-[#3D4944] text-[10px] text-[#9DB5B0] font-mono">ESC</kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[50vh] overflow-y-auto no-scrollbar p-2">
              {flat.length === 0 && (
                <div className="text-center py-8 text-sm text-[#9DB5B0]">No results for &quot;{query}&quot;</div>
              )}

              {Object.entries(grouped).map(([section, items]) => (
                <div key={section} className="mb-2">
                  <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-[#9DB5B0] font-semibold">{section}</div>
                  {items.map((cmd) => {
                    runningIdx++;
                    const idx = runningIdx;
                    return (
                      <button
                        key={cmd.id}
                        data-idx={idx}
                        onMouseEnter={() => setHighlighted(idx)}
                        onClick={cmd.action}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all",
                          highlighted === idx ? "bg-[#116466]/40 text-[#D1E8E2]" : "text-[#9DB5B0] hover:bg-[#3D4944]/50"
                        )}
                      >
                        <cmd.icon className={cn("w-4 h-4 flex-shrink-0", highlighted === idx && "text-[#FFCB9A]")} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{cmd.label}</div>
                          {cmd.hint && <div className="text-xs text-[#9DB5B0] truncate">{cmd.hint}</div>}
                        </div>
                        {highlighted === idx && <CornerDownLeft className="w-3 h-3 text-[#FFCB9A]" />}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Footer hint */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-[#D1E8E2]/10 text-[10px] text-[#9DB5B0]">
              <div className="flex items-center gap-2">
                <kbd className="px-1 py-0.5 rounded bg-[#3D4944] font-mono">↑↓</kbd> navigate
                <kbd className="px-1 py-0.5 rounded bg-[#3D4944] font-mono ml-2">↵</kbd> select
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#FFCB9A]" />
                Nirvash Command Palette
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
