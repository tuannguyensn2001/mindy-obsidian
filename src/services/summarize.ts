import { generateText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { MindyPluginSettings } from "../settings";

export class MissingSummarizeConfigError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "MissingSummarizeConfigError";
	}
}

export async function summarizeRawContent(
	settings: MindyPluginSettings,
	rawContent: string,
): Promise<string> {
	const apiKey = settings.openRouterApiKey.trim();
	if (!apiKey) {
		throw new MissingSummarizeConfigError("OpenRouter API key is missing. Set it in Mindy settings.");
	}

	const modelName = settings.openRouterModel.trim();
	if (!modelName) {
		throw new MissingSummarizeConfigError("OpenRouter model is missing. Set it in Mindy settings.");
	}

	const openRouter = createOpenRouter({ apiKey });
	const { text } = await generateText({
		model: openRouter(modelName),
		system: [
			"You summarize source material for Obsidian notes.",
			"Return concise Markdown.",
			"Focus on the main argument, important facts, and actionable takeaways.",
			"Do not invent information that is not in the source.",
			"Paraphrase the source instead of copying it.",
			"Do not include verbatim excerpts, long quotes, or raw-content dumps in the summary.",
		].join(" "),
		prompt: [
			"Summarize the following source text.",
			"",
			"Output format:",
			"- One short overview paragraph.",
			"- A `Key points` section with 3 to 5 bullet points.",
			"- If the source is incomplete or ambiguous, mention that briefly.",
			"- Do not repeat the source verbatim.",
			"- Do not include direct quotes unless they are absolutely necessary.",
			"",
			"Source text:",
			rawContent,
		].join("\n"),
	});

	return text.trim();
}
