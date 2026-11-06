const updateNode = (flow, id, change) => ({
  ...flow,
  nodes: flow.nodes.map((node) => (node.id === id ? change(node) : node)),
});

const updateOptionAt = (options, index, patch) =>
  options.map((option, i) => (i === index ? { ...option, ...patch } : option));

export function flowReducer(flow, action) {
  switch (action.type) {
    case "loaded":
      return action.flow;
    case "node/added":
      return { ...flow, nodes: [...flow.nodes, action.node] };
    case "node/edited":
      return updateNode(flow, action.id, (node) => ({ ...node, ...action.patch }));
    case "option/added":
      return updateNode(flow, action.id, (node) => ({
        ...node,
        options: [...node.options, action.option],
      }));
    case "option/edited":
      return updateNode(flow, action.id, (node) => ({
        ...node,
        options: updateOptionAt(node.options, action.index, action.patch),
      }));
    case "option/removed":
      return updateNode(flow, action.id, (node) => ({
        ...node,
        options: node.options.filter((_, i) => i !== action.index),
      }));
    default:
      return flow;
  }
}