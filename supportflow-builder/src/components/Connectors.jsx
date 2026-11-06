import { connectorPath, getEdges } from "../lib/flow";

export function Connectors({ nodes, width, height }) {
  return (
    <svg className="connections" viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      {getEdges(nodes).map(({ key, from, to }) => (
        <path key={key} d={connectorPath(from, to)} />
      ))}
    </svg>
  );
}