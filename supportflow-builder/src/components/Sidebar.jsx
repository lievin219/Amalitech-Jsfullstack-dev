import { nodeTitle } from "../lib/flow";

export function Sidebar({ nodes, selectedId, onSelect, onAdd }) {
  return (
    <aside className="leftbar">
      <div className="layers-title">Layers</div>
      <div className="layer-list">
        {nodes.map((node) => (
          <button
            key={node.id}
            className={`layer-item ${node.id === selectedId ? "selected" : ""}`}
            onClick={() => onSelect(node.id)}
          >
            <span className={`node-type-dot ${node.type}`} />
            {nodeTitle(node)}
          </button>
        ))}
      </div>
      <button className="add-layer" onClick={onAdd}>＋ Add node</button>
    </aside>
  );
}