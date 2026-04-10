import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import { App, Modal } from "obsidian";
import { App as ReactApp } from "./app";

class ReactModal extends Modal {
	private root: Root | null = null;

	constructor(
		app: App,
		private readonly greeting: string,
	) {
		super(app);
	}

	onOpen() {
		this.titleEl.setText("React demo");
		this.root = createRoot(this.contentEl);
		this.root.render(<ReactApp greeting={this.greeting} />);
	}

	onClose() {
		this.root?.unmount();
		this.root = null;
		this.contentEl.empty();
	}
}

export function openReactModal(app: App, greeting: string) {
	new ReactModal(app, greeting).open();
}
