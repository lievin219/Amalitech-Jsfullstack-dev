import { useState } from "react";
import { usePan } from "../hooks/usepan.js";
import { Connectors } from "./Connectors";
import { NodeCard } from "./NodeCard";

const MIN_ZOOM = 0.6;
const MAX_ZOOM = 1.35;
const DEFAULT_ZOOM = 0.82;
const ZOOM_STEP = 0.1;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function FlowCanvas({ flow, selectedId, onSelect }) {
  const { pan, setPan, handlers } = usePan();
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const { w, h } = flow.meta.canvas_size;

  const zoomBy = (delta) => setZoom((z) => clamp(z + delta, MIN_ZOOM, MAX_ZOOM));
  const fit = () => {
    setPan({ x: 0, y: 0 });
    setZoom(DEFAULT_ZOOM);
  };

  return (
    <section className="workspace">
      <div className="canvas-viewport" {...handlers}>
        <div
          className="canvas"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
        >
          <Connectors nodes={flow.nodes} width={w} height={h} />
          <div className="cards">
            {flow.nodes.map((node) => (
              <NodeCard
                key={node.id}
                node={node}
                selected={node.id === selectedId}
                onSelect={() => onSelect(node.id)}
              />
            ))}
          </div>
        </div>

        <div className="bottom-toolbar">
          <button onClick={fit}>Fit</button>
          <button onClick={() => zoomBy(-ZOOM_STEP)} aria-label="Zoom out">−</button>
          <span>{Math.round(zoom * 100)}%</span>
          <button onClick={() => zoomBy(ZOOM_STEP)} aria-label="Zoom in">＋</button>
        </div>
      </div>
    </section>
  );
}