// Fixed vertical rules. They sit under everything and line up with the `.cols` grid,
// the preloader curtain and the WebGL slice pass.
export function GridLines() {
  return (
    <div aria-hidden className="frame pointer-events-none fixed inset-0 z-0">
      <div className="cols h-full border-r border-line">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className={`border-l border-line ${i >= 4 ? "hidden md:block" : ""}`} />
        ))}
      </div>
    </div>
  );
}
