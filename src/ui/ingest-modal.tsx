import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import { App, Modal, Notice } from "obsidian";
import { MindyPluginSettings } from "../settings";
import { createIngestDraft } from "../services/ingest";
import { summarizeRawContent } from "../services/summarize";
import { IngestApp, IngestFormValues } from "./ingest-app";

type OpenIngestModalOptions = {
	settings: MindyPluginSettings;
};

class IngestModal extends Modal {
	private root: Root | null = null;
	private isSubmitting = false;
	private errorMessage: string | null = null;

	constructor(
		app: App,
		private readonly options: OpenIngestModalOptions,
	) {
		super(app);
	}

	onOpen() {
		this.titleEl.setText("Mindy ingest");
		this.contentEl.addClass("mindy-ingest-modal");
		this.root = createRoot(this.contentEl);
		this.render();
	}

	onClose() {
		this.root?.unmount();
		this.root = null;
		this.contentEl.removeClass("mindy-ingest-modal");
		this.contentEl.empty();
	}

	private render() {
		this.root?.render(
			<IngestApp
				errorMessage={this.errorMessage}
				isSubmitting={this.isSubmitting}
				onSubmit={(values) => {
					void this.handleSubmit(values);
				}}
			/>,
		);
	}

	private async handleSubmit(values: IngestFormValues) {
		const trimmedRawContent = values.rawContent.trim();
		if (!trimmedRawContent) {
			this.errorMessage = "Raw content is required.";
			this.render();
			return;
		}

		this.isSubmitting = true;
		this.errorMessage = null;
		this.render();

		try {
			const summary = await summarizeRawContent(this.options.settings, trimmedRawContent);
			const file = await createIngestDraft(this.app, {
				title: values.title,
				rawContent: trimmedRawContent,
				summary,
				sourceType: "raw-content",
				settings: this.options.settings,
			});

			new Notice(`Created ${file.basename}`);
			this.close();
		} catch (error) {
			const message = error instanceof Error ? error.message : "Failed to create the draft note.";
			this.errorMessage = message;
			this.isSubmitting = false;
			this.render();
		}
	}
}

export function openIngestModal(app: App, options: OpenIngestModalOptions) {
	new IngestModal(app, options).open();
}
