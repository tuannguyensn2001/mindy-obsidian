# Mindy

Mindy is an Obsidian plugin for capturing source material and turning it into draft notes inside your vault. The current release focuses on a local-first ingest flow: paste raw content, create a draft note, and continue editing from there.

## Features

- Open a dedicated Mindy command palette from the ribbon or Command palette.
- Paste raw text from articles, transcripts, meeting notes, or research dumps.
- Create a new draft note with a generated title when you do not provide one.
- Keep all content inside the current vault with no required external service.

## How to use

1. Open the Command palette and run `Mindy: Open ingest`, or click the Mindy ribbon icon.
2. Optionally enter a note title.
3. Paste the source material into the raw content field.
4. Select **Create draft note**.

The plugin creates a new note in the vault root with:

- a top-level title
- a placeholder summary section
- source metadata
- the original raw content

## Settings

Mindy currently supports one setting:

- `Default title prefix`: used when a draft note is created without a custom title.

## Privacy and data handling

- Mindy is local-first. It creates notes only inside the current Obsidian vault.
- This version does not send data to external APIs or services.
- This version does not include analytics or telemetry.

## Development

- Node.js 18 or newer is recommended.
- Install dependencies with `npm install`.
- Start watch mode with `npm run dev`.
- Build a production bundle with `npm run build`.
- Run static checks with `npm run lint`.

## Release checklist

Before creating a GitHub release for Obsidian submission:

1. Confirm `manifest.json`, `versions.json`, `README.md`, and `LICENSE` are present at the repository root.
2. Update `manifest.json` to the release version in `x.y.z` format.
3. Update `versions.json` if `minAppVersion` changes.
4. Run `npm run build`.
5. Create a GitHub release whose tag exactly matches the plugin version, without a `v` prefix.
6. Upload `main.js`, `manifest.json`, and `styles.css` to the release as assets.
7. Submit the plugin to `obsidianmd/obsidian-releases` by adding a new entry to `community-plugins.json`.

## Manual installation

Copy `main.js`, `manifest.json`, and `styles.css` into:

```text
<vault>/.obsidian/plugins/mindy-obsidian/
```

Then reload Obsidian and enable the plugin in **Settings → Community plugins**.
