import { App, TFile, normalizePath } from "obsidian";
import { MindyPluginSettings } from "../settings";

export type CreateIngestDraftInput = {
	title?: string;
	rawContent: string;
	summary: string;
	sourceType: "raw-content";
	settings: MindyPluginSettings;
};

const INVALID_FILE_CHARS = /[\\/:*?"<>|#^[\]]/g;

export async function createIngestDraft(app: App, input: CreateIngestDraftInput): Promise<TFile> {
	const noteTitle = buildNoteTitle(input.title, input.settings.defaultTitlePrefix);
	const safeBaseName = sanitizeFileName(noteTitle);
	const filePath = await buildAvailablePath(app, safeBaseName);
	const noteContent = buildDraftContent(noteTitle, input.summary, input.rawContent, input.sourceType);
	const file = await app.vault.create(filePath, noteContent);

	await app.workspace.getLeaf(true).openFile(file);
	return file;
}

function buildNoteTitle(title: string | undefined, defaultTitlePrefix: string): string {
	const trimmedTitle = title?.trim();
	if (trimmedTitle) {
		return trimmedTitle;
	}

	const now = new Date();
	const date = [
		now.getFullYear(),
		pad(now.getMonth() + 1),
		pad(now.getDate()),
	].join("-");
	const time = [pad(now.getHours()), pad(now.getMinutes())].join("-");

	return `${defaultTitlePrefix} ${date} ${time}`;
}

function buildDraftContent(title: string, summary: string, rawContent: string, sourceType: string): string {
	return [
		`# ${title}`,
		"",
		"## Summary",
		summary.trim(),
		"",
	].join("\n");
}

function sanitizeFileName(input: string): string {
	const cleaned = input
		.replace(INVALID_FILE_CHARS, " ")
		.replace(/\s+/g, " ")
		.trim();

	return cleaned || "Mindy ingest";
}

async function buildAvailablePath(app: App, baseName: string): Promise<string> {
	let suffix = 0;

	while (true) {
		const candidateName = suffix === 0 ? baseName : `${baseName} ${suffix}`;
		const candidatePath = normalizePath(`${candidateName}.md`);

		if (!app.vault.getAbstractFileByPath(candidatePath)) {
			return candidatePath;
		}

		suffix += 1;
	}
}

function pad(value: number): string {
	return value.toString().padStart(2, "0");
}
