import { generateText, jsonSchema, Output, stepCountIs, tool } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { App } from "obsidian";
import { z } from "zod";
import {
	buildRewritePrompt,
	buildSkillsPrompt,
	REWRITE_AGENT_SYSTEM_PROMPT,
} from "../prompts/rewrite";
import { discoverSkills, loadSkillContent, type SkillMetadata } from "./skills";
import { MindyPluginSettings } from "../settings";

export class MissingRewriteConfigError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "MissingRewriteConfigError";
	}
}

type RewriteContext = {
	app: App;
	skills: SkillMetadata[];
};

export type RewriteResult = {
	title: string;
	summary: string;
};

const rewriteResultSchema = z.object({
	title: z.string().trim().min(1).describe('Title post'),
	summary: z.string().trim().min(1).describe('Content'),
});

export async function rewriteRawContent(
	app: App,
	pluginId: string,
	settings: MindyPluginSettings,
	rawContent: string,
): Promise<RewriteResult> {
	const apiKey = settings.openRouterApiKey.trim();
	if (!apiKey) {
		throw new MissingRewriteConfigError("OpenRouter API key is missing. Set it in Mindy settings.");
	}

	const modelName = settings.openRouterModel.trim();
	if (!modelName) {
		throw new MissingRewriteConfigError("OpenRouter model is missing. Set it in Mindy settings.");
	}

	const skills = await discoverSkills(app, pluginId);
	const openRouter = createOpenRouter({ apiKey });
	const { output } = await generateText({
		model: openRouter(modelName),
		system: [
			REWRITE_AGENT_SYSTEM_PROMPT,
			"",
			buildSkillsPrompt(skills),
		].join("\n"),
		prompt: buildRewritePrompt(rawContent, settings.language),
		output: Output.object({ schema: rewriteResultSchema }),
		tools: {
			loadSkill: tool({
				description: "Load a skill to get specialized rewrite instructions.",
				inputSchema: jsonSchema({
					type: "object",
					properties: {
						name: {
							type: "string",
							description: "The skill name to load.",
						},
					},
					required: ["name"],
					additionalProperties: false,
				}),
				execute: async ({ name }, { experimental_context }) => {
					const context = experimental_context as RewriteContext;
					const loadedSkill = await loadSkillContent(context.app, context.skills, name);
					if (!loadedSkill) {
						return { error: `Skill '${name}' not found.` };
					}

					return loadedSkill;
				},
			}),
		},
		stopWhen: stepCountIs(6),
		experimental_context: {
			app,
			skills,
		} satisfies RewriteContext,
	});

	return output;
}
