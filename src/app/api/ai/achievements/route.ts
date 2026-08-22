import { NextRequest, NextResponse } from "next/server";
import { aiChat } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobTitle, context } = body;

    if (!jobTitle) {
      return NextResponse.json(
        { error: "jobTitle is required" },
        { status: 400 }
      );
    }

    const systemPrompt =
      "You are an expert career coach who writes measurable, quantified achievement bullet points for resumes. Each achievement includes a metric (%, number, time) where possible. Output 4-5 achievement ideas, one per line, each starting with a strong action verb. No numbering, no markdown symbols, no extra commentary.";

    const userPrompt = `Generate measurable achievement ideas for a ${jobTitle}.
Additional context: ${context || "general work"}

Return 4-5 quantified achievement bullet points, one per line.`;

    const aiResult = await aiChat(systemPrompt, userPrompt);

    if (aiResult) {
      const ideas = aiResult
        .split("\n")
        .map((line) => line.replace(/^[•\-*\d.\s]+/, "").trim())
        .filter((line) => line.length > 10)
        .slice(0, 5);
      if (ideas.length > 0) {
        return NextResponse.json({ ideas });
      }
    }

    const fallback = localFallback(jobTitle);
    return NextResponse.json({ ideas: fallback });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

function localFallback(jobTitle: string): string[] {
  return [
    `Increased overall productivity by 25% through process optimization as a ${jobTitle}.`,
    `Reduced delivery time by 30% by implementing streamlined workflows.`,
    `Collaborated with a team of 5+ members to deliver key projects ahead of schedule.`,
    `Improved customer satisfaction scores by 15% through enhanced communication and quality.`,
    `Contributed to a 20% reduction in errors through meticulous review and process improvements.`,
  ];
}
