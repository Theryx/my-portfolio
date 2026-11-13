import './site.css';

// Signal bars filling one by one: no signal, then full. The full version
// stands alone (it shows before the shell loads), so it carries the .dl scope.
export default function Loader({ full = false }: { full?: boolean }) {
  return (
    <div className={`dl-loader${full ? ' dl dl-loader--full' : ''}`} role="status" aria-live="polite">
      <div className="dl-loader__bars" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="dl-loader__bar" style={{ ['--i' as string]: i }} />
        ))}
      </div>
      {full && <span className="dl-loader__label">Ndouken Theryx</span>}
      <span className="sr-only">Loading</span>
    </div>
  );
}
