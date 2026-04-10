import * as React from "react";

export type IngestFormValues = {
	title: string;
	rawContent: string;
};

type IngestAppProps = {
	errorMessage: string | null;
	isSubmitting: boolean;
	onSubmit: (values: IngestFormValues) => void;
};

const SOURCE_TABS = [
	{ id: "raw-content", label: "Raw content", enabled: true },
	{ id: "web", label: "Web", enabled: false },
	{ id: "docs", label: "Docs", enabled: false },
] as const;

export function IngestApp({ errorMessage, isSubmitting, onSubmit }: IngestAppProps) {
	const [title, setTitle] = React.useState("");
	const [rawContent, setRawContent] = React.useState("");

	const canSubmit = rawContent.trim().length > 0 && !isSubmitting;

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!canSubmit) {
			return;
		}

		onSubmit({ title, rawContent });
	};

	return (
		<div className="mindy-ingest">
			<div className="mindy-ingest__hero">
				<p className="mindy-ingest__eyebrow">Ingest pipeline</p>
				<h2 className="mindy-ingest__title">Capture source material for Mindy</h2>
				<p className="mindy-ingest__body">
					Ingest source text, send it through the summarize flow, then save both the summary
					and original content into a draft note in your vault.
				</p>
			</div>

			<div className="mindy-ingest__tabs" role="tablist" aria-label="Ingest source tabs">
				{SOURCE_TABS.map((tab) => (
					<button
						key={tab.id}
						type="button"
						role="tab"
						className={`mindy-ingest__tab${tab.enabled ? " is-active" : ""}`}
						aria-selected={tab.enabled}
						aria-disabled={!tab.enabled}
						disabled={!tab.enabled}
					>
						{tab.label}
						{!tab.enabled ? <span className="mindy-ingest__tab-badge">Soon</span> : null}
					</button>
				))}
			</div>

			<form className="mindy-ingest__form" onSubmit={handleSubmit}>
				<label className="mindy-ingest__field">
					<span className="mindy-ingest__label">Note title</span>
					<input
						className="mindy-ingest__input"
						type="text"
						placeholder="Optional. Mindy will generate one if left blank."
						value={title}
						onChange={(event) => setTitle(event.target.value)}
					/>
				</label>

				<label className="mindy-ingest__field">
					<span className="mindy-ingest__label">Raw content</span>
					<textarea
						className="mindy-ingest__textarea"
						placeholder="Paste article notes, transcripts, meeting dumps, or any source text here."
						value={rawContent}
						onChange={(event) => setRawContent(event.target.value)}
					/>
				</label>

				{errorMessage ? <p className="mindy-ingest__error">{errorMessage}</p> : null}

				<div className="mindy-ingest__actions">
					<button className="mod-cta" type="submit" disabled={!canSubmit}>
						{isSubmitting ? "Summarizing and creating draft..." : "Create summarized draft"}
					</button>
				</div>
			</form>
		</div>
	);
}
