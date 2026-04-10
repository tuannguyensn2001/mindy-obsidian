import { STATIC_SKILLS } from "../skills-static";

export type SkillMetadata = {
	name: string;
	description: string;
	whenToUse: string;
	content: string;
};

export async function discoverSkills(): Promise<SkillMetadata[]> {
	return STATIC_SKILLS
		.map((content) => {
			const frontmatter = parseSkillFrontmatter(content);

			return {
				name: frontmatter.name,
				description: frontmatter.description,
				whenToUse: extractSection(content, "When to use this skill"),
				content,
			};
		})
		.sort((left, right) => left.name.localeCompare(right.name));
}

export async function loadSkillContent(
	skills: SkillMetadata[],
	name: string,
): Promise<{ skillDirectory: string; content: string } | null> {
	const skill = skills.find((candidate) => candidate.name.toLowerCase() === name.trim().toLowerCase());
	if (!skill) {
		return null;
	}

	return {
		skillDirectory: skill.name,
		content: stripFrontmatter(skill.content),
	};
}

function parseSkillFrontmatter(content: string): { name: string; description: string } {
	const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
	if (!match?.[1]) {
		throw new Error("Missing skill frontmatter.");
	}

	const fields = new Map<string, string>();
	for (const line of match[1].split(/\r?\n/)) {
		const separatorIndex = line.indexOf(":");
		if (separatorIndex === -1) {
			continue;
		}

		const key = line.slice(0, separatorIndex).trim();
		const value = line.slice(separatorIndex + 1).trim();
		fields.set(key, value);
	}

	const name = fields.get("name") ?? "";
	const description = fields.get("description") ?? "";
	if (!name) {
		throw new Error("Skill frontmatter must include name.");
	}

	return { name, description };
}

function stripFrontmatter(content: string): string {
	const match = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
	return match ? content.slice(match[0].length).trim() : content.trim();
}

function extractSection(content: string, heading: string): string {
	const body = stripFrontmatter(content);
	const escapedHeading = escapeRegExp(heading);
	const match = body.match(
		new RegExp(`^##\\s+${escapedHeading}\\s*$\\r?\\n([\\s\\S]*?)(?=^##\\s+|\\Z)`, "m"),
	);

	return match?.[1]?.trim() ?? "";
}

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
