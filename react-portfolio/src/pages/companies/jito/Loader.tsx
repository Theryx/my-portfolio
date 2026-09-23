export default function Loader({ full = false }: { full?: boolean }) {
  return (
    <div className={`jn-loader${full ? ' jn-loader--full' : ''}`} role="status" aria-live="polite">
      <svg className="jn-loader__mark" viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="19" />
      </svg>
      <span className="jn-loader__word">Ndouken Theryx</span>
      <span className="sr-only">Loading</span>
    </div>
  );
}
