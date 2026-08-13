import { streamText } from "ai";

import { createLovableAiGatewayProvider, DEFAULT_MODEL } from "./ai-gateway.server";

type Msg = { role: "user" | "assistant"; content: string };

export async function runPrompt(args: { system: string; prompt?: string; messages?: Msg[] }) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured yet. Missing API key.");

  const gateway = createLovableAiGatewayProvider(key);

  try {
    const result = streamText({
      model: gateway(DEFAULT_MODEL),
      system: args.system,
      ...(args.messages ? { messages: args.messages } : { prompt: args.prompt ?? "" }),
    });
    const text = await result.text;
    return { text };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("429")) {
      throw new Error("Rate limit reached. Please wait a moment and try again.");
    }
    if (message.includes("402")) {
      throw new Error("AI credits exhausted. Add credits in your workspace settings.");
    }
    throw new Error("The AI request failed. Please try again.");
  }
}
