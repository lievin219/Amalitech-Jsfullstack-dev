# SupportFlow Builder

SupportFlow Builder is a visual editor for designing customer-support conversations. Teams can map questions, answers, and resolution messages on a canvas, then preview the customer experience before publishing.

## Editor capabilities

- Visual canvas with zoom and pan controls
- Layer list for fast node navigation
- Node inspector for editing questions, answers, and destinations
- Customer-facing preview mode
- Reachability checks for missing and unreachable paths
- **Flow Contract Tests** for protecting important customer journeys

## Wildcard feature: Flow Contract Tests

Flow Contract Tests let an editor save a named customer journey as a small behavioral contract: a starting node, an exact answer sequence, and an expected destination. Tests can be run individually or as a suite. A failing test reports the first broken step and focuses the affected node in the editor.

This brings regression testing to conversation design. It helps support teams change wording or routing safely, reduces manual QA before publishing, and protects high-value journeys such as billing, refunds, and account recovery. Tests are stored in the browser so content owners can build a reusable quality checklist without a backend.

## Run locally

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Production validation:

```bash
npm run lint
npm run build
```

## Technology

- React
- Vite
- Plain CSS
- Provided `public/flow_data.json` data source

No component framework or restricted UI library is used.

## Project structure

```text
src/
  components/   Editor UI, canvas, preview, and Contract Tests
  hooks/        Flow loading and canvas interaction hooks
  lib/          Flow calculations, contracts, and reducer
public/         Seed flow data
```

## Design

Design file: add the public Figma or Penpot link here before submission.
