import { kindLabel, nodeTitle } from "../lib/flow";

export function NodeCard({ node, selected, onSelect }) {
  const handleKeyDown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onSelect();
  };

  return (
    <article
      className={`node-card ${node.type} ${selected ? "selected" : ""}`}
      style={{ left: node.position.x, top: node.position.y }}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
    >
      <div className="node-heading">
        <span className="node-kind">{kindLabel(node)}</span>
      </div>
      <h2>{nodeTitle(node)}</h2>
      <p>{node.text}</p>

      {node.options.length > 0 ? (
        <div className="options">
          {node.options.map((option, index) => (
            <span className="option-pill" key={index}>{option.label}</span>
          ))}
        </div>
      ) : (
        <div className="end-state">Conversation ends here</div>
      )}
    </article>
  );
}