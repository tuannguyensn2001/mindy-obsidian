import { Plugin } from "obsidian";
import { DEFAULT_SETTINGS, MindyPluginSettings, MindySettingTab } from "./settings";
import { openIngestModal } from "./ui/ingest-modal";
import { openMindyCommandPalette } from "./ui/command-palette";

export default class MindyPlugin extends Plugin {
	settings: MindyPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addRibbonIcon("sparkles", "Mindy", () => {
			this.openCommandPalette();
		});

		this.addCommand({
			id: "open-mindy-palette",
			name: "Open palette",
			callback: () => this.openCommandPalette(),
		});

		this.addCommand({
			id: "open-mindy-ingest",
			name: "Open ingest",
			callback: () => this.openIngestModal(),
		});

		this.addSettingTab(new MindySettingTab(this.app, this));
	}

	private openIngestModal() {
		openIngestModal(this.app, {
			settings: this.settings,
		});
	}

	private openCommandPalette() {
		openMindyCommandPalette(this.app, {
			openIngest: () => this.openIngestModal(),
		});
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<MindyPluginSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
