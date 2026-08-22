"use client";

import { useState } from "react";
import { ChevronLeft, User, Settings as SettingsIcon, KeyRound, Trash2, Camera, Globe, Palette } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export function Settings() {
  const setView = useAppStore((s) => s.setView);
  const cvs = useAppStore((s) => s.cvs);

  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex@example.com",
    photo: "",
  });
  const [prefs, setPrefs] = useState({
    defaultTemplate: "aurora",
    language: "en",
    theme: "dark",
  });

  const handleSavePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfile({ ...profile, photo: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleDeleteAccount = () => {
    if (confirm("This will delete ALL your CVs and settings. This cannot be undone.")) {
      try {
        localStorage.clear();
        toast.success("Account deleted. Reloading...");
        setTimeout(() => window.location.reload(), 1000);
      } catch {
        toast.error("Failed to clear data.");
      }
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Top bar */}
      <div className="sticky top-16 z-30 bg-[#2C3531]/80 backdrop-blur-xl border-b border-[#D1E8E2]/5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <button onClick={() => setView("landing")} className="inline-flex items-center gap-1 text-sm text-[#9DB5B0] hover:text-[#D1E8E2] transition-colors">
              <ChevronLeft className="w-4 h-4" /> Home
            </button>
            <div className="text-sm text-[#D1E8E2] font-medium">Settings</div>
            <div className="w-16" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {/* Profile */}
        <SettingsCard icon={User} title="Profile">
          <div className="flex items-start gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-[#3D4944] border border-[#D1E8E2]/15 flex items-center justify-center overflow-hidden">
                {profile.photo ? <img src={profile.photo} alt="" className="w-full h-full object-cover" /> : <User className="w-8 h-8 text-[#9DB5B0]" />}
              </div>
              <label className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#116466] hover:bg-[#0d4d4f] flex items-center justify-center cursor-pointer border-2 border-[#2C3531]">
                <Camera className="w-3.5 h-3.5 text-[#D1E8E2]" />
                <input type="file" accept="image/*" className="hidden" onChange={handleSavePhoto} />
              </label>
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-1.5 block">Name</Label>
                <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
              </div>
              <div>
                <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-1.5 block">Email</Label>
                <Input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
              </div>
            </div>
          </div>
        </SettingsCard>

        {/* Preferences */}
        <SettingsCard icon={SettingsIcon} title="Preferences">
          <div className="space-y-4">
            <div>
              <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-1.5 block">Default CV Template</Label>
              <select
                value={prefs.defaultTemplate}
                onChange={(e) => setPrefs({ ...prefs, defaultTemplate: e.target.value })}
                className="bg-[#3D4944] border border-[#D1E8E2]/10 text-[#D1E8E2] rounded-md px-3 py-2 text-sm w-full sm:w-64"
              >
                <option value="aurora">Aurora</option>
                <option value="minimal">Minimal</option>
                <option value="vertex">Vertex</option>
                <option value="horizon">Horizon</option>
                <option value="executive">Executive</option>
                <option value="nova">Nova</option>
                <option value="classic">Classic</option>
                <option value="slate">Slate</option>
                <option value="modern-edge">Modern Edge</option>
                <option value="academic">Academic</option>
                <option value="focus">Focus</option>
                <option value="studio">Studio</option>
              </select>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-1.5 block">
                  <Globe className="w-3 h-3 inline mr-1" /> Language
                </Label>
                <select
                  value={prefs.language}
                  onChange={(e) => setPrefs({ ...prefs, language: e.target.value })}
                  className="bg-[#3D4944] border border-[#D1E8E2]/10 text-[#D1E8E2] rounded-md px-3 py-2 text-sm w-full"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                  <option value="ja">Japanese</option>
                </select>
              </div>
              <div>
                <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-1.5 block">
                  <Palette className="w-3 h-3 inline mr-1" /> Theme
                </Label>
                <select
                  value={prefs.theme}
                  onChange={(e) => setPrefs({ ...prefs, theme: e.target.value })}
                  className="bg-[#3D4944] border border-[#D1E8E2]/10 text-[#D1E8E2] rounded-md px-3 py-2 text-sm w-full"
                >
                  <option value="dark">Dark (Nirvash)</option>
                  <option value="light">Light</option>
                  <option value="system">System</option>
                </select>
              </div>
            </div>
          </div>
        </SettingsCard>

        {/* Account */}
        <SettingsCard icon={KeyRound} title="Account">
          <div className="space-y-3">
            <Button variant="outline" className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] hover:bg-[#3D4944]/80">
              <KeyRound className="w-4 h-4 mr-2" /> Change Password
            </Button>
            <div className="pt-3 border-t border-[#D1E8E2]/5">
              <p className="text-sm text-[#9DB5B0] mb-2">Danger zone — this will permanently delete all your CVs and data.</p>
              <Button onClick={handleDeleteAccount} variant="destructive" className="bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/30">
                <Trash2 className="w-4 h-4 mr-2" /> Delete Account
              </Button>
            </div>
          </div>
        </SettingsCard>

        {/* Stats */}
        <div className="text-xs text-[#9DB5B0] text-center pt-4">
          You have {cvs.length} {cvs.length === 1 ? "CV" : "CVs"} saved locally.
        </div>
      </div>
    </div>
  );
}

function SettingsCard({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="p-6 rounded-xl glass-card">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-md bg-[#116466]/30 border border-[#116466]/50 flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#FFCB9A]" />
        </div>
        <h2 className="text-lg font-semibold text-[#D1E8E2]">{title}</h2>
      </div>
      {children}
    </div>
  );
}
