import { App, normalizePath } from "obsidian";

export type SkillMetadata = {
	name: string;
	description: string;
	path: string;
};

export async function discoverSkills(app: App, pluginId: string): Promise<SkillMetadata[]> {
	const pluginRoot = getPluginRoot(pluginId);
	const builtSkillsRoot = normalizePath(`${pluginRoot}/skills`);

	let listing;
	try {
		listing = await app.vault.adapter.list(builtSkillsRoot);
	} catch {
		return [];
	}

	const discoveredSkills: SkillMetadata[] = [];

	for (const folderPath of listing.folders) {
		const skillFilePath = normalizePath(`${folderPath}/SKILL.md`);

		try {
			const content = await app.vault.adapter.read(skillFilePath);
			const frontmatter = parseSkillFrontmatter(content);

			discoveredSkills.push({
				name: frontmatter.name,
				description: frontmatter.description,
				path: skillFilePath,
			});
		} catch {
			continue;
		}
	}

	return discoveredSkills.sort((left, right) => left.name.localeCompare(right.name));
}

export async function loadSkillContent(
	app: App,
	skills: SkillMetadata[],
	name: string,
): Promise<{ skillDirectory: string; content: string } | null> {
	const skill = skills.find((candidate) => candidate.name.toLowerCase() === name.trim().toLowerCase());
	if (!skill) {
		return null;
	}

	const content = await app.vault.adapter.read(skill.path);

	return {
		skillDirectory: getSkillDirectory(skill.path),
		content: stripFrontmatter(content),
	};
}

function getPluginRoot(pluginId: string): string {
	return normalizePath(`.obsidian/plugins/${pluginId}`);
}

function getSkillDirectory(skillPath: string): string {
	const slashIndex = skillPath.lastIndexOf("/");
	return slashIndex === -1 ? skillPath : skillPath.slice(0, slashIndex);
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
