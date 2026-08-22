import { NextRequest, NextResponse } from "next/server";
import { aiChat } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobRole, experience, keySkills } = body;

    if (!jobRole && !keySkills) {
      return NextResponse.json(
        { error: "jobRole or keySkills is required" },
        { status: 400 }
      );
    }

    const systemPrompt =
      "You are an expert career coach and professional resume writer. Write compelling, ATS-friendly professional summaries. Be concise, specific, and avoid clichés. Output ONLY the summary paragraph (50-80 words), no extra commentary, no markdown headers.";
    const userPrompt = `Write a professional CV summary for someone with:
- Job role: ${jobRole || "professional"}
- Experience level: ${experience || "junior"}
- Key skills: ${keySkills || "various"}

Write it in third person, present tense, no first person ("I"). Make it sound confident and specific.`;

    const aiResult = await aiChat(systemPrompt, userPrompt);

    if (aiResult) {
      const cleaned = aiResult.replace(/^["']|["']$/g, "").trim();
      return NextResponse.json({ summary: cleaned });
    }

    // Fallback local generation
    const fallback = localFallback(jobRole, experience, keySkills);
    return NextResponse.json({ summary: fallback });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

function localFallback(role: string, level: string, skills: string): string {
  const r = role || "professional";
  const lvl = level === "senior" || level === "lead" ? "experienced" : "motivated";
  const skillList = skills ? skills.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4) : [];
  const skillText = skillList.length > 0 ? ` specializing in ${skillList.join(", ")}` : "";
  return `${lvl === "experienced" ? "Experienced" : "Motivated"} ${r}${skillText}. Proven track record of delivering high-quality results, collaborating effectively with cross-functional teams, and continuously learning modern best practices. Committed to driving impact through clean, scalable solutions and a user-first mindset.`;
}
