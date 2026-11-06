import { nodeTitle } from "../lib/flow";

export function Inspector({ nodes, node, dispatch }) {
  if (!node) return null;

  const editNode = (patch) => dispatch({ type: "node/edited", id: node.id, patch });
  const editOption = (index, patch) =>
    dispatch({ type: "option/edited", id: node.id, index, patch });
  const removeOption = (index) => dispatch({ type: "option/removed", id: node.id, index });
  const addOption = () => {
    const fallback = nodes.find((other) => other.id !== node.id);
    dispatch({
      type: "option/added",
      id: node.id,
      option: { label: "New answer", nextId: fallback?.id },
    });
  };

  const destinations = nodes.filter((other) => other.id !== node.id);
  const isEnd = node.type === "end";

  return (
    <aside className="inspector">
      <div className="inspector-section">
        <label>
          Node name
          <input value={nodeTitle(node)} onChange={(e) => editNode({ customTitle: e.target.value })} />
        </label>
        <label>
          {isEnd ? "Ending message" : "Question text"}
          <textarea rows="5" value={node.text} onChange={(e) => editNode({ text: e.target.value })} />
        </label>

        {isEnd ? (
          <div className="inspector-note">
            This is an end node. Add a path if the conversation should continue.
          </div>
        ) : (
          <>
            <div className="answer-header">
              <label>Answers</label>
              <button className="link-button" onClick={addOption}>+ Add</button>
            </div>
            <div className="answer-list">
              {node.options.map((option, index) => (
                <div className="answer-row" key={`${node.id}-${index}`}>
                  <input value={option.label} onChange={(e) => editOption(index, { label: e.target.value })} />
                  <select value={option.nextId} onChange={(e) => editOption(index, { nextId: e.target.value })}>
                    {destinations.map((other) => (
                      <option key={other.id} value={other.id}>{nodeTitle(other)}</option>
                    ))}
                  </select>
                  <button className="remove" onClick={() => removeOption(index)} aria-label="Remove answer">×</button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}