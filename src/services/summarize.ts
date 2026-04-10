import { generateText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { buildSummarizePrompt, SUMMARIZE_SYSTEM_PROMPT } from "../prompts/summarize";
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
		system: SUMMARIZE_SYSTEM_PROMPT,
		prompt: buildSummarizePrompt(rawContent),
	});

	return text.trim();
}
