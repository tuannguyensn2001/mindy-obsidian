import { App, PluginSettingTab, Setting } from "obsidian";
import MindyPlugin from "./main";

export interface MindyPluginSettings {
	mySetting: string;
}

export const DEFAULT_SETTINGS: MindyPluginSettings = {
	mySetting: "Hello from Mindy",
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
			.setName("Greeting text")
			.setDesc("Text shown inside the react demo modal.")
			.addText((text) =>
				text
					.setPlaceholder("Enter a greeting")
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					}),
			);
	}
}
