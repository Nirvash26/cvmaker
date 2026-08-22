import { NextRequest, NextResponse } from "next/server";
import { aiChat } from "@/lib/ai";

const TONE_PROMPTS: Record<string, string> = {
  professional: "Use a professional, neutral, third-person voice. Sound competent and dependable.",
  confident: "Use a confident, assertive voice. Emphasize impact and leadership.",
  creative: "Use a creative, engaging voice that still sounds professional. Allow some personality.",
  concise: "Be very concise. Maximum 35 words. Direct, factual, no fluff.",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobRole, experience, keySkills, tone } = body;

    if (!jobRole && !keySkills) {
      return NextResponse.json(
        { error: "jobRole or keySkills is required" },
        { status: 400 }
      );
    }

    const toneGuidance = TONE_PROMPTS[tone] || TONE_PROMPTS.professional;
    const maxWords = tone === "concise" ? 35 : 80;

    const systemPrompt =
      `You are an expert career coach and professional resume writer. Write compelling, ATS-friendly professional summaries. ${toneGuidance} Be concise, specific, and avoid clichés. Output ONLY the summary paragraph (max ${maxWords} words), no extra commentary, no markdown headers.`;
    const userPrompt = `Write a professional CV summary for someone with:
- Job role: ${jobRole || "professional"}
- Experience level: ${experience || "junior"}
- Key skills: ${keySkills || "various"}

Write it in third person, present tense, no first person ("I").`;

    const aiResult = await aiChat(systemPrompt, userPrompt);

    if (aiResult) {
      const cleaned = aiResult.replace(/^["']|["']$/g, "").trim();
      return NextResponse.json({ summary: cleaned });
    }

    const fallback = localFallback(jobRole, experience, keySkills, tone);
    return NextResponse.json({ summary: fallback });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

function localFallback(role: string, level: string, skills: string, tone: string): string {
  const r = role || "professional";
  const lvl = level === "senior" || level === "lead" ? "experienced" : "motivated";
  const skillList = skills ? skills.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4) : [];
  const skillText = skillList.length > 0 ? ` specializing in ${skillList.join(", ")}` : "";

  if (tone === "concise") {
    return `${lvl === "experienced" ? "Experienced" : "Motivated"} ${r}${skillText}. Focused on delivering quality results and continuous improvement.`;
  }
  if (tone === "confident") {
    return `${lvl === "experienced" ? "Experienced" : "Driven"} ${r}${skillText}. Track record of leading initiatives, shipping high-impact work, and pushing teams forward. Confident communicator with a bias for action and measurable outcomes.`;
  }
  if (tone === "creative") {
    return `${lvl === "experienced" ? "Experienced" : "Curious"} ${r}${skillText}. Blends craft with curiosity to ship thoughtful, user-friendly work. Comfortable exploring new ideas while keeping delivery sharp and reliable.`;
  }
  return `${lvl === "experienced" ? "Experienced" : "Motivated"} ${r}${skillText}. Proven track record of delivering high-quality results, collaborating effectively with cross-functional teams, and continuously learning modern best practices. Committed to driving impact through clean, scalable solutions and a user-first mindset.`;
}
