import { Plugin } from "obsidian";
import { DEFAULT_SETTINGS, MindyPluginSettings, MindySettingTab } from "./settings";
import { openReactModal } from "./ui/react-modal";

export default class MindyPlugin extends Plugin {
	settings: MindyPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: "open-react-demo",
			name: "Open react demo modal",
			callback: () => {
				openReactModal(this.app, this.settings.mySetting);
			},
		});

		this.addSettingTab(new MindySettingTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<MindyPluginSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
