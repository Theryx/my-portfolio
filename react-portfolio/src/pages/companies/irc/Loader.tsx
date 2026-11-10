import './site.css';

// A pen stroke drawing a ruled line. The full version stands alone (it shows
// before the shell loads), so it carries the .cn scope for its colours.
export default function Loader({ full = false }: { full?: boolean }) {
  return (
    <div className={`cn-loader${full ? ' cn cn-loader--full' : ''}`} role="status" aria-live="polite">
      <svg className="cn-loader__stroke" viewBox="0 0 240 12" aria-hidden="true">
        <path d="M2 7 C 40 4, 80 9, 120 6 S 200 4, 238 7" />
      </svg>
      {full && <span className="cn-loader__page">p. 01</span>}
      <span className="sr-only">Loading</span>
    </div>
  );
}
