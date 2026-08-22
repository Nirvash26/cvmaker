import ZAI from "z-ai-web-dev-sdk";

let zaiInstance: any = null;

export async function getZAI() {
  if (!zaiInstance) {
    try {
      zaiInstance = await ZAI.create();
    } catch (e) {
      console.error("Failed to initialize ZAI:", e);
      return null;
    }
  }
  return zaiInstance;
}

export async function aiChat(systemPrompt: string, userPrompt: string): Promise<string | null> {
  try {
    const zai = await getZAI();
    if (!zai) return null;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: "assistant", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      thinking: { type: "disabled" },
      temperature: 0.7,
      max_tokens: 800,
    });

    return completion?.choices?.[0]?.message?.content ?? null;
  } catch (e) {
    console.error("AI chat error:", e);
    return null;
  }
}
