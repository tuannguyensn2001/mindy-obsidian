import { App, PluginSettingTab, Setting } from "obsidian";
import MindyPlugin from "./main";

export interface MindyPluginSettings {
	defaultTitlePrefix: string;
}

export const DEFAULT_SETTINGS: MindyPluginSettings = {
	defaultTitlePrefix: "Mindy ingest",
};

export class MindySettingTab extends PluginSettingTab {
	plugin: MindyPlugin;

	constructor(app: App, plugin: MindyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Default title prefix")
			.setDesc("Used when Mindy creates a draft note without a custom title.")
			.addText((text) =>
				text
					.setPlaceholder("Mindy ingest")
					.setValue(this.plugin.settings.defaultTitlePrefix)
					.onChange(async (value) => {
						this.plugin.settings.defaultTitlePrefix = value.trim() || DEFAULT_SETTINGS.defaultTitlePrefix;
						await this.plugin.saveSettings();
					}),
			);
	}
}
