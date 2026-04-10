import { App, PluginSettingTab, Setting } from "obsidian";
import MindyPlugin from "./main";

export interface MindyPluginSettings {
	defaultTitlePrefix: string;
	language: string;
	openRouterApiKey: string;
	openRouterModel: string;
}

export const DEFAULT_SETTINGS: MindyPluginSettings = {
	defaultTitlePrefix: "Mindy ingest",
	language: "English",
	openRouterApiKey: "",
	openRouterModel: "openai/gpt-4.1-mini",
};

const LANGUAGE_OPTIONS: Record<string, string> = {
	English: "English",
	Vietnamese: "Vietnamese",
	"Chinese (Simplified)": "Chinese (Simplified)",
	Japanese: "Japanese",
	Korean: "Korean",
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

		new Setting(containerEl)
			.setName("Language")
			.setDesc("Used in the rewrite prompt so Mindy writes the generated title and note in the selected language.")
			.addDropdown((dropdown) => {
				for (const [value, label] of Object.entries(LANGUAGE_OPTIONS)) {
					dropdown.addOption(value, label);
				}

				dropdown
					.setValue(this.plugin.settings.language)
					.onChange(async (value) => {
						this.plugin.settings.language = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("OpenRouter API key")
			.setDesc("Used for the skill-based rewrite step before Mindy creates the draft note.")
			.addText((text) => {
				text
					.setPlaceholder("sk-or-v1-...")
					.setValue(this.plugin.settings.openRouterApiKey)
					.onChange(async (value) => {
						this.plugin.settings.openRouterApiKey = value.trim();
						await this.plugin.saveSettings();
					});

				text.inputEl.type = "password";
			});

		new Setting(containerEl)
			.setName("OpenRouter model")
			.setDesc("Model ID sent to OpenRouter, for example `openai/gpt-4.1-mini`.")
			.addText((text) =>
				text
					.setPlaceholder("openai/gpt-4.1-mini")
					.setValue(this.plugin.settings.openRouterModel)
					.onChange(async (value) => {
						this.plugin.settings.openRouterModel = value.trim() || DEFAULT_SETTINGS.openRouterModel;
						await this.plugin.saveSettings();
					}),
			);
	}
}
