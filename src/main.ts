import { Menu, Plugin } from "obsidian";
import { DEFAULT_SETTINGS, MindyPluginSettings, MindySettingTab } from "./settings";
import { openIngestModal } from "./ui/ingest-modal";

export default class MindyPlugin extends Plugin {
	settings: MindyPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addRibbonIcon("sparkles", "Mindy", (event: MouseEvent) => {
			const menu = new Menu();
			menu.addItem((item) =>
				item
					.setTitle("Ingest")
					.setIcon("plus-circle")
					.onClick(() => this.openIngestModal()),
			);
			menu.showAtMouseEvent(event);
		});

		this.addCommand({
			id: "open-mindy-ingest",
			name: "Open Mindy ingest",
			callback: () => this.openIngestModal(),
		});

		this.addSettingTab(new MindySettingTab(this.app, this));
	}

	private openIngestModal() {
		openIngestModal(this.app, { settings: this.settings });
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<MindyPluginSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
