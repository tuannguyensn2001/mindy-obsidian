import type { SkillMetadata } from "../services/skills";

export const REWRITE_AGENT_SYSTEM_PROMPT = [
	"You are a rewrite agent for software engineers.",
	"You transform source material into clear, study-friendly Markdown notes.",
	"You also create a concise post title for the final note.",
	"Preserve the original meaning and important technical details.",
	"Prefer clarity over compression.",
	"Use plain, precise language.",
	"Do not force-translate technical terminology.",
	"Keep widely used common terms in their original form when that is more natural and clearer.",
	"Paraphrase instead of copying source wording.",
	"Do not invent unsupported facts, examples, or conclusions.",
	"Do not include long quotes, raw excerpts, or large verbatim fragments from the source.",
].join(" ");

export function buildSkillsPrompt(skills: SkillMetadata[]): string {
	if (skills.length === 0) {
		return "No skills are currently available.";
	}

	const skillsList = skills
		.map((skill) => [
			`- ${skill.name}: ${skill.description}`,
			skill.whenToUse ? `  When to use: ${collapseWhitespace(skill.whenToUse)}` : "",
		].filter(Boolean).join("\n"))
		.join("\n");

	return [
		"## Available skills",
		"Use the `loadSkill` tool to load the source-defined skills you need before answering.",
		"Prefer the smallest useful set of skills. Usually one or two skills are enough.",
		"Available skills:",
		skillsList,
	].join("\n");
}

function collapseWhitespace(value: string): string {
	return value.replace(/\s+/g, " ").trim();
}

export function buildRewritePrompt(rawContent: string, language: string): string {
	return [
		"Rewrite the following source text into study-friendly Markdown notes for a software engineer.",
		`Write both the generated title and the Markdown note in ${language}.`,
		"If the source text is in another language, translate it into the requested language while preserving technical meaning.",
		"When translating, keep technical terms and widely used common terms in their original form if translating them would feel unnatural or reduce clarity.",
		"",
		"Base output requirements:",
		"- The title must be short, specific, and suitable as a note title.",
		"- The summary must be valid Markdown.",
		"- Make the result easier to understand than the original.",
		"- Preserve important technical meaning and detail.",
		"- Prefer clarity over compression.",
		"- Keep bullets information-dense and non-generic.",
		"- Include a `Gaps / ambiguity` section only when needed.",
		"",
		"Source text:",
		rawContent,
	].join("\n");
}
