import { useMemo, useState } from "react";
import { useFlow } from "./hooks/useflow";
import { createNode, findStart, getFlowIssues, nextNodeId } from "./lib/flow";
import { FlowCanvas } from "./components/FlowCanvas";
import { Header } from "./components/Header";
import { Inspector } from "./components/Inspector";
import { Preview } from "./components/Preview";
import { Sidebar } from "./components/Sidebar";

export default function App() {
  const { flow, dispatch, error } = useFlow();
  const [pickedId, setPickedId] = useState(null);
  const [previewing, setPreviewing] = useState(false);

  const issues = useMemo(() => (flow ? getFlowIssues(flow.nodes) : []), [flow]);

  if (error) return <main className="load-error"><h1>Flow unavailable</h1><p>{error}</p></main>;
  if (!flow) return <main className="loading">Loading your flow…</main>;

  const selectedId = pickedId ?? findStart(flow.nodes)?.id;
  const selectedNode = flow.nodes.find((node) => node.id === selectedId);

  const addNode = () => {
    const id = nextNodeId(flow.nodes);
    dispatch({ type: "node/added", node: createNode(id) });
    setPickedId(id);
  };

  return (
    <main className="app">
      <Header issues={issues} onPreview={() => setPreviewing(true)} />
      <div className="body">
        <Sidebar nodes={flow.nodes} selectedId={selectedId} onSelect={setPickedId} onAdd={addNode} />
        <FlowCanvas flow={flow} selectedId={selectedId} onSelect={setPickedId} />
        <Inspector nodes={flow.nodes} node={selectedNode} dispatch={dispatch} />
      </div>
      {previewing && <Preview nodes={flow.nodes} onClose={() => setPreviewing(false)} />}
    </main>
  );
}