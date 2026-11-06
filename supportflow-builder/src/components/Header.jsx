export function Header({ issues, onPreview }) {
  const healthy = issues.length === 0;

  return (
    <header className="topbar">
      <strong>Customer Support flow</strong>
      <div className="top-actions">
        <button
          className={`ghost-button ${healthy ? "" : "warning"}`}
          title={issues.map((issue) => issue.message).join("\n")}
        >
          {healthy ? "Flow healthy" : `⚠ ${issues.length} issues`}
        </button>
        <button className="play-button" onClick={onPreview} aria-label="Preview flow">▷</button>
      </div>
    </header>
  );
}