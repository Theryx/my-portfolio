import './site.css';

// Three mobile flow nodes connect sequentially along a track and settle into
// a confirmation check badge. Full mode carries the .lg scope for route loading.
export default function Loader({ full = false }: { full?: boolean }) {
  return (
    <div className={`lg-loader${full ? ' lg lg-loader--full' : ''}`} role="status" aria-live="polite">
      <svg className="lg-loader__svg" viewBox="0 0 124 32" width="124" height="32" aria-hidden="true">
        <line className="lg-loader__track" x1="16" y1="16" x2="104" y2="16" />
        <line className="lg-loader__progress" x1="16" y1="16" x2="104" y2="16" />
        <circle className="lg-loader__node lg-loader__node--1" cx="16" cy="16" r="6" />
        <circle className="lg-loader__node lg-loader__node--2" cx="60" cy="16" r="6" />
        <circle className="lg-loader__node lg-loader__node--3" cx="104" cy="16" r="10" />
        <path className="lg-loader__check" d="M99.5 16.2l3 3 6-6" />
      </svg>
      {full && <span className="lg-loader__label">Ndouken Theryx</span>}
      <span className="sr-only">Loading</span>
    </div>
  );
}
