import { useEffect, useMemo, useState } from "react";
import { findStart, indexById } from "../lib/flow";

export function Preview({ nodes, onClose }) {
  const byId = useMemo(() => indexById(nodes), [nodes]);
  const [currentId, setCurrentId] = useState(() => findStart(nodes)?.id);
  const node = byId[currentId];
  const isFinished = !node || node.options.length === 0;

  useEffect(() => {
    const closeOnEscape = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className="modal">
      <section className="chat-window">
        <button className="close" onClick={onClose} aria-label="Close preview">×</button>
        <div className="chat-header">
          <span className="brand-mark">S</span>
          <b>SupportFlow</b>
        </div>

        <div className="chat-body">
          <div className="chat-message">
            {node ? node.text : "This answer leads to a node that no longer exists."}
          </div>
          {node?.options.map((option, index) => (
            <button className="chat-option" key={index} onClick={() => setCurrentId(option.nextId)}>
              {option.label}
            </button>
          ))}
        </div>

        {isFinished && (
          <button className="restart" onClick={() => setCurrentId(findStart(nodes)?.id)}>
            Start over
          </button>
        )}
      </section>
    </div>
  );
}