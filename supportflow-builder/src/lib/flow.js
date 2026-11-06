export const NODE_WIDTH = 280;
export const NODE_HEIGHT = 138;

const DEFAULT_TITLES = { start: "Welcome", end: "Ending message" };
const KIND_LABELS = { start: "START", question: "QUESTION", end: "END MESSAGE" };

export const kindLabel = (node) => KIND_LABELS[node.type];

export const nodeTitle = (node) =>
  node.customTitle || DEFAULT_TITLES[node.type] || `Question ${node.id}`;

export const indexById = (nodes) =>
  Object.fromEntries(nodes.map((node) => [node.id, node]));

export const findStart = (nodes) => nodes.find((node) => node.type === "start");

export const nextNodeId = (nodes) =>
  String(Math.max(0, ...nodes.map((node) => Number(node.id))) + 1);

export const createNode = (id) => ({
  id,
  type: "question",
  text: "What should we ask next?",
  position: { x: 460, y: 650 },
  options: [],
});

/** Depth-first walk from the start node. Returns the ids a customer can reach. */
export function getReachableIds(nodes) {
  const byId = indexById(nodes);
  const seen = new Set();
  const stack = [findStart(nodes)?.id];

  while (stack.length) {
    const id = stack.pop();
    const node = byId[id];
    if (!node || seen.has(id)) continue;
    seen.add(id);
    node.options.forEach((option) => stack.push(option.nextId));
  }
  return seen;
}

export function getFlowIssues(nodes) {
  const byId = indexById(nodes);
  const reachable = getReachableIds(nodes);
  const issues = [];

  for (const node of nodes) {
    if (!reachable.has(node.id)) {
      issues.push({ nodeId: node.id, message: `${nodeTitle(node)} is unreachable` });
    }
    for (const option of node.options) {
      if (!byId[option.nextId]) {
        issues.push({ nodeId: node.id, message: `${nodeTitle(node)} has a missing destination` });
      }
    }
  }
  return issues;
}

/** One edge per answer whose destination exists. */
export function getEdges(nodes) {
  const byId = indexById(nodes);
  return nodes.flatMap((from) =>
    from.options.flatMap((option, index) => {
      const to = byId[option.nextId];
      return to ? [{ key: `${from.id}:${index}`, from, to }] : [];
    })
  );
}

/** Cubic Bézier from the parent's bottom-center to the child's top-center. */
export function connectorPath(from, to) {
  const start = { x: from.position.x + NODE_WIDTH / 2, y: from.position.y + NODE_HEIGHT };
  const end = { x: to.position.x + NODE_WIDTH / 2, y: to.position.y };
  const bend = Math.max(50, Math.abs(end.y - start.y) * 0.45);

  return `M${start.x} ${start.y} C${start.x} ${start.y + bend}, ${end.x} ${end.y - bend}, ${end.x} ${end.y}`;
}
