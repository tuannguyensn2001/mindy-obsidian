import { App, FuzzyMatch, FuzzySuggestModal, setIcon } from "obsidian";

type MindyCommand = {
	id: string;
	title: string;
	description: string;
	icon: string;
	run: () => void;
};

type OpenMindyCommandPaletteOptions = {
	openIngest: () => void;
};

class MindyCommandPalette extends FuzzySuggestModal<MindyCommand> {
	private readonly commands: MindyCommand[];

	constructor(app: App, options: OpenMindyCommandPaletteOptions) {
		super(app);
		this.commands = [
			{
				id: "ingest",
				title: "Ingest",
				description: "Paste raw content and create a draft note.",
				icon: "plus-circle",
				run: options.openIngest,
			},
		];
		this.setPlaceholder("Mindy commands");
		this.setInstructions([
			{ command: "↑↓", purpose: "Navigate" },
			{ command: "↵", purpose: "Run command" },
			{ command: "esc", purpose: "Close" },
		]);
	}

	getItems(): MindyCommand[] {
		return this.commands;
	}

	getItemText(command: MindyCommand): string {
		return `${command.title} ${command.description}`;
	}

	renderSuggestion(match: FuzzyMatch<MindyCommand>, el: HTMLElement) {
		const { item: command } = match;
		el.addClass("mindy-command-palette__item");

		const iconEl = el.createDiv({ cls: "mindy-command-palette__icon" });
		setIcon(iconEl, command.icon);

		const contentEl = el.createDiv({ cls: "mindy-command-palette__content" });
		contentEl.createDiv({ cls: "mindy-command-palette__title", text: command.title });
		contentEl.createDiv({ cls: "mindy-command-palette__description", text: command.description });
	}

	onChooseItem(command: MindyCommand) {
		command.run();
	}
}

export function openMindyCommandPalette(app: App, options: OpenMindyCommandPaletteOptions) {
	new MindyCommandPalette(app, options).open();
}
