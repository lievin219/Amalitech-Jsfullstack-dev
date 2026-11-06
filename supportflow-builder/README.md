# SupportFlow Visual Builder

A React editor for designing, inspecting, and testing customer-support conversation flows.

## What it does

- Renders the supplied `flow_data.json` as an interactive canvas.
- Draws custom SVG connectors between positioned nodes.
- Supports canvas pan/zoom, node selection, and in-memory editing.
- Provides a customer-facing preview with answer traversal and restart.
- Validates missing destinations and unreachable nodes.

## Wildcard: Flow Contract Tests

Editors can save named customer journeys as behavioral contracts: a starting node, an exact answer sequence, and an expected destination. Contracts can be run individually or as a suite; failures identify the first broken step and focus the affected node.

This adds regression testing to conversation design. Support teams can change routing or copy with confidence, protect high-value journeys, and reduce manual QA before publishing. Tests are stored locally in the browser and require no backend.

## Tech and constraints

- React + Vite
- Plain CSS and custom React components
- SVG connection rendering implemented in-house
- No graph, flowchart, or component UI libraries

## Run locally

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run lint
npm run build
```

## Project structure

```text
src/
  components/  Canvas, editor panels, preview, and contract tests
  hooks/       Flow loading and canvas interaction
  lib/         Flow calculations, reducer, and contract execution
public/
  flow_data.json
```

## Links

- Live demo: (https://amalitech-jsfullstack-dev.vercel.app/)
- Design system:https://www.figma.com/design/dNgWNDv62djeoPMlvNXoLg/Customer-Support-flow-system?node-id=0-1&t=K5GKDrFUJNLwtdra-1
