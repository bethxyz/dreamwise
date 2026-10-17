# Dreamwise

A premium, private dream reflection website with a gently animated night sky, an illustrated celestial chart, and personalised readings. Built with React, TypeScript, and Vite. Fonts are bundled locally; the application makes no external API calls.

## Development

Requires Node.js 22.12 or newer. The cloud workspace provides Node.js 24.

```sh
cd /workspace/dreamwise
npm ci --cache /workspace/.cache/npm
npm run dev
```

The development server listens on port 3000 and all interfaces. Use the existing checkout; cloud tasks are already isolated and do not need another Git worktree.

```sh
npm test         # 11 interpretation engine tests
npm run build   # TypeScript checks and production bundle
npm run preview # Serve the production bundle
```

## Features

- Dream entry, age range, dream/nightmare/lucid type, and separate waking and dream moods.
- Age preference remembered in browser local storage.
- An animated report with an overview, recognised symbols, an emotional illustration, reflection prompts, and an affirmation.
- Save, revisit, and delete readings in a local dream journal, or download a plain-text copy.
- Responsive layouts, native keyboard controls, accessible validation, and reduced-motion support.

## How readings work

`src/lib/interpret.ts` generates deterministic symbolic reflections from the dream text, selected feelings, dream type, and life stage. Motifs match complete words. If there are no recognised motifs, the report offers reflection without inventing symbols. Emotion bars illustrate themes rather than psychological measurements.

This version uses a curated local interpretation engine, not a remote language model. No API keys, backend, database, or account are required. For open-ended AI interpretation, add a server-side model integration; credentials must stay on the server.

## Data

The app automatically stores only the age range (`dreamwise-age`). Dream text and readings are stored under `dreamwise-journal` only when the user explicitly saves a report. The journal holds up to 30 readings and remains on the current browser/device. Browser storage can be cleared, so downloaded readings are useful backups. Malformed stored entries are ignored.

## Layout

- `src/App.tsx`: form, report, local journal, and download interactions.
- `src/lib/interpret.ts`: symbolic interpretation engine.
- `src/components/Celestial.tsx`: animated starfield and moon artwork.
- `src/styles.css`: responsive presentation and reduced-motion/print styles.
