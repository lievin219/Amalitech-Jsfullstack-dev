export function runContract(nodes, test) {
  const byId = Object.fromEntries(nodes.map((node) => [node.id, node]));
  const start = byId[test.startId];
  if (!start) return { passed: false, message: "Starting node no longer exists.", nodeId: test.startId };

  let node = start;
  for (let index = 0; index < test.answers.length; index += 1) {
    const expected = test.answers[index];
    const option = node.options.find((item) => item.label === expected);
    if (!option) {
      return {
        passed: false,
        message: `Answer "${expected}" is not available here.`,
        nodeId: node.id,
        step: index + 1,
      };
    }
    node = byId[option.nextId];
    if (!node) return { passed: false, message: "This answer points to a missing node.", nodeId: test.startId };
  }

  if (test.expectedEndId && node.id !== test.expectedEndId) {
    return {
      passed: false,
      message: `Expected to end at ${byId[test.expectedEndId]?.customTitle || "another node"}.`,
      nodeId: node.id,
    };
  }
  return { passed: true, message: "Journey completed as expected.", nodeId: node.id };
}
