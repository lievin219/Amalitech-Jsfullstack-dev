import { useEffect, useMemo, useState } from "react";
import { nodeTitle } from "../lib/flow";
import { runContract } from "../lib/contracts";

const storageKey = "supportflow-contract-tests";

function makeTest(nodes) {
  return {
    id: `${Date.now()}`,
    name: `New customer journey`,
    startId: nodes[0]?.id || "",
    answers: [],
    expectedEndId: "",
  };
}

export function ContractTests({ nodes, onSelect, onClose }) {
  const [tests, setTests] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey)) || []; }
    catch { return []; }
  });
  const [results, setResults] = useState({});
  const [activeId, setActiveId] = useState(null);

  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(tests)), [tests]);

  const byId = useMemo(() => Object.fromEntries(nodes.map((node) => [node.id, node])), [nodes]);
  const active = tests.find((test) => test.id === activeId);

  const update = (id, patch) => setTests((items) => items.map((item) => item.id === id ? { ...item, ...patch } : item));
  const addTest = () => {
    const test = makeTest(nodes);
    setTests((items) => [...items, test]);
    setActiveId(test.id);
  };
  const removeTest = (id) => {
    setTests((items) => items.filter((item) => item.id !== id));
    if (activeId === id) setActiveId(null);
  };
  const runTest = (test) => setResults((items) => ({ ...items, [test.id]: runContract(nodes, test) }));
  const runAll = () => {
    const next = {};
    tests.forEach((test) => { next[test.id] = runContract(nodes, test); });
    setResults(next);
  };
  const currentNode = active ? byId[active.answers.length ? active.startId : active.startId] : null;

  return (
    <div className="tests-overlay" role="presentation" onMouseDown={onClose}>
      <section className="tests-panel" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
        <header className="tests-header">
          <div><span className="tests-kicker">Behavior verification</span><h2>Contract tests</h2></div>
          <button className="tests-close" onClick={onClose} aria-label="Close contract tests">×</button>
        </header>
        <p className="tests-intro">Protect important customer journeys from breaking when the flow changes.</p>
        <div className="tests-toolbar">
          <span>{tests.length} saved {tests.length === 1 ? "journey" : "journeys"}</span>
          <div><button className="tests-run" onClick={runAll} disabled={!tests.length}>Run all</button><button className="tests-add" onClick={addTest}>+ New test</button></div>
        </div>
        <div className="tests-layout">
          <div className="tests-list">
            {tests.length === 0 && <p className="tests-empty">Create a journey to start protecting your flow.</p>}
            {tests.map((test) => {
              const result = results[test.id];
              return <button className={`test-item ${activeId === test.id ? "active" : ""}`} key={test.id} onClick={() => setActiveId(test.id)}>
                <span className={`test-status ${result ? (result.passed ? "pass" : "fail") : ""}`}>{result ? (result.passed ? "✓" : "!") : "○"}</span>
                <span><strong>{test.name}</strong><small>{test.answers.length} answer steps</small></span>
              </button>;
            })}
          </div>
          {active && (
            <div className="test-editor">
              <label>Journey name<input value={active.name} onChange={(event) => update(active.id, { name: event.target.value })} /></label>
              <label>Start node<select value={active.startId} onChange={(event) => update(active.id, { startId: event.target.value, answers: [] })}>{nodes.map((node) => <option key={node.id} value={node.id}>{nodeTitle(node)}</option>)}</select></label>
              <label>Expected final node<select value={active.expectedEndId} onChange={(event) => update(active.id, { expectedEndId: event.target.value })}><option value="">Any destination</option>{nodes.map((node) => <option key={node.id} value={node.id}>{nodeTitle(node)}</option>)}</select></label>
              <div className="test-steps"><span>Answer sequence</span>{active.answers.map((answer, index) => <div className="test-step" key={`${answer}-${index}`}><b>{index + 1}</b><input value={answer} onChange={(event) => update(active.id, { answers: active.answers.map((item, itemIndex) => itemIndex === index ? event.target.value : item) })} /><button onClick={() => update(active.id, { answers: active.answers.filter((_, itemIndex) => itemIndex !== index) })}>×</button></div>)}</div>
              <button className="step-add" onClick={() => update(active.id, { answers: [...active.answers, ""] })}>+ Add answer step</button>
              <div className="test-actions"><button className="tests-run" onClick={() => runTest(active)}>Run test</button><button className="test-delete" onClick={() => removeTest(active.id)}>Delete</button></div>
              {results[active.id] && <button className={`test-result ${results[active.id].passed ? "pass" : "fail"}`} onClick={() => onSelect(results[active.id].nodeId)}>{results[active.id].passed ? "✓ " : "! "}{results[active.id].message} <span>Focus node →</span></button>}
              <span className="test-hint">Use exact answer labels from the canvas. Tests are saved in this browser.</span>
              {currentNode && <span className="test-node-ref">Starting from: {nodeTitle(currentNode)}</span>}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
